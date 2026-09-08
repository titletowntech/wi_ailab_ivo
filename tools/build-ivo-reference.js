'use strict';

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { parseCsv, toCsvRow } = require('./csv');
const { flattenSchema } = require('./schema');

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 2) {
    if (!argv[i].startsWith('--')) throw new Error(`Unexpected argument: ${argv[i]}`);
    args[argv[i].slice(2)] = argv[i + 1];
  }
  return args;
}

function readCsv(file) {
  if (!file) return [];
  const table = parseCsv(fs.readFileSync(path.resolve(file), 'utf8'));
  return table.records.map((record) => Object.fromEntries(table.headers.map((header, index) => [header, record[index]])));
}

function bool(value) {
  return value ? 'yes' : 'no';
}

function resolveSourceFile(sourceDir, preferredNames, extension, required) {
  const preferred = preferredNames
    .map((file) => path.join(sourceDir, file))
    .find((file) => fs.existsSync(file));
  if (preferred) return preferred;

  const candidates = fs.readdirSync(sourceDir, { withFileTypes: true })
    .filter((entry) => entry.isFile() && path.extname(entry.name).toLowerCase() === extension)
    .map((entry) => path.join(sourceDir, entry.name));
  if (candidates.length === 1) return candidates[0];
  if (!required && candidates.length === 0) return null;

  const kind = extension === '.json' ? 'schema JSON' : 'sample CSV';
  throw new Error(`Expected exactly one ${kind} in ${path.relative(process.cwd(), sourceDir)}; found ${candidates.length}.`);
}

function inferredOwnership(field, comparison) {
  if (field.writeOnly) return ['integration', 'schema marks writeOnly'];
  if (comparison && comparison.kind === 'identifier') return ['ivo', 'observed as destination-generated identifier'];
  if (comparison && comparison.kind === 'direct') return ['integration', 'observed direct mapping'];
  if (comparison && comparison.kind === 'lookup') return ['integration', 'observed lookup-backed mapping'];
  if (comparison && comparison.kind === 'constant') return ['confirm', 'constant in one customer; ownership not established'];
  if (comparison && comparison.kind === 'empty') return ['confirm', 'unused in one customer; ownership not established'];
  return ['confirm', 'not established by supplied schema or observations'];
}

function writeFieldCatalog(schema, profiles, comparisons, file) {
  const profileByField = new Map(profiles.map((row) => [row.field, row]));
  const comparisonByField = new Map(comparisons.map((row) => [row.dest_field, row]));
  const header = [
    'field', 'type', 'nullable', 'required', 'write_only', 'format', 'max_length',
    'description', 'ownership', 'mapping_behavior', 'reference_object', 'default_value',
    'observed_fill_pct', 'observed_distinct', 'observed_classification', 'status', 'notes',
  ];
  const rows = [];
  for (const field of schema.values()) {
    const profile = profileByField.get(field.path) || {};
    const comparison = comparisonByField.get(field.path);
    const [ownership, ownershipNote] = inferredOwnership(field, comparison);
    let behavior = comparison ? comparison.kind : 'unknown';
    if (behavior === 'identifier') behavior = 'generated';
    const status = field.description && ownership !== 'confirm' ? 'usable' : 'confirm';
    rows.push(toCsvRow([
      field.path,
      field.types.join('|'),
      bool(field.nullable),
      bool(field.required),
      bool(field.writeOnly),
      field.format || '',
      field.maxLength ?? '',
      field.description,
      ownership,
      behavior,
      '',
      '',
      profile.fill_pct || '',
      profile.distinct || '',
      comparison ? comparison.kind : '',
      status,
      comparison && comparison.kind === 'constant'
        ? `${ownershipNote}; observed KNA value ${JSON.stringify(profile.top_value || '')} is not a universal default`
        : ownershipNote,
    ]));
  }
  fs.writeFileSync(file, [toCsvRow(header), ...rows].join('\n') + '\n');
}

function writeValidationRules(schema, comparisons, objectName, file) {
  const generatedCandidates = comparisons.filter((row) => row.kind === 'identifier').map((row) => row.dest_field);
  const lookupCandidates = comparisons.filter((row) => row.kind === 'lookup').map((row) => row.dest_field);
  const prohibited = [...schema.values()].filter((field) => field.readOnly).map((field) => field.path);
  const rules = {
    version: 1,
    object: objectName,
    sourceOfTruth: `reference/ivo/${objectName}/schema.json`,
    blockingRules: {
      rejectUnknownFields: true,
      requireMappedOrDefaulted: [...schema.values()].filter((field) => field.required && !generatedCandidates.includes(field.path)).map((field) => field.path),
      prohibitInputFields: prohibited,
      enforceDeclaredTypes: true,
      enforceNullability: true,
      enforceFormats: true,
      enforceMaxLengthWhenDeclared: true,
      requireLookupResolution: [],
    },
    warnings: {
      writeOnlyFields: [...schema.values()].filter((field) => field.writeOnly).map((field) => field.path),
      generatedFieldCandidates: generatedCandidates,
      lookupCandidates,
      fieldsRequiringIVOConfirmation: [...schema.values()]
        .filter((field) => !field.description && !generatedCandidates.includes(field.path))
        .map((field) => field.path),
    },
    unresolved: [
      'Business uniqueness rules beyond the supplied JSON Schema',
      'Customer and organization scoping rules',
      'Defaults and generated-field behavior beyond observed KNA data',
      'Lookup endpoints, keys, and missing-value behavior',
      'Cross-object load order and relationship requirements',
    ],
  };
  fs.writeFileSync(file, JSON.stringify(rules, null, 2) + '\n');
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const sourceDir = args.source ? path.resolve(args.source) : null;
  if ((!args.schema && !sourceDir) || !args.out) {
    console.error(
      'Usage: node tools/build-ivo-reference.js --source <source-dir> --out <dir> [--object <name>]\n' +
        '   or: node tools/build-ivo-reference.js --schema <schema.json> --out <dir> [--object <name>]\n' +
        '                                         [--profile <fields.csv>] [--comparison <mapping.csv>]',
    );
    process.exit(1);
  }
  const schemaFile = sourceDir
    ? resolveSourceFile(sourceDir, ['schema.json'], '.json', true)
    : path.resolve(args.schema);
  if (!fs.existsSync(schemaFile)) {
    console.error(`IVO schema not found: ${path.relative(process.cwd(), schemaFile)}`);
    process.exit(1);
  }
  const outDir = path.resolve(args.out);
  const objectName = args.object || path.basename(outDir);
  const managedFiles = ['field-catalog.csv', 'validation-rules.json'];
  if (args.force !== 'yes' && managedFiles.some((file) => fs.existsSync(path.join(outDir, file)))) {
    console.error('Reference files already exist. Review changes first, then rerun with --force yes to replace generated files.');
    process.exit(2);
  }
  let profileFile = args.profile;
  if (sourceDir && !profileFile) {
    const sampleFile = resolveSourceFile(sourceDir, ['sample.csv', 'data.csv'], '.csv', false);
    if (sampleFile) {
      const profileDir = path.join(sourceDir, 'profile');
      const result = spawnSync(process.execPath, [
        path.join(__dirname, 'csv-profiler.js'),
        '--data', sampleFile,
        '--schema', schemaFile,
        '--out', profileDir,
        '--label', `IVO ${objectName} reference sample`,
      ], { stdio: 'inherit' });
      if (result.status !== 0) process.exit(result.status || 1);
      profileFile = path.join(profileDir, 'fields.csv');
    }
  }

  const schema = flattenSchema(JSON.parse(fs.readFileSync(schemaFile, 'utf8')));
  const profiles = readCsv(profileFile);
  const comparisons = readCsv(args.comparison);

  fs.mkdirSync(outDir, { recursive: true });
  const targetSchema = path.join(outDir, 'schema.json');
  if (schemaFile !== targetSchema) fs.copyFileSync(schemaFile, targetSchema);
  writeFieldCatalog(schema, profiles, comparisons, path.join(outDir, 'field-catalog.csv'));
  writeValidationRules(schema, comparisons, objectName, path.join(outDir, 'validation-rules.json'));
  console.log(`IVO ${objectName} reference: ${schema.size} fields → ${path.relative(process.cwd(), outDir)}`);
}

main();