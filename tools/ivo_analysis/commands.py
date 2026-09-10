"""Subcommand implementations. Each mirrors the CLI of the Node tool it replaces."""

from __future__ import annotations

import json
import math
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

import re

from . import mapping_writers
from .csv_io import read_records, read_table
from .findings import analyse
from .schema import flatten_schema
from .formatting import pct
from .scoring import js_number, suggestion_rows
from .writers import write_fields_csv, write_questions, write_report


def _relative(path: Path) -> str:
    """Match Node's path.relative(process.cwd(), ...) which yields forward slashes here."""
    try:
        return os.path.relpath(path, Path.cwd()).replace(os.sep, "/")
    except ValueError:  # different drive on Windows
        return str(path)


def _iso_now() -> str:
    # Node's new Date().toISOString() -> 2026-09-10T16:04:11.123Z
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.") + f"{datetime.now(timezone.utc).microsecond // 1000:03d}Z"


def profile(args) -> int:
    data_file = Path(args.data).resolve()
    out_dir = Path(args.out or "out").resolve()
    label = args.label or data_file.stem

    table = read_table(data_file)
    schema_fields = None
    schema_file = None
    if args.schema:
        schema_file = Path(args.schema).resolve()
        schema_fields = flatten_schema(json.loads(schema_file.read_text(encoding="utf-8")))

    columns, missing = analyse(table.headers, table.frame, schema_fields)

    meta = {
        "label": label,
        "dataFile": _relative(data_file),
        "schemaFile": _relative(schema_file) if schema_file else None,
        "rows": table.frame.height,
        "repaired": table.repaired,
        "quarantined": table.quarantined,
        "generated": os.environ.get("IVO_GENERATED_AT") or _iso_now(),
    }

    out_dir.mkdir(parents=True, exist_ok=True)
    write_fields_csv(columns, out_dir / "fields.csv")
    write_report(meta, columns, missing, out_dir / "report.md")
    write_questions(meta, columns, out_dir / "questions.md")

    questions = sum(
        len([f for f in c.findings if f["tier"] in ("question", "custom")])
        for c in columns
        if c.populated > 0 and not c.is_constant
    )
    pruned = len([c for c in columns if c.populated == 0 or c.is_constant])
    print(f"{label}: {table.frame.height} rows × {len(columns)} cols")
    if table.repaired:
        print(f"  rows repaired (unquoted newline): {table.repaired}")
    if table.quarantined:
        print(f"  rows quarantined (unparseable):   {len(table.quarantined)}")
    print(f"  pruned (empty or constant): {pruned}")
    print(f"  carrying information:       {len(columns) - pruned}")
    print(f"  questions raised:           {questions}")
    print(f"  → {_relative(out_dir)}")
    return 0


def _num(value, fallback):
    """Node's num(): fall back when the argument is absent or unparseable."""
    if value is None:
        return fallback
    n = js_number(value)
    return n if math.isfinite(n) else fallback


_ADD_UPDATE_SUFFIX = re.compile(r"/(?:add|update)$", re.IGNORECASE)


def _attach_cardinality_denominator(profiles: list[dict], key: str) -> None:
    """Record the widest distinct count in the object on every profile row.

    Relative cardinality needs a per-object denominator, and each side has its own
    because the two datasets are different sizes.
    """
    widest = 0
    for profile in profiles:
        value = js_number(profile.get(key))
        if math.isfinite(value) and value > widest:
            widest = value
    for profile in profiles:
        profile["_max_distinct"] = widest


def _load_execution_mappings(path: Path) -> list[dict]:
    """Read execution-evidence CSV produced by the (still Node) app-xchange-run-mapper."""
    out = []
    for row in read_records(path):
        out.append({
            "operation": row.get("operation"),
            "destinationObject": row.get("destination_object") or "",
            "destinationField": row.get("destination_field"),
            "sourceFields": [f for f in str(row.get("source_fields") or "").split("|") if f],
            "kind": row.get("kind"),
            "lookupSteps": [s for s in str(row.get("lookup_steps") or "").split("|") if s],
            "expression": row.get("value_handling"),
            "actionStepId": row.get("action_step"),
        })
    return out


def _select_execution_group(mappings: list[dict], dest_schema: dict) -> list[dict]:
    """Pick the action object whose fields overlap the IVO schema most, scoping ancillary actions out."""
    groups: dict[str, list[dict]] = {}
    for mapping in mappings:
        object_path = _ADD_UPDATE_SUFFIX.sub("", mapping["destinationObject"])
        groups.setdefault(object_path, []).append(mapping)
    if not groups:
        return []

    def overlap_count(rows: list[dict]) -> int:
        return len({r["destinationField"] for r in rows if r["destinationField"] in dest_schema})

    # Node sorts descending by overlap and takes the first; Python's sort is stable,
    # so groups that tie keep insertion order exactly as they do there.
    return sorted(groups.values(), key=lambda rows: -overlap_count(rows))[0]


def score(args) -> int:
    reference_dir = Path(args.ivo_reference).resolve() if args.ivo_reference else None
    ivo_schema_file = (
        reference_dir / "schema.json" if reference_dir else Path(args.ivo_schema).resolve()
    )

    source_schema = flatten_schema(json.loads(Path(args.erp_schema).resolve().read_text(encoding="utf-8")))
    dest_schema = flatten_schema(json.loads(ivo_schema_file.read_text(encoding="utf-8")))

    catalog_file = reference_dir / "field-catalog.csv" if reference_dir else None
    catalog_rows = read_records(catalog_file) if catalog_file and catalog_file.exists() else []
    dest_catalog = {row["field"]: row for row in catalog_rows}
    for field_name, catalog in dest_catalog.items():
        field = dest_schema.get(field_name)
        if field and catalog.get("description"):
            field["description"] = catalog["description"]

    source_profiles = read_records(Path(args.erp_profile).resolve())
    if getattr(args, "ivo_profile", None):
        dest_profiles = read_records(Path(args.ivo_profile).resolve())
    else:
        dest_profiles = []
        for f in dest_schema.values():
            catalog = dest_catalog.get(f["path"], {})
            dest_profiles.append({
                "field": f["path"],
                "declared_type": "|".join(f["types"]),
                "nullable": "yes" if f["nullable"] else "no",
                "required": "yes" if f["required"] else "no",
                "declared_maxlen": f["maxLength"] if f["maxLength"] is not None else "",
                "observed_type": "",
                # Observed IVO-side evidence, carried through from the reference
                # catalog so the value signals have a destination to compare against.
                "observed_fill_pct": catalog.get("observed_fill_pct", ""),
                "observed_distinct": catalog.get("observed_distinct", ""),
            })

    _attach_cardinality_denominator(source_profiles, "distinct")
    _attach_cardinality_denominator(dest_profiles, "observed_distinct")

    comparison = read_records(Path(args.comparison).resolve()) if args.comparison else []
    execution_mappings = []
    if getattr(args, "execution_evidence", None):
        execution_mappings = _select_execution_group(
            _load_execution_mappings(Path(args.execution_evidence).resolve()), dest_schema
        )

    out_dir = Path(args.out or "out/mapping-suggester").resolve()
    rows = suggestion_rows(
        source_profiles, dest_profiles, source_schema, dest_schema,
        comparison, dest_catalog, execution_mappings,
    )

    out_dir.mkdir(parents=True, exist_ok=True)
    mapping_writers.write_suggestions(rows, out_dir / "suggestions.csv", args.reset != "yes")
    mapping_writers.populate_approved_transforms(
        rows, Path(args.approved).resolve() if args.approved else None
    )
    mapping_writers.write_questions(rows, out_dir / "questions.md")
    mapping_writers.write_report(
        rows,
        {
            "label": args.label or "ERP to IVO",
            "sourceProfile": _relative(Path(args.erp_profile).resolve()),
            "destProfile": _relative(Path(args.ivo_profile).resolve())
            if getattr(args, "ivo_profile", None)
            else "IVO reference schema only",
            "comparison": _relative(Path(args.comparison).resolve()) if args.comparison else None,
            "generated": os.environ.get("IVO_GENERATED_AT") or _iso_now(),
        },
        out_dir / "report.md",
    )

    def count(status: str) -> int:
        return len([r for r in rows if r["status"] == status])

    print(f"{args.label or 'ERP → IVO'}: {len(rows)} destination fields")
    print(f"  recovered evidence: {count('recovered')}")
    print(f"  actual run evidence: {count('actual-run')}")
    print(f"  IVO reference:      {count('reference')}")
    print(f"  profile evidence:   {count('profiled')}")
    print(f"  new suggestions:    {count('suggested')}")
    print(f"  questions:          {count('question')}")
    print(f"  → {_relative(out_dir)}")
    return 0


def compare_exports(args) -> int:
    from . import comparison_writers
    from .comparing import DEFAULTS, Encoder, build_join, encode_columns, rank_join_keys, recover

    cfg = {
        "minAgreement": _num(getattr(args, "min_agreement", None), DEFAULTS["minAgreement"]),
        "minRows": _num(getattr(args, "min_rows", None), DEFAULTS["minRows"]),
        "minDistinct": _num(getattr(args, "min_distinct", None), DEFAULTS["minDistinct"]),
        "minJoin": _num(getattr(args, "min_join", None), DEFAULTS["minJoin"]),
    }

    source_file = Path(args.source).resolve()
    dest_file = Path(args.dest).resolve()
    out_dir = Path(args.out or "out/data-comparer").resolve()
    source_label = args.source_label or source_file.stem
    dest_label = args.dest_label or dest_file.stem

    src = read_table(source_file)
    dst = read_table(dest_file)

    enc = {name: Encoder() for name in ("raw", "trim", "upper", "loose")}
    src_cols = encode_columns(src.headers, src.frame, enc)
    dest_cols = encode_columns(dst.headers, dst.frame, enc)
    src_rows, dest_rows = src.frame.height, dst.frame.height

    key_ranking = rank_join_keys(src_cols, dest_cols, src_rows, dest_rows)
    source_key = getattr(args, "source_key", None)
    dest_key = getattr(args, "dest_key", None)
    if source_key or dest_key:
        s = next((c for c in src_cols if c.name == source_key), None)
        d = next((c for c in dest_cols if c.name == dest_key), None)
        if not s or not d:
            print(f"Key column not found: {source_key if not s else dest_key}", file=sys.stderr)
            return 1
        key = {"source": s, "dest": d, "matched": 0, "rate": 0.0, "duplicates": 0}
    else:
        key = key_ranking[0] if key_ranking else None

    if not key:
        print(
            "No join key candidate: neither export has a near-unique, high-cardinality column in common.",
            file=sys.stderr,
        )
        return 2

    si, di = build_join(key, src_rows, dest_rows)
    joined_rows = int(si.size)
    key["matched"] = joined_rows
    key["rate"] = joined_rows / dest_rows if dest_rows else 0.0

    if key["rate"] < cfg["minJoin"]:
        print(
            f"Best join (`{key['dest'].name}` = `{key['source'].name}`) reaches only "
            f"{pct(key['rate'])} of destination rows, below --min-join {pct(cfg['minJoin'])}. "
            "These two exports are probably not the same records.",
            file=sys.stderr,
        )
        return 2

    results = recover(src_cols, dest_cols, si, di, enc["upper"].vals, cfg, dest_rows)

    meta = {
        "sourceLabel": source_label, "destLabel": dest_label,
        "sourceFile": _relative(source_file), "destFile": _relative(dest_file),
        "srcRows": src_rows, "destRows": dest_rows,
        "srcCols": len(src_cols), "destCols": len(dest_cols),
        "srcRepaired": src.repaired, "destRepaired": dst.repaired,
        "srcQuarantined": len(src.quarantined), "destQuarantined": len(dst.quarantined),
        "joinedRows": joined_rows, "key": key, "cfg": cfg,
        "upperVals": enc["upper"].vals,
        "generated": os.environ.get("IVO_GENERATED_AT") or _iso_now(),
    }

    src_records = [["" if v is None else v for v in row] for row in src.frame.iter_rows()]
    dst_records = [["" if v is None else v for v in row] for row in dst.frame.iter_rows()]

    out_dir.mkdir(parents=True, exist_ok=True)
    comparison_writers.write_mapping_csv(results, meta, out_dir / "mapping.csv")
    comparison_writers.write_lookups_csv(results, enc["upper"].vals, out_dir / "lookups.csv")
    comparison_writers.write_value_evidence(
        results, si, di, src_records, dst_records, key, out_dir / "value-evidence.json"
    )
    comparison_writers.write_report(results, meta, key_ranking, src_cols, out_dir / "report.md")

    def count(kind: str) -> int:
        return len([r for r in results if r["kind"] == kind])

    print(f"{source_label} → {dest_label}")
    print(f"  join: {dest_label}.{key['dest'].name} = {source_label}.{key['source'].name}")
    print(f"  joined rows:        {joined_rows} of {dest_rows} ({pct(key['rate'])})")
    print(f"  recovered (direct): {count('direct')}")
    print(f"  recovered (lookup): {count('lookup')}")
    print(f"  constant:           {count('constant')}")
    print(f"  dest identifiers:   {count('identifier')}")
    print(f"  never populated:    {count('empty')}")
    print(f"  unexplained:        {count('unexplained')}")
    print(f"  → {_relative(out_dir)}")
    return 0
