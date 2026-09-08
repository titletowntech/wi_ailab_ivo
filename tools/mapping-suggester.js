'use strict';

const fs = require('fs');
const path = require('path');
const { parseCsv, toCsvRow } = require('./csv');
const { flattenSchema } = require('./schema');
const { extractExecutionMappings } = require('./app-xchange-run-mapper');

const ABBREVIATIONS = new Map([
  ['acct', 'account'], ['addr', 'address'], ['amt', 'amount'], ['cat', 'category'],
  ['co', 'company'], ['code', 'code'], ['desc', 'description'], ['dept', 'department'],
  ['dt', 'date'], ['equip', 'equipment'], ['id', 'id'], ['mfr', 'manufacturer'],
  ['no', 'number'], ['num', 'number'], ['qty', 'quantity'], ['um', 'unit measure'], ['yr', 'year'],
]);

const STOP_WORDS = new Set([
  'a', 'an', 'and', 'equipment', 'for', 'from', 'id', 'identifier', 'of', 'or', 'the', 'to', 'value',
]);

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 2) {
    if (!argv[i].startsWith('--')) throw new Error(`Unexpected argument: ${argv[i]}`);
    args[argv[i].slice(2)] = argv[i + 1];
  }
  return args;
}

function readCsv(file) {
  const table = parseCsv(fs.readFileSync(path.resolve(file), 'utf8'));
  return table.records.map((record) => Object.fromEntries(table.headers.map((header, i) => [header, record[i]])));
}

function readSchema(file) {
  return flattenSchema(JSON.parse(fs.readFileSync(path.resolve(file), 'utf8')));
}

function splitWords(value) {
  return String(value || '')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(Boolean)
    .flatMap((word) => (ABBREVIATIONS.get(word) || word).split(' '));
}

function tokens(...values) {
  return new Set(values.flatMap(splitWords).filter((word) => !STOP_WORDS.has(word)));
}

function overlap(left, right) {
  if (!left.size || !right.size) return 0;
  let common = 0;
  for (const token of left) if (right.has(token)) common++;
  return (2 * common) / (left.size + right.size);
}

function normalizedName(value) {
  return splitWords(value).join('');
}

function pctNumber(value) {
  const number = Number(String(value || '').replace('%', ''));
  return Number.isFinite(number) ? number / 100 : 0;
}

function declaredTypes(field, profile) {
  if (field && field.types.length) return new Set(field.types);
  return new Set(String(profile.declared_type || '').split('|').filter(Boolean));
}

function observedFamily(type) {
  if (type === 'integer' || type === 'decimal') return 'number';
  if (type === 'boolean' || type === 'yn') return 'boolean';
  if (type === 'date' || type === 'datetime') return 'date';
  return type || '';
}

function typeCompatibility(sourceSchema, destSchema, sourceProfile, destProfile) {
  const sourceTypes = declaredTypes(sourceSchema, sourceProfile);
  const destTypes = declaredTypes(destSchema, destProfile);
  if (sourceTypes.size && destTypes.size) {
    for (const type of sourceTypes) if (destTypes.has(type)) return { score: 1, note: 'declared types match' };
    if (sourceTypes.has('integer') && destTypes.has('number')) return { score: 1, note: 'integer fits number' };
    if (sourceTypes.has('number') && destTypes.has('integer')) return { score: 0.55, note: 'number may require integer conversion' };
    if (sourceTypes.has('string') || destTypes.has('string')) return { score: 0.55, note: 'string conversion may be required' };
    return { score: 0, note: 'declared types are incompatible' };
  }

  const sourceObserved = observedFamily(sourceProfile.observed_type);
  const destObserved = observedFamily(destProfile.observed_type);
  if (!sourceObserved || !destObserved) return { score: 0.5, note: 'type evidence is incomplete' };
  return sourceObserved === destObserved
    ? { score: 0.8, note: 'observed types match' }
    : { score: 0.2, note: 'observed types differ' };
}

function lengthCompatibility(sourceSchema, destSchema, sourceProfile) {
  const sourceMax = Number(sourceProfile.max_len) || (sourceSchema ? sourceSchema.maxLength : 0) || 0;
  const destMax = destSchema ? destSchema.maxLength || 0 : 0;
  if (!sourceMax || !destMax || sourceMax <= destMax) return { score: 1, note: '' };
  return { score: 0.45, note: `source length ${sourceMax} exceeds destination max ${destMax}` };
}

function scoreCandidate(source, dest) {
  const sourceName = normalizedName(source.profile.field);
  const destName = normalizedName(dest.profile.field);
  const exactName = sourceName === destName ? 1 : 0;
  const nameScore = overlap(tokens(source.profile.field), tokens(dest.profile.field));
  const descriptionScore = overlap(
    tokens(source.schema ? source.schema.description : ''),
    tokens(dest.schema ? dest.schema.description : ''),
  );
  const type = typeCompatibility(source.schema, dest.schema, source.profile, dest.profile);
  const length = lengthCompatibility(source.schema, dest.schema, source.profile);

  if (type.score === 0) return null;

  const semantic = Math.max(exactName, nameScore, descriptionScore * 0.85);
  const score = semantic * 0.68 + type.score * 0.22 + length.score * 0.1;
  const evidence = [];
  if (exactName) evidence.push('normalized names match');
  else if (nameScore > 0) evidence.push(`name overlap ${Math.round(nameScore * 100)}%`);
  if (descriptionScore > 0) evidence.push(`description overlap ${Math.round(descriptionScore * 100)}%`);
  evidence.push(type.note);
  if (length.note) evidence.push(length.note);

  return { source, score, semantic, evidence: evidence.filter(Boolean) };
}

function confidence(best, second) {
  const margin = best.score - (second ? second.score : 0);
  if (best.score >= 0.82 && best.semantic >= 0.75 && margin >= 0.12) return 'high';
  if (best.score >= 0.62 && best.semantic >= 0.45 && margin >= 0.08) return 'medium';
  if (best.score >= 0.45 && best.semantic >= 0.25) return 'low';
  return '';
}

function propertyAccess(root, field) {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(field)
    ? `${root}.${field}`
    : `${root}[${JSON.stringify(field)}]`;
}

function todo(message) {
  return `flow.todo(${JSON.stringify(message)})`;
}

function valueHandling(row, sourceProfiles, sourceSchema, destSchema) {
  const destination = destSchema.get(row.destField) || null;
  const source = sourceSchema.get(row.sourceField) || null;
  const sourceProfile = sourceProfiles.get(row.sourceField) || {};

  if (!row.sourceField && (row.destField.toLowerCase() === 'uuid' || destination?.format === 'uuid')) {
    return 'uuid.v4()';
  }
  if (row.kind === 'empty') return 'null';
  if (row.kind === 'constant') return propertyAccess('flow.config', row.destField);
  if (row.kind === 'lookup-candidate') {
    return todo(`Add a lookup step for ${row.sourceField}, then map output[0].${row.destField}`);
  }
  if (!row.sourceField) {
    return todo(row.status === 'reference'
      ? `IVO supplies ${row.destField}; remove this field from the map if it is system-owned`
      : `Select a source for ${row.destField}`);
  }

  const sourceExpression = propertyAccess('flow.mapItem()', row.sourceField);
  const sourceTypes = declaredTypes(source, sourceProfile);
  const destinationTypes = declaredTypes(destination, {});
  const destinationNullable = destination ? destination.nullable : false;
  const fallback = destinationNullable ? 'null' : "''";
  const comparisonTransform = row.comparisonTransform || '';

  if (comparisonTransform === 'identity') return sourceExpression;
  if (comparisonTransform === 'trim') return `${sourceExpression}?.trim() ?? ${fallback}`;
  if (comparisonTransform === 'uppercase') return `${sourceExpression}?.trim().toUpperCase() ?? ${fallback}`;
  if (comparisonTransform === 'lowercase') return `${sourceExpression}?.trim().toLowerCase() ?? ${fallback}`;
  const truncation = /^truncate\((\d+)\)$/.exec(comparisonTransform);
  if (truncation) return `${sourceExpression}?.trim().slice(0, ${truncation[1]}) ?? ${fallback}`;
  if (comparisonTransform === 'case-insensitive match' || comparisonTransform === 'whitespace or punctuation normalisation') {
    return todo(`Confirm ${comparisonTransform} for ${row.sourceField} before mapping ${row.destField}`);
  }

  if (destination?.format === 'date') {
    return `${sourceExpression} ? dayjs(${sourceExpression}).format('YYYY-MM-DD') : ${destinationNullable ? 'null' : "''"}`;
  }
  if (destinationTypes.has('integer') || destinationTypes.has('number')) {
    if (sourceTypes.has('integer') || sourceTypes.has('number')) return sourceExpression;
    return `(${sourceExpression}?.trim() ?? '') === '' ? null : numeral(${sourceExpression}).value()`;
  }
  if (destinationTypes.has('string')) {
    const stringExpression = sourceTypes.has('string')
      ? sourceExpression
      : `${sourceExpression}?.toString()`;
    const trimmed = `${stringExpression}?.trim()`;
    const bounded = destination?.maxLength ? `${trimmed}.slice(0, ${destination.maxLength})` : trimmed;
    return `${bounded} ?? ${destinationNullable ? 'null' : "''"}`;
  }
  if (destinationTypes.has('boolean') && !sourceTypes.has('boolean')) {
    return todo(`Convert ${row.sourceField} to a boolean for ${row.destField}`);
  }
  return sourceExpression;
}

function suggestionRows(sourceProfiles, destProfiles, sourceSchema, destSchema, comparison, destCatalog, executionMappings = []) {
  const comparisonByDest = new Map(comparison.map((row) => [row.dest_field, row]));
  const executionByDest = new Map();
  for (const mapping of executionMappings) {
    const existing = executionByDest.get(mapping.destinationField);
    if (!existing || mapping.operation === 'update') executionByDest.set(mapping.destinationField, mapping);
  }
  const sourceProfilesByField = new Map(sourceProfiles.map((profile) => [profile.field, profile]));
  const sources = sourceProfiles
    .filter((profile) => profile.field && profile.is_constant !== 'yes' && Number(profile.populated) > 0)
    .map((profile) => ({ profile, schema: sourceSchema.get(profile.field) || null }));

  const rows = destProfiles.map((profile) => {
    const dest = { profile, schema: destSchema.get(profile.field) || null };
    const catalog = destCatalog.get(profile.field);
    const execution = executionByDest.get(profile.field);
    if (execution) {
      const sourceField = execution.sourceFields.find((field) => sourceProfilesByField.has(field)) || '';
      return {
        destField: profile.field,
        sourceField,
        kind: execution.kind,
        transform: execution.expression,
        status: 'actual-run',
        confidence: 'high',
        score: '',
        alternatives: execution.sourceFields.filter((field) => field !== sourceField).join('; '),
        rationale: `Recovered from Trimble ${execution.operation} action ${execution.actionStepId}` +
          (execution.lookupSteps.length ? ` via ${execution.lookupSteps.join(', ')}.` : '.'),
      };
    }
    const known = comparisonByDest.get(profile.field);
    if (known && known.kind !== 'unexplained') {
      return {
        destField: profile.field,
        sourceField: known.source_field,
        kind: known.kind,
        transform: '',
        comparisonTransform: known.transform,
        status: 'recovered',
        confidence: known.confidence,
        score: known.agreement,
        alternatives: known.alternates,
        rationale: [known.notes, known.transform ? `Comparison indicates ${known.transform}.` : ''].filter(Boolean).join(' ') || 'Recovered from paired ERP and IVO values.',
      };
    }

    if (catalog && catalog.status === 'usable' && (catalog.ownership === 'ivo' || catalog.mapping_behavior === 'generated')) {
      return {
        destField: profile.field,
        sourceField: '',
        kind: catalog.mapping_behavior || 'ivo-owned',
        transform: '',
        status: 'reference',
        confidence: 'high',
        score: '',
        alternatives: '',
        rationale: catalog.notes || 'IVO reference marks this field as IVO-owned.',
      };
    }

    const hasObservedProfile = profile.populated !== undefined && profile.populated !== '';
    if (hasObservedProfile && (Number(profile.populated) === 0 || profile.is_constant === 'yes')) {
      return {
        destField: profile.field,
        sourceField: '',
        kind: Number(profile.populated) === 0 ? 'empty' : 'constant',
        transform: '',
        status: 'profiled',
        confidence: '',
        score: '',
        alternatives: '',
        rationale: Number(profile.populated) === 0
          ? 'Destination field is never populated in this export.'
          : 'Destination field is constant in this export; confirm whether it is configuration or a hardcoded value.',
      };
    }

    const destWords = new Set(splitWords(profile.field));
    if (hasObservedProfile && profile.is_unique === 'yes' && pctNumber(profile.fill_pct) >= 0.9 && (destWords.has('id') || destWords.has('uuid'))) {
      return {
        destField: profile.field,
        sourceField: '',
        kind: 'identifier',
        transform: '',
        status: 'profiled',
        confidence: '',
        score: '',
        alternatives: '',
        rationale: 'Destination field is unique and nearly fully populated; it is likely generated by IVO.',
      };
    }

    const ranked = sources
      .map((source) => scoreCandidate(source, dest))
      .filter(Boolean)
      .sort((a, b) => b.score - a.score || a.source.profile.field.localeCompare(b.source.profile.field));
    const best = ranked[0];
    const level = best ? confidence(best, ranked[1]) : '';
    const alternatives = ranked.slice(1, 4)
      .filter((candidate) => candidate.score >= 0.4)
      .map((candidate) => `${candidate.source.profile.field} ${Math.round(candidate.score * 100)}%`)
      .join('; ');

    if (!best || !level) {
      return {
        destField: profile.field,
        sourceField: '',
        kind: known ? known.kind : 'unresolved',
        transform: '',
        status: 'question',
        confidence: '',
        score: best ? `${Math.round(best.score * 100)}%` : '',
        alternatives,
        rationale: best
          ? `No candidate has enough semantic evidence. Best candidate ${best.source.profile.field}: ${best.evidence.join('; ')}.`
          : 'No compatible populated source field was found.',
      };
    }

    const sourceWords = new Set(splitWords(best.source.profile.field));
    const kind = (catalog && catalog.mapping_behavior === 'lookup') || (destWords.has('id') && !sourceWords.has('id'))
      ? 'lookup-candidate'
      : 'suggested';
    const rationale = best.evidence.slice();
    if (kind === 'lookup-candidate') rationale.push('destination identifier likely requires a lookup');

    return {
      destField: profile.field,
      sourceField: best.source.profile.field,
      kind,
      transform: '',
      status: level === 'low' ? 'question' : 'suggested',
      confidence: level,
      score: `${Math.round(best.score * 100)}%`,
      alternatives,
      rationale: rationale.join('; '),
    };
  });

  return rows.map((row) => ({
    ...row,
    transform: row.transform || valueHandling(row, sourceProfilesByField, sourceSchema, destSchema),
  }));
}

function writeSuggestions(rows, file, preserveExisting = true) {
  const header = [
    'dest_field', 'source_field', 'kind', 'transform', 'status', 'confidence',
    'score', 'alternatives', 'rationale', 'review_decision', 'review_notes',
  ];
  const existingRows = preserveExisting && fs.existsSync(file)
    ? new Map(readCsv(file).map((row) => [row.dest_field, row]))
    : new Map();
  const lines = rows.map((row) => {
    const existing = existingRows.get(row.destField) || {};
    return toCsvRow([
    row.destField, row.sourceField, row.kind,
    row.status === 'actual-run' ? row.transform : existing.transform || row.transform,
    row.status, row.confidence,
    row.score, row.alternatives, row.rationale, existing.review_decision || '', existing.review_notes || '',
    ]);
  });
  fs.writeFileSync(file, [toCsvRow(header), ...lines].join('\n') + '\n');
}

function populateApprovedTransforms(rows, file) {
  if (!file || !fs.existsSync(file)) return;
  const table = parseCsv(fs.readFileSync(file, 'utf8'));
  const destinationIndex = table.headers.indexOf('dest_field');
  const transformIndex = table.headers.indexOf('transform');
  if (destinationIndex < 0 || transformIndex < 0) return;
  const transforms = new Map(rows.map((row) => [row.destField, row.transform]));
  for (const record of table.records) {
    if (!record[transformIndex]) record[transformIndex] = transforms.get(record[destinationIndex]) || '';
  }
  fs.writeFileSync(file, [toCsvRow(table.headers), ...table.records.map(toCsvRow)].join('\n') + '\n');
}

function writeQuestions(rows, file) {
  const questions = rows.filter((row) => row.status === 'question');
  const lines = ['# Mapping Questions', '', 'Resolve these fields before approving the mapping.', ''];
  for (const row of questions) {
    lines.push(`## \`${row.destField}\``, '');
    if (row.sourceField) lines.push(`Candidate: \`${row.sourceField}\` (${row.confidence} confidence, ${row.score})`, '');
    lines.push(row.rationale, '');
    if (row.alternatives) lines.push(`Alternatives: ${row.alternatives}`, '');
  }
  if (!questions.length) lines.push('_No mapping questions._');
  fs.writeFileSync(file, lines.join('\n'));
}

function writeReport(rows, meta, file) {
  const counts = new Map();
  for (const row of rows) counts.set(row.status, (counts.get(row.status) || 0) + 1);
  const lines = [
    `# Mapping Suggestions — ${meta.label}`,
    '',
    `- ERP profile: \`${meta.sourceProfile}\``,
    `- IVO profile: \`${meta.destProfile}\``,
    `- Comparison: ${meta.comparison ? `\`${meta.comparison}\`` : '_not supplied_'}`,
    `- Generated: ${new Date().toISOString()}`,
    '',
    '## Summary',
    '',
    '| Status | Fields |',
    '| --- | ---: |',
    `| Recovered from comparison | ${counts.get('recovered') || 0} |`,
    `| Recovered from actual run | ${counts.get('actual-run') || 0} |`,
    `| Classified from IVO reference | ${counts.get('reference') || 0} |`,
    `| Classified from profile | ${counts.get('profiled') || 0} |`,
    `| New suggestions | ${counts.get('suggested') || 0} |`,
    `| Questions | ${counts.get('question') || 0} |`,
    '',
    '## New Suggestions',
    '',
    '| Destination | Source | Confidence | Score | Rationale |',
    '| --- | --- | --- | ---: | --- |',
  ];
  const suggestions = rows.filter((row) => row.status === 'suggested');
  for (const row of suggestions) {
    lines.push(`| \`${row.destField}\` | \`${row.sourceField}\` | ${row.confidence} | ${row.score} | ${row.rationale} |`);
  }
  if (!suggestions.length) lines.push('| _none_ | | | | |');
  lines.push('', 'Review `suggestions.csv`; generated evidence is not an approved mapping.', '');
  fs.writeFileSync(file, lines.join('\n'));
}

function relative(file) {
  return path.relative(process.cwd(), path.resolve(file));
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const required = ['erp-schema', 'erp-profile'];
  const missing = required.filter((name) => !args[name]);
  if (missing.length || (!args['ivo-reference'] && !args['ivo-schema'])) {
    console.error(
      'Usage: node tools/mapping-suggester.js --erp-schema <json> --erp-profile <fields.csv>\n' +
        '                                       (--ivo-reference <dir> | --ivo-schema <json>)\n' +
        '                                       [--ivo-profile <fields.csv>]\n' +
        '                                       [--comparison <mapping.csv>]\n' +
        '                                       [--execution-run <run.json> | --execution-evidence <mappings.csv>]\n' +
        '                                       [--out <dir>] [--label <name>]',
    );
    process.exit(1);
  }

  const referenceDir = args['ivo-reference'] ? path.resolve(args['ivo-reference']) : null;
  const ivoSchemaFile = referenceDir ? path.join(referenceDir, 'schema.json') : args['ivo-schema'];
  const sourceSchema = readSchema(args['erp-schema']);
  const destSchema = readSchema(ivoSchemaFile);
  const catalogRows = referenceDir && fs.existsSync(path.join(referenceDir, 'field-catalog.csv'))
    ? readCsv(path.join(referenceDir, 'field-catalog.csv'))
    : [];
  const destCatalog = new Map(catalogRows.map((row) => [row.field, row]));
  for (const [fieldName, catalog] of destCatalog) {
    const field = destSchema.get(fieldName);
    if (field && catalog.description) field.description = catalog.description;
  }
  const sourceProfiles = readCsv(args['erp-profile']);
  const destProfiles = args['ivo-profile']
    ? readCsv(args['ivo-profile'])
    : [...destSchema.values()].map((field) => ({
      field: field.path,
      declared_type: field.types.join('|'),
      nullable: field.nullable ? 'yes' : 'no',
      required: field.required ? 'yes' : 'no',
      declared_maxlen: field.maxLength ?? '',
      observed_type: '',
    }));
  const comparison = args.comparison ? readCsv(args.comparison) : [];
  let allExecutionMappings = [];
  if (args['execution-run']) {
    allExecutionMappings = extractExecutionMappings(
      JSON.parse(fs.readFileSync(path.resolve(args['execution-run']), 'utf8')),
    ).mappings;
  } else if (args['execution-evidence']) {
    allExecutionMappings = readCsv(args['execution-evidence']).map((row) => ({
      operation: row.operation,
      destinationObject: row.destination_object,
      destinationField: row.destination_field,
      sourceFields: String(row.source_fields || '').split('|').filter(Boolean),
      kind: row.kind,
      lookupSteps: String(row.lookup_steps || '').split('|').filter(Boolean),
      expression: row.value_handling,
      actionStepId: row.action_step,
    }));
  }
  const executionGroups = new Map();
  for (const mapping of allExecutionMappings) {
    const objectPath = mapping.destinationObject.replace(/\/(?:add|update)$/i, '');
    if (!executionGroups.has(objectPath)) executionGroups.set(objectPath, []);
    executionGroups.get(objectPath).push(mapping);
  }
  const executionMappings = [...executionGroups.values()].sort((left, right) => {
    const overlapCount = (rows) => new Set(rows
      .map((row) => row.destinationField)
      .filter((field) => destSchema.has(field))).size;
    return overlapCount(right) - overlapCount(left);
  })[0] || [];
  const outDir = path.resolve(args.out || 'out/mapping-suggester');
  const rows = suggestionRows(sourceProfiles, destProfiles, sourceSchema, destSchema, comparison, destCatalog, executionMappings);

  fs.mkdirSync(outDir, { recursive: true });
  writeSuggestions(rows, path.join(outDir, 'suggestions.csv'), args.reset !== 'yes');
  populateApprovedTransforms(rows, args.approved ? path.resolve(args.approved) : null);
  writeQuestions(rows, path.join(outDir, 'questions.md'));
  writeReport(rows, {
    label: args.label || 'ERP to IVO',
    sourceProfile: relative(args['erp-profile']),
    destProfile: args['ivo-profile'] ? relative(args['ivo-profile']) : 'IVO reference schema only',
    comparison: args.comparison ? relative(args.comparison) : null,
  }, path.join(outDir, 'report.md'));

  const recovered = rows.filter((row) => row.status === 'recovered').length;
  const actualRun = rows.filter((row) => row.status === 'actual-run').length;
  const referenced = rows.filter((row) => row.status === 'reference').length;
  const profiled = rows.filter((row) => row.status === 'profiled').length;
  const suggested = rows.filter((row) => row.status === 'suggested').length;
  const questions = rows.filter((row) => row.status === 'question').length;
  console.log(`${args.label || 'ERP → IVO'}: ${rows.length} destination fields`);
  console.log(`  recovered evidence: ${recovered}`);
  console.log(`  actual run evidence: ${actualRun}`);
  console.log(`  IVO reference:      ${referenced}`);
  console.log(`  profile evidence:   ${profiled}`);
  console.log(`  new suggestions:    ${suggested}`);
  console.log(`  questions:          ${questions}`);
  console.log(`  → ${path.relative(process.cwd(), outDir)}`);
}

if (require.main === module) main();

module.exports = { scoreCandidate };