'use strict';

// Recovers the mapping that an existing integration is already running, from two
// exports of the same object — the ERP side (source) and the IVO side (destination).
//
//   1. Find the join key: the source/destination column pair that lines the two
//      exports up on the most rows.
//   2. For every source/destination column pair, compare values on joined rows.
//   3. Report agreement, coverage, and the least transformation that explains the
//      agreement (identity, trim, case, format, truncate).
//   4. Label what value comparison cannot explain: lookup-backed IDs, constants,
//      and fields the destination fills from somewhere else.
//
// Guardrails, because a confident wrong mapping costs more than no mapping:
//   - Low-cardinality agreement is evidence of nothing. It is reported separately,
//     never as a recovered mapping.
//   - Agreement is always published next to the row counts behind it.
//   - Rows where one side is empty are excluded from agreement and counted on their
//     own, so a 100%-agreeing field that only covers 40 rows cannot look complete.

const fs = require('fs');
const path = require('path');
const { parseCsv, toCsvRow } = require('./csv');
const { profileColumn } = require('./stats');

const DEFAULTS = {
  minAgreement: 0.9, // share of compared rows that must agree
  minRows: 30, // compared rows required before agreement means anything
  minDistinct: 5, // distinct agreeing values required — guards against constant "matches"
  minJoin: 0.5, // share of destination rows the join key must reach
};

const MIN_KEY_DISTINCT = 20;

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 2) {
    if (!argv[i].startsWith('--')) throw new Error(`Unexpected argument: ${argv[i]}`);
    args[argv[i].slice(2)] = argv[i + 1];
  }
  return args;
}

function pct(n) {
  return (n * 100).toFixed(1) + '%';
}

function num(v, fallback) {
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

// ---------------------------------------------------------------- normalisation

function canonNumber(v) {
  if (!/^[-+]?(?:\d+\.?\d*|\.\d+)$/.test(v)) return null;
  const n = Number(v);
  return Number.isFinite(n) ? String(n) : null;
}

function canonDate(v) {
  let m = /^(\d{4})-(\d{2})-(\d{2})/.exec(v);
  if (m) return `${m[1]}-${m[2]}-${m[3]}`;
  m = /^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/.exec(v);
  if (m) {
    const y = m[3].length === 2 ? (Number(m[3]) >= 70 ? '19' : '20') + m[3] : m[3];
    return `${y}-${m[1].padStart(2, '0')}-${m[2].padStart(2, '0')}`;
  }
  return null;
}

// Collapses everything that is a formatting choice rather than a value, so that
// "0001" / "1", "1/2/2020" / "2020-01-02T00:00:00" and "Y" / "true" all meet.
function canonLoose(t) {
  const u = t.toUpperCase();
  if (u === 'Y' || u === 'YES' || u === 'TRUE') return '1';
  if (u === 'N' || u === 'NO' || u === 'FALSE') return '0';
  const n = canonNumber(t);
  if (n !== null) return n;
  const d = canonDate(t);
  if (d !== null) return d;
  return u.replace(/\s+/g, ' ');
}

// One dictionary per normalisation level, shared across both files, so a column
// comparison is integer equality instead of string equality.
function encoder() {
  const map = new Map();
  const vals = [];
  return {
    vals,
    code(v) {
      let c = map.get(v);
      if (c === undefined) {
        c = vals.length;
        vals.push(v);
        map.set(v, c);
      }
      return c;
    },
  };
}

function encodeColumns(table, enc) {
  return table.headers.map((name, idx) => {
    const values = table.records.map((r) => r[idx]);
    const stat = profileColumn(name, values);
    const n = values.length;
    const raw = new Int32Array(n);
    const trim = new Int32Array(n);
    const upper = new Int32Array(n);
    const loose = new Int32Array(n);
    let hasLower = false;
    let hasUpper = false;

    for (let i = 0; i < n; i++) {
      const t = values[i].trim();
      if (t === '') {
        raw[i] = trim[i] = upper[i] = loose[i] = -1;
        continue;
      }
      const u = t.toUpperCase();
      if (t !== u) hasLower = true;
      if (t !== t.toLowerCase()) hasUpper = true;
      raw[i] = enc.raw.code(values[i]);
      trim[i] = enc.trim.code(t);
      upper[i] = enc.upper.code(u);
      loose[i] = enc.loose.code(canonLoose(t));
    }

    return { name, idx, stat, codes: { raw, trim, upper, loose }, allUpper: !hasLower, allLower: !hasUpper };
  });
}

function carriesInformation(c) {
  return c.stat.populated > 0 && !c.stat.isConstant;
}

// ------------------------------------------------------------------------ join

function rankJoinKeys(srcCols, destCols, srcRows, destRows) {
  const srcKeys = srcCols.filter(
    (c) =>
      c.stat.populated / srcRows >= 0.9 &&
      c.stat.distinct >= MIN_KEY_DISTINCT &&
      c.stat.distinct / c.stat.populated >= 0.98,
  );
  const destKeys = destCols.filter(
    (c) => c.stat.populated / destRows >= 0.5 && c.stat.distinct >= MIN_KEY_DISTINCT,
  );

  const results = [];
  for (const s of srcKeys) {
    const index = new Map();
    let duplicates = 0;
    for (let i = 0; i < srcRows; i++) {
      const c = s.codes.upper[i];
      if (c < 0) continue;
      if (index.has(c)) duplicates++;
      else index.set(c, i);
    }
    for (const d of destKeys) {
      let matched = 0;
      for (let i = 0; i < destRows; i++) {
        const c = d.codes.upper[i];
        if (c >= 0 && index.has(c)) matched++;
      }
      results.push({ source: s, dest: d, matched, rate: matched / destRows, duplicates });
    }
  }
  results.sort((a, b) => b.matched - a.matched || a.source.name.localeCompare(b.source.name));
  return results;
}

function buildJoin(key, srcRows, destRows) {
  const index = new Map();
  for (let i = 0; i < srcRows; i++) {
    const c = key.source.codes.upper[i];
    if (c >= 0 && !index.has(c)) index.set(c, i);
  }
  const pairs = [];
  for (let i = 0; i < destRows; i++) {
    const c = key.dest.codes.upper[i];
    if (c < 0) continue;
    const si = index.get(c);
    if (si !== undefined) pairs.push(si, i);
  }
  return Int32Array.from(pairs);
}

// ------------------------------------------------------------------ comparison

function compare(d, s, joined, upperVals) {
  // Truncation is only plausible when the destination is the narrower field.
  const checkPrefix = d.stat.maxLen > 0 && d.stat.maxLen < s.stat.maxLen;

  const dR = d.codes.raw, dT = d.codes.trim, dU = d.codes.upper, dL = d.codes.loose;
  const sR = s.codes.raw, sT = s.codes.trim, sU = s.codes.upper, sL = s.codes.loose;

  let both = 0, raw = 0, trim = 0, upper = 0, loose = 0, prefix = 0, srcOnly = 0, destOnly = 0;
  const agreeVals = new Set();
  const prefixVals = checkPrefix ? new Set() : null;

  for (let j = 0; j < joined.length; j += 2) {
    const si = joined[j];
    const di = joined[j + 1];
    const dl = dL[di];
    const sl = sL[si];

    if (dl < 0) {
      if (sl >= 0) srcOnly++;
      continue;
    }
    if (sl < 0) {
      destOnly++;
      continue;
    }
    both++;

    if (sl === dl) {
      loose++;
      agreeVals.add(dl);
      // raw ⊂ trim ⊂ upper ⊂ loose, so the cheap check gates the cheaper ones.
      if (sU[si] === dU[di]) {
        upper++;
        if (sT[si] === dT[di]) {
          trim++;
          if (sR[si] === dR[di]) raw++;
        }
      }
      if (checkPrefix) {
        prefix++;
        prefixVals.add(dl);
      }
    } else if (checkPrefix) {
      const a = upperVals[dU[di]];
      const b = upperVals[sU[si]];
      if (a.length < b.length && b.startsWith(a)) {
        prefix++;
        prefixVals.add(dU[di]);
      }
    }
  }

  return {
    source: s,
    both, raw, trim, upper, loose, prefix, srcOnly, destOnly,
    agreement: both ? loose / both : 0,
    prefixRate: both ? prefix / both : 0,
    distinct: agreeVals.size,
    prefixDistinct: prefixVals ? prefixVals.size : 0,
  };
}

function caseLabel(d, s) {
  if (d.allUpper && !s.allUpper) return 'uppercase';
  if (d.allLower && !s.allLower) return 'lowercase';
  return 'case-insensitive match';
}

function formatLabel(d, s) {
  const dt = d.stat.dominantType;
  const st = s.stat.dominantType;
  const set = new Set([dt, st]);
  if (set.has('date')) {
    const a = s.stat.topMasks[0] ? s.stat.topMasks[0][0] : '?';
    const b = d.stat.topMasks[0] ? d.stat.topMasks[0][0] : '?';
    return `date reformat (${a} → ${b})`;
  }
  if (set.has('yn') || set.has('boolean')) return 'boolean cast';
  if (set.has('integer') || set.has('decimal')) return 'numeric reformat (leading zeros / decimals)';
  return 'whitespace or punctuation normalisation';
}

function describe(r, d, s, cfg) {
  if (r.both < 1) return null;
  if (r.agreement >= cfg.minAgreement) {
    let transform;
    if (r.raw === r.loose) transform = 'identity';
    else if (r.trim === r.loose) transform = 'trim';
    else if (r.upper === r.loose) transform = caseLabel(d, s);
    else transform = formatLabel(d, s);
    return { transform, score: r.agreement, distinct: r.distinct, kind: 'direct' };
  }
  if (r.prefixRate >= cfg.minAgreement && r.prefix > r.loose) {
    return {
      transform: `truncate(${d.stat.maxLen})`,
      score: r.prefixRate,
      distinct: r.prefixDistinct,
      kind: 'direct',
    };
  }
  return null;
}

// ---------------------------------------------------------------------- lookups

// A destination field whose values never match the source can still be derived from
// it through a lookup table — every distinct source value maps to exactly one
// destination value. That is the signature of an ID resolved from a name.
//
// The guard that matters here is repetition. If the source column is near-unique the
// functional dependency holds by construction and proves nothing, so both sides must
// be code tables: values seen, on average, at least twice over the compared rows.
const LOOKUP_MAX_CARDINALITY = 0.5;

function findLookup(d, srcCols, joined, cfg) {
  const out = [];
  for (const s of srcCols) {
    const fwd = new Map();
    const rev = new Set();
    let both = 0;
    let conflict = 0;

    for (let j = 0; j < joined.length; j += 2) {
      const su = s.codes.upper[joined[j]];
      const du = d.codes.upper[joined[j + 1]];
      if (su < 0 || du < 0) continue;
      both++;
      rev.add(du);
      const seen = fwd.get(su);
      if (seen === undefined) fwd.set(su, du);
      else if (seen !== du) conflict++;
    }

    if (both < cfg.minRows) continue;
    if (fwd.size < 2 || rev.size < 3) continue;
    if (fwd.size > both * LOOKUP_MAX_CARDINALITY) continue;
    if (rev.size > both * LOOKUP_MAX_CARDINALITY) continue;
    const rate = 1 - conflict / both;
    if (rate < 0.98) continue;

    out.push({ source: s, both, conflict, rate, srcDistinct: fwd.size, destDistinct: rev.size, fwd });
  }
  out.sort(
    (a, b) =>
      Math.abs(a.srcDistinct - a.destDistinct) - Math.abs(b.srcDistinct - b.destDistinct) ||
      b.rate - a.rate ||
      b.destDistinct - a.destDistinct,
  );
  return out[0] || null;
}

// ------------------------------------------------------------------- assembling

function confidenceOf(score, rows, distinct) {
  if (score >= 0.99 && rows >= 200 && distinct >= 25) return 'high';
  if (score >= 0.95 && rows >= 100 && distinct >= 10) return 'medium';
  return 'low';
}

function isSurrogateKey(c, rows) {
  return c.stat.populated / rows >= 0.9 && c.stat.distinct / c.stat.populated >= 0.98;
}

function recover(srcCols, destCols, joined, upperVals, cfg, destRows) {
  const joinedRows = joined.length / 2;
  const usableSrc = srcCols.filter(carriesInformation);
  const rows = [];

  for (const d of destCols) {
    if (d.stat.populated === 0) {
      rows.push({ dest: d, kind: 'empty', notes: 'Never populated in this export.' });
      continue;
    }
    if (d.stat.isConstant) {
      rows.push({
        dest: d,
        kind: 'constant',
        value: d.stat.topValues[0][0],
        notes: `Single value on every populated row (${d.stat.populated} rows).`,
      });
      continue;
    }

    const accepted = [];
    const weak = [];
    for (const s of usableSrc) {
      const r = compare(d, s, joined, upperVals);
      const hit = describe(r, d, s, cfg);
      if (!hit) continue;
      const cand = { ...r, ...hit };
      if (r.both >= cfg.minRows && hit.distinct >= cfg.minDistinct) accepted.push(cand);
      else weak.push(cand);
    }

    const rank = (a, b) => b.score - a.score || b.distinct - a.distinct || b.both - a.both;
    accepted.sort(rank);
    weak.sort(rank);

    if (accepted.length) {
      const best = accepted[0];
      rows.push({
        dest: d,
        kind: 'direct',
        best,
        alternates: accepted.slice(1, 4),
        weak,
        confidence: confidenceOf(best.score, best.both, best.distinct),
      });
      continue;
    }

    const lookup = findLookup(d, usableSrc, joined, cfg);
    if (lookup) {
      rows.push({
        dest: d,
        kind: 'lookup',
        lookup,
        weak,
        confidence: confidenceOf(lookup.rate, lookup.both, lookup.destDistinct),
      });
      continue;
    }

    if (isSurrogateKey(d, destRows)) {
      rows.push({
        dest: d,
        kind: 'identifier',
        weak,
        notes: 'Unique per row and unrelated to any source value — generated on the destination side.',
      });
      continue;
    }

    rows.push({ dest: d, kind: 'unexplained', weak });
  }

  return rows;
}

// ---------------------------------------------------------------------- output

function writeMappingCsv(results, meta, file) {
  const header = [
    'dest_field', 'kind', 'source_field', 'transform', 'agreement', 'rows_compared',
    'rows_joined', 'coverage', 'distinct_agreeing', 'confidence', 'dest_fill',
    'source_only_rows', 'dest_only_rows', 'alternates', 'notes',
  ];
  const out = results.map((r) => {
    const d = r.dest;
    const base = [d.name, r.kind];
    if (r.kind === 'direct') {
      const b = r.best;
      return toCsvRow([
        ...base, b.source.name, b.transform, pct(b.score), b.both, meta.joinedRows,
        pct(b.both / meta.joinedRows), b.distinct, r.confidence, pct(d.stat.fill),
        b.srcOnly, b.destOnly,
        r.alternates.map((a) => `${a.source.name} ${pct(a.score)}`).join('; '),
        d.stat.whitespaceOnly ? `${d.stat.whitespaceOnly} whitespace-only value(s) in destination` : '',
      ]);
    }
    if (r.kind === 'lookup') {
      const l = r.lookup;
      return toCsvRow([
        ...base, l.source.name, `lookup (${l.srcDistinct} → ${l.destDistinct} values)`,
        pct(l.rate), l.both, meta.joinedRows, pct(l.both / meta.joinedRows), l.destDistinct,
        r.confidence, pct(d.stat.fill), '', '', '',
        'Value-translated — needs the lookup table, not a transform.',
      ]);
    }
    return toCsvRow([
      ...base, '', '', '', '', meta.joinedRows, '', d.stat.distinct, '', pct(d.stat.fill),
      '', '', '', r.notes || 'No source column explains these values.',
    ]);
  });
  fs.writeFileSync(file, [toCsvRow(header), ...out].join('\n') + '\n');
}

function writeLookupsCsv(results, upperVals, file) {
  const header = ['dest_field', 'source_field', 'source_value', 'dest_value', 'confidence'];
  const rows = [];
  for (const result of results) {
    if (result.kind !== 'lookup') continue;
    for (const [sourceValue, destValue] of result.lookup.fwd.entries()) {
      rows.push(toCsvRow([
        result.dest.name,
        result.lookup.source.name,
        upperVals[sourceValue],
        upperVals[destValue],
        result.confidence,
      ]));
    }
  }
  fs.writeFileSync(file, [toCsvRow(header), ...rows].join('\n') + '\n');
}

function valuesMatch(result, sourceValue, destValue, sourceRow, destRow) {
  const source = sourceValue.trim();
  const dest = destValue.trim();
  if (result.kind === 'lookup') return result.lookup.fwd.get(result.lookup.source.codes.upper[sourceRow]) === result.dest.codes.upper[destRow];
  const transform = result.best.transform;
  if (transform === 'identity') return sourceValue === destValue;
  if (transform === 'trim') return source === dest;
  if (transform === 'uppercase' || transform === 'lowercase' || transform === 'case-insensitive match') return source.toUpperCase() === dest.toUpperCase();
  const truncation = /^truncate\((\d+)\)$/.exec(transform);
  if (truncation) return source.slice(0, Number(truncation[1])).toUpperCase() === dest.toUpperCase();
  return canonLoose(source) === canonLoose(dest);
}

function writeValueEvidence(results, joined, src, dst, key, file) {
  const evidence = {};
  for (const result of results) {
    const comparison = result.kind === 'direct' ? result.best : result.kind === 'lookup' ? result.lookup : null;
    if (!comparison?.source) continue;
    const matched = [];
    const unmatched = [];
    const seenMatched = new Set();
    const seenUnmatched = new Set();
    let matchedRows = 0;
    let unmatchedRows = 0;

    for (let index = 0; index < joined.length; index += 2) {
      const sourceRow = joined[index];
      const destRow = joined[index + 1];
      const sourceValue = src.records[sourceRow][comparison.source.idx] || '';
      const destValue = dst.records[destRow][result.dest.idx] || '';
      let reason;
      let isMatch = false;
      if (!sourceValue.trim() && !destValue.trim()) reason = 'Both values are blank';
      else if (!sourceValue.trim()) reason = 'Customer value is blank';
      else if (!destValue.trim()) reason = 'IVO value is blank';
      else {
        isMatch = valuesMatch(result, sourceValue, destValue, sourceRow, destRow);
        reason = isMatch
          ? result.kind === 'lookup' ? 'Lookup value matches' : `Matches after ${result.best.transform}`
          : result.kind === 'lookup' ? 'Lookup value differs' : `Values differ after ${result.best.transform}`;
      }
      if (!sourceValue.trim() && !destValue.trim()) continue;
      const target = isMatch ? matched : unmatched;
      const seen = isMatch ? seenMatched : seenUnmatched;
      if (isMatch) matchedRows++;
      else unmatchedRows++;
      const signature = `${sourceValue}\u0000${destValue}\u0000${reason}`;
      if (target.length < 100 && !seen.has(signature)) {
        seen.add(signature);
        target.push({
          recordKey: src.records[sourceRow][key.source.idx] || dst.records[destRow][key.dest.idx] || '',
          sourceValue,
          destValue,
          reason,
        });
      }
    }
    evidence[result.dest.name] = {
      destField: result.dest.name,
      sourceField: comparison.source.name,
      matchedRows,
      unmatchedRows,
      matched,
      unmatched,
      sampleLimit: 100,
    };
  }
  fs.writeFileSync(file, JSON.stringify(evidence, null, 2) + '\n');
}

function writeReport(results, meta, keyRanking, srcCols, file) {
  const L = [];
  const direct = results.filter((r) => r.kind === 'direct');
  const lookups = results.filter((r) => r.kind === 'lookup');
  const constants = results.filter((r) => r.kind === 'constant');
  const identifiers = results.filter((r) => r.kind === 'identifier');
  const unexplained = results.filter((r) => r.kind === 'unexplained');
  const empty = results.filter((r) => r.kind === 'empty');

  L.push(`# Recovered mapping — ${meta.sourceLabel} → ${meta.destLabel}`);
  L.push('');
  L.push(`- Source: \`${meta.sourceFile}\` — ${meta.srcRows} rows × ${meta.srcCols} columns`);
  L.push(`- Destination: \`${meta.destFile}\` — ${meta.destRows} rows × ${meta.destCols} columns`);
  L.push(`- Join: \`${meta.destLabel}.${meta.key.dest.name}\` = \`${meta.sourceLabel}.${meta.key.source.name}\``);
  L.push(`- Joined: **${meta.joinedRows} of ${meta.destRows}** destination rows (${pct(meta.joinedRows / meta.destRows)})`);
  if (meta.key.duplicates) L.push(`- Source key has ${meta.key.duplicates} duplicate value(s) — first occurrence wins`);
  if (meta.srcRepaired || meta.destRepaired) L.push(`- Rows repaired on read: ${meta.srcRepaired} source, ${meta.destRepaired} destination`);
  if (meta.srcQuarantined || meta.destQuarantined) L.push(`- Rows quarantined (unparseable, excluded): ${meta.srcQuarantined} source, ${meta.destQuarantined} destination`);
  L.push(`- Thresholds: agreement ≥ ${pct(meta.cfg.minAgreement)}, ≥ ${meta.cfg.minRows} compared rows, ≥ ${meta.cfg.minDistinct} distinct agreeing values`);
  L.push(`- Generated: ${meta.generated}`);
  L.push('');

  L.push('## Result');
  L.push('');
  L.push('| | Fields |');
  L.push('| --- | ---: |');
  L.push(`| Destination columns | ${results.length} |`);
  L.push(`| **Recovered — direct** | **${direct.length}** |`);
  L.push(`| **Recovered — lookup** | **${lookups.length}** |`);
  L.push(`| Constant | ${constants.length} |`);
  L.push(`| Destination-generated identifier | ${identifiers.length} |`);
  L.push(`| Never populated | ${empty.length} |`);
  L.push(`| Unexplained | ${unexplained.length} |`);
  L.push('');

  L.push('## Join key');
  L.push('');
  L.push('_Every near-unique source column tried against every high-cardinality destination column. Highest match rate wins._');
  L.push('');
  L.push('| Destination | Source | Matched rows | Rate |');
  L.push('| --- | --- | ---: | ---: |');
  for (const k of keyRanking.slice(0, 5)) {
    L.push(`| \`${k.dest.name}\` | \`${k.source.name}\` | ${k.matched} | ${pct(k.rate)} |`);
  }
  L.push('');

  if (direct.length) {
    L.push('## Recovered mappings');
    L.push('');
    L.push('_Agreement is over rows where both sides are populated. Coverage is those rows as a share of the join._');
    L.push('');
    L.push('| Destination | Source | Transform | Agreement | Rows | Coverage | Distinct | Confidence |');
    L.push('| --- | --- | --- | ---: | ---: | ---: | ---: | --- |');
    for (const r of direct) {
      const b = r.best;
      L.push(
        `| \`${r.dest.name}\` | \`${b.source.name}\` | ${b.transform} | ${pct(b.score)} | ${b.both} | ${pct(b.both / meta.joinedRows)} | ${b.distinct} | ${r.confidence} |`,
      );
    }
    L.push('');

    const fanout = new Map();
    for (const r of direct) {
      const n = r.best.source.name;
      fanout.set(n, (fanout.get(n) || 0) + 1);
    }
    const shared = [...fanout.entries()].filter(([, n]) => n > 1);
    if (shared.length) {
      L.push('**One source field, several destinations:** ' +
        shared.map(([n, c]) => `\`${n}\` → ${direct.filter((r) => r.best.source.name === n).map((r) => `\`${r.dest.name}\``).join(', ')} (${c})`).join('; '));
      L.push('');
    }

    const notes = [];
    for (const r of direct) {
      const b = r.best;
      const parts = [];
      if (b.srcOnly) parts.push(`${b.srcOnly} row(s) have a source value but an empty destination`);
      if (b.destOnly) parts.push(`${b.destOnly} row(s) have a destination value but an empty source`);
      if (r.dest.stat.whitespaceOnly) parts.push(`${r.dest.stat.whitespaceOnly} destination value(s) are whitespace-only, not empty`);
      if (r.alternates.length) parts.push(`also matches ${r.alternates.map((a) => `\`${a.source.name}\` ${pct(a.score)}`).join(', ')}`);
      if (parts.length) notes.push(`- **\`${r.dest.name}\`** — ${parts.join('; ')}.`);
    }
    if (notes.length) {
      L.push('### Null and ambiguity notes');
      L.push('');
      L.push(...notes);
      L.push('');
    }
  }

  if (lookups.length) {
    L.push('## Lookups');
    L.push('');
    L.push('_Values never match, but each source value resolves to exactly one destination value. Value comparison cannot produce these — the table below is the mapping._');
    L.push('');
    for (const r of lookups) {
      const l = r.lookup;
      L.push(`### \`${r.dest.name}\` ← \`${l.source.name}\``);
      L.push('');
      L.push(`${l.srcDistinct} source value(s) → ${l.destDistinct} destination value(s) over ${l.both} rows, ${l.conflict} conflict(s) (${pct(l.rate)} consistent) · confidence ${r.confidence}`);
      L.push('');
      const entries = [...l.fwd.entries()].slice(0, 20);
      L.push('| Source value | Destination value |');
      L.push('| --- | --- |');
      for (const [su, du] of entries) {
        L.push(`| \`${meta.upperVals[su].slice(0, 40)}\` | \`${meta.upperVals[du].slice(0, 40)}\` |`);
      }
      if (l.fwd.size > entries.length) L.push(`| _… ${l.fwd.size - entries.length} more_ | |`);
      L.push('');
    }
  }

  if (constants.length) {
    L.push('## Constants');
    L.push('');
    L.push('_Same value on every row. Either a hardcoded flow value or a customer-level setting — value comparison cannot tell which._');
    L.push('');
    L.push('| Destination | Value | Fill |');
    L.push('| --- | --- | ---: |');
    for (const r of constants) L.push(`| \`${r.dest.name}\` | \`${String(r.value).slice(0, 40)}\` | ${pct(r.dest.stat.fill)} |`);
    L.push('');
  }

  const weakItems = results.flatMap((r) => (r.weak || []).map((w) => ({ r, w })));
  if (weakItems.length) {
    L.push('## Suppressed — agreement without evidence');
    L.push('');
    L.push('_These cleared the agreement threshold but not the row or cardinality floor. Listed so nothing is hidden, not proposed as mappings._');
    L.push('');
    L.push('| Destination | Source | Agreement | Rows | Distinct | Why suppressed |');
    L.push('| --- | --- | ---: | ---: | ---: | --- |');
    for (const { r, w } of weakItems.slice(0, 40)) {
      const why = [];
      if (w.both < meta.cfg.minRows) why.push(`only ${w.both} rows`);
      if (w.distinct < meta.cfg.minDistinct) why.push(`only ${w.distinct} distinct value(s)`);
      L.push(`| \`${r.dest.name}\` | \`${w.source.name}\` | ${pct(w.score)} | ${w.both} | ${w.distinct} | ${why.join(', ')} |`);
    }
    if (weakItems.length > 40) L.push(`| _… ${weakItems.length - 40} more_ | | | | | |`);
    L.push('');
  }

  if (identifiers.length) {
    L.push('## Destination-generated identifiers');
    L.push('');
    L.push('_Unique per row and explained by nothing on the source side. Surrogate keys IVO assigns — no mapping to recover._');
    L.push('');
    L.push(identifiers.map((r) => `\`${r.dest.name}\``).join(', '));
    L.push('');
  }

  if (unexplained.length) {
    L.push('## Unexplained destination fields');
    L.push('');
    L.push('_Populated, varying, and not derivable from any source column. Filled from another object, computed, or entered by hand — a human has to say which._');
    L.push('');
    L.push('| Destination | Fill | Distinct | Type | Top value |');
    L.push('| --- | ---: | ---: | --- | --- |');
    for (const r of unexplained) {
      const top = r.dest.stat.topValues[0];
      L.push(
        `| \`${r.dest.name}\` | ${pct(r.dest.stat.fill)} | ${r.dest.stat.distinct} | ${r.dest.stat.dominantType || '—'} | \`${top ? String(top[0]).replace(/\n/g, ' ').slice(0, 30) : ''}\` |`,
      );
    }
    L.push('');
  }

  if (empty.length) {
    L.push('## Never populated');
    L.push('');
    L.push(empty.map((r) => `\`${r.dest.name}\``).join(', '));
    L.push('');
  }

  const used = new Set();
  for (const r of results) {
    if (r.kind === 'direct') used.add(r.best.source.name);
    if (r.kind === 'lookup') used.add(r.lookup.source.name);
  }
  const unused = srcCols.filter((c) => carriesInformation(c) && !used.has(c.name));
  L.push('## Unused source fields');
  L.push('');
  L.push(`_${unused.length} source column(s) carry information but feed nothing on the destination side. Either genuinely dropped by the flow, or mapped onto an object this pair of exports does not cover._`);
  L.push('');
  L.push(unused.length ? unused.map((c) => `\`${c.name}\``).join(', ') : '_none_');
  L.push('');

  fs.writeFileSync(file, L.join('\n'));
}

// ------------------------------------------------------------------------ main

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.source || !args.dest) {
    console.error(
      'Usage: node tools/data-comparer.js --source <erp-export.csv> --dest <ivo-export.csv>\n' +
        '                                 [--out <dir>] [--source-label <name>] [--dest-label <name>]\n' +
        '                                 [--source-key <col>] [--dest-key <col>]\n' +
        '                                 [--min-agreement 0.9] [--min-rows 30] [--min-distinct 5]',
    );
    process.exit(1);
  }

  const cfg = {
    minAgreement: num(args['min-agreement'], DEFAULTS.minAgreement),
    minRows: num(args['min-rows'], DEFAULTS.minRows),
    minDistinct: num(args['min-distinct'], DEFAULTS.minDistinct),
    minJoin: num(args['min-join'], DEFAULTS.minJoin),
  };

  const sourceFile = path.resolve(args.source);
  const destFile = path.resolve(args.dest);
  const outDir = path.resolve(args.out || 'out/data-comparer');
  const sourceLabel = args['source-label'] || path.basename(sourceFile, path.extname(sourceFile));
  const destLabel = args['dest-label'] || path.basename(destFile, path.extname(destFile));

  const src = parseCsv(fs.readFileSync(sourceFile, 'utf8'));
  const dst = parseCsv(fs.readFileSync(destFile, 'utf8'));

  const enc = { raw: encoder(), trim: encoder(), upper: encoder(), loose: encoder() };
  const srcCols = encodeColumns(src, enc);
  const destCols = encodeColumns(dst, enc);

  const keyRanking = rankJoinKeys(srcCols, destCols, src.records.length, dst.records.length);
  let key;
  if (args['source-key'] || args['dest-key']) {
    const s = srcCols.find((c) => c.name === args['source-key']);
    const d = destCols.find((c) => c.name === args['dest-key']);
    if (!s || !d) {
      console.error(`Key column not found: ${!s ? args['source-key'] : args['dest-key']}`);
      process.exit(1);
    }
    key = { source: s, dest: d, matched: 0, rate: 0, duplicates: 0 };
  } else {
    key = keyRanking[0];
  }

  if (!key) {
    console.error('No join key candidate: neither export has a near-unique, high-cardinality column in common.');
    process.exit(2);
  }

  const joined = buildJoin(key, src.records.length, dst.records.length);
  const joinedRows = joined.length / 2;
  key.matched = joinedRows;
  key.rate = joinedRows / dst.records.length;

  if (key.rate < cfg.minJoin) {
    console.error(
      `Best join (\`${key.dest.name}\` = \`${key.source.name}\`) reaches only ${pct(key.rate)} of destination rows, ` +
        `below --min-join ${pct(cfg.minJoin)}. These two exports are probably not the same records.`,
    );
    process.exit(2);
  }

  const results = recover(srcCols, destCols, joined, enc.upper.vals, cfg, dst.records.length);

  const meta = {
    sourceLabel, destLabel,
    sourceFile: path.relative(process.cwd(), sourceFile),
    destFile: path.relative(process.cwd(), destFile),
    srcRows: src.records.length,
    destRows: dst.records.length,
    srcCols: srcCols.length,
    destCols: destCols.length,
    srcRepaired: src.repaired,
    destRepaired: dst.repaired,
    srcQuarantined: src.quarantined.length,
    destQuarantined: dst.quarantined.length,
    joinedRows,
    key,
    cfg,
    upperVals: enc.upper.vals,
    generated: new Date().toISOString(),
  };

  fs.mkdirSync(outDir, { recursive: true });
  writeMappingCsv(results, meta, path.join(outDir, 'mapping.csv'));
  writeLookupsCsv(results, enc.upper.vals, path.join(outDir, 'lookups.csv'));
  writeValueEvidence(results, joined, src, dst, key, path.join(outDir, 'value-evidence.json'));
  writeReport(results, meta, keyRanking, srcCols, path.join(outDir, 'report.md'));

  const count = (k) => results.filter((r) => r.kind === k).length;
  console.log(`${sourceLabel} → ${destLabel}`);
  console.log(`  join: ${destLabel}.${key.dest.name} = ${sourceLabel}.${key.source.name}`);
  console.log(`  joined rows:        ${joinedRows} of ${dst.records.length} (${pct(key.rate)})`);
  console.log(`  recovered (direct): ${count('direct')}`);
  console.log(`  recovered (lookup): ${count('lookup')}`);
  console.log(`  constant:           ${count('constant')}`);
  console.log(`  dest identifiers:   ${count('identifier')}`);
  console.log(`  never populated:    ${count('empty')}`);
  console.log(`  unexplained:        ${count('unexplained')}`);
  console.log(`  → ${path.relative(process.cwd(), outDir)}`);
}

main();
