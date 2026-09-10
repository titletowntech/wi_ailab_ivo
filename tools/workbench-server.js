'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');
const { parseCsv, toCsvRow } = require('./csv');
const { flattenSchema } = require('./schema');
const { scoreCandidate } = require('./mapping-suggester');
const { extractText, EXTENSIONS: TRANSCRIPT_EXTENSIONS } = require('./transcript');

const ROOT = path.resolve(__dirname, '..');
const WORKSPACE_HTML_FILE = path.join(ROOT, 'mockups', 'workspace-tree.html');
const MAPPING_HTML_FILE = path.join(ROOT, 'ui', 'ivo-mapping-workbench.html');
const INTEGRATIONS_HTML_FILE = path.join(ROOT, 'ui', 'integrations.html');
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
  const { byObject, defaultModule } = ivoModules();
  return {
    key: object,
    name: displayName(object),
    module: byObject.get(object) || defaultModule,
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

const CONNECTOR_HOSTS = new Map([
  ['vista.si.ryvit.com', 'Vista'],
  ['spectrum.si.ryvit.com', 'Spectrum'],
]);

function slug(value) {
  return String(value || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'unknown';
}

// Connector identity isn't stored anywhere; recover it from the connector schema's $id host.
function connectorFromSchema(schemaFile) {
  if (!schemaFile || !exists(schemaFile)) return null;
  try {
    const schema = JSON.parse(fs.readFileSync(schemaFile, 'utf8'));
    const host = String(schema.$id || '').match(/^https?:\/\/([^/]+)/)?.[1];
    if (!host) return null;
    return CONNECTOR_HOSTS.get(host) || host;
  } catch {
    return null;
  }
}

function customerConnector(customer, objects) {
  for (const object of objects) {
    const name = connectorFromSchema(firstFile(path.join(ROOT, 'customers', customer, object, 'input', 'erp'), '.json'));
    if (name) return name;
  }
  return 'Unknown';
}

function catalog() {
  const customers = directories(path.join(ROOT, 'customers')).map((customer) => {
    const objects = directories(path.join(ROOT, 'customers', customer))
      .filter((object) => exists(path.join(ROOT, 'customers', customer, object, 'input', 'erp')));
    const connectorName = customerConnector(customer, objects);
    return {
      key: customer,
      name: displayName(customer),
      connector: { key: slug(connectorName), name: connectorName },
      objects: objects.map((object) => {
        const detail = customerObject(customer, object);
        return { ...detail, fields: undefined, mappings: undefined };
      }),
    };
  });
  const references = directories(path.join(ROOT, 'reference', 'ivo'))
    .filter((object) => exists(path.join(ROOT, 'reference', 'ivo', object, 'schema.json')))
    .map(referenceObject);
  const connectors = [...new Map(customers.map((customer) => [customer.connector.key, customer.connector])).values()]
    .map((connector) => ({ ...connector, customerCount: customers.filter((customer) => customer.connector.key === connector.key).length }))
    .sort((left, right) => left.name.localeCompare(right.name));
  return { customers, references, connectors };
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

// Imported context files include binaries such as .docx, which must not be served as text.
function fileContentType(file) {
  if (/\.json$/i.test(file)) return 'application/json; charset=utf-8';
  if (/\.(csv|md|txt|vtt|srt)$/i.test(file)) return 'text/plain; charset=utf-8';
  return 'application/octet-stream';
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

const TRIGGER_TYPES = ['on-demand', 'cache-event', 'action-close-out', 'work-request-batch-ready'];
const CACHE_EVENTS = ['Create', 'Update', 'Delete'];
const ACTION_EVENTS = ['Any', 'Successful', 'Failed'];

function triggerDescription(trigger) {
  const target = `${trigger.connector || 'connector'} ${trigger.dataObject || 'data object'}`;
  const events = trigger.subscribedEvents.join(', ') || 'no events';
  if (trigger.type === 'cache-event') return `Cache event: ${target} on ${events}`;
  if (trigger.type === 'action-close-out') return `Action close-out: ${target} on ${events}`;
  if (trigger.type === 'work-request-batch-ready') return `Work request batch ready: ${trigger.workRequestType || 'work request type'}`;
  return trigger.inputSchemaType === 'custom' ? 'On-demand with a custom input schema' : 'On-demand';
}

// Earlier workspaces stored the trigger as a human-readable string. Keep that wording as the
// reviewer's note rather than discarding it, and derive `description` from the structure.
function normalizeTrigger(value) {
  const legacy = typeof value === 'string' ? value.trim() : null;
  const source = legacy === null ? value : {};
  const type = TRIGGER_TYPES.includes(source?.type) ? source.type : 'on-demand';
  const allowedEvents = type === 'action-close-out' ? ACTION_EVENTS : CACHE_EVENTS;
  const trigger = {
    type,
    connector: text(source?.connector),
    dataObject: text(source?.dataObject),
    subscribedEvents: [...new Set((Array.isArray(source?.subscribedEvents) ? source.subscribedEvents : [])
      .filter((event) => allowedEvents.includes(event)))],
    eventOrigin: [...new Set((Array.isArray(source?.eventOrigin) ? source.eventOrigin : []).map(text).filter(Boolean))],
    filterExpression: typeof source?.filterExpression === 'string' ? source.filterExpression : '',
    inputSchemaType: source?.inputSchemaType === 'custom' ? 'custom' : 'none',
    inputSchema: typeof source?.inputSchema === 'string' ? source.inputSchema : '',
    workRequestType: text(source?.workRequestType),
    workItemType: text(source?.workItemType),
    note: legacy ?? text(source?.note),
  };
  trigger.description = triggerDescription(trigger);
  return trigger;
}

function validateTrigger(trigger, flowName, add, validateScript) {
  if (!TRIGGER_TYPES.includes(trigger.type)) {
    add('blocking', 'Flow trigger is not configured.', flowName);
    return;
  }
  if (trigger.type === 'cache-event' || trigger.type === 'action-close-out') {
    if (!trigger.connector) add('blocking', 'Trigger requires a connector.', flowName);
    if (!trigger.dataObject) add('blocking', 'Trigger requires a data object.', flowName);
    if (!trigger.subscribedEvents.length) add('blocking', 'Trigger requires at least one subscribed event.', flowName);
  }
  if (trigger.type === 'cache-event') {
    if (!trigger.eventOrigin.length) add('blocking', 'Cache event trigger requires at least one event origin.', flowName);
    // Completed actions also cache write, so subscribing to both origins can loop when data
    // is maintained in both systems.
    else if (trigger.eventOrigin.length > 1) {
      add('warning', 'Trigger subscribes to every event origin. Confirm this cannot loop when the object is maintained in both systems.', flowName);
    }
    validateScript(trigger.filterExpression, 'Trigger filter expression', flowName, null);
    if (trigger.filterExpression.trim() && !/\breturn\b/.test(trigger.filterExpression)) {
      add('blocking', 'Trigger filter expression must explicitly return a value, or the flow never runs.', flowName);
    }
  }
  if (trigger.type === 'work-request-batch-ready' && !trigger.workRequestType) {
    add('blocking', 'Work request batch ready trigger requires a work request type.', flowName);
  }
  if (trigger.type === 'on-demand' && trigger.inputSchemaType === 'custom') {
    if (!trigger.inputSchema.trim()) add('blocking', 'Custom input schema is empty.', flowName);
    else {
      try { JSON.parse(trigger.inputSchema); }
      catch (error) { add('blocking', `Custom input schema is not valid JSON: ${error.message}`, flowName); }
    }
  }
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
    validateTrigger(normalizeTrigger(flow.trigger), flow.name, add, validateScript);
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

const DECISION_CATEGORIES = ['service', 'field', 'include', 'exclude', 'rule', 'question'];
const DECISION_STATUSES = ['open', 'applied', 'rejected'];
const ENTRY_SOURCES = ['transcript', 'note', 'meeting', 'email'];
const VERSION_KINDS = ['session', 'checkpoint', 'approval'];
// Draft saves are debounced per keystroke batch, so consecutive edits fold into one session
// version instead of producing a version per keystroke.
const SESSION_WINDOW_MS = 30 * 60 * 1000;

function timestampId(value = new Date()) {
  return value.toISOString().replace(/[:.]/g, '-');
}

function discoveryFile(customer) {
  return path.join(workspaceDirectory(customer), 'discovery.json');
}

function normalizeDecision(decision) {
  return {
    category: DECISION_CATEGORIES.includes(decision?.category) ? decision.category : 'rule',
    statement: text(decision?.statement),
    object: text(decision?.object),
    field: text(decision?.field),
    status: DECISION_STATUSES.includes(decision?.status) ? decision.status : 'open',
  };
}

function normalizeEntry(entry, index) {
  const createdAt = typeof entry?.createdAt === 'string' ? entry.createdAt : new Date().toISOString();
  return {
    id: validKey(entry?.id) ? entry.id : `${timestampId()}-${index}`,
    date: /^\d{4}-\d{2}-\d{2}$/.test(entry?.date) ? entry.date : createdAt.slice(0, 10),
    title: text(entry?.title) || 'Untitled entry',
    source: ENTRY_SOURCES.includes(entry?.source) ? entry.source : 'note',
    sourceFile: text(entry?.sourceFile),
    body: typeof entry?.body === 'string' ? entry.body : '',
    decisions: (Array.isArray(entry?.decisions) ? entry.decisions : []).map(normalizeDecision),
    createdAt,
    updatedAt: new Date().toISOString(),
  };
}

function readDiscovery(customer) {
  const stored = readJson(discoveryFile(customer));
  const entries = (Array.isArray(stored?.entries) ? stored.entries : []).map(normalizeEntry);
  // Newest first so the log reads as a history.
  entries.sort((left, right) => String(right.date).localeCompare(String(left.date)) || String(right.createdAt).localeCompare(String(left.createdAt)));
  return { schemaVersion: 1, entries };
}

// Refuse rather than coerce: a malformed payload must never silently discard a customer's
// recorded decisions.
function saveDiscovery(customer, data) {
  if (!Array.isArray(data?.entries)) throw new Error('Discovery log must contain an entries array.');
  const discovery = { schemaVersion: 1, entries: data.entries.map(normalizeEntry) };
  atomicWrite(discoveryFile(customer), JSON.stringify(discovery, null, 2) + '\n');
  return readDiscovery(customer);
}

function importTranscript(customer, data) {
  const name = String(data?.file?.name || '');
  const extension = name.toLowerCase().match(/\.[a-z0-9]+$/)?.[0];
  if (!TRANSCRIPT_EXTENSIONS.includes(extension)) throw new Error(`Choose a ${TRANSCRIPT_EXTENSIONS.join(', ')} file.`);
  const buffer = Buffer.from(String(data?.file?.content || ''), 'base64');
  const body = extractText(name, buffer);
  if (!body.trim()) throw new Error('No readable text was found in that file.');
  // The original stays with the other externally supplied context files.
  const contextDir = path.join(ROOT, 'customers', customer, 'input', 'context');
  const safeName = name.replace(/[^A-Za-z0-9._-]+/g, '-').replace(/^-+/, '');
  fs.mkdirSync(contextDir, { recursive: true });
  fs.writeFileSync(path.join(contextDir, safeName), buffer);
  const discovery = readDiscovery(customer);
  const createdAt = new Date().toISOString();
  // Transcript exports are usually named with the meeting date; prefer it over today.
  const namedDate = safeName.match(/(\d{4}-\d{2}-\d{2})/)?.[1];
  discovery.entries.unshift({
    id: timestampId(),
    date: /^\d{4}-\d{2}-\d{2}$/.test(data?.date) ? data.date : namedDate || createdAt.slice(0, 10),
    title: text(data?.title) || safeName.replace(/\.[a-z0-9]+$/i, ''),
    source: 'transcript',
    sourceFile: relative(path.join(contextDir, safeName)),
    body,
    decisions: [],
    createdAt,
    updatedAt: createdAt,
  });
  return saveDiscovery(customer, discovery);
}

function versionsDirectory(customer) {
  return path.join(workspaceDirectory(customer), 'versions');
}

function versionSummary(version) {
  return {
    id: version.id,
    kind: version.kind,
    label: version.label,
    createdAt: version.createdAt,
    updatedAt: version.updatedAt,
    createdBy: version.createdBy,
    editCount: version.editCount,
    discoveryEntryId: version.discoveryEntryId,
    notes: version.notes,
    flowCount: Array.isArray(version.workspace?.flows) ? version.workspace.flows.length : 0,
  };
}

function readVersions(customer) {
  const directory = versionsDirectory(customer);
  return files(directory)
    .filter((name) => name.endsWith('.json'))
    .map((name) => readJson(path.join(directory, name)))
    .filter((version) => version && VERSION_KINDS.includes(version.kind))
    .sort((left, right) => String(left.id).localeCompare(String(right.id)));
}

function listVersions(customer) {
  return readVersions(customer).reverse().map(versionSummary);
}

function requireVersion(customer, id) {
  const file = path.join(versionsDirectory(customer), `${requireKey(id, 'Version')}.json`);
  const version = readJson(file);
  if (!version) throw new Error('Version not found.');
  return version;
}

function writeVersion(customer, workspace, options = {}) {
  const createdAt = new Date().toISOString();
  const version = {
    id: options.id || timestampId(),
    kind: VERSION_KINDS.includes(options.kind) ? options.kind : 'checkpoint',
    label: text(options.label),
    createdAt,
    updatedAt: createdAt,
    createdBy: text(options.createdBy) || 'Local reviewer',
    editCount: Number.isFinite(options.editCount) ? options.editCount : 1,
    discoveryEntryId: validKey(options.discoveryEntryId) ? options.discoveryEntryId : null,
    notes: text(options.notes),
    workspace: structuredClone(workspace),
  };
  atomicWrite(path.join(versionsDirectory(customer), `${version.id}.json`), JSON.stringify(version, null, 2) + '\n');
  return version;
}

function sameWorkspace(left, right) {
  const comparable = (workspace) => {
    const copy = structuredClone(workspace || {});
    delete copy.updatedAt;
    return JSON.stringify(copy);
  };
  return comparable(left) === comparable(right);
}

// Fold rapid edits into one session version; start a new one after the window or once any
// other kind of version intervenes.
function recordDraftVersion(customer, draft) {
  const versions = readVersions(customer);
  const newest = versions[versions.length - 1];
  if (newest && sameWorkspace(newest.workspace, draft)) return;
  if (newest && newest.kind === 'session' && Date.now() - Date.parse(newest.updatedAt) < SESSION_WINDOW_MS) {
    const updated = {
      ...newest,
      updatedAt: new Date().toISOString(),
      editCount: (newest.editCount || 1) + 1,
      workspace: structuredClone(draft),
    };
    atomicWrite(path.join(versionsDirectory(customer), `${newest.id}.json`), JSON.stringify(updated, null, 2) + '\n');
    return;
  }
  writeVersion(customer, draft, { kind: 'session' });
}

function restoreVersion(customer, id, data) {
  const version = requireVersion(customer, id);
  const draft = readJson(workspaceFile(customer, 'draft'));
  if (!draft) throw new Error('Save the workspace before restoring a version.');
  const scope = data?.scope === 'flow' ? 'flow' : 'workspace';
  const describe = version.label ? `${version.label} (${version.id})` : version.id;
  writeVersion(customer, draft, { kind: 'checkpoint', label: `Before restoring ${describe}` });
  let restored;
  if (scope === 'flow') {
    const name = String(data?.flow || '');
    const source = (version.workspace?.flows || []).find((flow) => flow.name === name);
    if (!source) throw new Error('That version does not contain this flow.');
    restored = structuredClone(draft);
    const replacement = { ...structuredClone(source), review: { status: 'needs-review' } };
    const index = restored.flows.findIndex((flow) => flow.name === name);
    if (index >= 0) restored.flows[index] = replacement;
    else restored.flows.push(replacement);
  } else {
    restored = structuredClone(version.workspace);
    restored.flows = (restored.flows || []).map((flow) => ({ ...flow, review: { status: 'needs-review' } }));
  }
  // A restore is a change, so the workspace returns to review regardless of prior approval.
  restored.review = { status: 'needs-review' };
  restored.updatedAt = new Date().toISOString();
  atomicWrite(workspaceFile(customer, 'draft'), JSON.stringify(restored, null, 2) + '\n');
  writeVersion(customer, restored, {
    kind: 'checkpoint',
    label: scope === 'flow' ? `Restored flow ${data.flow} from ${describe}` : `Restored workspace from ${describe}`,
  });
  return workspaceBundle(customer);
}

function workspaceBundle(customer) {
  // Approval history is the approval subset of the version history, not a second store.
  const revisions = readVersions(customer)
    .filter((version) => version.kind === 'approval')
    .reverse()
    .map((version) => ({
      id: version.id,
      approvedAt: version.workspace?.review?.approvedAt || version.createdAt,
      approvedBy: version.workspace?.review?.approvedBy || version.createdBy,
    }));
  const draft = readJson(workspaceFile(customer, 'draft'));
  return {
    triggerCatalog: customerServiceCatalog(customer),
    generated: readJson(workspaceFile(customer, 'generated')),
    draft,
    approved: readJson(workspaceFile(customer, 'approved')),
    revisions,
    versions: listVersions(customer),
    discovery: readDiscovery(customer),
    validation: draft ? validateWorkspace(draft) : [],
  };
}

function saveWorkspaceDraft(customer, workspace) {
  const issues = validateWorkspace(workspace);
  if (issues.some((issue) => issue.message.startsWith('Workspace must'))) throw new Error(issues[0].message);
  const draft = structuredClone(workspace);
  for (const flow of draft.flows) flow.trigger = normalizeTrigger(flow.trigger);
  draft.updatedAt = new Date().toISOString();
  if (!exists(workspaceFile(customer, 'generated'))) {
    const generated = structuredClone(draft);
    generated.review = { status: 'generated', generatedAt: generated.provenance?.generatedAt || draft.updatedAt };
    atomicWrite(workspaceFile(customer, 'generated'), JSON.stringify(generated, null, 2) + '\n');
  }
  atomicWrite(workspaceFile(customer, 'draft'), JSON.stringify(draft, null, 2) + '\n');
  recordDraftVersion(customer, draft);
  return { draft, validation: issues, versions: listVersions(customer) };
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
  atomicWrite(workspaceFile(customer, 'draft'), JSON.stringify(approved, null, 2) + '\n');
  writeVersion(customer, approved, {
    id: revisionId,
    kind: 'approval',
    label: `Approved by ${approved.review.approvedBy}`,
    createdBy: approved.review.approvedBy,
    notes: approved.review.notes,
  });
  return { approved, revisionId, validation: issues, versions: listVersions(customer) };
}

const CONNECTOR_NAMES = new Map([
  ['vista', 'Vista'],
  ['spectrum', 'Spectrum'],
  ['foundation', 'Foundation'],
  ['sage-100-contractor', 'Sage 100 Contractor'],
  ['sage-300-cre', 'Sage 300 CRE'],
]);
const CONFIGURATION_TYPES = ['string', 'string[]', 'decimal', 'decimal[]', 'integer', 'integer[]', 'boolean'];
const FEATURE_STATUSES = ['under-construction', 'active', 'deprecated', 'archived'];
const INTERVAL_MINUTES = new Map([['Minute', 1], ['Hour', 60], ['Day', 1440]]);
const MINIMUM_SCHEDULE_MINUTES = 15;

// Connector objects are captured under reference/ for the two curated systems and under
// reference-sources/ for the rest. Prefer the curated copy and fall back to the raw capture.
function connectorFolders() {
  const found = new Map();
  for (const parent of ['reference', 'reference-sources']) {
    for (const folder of directories(path.join(ROOT, parent))) {
      if (folder === 'ivo' || found.has(slug(folder))) continue;
      found.set(slug(folder), path.join(ROOT, parent, folder));
    }
  }
  return found;
}

function connectorList() {
  return [...connectorFolders().keys()]
    .map((key) => ({ key, name: CONNECTOR_NAMES.get(key) || displayName(key) }))
    .sort((left, right) => left.name.localeCompare(right.name));
}

function requireConnector(value) {
  const connector = connectorList().find((item) => item.key === requireKey(value, 'Connector'));
  if (!connector) throw new Error('Connector not found.');
  return connector;
}

function connectorObjects(root, connectorName) {
  const entries = [];
  const walk = (directory, segments) => {
    for (const name of files(directory)) {
      if (!name.toLowerCase().endsWith('.json')) continue;
      entries.push({
        connector: connectorName,
        module: segments[0] || connectorName,
        object: name.slice(0, -5),
        path: relative(path.join(directory, name)),
      });
    }
    for (const child of directories(directory)) {
      // Actions/ holds connector actions, which arrive through Real Time Action Processing
      // rather than a cache-writer service, so they are never scheduled.
      if (child === 'Actions') continue;
      walk(path.join(directory, child), [...segments, child]);
    }
  };
  walk(root, []);
  return entries;
}

// IVO objects are flat on disk; modules.json groups them so IVO cache-writer services read
// the way the ERP connectors' module folders do. Prefer the published contract's manifest and
// fall back to the source tree's, as connectorFolders does.
function ivoModules() {
  for (const parent of ['reference', 'reference-sources']) {
    const manifest = readJson(path.join(ROOT, parent, 'ivo', 'modules.json'));
    if (!manifest || typeof manifest.modules !== 'object' || manifest.modules === null) continue;
    const byObject = new Map();
    for (const [module, objects] of Object.entries(manifest.modules)) {
      for (const object of Array.isArray(objects) ? objects : []) byObject.set(object, module);
    }
    return { byObject, defaultModule: text(manifest.defaultModule) || 'Equipment Management' };
  }
  return { byObject: new Map(), defaultModule: 'Equipment Management' };
}

function ivoObjects() {
  const parent = path.join(ROOT, 'reference', 'ivo');
  const { byObject, defaultModule } = ivoModules();
  return directories(parent)
    .filter((object) => exists(path.join(parent, object, 'schema.json')))
    .map((object) => ({
      connector: 'IVO',
      module: byObject.get(object) || defaultModule,
      object,
      path: relative(path.join(parent, object, 'schema.json')),
    }));
}

// Every flow reads IVO to decide add versus update, so an integration caches IVO objects
// alongside the ERP's. Both sides are offered as cache-writer services.
function serviceCatalog(connector) {
  const folder = connectorFolders().get(connector.key);
  return [...ivoObjects(), ...(folder ? connectorObjects(folder, connector.name) : [])];
}

// The objects a customer's flows can trigger on: IVO plus whichever ERP connector their
// source schemas came from. Same catalog the integration service picker uses.
function customerServiceCatalog(customer) {
  const objects = directories(path.join(ROOT, 'customers', customer))
    .filter((object) => exists(path.join(ROOT, 'customers', customer, object, 'input', 'erp')));
  const connector = connectorList().find((candidate) => candidate.key === slug(customerConnector(customer, objects)));
  return connector ? serviceCatalog(connector) : ivoObjects();
}

function integrationFile(connectorKey) {
  return path.join(ROOT, 'integrations', connectorKey, 'definition.json');
}

function text(value) {
  return typeof value === 'string' ? value.trim() : '';
}

function wholeNumber(value) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.trunc(number) : 0;
}

function normalizeFeatures(value) {
  return (Array.isArray(value) ? value : []).map((feature) => ({
    name: text(feature?.name),
    description: text(feature?.description),
    status: FEATURE_STATUSES.includes(feature?.status) ? feature.status : 'under-construction',
    services: (Array.isArray(feature?.services) ? feature.services : []).map((service) => ({
      connector: text(service?.connector),
      module: text(service?.module),
      object: text(service?.object),
      description: text(service?.description),
      template: service?.template === true,
    })),
    flows: (Array.isArray(feature?.flows) ? feature.flows : []).map(text).filter(Boolean),
  }));
}

function normalizeSchedules(value) {
  return (Array.isArray(value) ? value : []).map((schedule) => ({
    name: text(schedule?.name),
    interval: wholeNumber(schedule?.interval),
    intervalType: INTERVAL_MINUTES.has(schedule?.intervalType) ? schedule.intervalType : 'Hour',
    activeOnSync: schedule?.activeOnSync === true,
    jobs: (Array.isArray(schedule?.jobs) ? schedule.jobs : []).map((job) => ({
      kind: job?.kind === 'flow' ? 'flow' : 'service',
      connector: text(job?.connector),
      module: text(job?.module),
      object: text(job?.object),
      flow: text(job?.flow),
      sequence: wholeNumber(job?.sequence),
    })),
  }));
}

function normalizeConfigurations(value) {
  return (Array.isArray(value) ? value : []).map((configuration) => ({
    key: text(configuration?.key),
    title: text(configuration?.title),
    type: CONFIGURATION_TYPES.includes(configuration?.type) ? configuration.type : 'string',
    description: text(configuration?.description),
    required: configuration?.required === true,
    options: text(configuration?.options),
    validation: text(configuration?.validation),
  }));
}

function serviceId(service) {
  return `${service.connector}/${service.module}/${service.object}`;
}

function validateIntegration(definition, catalog) {
  const issues = [];
  const add = (severity, area, message, name = null) => issues.push({ severity, area, message, name });
  const known = new Set(catalog.map(serviceId));
  const featureNames = new Set();
  const featuresByService = new Map();
  const flowNames = new Set();
  for (const feature of definition.features) {
    if (!feature.name) add('blocking', 'features', 'Every feature requires a name.');
    else if (featureNames.has(feature.name)) add('blocking', 'features', `Feature name must be unique: ${feature.name}.`, feature.name);
    else featureNames.add(feature.name);
    if (!feature.services.length && !feature.flows.length) {
      add('warning', 'features', 'Feature has no services or flows.', feature.name);
    }
    for (const flow of feature.flows) flowNames.add(flow);
    const withinFeature = new Set();
    for (const service of feature.services) {
      if (!service.connector || !service.module || !service.object) {
        add('blocking', 'features', 'Every service requires a connector, module, and data object.', feature.name);
        continue;
      }
      const id = serviceId(service);
      if (!known.has(id)) add('blocking', 'features', `No captured data object matches ${id}.`, feature.name);
      if (withinFeature.has(id)) add('blocking', 'features', `A feature must not add the same service twice: ${id}.`, feature.name);
      else withinFeature.add(id);
      featuresByService.set(id, [...new Set([...(featuresByService.get(id) || []), feature.name])]);
    }
  }
  for (const [id, owners] of featuresByService) {
    if (owners.length < 2) continue;
    for (const owner of owners) {
      const others = owners.filter((candidate) => candidate !== owner);
      add('warning', 'features', `${id} is also cached by ${others.join(', ')}. Reuse a single service instead of processing the same data twice.`, owner);
    }
  }
  const archivedFeatures = new Set(definition.features.filter((feature) => feature.status === 'archived').map((feature) => feature.name));
  const scheduleNames = new Set();
  for (const schedule of definition.schedules) {
    if (!schedule.name) add('blocking', 'schedules', 'Every schedule requires a name.');
    else if (scheduleNames.has(schedule.name)) add('blocking', 'schedules', `Schedule name must be unique: ${schedule.name}.`, schedule.name);
    else scheduleNames.add(schedule.name);
    const minutes = schedule.interval * (INTERVAL_MINUTES.get(schedule.intervalType) || 0);
    if (schedule.interval <= 0) add('blocking', 'schedules', 'Schedule interval must be a positive number.', schedule.name);
    else if (minutes < MINIMUM_SCHEDULE_MINUTES) add('blocking', 'schedules', `A schedule cannot run more often than every ${MINIMUM_SCHEDULE_MINUTES} minutes.`, schedule.name);
    if (!schedule.jobs.length) add('warning', 'schedules', 'Schedule has no services or flows.', schedule.name);
    for (const job of schedule.jobs) {
      if (job.kind === 'flow') {
        if (!job.flow) add('blocking', 'schedules', 'Every scheduled flow requires a name.', schedule.name);
        else if (!flowNames.has(job.flow)) add('blocking', 'schedules', `Scheduled flow is not listed on any feature: ${job.flow}.`, schedule.name);
        continue;
      }
      const id = serviceId(job);
      const owners = featuresByService.get(id);
      if (!owners) add('blocking', 'schedules', `Scheduled service is not on any feature: ${id}.`, schedule.name);
      else if (owners.every((owner) => archivedFeatures.has(owner))) {
        add('blocking', 'schedules', `Scheduled service belongs only to archived features: ${id}.`, schedule.name);
      }
    }
    // IVO convention: cache IVO before the ERP so ERP-triggered flows resolve their IVO
    // lookups against current data. See docs/service-composition.md.
    const services = schedule.jobs.filter((job) => job.kind === 'service');
    const ivoSequences = services.filter((job) => job.connector === 'IVO').map((job) => job.sequence);
    const erpSequences = services.filter((job) => job.connector !== 'IVO').map((job) => job.sequence);
    if (ivoSequences.length && erpSequences.length && Math.min(...erpSequences) <= Math.max(...ivoSequences)) {
      add('warning', 'schedules', 'Cache IVO objects at a lower sequence than the ERP so ERP-triggered flows resolve their IVO lookups against current data.', schedule.name);
    }
  }
  const configurationKeys = new Set();
  for (const configuration of definition.configurations) {
    if (!configuration.key) add('blocking', 'configurations', 'Every configuration requires a key.');
    else if (!/^[A-Za-z][A-Za-z0-9_]*$/.test(configuration.key)) {
      add('blocking', 'configurations', `Configuration key must start with a letter and contain only letters, numbers, and underscores: ${configuration.key}.`, configuration.key);
    } else if (configurationKeys.has(configuration.key)) {
      add('blocking', 'configurations', `Configuration key must be unique: ${configuration.key}.`, configuration.key);
    } else configurationKeys.add(configuration.key);
    if (!configuration.title) add('warning', 'configurations', `Configuration has no title: ${configuration.key || 'unnamed'}.`, configuration.key);
  }
  return issues;
}

function readIntegration(connector) {
  const stored = readJson(integrationFile(connector.key));
  return {
    schemaVersion: 1,
    connector,
    name: text(stored?.name) || `${connector.name} integration`,
    description: text(stored?.description),
    features: normalizeFeatures(stored?.features),
    schedules: normalizeSchedules(stored?.schedules),
    configurations: normalizeConfigurations(stored?.configurations),
    updatedAt: stored?.updatedAt || null,
  };
}

function integrationBundle(connectorKey) {
  const connector = requireConnector(connectorKey);
  const definition = readIntegration(connector);
  const catalog = serviceCatalog(connector);
  return { definition, catalog, validation: validateIntegration(definition, catalog) };
}

function integrationSummaries() {
  return connectorList().map((connector) => {
    const definition = readIntegration(connector);
    return {
      ...connector,
      featureCount: definition.features.length,
      serviceCount: definition.features.reduce((total, feature) => total + feature.services.length, 0),
      scheduleCount: definition.schedules.length,
      configurationCount: definition.configurations.length,
      objectCount: serviceCatalog(connector).length,
      updatedAt: definition.updatedAt,
    };
  });
}

function saveIntegration(connectorKey, data) {
  const connector = requireConnector(connectorKey);
  const definition = {
    schemaVersion: 1,
    connector,
    name: text(data?.name) || `${connector.name} integration`,
    description: text(data?.description),
    features: normalizeFeatures(data?.features),
    schedules: normalizeSchedules(data?.schedules),
    configurations: normalizeConfigurations(data?.configurations),
    updatedAt: new Date().toISOString(),
  };
  atomicWrite(integrationFile(connector.key), JSON.stringify(definition, null, 2) + '\n');
  return { definition, validation: validateIntegration(definition, serviceCatalog(connector)) };
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
  if (request.method === 'GET' && url.pathname === '/api/integrations') return json(response, 200, integrationSummaries());
  if (parts[1] === 'integrations' && parts.length === 3) {
    if (request.method === 'GET') return json(response, 200, integrationBundle(parts[2]));
    if (request.method === 'PUT') return json(response, 200, saveIntegration(parts[2], await body(request)));
  }
  if (parts[1] === 'customers' && parts[3] === 'workspace' && parts.length === 4) {
    const customer = requireCustomer(parts[2]);
    if (request.method === 'GET') return json(response, 200, workspaceBundle(customer));
    if (request.method === 'PUT') return json(response, 200, saveWorkspaceDraft(customer, await body(request)));
  }
  if (request.method === 'POST' && parts[1] === 'customers' && parts[3] === 'workspace' && parts[4] === 'approve') {
    return json(response, 200, approveWorkspace(requireCustomer(parts[2]), await body(request)));
  }
  if (parts[1] === 'customers' && parts[3] === 'discovery' && parts.length === 4) {
    const customer = requireCustomer(parts[2]);
    if (request.method === 'GET') return json(response, 200, readDiscovery(customer));
    if (request.method === 'PUT') return json(response, 200, saveDiscovery(customer, await body(request)));
  }
  if (request.method === 'POST' && parts[1] === 'customers' && parts[3] === 'discovery' && parts[4] === 'import' && parts.length === 5) {
    return json(response, 201, importTranscript(requireCustomer(parts[2]), await body(request)));
  }
  if (parts[1] === 'customers' && parts[3] === 'workspace' && parts[4] === 'versions') {
    const customer = requireCustomer(parts[2]);
    if (request.method === 'GET' && parts.length === 5) return json(response, 200, listVersions(customer));
    if (request.method === 'POST' && parts.length === 5) {
      const data = await body(request);
      const draft = readJson(workspaceFile(customer, 'draft'));
      if (!draft) throw new Error('Save the workspace before creating a checkpoint.');
      return json(response, 201, {
        version: versionSummary(writeVersion(customer, draft, { ...data, kind: 'checkpoint' })),
        versions: listVersions(customer),
      });
    }
    if (request.method === 'GET' && parts.length === 6) return json(response, 200, requireVersion(customer, parts[5]));
    if (request.method === 'POST' && parts.length === 7 && parts[6] === 'restore') {
      return json(response, 200, restoreVersion(customer, parts[5], await body(request)));
    }
  }
  if (request.method === 'GET' && url.pathname === '/api/file') {
    const file = safeWorkspaceFile(url.searchParams.get('path'));
    response.writeHead(200, { 'Content-Type': fileContentType(file), 'Cache-Control': 'no-store' });
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
    if (request.method === 'GET' && url.pathname === '/integrations') return serveHtml(response, INTEGRATIONS_HTML_FILE);
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
