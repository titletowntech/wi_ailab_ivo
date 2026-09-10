"""Generated artifacts for the compare stage. Port of the writers in data-comparer.js."""

from __future__ import annotations

import json
import re
from pathlib import Path
from typing import Any

import numpy as np

from .comparing import canon_loose, carries_information
from .formatting import pct, to_csv_row

_TRUNCATE = re.compile(r"^truncate\((\d+)\)$")

MAPPING_HEADER = [
    "dest_field", "kind", "source_field", "transform", "agreement", "rows_compared",
    "rows_joined", "coverage", "distinct_agreeing", "confidence", "dest_fill",
    "source_only_rows", "dest_only_rows", "alternates", "notes",
]


def write_mapping_csv(results: list[dict], meta: dict, file: Path) -> None:
    joined_rows = meta["joinedRows"]
    out = [to_csv_row(MAPPING_HEADER)]
    for r in results:
        d = r["dest"]
        base = [d.name, r["kind"]]
        if r["kind"] == "direct":
            b = r["best"]
            out.append(to_csv_row([
                *base, b["source"].name, b["transform"], pct(b["score"]), b["both"], joined_rows,
                pct(b["both"] / joined_rows) if joined_rows else "", b["distinct"], r["confidence"],
                pct(d.stat.fill), b["srcOnly"], b["destOnly"],
                "; ".join(f"{a['source'].name} {pct(a['score'])}" for a in r["alternates"]),
                f"{d.stat.whitespace_only} whitespace-only value(s) in destination"
                if d.stat.whitespace_only else "",
            ]))
        elif r["kind"] == "lookup":
            l = r["lookup"]
            out.append(to_csv_row([
                *base, l["source"].name,
                f"lookup ({l['srcDistinct']} → {l['destDistinct']} values)",
                pct(l["rate"]), l["both"], joined_rows,
                pct(l["both"] / joined_rows) if joined_rows else "", l["destDistinct"],
                r["confidence"], pct(d.stat.fill), "", "", "",
                "Value-translated — needs the lookup table, not a transform.",
            ]))
        else:
            out.append(to_csv_row([
                *base, "", "", "", "", joined_rows, "", d.stat.distinct, "", pct(d.stat.fill),
                "", "", "", r.get("notes") or "No source column explains these values.",
            ]))
    file.write_text("\n".join(out) + "\n", encoding="utf-8")


def write_lookups_csv(results: list[dict], upper_vals: list[str], file: Path) -> None:
    """Kept, not dropped.

    Dropping this was proposed while the tool was required to retain nothing; with
    local retention approved it is diagnostic output like the rest of the compare
    stage, and it is the only place the actual value translation is recorded.
    """
    rows = [to_csv_row(["dest_field", "source_field", "source_value", "dest_value", "confidence"])]
    for result in results:
        if result["kind"] != "lookup":
            continue
        for source_value, dest_value in result["lookup"]["fwd"].items():
            rows.append(to_csv_row([
                result["dest"].name,
                result["lookup"]["source"].name,
                upper_vals[source_value],
                upper_vals[dest_value],
                result["confidence"],
            ]))
    file.write_text("\n".join(rows) + "\n", encoding="utf-8")


def _values_match(result: dict, source_value: str, dest_value: str, source_row: int, dest_row: int) -> bool:
    source = source_value.strip()
    dest = dest_value.strip()
    if result["kind"] == "lookup":
        lookup = result["lookup"]
        return lookup["fwd"].get(int(lookup["source"].upper[source_row])) == int(
            result["dest"].upper[dest_row]
        )
    transform = result["best"]["transform"]
    if transform == "identity":
        return source_value == dest_value
    if transform == "trim":
        return source == dest
    if transform in ("uppercase", "lowercase", "case-insensitive match"):
        return source.upper() == dest.upper()
    truncation = _TRUNCATE.match(transform)
    if truncation:
        return source[: int(truncation.group(1))].upper() == dest.upper()
    return canon_loose(source) == canon_loose(dest)


def write_value_evidence(
    results: list[dict], si: np.ndarray, di: np.ndarray,
    src_rows: list[list[str]], dst_rows: list[list[str]], key: dict, file: Path,
) -> None:
    evidence: dict[str, Any] = {}
    for result in results:
        comparison = (
            result.get("best") if result["kind"] == "direct"
            else result.get("lookup") if result["kind"] == "lookup"
            else None
        )
        if not comparison or not comparison.get("source"):
            continue

        matched: list[dict] = []
        unmatched: list[dict] = []
        seen_matched: set[str] = set()
        seen_unmatched: set[str] = set()
        matched_rows = 0
        unmatched_rows = 0

        for source_row, dest_row in zip(si.tolist(), di.tolist()):
            source_value = src_rows[source_row][comparison["source"].idx] or ""
            dest_value = dst_rows[dest_row][result["dest"].idx] or ""
            is_match = False
            if not source_value.strip() and not dest_value.strip():
                continue
            if not source_value.strip():
                reason = "Customer value is blank"
            elif not dest_value.strip():
                reason = "IVO value is blank"
            else:
                is_match = _values_match(result, source_value, dest_value, source_row, dest_row)
                if result["kind"] == "lookup":
                    reason = "Lookup value matches" if is_match else "Lookup value differs"
                else:
                    verb = "Matches after" if is_match else "Values differ after"
                    reason = f"{verb} {result['best']['transform']}"

            target = matched if is_match else unmatched
            seen = seen_matched if is_match else seen_unmatched
            if is_match:
                matched_rows += 1
            else:
                unmatched_rows += 1
            # NUL separator, as the Node version uses, so a value containing the
            # separator cannot forge a duplicate signature.
            signature = "\x00".join((source_value, dest_value, reason))
            if len(target) < 100 and signature not in seen:
                seen.add(signature)
                target.append({
                    "recordKey": src_rows[source_row][key["source"].idx]
                    or dst_rows[dest_row][key["dest"].idx] or "",
                    "sourceValue": source_value,
                    "destValue": dest_value,
                    "reason": reason,
                })

        evidence[result["dest"].name] = {
            "destField": result["dest"].name,
            "sourceField": comparison["source"].name,
            "matchedRows": matched_rows,
            "unmatchedRows": unmatched_rows,
            "matched": matched,
            "unmatched": unmatched,
            "sampleLimit": 100,
        }
    file.write_text(json.dumps(evidence, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def write_report(results: list[dict], meta: dict, key_ranking: list[dict], src_cols: list, file: Path) -> None:
    L: list[str] = []
    by_kind = lambda k: [r for r in results if r["kind"] == k]  # noqa: E731
    direct, lookups = by_kind("direct"), by_kind("lookup")
    constants, identifiers = by_kind("constant"), by_kind("identifier")
    unexplained, empty = by_kind("unexplained"), by_kind("empty")
    joined_rows, dest_rows = meta["joinedRows"], meta["destRows"]
    key, cfg = meta["key"], meta["cfg"]

    L.append(f"# Recovered mapping — {meta['sourceLabel']} → {meta['destLabel']}")
    L.append("")
    L.append(f"- Source: `{meta['sourceFile']}` — {meta['srcRows']} rows × {meta['srcCols']} columns")
    L.append(f"- Destination: `{meta['destFile']}` — {dest_rows} rows × {meta['destCols']} columns")
    L.append(f"- Join: `{meta['destLabel']}.{key['dest'].name}` = `{meta['sourceLabel']}.{key['source'].name}`")
    L.append(f"- Joined: **{joined_rows} of {dest_rows}** destination rows ({pct(joined_rows / dest_rows) if dest_rows else '0.0%'})")
    if key.get("duplicates"):
        L.append(f"- Source key has {key['duplicates']} duplicate value(s) — first occurrence wins")
    if meta["srcRepaired"] or meta["destRepaired"]:
        L.append(f"- Rows repaired on read: {meta['srcRepaired']} source, {meta['destRepaired']} destination")
    if meta["srcQuarantined"] or meta["destQuarantined"]:
        L.append(
            f"- Rows quarantined (unparseable, excluded): {meta['srcQuarantined']} source, "
            f"{meta['destQuarantined']} destination"
        )
    L.append(
        f"- Thresholds: agreement ≥ {pct(cfg['minAgreement'])}, ≥ {cfg['minRows']} compared rows, "
        f"≥ {cfg['minDistinct']} distinct agreeing values"
    )
    L.append(f"- Generated: {meta['generated']}")
    L.append("")

    L.append("## Result")
    L.append("")
    L.append("| | Fields |")
    L.append("| --- | ---: |")
    L.append(f"| Destination columns | {len(results)} |")
    L.append(f"| **Recovered — direct** | **{len(direct)}** |")
    L.append(f"| **Recovered — lookup** | **{len(lookups)}** |")
    L.append(f"| Constant | {len(constants)} |")
    L.append(f"| Destination-generated identifier | {len(identifiers)} |")
    L.append(f"| Never populated | {len(empty)} |")
    L.append(f"| Unexplained | {len(unexplained)} |")
    L.append("")

    L.append("## Join key")
    L.append("")
    L.append("_Every near-unique source column tried against every high-cardinality destination column. Highest match rate wins._")
    L.append("")
    L.append("| Destination | Source | Matched rows | Rate |")
    L.append("| --- | --- | ---: | ---: |")
    for k in key_ranking[:5]:
        L.append(f"| `{k['dest'].name}` | `{k['source'].name}` | {k['matched']} | {pct(k['rate'])} |")
    L.append("")

    if direct:
        L.append("## Recovered mappings")
        L.append("")
        L.append("_Agreement is over rows where both sides are populated. Coverage is those rows as a share of the join._")
        L.append("")
        L.append("| Destination | Source | Transform | Agreement | Rows | Coverage | Distinct | Confidence |")
        L.append("| --- | --- | --- | ---: | ---: | ---: | ---: | --- |")
        for r in direct:
            b = r["best"]
            L.append(
                f"| `{r['dest'].name}` | `{b['source'].name}` | {b['transform']} | {pct(b['score'])} | "
                f"{b['both']} | {pct(b['both'] / joined_rows) if joined_rows else ''} | {b['distinct']} | "
                f"{r['confidence']} |"
            )
        L.append("")

        fanout: dict[str, int] = {}
        for r in direct:
            n = r["best"]["source"].name
            fanout[n] = fanout.get(n, 0) + 1
        shared = [(n, c) for n, c in fanout.items() if c > 1]
        if shared:
            parts = []
            for n, c in shared:
                dests = ", ".join(
                    f"`{r['dest'].name}`" for r in direct if r["best"]["source"].name == n
                )
                parts.append(f"`{n}` → {dests} ({c})")
            L.append("**One source field, several destinations:** " + "; ".join(parts))
            L.append("")

        notes: list[str] = []
        for r in direct:
            b = r["best"]
            parts = []
            if b["srcOnly"]:
                parts.append(f"{b['srcOnly']} row(s) have a source value but an empty destination")
            if b["destOnly"]:
                parts.append(f"{b['destOnly']} row(s) have a destination value but an empty source")
            if r["dest"].stat.whitespace_only:
                parts.append(
                    f"{r['dest'].stat.whitespace_only} destination value(s) are whitespace-only, not empty"
                )
            if r["alternates"]:
                alts = ", ".join(f"`{a['source'].name}` {pct(a['score'])}" for a in r["alternates"])
                parts.append(f"also matches {alts}")
            if parts:
                notes.append(f"- **`{r['dest'].name}`** — {'; '.join(parts)}.")
        if notes:
            L.append("### Null and ambiguity notes")
            L.append("")
            L.extend(notes)
            L.append("")

    if lookups:
        L.append("## Lookups")
        L.append("")
        L.append("_Values never match, but each source value resolves to exactly one destination value. Value comparison cannot produce these — the table below is the mapping._")
        L.append("")
        for r in lookups:
            l = r["lookup"]
            L.append(f"### `{r['dest'].name}` ← `{l['source'].name}`")
            L.append("")
            L.append(
                f"{l['srcDistinct']} source value(s) → {l['destDistinct']} destination value(s) over "
                f"{l['both']} rows, {l['conflict']} conflict(s) ({pct(l['rate'])} consistent) · "
                f"confidence {r['confidence']}"
            )
            L.append("")
            entries = list(l["fwd"].items())[:20]
            L.append("| Source value | Destination value |")
            L.append("| --- | --- |")
            for su, du in entries:
                L.append(f"| `{meta['upperVals'][su][:40]}` | `{meta['upperVals'][du][:40]}` |")
            if len(l["fwd"]) > len(entries):
                L.append(f"| _… {len(l['fwd']) - len(entries)} more_ | |")
            L.append("")

    if constants:
        L.append("## Constants")
        L.append("")
        L.append("_Same value on every row. Either a hardcoded flow value or a customer-level setting — value comparison cannot tell which._")
        L.append("")
        L.append("| Destination | Value | Fill |")
        L.append("| --- | --- | ---: |")
        for r in constants:
            L.append(f"| `{r['dest'].name}` | `{str(r['value'])[:40]}` | {pct(r['dest'].stat.fill)} |")
        L.append("")

    weak_items = [(r, w) for r in results for w in r.get("weak", [])]
    if weak_items:
        L.append("## Suppressed — agreement without evidence")
        L.append("")
        L.append("_These cleared the agreement threshold but not the row or cardinality floor. Listed so nothing is hidden, not proposed as mappings._")
        L.append("")
        L.append("| Destination | Source | Agreement | Rows | Distinct | Why suppressed |")
        L.append("| --- | --- | ---: | ---: | ---: | --- |")
        for r, w in weak_items[:40]:
            why = []
            if w["both"] < cfg["minRows"]:
                why.append(f"only {w['both']} rows")
            if w["distinct"] < cfg["minDistinct"]:
                why.append(f"only {w['distinct']} distinct value(s)")
            L.append(
                f"| `{r['dest'].name}` | `{w['source'].name}` | {pct(w['score'])} | {w['both']} | "
                f"{w['distinct']} | {', '.join(why)} |"
            )
        if len(weak_items) > 40:
            L.append(f"| _… {len(weak_items) - 40} more_ | | | | | |")
        L.append("")

    if identifiers:
        L.append("## Destination-generated identifiers")
        L.append("")
        L.append("_Unique per row and explained by nothing on the source side. Surrogate keys IVO assigns — no mapping to recover._")
        L.append("")
        L.append(", ".join(f"`{r['dest'].name}`" for r in identifiers))
        L.append("")

    if unexplained:
        L.append("## Unexplained destination fields")
        L.append("")
        L.append("_Populated, varying, and not derivable from any source column. Filled from another object, computed, or entered by hand — a human has to say which._")
        L.append("")
        L.append("| Destination | Fill | Distinct | Type | Top value |")
        L.append("| --- | ---: | ---: | --- | --- |")
        for r in unexplained:
            top = r["dest"].stat.top_values[0] if r["dest"].stat.top_values else None
            sample = str(top[0]).replace("\n", " ")[:30] if top else ""
            L.append(
                f"| `{r['dest'].name}` | {pct(r['dest'].stat.fill)} | {r['dest'].stat.distinct} | "
                f"{r['dest'].stat.dominant_type or '—'} | `{sample}` |"
            )
        L.append("")

    if empty:
        L.append("## Never populated")
        L.append("")
        L.append(", ".join(f"`{r['dest'].name}`" for r in empty))
        L.append("")

    used: set[str] = set()
    for r in results:
        if r["kind"] == "direct":
            used.add(r["best"]["source"].name)
        if r["kind"] == "lookup":
            used.add(r["lookup"]["source"].name)
    unused = [c for c in src_cols if carries_information(c) and c.name not in used]
    L.append("## Unused source fields")
    L.append("")
    L.append(
        f"_{len(unused)} source column(s) carry information but feed nothing on the destination "
        "side. Either genuinely dropped by the flow, or mapped onto an object this pair of exports "
        "does not cover._"
    )
    L.append("")
    L.append(", ".join(f"`{c.name}`" for c in unused) if unused else "_none_")
    L.append("")

    file.write_text("\n".join(L), encoding="utf-8")
