"""Generated artifacts for the score stage. Port of the writers in mapping-suggester.js.

suggestions.csv is the reviewer's working file, so a rerun must not discard what
a reviewer has already typed into it: transform, review_decision and review_notes
are read back from the existing file and carried forward, except where evidence
recovered from an actual App Xchange run supersedes them.
"""

from __future__ import annotations

from pathlib import Path
from typing import Any

from .csv_io import read_records, read_table
from .formatting import to_csv_row

SUGGESTIONS_HEADER = [
    "dest_field", "source_field", "kind", "transform", "status", "confidence",
    "score", "alternatives", "rationale", "review_decision", "review_notes",
]


def write_suggestions(rows: list[dict], file: Path, preserve_existing: bool = True) -> None:
    existing: dict[str, dict] = {}
    if preserve_existing and file.exists():
        existing = {r["dest_field"]: r for r in read_records(file)}

    lines = [to_csv_row(SUGGESTIONS_HEADER)]
    for row in rows:
        prior = existing.get(row["destField"], {})
        transform = (
            row["transform"]
            if row["status"] == "actual-run"
            else (prior.get("transform") or row["transform"])
        )
        lines.append(
            to_csv_row([
                row["destField"], row["sourceField"], row["kind"], transform,
                row["status"], row["confidence"], row["score"], row["alternatives"],
                row["rationale"], prior.get("review_decision") or "", prior.get("review_notes") or "",
            ])
        )
    file.write_text("\n".join(lines) + "\n", encoding="utf-8")


def populate_approved_transforms(rows: list[dict], file: Path | None) -> None:
    """Fill blank transforms in an approved mapping without touching filled ones."""
    if not file or not file.exists():
        return
    table = read_table(file, force_tolerant=True)
    headers = table.headers
    if "dest_field" not in headers or "transform" not in headers:
        return
    dest_index = headers.index("dest_field")
    transform_index = headers.index("transform")

    transforms = {row["destField"]: row["transform"] for row in rows}
    records = [list(r) for r in table.frame.iter_rows()]
    for record in records:
        if not record[transform_index]:
            record[transform_index] = transforms.get(record[dest_index], "")

    lines = [to_csv_row(headers)] + [to_csv_row(r) for r in records]
    file.write_text("\n".join(lines) + "\n", encoding="utf-8")


def write_questions(rows: list[dict], file: Path) -> None:
    questions = [r for r in rows if r["status"] == "question"]
    lines = ["# Mapping Questions", "", "Resolve these fields before approving the mapping.", ""]
    for row in questions:
        lines.extend([f"## `{row['destField']}`", ""])
        if row["sourceField"]:
            lines.extend([
                f"Candidate: `{row['sourceField']}` ({row['confidence']} confidence, {row['score']})",
                "",
            ])
        lines.extend([row["rationale"], ""])
        if row["alternatives"]:
            lines.extend([f"Alternatives: {row['alternatives']}", ""])
    if not questions:
        lines.append("_No mapping questions._")
    file.write_text("\n".join(lines), encoding="utf-8")


def write_report(rows: list[dict], meta: dict[str, Any], file: Path) -> None:
    counts: dict[str, int] = {}
    for row in rows:
        counts[row["status"]] = counts.get(row["status"], 0) + 1

    lines = [
        f"# Mapping Suggestions — {meta['label']}",
        "",
        f"- ERP profile: `{meta['sourceProfile']}`",
        f"- IVO profile: `{meta['destProfile']}`",
        f"- Comparison: {'`' + meta['comparison'] + '`' if meta.get('comparison') else '_not supplied_'}",
        f"- Generated: {meta['generated']}",
        "",
        "## Summary",
        "",
        "| Status | Fields |",
        "| --- | ---: |",
        f"| Recovered from comparison | {counts.get('recovered', 0)} |",
        f"| Recovered from actual run | {counts.get('actual-run', 0)} |",
        f"| Classified from IVO reference | {counts.get('reference', 0)} |",
        f"| Classified from profile | {counts.get('profiled', 0)} |",
        f"| New suggestions | {counts.get('suggested', 0)} |",
        f"| Questions | {counts.get('question', 0)} |",
        "",
        "## New Suggestions",
        "",
        "| Destination | Source | Confidence | Score | Rationale |",
        "| --- | --- | --- | ---: | --- |",
    ]
    suggestions = [r for r in rows if r["status"] == "suggested"]
    for row in suggestions:
        lines.append(
            f"| `{row['destField']}` | `{row['sourceField']}` | {row['confidence']} | "
            f"{row['score']} | {row['rationale']} |"
        )
    if not suggestions:
        lines.append("| _none_ | | | | |")
    lines.extend(["", "Review `suggestions.csv`; generated evidence is not an approved mapping.", ""])
    file.write_text("\n".join(lines), encoding="utf-8")
