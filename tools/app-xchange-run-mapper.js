'use strict';

const fs = require('fs');
const path = require('path');
const { toCsvRow } = require('./csv');

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 2) {
    if (!argv[index].startsWith('--')) throw new Error(`Unexpected argument: ${argv[index]}`);
    args[argv[index].slice(2)] = argv[index + 1];
  }
  return args;
}

function walk(value, visit, seen = new Set()) {
  if (!value || typeof value !== 'object' || seen.has(value)) return;
  seen.add(value);
  visit(value);
  for (const child of Object.values(value)) {
    if (Array.isArray(child)) child.forEach((item) => walk(item, visit, seen));
    else walk(child, visit, seen);
  }
}

function normalized(value) {
  return String(value ?? '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '');
}

function triggerFields(expression) {
  const fields = new Set();
  const pattern = /flow\.trigger\.data(?:\?\.)?(?:([A-Za-z_$][\w$]*)|\[['"]([^'"]+)['"]\])/g;
  for (const match of String(expression || '').matchAll(pattern)) fields.add(match[1] || match[2]);
  return [...fields];
}

function stepReferences(expression) {
  return [...String(expression || '').matchAll(/flow\.step\(['"]([^'"]+)['"]\)/g)].map((match) => match[1]);
}

function entries(value, prefix = '') {
  if (!value || typeof value !== 'object') return [];
  return Object.entries(value).flatMap(([key, child]) => {
    const field = prefix ? `${prefix}.${key}` : key;
    return child && typeof child === 'object' && !Array.isArray(child)
      ? entries(child, field)
      : [[field, child]];
  });
}

function findSourceFields(stepId, steps, triggerData, visiting = new Set()) {
  if (!stepId || visiting.has(stepId)) return [];
  visiting.add(stepId);
  const step = steps.get(stepId);
  if (!step) return [];
  const filters = step.inputData?.Filters || step.input?.Filters || [];
  const triggerValues = entries(triggerData).filter(([field]) => !field.startsWith('__'));
  const sources = new Set();

  for (const filter of filters) {
    const filterValue = normalized(filter.ValueExpression ?? filter.Value);
    if (!filterValue) continue;
    let matchedTrigger = false;
    for (const [field, value] of triggerValues) {
      const candidate = normalized(value);
      if (candidate && (candidate === filterValue || (candidate.length >= 3 && filterValue.includes(candidate)))) {
        sources.add(field);
        matchedTrigger = true;
      }
    }
    if (matchedTrigger) continue;
    for (const [producerId, producer] of steps) {
      if (producerId === stepId) continue;
      const producedValues = entries(producer.data);
      if (producedValues.some(([, value]) => {
        const candidate = normalized(value);
        return candidate.length >= 3 && (candidate === filterValue || filterValue.includes(candidate));
      })) {
        findSourceFields(producerId, steps, triggerData, new Set(visiting)).forEach((field) => sources.add(field));
      }
    }
  }
  return [...sources];
}

function extractExecutionMappings(document) {
  const runs = Array.isArray(document) ? document : [document];
  const mappings = [];
  const lookups = [];

  for (const run of runs) {
    const triggerData = run?.trigger?.data || {};
    const sourceObject = run?.trigger?.info?.EventInfo?.DataObjectPath || '';
    const steps = new Map();
    const actions = [];
    walk(run, (value) => {
      if (!value.id) return;
      if (!steps.has(value.id) || value.inputData) steps.set(value.id, value);
      const input = value.inputData || value.input || {};
      if (input.ActionPath && input.ActionBody && Object.values(input.ActionBody).some(
        (expression) => typeof expression === 'string' && expression.startsWith('='),
      )) actions.push({ stepId: value.id, name: value.name || '', input });
    });

    for (const [stepId, step] of steps) {
      const input = step.inputData || step.input || {};
      if (input.DataObjectPath && Array.isArray(input.Filters)) {
        for (const filter of input.Filters) {
          lookups.push({
            stepId,
            name: step.name || '',
            dataObjectPath: input.DataObjectPath,
            filterField: filter.PropertyName || '',
            filterValue: filter.ValueExpression ?? filter.Value ?? '',
            sourceFields: findSourceFields(stepId, steps, triggerData),
            selectFields: input.SelectProperties || [],
          });
        }
      }

    }

    for (const action of actions) {
      const { stepId, input } = action;
      const actionBody = input.ActionBody;
      for (const [destinationField, expression] of Object.entries(actionBody)) {
        if (typeof expression !== 'string' || !expression.startsWith('=')) continue;
        const referencedSteps = [...new Set(stepReferences(expression))];
        const sources = new Set(triggerFields(expression));
        referencedSteps.forEach((reference) => {
          findSourceFields(reference, steps, triggerData).forEach((field) => sources.add(field));
        });
        mappings.push({
          actionStepId: stepId,
          actionName: action.name,
          operation: input.ActionPath.split('/').at(-1),
          sourceObject,
          destinationObject: input.ActionPath,
          destinationField,
          sourceFields: [...sources],
          lookupSteps: referencedSteps,
          kind: referencedSteps.length ? 'lookup' : sources.size ? 'direct' : /uuid\.v4\s*\(/.test(expression) ? 'generated' : 'constant',
          expression,
        });
      }
    }
  }
  return { mappings, lookups };
}

function writeCsv(rows, headers, file, values) {
  const lines = rows.map((row) => toCsvRow(values(row)));
  fs.writeFileSync(file, [toCsvRow(headers), ...lines].join('\n') + '\n');
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.run) {
    console.error('Usage: node tools/app-xchange-run-mapper.js --run <run.json> [--out <dir>]');
    process.exit(1);
  }
  const inputFile = path.resolve(args.run);
  const outDir = path.resolve(args.out || 'out/app-xchange-run');
  const result = extractExecutionMappings(JSON.parse(fs.readFileSync(inputFile, 'utf8')));
  fs.mkdirSync(outDir, { recursive: true });
  writeCsv(result.mappings, [
    'operation', 'destination_object', 'destination_field', 'source_object', 'source_fields',
    'kind', 'lookup_steps', 'value_handling', 'action_step',
  ], path.join(outDir, 'mappings.csv'), (row) => [
    row.operation, row.destinationObject, row.destinationField, row.sourceObject, row.sourceFields.join('|'),
    row.kind, row.lookupSteps.join('|'), row.expression, row.actionStepId,
  ]);
  writeCsv(result.lookups, [
    'step_id', 'name', 'data_object_path', 'filter_field', 'filter_value', 'source_fields', 'select_fields',
  ], path.join(outDir, 'lookups.csv'), (row) => [
    row.stepId, row.name, row.dataObjectPath, row.filterField, row.filterValue,
    row.sourceFields.join('|'), row.selectFields.join('|'),
  ]);
  console.log(`Extracted ${result.mappings.length} action mappings and ${result.lookups.length} lookup filters.`);
  console.log(`  → ${path.relative(process.cwd(), outDir)}`);
}

if (require.main === module) main();

module.exports = { extractExecutionMappings };