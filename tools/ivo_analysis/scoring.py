"""Mapping candidate scoring. Port of the scoring half of mapping-suggester.js.

This is a behaviour-preserving port. The value-derived signals and the widened
confidence gate are layered on top of it separately, so a regression in the port
can be told apart from a deliberate change in the scoring.

Three JavaScript behaviours are reproduced deliberately, because each one
silently changes generated output if it is left to Python's defaults:

  * Math.round rounds halves toward +Infinity; Python's round() is banker's
    rounding. Scores are rendered with Math.round(x * 100), so 0.125 -> "13%"
    in Node and "12%" in Python.
  * String.localeCompare orders case-insensitively and puts lowercase before
    uppercase ("a" < "B" < "b"), while Python compares code points ("B" < "a").
    This is the tie-break when two candidates score identically.
  * Number("") is 0 and Number("abc") is NaN, and NaN fails every comparison.
"""

from __future__ import annotations

import json
import math
import re
from functools import cmp_to_key
from typing import Any

ABBREVIATIONS = {
    "acct": "account", "addr": "address", "amt": "amount", "cat": "category",
    "co": "company", "code": "code", "desc": "description", "dept": "department",
    "dt": "date", "equip": "equipment", "id": "id", "mfr": "manufacturer",
    "no": "number", "num": "number", "qty": "quantity", "um": "unit measure", "yr": "year",
}

STOP_WORDS = {
    "a", "an", "and", "equipment", "for", "from", "id", "identifier", "of", "or",
    "the", "to", "value",
}

_CAMEL_1 = re.compile(r"([a-z0-9])([A-Z])")
_CAMEL_2 = re.compile(r"([A-Z]+)([A-Z][a-z])")
_NON_ALNUM = re.compile(r"[^a-z0-9]+")
_JS_IDENT = re.compile(r"^[A-Za-z_$][A-Za-z0-9_$]*$")
_TRUNCATE = re.compile(r"^truncate\((\d+)\)$")


def js_round(value: float) -> int:
    """Math.round: halves go toward +Infinity, unlike Python's banker's rounding."""
    return math.floor(value + 0.5)


def js_number(value: Any) -> float:
    """Number(v): "" is 0, unparseable is NaN."""
    if value is None:
        return math.nan
    text = str(value).strip()
    if text == "":
        return 0.0
    try:
        return float(text)
    except ValueError:
        return math.nan


def _locale_cmp(left: str, right: str) -> int:
    """Approximate String.localeCompare for the ASCII identifiers used as field names.

    Root collation compares case-insensitively first and orders lowercase before
    uppercase on ties, which is the opposite of Python's code-point ordering.
    """
    a = [(ch.lower(), ch.isupper()) for ch in left]
    b = [(ch.lower(), ch.isupper()) for ch in right]
    return -1 if a < b else (1 if a > b else 0)


def split_words(value: Any) -> list[str]:
    text = "" if value is None else str(value)
    text = _CAMEL_1.sub(r"\1 \2", text)
    text = _CAMEL_2.sub(r"\1 \2", text)
    out: list[str] = []
    for word in _NON_ALNUM.split(text.lower()):
        if not word:
            continue
        out.extend(ABBREVIATIONS.get(word, word).split(" "))
    return out


def tokens(*values: Any) -> set[str]:
    out: set[str] = set()
    for value in values:
        for word in split_words(value):
            if word not in STOP_WORDS:
                out.add(word)
    return out


def overlap(left: set[str], right: set[str]) -> float:
    if not left or not right:
        return 0.0
    common = sum(1 for token in left if token in right)
    return (2 * common) / (len(left) + len(right))


def normalized_name(value: Any) -> str:
    return "".join(split_words(value))


def pct_number(value: Any) -> float:
    number = js_number(str(value or "").replace("%", ""))
    return number / 100 if math.isfinite(number) else 0.0


def declared_types(field: dict | None, profile: dict) -> set[str]:
    if field and field.get("types"):
        return set(field["types"])
    return {t for t in str(profile.get("declared_type") or "").split("|") if t}


def observed_family(type_name: Any) -> str:
    if type_name in ("integer", "decimal"):
        return "number"
    if type_name in ("boolean", "yn"):
        return "boolean"
    if type_name in ("date", "datetime"):
        return "date"
    return type_name or ""


def type_compatibility(
    source_schema: dict | None, dest_schema: dict | None, source_profile: dict, dest_profile: dict
) -> dict:
    source_types = declared_types(source_schema, source_profile)
    dest_types = declared_types(dest_schema, dest_profile)
    if source_types and dest_types:
        for type_name in source_types:
            if type_name in dest_types:
                return {"score": 1, "note": "declared types match"}
        if "integer" in source_types and "number" in dest_types:
            return {"score": 1, "note": "integer fits number"}
        if "number" in source_types and "integer" in dest_types:
            return {"score": 0.55, "note": "number may require integer conversion"}
        if "string" in source_types or "string" in dest_types:
            return {"score": 0.55, "note": "string conversion may be required"}
        return {"score": 0, "note": "declared types are incompatible"}

    source_observed = observed_family(source_profile.get("observed_type"))
    dest_observed = observed_family(dest_profile.get("observed_type"))
    if not source_observed or not dest_observed:
        return {"score": 0.5, "note": "type evidence is incomplete"}
    return (
        {"score": 0.8, "note": "observed types match"}
        if source_observed == dest_observed
        else {"score": 0.2, "note": "observed types differ"}
    )


def length_compatibility(source_schema: dict | None, dest_schema: dict | None, source_profile: dict) -> dict:
    raw = js_number(source_profile.get("max_len"))
    source_max = raw if (math.isfinite(raw) and raw) else ((source_schema or {}).get("maxLength") or 0)
    source_max = source_max or 0
    dest_max = ((dest_schema or {}).get("maxLength") or 0) if dest_schema else 0
    if not source_max or not dest_max or source_max <= dest_max:
        return {"score": 1, "note": ""}
    return {"score": 0.45, "note": f"source length {source_max} exceeds destination max {dest_max}"}


# The original weights are left alone and value evidence is added as a bonus on
# top, rather than redistributing weight into a new channel. Redistributing was
# tried first and regressed four correct mappings -- among them
# employeeCode <- Employee_Code -- because lowering the semantic weight dropped
# good name matches below their tier threshold. An additive bonus can only raise
# a score, so no candidate can score worse than it did before.
BASE_WEIGHTS = {"semantic": 0.68, "type": 0.22, "length": 0.10}
VALUE_BONUS = 0.20


def _relative_cardinality(profile: dict, key: str, max_key: str) -> float | None:
    """Distinct count as a share of the widest column in the same object.

    Raw distinct counts are not comparable across tenants -- IGE has 5 departments
    where the IVO sample tenant has 38 divisions -- but "is this column
    identifier-like or flag-like relative to its own table" carries across.
    """
    distinct = js_number(profile.get(key))
    widest = js_number(profile.get(max_key))
    if not math.isfinite(distinct) or not math.isfinite(widest) or widest <= 0:
        return None
    return distinct / widest


def value_signals(source_profile: dict, dest_profile: dict) -> dict:
    """Shape signals computed from observed statistics on both sides.

    Only signals that are portable between different datasets are used, because
    the source is one customer's export and the destination is a different
    tenant's IVO data. Returns available=False when either side lacks observed
    evidence, which is what keeps scoring identical to the previous behaviour for
    destinations that have never been profiled.
    """
    signals: dict[str, float] = {}

    source_fill = pct_number(source_profile.get("fill_pct"))
    dest_fill_raw = dest_profile.get("observed_fill_pct")
    if dest_fill_raw not in (None, ""):
        signals["fillSimilarity"] = 1 - abs(source_fill - pct_number(dest_fill_raw))

    source_card = _relative_cardinality(source_profile, "distinct", "_max_distinct")
    dest_card = _relative_cardinality(dest_profile, "observed_distinct", "_max_distinct")
    if source_card is not None and dest_card is not None:
        signals["cardinalitySimilarity"] = 1 - abs(source_card - dest_card)

    if not signals:
        return {"available": False, "value": 0.0, "signals": {}}
    return {
        "available": True,
        "value": sum(signals.values()) / len(signals),
        "signals": signals,
    }


def score_candidate(source: dict, dest: dict) -> dict | None:
    source_name = normalized_name(source["profile"]["field"])
    dest_name = normalized_name(dest["profile"]["field"])
    exact_name = 1 if source_name == dest_name else 0
    name_score = overlap(tokens(source["profile"]["field"]), tokens(dest["profile"]["field"]))
    description_score = overlap(
        tokens(source["schema"]["description"] if source["schema"] else ""),
        tokens(dest["schema"]["description"] if dest["schema"] else ""),
    )
    type_result = type_compatibility(source["schema"], dest["schema"], source["profile"], dest["profile"])
    length_result = length_compatibility(source["schema"], dest["schema"], source["profile"])

    if type_result["score"] == 0:
        return None

    semantic = max(exact_name, name_score, description_score * 0.85)
    values = value_signals(source["profile"], dest["profile"])

    w = BASE_WEIGHTS
    score = (
        semantic * w["semantic"]
        + type_result["score"] * w["type"]
        + length_result["score"] * w["length"]
    )
    boosted = min(1.0, score + values["value"] * VALUE_BONUS) if values["available"] else score

    evidence: list[str] = []
    if exact_name:
        evidence.append("normalized names match")
    elif name_score > 0:
        evidence.append(f"name overlap {js_round(name_score * 100)}%")
    if description_score > 0:
        evidence.append(f"description overlap {js_round(description_score * 100)}%")
    evidence.append(type_result["note"])
    if length_result["note"]:
        evidence.append(length_result["note"])
    if values["available"]:
        for name, label in (
            ("fillSimilarity", "fill"),
            ("cardinalitySimilarity", "cardinality"),
        ):
            if name in values["signals"]:
                evidence.append(f"{label} match {js_round(values['signals'][name] * 100)}%")

    return {
        "source": source,
        "score": score,
        "boosted": boosted,
        "semantic": semantic,
        "value": values["value"] if values["available"] else 0.0,
        "valueAvailable": values["available"],
        "type": type_result["score"],
        "evidence": [e for e in evidence if e],
    }


def confidence(best: dict, second: dict | None) -> str:
    """Tier a candidate. Value evidence may raise a tier but never lower one.

    The original gate required semantic evidence at every tier, so a destination
    sharing no name tokens with any source column could not be tiered at all,
    however strong the rest of the evidence was. With IVO's field descriptions
    empty that is what leaves most fields unresolved -- IGE departments resolves
    1 of 12.

    Two constraints shape the fix, both learned by measuring rather than assuming:

      * Ranking and the base score are left exactly as they were. Redistributing
        weight into a value channel, and then adding value as a bonus, each
        regressed correct mappings (employeeCode <- Employee_Code among them):
        boosting every candidate compresses the margin between first and second,
        and the margin is part of the gate.
      * Value evidence alone tops out at 'low', which routes the row to
        questions.md rather than proposing it. Allowing it to reach 'medium'
        produced confident nonsense -- accountingCode <- PRStateCode,
        isVehicle <- GrossVehicleWeight -- because fill and relative cardinality
        are generic enough that unrelated columns match on them.

    So the gain here is better questions, not more auto-resolved rows: a question
    now names a ranked candidate and says what supports it.
    """
    margin = best["score"] - (second["score"] if second else 0)

    if best["score"] >= 0.82 and best["semantic"] >= 0.75 and margin >= 0.12:
        return "high"
    if best["score"] >= 0.62 and best["semantic"] >= 0.45 and margin >= 0.08:
        return "medium"
    if best["score"] >= 0.45 and best["semantic"] >= 0.25:
        return "low"

    # Nothing tiered on semantics. Accept value corroboration, capped at 'low'.
    if best.get("valueAvailable") and best["boosted"] >= 0.45 and best["value"] >= 0.55:
        return "low"
    return ""


def property_access(root: str, field: str) -> str:
    return f"{root}.{field}" if _JS_IDENT.match(field) else f"{root}[{json.dumps(field)}]"


def todo(message: str) -> str:
    return f"flow.todo({json.dumps(message)})"


def value_handling(
    row: dict, source_profiles: dict[str, dict], source_schema: dict, dest_schema: dict
) -> str:
    destination = dest_schema.get(row["destField"])
    source = source_schema.get(row["sourceField"])
    source_profile = source_profiles.get(row["sourceField"], {})

    if not row["sourceField"] and (
        row["destField"].lower() == "uuid" or (destination or {}).get("format") == "uuid"
    ):
        return "uuid.v4()"
    if row["kind"] == "empty":
        return "null"
    if row["kind"] == "constant":
        return property_access("flow.config", row["destField"])
    if row["kind"] == "lookup-candidate":
        return todo(
            f"Add a lookup step for {row['sourceField']}, then map output[0].{row['destField']}"
        )
    if not row["sourceField"]:
        return todo(
            f"IVO supplies {row['destField']}; remove this field from the map if it is system-owned"
            if row["status"] == "reference"
            else f"Select a source for {row['destField']}"
        )

    source_expression = property_access("flow.mapItem()", row["sourceField"])
    source_types = declared_types(source, source_profile)
    destination_types = declared_types(destination, {})
    destination_nullable = destination["nullable"] if destination else False
    fallback = "null" if destination_nullable else "''"
    comparison_transform = row.get("comparisonTransform") or ""

    if comparison_transform == "identity":
        return source_expression
    if comparison_transform == "trim":
        return f"{source_expression}?.trim() ?? {fallback}"
    if comparison_transform == "uppercase":
        return f"{source_expression}?.trim().toUpperCase() ?? {fallback}"
    if comparison_transform == "lowercase":
        return f"{source_expression}?.trim().toLowerCase() ?? {fallback}"
    truncation = _TRUNCATE.match(comparison_transform)
    if truncation:
        return f"{source_expression}?.trim().slice(0, {truncation.group(1)}) ?? {fallback}"
    if comparison_transform in ("case-insensitive match", "whitespace or punctuation normalisation"):
        return todo(
            f"Confirm {comparison_transform} for {row['sourceField']} before mapping {row['destField']}"
        )

    if destination and destination.get("format") == "date":
        tail = "null" if destination_nullable else "''"
        return f"{source_expression} ? dayjs({source_expression}).format('YYYY-MM-DD') : {tail}"
    if "integer" in destination_types or "number" in destination_types:
        if "integer" in source_types or "number" in source_types:
            return source_expression
        return f"({source_expression}?.trim() ?? '') === '' ? null : numeral({source_expression}).value()"
    if "string" in destination_types:
        string_expression = (
            source_expression if "string" in source_types else f"{source_expression}?.toString()"
        )
        trimmed = f"{string_expression}?.trim()"
        max_length = destination.get("maxLength") if destination else None
        bounded = f"{trimmed}.slice(0, {max_length})" if max_length else trimmed
        return f"{bounded} ?? {'null' if destination_nullable else chr(39) * 2}"
    if "boolean" in destination_types and "boolean" not in source_types:
        return todo(f"Convert {row['sourceField']} to a boolean for {row['destField']}")
    return source_expression


def suggestion_rows(
    source_profiles: list[dict],
    dest_profiles: list[dict],
    source_schema: dict,
    dest_schema: dict,
    comparison: list[dict],
    dest_catalog: dict[str, dict],
    execution_mappings: list[dict] | None = None,
) -> list[dict]:
    execution_mappings = execution_mappings or []
    comparison_by_dest = {row["dest_field"]: row for row in comparison}

    execution_by_dest: dict[str, dict] = {}
    for mapping in execution_mappings:
        existing = execution_by_dest.get(mapping["destinationField"])
        if not existing or mapping["operation"] == "update":
            execution_by_dest[mapping["destinationField"]] = mapping

    source_profiles_by_field = {p["field"]: p for p in source_profiles}
    sources = [
        {"profile": p, "schema": source_schema.get(p["field"])}
        for p in source_profiles
        if p.get("field") and p.get("is_constant") != "yes" and js_number(p.get("populated")) > 0
    ]

    rows: list[dict] = []
    for profile in dest_profiles:
        dest = {"profile": profile, "schema": dest_schema.get(profile["field"])}
        catalog = dest_catalog.get(profile["field"])
        execution = execution_by_dest.get(profile["field"])

        if execution:
            source_field = next(
                (f for f in execution["sourceFields"] if f in source_profiles_by_field), ""
            )
            lookup = execution["lookupSteps"]
            rows.append({
                "destField": profile["field"],
                "sourceField": source_field,
                "kind": execution["kind"],
                "transform": execution["expression"],
                "status": "actual-run",
                "confidence": "high",
                "score": "",
                "alternatives": "; ".join(f for f in execution["sourceFields"] if f != source_field),
                "rationale": (
                    f"Recovered from Trimble {execution['operation']} action "
                    f"{execution['actionStepId']}"
                    + (f" via {', '.join(lookup)}." if lookup else ".")
                ),
            })
            continue

        known = comparison_by_dest.get(profile["field"])
        if known and known.get("kind") != "unexplained":
            notes = known.get("notes") or ""
            transform = known.get("transform") or ""
            rationale = " ".join(
                p for p in [notes, f"Comparison indicates {transform}." if transform else ""] if p
            )
            rows.append({
                "destField": profile["field"],
                "sourceField": known.get("source_field", ""),
                "kind": known.get("kind"),
                "transform": "",
                "comparisonTransform": transform,
                "status": "recovered",
                "confidence": known.get("confidence", ""),
                "score": known.get("agreement", ""),
                "alternatives": known.get("alternates", ""),
                "rationale": rationale or "Recovered from paired ERP and IVO values.",
            })
            continue

        if catalog and catalog.get("status") == "usable" and (
            catalog.get("ownership") == "ivo" or catalog.get("mapping_behavior") == "generated"
        ):
            rows.append({
                "destField": profile["field"],
                "sourceField": "",
                "kind": catalog.get("mapping_behavior") or "ivo-owned",
                "transform": "",
                "status": "reference",
                "confidence": "high",
                "score": "",
                "alternatives": "",
                "rationale": catalog.get("notes") or "IVO reference marks this field as IVO-owned.",
            })
            continue

        raw_populated = profile.get("populated")
        has_observed_profile = raw_populated is not None and raw_populated != ""
        if has_observed_profile and (
            js_number(raw_populated) == 0 or profile.get("is_constant") == "yes"
        ):
            is_empty = js_number(raw_populated) == 0
            rows.append({
                "destField": profile["field"],
                "sourceField": "",
                "kind": "empty" if is_empty else "constant",
                "transform": "",
                "status": "profiled",
                "confidence": "",
                "score": "",
                "alternatives": "",
                "rationale": (
                    "Destination field is never populated in this export."
                    if is_empty
                    else "Destination field is constant in this export; confirm whether it is "
                         "configuration or a hardcoded value."
                ),
            })
            continue

        dest_words = set(split_words(profile["field"]))
        if (
            has_observed_profile
            and profile.get("is_unique") == "yes"
            and pct_number(profile.get("fill_pct")) >= 0.9
            and ("id" in dest_words or "uuid" in dest_words)
        ):
            rows.append({
                "destField": profile["field"],
                "sourceField": "",
                "kind": "identifier",
                "transform": "",
                "status": "profiled",
                "confidence": "",
                "score": "",
                "alternatives": "",
                "rationale": "Destination field is unique and nearly fully populated; it is "
                             "likely generated by IVO.",
            })
            continue

        scored = [c for c in (score_candidate(s, dest) for s in sources) if c]
        ranked = sorted(
            scored,
            key=cmp_to_key(
                lambda a, b: (
                    -1 if b["score"] - a["score"] < 0 else (1 if b["score"] - a["score"] > 0 else 0)
                )
                or _locale_cmp(a["source"]["profile"]["field"], b["source"]["profile"]["field"])
            ),
        )
        best = ranked[0] if ranked else None
        level = confidence(best, ranked[1] if len(ranked) > 1 else None) if best else ""
        alternatives = "; ".join(
            f"{c['source']['profile']['field']} {js_round(c['score'] * 100)}%"
            for c in ranked[1:4]
            if c["score"] >= 0.4
        )

        if not best or not level:
            rows.append({
                "destField": profile["field"],
                "sourceField": "",
                "kind": known.get("kind") if known else "unresolved",
                "transform": "",
                "status": "question",
                "confidence": "",
                "score": f"{js_round(best['score'] * 100)}%" if best else "",
                "alternatives": alternatives,
                "rationale": (
                    f"No candidate has enough semantic evidence. Best candidate "
                    f"{best['source']['profile']['field']}: {'; '.join(best['evidence'])}."
                    if best
                    else "No compatible populated source field was found."
                ),
            })
            continue

        source_words = set(split_words(best["source"]["profile"]["field"]))
        kind = (
            "lookup-candidate"
            if (catalog and catalog.get("mapping_behavior") == "lookup")
            or ("id" in dest_words and "id" not in source_words)
            else "suggested"
        )
        rationale = list(best["evidence"])
        if kind == "lookup-candidate":
            rationale.append("destination identifier likely requires a lookup")

        rows.append({
            "destField": profile["field"],
            "sourceField": best["source"]["profile"]["field"],
            "kind": kind,
            "transform": "",
            "status": "question" if level == "low" else "suggested",
            "confidence": level,
            "score": f"{js_round(best['score'] * 100)}%",
            "alternatives": alternatives,
            "rationale": "; ".join(rationale),
        })

    for row in rows:
        row["transform"] = row["transform"] or value_handling(
            row, source_profiles_by_field, source_schema, dest_schema
        )
    return rows
