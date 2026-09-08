'use strict';

// Minimal RFC4180 CSV reader with record repair.
//
// Three defects seen in the real Vista export, none of which a strict reader survives:
//   1. A quote appears mid-field unescaped (10" pipe) -> a quote only opens a
//      field when it is the first character of that field.
//   2. A quoted field contains inner quotes that are not doubled -> a quote only
//      closes a field when the next character is a delimiter.
//   3. Free-text fields contain raw newlines while unquoted, splitting one record
//      over several lines -> short records are re-joined using the header count.
//
// Records that still do not reach the header field count are quarantined rather
// than padded, because a shifted row silently corrupts every column statistic.

function tokenize(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  let i = 0;

  const closesHere = (j) => {
    const n = text[j + 1];
    return n === undefined || n === ',' || n === '\n' || n === '\r';
  };

  while (i < text.length) {
    const c = text[i];

    if (quoted) {
      if (c === '"') {
        if (text[i + 1] === '"') { field += '"'; i += 2; continue; }
        if (closesHere(i)) { quoted = false; i++; continue; }
        field += c; i++; continue;
      }
      field += c; i++; continue;
    }

    if (c === '"' && field === '') { quoted = true; i++; continue; }
    if (c === ',') { row.push(field); field = ''; i++; continue; }
    if (c === '\r') { i++; continue; }
    if (c === '\n') { row.push(field); rows.push(row); row = []; field = ''; i++; continue; }

    field += c; i++;
  }

  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  return rows;
}

const MAX_MERGE = 100;

function parseCsv(text) {
  if (text.charCodeAt(0) === 0xfeff) text = text.slice(1);

  const rows = tokenize(text);
  if (!rows.length) return { headers: [], records: [], repaired: 0, quarantined: [] };

  const headers = rows[0];
  const want = headers.length;
  const records = [];
  const quarantined = [];
  let repaired = 0;

  for (let i = 1; i < rows.length; i++) {
    if (rows[i].length === 1 && rows[i][0] === '') continue; // blank line

    const startRow = i;
    let cur = rows[i].slice();
    let merged = 0;

    while (cur.length < want && i + 1 < rows.length && merged < MAX_MERGE) {
      const next = rows[i + 1];
      if (cur.length - 1 + next.length > want) break; // merging would overshoot — do not guess
      cur[cur.length - 1] += '\n' + next[0];
      for (let k = 1; k < next.length; k++) cur.push(next[k]);
      i++;
      merged++;
    }

    if (merged) repaired++;

    if (cur.length !== want) {
      quarantined.push({ row: startRow, fields: cur.length, expected: want, sample: cur[0] });
      continue;
    }
    records.push(cur);
  }

  return { headers, records, repaired, quarantined };
}

function toCsvRow(values) {
  return values
    .map((v) => {
      const s = v === null || v === undefined ? '' : String(v);
      return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
    })
    .join(',');
}

module.exports = { parseCsv, toCsvRow };
