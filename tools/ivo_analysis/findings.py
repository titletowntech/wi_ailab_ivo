"""Column findings. Port of analyse() and applySchemaChecks() from csv-profiler.js.

Findings are grouped by tier, and the tier decides where a finding surfaces:
question and custom reach questions.md, review and transform reach report.md,
prune and info are summary-only.
"""

from __future__ import annotations

import re
from typing import Any

import polars as pl

from .formatting import pct
from .profiling import ColumnProfile, profile_column

CUSTOM_PREFIX = re.compile(r"^ud[A-Z_]")


def _finding(code: str, tier: str, text: str) -> dict[str, str]:
    return {"code": code, "tier": tier, "text": text}


def analyse(
    headers: list[str], frame: pl.DataFrame, schema_fields: dict[str, dict] | None
) -> tuple[list[ColumnProfile], list[dict]]:
    columns: list[ColumnProfile] = []

    for idx, header in enumerate(headers):
        series = frame.to_series(idx)
        stat = profile_column(header, series)
        stat.findings = []
        stat.schema = schema_fields.get(header) if schema_fields else None

        if CUSTOM_PREFIX.match(header):
            stat.findings.append(
                _finding(
                    "CUSTOM_FIELD",
                    "custom",
                    "Customer-defined field, no declared semantics. Undecidable by tooling.",
                )
            )
        elif schema_fields is not None and not stat.schema:
            stat.findings.append(
                _finding("NOT_IN_SCHEMA", "question", "Column is not declared in the connector schema.")
            )

        if stat.populated == 0:
            stat.findings.append(_finding("EMPTY", "prune", "Never populated in this export."))
        elif stat.is_constant:
            stat.findings.append(
                _finding(
                    "CONSTANT",
                    "prune",
                    f'Single value for every populated row: "{stat.top_values[0][0]}".',
                )
            )

        if stat.is_unique:
            stat.findings.append(_finding("CANDIDATE_KEY", "info", "Unique and fully populated."))
        if stat.padded:
            stat.findings.append(
                _finding(
                    "PADDED",
                    "transform",
                    f"{stat.padded} value(s) carry leading/trailing whitespace — needs .trim().",
                )
            )
        if stat.whitespace_only:
            stat.findings.append(
                _finding(
                    "WHITESPACE_NULL",
                    "transform",
                    f'{stat.whitespace_only} value(s) are whitespace-only, not empty. "" vs " " '
                    "will not compare equal.",
                )
            )
        if stat.placeholder:
            stat.findings.append(
                _finding(
                    "PLACEHOLDER_NULL",
                    "review",
                    f'{stat.placeholder} value(s) look like textual nulls ("N/A", "NONE", ...).',
                )
            )
        if stat.populated > 0 and stat.dominant_share < 0.99:
            summary = ", ".join(f"{t} {pct(c / stat.populated)}" for t, c in stat.observed_types)
            stat.findings.append(_finding("MIXED_FORMAT", "review", f"Mixed observed formats: {summary}."))
        if 0 < stat.fill < 0.5:
            stat.findings.append(
                _finding(
                    "SPARSE",
                    "review",
                    f"Only {pct(stat.fill)} populated ({stat.populated} of {stat.total} rows) — "
                    "destination default/null handling required.",
                )
            )

        if stat.schema:
            _apply_schema_checks(stat, series)
        columns.append(stat)

    missing: list[dict] = []
    if schema_fields is not None:
        present = set(headers)
        for definition in schema_fields.values():
            if definition["nested"] or definition["isArray"] or definition["name"] == "__custom_fields":
                continue
            if definition["path"] not in present:
                missing.append(definition)

    return columns, missing


def _trimmed_values(series: pl.Series) -> list[str]:
    return [("" if v is None else v).strip() for v in series.to_list()]


def _apply_schema_checks(stat: ColumnProfile, series: pl.Series) -> None:
    s: dict[str, Any] = stat.schema

    if s["required"] and stat.fill < 1:
        stat.findings.append(
            _finding(
                "REQUIRED_BUT_EMPTY",
                "question",
                f"Schema marks this required, but {pct(1 - stat.fill)} of rows are empty.",
            )
        )

    if not s["nullable"] and not s["required"] and stat.fill < 1 and stat.populated > 0:
        stat.findings.append(
            _finding(
                "NULL_NOT_DECLARED",
                "review",
                f"Schema type is not nullable, yet {pct(1 - stat.fill)} of rows are empty.",
            )
        )

    max_length = s["maxLength"]
    if max_length is not None and stat.max_len > 0:
        if stat.max_len > max_length:
            stat.findings.append(
                _finding(
                    "OVER_MAXLENGTH",
                    "question",
                    f"Observed length {stat.max_len} exceeds declared maxLength {max_length}. "
                    f'Example: "{stat.longest_sample}".',
                )
            )
        elif stat.max_len == max_length and max_length >= 5 and s["minLength"] != max_length:
            # Short and fixed-width fields sit at their limit by construction; only
            # variable long fields imply truncation.
            at_limit = sum(1 for v in _trimmed_values(series) if len(v) == max_length)
            stat.findings.append(
                _finding(
                    "AT_MAXLENGTH",
                    "review",
                    f"{at_limit} value(s) sit exactly at the declared maxLength {max_length} — "
                    "likely already truncated upstream.",
                )
            )

    if s["enum"]:
        allowed = {str(v) for v in s["enum"]}
        offenders: dict[str, int] = {}
        for v in _trimmed_values(series):
            if v == "" or v in allowed:
                continue
            offenders[v] = offenders.get(v, 0) + 1
        if offenders:
            top = sorted(offenders.items(), key=lambda kv: -kv[1])[:5]
            listed = ", ".join(f'"{v}" ×{c}' for v, c in top)
            declared = ", ".join(str(v) for v in s["enum"])
            stat.findings.append(
                _finding(
                    "ENUM_VIOLATION",
                    "question",
                    f"Values outside declared enum [{declared}]: {listed}.",
                )
            )

    if s["pattern"]:
        try:
            pattern = re.compile(s["pattern"])
        except re.error:
            pattern = None  # schema pattern not valid here — skip, as the Node version does
        if pattern is not None:
            bad = 0
            sample = ""
            for v in _trimmed_values(series):
                if v == "":
                    continue
                # JS RegExp.test is a search, not a full match.
                if not pattern.search(v):
                    bad += 1
                    if not sample:
                        sample = v
            if bad:
                stat.findings.append(
                    _finding(
                        "PATTERN_VIOLATION",
                        "question",
                        f'{bad} value(s) fail the declared pattern {s["pattern"]}. Example: "{sample}".',
                    )
                )

    declared = "|".join(s["types"])
    observed = stat.dominant_type
    if observed and declared:
        ok = (
            (declared == "integer" and observed == "integer")
            or (declared == "number" and observed in ("integer", "decimal"))
            or (declared == "boolean" and observed in ("boolean", "yn"))
            or declared == "string"
        )
        if not ok:
            stat.findings.append(
                _finding(
                    "TYPE_MISMATCH",
                    "question",
                    f"Schema declares {declared}; data looks like {observed}.",
                )
            )
        if declared == "string" and observed in ("integer", "decimal") and not s["pattern"]:
            stat.findings.append(
                _finding(
                    "NUMERIC_AS_STRING",
                    "transform",
                    "Declared string, observed numeric. Do not cast if leading zeros matter.",
                )
            )
