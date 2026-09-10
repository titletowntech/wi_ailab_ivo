"""Per-column statistics. Port of profileColumn() from tools/stats.js.

The arithmetic is carried over exactly, but the loop is not. The Node version
walks every row and calls mask()/classify() once per value; this version asks
Polars for the distinct raw values and their counts (done in Rust), then calls
mask()/classify() once per *distinct* value and weights the result by its count.
Both functions are pure functions of the value, so the totals are identical --
the difference is only how many times they run, which matters because distinct
counts are typically a small fraction of row counts.

Two additions beyond the Node version, both needed as scoring inputs rather than
as display values: the full mask histogram (the Node version keeps only the top
three) and a length histogram.
"""

from __future__ import annotations

from dataclasses import dataclass, field

import polars as pl

from .masking import PLACEHOLDERS, RE, classify, mask

MASK_MAX_LEN = 60  # values longer than this are not masked, per the Node version


@dataclass
class ColumnProfile:
    name: str
    total: int = 0
    populated: int = 0
    fill: float = 0.0
    empty: int = 0
    whitespace_only: int = 0
    placeholder: int = 0
    padded: int = 0
    min_len: int = 0
    max_len: int = 0
    longest_sample: str = ""
    distinct: int = 0
    top_values: list[tuple[str, int]] = field(default_factory=list)
    top_masks: list[tuple[str, int]] = field(default_factory=list)
    mask_count: int = 0
    dominant_type: str | None = None
    dominant_share: float = 0.0
    observed_types: list[tuple[str, int]] = field(default_factory=list)
    num_min: float | None = None
    num_max: float | None = None
    is_constant: bool = False
    is_unique: bool = False
    # Full distributions -- scoring inputs, not display values.
    mask_histogram: dict[str, int] = field(default_factory=dict)
    length_histogram: dict[int, int] = field(default_factory=dict)
    # Attached by findings.analyse(), not by profile_column().
    findings: list[dict] = field(default_factory=list)
    schema: dict | None = None


def _to_number(value: str) -> float | None:
    """Mirror JS Number(v) for the integer/decimal forms classify() admits."""
    try:
        n = float(value)
    except ValueError:
        return None
    return n if n == n and n not in (float("inf"), float("-inf")) else None


def profile_column(name: str, series: pl.Series) -> ColumnProfile:
    total = series.len()
    profile = ColumnProfile(name=name, total=total)
    if total == 0:
        return profile

    # Distinct raw values with their counts and first row index, computed in Rust.
    # Ordering by first occurrence is not cosmetic: every "top N" below breaks ties
    # by first-seen, because the Node version walked rows in order and relied on a
    # stable sort. value_counts() alone returns hash order, which would make
    # top_value and top_masks vary between runs on the same input.
    counted = (
        series.to_frame("value")
        .with_row_index("row")
        .group_by("value")
        .agg(pl.len().alias("count"), pl.col("row").min().alias("first"))
        .sort("first")
    )
    value_col, count_col = "value", "count"

    values: dict[str, int] = {}  # trimmed value -> count
    type_counts: dict[str, int] = {}
    mask_counts: dict[str, int] = {}
    length_counts: dict[int, int] = {}

    empty = whitespace_only = placeholder = padded = 0
    min_len: int | None = None
    max_len = 0
    longest_sample = ""
    num_min = num_max = None
    numeric = 0

    for raw, count in zip(counted[value_col].to_list(), counted[count_col].to_list()):
        raw = "" if raw is None else raw
        if raw == "":
            empty += count
            continue
        v = raw.strip()
        if v == "":
            whitespace_only += count
            continue
        if v != raw:
            padded += count
        if v.lower() in PLACEHOLDERS:
            placeholder += count

        length = len(v)
        if min_len is None or length < min_len:
            min_len = length
        if length > max_len:
            max_len = length
            longest_sample = v
        length_counts[length] = length_counts.get(length, 0) + count

        t = classify(v)
        type_counts[t] = type_counts.get(t, 0) + count

        if t in ("integer", "decimal"):
            n = _to_number(v)
            if n is not None:
                numeric += count
                if num_min is None or n < num_min:
                    num_min = n
                if num_max is None or n > num_max:
                    num_max = n

        if length <= MASK_MAX_LEN:
            m = mask(v)
            mask_counts[m] = mask_counts.get(m, 0) + count

        values[v] = values.get(v, 0) + count

    populated = total - empty - whitespace_only
    # Ties keep first-seen order, matching the stable sort the Node version relies on.
    sorted_values = sorted(values.items(), key=lambda kv: -kv[1])
    sorted_masks = sorted(mask_counts.items(), key=lambda kv: -kv[1])
    observed_types = sorted(type_counts.items(), key=lambda kv: -kv[1])

    dominant_type = observed_types[0][0] if observed_types else None
    dominant_share = (observed_types[0][1] / populated) if (populated and observed_types) else 0.0

    # Y/N flags only make sense judged over the whole column, not value by value.
    if 0 < len(values) <= 2 and all(RE["ynFlag"].match(v) for v in values):
        dominant_type = "yn"
        dominant_share = 1.0

    profile.populated = populated
    profile.fill = (populated / total) if total else 0.0
    profile.empty = empty
    profile.whitespace_only = whitespace_only
    profile.placeholder = placeholder
    profile.padded = padded
    profile.min_len = min_len if (populated and min_len is not None) else 0
    profile.max_len = max_len
    profile.longest_sample = longest_sample
    profile.distinct = len(values)
    profile.top_values = sorted_values[:5]
    profile.top_masks = sorted_masks[:3]
    profile.mask_count = len(mask_counts)
    profile.dominant_type = dominant_type
    profile.dominant_share = dominant_share
    profile.observed_types = observed_types
    profile.num_min = num_min if numeric else None
    profile.num_max = num_max if numeric else None
    profile.is_constant = len(values) == 1 and populated > 0
    profile.is_unique = populated == total and len(values) == total and total > 0
    profile.mask_histogram = mask_counts
    profile.length_histogram = length_counts
    return profile
