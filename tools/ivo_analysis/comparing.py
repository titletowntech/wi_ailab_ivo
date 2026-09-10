"""Recovering an existing integration's mapping from paired exports.

Port of tools/data-comparer.js. Given an ERP export and an IVO export of the same
records it finds the join key, compares every source/destination column pair on
joined rows, and reports the least transformation that explains the agreement.

The guardrails are the point of the tool and are carried over exactly:
low-cardinality agreement is evidence of nothing and is reported separately;
agreement is always published next to the row count behind it; and rows where
one side is empty are excluded from agreement and counted on their own, so a
field agreeing on 40 rows cannot look complete.

The Node version dictionary-encodes each column into Int32Arrays so a comparison
is integer equality rather than string equality. That design is kept -- it is the
right one -- but the per-pair loop becomes numpy indexing, which matters because
the work is O(source columns x destination columns x joined rows).
"""

from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Any

import numpy as np
import polars as pl

from .profiling import ColumnProfile, profile_column

DEFAULTS = {
    "minAgreement": 0.9,  # share of compared rows that must agree
    "minRows": 30,        # compared rows required before agreement means anything
    "minDistinct": 5,     # distinct agreeing values -- guards against constant "matches"
    "minJoin": 0.5,       # share of destination rows the join key must reach
}

MIN_KEY_DISTINCT = 20
LOOKUP_MAX_CARDINALITY = 0.5

_NUMBER = re.compile(r"^[-+]?(?:\d+\.?\d*|\.\d+)$")
_ISO_DATE = re.compile(r"^(\d{4})-(\d{2})-(\d{2})")
_US_DATE = re.compile(r"^(\d{1,2})/(\d{1,2})/(\d{2,4})$")
_WS = re.compile(r"\s+")


def canon_number(value: str) -> str | None:
    if not _NUMBER.match(value):
        return None
    try:
        n = float(value)
    except ValueError:
        return None
    if not np.isfinite(n):
        return None
    # Mirror JS String(Number(v)): integral values render without a trailing ".0".
    return str(int(n)) if n == int(n) and abs(n) < 1e21 else repr(n)


def canon_date(value: str) -> str | None:
    m = _ISO_DATE.match(value)
    if m:
        return f"{m.group(1)}-{m.group(2)}-{m.group(3)}"
    m = _US_DATE.match(value)
    if m:
        year = m.group(3)
        if len(year) == 2:
            year = ("19" if int(year) >= 70 else "20") + year
        return f"{year}-{m.group(1).zfill(2)}-{m.group(2).zfill(2)}"
    return None


def canon_loose(text: str) -> str:
    """Collapse formatting choices so "0001"/"1" and "Y"/"true" meet."""
    upper = text.upper()
    if upper in ("Y", "YES", "TRUE"):
        return "1"
    if upper in ("N", "NO", "FALSE"):
        return "0"
    n = canon_number(text)
    if n is not None:
        return n
    d = canon_date(text)
    if d is not None:
        return d
    return _WS.sub(" ", upper)


class Encoder:
    """One dictionary per normalisation level, shared across both files."""

    def __init__(self) -> None:
        self.map: dict[str, int] = {}
        self.vals: list[str] = []

    def code(self, value: str) -> int:
        found = self.map.get(value)
        if found is None:
            found = len(self.vals)
            self.vals.append(value)
            self.map[value] = found
        return found


@dataclass
class EncodedColumn:
    name: str
    idx: int
    stat: ColumnProfile
    raw: np.ndarray
    trim: np.ndarray
    upper: np.ndarray
    loose: np.ndarray
    all_upper: bool
    all_lower: bool


def encode_columns(headers: list[str], frame: pl.DataFrame, enc: dict[str, Encoder]) -> list[EncodedColumn]:
    columns: list[EncodedColumn] = []
    for idx, name in enumerate(headers):
        series = frame.to_series(idx)
        values = ["" if v is None else v for v in series.to_list()]
        stat = profile_column(name, series)
        n = len(values)
        raw = np.full(n, -1, dtype=np.int32)
        trim = np.full(n, -1, dtype=np.int32)
        upper = np.full(n, -1, dtype=np.int32)
        loose = np.full(n, -1, dtype=np.int32)
        has_lower = False
        has_upper = False

        for i, value in enumerate(values):
            t = value.strip()
            if t == "":
                continue
            u = t.upper()
            if t != u:
                has_lower = True
            if t != t.lower():
                has_upper = True
            raw[i] = enc["raw"].code(value)
            trim[i] = enc["trim"].code(t)
            upper[i] = enc["upper"].code(u)
            loose[i] = enc["loose"].code(canon_loose(t))

        columns.append(
            EncodedColumn(name, idx, stat, raw, trim, upper, loose, not has_lower, not has_upper)
        )
    return columns


def carries_information(column: EncodedColumn) -> bool:
    return column.stat.populated > 0 and not column.stat.is_constant


def _locale_cmp_key(name: str):
    return [(ch.lower(), ch.isupper()) for ch in name]


def rank_join_keys(
    src_cols: list[EncodedColumn], dest_cols: list[EncodedColumn], src_rows: int, dest_rows: int
) -> list[dict]:
    src_keys = [
        c for c in src_cols
        if src_rows and c.stat.populated / src_rows >= 0.9
        and c.stat.distinct >= MIN_KEY_DISTINCT
        and c.stat.populated and c.stat.distinct / c.stat.populated >= 0.98
    ]
    dest_keys = [
        c for c in dest_cols
        if dest_rows and c.stat.populated / dest_rows >= 0.5 and c.stat.distinct >= MIN_KEY_DISTINCT
    ]

    results: list[dict] = []
    for s in src_keys:
        index: dict[int, int] = {}
        duplicates = 0
        for i in range(src_rows):
            code = int(s.upper[i])
            if code < 0:
                continue
            if code in index:
                duplicates += 1
            else:
                index[code] = i
        for d in dest_keys:
            codes = d.upper[:dest_rows]
            matched = int(sum(1 for c in codes.tolist() if c >= 0 and c in index))
            results.append({
                "source": s, "dest": d, "matched": matched,
                "rate": matched / dest_rows if dest_rows else 0.0,
                "duplicates": duplicates,
            })

    results.sort(key=lambda r: (-r["matched"], _locale_cmp_key(r["source"].name)))
    return results


def build_join(key: dict, src_rows: int, dest_rows: int) -> tuple[np.ndarray, np.ndarray]:
    index: dict[int, int] = {}
    for i in range(src_rows):
        code = int(key["source"].upper[i])
        if code >= 0 and code not in index:
            index[code] = i
    src_idx: list[int] = []
    dest_idx: list[int] = []
    for i in range(dest_rows):
        code = int(key["dest"].upper[i])
        if code < 0:
            continue
        si = index.get(code)
        if si is not None:
            src_idx.append(si)
            dest_idx.append(i)
    return np.array(src_idx, dtype=np.int64), np.array(dest_idx, dtype=np.int64)


def compare(
    d: EncodedColumn, s: EncodedColumn, si: np.ndarray, di: np.ndarray, upper_vals: list[str]
) -> dict:
    # Truncation is only plausible when the destination is the narrower field.
    check_prefix = d.stat.max_len > 0 and d.stat.max_len < s.stat.max_len

    dl, sl = d.loose[di], s.loose[si]
    d_ok, s_ok = dl >= 0, sl >= 0

    src_only = int(np.count_nonzero(~d_ok & s_ok))
    dest_only = int(np.count_nonzero(d_ok & ~s_ok))
    both_mask = d_ok & s_ok
    both = int(np.count_nonzero(both_mask))

    equal = both_mask & (dl == sl)
    loose = int(np.count_nonzero(equal))
    agree_vals = np.unique(dl[equal]) if loose else np.empty(0, dtype=np.int32)

    # raw is a subset of trim is a subset of upper is a subset of loose.
    upper_eq = equal & (d.upper[di] == s.upper[si])
    trim_eq = upper_eq & (d.trim[di] == s.trim[si])
    raw_eq = trim_eq & (d.raw[di] == s.raw[si])

    prefix = 0
    prefix_distinct = 0
    if check_prefix:
        prefix = loose
        prefix_vals = set(agree_vals.tolist())
        mismatch = np.flatnonzero(both_mask & (dl != sl))
        for j in mismatch.tolist():
            a = upper_vals[int(d.upper[di[j]])]
            b = upper_vals[int(s.upper[si[j]])]
            if len(a) < len(b) and b.startswith(a):
                prefix += 1
                prefix_vals.add(int(d.upper[di[j]]))
        prefix_distinct = len(prefix_vals)

    return {
        "source": s,
        "both": both,
        "raw": int(np.count_nonzero(raw_eq)),
        "trim": int(np.count_nonzero(trim_eq)),
        "upper": int(np.count_nonzero(upper_eq)),
        "loose": loose,
        "prefix": prefix,
        "srcOnly": src_only,
        "destOnly": dest_only,
        "agreement": (loose / both) if both else 0.0,
        "prefixRate": (prefix / both) if both else 0.0,
        "distinct": int(agree_vals.size),
        "prefixDistinct": prefix_distinct,
    }


def case_label(d: EncodedColumn, s: EncodedColumn) -> str:
    if d.all_upper and not s.all_upper:
        return "uppercase"
    if d.all_lower and not s.all_lower:
        return "lowercase"
    return "case-insensitive match"


def format_label(d: EncodedColumn, s: EncodedColumn) -> str:
    kinds = {d.stat.dominant_type, s.stat.dominant_type}
    if "date" in kinds:
        a = s.stat.top_masks[0][0] if s.stat.top_masks else "?"
        b = d.stat.top_masks[0][0] if d.stat.top_masks else "?"
        return f"date reformat ({a} → {b})"
    if "yn" in kinds or "boolean" in kinds:
        return "boolean cast"
    if "integer" in kinds or "decimal" in kinds:
        return "numeric reformat (leading zeros / decimals)"
    return "whitespace or punctuation normalisation"


def describe(r: dict, d: EncodedColumn, s: EncodedColumn, cfg: dict) -> dict | None:
    if r["both"] < 1:
        return None
    if r["agreement"] >= cfg["minAgreement"]:
        if r["raw"] == r["loose"]:
            transform = "identity"
        elif r["trim"] == r["loose"]:
            transform = "trim"
        elif r["upper"] == r["loose"]:
            transform = case_label(d, s)
        else:
            transform = format_label(d, s)
        return {"transform": transform, "score": r["agreement"], "distinct": r["distinct"], "kind": "direct"}
    if r["prefixRate"] >= cfg["minAgreement"] and r["prefix"] > r["loose"]:
        return {
            "transform": f"truncate({d.stat.max_len})",
            "score": r["prefixRate"],
            "distinct": r["prefixDistinct"],
            "kind": "direct",
        }
    return None


def find_lookup(
    d: EncodedColumn, src_cols: list[EncodedColumn], si: np.ndarray, di: np.ndarray, cfg: dict
) -> dict | None:
    """A destination field whose values never match can still be derived by lookup.

    The guard that matters is repetition: if the source column is near-unique the
    functional dependency holds by construction and proves nothing, so both sides
    must be code tables.
    """
    out: list[dict] = []
    du_all = d.upper[di]
    for s in src_cols:
        su_all = s.upper[si]
        valid = (su_all >= 0) & (du_all >= 0)
        both = int(np.count_nonzero(valid))
        if both < cfg["minRows"]:
            continue

        su = su_all[valid]
        du = du_all[valid]
        fwd: dict[int, int] = {}
        conflict = 0
        for a, b in zip(su.tolist(), du.tolist()):
            seen = fwd.get(a)
            if seen is None:
                fwd[a] = b
            elif seen != b:
                conflict += 1
        rev_size = int(np.unique(du).size)

        if len(fwd) < 2 or rev_size < 3:
            continue
        if len(fwd) > both * LOOKUP_MAX_CARDINALITY:
            continue
        if rev_size > both * LOOKUP_MAX_CARDINALITY:
            continue
        rate = 1 - conflict / both
        if rate < 0.98:
            continue

        out.append({
            "source": s, "both": both, "conflict": conflict, "rate": rate,
            "srcDistinct": len(fwd), "destDistinct": rev_size, "fwd": fwd,
        })

    out.sort(key=lambda r: (abs(r["srcDistinct"] - r["destDistinct"]), -r["rate"], -r["destDistinct"]))
    return out[0] if out else None


def confidence_of(score: float, rows: int, distinct: int) -> str:
    if score >= 0.99 and rows >= 200 and distinct >= 25:
        return "high"
    if score >= 0.95 and rows >= 100 and distinct >= 10:
        return "medium"
    return "low"


def is_surrogate_key(c: EncodedColumn, rows: int) -> bool:
    return (
        rows > 0
        and c.stat.populated / rows >= 0.9
        and c.stat.populated > 0
        and c.stat.distinct / c.stat.populated >= 0.98
    )


def recover(
    src_cols: list[EncodedColumn],
    dest_cols: list[EncodedColumn],
    si: np.ndarray,
    di: np.ndarray,
    upper_vals: list[str],
    cfg: dict,
    dest_rows: int,
) -> list[dict]:
    usable_src = [c for c in src_cols if carries_information(c)]
    rows: list[dict] = []

    for d in dest_cols:
        if d.stat.populated == 0:
            rows.append({"dest": d, "kind": "empty", "notes": "Never populated in this export."})
            continue
        if d.stat.is_constant:
            rows.append({
                "dest": d, "kind": "constant", "value": d.stat.top_values[0][0],
                "notes": f"Single value on every populated row ({d.stat.populated} rows).",
            })
            continue

        accepted: list[dict] = []
        weak: list[dict] = []
        for s in usable_src:
            r = compare(d, s, si, di, upper_vals)
            hit = describe(r, d, s, cfg)
            if not hit:
                continue
            candidate = {**r, **hit}
            if r["both"] >= cfg["minRows"] and hit["distinct"] >= cfg["minDistinct"]:
                accepted.append(candidate)
            else:
                weak.append(candidate)

        rank = lambda c: (-c["score"], -c["distinct"], -c["both"])  # noqa: E731
        accepted.sort(key=rank)
        weak.sort(key=rank)

        if accepted:
            best = accepted[0]
            rows.append({
                "dest": d, "kind": "direct", "best": best,
                "alternates": accepted[1:4], "weak": weak,
                "confidence": confidence_of(best["score"], best["both"], best["distinct"]),
            })
            continue

        lookup = find_lookup(d, usable_src, si, di, cfg)
        if lookup:
            rows.append({
                "dest": d, "kind": "lookup", "lookup": lookup, "weak": weak,
                "confidence": confidence_of(lookup["rate"], lookup["both"], lookup["destDistinct"]),
            })
            continue

        if is_surrogate_key(d, dest_rows):
            rows.append({
                "dest": d, "kind": "identifier", "weak": weak,
                "notes": "Unique per row and unrelated to any source value — generated on the "
                         "destination side.",
            })
            continue

        rows.append({"dest": d, "kind": "unexplained", "weak": weak})

    return rows
