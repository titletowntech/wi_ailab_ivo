'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { parseCsv, toCsvRow } = require('./csv');
const { flattenSchema } = require('./schema');
const { scoreCandidate } = require('./mapping-suggester');

const ROOT = path.resolve(__dirname, '..');
const WORKSPACE_HTML_FILE = path.join(ROOT, 'mockups', 'workspace-tree.html');
const MAPPING_HTML_FILE = path.join(ROOT, 'ui', 'ivo-mapping-workbench.html');
const CLIENT_FILE = path.join(ROOT, 'ui', 'workbench.js');
const PORT = Number(process.env.PORT || 43129);
const MAX_BODY_BYTES = 50 * 1024 * 1024;

function exists(file) {
  return fs.existsSync(file);
}

function directories(parent) {
  if (!exists(parent)) return [];
  return fs.readdirSync(parent, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right));
}

function files(parent) {
  if (!exists(parent)) return [];
  return fs.readdirSync(parent, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => entry.name)
    .sort((left, right) => left.localeCompare(right));
}

function readCsvObjects(file) {
  if (!exists(file)) return [];
  const table = parseCsv(fs.readFileSync(file, 'utf8'));
  return table.records.map((record) => Object.fromEntries(table.headers.map((header, index) => [header, record[index]])));
}

function readText(file) {
  return exists(file) ? fs.readFileSync(file, 'utf8') : '';
}

function profileSummary(objectDir) {
  const report = readText(path.join(objectDir, 'output', 'erp-profile', 'report.md'));
  const fields = readCsvObjects(path.join(objectDir, 'output', 'erp-profile', 'fields.csv'));
  const number = (label) => Number((report.match(new RegExp(`- (?:\\*\\*)?${label}(?:\\*\\*)?: (\\d[\\d,]*)`, 'i')) || [])[1]?.replaceAll(',', '') || 0);
  const empty = fields.filter((field) => Number(field.populated) === 0).length;
  const constant = fields.filter((field) => field.is_constant === 'yes').length;
  return {
    rows: number('Rows'),
    columns: number('Columns') || fields.length,
    repaired: number('Rows repaired'),
    quarantined: number('Rows quarantined'),
    empty,
    constant,
    informative: Math.max(0, fields.length - empty - constant),
    schemaColumns: fields.filter((field) => field.in_schema === 'yes').length,
    customColumns: fields.filter((field) => field.in_schema === 'no').length,
  };
}

function displayName(value) {
  return value.replace(/[_-]+/g, ' ').replace(/\b\w/g, (character) => character.toUpperCase());
}

function resolveReferenceKey(value) {
  const requested = String(value || '').toLowerCase();
  return directories(path.join(ROOT, 'reference', 'ivo'))
    .find((reference) => reference.toLowerCase() === requested) || null;
}

function customerReferenceKey(customer, object) {
  const settingsFile = customerSettingsFile(customer, object);
  if (exists(settingsFile)) {
    const settings = JSON.parse(fs.readFileSync(settingsFile, 'utf8'));
    if (settings.reference) return resolveReferenceKey(settings.reference);
  }
  return resolveReferenceKey(object);
}

function customerSettingsFile(customer, object) {
  return path.join(ROOT, 'customers', customer, object, 'table.json');
}

function writeCustomerReference(customer, object, reference) {
  atomicWrite(
    customerSettingsFile(customer, object),
    JSON.stringify({ reference }, null, 2) + '\n',
  );
}

function relative(file) {
  return path.relative(ROOT, file).split(path.sep).join('/');
}

function inputFiles(objectDir, system) {
  const inputDir = path.join(objectDir, 'input', system);
  return files(inputDir)
    .filter((name) => /\.(csv|json)$/i.test(name))
    .map((name) => ({ name, path: relative(path.join(inputDir, name)), type: path.extname(name).slice(1).toLowerCase() }));
}

function customerObject(customer, object) {
  const objectDir = path.join(ROOT, 'customers', customer, object);
  const referenceKey = customerReferenceKey(customer, object);
  const summary = profileSummary(objectDir);
  const sourceFiles = inputFiles(objectDir, 'erp');
  const ivoFiles = inputFiles(objectDir, 'ivo');
  const profileFile = path.join(objectDir, 'output', 'erp-profile', 'fields.csv');
  const suggestionFile = path.join(objectDir, 'output', 'mapping-proposal', 'suggestions.csv');
  const approvedFile = path.join(objectDir, 'output', 'approved-mapping', 'mapping.csv');
  const reviewed = readCsvObjects(exists(approvedFile) ? approvedFile : suggestionFile);
  return {
    key: object,
    name: displayName(object),
    customer,
    sourceFiles,
    ivoFiles,
    summary,
    status: exists(suggestionFile) ? 'Ready for review' : exists(profileFile) ? 'Profiled' : sourceFiles.length ? 'Needs analysis' : 'Needs files',
    updated: sourceFiles.length || ivoFiles.length
      ? new Date(Math.max(...[...sourceFiles, ...ivoFiles].map((file) => fs.statSync(path.join(ROOT, ...file.path.split('/'))).mtimeMs))).toISOString()
      : null,
    referenceKey,
    referenceName: referenceKey ? displayName(referenceKey) : null,
    hasReference: Boolean(referenceKey),
    fields: readCsvObjects(profileFile),
    mappings: reviewed,
  };
}

function referenceObject(object) {
  const referenceDir = path.join(ROOT, 'reference', 'ivo', object);
  const catalog = readCsvObjects(path.join(referenceDir, 'field-catalog.csv'));
  const referenceFiles = files(referenceDir)
    .filter((name) => /\.(csv|json)$/i.test(name))
    .map((name) => ({ name, path: relative(path.join(referenceDir, name)), type: path.extname(name).slice(1).toLowerCase() }));
  const needsReview = catalog.filter((field) => field.status && field.status !== 'usable').length;
  return {
    key: object,
    name: displayName(object),
    fields: catalog,
    fieldCount: catalog.length,
    needsReview,
    status: needsReview ? 'Needs review' : 'Ready',
    files: referenceFiles,
    updated: referenceFiles.length
      ? new Date(Math.max(...referenceFiles.map((file) => fs.statSync(path.join(ROOT, ...file.path.split('/'))).mtimeMs))).toISOString()
      : null,
  };
}

function catalog() {
  const customers = directories(path.join(ROOT, 'customers')).map((customer) => ({
    key: customer,
    name: displayName(customer),
    objects: directories(path.join(ROOT, 'customers', customer))
      .filter((object) => exists(path.join(ROOT, 'customers', customer, object, 'input', 'erp')))
      .map((object) => {
        const detail = customerObject(customer, object);
        return { ...detail, fields: undefined, mappings: undefined };
      }),
  }));
  const references = directories(path.join(ROOT, 'reference', 'ivo'))
    .filter((object) => exists(path.join(ROOT, 'reference', 'ivo', object, 'schema.json')))
    .map(referenceObject);
  return { customers, references };
}

function validKey(value) {
  return typeof value === 'string' && /^[A-Za-z0-9][A-Za-z0-9_-]*$/.test(value);
}

function requireKey(value, label) {
  if (!validKey(value)) throw new Error(`${label} may contain only letters, numbers, hyphens, and underscores.`);
  return value;
}

function safeWorkspaceFile(value) {
  const normalized = path.resolve(ROOT, String(value || '').replaceAll('/', path.sep));
  const allowed = ['customers', 'reference', 'reference-sources'].map((folder) => path.join(ROOT, folder) + path.sep);
  if (!allowed.some((folder) => normalized.startsWith(folder))) throw new Error('That file is outside the workbench data folders.');
  if (!exists(normalized) || !fs.statSync(normalized).isFile()) throw new Error('File not found.');
  return normalized;
}

function firstFile(parent, extension) {
  const name = files(parent).find((file) => file.toLowerCase().endsWith(extension));
  return name ? path.join(parent, name) : null;
}

function mappingScore(customer, object, destField, sourceField) {
  if (!sourceField) return { score: null, evidence: 'No customer field selected.' };

  const objectDir = path.join(ROOT, 'customers', customer, object);
  const sourceSchemaFile = firstFile(path.join(objectDir, 'input', 'erp'), '.json');
  const referenceKey = customerReferenceKey(customer, object);
  if (!referenceKey) throw new Error('Select an IVO table before calculating a match score.');
  const destDir = path.join(ROOT, 'reference', 'ivo', referenceKey);
  const destSchemaFile = path.join(destDir, 'schema.json');
  if (!sourceSchemaFile || !exists(destSchemaFile)) throw new Error('Source and IVO schemas are required to calculate a match score.');

  const sourceProfiles = readCsvObjects(path.join(objectDir, 'output', 'erp-profile', 'fields.csv'));
  const sourceProfile = sourceProfiles.find((profile) => profile.field === sourceField);
  if (!sourceProfile) throw new Error(`Customer field not found: ${sourceField}`);

  const sourceSchema = flattenSchema(JSON.parse(fs.readFileSync(sourceSchemaFile, 'utf8')));
  const destSchema = flattenSchema(JSON.parse(fs.readFileSync(destSchemaFile, 'utf8')));
  const destination = destSchema.get(destField);
  if (!destination) throw new Error(`IVO field not found: ${destField}`);

  const catalog = readCsvObjects(path.join(destDir, 'field-catalog.csv')).find((field) => field.field === destField);
  if (catalog?.description) destination.description = catalog.description;
  const result = scoreCandidate(
    { profile: sourceProfile, schema: sourceSchema.get(sourceField) || null },
    {
      profile: {
        field: destField,
        declared_type: destination.types.join('|'),
        declared_maxlen: destination.maxLength ?? '',
        observed_type: '',
      },
      schema: destination,
    },
  );

  if (!result) return { score: 0, evidence: 'Selected fields have incompatible declared types.' };
  return {
    score: Math.round(result.score * 100),
    evidence: `Selected source ${sourceField}: ${result.evidence.join('; ')}.`,
  };
}

function runNode(script, args) {
  const result = spawnSync(process.execPath, [path.join(ROOT, 'tools', script), ...args], {
    cwd: ROOT,
    encoding: 'utf8',
    maxBuffer: 10 * 1024 * 1024,
  });
  if (result.status !== 0) throw new Error((result.stderr || result.stdout || `${script} failed`).trim());
  return result.stdout.trim();
}

function processCustomerObject(customer, object, options = {}) {
  const objectDir = path.join(ROOT, 'customers', customer, object);
  const inputDir = path.join(objectDir, 'input', 'erp');
  const csvFile = firstFile(inputDir, '.csv');
  const ivoCsvFile = firstFile(path.join(objectDir, 'input', 'ivo'), '.csv');
  const schemaFile = firstFile(inputDir, '.json');
  if (!csvFile) throw new Error('Add a CSV data file before analyzing this table.');
  const profileDir = path.join(objectDir, 'output', 'erp-profile');
  const profileArgs = ['--data', csvFile, '--out', profileDir, '--label', `${customer} ERP ${displayName(object)}`];
  if (schemaFile) profileArgs.splice(2, 0, '--schema', schemaFile);
  runNode('csv-profiler.js', profileArgs);

  const comparisonDir = path.join(objectDir, 'output', 'comparison');
  const comparisonFile = path.join(comparisonDir, 'mapping.csv');
  if (ivoCsvFile) {
    runNode('data-comparer.js', [
      '--source', csvFile,
      '--dest', ivoCsvFile,
      '--out', comparisonDir,
      '--source-label', `${customer} ERP ${displayName(object)}`,
      '--dest-label', `${customer} IVO ${displayName(object)}`,
    ]);
  } else {
    fs.rmSync(comparisonDir, { recursive: true, force: true });
  }

  const referenceKey = customerReferenceKey(customer, object);
  const referenceDir = referenceKey ? path.join(ROOT, 'reference', 'ivo', referenceKey) : null;
  if (schemaFile && referenceDir && exists(path.join(referenceDir, 'schema.json'))) {
    const mappingArgs = [
      '--erp-schema', schemaFile,
      '--erp-profile', path.join(profileDir, 'fields.csv'),
      '--ivo-reference', referenceDir,
      '--out', path.join(objectDir, 'output', 'mapping-proposal'),
      '--label', `${customer} ${displayName(object)}`,
    ];
    if (exists(comparisonFile)) mappingArgs.push('--comparison', comparisonFile);
    const executionEvidence = path.join(objectDir, 'output', 'execution-evidence', 'mappings.csv');
    if (exists(executionEvidence)) mappingArgs.push('--execution-evidence', executionEvidence);
    if (options.resetMappings) mappingArgs.push('--reset', 'yes');
    else mappingArgs.push('--approved', path.join(objectDir, 'output', 'approved-mapping', 'mapping.csv'));
    runNode('mapping-suggester.js', mappingArgs);
    if (options.resetMappings) fs.rmSync(path.join(objectDir, 'output', 'approved-mapping'), { recursive: true, force: true });
  }
  return customerObject(customer, object);
}

function writeUploads(parent, uploads, allowedNames) {
  fs.mkdirSync(parent, { recursive: true });
  for (const upload of uploads || []) {
    const name = path.basename(String(upload.name || ''));
    if (!allowedNames(name)) throw new Error(`Unsupported file: ${name}`);
    const bytes = Buffer.from(String(upload.contentBase64 || ''), 'base64');
    if (!bytes.length) throw new Error(`${name} is empty.`);
    fs.writeFileSync(path.join(parent, name), bytes);
  }
}

function atomicWrite(file, content) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const temporary = `${file}.${process.pid}.tmp`;
  fs.writeFileSync(temporary, content);
  fs.renameSync(temporary, file);
}

function workspaceDirectory(customer) {
  return path.join(ROOT, 'customers', customer, 'workspace');
}

function requireCustomer(value) {
  const customer = requireKey(value, 'Customer');
  if (!exists(path.join(ROOT, 'customers', customer))) throw new Error('Customer not found.');
  return customer;
}

function workspaceFile(customer, name) {
  return path.join(workspaceDirectory(customer), `${name}.json`);
}

function readJson(file) {
  return exists(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : null;
}

function validateWorkspace(workspace) {
  const issues = [];
  const add = (severity, message, flowName = null, stepId = null, configurationIndex = null) => {
    issues.push({ severity, message, flowName, stepId, configurationIndex });
  };
  const validateScript = (script, label, flowName, stepId) => {
    if (typeof script !== 'string') return;
    try { new Function(script); }
    catch (error) { add('blocking', `${label} is not valid JavaScript: ${error.message}`, flowName, stepId); }
  };
  if (!workspace || workspace.schemaVersion !== 1 || !Array.isArray(workspace.flows)) {
    add('blocking', 'Workspace must use canonical schema version 1 and contain a flows array.');
    return issues;
  }
  if (workspace.flows.length === 0) add('blocking', 'Workspace requires at least one generated flow.');
  const flowNames = new Set();
  for (const flow of workspace.flows) {
    if (!flow.name) add('blocking', 'Every flow requires a name.');
    else if (flowNames.has(flow.name)) add('blocking', `Flow name must be unique: ${flow.name}.`, flow.name);
    else flowNames.add(flow.name);
    if (!flow.trigger) add('blocking', 'Flow trigger is not configured.', flow.name);
    if (!Array.isArray(flow.steps) || flow.steps.length === 0) add('blocking', 'Flow requires at least one step.', flow.name);
    const stepIds = new Set();
    for (const step of flow.steps || []) {
      if (!step.id) add('blocking', 'Every step requires an ID.', flow.name);
      else if (stepIds.has(step.id)) add('blocking', `Step ID must be unique within the flow: ${step.id}.`, flow.name, step.id);
      else stepIds.add(step.id);
      if (!step.name || !step.type) add('blocking', 'Every step requires a name and App Xchange type.', flow.name, step.id);
      if (!step.connector) add('blocking', 'Every step requires a connector identity.', flow.name, step.id);
      if (step.type === 'getdatafromcachev2' && (!step.filter?.property || !step.filter?.operator || !step.filter?.value)) {
        add('blocking', 'Lookup filter is incomplete.', flow.name, step.id);
      }
      if (['if', 'code', 'queueactionv3'].includes(step.type) && typeof step.code !== 'string') {
        add('blocking', 'This step requires JavaScript code.', flow.name, step.id);
      }
      validateScript(step.code, 'Code block', flow.name, step.id);
      if (step.type === 'callflow') {
        const calledFlow = step.details?.['Called flow'];
        if (!calledFlow) add('blocking', 'Called flow is not configured.', flow.name, step.id);
        else if (!workspace.flows.some((candidate) => candidate.name === calledFlow)) add('blocking', `Called flow does not exist: ${calledFlow}.`, flow.name, step.id);
        if (typeof step.inputCode !== 'string') add('warning', 'Called flow has no explicit input expression.', flow.name, step.id);
        validateScript(step.inputCode, 'Called-flow input', flow.name, step.id);
      }
    }
    for (const [configurationIndex, configuration] of (flow.configurations || []).entries()) {
      if (!configuration.name || !configuration.type) add('blocking', 'Every configuration requires a name and type.', flow.name, null, configurationIndex);
      if (configuration.required && String(configuration.defaultValue || '').trim() === '') {
        add('blocking', `Required configuration has no default value: ${configuration.name || 'unnamed'}.`, flow.name, null, configurationIndex);
      }
    }
  }
  return issues;
}

function workspaceBundle(customer) {
  const directory = workspaceDirectory(customer);
  const revisionsDirectory = path.join(directory, 'revisions');
  const revisions = files(revisionsDirectory)
    .filter((name) => name.endsWith('.json'))
    .reverse()
    .map((name) => {
      const revision = readJson(path.join(revisionsDirectory, name));
      return { id: name.slice(0, -5), approvedAt: revision?.review?.approvedAt || null, approvedBy: revision?.review?.approvedBy || null };
    });
  const draft = readJson(workspaceFile(customer, 'draft'));
  return {
    generated: readJson(workspaceFile(customer, 'generated')),
    draft,
    approved: readJson(workspaceFile(customer, 'approved')),
    revisions,
    validation: draft ? validateWorkspace(draft) : [],
  };
}

function saveWorkspaceDraft(customer, workspace) {
  const issues = validateWorkspace(workspace);
  if (issues.some((issue) => issue.message.startsWith('Workspace must'))) throw new Error(issues[0].message);
  const draft = structuredClone(workspace);
  draft.updatedAt = new Date().toISOString();
  if (!exists(workspaceFile(customer, 'generated'))) {
    const generated = structuredClone(draft);
    generated.review = { status: 'generated', generatedAt: generated.provenance?.generatedAt || draft.updatedAt };
    atomicWrite(workspaceFile(customer, 'generated'), JSON.stringify(generated, null, 2) + '\n');
  }
  atomicWrite(workspaceFile(customer, 'draft'), JSON.stringify(draft, null, 2) + '\n');
  return { draft, validation: issues };
}

function approveWorkspace(customer, data) {
  const draft = readJson(workspaceFile(customer, 'draft'));
  if (!draft) throw new Error('Save the generated workspace before approving it.');
  const issues = validateWorkspace(draft);
  if (issues.some((issue) => issue.severity === 'blocking')) throw new Error('Resolve all blocking validation issues before approval.');
  if (draft.flows.some((flow) => flow.review?.status !== 'approved')) throw new Error('Approve every flow before approving the workspace.');
  const approvedAt = new Date().toISOString();
  const approved = structuredClone(draft);
  approved.review = { status: 'approved', approvedAt, approvedBy: String(data.approvedBy || 'Local reviewer'), notes: String(data.notes || '') };
  const revisionId = approvedAt.replace(/[:.]/g, '-');
  atomicWrite(workspaceFile(customer, 'approved'), JSON.stringify(approved, null, 2) + '\n');
  atomicWrite(path.join(workspaceDirectory(customer), 'revisions', `${revisionId}.json`), JSON.stringify(approved, null, 2) + '\n');
  atomicWrite(workspaceFile(customer, 'draft'), JSON.stringify(approved, null, 2) + '\n');
  return { approved, revisionId, validation: issues };
}

function saveReview(customer, object, review) {
  const objectDir = path.join(ROOT, 'customers', customer, object);
  const approvedFile = path.join(objectDir, 'output', 'approved-mapping', 'mapping.csv');
  const sourceFile = exists(approvedFile)
    ? approvedFile
    : path.join(objectDir, 'output', 'mapping-proposal', 'suggestions.csv');
  if (!exists(sourceFile)) throw new Error('Generate mapping suggestions before reviewing them.');
  const table = parseCsv(fs.readFileSync(sourceFile, 'utf8'));
  const destinationIndex = table.headers.indexOf('dest_field');
  const decisionIndex = table.headers.indexOf('review_decision');
  const notesIndex = table.headers.indexOf('review_notes');
  const sourceIndex = table.headers.indexOf('source_field');
  const transformIndex = table.headers.indexOf('transform');
  const scoreIndex = table.headers.indexOf('score');
  const rationaleIndex = table.headers.indexOf('rationale');
  const row = table.records.find((record) => record[destinationIndex] === review.destField);
  if (!row) throw new Error('Mapping field not found.');
  row[decisionIndex] = String(review.reviewDecision || '');
  row[notesIndex] = String(review.reviewNotes || '');
  if (sourceIndex >= 0 && review.sourceField !== undefined) row[sourceIndex] = String(review.sourceField);
  if (transformIndex >= 0 && review.transform !== undefined) row[transformIndex] = String(review.transform);
  if (review.sourceField !== undefined) {
    const recalculated = mappingScore(customer, object, review.destField, String(review.sourceField));
    if (scoreIndex >= 0) row[scoreIndex] = recalculated.score === null ? '' : `${recalculated.score}%`;
    if (rationaleIndex >= 0) row[rationaleIndex] = recalculated.evidence;
  }
  atomicWrite(approvedFile, [toCsvRow(table.headers), ...table.records.map(toCsvRow)].join('\n') + '\n');
  return customerObject(customer, object);
}

function json(response, status, value) {
  response.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' });
  response.end(JSON.stringify(value));
}

function body(request) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    request.on('data', (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(new Error('Upload is larger than 50 MB.'));
        request.destroy();
        return;
      }
      chunks.push(chunk);
    });
    request.on('end', () => {
      try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')); }
      catch { reject(new Error('Request body must be valid JSON.')); }
    });
    request.on('error', reject);
  });
}

function routeParts(url) {
  return url.pathname.split('/').filter(Boolean).map(decodeURIComponent);
}

async function api(request, response, url) {
  const parts = routeParts(url);
  if (request.method === 'GET' && url.pathname === '/api/catalog') return json(response, 200, catalog());
  if (parts[1] === 'customers' && parts[3] === 'workspace' && parts.length === 4) {
    const customer = requireCustomer(parts[2]);
    if (request.method === 'GET') return json(response, 200, workspaceBundle(customer));
    if (request.method === 'PUT') return json(response, 200, saveWorkspaceDraft(customer, await body(request)));
  }
  if (request.method === 'POST' && parts[1] === 'customers' && parts[3] === 'workspace' && parts[4] === 'approve') {
    return json(response, 200, approveWorkspace(requireCustomer(parts[2]), await body(request)));
  }
  if (request.method === 'GET' && url.pathname === '/api/file') {
    const file = safeWorkspaceFile(url.searchParams.get('path'));
    response.writeHead(200, { 'Content-Type': /\.json$/i.test(file) ? 'application/json; charset=utf-8' : 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' });
    return fs.createReadStream(file).pipe(response);
  }
  if (request.method === 'GET' && parts[1] === 'customers' && parts[3] === 'objects' && parts.length === 5) {
    return json(response, 200, customerObject(requireKey(parts[2], 'Customer'), requireKey(parts[4], 'Object')));
  }
  if (request.method === 'GET' && parts[1] === 'customers' && parts[3] === 'objects' && parts[5] === 'values') {
    const customer = requireKey(parts[2], 'Customer');
    const object = requireKey(parts[4], 'Object');
    const evidenceFile = path.join(ROOT, 'customers', customer, object, 'output', 'comparison', 'value-evidence.json');
    if (!exists(evidenceFile)) throw new Error('Upload an IVO CSV and analyze this table to view matching values.');
    const evidence = JSON.parse(fs.readFileSync(evidenceFile, 'utf8'));
    const field = evidence[String(url.searchParams.get('dest') || '')];
    if (!field) throw new Error('Value comparison is not available for this field.');
    return json(response, 200, field);
  }
  if (request.method === 'GET' && parts[1] === 'references' && parts.length === 3) {
    return json(response, 200, referenceObject(requireKey(parts[2], 'Object')));
  }
  if (request.method === 'POST' && parts[1] === 'customers' && parts[3] === 'objects' && parts.length === 4) {
    const customer = requireKey(parts[2], 'Customer');
    const data = await body(request);
    const object = requireKey(data.object, 'Object');
    const reference = resolveReferenceKey(requireKey(data.reference, 'IVO table'));
    if (!reference) throw new Error('The selected IVO table does not exist.');
    const inputDir = path.join(ROOT, 'customers', customer, object, 'input', 'erp');
    if (exists(inputDir) && files(inputDir).length) throw new Error('That customer table already exists.');
    writeUploads(inputDir, data.files, (name) => /\.(csv|json)$/i.test(name));
    writeCustomerReference(customer, object, reference);
    return json(response, 201, processCustomerObject(customer, object));
  }
  if (request.method === 'PATCH' && parts[1] === 'customers' && parts[3] === 'objects' && parts.length === 5) {
    const customer = requireKey(parts[2], 'Customer');
    const object = requireKey(parts[4], 'Object');
    const data = await body(request);
    const reference = resolveReferenceKey(requireKey(data.reference, 'IVO table'));
    if (!reference) throw new Error('The selected IVO table does not exist.');
    if (customerReferenceKey(customer, object) === reference) return json(response, 200, customerObject(customer, object));
    if (data.confirmReset !== true) throw new Error('Confirm that changing the IVO table may reset all field matches.');
    const settingsFile = customerSettingsFile(customer, object);
    const previousSettings = exists(settingsFile) ? fs.readFileSync(settingsFile, 'utf8') : null;
    writeCustomerReference(customer, object, reference);
    try {
      return json(response, 200, processCustomerObject(customer, object, { resetMappings: true }));
    } catch (error) {
      if (previousSettings === null) fs.rmSync(settingsFile, { force: true });
      else atomicWrite(settingsFile, previousSettings);
      throw error;
    }
  }
  if (request.method === 'POST' && parts[1] === 'customers' && parts[3] === 'objects' && parts[5] === 'process') {
    const data = await body(request);
    if (data.confirmReset !== true) throw new Error('Confirm that reanalysis may reset all mappings.');
    return json(response, 200, processCustomerObject(
      requireKey(parts[2], 'Customer'),
      requireKey(parts[4], 'Object'),
      { resetMappings: true },
    ));
  }
  if (request.method === 'POST' && parts[1] === 'customers' && parts[3] === 'objects' && parts[5] === 'ivo') {
    const customer = requireKey(parts[2], 'Customer');
    const object = requireKey(parts[4], 'Object');
    const data = await body(request);
    if (data.confirmReset !== true) throw new Error('Confirm that IVO analysis may reset all mappings.');
    if (!data.file || !/\.csv$/i.test(String(data.file.name || ''))) throw new Error('Choose an IVO CSV file.');
    const inputDir = path.join(ROOT, 'customers', customer, object, 'input', 'ivo');
    const target = path.join(inputDir, 'data.csv');
    const previous = exists(target) ? fs.readFileSync(target) : null;
    fs.mkdirSync(inputDir, { recursive: true });
    try {
      writeUploads(inputDir, [{ ...data.file, name: 'data.csv' }], (name) => name === 'data.csv');
      return json(response, 200, processCustomerObject(customer, object, { resetMappings: true }));
    } catch (error) {
      if (previous === null) fs.rmSync(target, { force: true });
      else fs.writeFileSync(target, previous);
      throw error;
    }
  }
  if (request.method === 'POST' && parts[1] === 'customers' && parts[3] === 'objects' && parts[5] === 'score') {
    const data = await body(request);
    return json(response, 200, mappingScore(
      requireKey(parts[2], 'Customer'),
      requireKey(parts[4], 'Object'),
      String(data.destField || ''),
      String(data.sourceField || ''),
    ));
  }
  if (request.method === 'POST' && parts[1] === 'customers' && parts[3] === 'objects' && parts[5] === 'review') {
    return json(response, 200, saveReview(requireKey(parts[2], 'Customer'), requireKey(parts[4], 'Object'), await body(request)));
  }
  if (request.method === 'POST' && url.pathname === '/api/references') {
    const data = await body(request);
    const object = requireKey(data.object, 'Object');
    const sourceDir = path.join(ROOT, 'reference-sources', 'ivo', object);
    const outputDir = path.join(ROOT, 'reference', 'ivo', object);
    if (exists(path.join(outputDir, 'schema.json'))) throw new Error('That reference object already exists.');
    writeUploads(sourceDir, data.files, (name) => name === 'schema.json' || name === 'sample.csv');
    if (!exists(path.join(sourceDir, 'schema.json'))) throw new Error('A JSON schema named schema.json is required.');
    runNode('build-ivo-reference.js', ['--source', sourceDir, '--object', object, '--out', outputDir]);
    return json(response, 201, referenceObject(object));
  }
  return json(response, 404, { error: 'Not found.' });
}

function serveHtml(response, file) {
  response.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
  fs.createReadStream(file).pipe(response);
}

function serveClient(response) {
  response.writeHead(200, { 'Content-Type': 'text/javascript; charset=utf-8', 'Cache-Control': 'no-store' });
  fs.createReadStream(CLIENT_FILE).pipe(response);
}

const server = http.createServer(async (request, response) => {
  try {
    const url = new URL(request.url, `http://${request.headers.host || 'localhost'}`);
    if (url.pathname.startsWith('/api/')) return await api(request, response, url);
    if (request.method === 'GET' && url.pathname === '/workspace') return serveHtml(response, WORKSPACE_HTML_FILE);
    if (request.method === 'GET' && (url.pathname === '/' || url.pathname === '/mapping' || url.pathname === '/ui/ivo-mapping-workbench.html')) return serveHtml(response, MAPPING_HTML_FILE);
    if (request.method === 'GET' && url.pathname === '/ui/workbench.js') return serveClient(response);
    return json(response, 404, { error: 'Not found.' });
  } catch (error) {
    const status = /not found|outside/i.test(error.message) ? 404 : 400;
    return json(response, status, { error: error.message });
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`IVO Mapping Workbench: http://127.0.0.1:${PORT}`);
});
