"""Shared formatting helpers whose output reaches generated files.

`pct` has to match JavaScript's Number.prototype.toFixed, not Python's format().
The two disagree on ties: JS rounds half away from zero, so (0.5).toFixed(0) is
"1", while Python's format() uses banker's rounding, so f"{0.5:.0f}" is "0".
Percentages appear in fields.csv, report.md and questions.md, so this difference
would show up as spurious diffs against the previous output for any value that
lands on a tie. Decimal(float) expands the exact binary value, which is what JS
also rounds from, and ROUND_HALF_UP then matches its tie behaviour.
"""

from __future__ import annotations

import re
from decimal import Decimal, ROUND_HALF_UP

_NEEDS_QUOTING = re.compile(r'[",\r\n]')


def js_to_fixed(value: float, digits: int = 1) -> str:
    quantum = Decimal(1).scaleb(-digits)
    return str(Decimal(value).quantize(quantum, rounding=ROUND_HALF_UP))


def pct(fraction: float) -> str:
    return js_to_fixed(fraction * 100, 1) + "%"


def to_csv_row(values: list) -> str:
    out = []
    for value in values:
        text = "" if value is None else str(value)
        out.append('"' + text.replace('"', '""') + '"' if _NEEDS_QUOTING.search(text) else text)
    return ",".join(out)
