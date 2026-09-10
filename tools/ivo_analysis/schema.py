"""Connector schema flattening. Port of tools/schema.js.

Flattens a draft-07 connector schema into one entry per field. Nested arrays
(e.g. Vista "Parts") are flattened with a dotted path and marked nested, since a
flat CSV export will not contain them.

Insertion order is preserved because the caller iterates these entries to report
schema fields missing from an export, and that ordering reaches generated files.
"""

from __future__ import annotations

from typing import Any


def _entry(
    path: str, name: str, definition: dict, types: list[str], is_required: bool, nested: bool, is_array: bool
) -> dict[str, Any]:
    raw_enum = definition.get("enum")
    return {
        "path": path,
        "name": name,
        "types": [t for t in types if t != "null"],
        "nullable": "null" in types,
        "maxLength": definition.get("maxLength"),
        "minLength": definition.get("minLength"),
        "pattern": definition.get("pattern"),
        "format": definition.get("format"),
        "enum": [v for v in raw_enum if v is not None] if raw_enum else None,
        "description": (definition.get("description") or "").strip(),
        "required": is_required,
        "writeOnly": definition.get("writeOnly") is True,
        "nested": nested,
        "isArray": is_array,
    }


def flatten_schema(schema: dict) -> dict[str, dict[str, Any]]:
    fields: dict[str, dict[str, Any]] = {}

    def walk(node: Any, prefix: str, nested: bool) -> None:
        if not isinstance(node, dict) or node.get("type") != "object" or not node.get("properties"):
            return
        required = set(node.get("required") or [])

        for name, definition in node["properties"].items():
            if not isinstance(definition, dict):
                continue
            path = f"{prefix}.{name}" if prefix else name
            raw_type = definition.get("type")
            types = list(raw_type) if isinstance(raw_type, list) else ([raw_type] if raw_type else [])

            if "array" in types and definition.get("items"):
                fields[path] = _entry(path, name, definition, types, name in required, nested, True)
                walk(definition["items"], path, True)
                continue

            if "object" in types and definition.get("properties"):
                fields[path] = _entry(path, name, definition, types, name in required, nested, False)
                walk(definition, path, True)
                continue

            fields[path] = _entry(path, name, definition, types, name in required, nested, False)

    walk(schema, "", False)
    return fields
