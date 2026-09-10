"""Value classification and shape masking. Port of tools/stats.js.

`classify` names the kind of a single value; `mask` reduces a value to a coarse
shape signature so format drift is visible without reading the values themselves.
The regex table and the ordering of the checks are carried over unchanged --
ordering matters, since e.g. an ISO date also matches nothing else only because
uuid and date are tested before the numeric patterns.
"""

from __future__ import annotations

import re

RE = {
    "integer": re.compile(r"^[-+]?\d+$"),
    "decimal": re.compile(r"^[-+]?(?:\d+\.\d*|\.\d+|\d+)$"),
    "uuid": re.compile(
        r"^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$"
    ),
    "isoDate": re.compile(
        r"^\d{4}-\d{2}-\d{2}(?:[T ]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[-+]\d{2}:?\d{2})?)?$"
    ),
    "usDate": re.compile(r"^\d{1,2}/\d{1,2}/\d{2,4}$"),
    "email": re.compile(r"^[^\s@]+@[^\s@]+\.[^\s@]+$"),
    "phone": re.compile(r"^\+?\d?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$"),
    "ynFlag": re.compile(r"^[YN]$"),
    "boolWord": re.compile(r"^(?:true|false)$", re.IGNORECASE),
}

PLACEHOLDERS = frozenset(
    ["n/a", "na", "null", "none", "nil", "-", "--", "unknown", "tbd", ".", "#n/a"]
)


def classify(value: str) -> str:
    """Name the kind of a single trimmed value."""
    if RE["uuid"].match(value):
        return "uuid"
    if RE["isoDate"].match(value):
        return "date"
    if RE["usDate"].match(value):
        return "date"
    if RE["boolWord"].match(value):
        return "boolean"
    if RE["integer"].match(value):
        return "integer"
    if RE["decimal"].match(value):
        return "decimal"
    if RE["email"].match(value):
        return "email"
    if RE["phone"].match(value):
        return "phone"
    return "string"


def _class_of(ch: str) -> str:
    if ch.isdigit() and ch.isascii():
        return "9"
    if ch.isalpha() and ch.isascii():
        return "A"
    return ch


def mask(value: str) -> str:
    """"44440052WS" -> "9{8}A{2}" -- a coarse shape signature used to spot format drift."""
    out: list[str] = []
    i = 0
    n = len(value)
    while i < n:
        cls = _class_of(value[i])
        run = 1
        while i + run < n and _class_of(value[i + run]) == cls:
            run += 1
        out.append(f"{cls}{{{run}}}" if run > 1 else cls)
        i += run
    return "".join(out)
