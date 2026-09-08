'use strict';

const fs = require('fs');
const path = require('path');
const { parseCsv, toCsvRow } = require('./csv');
const { flattenSchema } = require('./schema');
const { profileColumn } = require('./stats');

const CUSTOM_PREFIX = /^ud[A-Z_]/;

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

function analyse({ headers, records, schemaFields }) {
  const columns = headers.map((h, idx) => {
    const values = records.map((r) => r[idx]);
    const stat = profileColumn(h, values);
    stat.findings = [];
    stat.schema = schemaFields ? schemaFields.get(h) || null : null;

    const isCustom = CUSTOM_PREFIX.test(h);
    if (isCustom) {
      stat.findings.push({
        code: 'CUSTOM_FIELD',
        tier: 'custom',
        text: 'Customer-defined field, no declared semantics. Undecidable by tooling.',
      });
    } else if (schemaFields && !stat.schema) {
      stat.findings.push({
        code: 'NOT_IN_SCHEMA',
        tier: 'question',
        text: 'Column is not declared in the connector schema.',
      });
    }

    if (stat.populated === 0) {
      stat.findings.push({ code: 'EMPTY', tier: 'prune', text: 'Never populated in this export.' });
    } else if (stat.isConstant) {
      stat.findings.push({
        code: 'CONSTANT',
        tier: 'prune',
        text: `Single value for every populated row: "${stat.topValues[0][0]}".`,
      });
    }

    if (stat.isUnique) {
      stat.findings.push({ code: 'CANDIDATE_KEY', tier: 'info', text: 'Unique and fully populated.' });
    }
    if (stat.padded) {
      stat.findings.push({
        code: 'PADDED',
        tier: 'transform',
        text: `${stat.padded} value(s) carry leading/trailing whitespace — needs .trim().`,
      });
    }
    if (stat.whitespaceOnly) {
      stat.findings.push({
        code: 'WHITESPACE_NULL',
        tier: 'transform',
        text: `${stat.whitespaceOnly} value(s) are whitespace-only, not empty. "" vs " " will not compare equal.`,
      });
    }
    if (stat.placeholder) {
      stat.findings.push({
        code: 'PLACEHOLDER_NULL',
        tier: 'review',
        text: `${stat.placeholder} value(s) look like textual nulls ("N/A", "NONE", ...).`,
      });
    }
    if (stat.populated > 0 && stat.dominantShare < 0.99) {
      const summary = stat.observedTypes
        .map(([t, c]) => `${t} ${pct(c / stat.populated)}`)
        .join(', ');
      stat.findings.push({
        code: 'MIXED_FORMAT',
        tier: 'review',
        text: `Mixed observed formats: ${summary}.`,
      });
    }
    if (stat.fill > 0 && stat.fill < 0.5) {
      stat.findings.push({
        code: 'SPARSE',
        tier: 'review',
        text: `Only ${pct(stat.fill)} populated (${stat.populated} of ${stat.total} rows) — destination default/null handling required.`,
      });
    }

    if (stat.schema) applySchemaChecks(stat, values);
    return stat;
  });

  const missing = [];
  if (schemaFields) {
    const present = new Set(headers);
    for (const f of schemaFields.values()) {
      if (f.nested || f.isArray || f.name === '__custom_fields') continue;
      if (!present.has(f.path)) missing.push(f);
    }
  }

  return { columns, missing };
}

function applySchemaChecks(stat, values) {
  const s = stat.schema;

  if (s.required && stat.fill < 1) {
    stat.findings.push({
      code: 'REQUIRED_BUT_EMPTY',
      tier: 'question',
      text: `Schema marks this required, but ${pct(1 - stat.fill)} of rows are empty.`,
    });
  }

  if (!s.nullable && !s.required && stat.fill < 1 && stat.populated > 0) {
    stat.findings.push({
      code: 'NULL_NOT_DECLARED',
      tier: 'review',
      text: `Schema type is not nullable, yet ${pct(1 - stat.fill)} of rows are empty.`,
    });
  }

  if (s.maxLength !== null && stat.maxLen > 0) {
    if (stat.maxLen > s.maxLength) {
      stat.findings.push({
        code: 'OVER_MAXLENGTH',
        tier: 'question',
        text: `Observed length ${stat.maxLen} exceeds declared maxLength ${s.maxLength}. Example: "${stat.longestSample}".`,
      });
    } else if (stat.maxLen === s.maxLength && s.maxLength >= 5 && s.minLength !== s.maxLength) {
      // Short and fixed-width fields sit at their limit by construction; only variable long fields imply truncation.
      const atLimit = values.reduce((n, v) => n + (v.trim().length === s.maxLength ? 1 : 0), 0);
      stat.findings.push({
        code: 'AT_MAXLENGTH',
        tier: 'review',
        text: `${atLimit} value(s) sit exactly at the declared maxLength ${s.maxLength} — likely already truncated upstream.`,
      });
    }
  }

  if (s.enum) {
    const allowed = new Set(s.enum.map(String));
    const offenders = new Map();
    for (const raw of values) {
      const v = raw.trim();
      if (v === '') continue;
      if (!allowed.has(v)) offenders.set(v, (offenders.get(v) || 0) + 1);
    }
    if (offenders.size) {
      const list = [...offenders.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([v, c]) => `"${v}" ×${c}`)
        .join(', ');
      stat.findings.push({
        code: 'ENUM_VIOLATION',
        tier: 'question',
        text: `Values outside declared enum [${s.enum.join(', ')}]: ${list}.`,
      });
    }
  }

  if (s.pattern) {
    let re = null;
    try { re = new RegExp(s.pattern); } catch { /* schema pattern not valid JS — skip */ }
    if (re) {
      let bad = 0;
      let sample = '';
      for (const raw of values) {
        const v = raw.trim();
        if (v === '') continue;
        if (!re.test(v)) { bad++; if (!sample) sample = v; }
      }
      if (bad) {
        stat.findings.push({
          code: 'PATTERN_VIOLATION',
          tier: 'question',
          text: `${bad} value(s) fail the declared pattern ${s.pattern}. Example: "${sample}".`,
        });
      }
    }
  }

  const declared = s.types.join('|');
  const observed = stat.dominantType;
  if (observed && declared) {
    const ok =
      (declared === 'integer' && observed === 'integer') ||
      (declared === 'number' && (observed === 'integer' || observed === 'decimal')) ||
      (declared === 'boolean' && (observed === 'boolean' || observed === 'yn')) ||
      declared === 'string';
    if (!ok) {
      stat.findings.push({
        code: 'TYPE_MISMATCH',
        tier: 'question',
        text: `Schema declares ${declared}; data looks like ${observed}.`,
      });
    }
    if (declared === 'string' && (observed === 'integer' || observed === 'decimal') && !s.pattern) {
      stat.findings.push({
        code: 'NUMERIC_AS_STRING',
        tier: 'transform',
        text: 'Declared string, observed numeric. Do not cast if leading zeros matter.',
      });
    }
  }
}

function writeFieldsCsv(columns, file) {
  const header = [
    'field', 'in_schema', 'declared_type', 'nullable', 'required', 'declared_maxlen',
    'fill_pct', 'populated', 'empty', 'distinct', 'is_constant', 'is_unique',
    'observed_type', 'min_len', 'max_len', 'padded', 'top_value', 'top_pct', 'flags',
  ];
  const rows = columns.map((c) => {
    const s = c.schema;
    const top = c.topValues[0];
    return toCsvRow([
      c.name,
      s ? 'yes' : 'no',
      s ? s.types.join('|') : '',
      s ? (s.nullable ? 'yes' : 'no') : '',
      s ? (s.required ? 'yes' : 'no') : '',
      s && s.maxLength !== null ? s.maxLength : '',
      pct(c.fill),
      c.populated,
      c.empty + c.whitespaceOnly,
      c.distinct,
      c.isConstant ? 'yes' : '',
      c.isUnique ? 'yes' : '',
      c.dominantType || '',
      c.minLen,
      c.maxLen,
      c.padded,
      top ? top[0] : '',
      top && c.populated ? pct(top[1] / c.populated) : '',
      c.findings.map((f) => f.code).join(';'),
    ]);
  });
  fs.writeFileSync(file, [toCsvRow(header), ...rows].join('\n') + '\n');
}

function writeReport(meta, columns, missing, file) {
  const L = [];
  const populated = columns.filter((c) => c.populated > 0);
  const emptyCols = columns.filter((c) => c.populated === 0);
  const constants = columns.filter((c) => c.isConstant);
  const usable = populated.length - constants.length;

  L.push(`# Profile — ${meta.label}`);
  L.push('');
  L.push(`- Source: \`${meta.dataFile}\``);
  if (meta.schemaFile) L.push(`- Schema: \`${meta.schemaFile}\``);
  L.push(`- Rows: ${meta.rows}`);
  L.push(`- Columns: ${columns.length}`);
  if (meta.repaired) L.push(`- **Rows repaired**: ${meta.repaired} (record split across lines by an unquoted newline in a free-text field)`);
  if (meta.quarantined.length) L.push(`- **Rows quarantined**: ${meta.quarantined.length} (field count never reached the header count — excluded from all statistics below)`);
  L.push(`- Generated: ${meta.generated}`);
  L.push('');
  L.push('## Pruning');
  L.push('');
  L.push('| | Count | Share |');
  L.push('| --- | ---: | ---: |');
  L.push(`| Columns in export | ${columns.length} | 100% |`);
  L.push(`| Never populated | ${emptyCols.length} | ${pct(emptyCols.length / columns.length)} |`);
  L.push(`| Constant (one value) | ${constants.length} | ${pct(constants.length / columns.length)} |`);
  L.push(`| **Carrying information** | **${usable}** | **${pct(usable / columns.length)}** |`);
  L.push('');

  if (meta.schemaFile) {
    const notInSchema = columns.filter((c) => !c.schema);
    L.push('## Schema reconciliation');
    L.push('');
    L.push(`- Columns declared in schema: ${columns.length - notInSchema.length}`);
    L.push(`- Columns **not** in schema: ${notInSchema.length}`);
    L.push(`- Schema fields absent from export: ${missing.length}`);
    if (missing.length) {
      L.push('');
      L.push('  ' + missing.map((f) => `\`${f.path}\`${f.required ? ' **(required)**' : ''}`).join(', '));
    }
    L.push('');
  }

  const custom = columns.filter((c) => CUSTOM_PREFIX.test(c.name));
  if (custom.length) {
    const live = custom.filter((c) => c.populated > 0 && !c.isConstant);
    const dead = custom.filter((c) => c.populated === 0 || c.isConstant);
    L.push('## Custom fields');
    L.push('');
    L.push(`_${custom.length} customer-defined columns. ${dead.length} are empty or constant and can be dropped; the remaining ${live.length} each need a human answer._`);
    L.push('');
    L.push('| Field | Fill | Distinct | Type | Top value |');
    L.push('| --- | ---: | ---: | --- | --- |');
    for (const c of live) {
      const top = c.topValues[0];
      L.push(`| \`${c.name}\` | ${pct(c.fill)} | ${c.distinct} | ${c.dominantType} | \`${String(top[0]).replace(/\n/g, ' ').slice(0, 40)}\` |`);
    }
    L.push('');
    L.push('Droppable: ' + (dead.length ? dead.map((c) => `\`${c.name}\``).join(', ') : 'none'));
    L.push('');
  }

  const byTier = (t) => columns.flatMap((c) => c.findings.filter((f) => f.tier === t).map((f) => ({ c, f })));
  for (const [tier, title, blurb] of [
    ['question', 'Questions — schema and data disagree', 'These are the conflicts that today surface during testing.'],
    ['review', 'Review — needs a decision', 'Mappable, but the transform depends on an answer.'],
    ['transform', 'Transforms — deterministic', 'Derivable from the data with no judgement call.'],
  ]) {
    const items = byTier(tier);
    if (!items.length) continue;
    L.push(`## ${title}`);
    L.push('');
    L.push(`_${blurb}_`);
    L.push('');
    for (const { c, f } of items) L.push(`- **\`${c.name}\`** — [${f.code}] ${f.text}`);
    L.push('');
  }

  L.push('## Candidate keys');
  L.push('');
  const keys = columns.filter((c) => c.isUnique);
  L.push(keys.length ? keys.map((c) => `- \`${c.name}\` (${c.dominantType})`).join('\n') : '- none');
  L.push('');

  L.push('## Field detail');
  L.push('');
  L.push('| Field | Fill | Distinct | Type | Len | Top value |');
  L.push('| --- | ---: | ---: | --- | ---: | --- |');
  for (const c of columns) {
    const top = c.topValues[0];
    const topStr = top ? `\`${String(top[0]).slice(0, 30)}\` ${pct(top[1] / c.populated)}` : '—';
    L.push(
      `| \`${c.name}\` | ${pct(c.fill)} | ${c.distinct} | ${c.dominantType || '—'} | ${c.minLen}–${c.maxLen} | ${topStr} |`,
    );
  }
  L.push('');

  fs.writeFileSync(file, L.join('\n'));
}

function writeQuestions(meta, columns, file) {
  const L = [`# Questions — ${meta.label}`, '', 'Generated from the export. Every item needs a human answer before mapping.', ''];
  let n = 0;
  for (const c of columns) {
    const qs = c.findings.filter((f) => f.tier === 'question' || f.tier === 'custom');
    if (!qs.length) continue;
    if (c.populated === 0 || c.isConstant) continue; // nothing to ask about a column with no signal
    n++;
    L.push(`## ${n}. \`${c.name}\``);
    L.push('');
    L.push(`Fill ${pct(c.fill)} · ${c.distinct} distinct · observed ${c.dominantType || 'n/a'}`);
    if (c.topValues.length) {
      L.push('');
      L.push('Sample values: ' + c.topValues.map(([v, k]) => `\`${String(v).slice(0, 40)}\` ×${k}`).join(', '));
    }
    L.push('');
    for (const q of qs) L.push(`- **${q.code}** — ${q.text}`);
    L.push('');
  }
  if (!n) L.push('_No conflicts detected._');
  fs.writeFileSync(file, L.join('\n'));
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.data) {
    console.error('Usage: node tools/csv-profiler.js --data <csv> [--schema <json>] [--out <dir>] [--label <name>]');
    process.exit(1);
  }

  const dataFile = path.resolve(args.data);
  const outDir = path.resolve(args.out || 'out');
  const label = args.label || path.basename(dataFile, path.extname(dataFile));

  const { headers, records, repaired, quarantined } = parseCsv(fs.readFileSync(dataFile, 'utf8'));
  const schemaFields = args.schema ? flattenSchema(JSON.parse(fs.readFileSync(path.resolve(args.schema), 'utf8'))) : null;

  const { columns, missing } = analyse({ headers, records, schemaFields });

  const meta = {
    label,
    dataFile: path.relative(process.cwd(), dataFile),
    schemaFile: args.schema ? path.relative(process.cwd(), path.resolve(args.schema)) : null,
    rows: records.length,
    repaired,
    quarantined,
    generated: new Date().toISOString(),
  };

  fs.mkdirSync(outDir, { recursive: true });
  writeFieldsCsv(columns, path.join(outDir, 'fields.csv'));
  writeReport(meta, columns, missing, path.join(outDir, 'report.md'));
  writeQuestions(meta, columns, path.join(outDir, 'questions.md'));

  const questions = columns.reduce(
    (n, c) => n + (c.populated > 0 && !c.isConstant ? c.findings.filter((f) => f.tier === 'question' || f.tier === 'custom').length : 0),
    0,
  );
  const pruned = columns.filter((c) => c.populated === 0 || c.isConstant).length;
  console.log(`${label}: ${records.length} rows × ${columns.length} cols`);
  if (repaired) console.log(`  rows repaired (unquoted newline): ${repaired}`);
  if (quarantined.length) console.log(`  rows quarantined (unparseable):   ${quarantined.length}`);
  console.log(`  pruned (empty or constant): ${pruned}`);
  console.log(`  carrying information:       ${columns.length - pruned}`);
  console.log(`  questions raised:           ${questions}`);
  console.log(`  → ${path.relative(process.cwd(), outDir)}`);
}

main();
