"""CSV reading that preserves the exact semantics the Node reader established.

Two readers live here:

`tokenize`/`parse_csv` are a faithful port of tools/csv.js. That reader exists
because of three defects observed in a real Vista export, none of which a strict
RFC4180 parser survives:

  1. A quote appears mid-field unescaped (10" pipe) -> a quote only opens a
     field when it is the first character of that field.
  2. A quoted field contains inner quotes that are not doubled -> a quote only
     closes a field when the next character is a delimiter.
  3. Free-text fields contain raw newlines while unquoted, splitting one record
     over several lines -> short records are re-joined using the header count.

Records that still do not reach the header field count are quarantined rather
than padded, because a shifted row silently corrupts every column statistic.

`read_table` uses Polars' native reader, which is far faster and is what makes
large exports tractable, but only for files that a standard reader can be
trusted with. Values are always read as strings with no null inference, so
leading zeros, surrounding whitespace, and the distinction between an empty
string and a missing value survive exactly as docs/collecting-inputs.md requires.

Choosing the reader by catching an exception is not sufficient, and that is the
important finding here. Measured against the 32 exports in this repo:

  * 5 files make the native reader raise outright -- e.g. `"92" 6W BLADE"`
    (unescaped mid-field quote) and `"Attach Bucket Skeleton 66""` (undoubled
    inner quote). A try/except would catch these.
  * 2 more files parse without any error and come back **wrong**: the native
    reader silently swallows inner quote characters, turning
    `East Colfax Avenue Bus Rapid Transit ("Colfax-BRT") Project` into the same
    string without its quotes, and `"BROKEN NOT FIXABLE" - [...]` into
    `BROKEN NOT FIXABLE - [...]`. These are real value changes -- they alter
    lengths, masks, and distinct counts -- and no exception is raised.

So the reader is chosen up front by scanning for a quote that has a
non-delimiter on both sides, which cannot be a field opener or closer and so
marks a file the fast path would mishandle. On this corpus that predicate flags
all 7 problem files, misses none, and over-flags none, leaving 25 files on the
fast path.

The tolerant reader walks the text character by character in Python -- roughly
17x slower than the native reader (151 ms vs 8.7 ms on the 20,203-row Meter
export). That is fine at present sizes but would need revisiting if a malformed
export ever arrived at gigabyte scale.
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field
from pathlib import Path

import polars as pl

MAX_MERGE = 100


@dataclass
class Table:
    headers: list[str]
    frame: pl.DataFrame
    repaired: int = 0
    quarantined: list[dict] = field(default_factory=list)
    reader: str = "polars"

    @property
    def height(self) -> int:
        return self.frame.height


def tokenize(text: str) -> list[list[str]]:
    """Split raw CSV text into rows of fields, tolerating the three defects above."""
    rows: list[list[str]] = []
    row: list[str] = []
    buf: list[str] = []
    quoted = False
    i = 0
    n = len(text)

    def closes_here(j: int) -> bool:
        # A quote only closes a field when what follows is a delimiter or the end.
        nxt = text[j + 1] if j + 1 < n else None
        return nxt is None or nxt in (",", "\n", "\r")

    while i < n:
        c = text[i]

        if quoted:
            if c == '"':
                if i + 1 < n and text[i + 1] == '"':
                    buf.append('"')
                    i += 2
                    continue
                if closes_here(i):
                    quoted = False
                    i += 1
                    continue
                buf.append(c)
                i += 1
                continue
            buf.append(c)
            i += 1
            continue

        if c == '"' and not buf:
            quoted = True
            i += 1
            continue
        if c == ",":
            row.append("".join(buf))
            buf = []
            i += 1
            continue
        if c == "\r":
            i += 1
            continue
        if c == "\n":
            row.append("".join(buf))
            rows.append(row)
            row = []
            buf = []
            i += 1
            continue

        buf.append(c)
        i += 1

    if buf or row:
        row.append("".join(buf))
        rows.append(row)
    return rows


def parse_csv(text: str) -> tuple[list[str], list[list[str]], int, list[dict]]:
    """Port of tools/csv.js parseCsv. Returns (headers, records, repaired, quarantined)."""
    if text and ord(text[0]) == 0xFEFF:
        text = text[1:]

    rows = tokenize(text)
    if not rows:
        return [], [], 0, []

    headers = rows[0]
    want = len(headers)
    records: list[list[str]] = []
    quarantined: list[dict] = []
    repaired = 0

    i = 1
    while i < len(rows):
        if len(rows[i]) == 1 and rows[i][0] == "":  # blank line
            i += 1
            continue

        start_row = i
        cur = list(rows[i])
        merged = 0

        while len(cur) < want and i + 1 < len(rows) and merged < MAX_MERGE:
            nxt = rows[i + 1]
            if len(cur) - 1 + len(nxt) > want:
                break  # merging would overshoot — do not guess
            cur[-1] += "\n" + nxt[0]
            cur.extend(nxt[1:])
            i += 1
            merged += 1

        if merged:
            repaired += 1

        if len(cur) != want:
            quarantined.append(
                {
                    "row": start_row,
                    "fields": len(cur),
                    "expected": want,
                    "sample": cur[0] if cur else "",
                }
            )
            i += 1
            continue

        records.append(cur)
        i += 1

    return headers, records, repaired, quarantined


def _dedupe(headers: list[str]) -> list[str]:
    """Polars requires unique column names; real exports do repeat a header."""
    seen: dict[str, int] = {}
    out: list[str] = []
    for h in headers:
        if h in seen:
            seen[h] += 1
            out.append(f"{h}__{seen[h]}")
        else:
            seen[h] = 0
            out.append(h)
    return out


def _frame_from_records(headers: list[str], records: list[list[str]]) -> pl.DataFrame:
    cols = _dedupe(headers)
    if not records:
        return pl.DataFrame({c: pl.Series(c, [], dtype=pl.String) for c in cols})
    return pl.DataFrame(records, schema=[(c, pl.String) for c in cols], orient="row")


# A quote with a non-delimiter on both sides cannot be opening or closing a
# field, so the file needs the tolerant reader. See the module docstring.
_IRREGULAR_QUOTE = re.compile(rb'(?<=[^,\r\n"])"(?=[^,\r\n"])')
_SCAN_CHUNK = 1 << 20


def has_irregular_quotes(path: str | Path) -> bool:
    """Cheap byte scan deciding whether the native reader can be trusted."""
    tail = b""
    with open(path, "rb") as handle:
        while chunk := handle.read(_SCAN_CHUNK):
            if _IRREGULAR_QUOTE.search(tail + chunk):
                return True
            # Keep a few bytes so a match spanning a chunk boundary is not missed.
            tail = chunk[-4:]
    return False


def read_records(path: str | Path) -> list[dict[str, str]]:
    """Read a generated CSV as a list of header-keyed dicts, as readCsv() does in Node."""
    table = read_table(path)
    return table.frame.to_dicts()


def read_table(path: str | Path, *, force_tolerant: bool = False) -> Table:
    """Read a CSV as all-strings, using the fast native reader where it is safe."""
    path = Path(path)

    if not force_tolerant and not has_irregular_quotes(path):
        try:
            frame = pl.read_csv(
                path,
                has_header=True,
                infer_schema=False,  # every column stays a string
                null_values=None,
                empty_string_is_null=False,  # "" stays "", whitespace-only survives intact
                quote_char='"',
                encoding="utf8-lossy",
            )
            return Table(headers=list(frame.columns), frame=frame, reader="polars")
        except Exception:
            pass  # fall through to the tolerant reader

    # newline="" disables universal-newline translation. Without it Python rewrites
    # "\r\n" to "\n" before the tokenizer runs, which silently shortens every
    # multi-line free-text value and changes its length statistics.
    with open(path, "r", encoding="utf-8", errors="replace", newline="") as handle:
        text = handle.read()
    headers, records, repaired, quarantined = parse_csv(text)
    return Table(
        headers=headers,
        frame=_frame_from_records(headers, records),
        repaired=repaired,
        quarantined=quarantined,
        reader="tolerant",
    )
