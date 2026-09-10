"""Generated artifacts for the profile stage.

Ports writeFieldsCsv, writeReport and writeQuestions from csv-profiler.js. File
shapes are kept byte-identical to the Node versions -- including which files end
with a trailing newline and which do not -- because workbench-server.js reads
fields.csv back with its own CSV reader and the UI renders the markdown as-is.
"""

from __future__ import annotations

from pathlib import Path
from typing import Any

from .findings import CUSTOM_PREFIX
from .formatting import pct, to_csv_row
from .profiling import ColumnProfile

FIELDS_HEADER = [
    "field", "in_schema", "declared_type", "nullable", "required", "declared_maxlen",
    "fill_pct", "populated", "empty", "distinct", "is_constant", "is_unique",
    "observed_type", "min_len", "max_len", "padded", "top_value", "top_pct", "flags",
]


def write_fields_csv(columns: list[ColumnProfile], file: Path) -> None:
    rows = [to_csv_row(FIELDS_HEADER)]
    for c in columns:
        s = c.schema
        top = c.top_values[0] if c.top_values else None
        rows.append(
            to_csv_row(
                [
                    c.name,
                    "yes" if s else "no",
                    "|".join(s["types"]) if s else "",
                    ("yes" if s["nullable"] else "no") if s else "",
                    ("yes" if s["required"] else "no") if s else "",
                    s["maxLength"] if s and s["maxLength"] is not None else "",
                    pct(c.fill),
                    c.populated,
                    c.empty + c.whitespace_only,
                    c.distinct,
                    "yes" if c.is_constant else "",
                    "yes" if c.is_unique else "",
                    c.dominant_type or "",
                    c.min_len,
                    c.max_len,
                    c.padded,
                    top[0] if top else "",
                    pct(top[1] / c.populated) if (top and c.populated) else "",
                    ";".join(f["code"] for f in c.findings),
                ]
            )
        )
    file.write_text("\n".join(rows) + "\n", encoding="utf-8")


def write_report(meta: dict[str, Any], columns: list[ColumnProfile], missing: list[dict], file: Path) -> None:
    L: list[str] = []
    populated = [c for c in columns if c.populated > 0]
    empty_cols = [c for c in columns if c.populated == 0]
    constants = [c for c in columns if c.is_constant]
    usable = len(populated) - len(constants)
    total_cols = len(columns)

    L.append(f"# Profile — {meta['label']}")
    L.append("")
    L.append(f"- Source: `{meta['dataFile']}`")
    if meta.get("schemaFile"):
        L.append(f"- Schema: `{meta['schemaFile']}`")
    L.append(f"- Rows: {meta['rows']}")
    L.append(f"- Columns: {total_cols}")
    if meta.get("repaired"):
        L.append(
            f"- **Rows repaired**: {meta['repaired']} (record split across lines by an "
            "unquoted newline in a free-text field)"
        )
    if meta.get("quarantined"):
        L.append(
            f"- **Rows quarantined**: {len(meta['quarantined'])} (field count never reached the "
            "header count — excluded from all statistics below)"
        )
    L.append(f"- Generated: {meta['generated']}")
    L.append("")
    L.append("## Pruning")
    L.append("")
    L.append("| | Count | Share |")
    L.append("| --- | ---: | ---: |")
    L.append(f"| Columns in export | {total_cols} | 100% |")
    L.append(f"| Never populated | {len(empty_cols)} | {pct(len(empty_cols) / total_cols)} |")
    L.append(f"| Constant (one value) | {len(constants)} | {pct(len(constants) / total_cols)} |")
    L.append(f"| **Carrying information** | **{usable}** | **{pct(usable / total_cols)}** |")
    L.append("")

    if meta.get("schemaFile"):
        not_in_schema = [c for c in columns if not c.schema]
        L.append("## Schema reconciliation")
        L.append("")
        L.append(f"- Columns declared in schema: {total_cols - len(not_in_schema)}")
        L.append(f"- Columns **not** in schema: {len(not_in_schema)}")
        L.append(f"- Schema fields absent from export: {len(missing)}")
        if missing:
            L.append("")
            L.append(
                "  "
                + ", ".join(
                    f"`{f['path']}`" + (" **(required)**" if f["required"] else "") for f in missing
                )
            )
        L.append("")

    custom = [c for c in columns if CUSTOM_PREFIX.match(c.name)]
    if custom:
        live = [c for c in custom if c.populated > 0 and not c.is_constant]
        dead = [c for c in custom if c.populated == 0 or c.is_constant]
        L.append("## Custom fields")
        L.append("")
        L.append(
            f"_{len(custom)} customer-defined columns. {len(dead)} are empty or constant and can "
            f"be dropped; the remaining {len(live)} each need a human answer._"
        )
        L.append("")
        L.append("| Field | Fill | Distinct | Type | Top value |")
        L.append("| --- | ---: | ---: | --- | --- |")
        for c in live:
            top = c.top_values[0]
            sample = str(top[0]).replace("\n", " ")[:40]
            L.append(f"| `{c.name}` | {pct(c.fill)} | {c.distinct} | {c.dominant_type} | `{sample}` |")
        L.append("")
        L.append(
            "Droppable: " + (", ".join(f"`{c.name}`" for c in dead) if dead else "none")
        )
        L.append("")

    for tier, title, blurb in (
        ("question", "Questions — schema and data disagree",
         "These are the conflicts that today surface during testing."),
        ("review", "Review — needs a decision",
         "Mappable, but the transform depends on an answer."),
        ("transform", "Transforms — deterministic",
         "Derivable from the data with no judgement call."),
    ):
        items = [(c, f) for c in columns for f in c.findings if f["tier"] == tier]
        if not items:
            continue
        L.append(f"## {title}")
        L.append("")
        L.append(f"_{blurb}_")
        L.append("")
        for c, f in items:
            L.append(f"- **`{c.name}`** — [{f['code']}] {f['text']}")
        L.append("")

    L.append("## Candidate keys")
    L.append("")
    keys = [c for c in columns if c.is_unique]
    L.append(
        "\n".join(f"- `{c.name}` ({c.dominant_type})" for c in keys) if keys else "- none"
    )
    L.append("")

    L.append("## Field detail")
    L.append("")
    L.append("| Field | Fill | Distinct | Type | Len | Top value |")
    L.append("| --- | ---: | ---: | --- | ---: | --- |")
    for c in columns:
        top = c.top_values[0] if c.top_values else None
        top_str = f"`{str(top[0])[:30]}` {pct(top[1] / c.populated)}" if top else "—"
        L.append(
            f"| `{c.name}` | {pct(c.fill)} | {c.distinct} | {c.dominant_type or '—'} | "
            f"{c.min_len}–{c.max_len} | {top_str} |"
        )
    L.append("")

    file.write_text("\n".join(L), encoding="utf-8")


def write_questions(meta: dict[str, Any], columns: list[ColumnProfile], file: Path) -> None:
    L = [
        f"# Questions — {meta['label']}",
        "",
        "Generated from the export. Every item needs a human answer before mapping.",
        "",
    ]
    n = 0
    for c in columns:
        qs = [f for f in c.findings if f["tier"] in ("question", "custom")]
        if not qs:
            continue
        if c.populated == 0 or c.is_constant:
            continue  # nothing to ask about a column with no signal
        n += 1
        L.append(f"## {n}. `{c.name}`")
        L.append("")
        L.append(f"Fill {pct(c.fill)} · {c.distinct} distinct · observed {c.dominant_type or 'n/a'}")
        if c.top_values:
            L.append("")
            L.append(
                "Sample values: "
                + ", ".join(f"`{str(v)[:40]}` ×{k}" for v, k in c.top_values)
            )
        L.append("")
        for q in qs:
            L.append(f"- **{q['code']}** — {q['text']}")
        L.append("")
    if not n:
        L.append("_No conflicts detected._")

    file.write_text("\n".join(L), encoding="utf-8")
