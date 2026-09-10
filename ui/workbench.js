'use strict';

const state = {
  catalog: { customers: [], references: [], connectors: [] },
  connector: null,
  customer: null,
  object: null,
  reference: null,
  mappings: [],
  selectedMapping: 0,
  scoreRequestId: 0,
  mappingReference: null,
  customerFiles: [],
  referenceFiles: {},
  valueEvidence: null,
  valueEvidenceView: 'matched',
};

const mappingLabels = {
  accepted: 'Reviewed',
  suggested: 'Suggested',
  review: 'Needs review',
  omitted: 'Not sent',
  blocked: 'Needs information',
};

const findingLabels = {
  REQUIRED_BUT_EMPTY: ['Required values are missing', 'Decide how missing values should be handled'],
  NULL_NOT_DECLARED: ['Blank values were found', 'Confirm whether blanks are allowed'],
  MIXED_FORMAT: ['Values use different formats', 'Choose one format before sending'],
  PLACEHOLDER_NULL: ['Text is being used for blank values', 'Convert placeholders such as N/A to blank'],
  AT_MAXLENGTH: ['Values reach the field length limit', 'Check whether source values were cut off'],
  OVER_MAXLENGTH: ['Values exceed the field length limit', 'Shorten or reject long values'],
  SPARSE: ['Most records are blank', 'Decide whether a default is needed'],
  PADDED: ['Values contain extra spaces', 'Trim spaces before sending'],
  WHITESPACE_NULL: ['Spaces are being used as blank values', 'Convert whitespace-only values to blank'],
  NUMERIC_AS_STRING: ['Numbers are stored as text', 'Keep as text when leading zeros matter'],
  ENUM_VIOLATION: ['Unexpected values were found', 'Map or reject values outside the allowed list'],
  PATTERN_VIOLATION: ['Some values do not match the expected format', 'Clean or reject invalid values'],
  TYPE_MISMATCH: ['The file and column definition disagree', 'Confirm the correct value type'],
  NOT_IN_SCHEMA: ['Customer-added column', 'Review whether this column should be mapped'],
  EMPTY: ['Column is always blank', 'Exclude this column'],
  CONSTANT: ['Column has one value', 'Use a fixed setting if this is intentional'],
};

const byId = (id) => document.getElementById(id);

function escapeHtml(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function title(value) {
  return String(value || '').replace(/[_-]+/g, ' ').replace(/\b\w/g, (character) => character.toUpperCase());
}

function keyFromName(value) {
  return String(value || '').trim().toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_+|_+$/g, '');
}

function referenceOptions(selected = '') {
  return '<option value="">Select an IVO table</option>' + state.catalog.references.map((reference) =>
    `<option value="${escapeHtml(reference.key)}"${reference.key === selected ? ' selected' : ''}>${escapeHtml(reference.name)} · ${reference.fieldCount} fields</option>`,
  ).join('');
}

function formatDate(value) {
  if (!value) return 'Not analyzed';
  return new Intl.DateTimeFormat(undefined, { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(value));
}

function compactNumber(value) {
  return value >= 1000 ? `${(value / 1000).toFixed(1)}K` : String(value || 0);
}

async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: options.body ? { 'Content-Type': 'application/json', ...(options.headers || {}) } : options.headers,
  });
  const payload = response.headers.get('content-type')?.includes('application/json') ? await response.json() : await response.text();
  if (!response.ok) throw new Error(payload.error || `Request failed (${response.status})`);
  return payload;
}

function showMessage(message, type = 'info') {
  let banner = byId('appMessage');
  if (!banner) {
    banner = document.createElement('div');
    banner.id = 'appMessage';
    banner.className = 'app-message';
    banner.setAttribute('role', 'status');
    document.body.appendChild(banner);
  }
  banner.textContent = message;
  banner.dataset.type = type;
  banner.hidden = false;
  clearTimeout(showMessage.timer);
  showMessage.timer = setTimeout(() => { banner.hidden = true; }, type === 'error' ? 8000 : 3500);
}

function setButtonBusy(button, busy, busyText) {
  if (!button) return;
  if (busy) {
    button.dataset.label = button.textContent;
    button.textContent = busyText;
    button.disabled = true;
  } else {
    button.textContent = button.dataset.label || button.textContent;
    button.disabled = false;
  }
}

function openWorkspace(kind) {
  byId('launcher').hidden = true;
  byId('customerObjectWorkspace').hidden = kind !== 'customer';
  byId('customerWorkspace').hidden = kind !== 'mapping';
  byId('referenceWorkspace').hidden = kind !== 'references';
  document.querySelector('.mobile-nav').hidden = kind !== 'mapping';
}

function returnToLauncher() {
  byId('launcher').hidden = false;
  byId('customerObjectWorkspace').hidden = true;
  byId('customerWorkspace').hidden = true;
  byId('referenceWorkspace').hidden = true;
  document.querySelector('.mobile-nav').hidden = true;
}

async function loadCatalog() {
  state.catalog = await request('/api/catalog');
  renderLauncher();
  renderReferenceCatalog();
}

function renderLauncher() {
  const connectors = state.catalog.connectors || [];
  if (!state.connector || !connectors.some((connector) => connector.key === state.connector)) {
    state.connector = connectors[0]?.key || null;
  }
  renderConnectorSelect();
  const customers = state.catalog.customers.filter((customer) => !state.connector || customer.connector.key === state.connector);
  const list = byId('customerRows') || document.querySelector('.workspace-list');
  list.innerHTML = customers.map((customer) => {
    const rows = customer.objects.reduce((total, object) => total + object.summary.rows, 0);
    return `<div class="workspace-row" data-open-customer="${escapeHtml(customer.key)}"><div class="workspace-avatar">${escapeHtml(customer.name.slice(0, 1))}</div><div><strong>${escapeHtml(customer.name)}</strong><small>${customer.objects.length} data table${customer.objects.length === 1 ? '' : 's'} · ${compactNumber(rows)} rows</small></div><div class="row-meta">${customer.objects.filter((object) => object.status === 'Ready for review').length} ready to review</div><button class="icon-button" data-open-customer="${escapeHtml(customer.key)}" title="Open ${escapeHtml(customer.name)}" aria-label="Open ${escapeHtml(customer.name)}"><svg viewBox="0 0 24 24"><path d="M5 12h14m-6-6 6 6-6 6"/></svg></button></div>`;
  }).join('') || `<div class="empty-view"><strong>No customers found</strong><p class="subtle">${connectors.length ? 'No customer folders use this connector yet.' : 'Add a customer folder under customers/ to begin.'}</p></div>`;
  const ready = state.catalog.references.filter((reference) => reference.status === 'Ready').length;
  const review = state.catalog.references.length - ready;
  const stats = document.querySelectorAll('.reference-stats .reference-stat strong');
  if (stats[0]) stats[0].textContent = state.catalog.references.length;
  if (stats[1]) stats[1].textContent = review;
}

function renderConnectorSelect() {
  const select = byId('connectorSelect');
  if (!select) return;
  const connectors = state.catalog.connectors || [];
  select.innerHTML = connectors.map((connector) =>
    `<option value="${escapeHtml(connector.key)}"${connector.key === state.connector ? ' selected' : ''}>${escapeHtml(connector.name)} · ${connector.customerCount} customer${connector.customerCount === 1 ? '' : 's'}</option>`,
  ).join('') || '<option value="">No connectors detected</option>';
}

function renderReferenceCatalog() {
  const references = state.catalog.references;
  const ready = references.filter((reference) => reference.status === 'Ready').length;
  const metrics = document.querySelectorAll('#referenceCatalog .reference-summary .metric-value');
  if (metrics[0]) metrics[0].textContent = ready;
  if (metrics[1]) metrics[1].textContent = references.length - ready;
  if (metrics[2]) metrics[2].textContent = references.reduce((total, reference) => total + reference.fieldCount, 0);
  byId('referenceRows').innerHTML = references.map((reference) => `<tr><td><strong>${escapeHtml(reference.name)}</strong><div class="subtle">IVO field definitions and rules</div></td><td>${reference.fieldCount}</td><td><span class="badge ${reference.status === 'Ready' ? 'accepted' : 'review'}">${escapeHtml(reference.status)}</span></td><td>${reference.files.length} files</td><td>${formatDate(reference.updated)}</td><td><button class="button" data-reference-key="${escapeHtml(reference.key)}">View details</button></td></tr>`).join('');
}

function showReferenceCatalog() {
  byId('referenceCatalog').hidden = false;
  byId('referenceDetail').hidden = true;
  byId('referenceWizard').hidden = true;
  byId('addObjectContract').hidden = false;
}

function showReferenceWizard() {
  state.referenceFiles = {};
  byId('objectName').value = '';
  byId('objectLabel').value = '';
  byId('objectDescription').value = '';
  byId('schemaInput').value = '';
  byId('sampleInput').value = '';
  document.querySelectorAll('#referenceWizard .file-pill').forEach((pill) => { pill.hidden = true; });
  document.querySelectorAll('#referenceWizard .upload-zone').forEach((zone) => zone.classList.remove('ready'));
  byId('continueToProcess').disabled = true;
  byId('referenceCatalog').hidden = true;
  byId('referenceDetail').hidden = true;
  byId('referenceWizard').hidden = false;
  byId('addObjectContract').hidden = true;
  showReferenceStep('define');
}

const referenceSteps = ['define', 'files', 'process'];

function showReferenceStep(step) {
  referenceSteps.forEach((name, index) => {
    const panel = byId(`refPanel${name[0].toUpperCase()}${name.slice(1)}`);
    if (panel) panel.hidden = name !== step;
    const marker = document.querySelector(`[data-ref-step="${name}"]`);
    if (!marker) return;
    const active = referenceSteps.indexOf(step);
    marker.classList.toggle('active', name === step);
    marker.classList.toggle('done', index < active);
    marker.querySelector('.wizard-number').textContent = index < active ? '✓' : index + 1;
  });
  const unusedStep = document.querySelector('[data-ref-step="review"]');
  if (unusedStep) unusedStep.hidden = true;
  if (byId('refPanelReview')) byId('refPanelReview').hidden = true;
}

function setReferenceFile(kind, file) {
  state.referenceFiles[kind] = file;
  const pill = byId(`${kind}File`);
  pill.hidden = false;
  pill.querySelector('span').textContent = file.name;
  byId(`${kind}Zone`).classList.add('ready');
  byId('continueToProcess').disabled = !state.referenceFiles.schema;
}

async function fileBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1]);
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

async function createReference() {
  const button = byId('runProcessing');
  setButtonBusy(button, true, 'Creating reference…');
  document.querySelectorAll('.process-row').forEach((row) => {
    row.classList.remove('done');
    row.classList.add('running');
    row.querySelector('.process-state').textContent = 'Working';
  });
  try {
    const object = keyFromName(byId('objectName').value);
    const files = [{ name: 'schema.json', contentBase64: await fileBase64(state.referenceFiles.schema) }];
    if (state.referenceFiles.sample) files.push({ name: 'sample.csv', contentBase64: await fileBase64(state.referenceFiles.sample) });
    const reference = await request('/api/references', { method: 'POST', body: JSON.stringify({ object, files }) });
    document.querySelectorAll('.process-row').forEach((row) => {
      row.classList.remove('running');
      row.classList.add('done');
      row.querySelector('.process-dot').textContent = '✓';
      row.querySelector('.process-state').textContent = 'Complete';
    });
    await loadCatalog();
    showReferenceDetail(reference.key);
    showMessage(`${reference.name} is ready to review.`);
  } catch (error) {
    document.querySelectorAll('.process-row').forEach((row) => row.classList.remove('running'));
    showMessage(error.message, 'error');
  } finally {
    setButtonBusy(button, false);
  }
}

function showContractFields() {
  byId('contractFieldPanel').hidden = false;
  byId('contractFilePanel').hidden = true;
  document.querySelectorAll('.contract-files .generated-file').forEach((file) => file.classList.remove('selected'));
}

async function showReferenceDetail(key) {
  const reference = await request(`/api/references/${encodeURIComponent(key)}`);
  state.reference = reference;
  byId('contractDetailName').textContent = reference.name;
  byId('contractDetailKey').textContent = reference.key;
  byId('contractDetailFields').textContent = reference.fieldCount;
  byId('contractDetailStatus').textContent = reference.status;
  byId('contractDetailStatus').className = `badge ${reference.status === 'Ready' ? 'accepted' : 'review'}`;
  byId('contractDetailSource').textContent = `${reference.files.length} reference files`;
  byId('contractDetailUpdated').textContent = formatDate(reference.updated);
  const fileList = byId('contractFiles') || document.querySelector('.contract-files .generated-files');
  fileList.id = 'contractFiles';
  fileList.innerHTML = reference.files.map((file, index) => `<div class="generated-file" role="button" tabindex="0" data-reference-file="${index}" aria-label="View ${escapeHtml(file.name)}"><svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/></svg><div><strong>${escapeHtml(file.name)}</strong><small>${file.type === 'csv' ? 'Table' : 'Definition'}</small></div><span class="badge accepted">View</span></div>`).join('');
  byId('contractFieldRows').innerHTML = reference.fields.map((field) => `<tr><td><code>${escapeHtml(field.field)}</code></td><td>${escapeHtml(field.type)}</td><td>${field.required === 'yes' ? 'Yes' : 'No'}</td><td>${escapeHtml(friendlyRule(field.mapping_behavior || field.ownership))}</td></tr>`).join('');
  byId('contractFieldSearch').value = '';
  byId('referenceCatalog').hidden = true;
  byId('referenceWizard').hidden = true;
  byId('referenceDetail').hidden = false;
  byId('addObjectContract').hidden = true;
  showContractFields();
}

function friendlyRule(value) {
  const rules = {
    direct: 'Copy value', lookup: 'Find matching IVO value', generated: 'Created by IVO',
    identifier: 'Created by IVO', constant: 'Fixed value', unknown: 'Needs review',
    integration: 'Provided by the integration', ivo: 'Managed by IVO', confirm: 'Needs review',
  };
  return rules[String(value || '').toLowerCase()] || title(value);
}

function parsePreviewCsv(text) {
  const rows = [];
  let row = [];
  let field = '';
  let quoted = false;
  const closesHere = (index) => text[index + 1] === undefined || text[index + 1] === ',' || text[index + 1] === '\n' || text[index + 1] === '\r';
  for (let index = 0; index < text.length; index++) {
    const character = text[index];
    if (quoted) {
      if (character === '"' && text[index + 1] === '"') { field += '"'; index++; }
      else if (character === '"' && closesHere(index)) quoted = false;
      else field += character;
    } else if (character === '"' && field === '') quoted = true;
    else if (character === ',') { row.push(field); field = ''; }
    else if (character === '\n') { row.push(field); rows.push(row); row = []; field = ''; }
    else if (character !== '\r') field += character;
  }
  if (field !== '' || row.length) { row.push(field); rows.push(row); }
  if (!rows.length) return [];
  const headers = rows[0];
  const records = [];
  for (let index = 1; index < rows.length; index++) {
    if (rows[index].length === 1 && rows[index][0] === '') continue;
    let current = rows[index].slice();
    let merged = 0;
    while (current.length < headers.length && index + 1 < rows.length && merged < 100) {
      const next = rows[index + 1];
      if (current.length - 1 + next.length > headers.length) break;
      current[current.length - 1] += `\n${next[0]}`;
      current.push(...next.slice(1));
      index++;
      merged++;
    }
    if (current.length === headers.length) records.push(current);
  }
  return [headers, ...records];
}

function renderCsvPreview(prefix, text) {
  const rows = parsePreviewCsv(text);
  if (!rows.length) throw new Error('The CSV file is empty.');
  const [headers, ...records] = rows;
  const head = document.createElement('tr');
  headers.forEach((header) => { const cell = document.createElement('th'); cell.textContent = header; head.appendChild(cell); });
  byId(`${prefix}CsvHead`).replaceChildren(head);
  const visible = records.slice(0, 100);
  byId(`${prefix}CsvBody`).replaceChildren(...visible.map((record) => {
    const tableRow = document.createElement('tr');
    headers.forEach((_, index) => { const cell = document.createElement('td'); cell.textContent = record[index] || ''; cell.title = record[index] || ''; tableRow.appendChild(cell); });
    return tableRow;
  }));
  byId(`${prefix}CsvSummary`).textContent = `Showing ${visible.length} of ${records.length.toLocaleString()} rows · ${headers.length} columns`;
  byId(`${prefix}FileContent`).hidden = true;
  byId(`${prefix}CsvPreview`).hidden = false;
}

function showFileText(prefix, text) {
  byId(`${prefix}CsvPreview`).hidden = true;
  const content = byId(`${prefix}FileContent`);
  content.hidden = false;
  content.textContent = text;
}

async function openFile(file, prefix) {
  byId(`${prefix}FieldPanel`).hidden = true;
  byId(`${prefix}FilePanel`).hidden = false;
  byId(`${prefix}FileName`).textContent = file.name;
  byId(`${prefix}FilePath`).textContent = file.path;
  showFileText(prefix, 'Loading file…');
  try {
    const text = await request(`/api/file?path=${encodeURIComponent(file.path)}`);
    if (file.type === 'json') showFileText(prefix, JSON.stringify(typeof text === 'string' ? JSON.parse(text) : text, null, 2));
    else if (file.type === 'csv') renderCsvPreview(prefix, text);
    else throw new Error('Only CSV and JSON files can be previewed.');
  } catch (error) {
    showFileText(prefix, `Unable to preview ${file.name}\n\n${error.message}`);
  }
}

function renderCustomerCatalog() {
  const customer = state.catalog.customers.find((item) => item.key === state.customer);
  if (!customer) return;
  const objects = customer.objects;
  byId('erpCustomerTitle').textContent = `${customer.name} data tables`;
  byId('erpCatalogCustomer').textContent = customer.name;
  byId('erpTableCount').textContent = objects.length;
  byId('erpRowCount').textContent = compactNumber(objects.reduce((sum, object) => sum + object.summary.rows, 0));
  byId('erpColumnCount').textContent = objects.reduce((sum, object) => sum + object.summary.columns, 0);
  byId('erpObjectRows').innerHTML = objects.map((object) => `<tr><td><strong>${escapeHtml(object.name)}</strong><div class="subtle">IVO: ${escapeHtml(object.referenceName || 'Not selected')} · ${object.sourceFiles.length} customer file${object.sourceFiles.length === 1 ? '' : 's'}${object.ivoFiles.length ? ' · IVO export included' : ''}</div></td><td>${object.summary.rows.toLocaleString()}</td><td>${object.summary.columns}</td><td><span class="badge ${object.status === 'Ready for review' ? 'accepted' : 'review'}">${escapeHtml(object.status)}</span></td><td>${formatDate(object.updated)}</td><td><button class="button" data-customer-object="${escapeHtml(object.key)}">Open workbench</button></td></tr>`).join('');
  byId('erpObjectTable').hidden = objects.length === 0;
  byId('erpEmpty').hidden = objects.length !== 0;
}

function showCustomerCatalog() {
  byId('erpCatalog').hidden = false;
  byId('erpDetail').hidden = true;
  byId('erpAdd').hidden = true;
  byId('addErpTable').hidden = false;
  renderCustomerCatalog();
}

function openCustomer(customer) {
  location.href = `/workspace?customer=${encodeURIComponent(customer)}`;
}

function openCustomerSources(customer) {
  state.customer = customer;
  openWorkspace('customer');
  showCustomerCatalog();
}

function showCustomerFields() {
  byId('erpFieldPanel').hidden = false;
  byId('erpFilePanel').hidden = true;
}

async function showCustomerObject(key) {
  const object = await request(`/api/customers/${encodeURIComponent(state.customer)}/objects/${encodeURIComponent(key)}`);
  state.object = object;
  await openMappingWorkspace('profile');
}

async function runAnalysis() {
  const confirmed = window.confirm('Analyze this table again? This will reset all field matches, value handling, review decisions, and review notes.');
  if (!confirmed) return;
  const button = byId('workspaceAnalyze') || byId('refreshErpAnalysis');
  setButtonBusy(button, true, 'Analyzing…');
  try {
    state.object = await request(`/api/customers/${encodeURIComponent(state.customer)}/objects/${encodeURIComponent(state.object.key)}/process`, {
      method: 'POST',
      body: JSON.stringify({ confirmReset: true }),
    });
    await loadCatalog();
    await showCustomerObject(state.object.key);
    showMessage('Analysis is up to date.');
  } catch (error) {
    showMessage(error.message, 'error');
  } finally {
    setButtonBusy(button, false);
  }
}

async function uploadIvoCsv(file) {
  if (!file) return;
  if (!window.confirm('Upload this IVO export and analyze the table again? This will reset all field matches, value handling, review decisions, and review notes.')) {
    byId('workspaceIvoInput').value = '';
    return;
  }
  const button = byId('workspaceUploadIvo');
  setButtonBusy(button, true, 'Uploading and analyzing…');
  try {
    state.object = await request(`/api/customers/${encodeURIComponent(state.customer)}/objects/${encodeURIComponent(state.object.key)}/ivo`, {
      method: 'POST',
      body: JSON.stringify({
        confirmReset: true,
        file: { name: file.name, contentBase64: await fileBase64(file) },
      }),
    });
    await loadCatalog();
    await showCustomerObject(state.object.key);
    showMessage('IVO export uploaded and included in the analysis.');
  } catch (error) {
    showMessage(error.message, 'error');
  } finally {
    setButtonBusy(button, false);
  }
}

function showAddCustomerObject() {
  state.customerFiles = [];
  byId('erpTableName').value = '';
  byId('erpCsvInput').value = '';
  byId('erpJsonInput').value = '';
  byId('erpReference').innerHTML = referenceOptions();
  document.querySelectorAll('#erpAdd .file-pill').forEach((pill) => { pill.hidden = true; });
  document.querySelectorAll('#erpAdd .upload-zone').forEach((zone) => zone.classList.remove('ready'));
  byId('erpAddCustomer').textContent = `${state.customer} · Customer data`;
  byId('erpCatalog').hidden = true;
  byId('erpDetail').hidden = true;
  byId('erpAdd').hidden = false;
  byId('addErpTable').hidden = true;
  updateAddCustomerState();
}

function setCustomerFile(kind, file) {
  state.customerFiles = state.customerFiles.filter((item) => item.kind !== kind);
  state.customerFiles.push({ kind, file });
  const prefix = kind === 'csv' ? 'Csv' : 'Json';
  const pill = byId(`erp${prefix}File`);
  pill.hidden = false;
  pill.querySelector('span').textContent = file.name;
  byId(`erp${prefix}Zone`).classList.add('ready');
  updateAddCustomerState();
}

function updateAddCustomerState() {
  const suggested = state.catalog.references.find((reference) => reference.key.toLowerCase() === keyFromName(byId('erpTableName').value));
  if (!byId('erpReference').value && suggested) byId('erpReference').value = suggested.key;
  byId('finishErpAdd').disabled = !byId('erpTableName').value.trim() || !byId('erpReference').value || !state.customerFiles.some((item) => item.kind === 'csv');
}

async function addCustomerObject() {
  const button = byId('finishErpAdd');
  setButtonBusy(button, true, 'Adding and analyzing…');
  try {
    const object = keyFromName(byId('erpTableName').value);
    const files = await Promise.all(state.customerFiles.map(async ({ file }) => ({ name: file.name, contentBase64: await fileBase64(file) })));
    const detail = await request(`/api/customers/${encodeURIComponent(state.customer)}/objects`, { method: 'POST', body: JSON.stringify({ object, reference: byId('erpReference').value, files }) });
    await loadCatalog();
    await showCustomerObject(detail.key);
    showMessage(`${detail.name} was added and analyzed.`);
  } catch (error) {
    showMessage(error.message, 'error');
  } finally {
    setButtonBusy(button, false);
  }
}

async function saveCustomerReference() {
  const select = byId('workspaceReferenceSelect');
  const reference = select.value;
  if (!reference || reference === state.object.referenceKey) return;
  if (!window.confirm('Change the matching IVO table? Existing field matches and review decisions will be reset.')) {
    select.value = state.object.referenceKey || '';
    byId('saveWorkspaceReference').disabled = true;
    return;
  }
  const button = byId('saveWorkspaceReference');
  setButtonBusy(button, true, 'Saving…');
  try {
    state.object = await request(`/api/customers/${encodeURIComponent(state.object.customer)}/objects/${encodeURIComponent(state.object.key)}`, {
      method: 'PATCH',
      body: JSON.stringify({ reference, confirmReset: true }),
    });
    await loadCatalog();
    await openMappingWorkspace('profile');
    showMessage(`Matching IVO table changed to ${state.object.referenceName}.`);
  } catch (error) {
    select.value = state.object.referenceKey || '';
    showMessage(error.message, 'error');
  } finally {
    setButtonBusy(button, false);
  }
}

function mappingStatus(row) {
  const decision = String(row.review_decision || '').toLowerCase();
  if (decision.startsWith('accept')) return 'accepted';
  if (decision === 'reject' || decision === 'omit') return 'omitted';
  if (decision === 'needs-info') return 'blocked';
  if (row.status === 'question') return 'review';
  if (row.status === 'reference' || row.kind === 'identifier' || row.kind === 'generated') return 'omitted';
  return 'suggested';
}

function normalizeMapping(row) {
  const scoreText = String(row.score || '').replace('%', '');
  const score = scoreText === '' ? ({ high: 95, medium: 75, low: 50 }[row.confidence] || 0) : Number(scoreText);
  return {
    raw: row,
    dest: row.dest_field,
    source: row.source_field || '',
    rule: friendlyRule(row.kind),
    transform: row.transform || '',
    confidence: row.source_field && Number.isFinite(score) ? score : 0,
    status: mappingStatus(row),
    evidence: row.rationale || 'No explanation was recorded.',
    notes: row.review_notes || '',
  };
}

function setView(name) {
  document.querySelectorAll('.view').forEach((view) => view.classList.toggle('active', view.id === `view-${name}`));
  document.querySelectorAll('[data-view]').forEach((button) => button.classList.toggle('active', button.dataset.view === name));
  const labels = { profile: 'Table details', mapping: 'Field matches', build: 'Delivery plan', validate: 'Readiness' };
  byId('crumb').textContent = labels[name] || name;
  document.querySelector('.content').scrollTop = 0;
}

function renderProfile() {
  const object = state.object;
  const summary = object.summary;
  const findings = object.fields.flatMap((field) => String(field.flags || '').split(';').filter(Boolean).map((flag) => ({ field: field.field, flag, detail: findingLabels[flag] }))).filter((item) => item.detail);
  byId('view-profile').innerHTML = `
    <div class="page-head"><div class="page-head-row"><div><h1>Table details</h1><p class="subtle">Source files, columns, and data quality for ${escapeHtml(object.customer)} ${escapeHtml(object.name)}.</p></div><button class="button" id="workspaceAnalyze">Analyze again</button></div></div>
    <div id="workspaceSourceFieldPanel">
      <div class="source-details">
        <section class="reference-assignment"><div class="reference-assignment-copy"><h2>Matching IVO table</h2><p class="subtle">This table supplies the destination fields and validation rules for matching.</p></div><div class="reference-assignment-controls"><div class="field"><label for="workspaceReferenceSelect">IVO table</label><select id="workspaceReferenceSelect">${referenceOptions(object.referenceKey)}</select></div><button class="button primary" id="saveWorkspaceReference" disabled>Save</button></div></section>
        <div class="contract-meta">
          <div class="contract-meta-item"><span>Folder ID</span><strong>${escapeHtml(object.key)}</strong></div>
          <div class="contract-meta-item"><span>Rows</span><strong>${object.summary.rows.toLocaleString()}</strong></div>
          <div class="contract-meta-item"><span>Columns</span><strong>${object.summary.columns}</strong></div>
          <div class="contract-meta-item"><span>Last analyzed</span><strong>${escapeHtml(formatDate(object.updated))}</strong></div>
        </div>
        <div class="source-details-grid">
          <section class="source-details-panel erp-source-files"><h2>Analysis inputs</h2><p class="subtle">Customer source files and the optional IVO export used to recover existing mappings.</p><div class="source-file-group"><h3>Customer system</h3><div class="generated-files" id="workspaceSourceFiles">${object.sourceFiles.map((file, index) => `<div class="generated-file" role="button" tabindex="0" data-workspace-source-file="${index}" aria-label="View ${escapeHtml(file.name)}"><svg viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6"/></svg><div><strong>${escapeHtml(file.name)}</strong><small>${file.type === 'csv' ? 'Customer records' : 'Column definitions'}</small></div><span class="badge accepted">View</span></div>`).join('')}</div></div><div class="source-file-group"><div class="source-file-group-head"><div><h3>IVO system</h3><p class="subtle">Export matching IVO rows as CSV for comparison analysis.</p></div><input type="file" id="workspaceIvoInput" accept=".csv,text/csv" hidden><button class="button" id="workspaceUploadIvo">${object.ivoFiles.length ? 'Replace IVO CSV' : 'Upload IVO CSV'}</button></div><div class="generated-files" id="workspaceIvoFiles">${object.ivoFiles.map((file, index) => `<div class="generated-file" role="button" tabindex="0" data-workspace-ivo-file="${index}" aria-label="View ${escapeHtml(file.name)}"><svg viewBox="0 0 24 24"><path d="M3 3h18v18H3zM3 9h18M9 3v18"/></svg><div><strong>${escapeHtml(file.name)}</strong><small>IVO records for comparison</small></div><span class="badge accepted">Included</span></div>`).join('') || '<div class="source-file-empty">No IVO export uploaded.</div>'}</div></div></section>
          <section class="source-details-panel"><div class="field-toolbar"><div><h2>Columns</h2><p class="subtle" style="margin:4px 0 0">Profiled customer fields available for matching.</p></div><input id="workspaceFieldSearch" type="search" placeholder="Search columns" aria-label="Search customer columns"></div><div class="contract-fields"><table><thead><tr><th>Column</th><th>Type</th><th>Required</th></tr></thead><tbody id="workspaceFieldRows">${object.fields.map((field) => `<tr><td><code>${escapeHtml(field.field)}</code></td><td>${escapeHtml(field.observed_type || field.declared_type || 'Unknown')}</td><td>${field.required === 'yes' ? 'Yes' : 'No'}</td></tr>`).join('')}</tbody></table></div></section>
        </div>
      </div>
    <div class="profile-metrics">
      <div class="profile-metric"><span class="eyebrow">Records reviewed</span><strong>${summary.rows.toLocaleString()}</strong><span class="subtle">Valid records included</span></div>
      <div class="profile-metric"><span class="eyebrow">Columns found</span><strong>${summary.columns}</strong><span class="subtle">Available customer fields</span></div>
      <div class="profile-metric warn"><span class="eyebrow">Records repaired</span><strong>${summary.repaired}</strong><span class="subtle">Broken lines reconstructed</span></div>
      <div class="profile-metric warn"><span class="eyebrow">Records excluded</span><strong>${summary.quarantined}</strong><span class="subtle">Could not be read safely</span></div>
    </div>
    <div class="profile-layout">
      <section class="profile-section"><h2>Useful columns</h2><p class="subtle">How much of the file carries information for matching.</p><div class="profile-breakdown">
        <div class="profile-breakdown-row"><span>Useful for review</span><strong>${summary.informative}</strong></div>
        <div class="profile-breakdown-row"><span>Same value in every record</span><strong>${summary.constant}</strong></div>
        <div class="profile-breakdown-row"><span>Always blank</span><strong>${summary.empty}</strong></div>
      </div></section>
      <section class="profile-section"><h2>Column definitions</h2><p class="subtle">Comparison with the supplied JSON definitions.</p><div class="profile-breakdown">
        <div class="profile-breakdown-row"><span>Defined columns</span><strong>${summary.schemaColumns}</strong></div>
        <div class="profile-breakdown-row"><span>Customer-added columns</span><strong>${summary.customColumns}</strong></div>
        <div class="profile-breakdown-row"><span>Total columns</span><strong>${summary.columns}</strong></div>
      </div></section>
    </div>
    <section class="profile-table-section"><h2>Items to review</h2><p class="subtle">Findings that can affect field matching or the values sent to IVO.</p><div class="table-scroll"><table><thead><tr><th>Customer field</th><th>What we found</th><th>Why it matters</th><th>Suggested next step</th></tr></thead><tbody>${findings.slice(0, 100).map((item) => `<tr><td><code>${escapeHtml(item.field)}</code></td><td>${escapeHtml(item.detail[0])}</td><td><span class="badge review">${escapeHtml(findingImpact(item.flag))}</span></td><td>${escapeHtml(item.detail[1])}</td></tr>`).join('') || '<tr><td colspan="4">No data quality issues found.</td></tr>'}</tbody></table></div></section>
    </div>
    <section class="source-file-viewer" id="workspaceSourceFilePanel" hidden><div class="file-viewer-head"><div><h2 id="workspaceSourceFileName"></h2><div class="file-viewer-path" id="workspaceSourceFilePath"></div></div><button class="button" id="workspaceBackToFields">Back to table details</button></div><pre class="file-viewer-code" id="workspaceSourceFileContent" tabindex="0">Loading file…</pre><div class="file-viewer-csv" id="workspaceSourceCsvPreview" hidden><div class="file-viewer-summary" id="workspaceSourceCsvSummary"></div><div class="file-viewer-table"><table><thead id="workspaceSourceCsvHead"></thead><tbody id="workspaceSourceCsvBody"></tbody></table></div></div></section>`;
}

function findingImpact(flag) {
  if (['REQUIRED_BUT_EMPTY', 'ENUM_VIOLATION', 'PATTERN_VIOLATION', 'TYPE_MISMATCH'].includes(flag)) return 'Check before delivery';
  if (['PADDED', 'PLACEHOLDER_NULL', 'WHITESPACE_NULL', 'NUMERIC_AS_STRING', 'MIXED_FORMAT'].includes(flag)) return 'Value cleanup';
  if (['EMPTY', 'CONSTANT', 'SPARSE'].includes(flag)) return 'Mapping decision';
  return 'Review';
}

function renderMappingRows() {
  const query = byId('searchInput').value.trim().toLowerCase();
  const filter = byId('statusFilter').value;
  const ruleFilter = byId('ruleFilter').value;
  byId('mappingRows').innerHTML = '';
  state.mappings.forEach((item, index) => {
    if (query && !`${item.dest} ${item.source} ${item.rule}`.toLowerCase().includes(query)) return;
    if (filter !== 'all' && item.status !== filter) return;
    if (ruleFilter !== 'all' && mappingRuleGroup(item) !== ruleFilter) return;
    const row = document.createElement('tr');
    if (index === state.selectedMapping) row.className = 'selected';
    row.innerHTML = `<td><code>${escapeHtml(item.dest)}</code></td><td><code>${escapeHtml(item.source || 'No customer field')}</code></td><td>${escapeHtml(item.rule)}</td><td><div class="confidence"><div class="confidence-bar"><span style="width:${item.confidence}%"></span></div>${item.source ? `${item.confidence}%` : '—'}</div></td><td><span class="badge ${item.status === 'suggested' ? 'review' : item.status}">${mappingLabels[item.status]}</span></td>`;
    row.addEventListener('click', () => { state.selectedMapping = index; renderMappingRows(); renderMappingDetail(); });
    byId('mappingRows').appendChild(row);
  });
}

function mappingRuleGroup(item) {
  const kind = String(item.raw.kind || '').toLowerCase();
  if (kind.includes('lookup')) return 'lookup';
  if (kind === 'identifier' || kind === 'generated' || kind === 'reference') return 'ivo';
  if (kind === 'unresolved' || item.status === 'review' || item.status === 'blocked') return 'decision';
  return 'copy';
}

function mapItemAccess(field) {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(field)
    ? `flow.mapItem().${field}`
    : `flow.mapItem()[${JSON.stringify(field)}]`;
}

async function selectCustomerField(value) {
  const item = state.mappings[state.selectedMapping];
  if (!item) return;
  const sourceSelect = byId('detailSource');
  const previousSource = sourceSelect.dataset.previousValue || '';
  const expression = byId('expression');
  const previousAccess = previousSource ? mapItemAccess(previousSource) : '';
  const nextAccess = value ? mapItemAccess(value) : '';

  if (previousAccess && expression.value.includes(previousAccess)) {
    expression.value = value ? expression.value.split(previousAccess).join(nextAccess) : '';
  } else if (value && (!expression.value || /^flow\.todo\(["']Select a source/.test(expression.value))) {
    expression.value = nextAccess;
  }

  sourceSelect.dataset.previousValue = value;
  if (value && value !== previousSource) {
    document.querySelectorAll('#decisionGroup button').forEach((button) => {
      button.classList.toggle('active', button.dataset.decision === 'override');
    });
  }

  const requestId = ++state.scoreRequestId;
  if (!value) {
    byId('detailScore').textContent = '—';
    byId('evidenceText').textContent = 'No customer field selected.';
    return;
  }

  byId('detailScore').textContent = 'Calculating…';
  try {
    const result = await request(`/api/customers/${encodeURIComponent(state.object.customer)}/objects/${encodeURIComponent(state.object.key)}/score`, {
      method: 'POST',
      body: JSON.stringify({ destField: item.dest, sourceField: value }),
    });
    if (requestId !== state.scoreRequestId || sourceSelect.value !== value) return;
    byId('detailScore').textContent = `${result.score}%`;
    byId('evidenceText').textContent = result.evidence;
  } catch (error) {
    if (requestId !== state.scoreRequestId) return;
    byId('detailScore').textContent = 'Unavailable';
    showMessage(error.message, 'error');
  }
}

function renderMappingDetail() {
  const item = state.mappings[state.selectedMapping];
  if (!item) return;
  state.scoreRequestId++;
  byId('detailTitle').textContent = item.dest;
  const sourceSelect = byId('detailSource');
  const fields = [...new Set(state.object.fields.map((field) => field.field).filter(Boolean))]
    .sort((left, right) => left.localeCompare(right));
  if (item.source && !fields.includes(item.source)) fields.unshift(item.source);
  sourceSelect.innerHTML = [
    '<option value="">No customer field</option>',
    ...fields.map((field) => `<option value="${escapeHtml(field)}">${escapeHtml(field)}</option>`),
  ].join('');
  sourceSelect.value = item.source;
  sourceSelect.dataset.previousValue = item.source;
  byId('detailDest').textContent = item.dest;
  byId('detailScore').textContent = item.source ? `${item.confidence}%` : '—';
  byId('detailBadge').textContent = mappingLabels[item.status];
  byId('detailBadge').className = `badge ${item.status === 'suggested' ? 'review' : item.status}`;
  byId('expression').value = item.transform;
  byId('evidenceText').textContent = item.evidence;
  byId('evidenceLink').hidden = !item.source || item.raw.status !== 'recovered';
  byId('notes').value = item.notes;
  const selectedDecision = item.status === 'suggested' || item.status === 'review' ? '' : item.status;
  document.querySelectorAll('#decisionGroup button').forEach((button) => button.classList.toggle('active', button.dataset.decision === selectedDecision));
}

function renderValueEvidence() {
  const evidence = state.valueEvidence;
  if (!evidence) return;
  const matched = state.valueEvidenceView === 'matched';
  const rows = matched ? evidence.matched : evidence.unmatched;
  const total = matched ? evidence.matchedRows : evidence.unmatchedRows;
  document.querySelectorAll('[data-value-view]').forEach((button) => {
    const selected = button.dataset.valueView === state.valueEvidenceView;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-selected', String(selected));
  });
  byId('valueEvidenceSummary').textContent = `${total.toLocaleString()} ${matched ? 'matching' : 'non-matching'} row${total === 1 ? '' : 's'}. Showing ${rows.length} representative value pair${rows.length === 1 ? '' : 's'}.`;
  byId('valueEvidenceTable').innerHTML = rows.length
    ? `<table><thead><tr><th>Record key</th><th>Customer value</th><th>IVO value</th><th>Result</th></tr></thead><tbody>${rows.map((row) => `<tr><td><code>${escapeHtml(row.recordKey)}</code></td><td><code>${escapeHtml(row.sourceValue)}</code></td><td><code>${escapeHtml(row.destValue)}</code></td><td>${escapeHtml(row.reason)}</td></tr>`).join('')}</tbody></table>`
    : `<div class="value-evidence-empty">No ${matched ? 'matching' : 'non-matching'} values were found in the joined rows.</div>`;
}

async function showValueEvidence() {
  const item = state.mappings[state.selectedMapping];
  if (!item?.source) return;
  const button = byId('evidenceLink');
  setButtonBusy(button, true, 'Loading values…');
  try {
    state.valueEvidence = await request(`/api/customers/${encodeURIComponent(state.object.customer)}/objects/${encodeURIComponent(state.object.key)}/values?dest=${encodeURIComponent(item.dest)}`);
    state.valueEvidenceView = 'matched';
    byId('valueEvidenceTitle').textContent = item.dest;
    byId('valueEvidenceFields').textContent = `${item.source} customer values compared with ${item.dest} IVO values`;
    renderValueEvidence();
    byId('valueEvidenceDialog').showModal();
  } catch (error) {
    showMessage(error.message, 'error');
  } finally {
    setButtonBusy(button, false);
  }
}

function updateMappingMetrics() {
  const reviewed = state.mappings.filter((item) => item.status === 'accepted').length;
  const open = state.mappings.filter((item) => item.status === 'suggested' || item.status === 'review' || item.status === 'blocked').length;
  const omitted = state.mappings.filter((item) => item.status === 'omitted').length;
  document.querySelector('#view-mapping .summary-strip').innerHTML = `<div class="metric good"><div class="metric-value" id="approvedMetric">${reviewed}</div><div class="metric-label">Reviewed matches</div></div><div class="metric warn"><div class="metric-value" id="reviewMetric">${open}</div><div class="metric-label">Still to review</div></div><div class="metric"><div class="metric-value">${omitted}</div><div class="metric-label">Not sent to IVO</div></div><div class="metric"><div class="metric-value">${state.mappings.length}</div><div class="metric-label">IVO fields</div></div>`;
  byId('navOpen').textContent = `${open} open`;
  document.querySelector('.progress span').style.width = `${state.mappings.length ? Math.round((reviewed + omitted) / state.mappings.length * 100) : 0}%`;
}

function readinessState(passed, review = false) {
  if (passed) return { icon: '✓', className: '', label: 'Ready' };
  return { icon: '!', className: review ? '' : 'block', label: review ? 'Review' : 'Not ready' };
}

function deliveryHandling(item) {
  const expression = item.transform.trim();
  const group = mappingRuleGroup(item);
  let action = 'Set value';
  if (group === 'lookup') action = 'Lookup result';
  else if (expression.startsWith('flow.config.')) action = 'Configuration';
  else if (expression === 'uuid.v4()') action = 'Generate value';
  else if (item.source && expression === mapItemAccess(item.source)) action = 'Map field';
  else if (item.source) action = 'Transform field';

  const handlingComplete = Boolean(expression) && !expression.includes('flow.todo(');
  const ready = item.status === 'accepted' && handlingComplete;
  const status = ready ? 'Ready' : item.status === 'accepted' ? 'Needs setup' : 'Needs review';
  return { action, expression, ready, status };
}

function renderDeliveryPlan() {
  const mapped = state.mappings.filter((item) => item.source || (item.status === 'accepted' && item.transform.trim()));
  const handlingRows = mapped.map((item) => ({ item, handling: deliveryHandling(item) }));
  const readyHandling = handlingRows.filter((row) => row.handling.ready).length;
  const pendingHandling = handlingRows.length - readyHandling;
  byId('view-build').innerHTML = `
    <div class="page-head"><h1>Delivery plan</h1><p class="subtle">Use the mapped fields below to configure the Trimble delivery flow.</p></div>
    <section class="delivery-rules"><div class="delivery-rules-head"><div><h2>Trimble implementation grid</h2><p class="subtle">All mapped fields appear here. Review the Status column before implementing each mapping.</p></div><span class="badge ${pendingHandling ? 'review' : 'accepted'}">${readyHandling} of ${handlingRows.length} ready</span></div>
      <div class="delivery-rules-table">${handlingRows.length ? `<table><thead><tr><th>IVO field</th><th>Trimble action</th><th>Customer field</th><th>Value handling</th><th>Review notes</th><th>Status</th></tr></thead><tbody>${handlingRows.map(({ item, handling }, index) => `<tr><td><code>${escapeHtml(item.dest)}</code></td><td>${escapeHtml(handling.action)}</td><td><code>${escapeHtml(item.source || 'None')}</code></td><td><div class="delivery-expression"><code>${escapeHtml(handling.expression || 'Not defined')}</code>${handling.expression ? `<button class="button" data-copy-handling="${index}" title="Copy value handling">Copy</button>` : ''}</div></td><td>${escapeHtml(item.notes || 'No review notes')}</td><td><span class="badge ${handling.ready ? 'accepted' : 'review'}">${handling.status}</span></td></tr>`).join('')}</tbody></table>` : '<div class="delivery-empty">No mapped fields are available yet.</div>'}</div>
    </section>`;
}

async function copyDeliveryHandling(button) {
  const expression = button.closest('.delivery-expression')?.querySelector('code')?.textContent || '';
  if (!expression) return;
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable');
    await navigator.clipboard.writeText(expression);
    showMessage('Reviewed value handling copied.');
  } catch {
    const textarea = document.createElement('textarea');
    textarea.value = expression;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    const copied = document.execCommand('copy');
    textarea.remove();
    showMessage(copied ? 'Reviewed value handling copied.' : 'Unable to copy. Select the expression and copy it manually.', copied ? 'info' : 'error');
  }
}

function renderReadiness() {
  const sourceFields = new Set(state.object.fields.map((field) => field.field));
  const mappedSources = state.mappings.filter((item) => item.source);
  const missingSources = mappedSources.filter((item) => !sourceFields.has(item.source));
  const managedFields = new Set((state.mappingReference?.fields || [])
    .filter((field) => field.ownership === 'ivo' || field.mapping_behavior === 'generated')
    .map((field) => field.field));
  const generated = state.mappings.filter((item) => managedFields.has(item.dest));
  const generatedAssigned = generated.filter((item) => item.source);
  const open = state.mappings.filter((item) => ['suggested', 'review', 'blocked'].includes(item.status));
  const lookups = state.mappings.filter((item) => mappingRuleGroup(item) === 'lookup');
  const referenceReview = state.mappingReference?.needsReview || 0;
  const checks = [
    { name: 'Customer fields exist', detail: `${mappedSources.length - missingSources.length} of ${mappedSources.length}`, ...readinessState(missingSources.length === 0) },
    managedFields.size
      ? { name: 'IVO-managed fields are not assigned', detail: `${generated.length - generatedAssigned.length} of ${generated.length}`, ...readinessState(generatedAssigned.length === 0) }
      : { name: 'IVO-managed fields are identified', detail: 'None identified in the reference', ...readinessState(false, true) },
    { name: 'Field reviews are complete', detail: open.length ? `${open.length} open` : 'Complete', ...readinessState(open.length === 0) },
    { name: 'Lookup fields are confirmed', detail: lookups.length ? `${lookups.length} require confirmation` : 'No open lookups', ...readinessState(lookups.length === 0, true) },
    { name: 'IVO reference is approved', detail: referenceReview ? `${referenceReview} fields need review` : 'Ready', ...readinessState(referenceReview === 0, true) },
  ];
  const readyCount = checks.filter((check) => check.label === 'Ready').length;
  const blockingCount = checks.filter((check) => check.className === 'block').length;
  byId('view-validate').innerHTML = `
    <div class="page-head"><h1>Readiness</h1><p class="subtle">Pre-delivery checks calculated from the current customer profile, IVO reference, and field review.</p></div>
    <div class="board">
      <div class="validation-grid">
        <div class="validation-card ${readyCount === checks.length ? 'good' : 'warn'}"><div class="eyebrow">Checks ready</div><div class="big">${readyCount} / ${checks.length}</div><div class="subtle">Current preparation checks</div></div>
        <div class="validation-card ${open.length ? 'warn' : 'good'}"><div class="eyebrow">Field reviews</div><div class="big">${state.mappings.length - open.length} / ${state.mappings.length}</div><div class="subtle">Reviewed or intentionally omitted</div></div>
        <div class="validation-card ${blockingCount ? 'bad' : 'good'}"><div class="eyebrow">Blocking items</div><div class="big">${blockingCount}</div><div class="subtle">Must be resolved before delivery</div></div>
      </div>
      <div class="file-list">${checks.map((check) => `<div class="file-row"><span class="${check.className ? '' : 'file-status'}">${check.icon}</span><strong>${escapeHtml(check.name)}</strong><span>${escapeHtml(check.detail)}</span><span>${check.label}</span></div>`).join('')}</div>
      <div class="info-banner" style="margin-top:24px"><svg viewBox="0 0 24 24"><path d="M12 9v4m0 4h.01"/><circle cx="12" cy="12" r="10"/></svg><p>These are preparation checks, not payload validation. Automated row-level validation is still planned and no delivery file is generated from this page.</p></div>
    </div>`;
}

async function openMappingWorkspace(initialView = 'mapping') {
  state.mappings = state.object.mappings.map(normalizeMapping);
  try {
    state.mappingReference = await request(`/api/references/${encodeURIComponent(state.object.referenceKey)}`);
  } catch {
    state.mappingReference = null;
  }
  state.selectedMapping = Math.max(0, state.mappings.findIndex((item) => item.status === 'suggested' || item.status === 'review'));
  document.querySelector('.case-name').textContent = state.object.customer;
  document.querySelector('.case-meta').textContent = state.object.name;
  document.querySelector('.sidebar [data-view="profile"] .nav-count').textContent = state.object.summary.columns;
  document.querySelector('.breadcrumbs').innerHTML = `Customers / <strong>${escapeHtml(state.object.customer)}</strong> / ${escapeHtml(state.object.name)} / <span id="crumb">Field matches</span>`;
  document.querySelector('.sidebar-foot').innerHTML = `IVO reference: ${escapeHtml(state.object.referenceName || 'Not selected')}<br>Analyzed ${formatDate(state.object.updated)}`;
  document.querySelector('#view-mapping .page-head h1').textContent = `${state.object.name} field matches`;
  document.querySelector('#view-mapping .page-head p').textContent = `${state.mappings.length} IVO fields · ${state.object.customer} customer data`;
  renderProfile();
  renderMappingRows();
  renderMappingDetail();
  updateMappingMetrics();
  renderDeliveryPlan();
  renderReadiness();
  openWorkspace('mapping');
  setView(initialView);
}

async function saveMappingReview() {
  const item = state.mappings[state.selectedMapping];
  const active = document.querySelector('#decisionGroup button.active');
  if (!active) return showMessage('Choose a review decision first.', 'error');
  const decisions = { accepted: 'accept', override: 'accept-with-override', omitted: 'omit', blocked: 'needs-info' };
  const button = byId('saveDecision');
  setButtonBusy(button, true, 'Saving…');
  try {
    const detail = await request(`/api/customers/${encodeURIComponent(state.object.customer)}/objects/${encodeURIComponent(state.object.key)}/review`, {
      method: 'POST',
      body: JSON.stringify({
        destField: item.dest,
        reviewDecision: decisions[active.dataset.decision],
        reviewNotes: byId('notes').value,
        sourceField: byId('detailSource').value,
        transform: byId('expression').value,
      }),
    });
    state.object = detail;
    state.mappings = detail.mappings.map(normalizeMapping);
    renderMappingRows();
    renderMappingDetail();
    updateMappingMetrics();
    renderDeliveryPlan();
    renderReadiness();
    showMessage('Review saved.');
  } catch (error) {
    showMessage(error.message, 'error');
  } finally {
    setButtonBusy(button, false);
  }
}

function nextMapping() {
  const match = state.mappings.findIndex((item, index) => index > state.selectedMapping && ['suggested', 'review', 'blocked'].includes(item.status));
  const fallback = state.mappings.findIndex((item) => ['suggested', 'review', 'blocked'].includes(item.status));
  state.selectedMapping = match >= 0 ? match : fallback;
  if (state.selectedMapping >= 0) { renderMappingRows(); renderMappingDetail(); }
}

function configureUsefulLabels() {
  document.querySelector('.launcher-main > .eyebrow').textContent = 'Choose an area';
  document.querySelector('.launcher-main > p').textContent = 'Review a customer mapping or maintain the shared IVO field definitions.';
  document.querySelector('.workspace-choice .choice-head h2').textContent = 'Customer mappings';
  document.querySelector('.workspace-choice .choice-head p').textContent = 'Review customer data and match it to IVO fields.';
  document.querySelector('.reference-choice .choice-head h2').textContent = 'IVO field definitions';
  document.querySelector('.reference-choice .choice-head p').textContent = 'Manage the shared IVO fields and rules used by every customer.';
  document.querySelector('#erpCatalog h1').textContent = 'Customer data tables';
  document.querySelector('#erpCatalog > p').textContent = 'Choose a customer table to review its files, data quality, and field matches.';
  document.querySelector('#erpCatalog .eyebrow').lastChild.textContent = ' · Customer files';
  document.querySelector('#erpDetail .contract-meta-item span').textContent = 'Folder ID';
  document.querySelector('#erpDetail h1').textContent = 'Table details';
  document.querySelector('#erpAdd h1').textContent = 'Add customer table';
  document.querySelector('#erpAdd .panel-head h2').textContent = 'Table and files';
  const systemField = byId('erpSystemName')?.closest('.field');
  if (systemField) systemField.hidden = true;
  byId('finishErpAdd').textContent = 'Add and analyze';
  byId('useErpDemoFiles').hidden = true;
  byId('useDemoFiles').hidden = true;
  byId('openReferences').textContent = 'Open IVO references';
  document.querySelector('#referenceWorkspace .reference-title strong').textContent = 'IVO field definitions';
  document.querySelector('#referenceWorkspace .reference-title small').textContent = 'Shared fields and rules';
  document.querySelector('#referenceCatalog > .eyebrow').textContent = 'Shared IVO definitions';
  document.querySelector('#referenceCatalog h1').textContent = 'IVO references';
  document.querySelector('#referenceCatalog > p').textContent = 'Review the fields and rules used to match every customer data table.';
  const referenceMetrics = document.querySelectorAll('#referenceCatalog .metric-label');
  referenceMetrics[0].textContent = 'Ready';
  referenceMetrics[1].textContent = 'Need review';
  referenceMetrics[2].textContent = 'IVO fields';
  const referenceHeaders = document.querySelectorAll('#referenceCatalog thead th');
  ['IVO reference', 'Fields', 'Review status', 'Files', 'Updated'].forEach((label, index) => { referenceHeaders[index].textContent = label; });
  byId('addObjectContract').textContent = 'Add reference';
  byId('wizardTitle').textContent = 'Add IVO reference';
  document.querySelector('#referenceWizard .wizard-head p').textContent = 'Add an IVO field definition and an optional sample file.';
  document.querySelector('#referenceWizard .wizard-rail').setAttribute('aria-label', 'Reference creation progress');
  const wizardStepText = [
    ['Name reference', 'Folder ID'],
    ['Add files', 'Definition and sample'],
    ['Create reference', 'Build shared files'],
  ];
  document.querySelectorAll('#referenceWizard .wizard-step:not([data-ref-step="review"])').forEach((step, index) => {
    step.querySelector('strong').textContent = wizardStepText[index][0];
    step.querySelector('small').textContent = wizardStepText[index][1];
  });
  document.querySelector('#refPanelDefine .panel-head h2').textContent = 'Name the IVO reference';
  document.querySelector('#refPanelDefine .panel-head p').textContent = 'This folder ID connects the IVO reference to customer tables with the same ID.';
  document.querySelector('label[for="objectName"]').textContent = 'Folder ID';
  byId('objectName').placeholder = 'for example: work_orders';
  byId('objectName').nextElementSibling.textContent = 'Letters, numbers, hyphens, and underscores.';
  byId('objectLabel').closest('.field').hidden = true;
  byId('objectDescription').closest('.field').hidden = true;
  document.querySelector('#refPanelFiles .panel-head h2').textContent = 'Add IVO files';
  document.querySelector('#refPanelFiles .panel-head p').textContent = 'Original IVO files are kept separately from the shared reference.';
  document.querySelector('#schemaZone h3').textContent = 'IVO field definition';
  document.querySelector('#schemaZone p').textContent = 'Required · JSON';
  document.querySelector('#sampleZone h3').textContent = 'Sample records';
  document.querySelector('#refPanelProcess .panel-head h2').textContent = 'Create the shared reference';
  document.querySelector('#refPanelProcess .panel-head p').textContent = 'The workbench reads the files and prepares the fields and rules used for matching.';
  const processLabels = [
    ['Read field definition', 'Check the JSON and collect each IVO field.'],
    ['Review sample values', 'Summarize how often values appear and what they look like.'],
    ['Create reference files', 'Prepare the field list and value checks.'],
    ['Flag decisions', 'Mark fields and rules that still need IVO review.'],
  ];
  document.querySelectorAll('#refPanelProcess .process-row').forEach((row, index) => {
    row.querySelector('strong').textContent = processLabels[index][0];
    row.querySelector('.subtle').textContent = processLabels[index][1];
  });
  byId('runProcessing').textContent = 'Create reference';
  document.querySelector('#referenceDetail h1').textContent = 'Reference details';
  const referenceMetaLabels = document.querySelectorAll('#referenceDetail .contract-meta-item span');
  referenceMetaLabels[0].textContent = 'Folder ID';
  referenceMetaLabels[2].textContent = 'Files';
  document.querySelector('.contract-files h2').textContent = 'Reference files';
  document.querySelector('.contract-files > p').textContent = 'Files used to match customer fields and check values.';
  document.querySelector('#contractFieldPanel th:last-child').textContent = 'How values are handled';
  document.querySelector('.mobile-nav').style.gridTemplateColumns = 'repeat(4, 1fr)';
  document.querySelector('.sidebar [data-view="profile"] .nav-label').textContent = 'Table details';
  document.querySelector('.sidebar [data-view="mapping"] .nav-label').textContent = 'Field matches';
  document.querySelector('.sidebar [data-view="build"] .nav-label').textContent = 'Delivery plan';
  document.querySelector('.sidebar [data-view="validate"] .nav-label').textContent = 'Readiness';
  document.querySelector('.sidebar [data-view="build"] .nav-count').textContent = 'Planned';
  document.querySelector('.sidebar [data-view="validate"] .nav-count').textContent = 'Live checks';
  document.querySelector('.mobile-nav [data-view="profile"]').textContent = 'Table details';
  document.querySelector('.mobile-nav [data-view="mapping"]').textContent = 'Field matches';
  document.querySelector('.mobile-nav [data-view="build"]').textContent = 'Delivery plan';
  document.querySelector('.mobile-nav [data-view="validate"]').textContent = 'Readiness';
  byId('nextOpen').textContent = 'Next to review';
  byId('searchInput').placeholder = 'Search customer or IVO fields';
  byId('detailSource').previousElementSibling.textContent = 'Customer field';
  byId('detailDest').previousElementSibling.textContent = 'IVO field';
  document.querySelector('label[for="expression"]').textContent = 'Value handling';
  document.querySelector('label[for="notes"]').textContent = 'Review notes';
  byId('saveDecision').textContent = 'Save review';
  byId('evidenceLink').textContent = 'View compared values';
  document.querySelector('#customerWorkspace .topbar .top-actions .button').hidden = true;
  byId('buildButton').hidden = true;
  const ruleFilter = document.querySelector('[aria-label="Filter mapping type"]');
  ruleFilter.id = 'ruleFilter';
  ruleFilter.innerHTML = '<option value="all">All value handling</option><option value="copy">Copy or transform</option><option value="lookup">IVO lookup</option><option value="ivo">Managed by IVO</option><option value="decision">Needs a decision</option>';
  const resetButton = document.querySelector('.detail-actions .button:not(#saveDecision)');
  resetButton.id = 'resetDecision';
  resetButton.textContent = 'Undo edits';
  const mappingHeaders = document.querySelectorAll('#view-mapping thead th');
  mappingHeaders[0].textContent = 'IVO field';
  mappingHeaders[1].textContent = 'Customer field';
  mappingHeaders[2].textContent = 'Value handling';
  mappingHeaders[3].textContent = 'Match score';
  mappingHeaders[4].textContent = 'Review status';
  const decisionButtons = document.querySelectorAll('#decisionGroup button');
  ['Use suggestion', 'Change match', 'Do not send', 'Needs information'].forEach((label, index) => { decisionButtons[index].textContent = label; });
  const filter = byId('statusFilter');
  filter.innerHTML = '<option value="all">All fields</option><option value="suggested">Suggested</option><option value="accepted">Reviewed</option><option value="review">Needs review</option><option value="omitted">Not sent</option><option value="blocked">Needs information</option>';
}

function bindEvents() {
  document.querySelectorAll('.theme-toggle').forEach((button) => button.addEventListener('click', () => {
    document.documentElement.dataset.theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  }));
  document.querySelectorAll('[data-back]').forEach((button) => button.addEventListener('click', returnToLauncher));
  byId('mappingHomeButton').addEventListener('click', returnToLauncher);
  byId('connectorSelect').addEventListener('change', () => {
    state.connector = byId('connectorSelect').value;
    renderLauncher();
  });
  (byId('customerRows') || document.querySelector('.workspace-list')).addEventListener('click', (event) => {
    const button = event.target.closest('[data-open-customer]');
    if (button) openCustomer(button.dataset.openCustomer);
  });
  byId('openReferences').addEventListener('click', () => { openWorkspace('references'); showReferenceCatalog(); });
  document.querySelectorAll('[data-workspace-view]').forEach((button) => button.addEventListener('click', () => {
    const view = button.dataset.workspaceView;
    if (view === 'sources') return;
    location.href = `/workspace?customer=${encodeURIComponent(state.customer)}${view === 'overview' ? '&view=overview' : ''}`;
  }));
  byId('referenceRows').addEventListener('click', (event) => {
    const button = event.target.closest('[data-reference-key]');
    if (button) showReferenceDetail(button.dataset.referenceKey).catch((error) => showMessage(error.message, 'error'));
  });
  byId('addObjectContract').addEventListener('click', showReferenceWizard);
  byId('cancelObject').addEventListener('click', showReferenceCatalog);
  byId('backToContracts').addEventListener('click', showReferenceCatalog);
  byId('continueToFiles').addEventListener('click', () => {
    if (!keyFromName(byId('objectName').value)) return showMessage('Enter a reference name first.', 'error');
    showReferenceStep('files');
  });
  byId('backToDefine').addEventListener('click', () => showReferenceStep('define'));
  byId('backToFiles').addEventListener('click', () => showReferenceStep('files'));
  byId('continueToProcess').addEventListener('click', () => showReferenceStep('process'));
  byId('runProcessing').addEventListener('click', createReference);
  byId('schemaInput').addEventListener('change', (event) => { if (event.target.files[0]) setReferenceFile('schema', event.target.files[0]); });
  byId('sampleInput').addEventListener('change', (event) => { if (event.target.files[0]) setReferenceFile('sample', event.target.files[0]); });
  byId('contractFiles').addEventListener('click', (event) => {
    const row = event.target.closest('[data-reference-file]');
    if (row) openFile(state.reference.files[Number(row.dataset.referenceFile)], 'contract');
  });
  byId('contractFiles').addEventListener('keydown', (event) => {
    const row = event.target.closest('[data-reference-file]');
    if (row && (event.key === 'Enter' || event.key === ' ')) openFile(state.reference.files[Number(row.dataset.referenceFile)], 'contract');
  });
  byId('backToFields').addEventListener('click', showContractFields);
  byId('contractFieldSearch').addEventListener('input', (event) => {
    const query = event.target.value.trim().toLowerCase();
    document.querySelectorAll('#contractFieldRows tr').forEach((row) => { row.hidden = query && !row.textContent.toLowerCase().includes(query); });
  });
  byId('addErpTable').addEventListener('click', showAddCustomerObject);
  byId('addFirstErpTable').addEventListener('click', showAddCustomerObject);
  byId('cancelErpAdd').addEventListener('click', showCustomerCatalog);
  byId('erpTableName').addEventListener('input', updateAddCustomerState);
  byId('erpReference').addEventListener('change', updateAddCustomerState);
  byId('erpCsvInput').addEventListener('change', (event) => { if (event.target.files[0]) setCustomerFile('csv', event.target.files[0]); });
  byId('erpJsonInput').addEventListener('change', (event) => { if (event.target.files[0]) setCustomerFile('json', event.target.files[0]); });
  byId('finishErpAdd').addEventListener('click', addCustomerObject);
  byId('erpObjectRows').addEventListener('click', (event) => {
    const button = event.target.closest('[data-customer-object]');
    if (button) showCustomerObject(button.dataset.customerObject).catch((error) => showMessage(error.message, 'error'));
  });
  byId('backToErpCatalog').addEventListener('click', showCustomerCatalog);
  byId('backToErpFields').addEventListener('click', showCustomerFields);
  byId('erpSourceFiles').addEventListener('click', (event) => {
    const row = event.target.closest('[data-customer-file]');
    if (row) openFile(state.object.sourceFiles[Number(row.dataset.customerFile)], 'erp');
  });
  byId('erpSourceFiles').addEventListener('keydown', (event) => {
    const row = event.target.closest('[data-customer-file]');
    if (row && (event.key === 'Enter' || event.key === ' ')) openFile(state.object.sourceFiles[Number(row.dataset.customerFile)], 'erp');
  });
  byId('erpFieldSearch').addEventListener('input', (event) => {
    const query = event.target.value.trim().toLowerCase();
    document.querySelectorAll('#erpFieldRows tr').forEach((row) => { row.hidden = query && !row.textContent.toLowerCase().includes(query); });
  });
  byId('refreshErpAnalysis')?.addEventListener('click', runAnalysis);
  byId('openErpMapping').addEventListener('click', () => openMappingWorkspace().catch((error) => showMessage(error.message, 'error')));
  byId('backToErpCatalogFromMapping').addEventListener('click', () => { openWorkspace('customer'); showCustomerCatalog(); });
  document.querySelectorAll('[data-view]').forEach((button) => button.addEventListener('click', () => setView(button.dataset.view)));
  byId('searchInput').addEventListener('input', renderMappingRows);
  byId('statusFilter').addEventListener('change', renderMappingRows);
  byId('ruleFilter').addEventListener('change', renderMappingRows);
  byId('detailSource').addEventListener('change', (event) => selectCustomerField(event.target.value));
  byId('view-profile').addEventListener('click', (event) => {
    if (event.target.closest('#workspaceUploadIvo')) return byId('workspaceIvoInput').click();
    if (event.target.closest('#saveWorkspaceReference')) return saveCustomerReference();
    if (event.target.closest('#workspaceAnalyze')) return runAnalysis();
    if (event.target.closest('#workspaceBackToFields')) {
      byId('workspaceSourceFieldPanel').hidden = false;
      byId('workspaceSourceFilePanel').hidden = true;
      return;
    }
    const file = event.target.closest('[data-workspace-source-file]');
    if (file) openFile(state.object.sourceFiles[Number(file.dataset.workspaceSourceFile)], 'workspaceSource');
    const ivoFile = event.target.closest('[data-workspace-ivo-file]');
    if (ivoFile) openFile(state.object.ivoFiles[Number(ivoFile.dataset.workspaceIvoFile)], 'workspaceSource');
  });
  byId('view-profile').addEventListener('keydown', (event) => {
    const file = event.target.closest('[data-workspace-source-file]');
    if (file && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      openFile(state.object.sourceFiles[Number(file.dataset.workspaceSourceFile)], 'workspaceSource');
    }
    const ivoFile = event.target.closest('[data-workspace-ivo-file]');
    if (ivoFile && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      openFile(state.object.ivoFiles[Number(ivoFile.dataset.workspaceIvoFile)], 'workspaceSource');
    }
  });
  byId('view-profile').addEventListener('change', (event) => {
    if (event.target.id === 'workspaceIvoInput') uploadIvoCsv(event.target.files[0]);
  });
  byId('view-profile').addEventListener('input', (event) => {
    if (event.target.id === 'workspaceReferenceSelect') {
      byId('saveWorkspaceReference').disabled = !event.target.value || event.target.value === state.object.referenceKey;
      return;
    }
    if (event.target.id !== 'workspaceFieldSearch') return;
    const query = event.target.value.trim().toLowerCase();
    document.querySelectorAll('#workspaceFieldRows tr').forEach((row) => { row.hidden = query && !row.textContent.toLowerCase().includes(query); });
  });
  byId('view-build').addEventListener('click', (event) => {
    const button = event.target.closest('[data-copy-handling]');
    if (button) copyDeliveryHandling(button);
  });
  byId('nextOpen').addEventListener('click', nextMapping);
  document.querySelectorAll('#decisionGroup button').forEach((button) => button.addEventListener('click', () => {
    document.querySelectorAll('#decisionGroup button').forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
  }));
  byId('resetDecision').addEventListener('click', renderMappingDetail);
  byId('saveDecision').addEventListener('click', saveMappingReview);
  byId('evidenceLink').addEventListener('click', showValueEvidence);
  byId('closeValueEvidence').addEventListener('click', () => byId('valueEvidenceDialog').close());
  document.querySelectorAll('[data-value-view]').forEach((button) => button.addEventListener('click', () => {
    state.valueEvidenceView = button.dataset.valueView;
    renderValueEvidence();
  }));
  document.querySelectorAll('.choose-file').forEach((button) => button.addEventListener('click', () => byId(button.dataset.target).click()));
}

async function start() {
  configureUsefulLabels();
  const detailActions = document.querySelector('#erpDetail .top-actions');
  if (!byId('refreshErpAnalysis')) {
    const button = document.createElement('button');
    button.className = 'button';
    button.id = 'refreshErpAnalysis';
    button.textContent = 'Analyze again';
    detailActions.insertBefore(button, byId('openErpMapping'));
  }
  const customerRows = document.querySelector('.workspace-list');
  customerRows.id = 'customerRows';
  const contractFiles = document.querySelector('.contract-files .generated-files');
  contractFiles.id = 'contractFiles';
  bindEvents();
  document.querySelector('.mobile-nav').hidden = true;
  try {
    await loadCatalog();
    const parameters = new URLSearchParams(location.search);
    const requestedCustomer = parameters.get('customer');
    if (parameters.get('view') === 'sources' && state.catalog.customers.some((customer) => customer.key === requestedCustomer)) {
      openCustomerSources(requestedCustomer);
    }
  } catch (error) {
    byId('connectorSelect').disabled = true;
    showMessage(location.protocol === 'file:' ? 'Start the workbench server to load customer and IVO data.' : error.message, 'error');
  }
}

start();
