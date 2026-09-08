'use strict';

const RE = {
  integer: /^[-+]?\d+$/,
  decimal: /^[-+]?(?:\d+\.\d*|\.\d+|\d+)$/,
  uuid: /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/,
  isoDate: /^\d{4}-\d{2}-\d{2}(?:[T ]\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[-+]\d{2}:?\d{2})?)?$/,
  usDate: /^\d{1,2}\/\d{1,2}\/\d{2,4}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?\d?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
  ynFlag: /^[YN]$/,
  boolWord: /^(?:true|false)$/i,
};

const PLACEHOLDERS = new Set(['n/a', 'na', 'null', 'none', 'nil', '-', '--', 'unknown', 'tbd', '.', '#n/a']);

function classify(v) {
  if (RE.uuid.test(v)) return 'uuid';
  if (RE.isoDate.test(v)) return 'date';
  if (RE.usDate.test(v)) return 'date';
  if (RE.boolWord.test(v)) return 'boolean';
  if (RE.integer.test(v)) return 'integer';
  if (RE.decimal.test(v)) return 'decimal';
  if (RE.email.test(v)) return 'email';
  if (RE.phone.test(v)) return 'phone';
  return 'string';
}

// "44440052WS" -> "9{8}A{2}" — a coarse shape signature used to spot format drift.
function mask(v) {
  let out = '';
  let i = 0;
  while (i < v.length) {
    const c = v[i];
    const cls = /\d/.test(c) ? '9' : /[A-Za-z]/.test(c) ? 'A' : c;
    let n = 1;
    while (i + n < v.length) {
      const d = v[i + n];
      const dcls = /\d/.test(d) ? '9' : /[A-Za-z]/.test(d) ? 'A' : d;
      if (dcls !== cls) break;
      n++;
    }
    out += n > 1 ? `${cls}{${n}}` : cls;
    i += n;
  }
  return out;
}

function profileColumn(name, values) {
  const total = values.length;
  const counts = new Map();
  const typeCounts = new Map();
  const maskCounts = new Map();

  let empty = 0;
  let whitespaceOnly = 0;
  let placeholder = 0;
  let padded = 0;
  let minLen = Infinity;
  let maxLen = 0;
  let longestSample = '';
  let numMin = Infinity;
  let numMax = -Infinity;
  let numeric = 0;

  for (const raw of values) {
    if (raw === '') { empty++; continue; }
    const v = raw.trim();
    if (v === '') { whitespaceOnly++; continue; }
    if (v !== raw) padded++;
    if (PLACEHOLDERS.has(v.toLowerCase())) placeholder++;

    if (v.length < minLen) minLen = v.length;
    if (v.length > maxLen) { maxLen = v.length; longestSample = v; }

    const t = classify(v);
    typeCounts.set(t, (typeCounts.get(t) || 0) + 1);

    if (t === 'integer' || t === 'decimal') {
      const n = Number(v);
      if (Number.isFinite(n)) { numeric++; if (n < numMin) numMin = n; if (n > numMax) numMax = n; }
    }

    if (v.length <= 60) {
      const m = mask(v);
      maskCounts.set(m, (maskCounts.get(m) || 0) + 1);
    }

    counts.set(v, (counts.get(v) || 0) + 1);
  }

  const populated = total - empty - whitespaceOnly;
  const sortedValues = [...counts.entries()].sort((a, b) => b[1] - a[1]);
  const sortedMasks = [...maskCounts.entries()].sort((a, b) => b[1] - a[1]);

  const observedTypes = [...typeCounts.entries()].sort((a, b) => b[1] - a[1]);
  let dominantType = observedTypes.length ? observedTypes[0][0] : null;
  let dominantShare = populated ? observedTypes[0][1] / populated : 0;

  // Y/N flags only make sense judged over the whole column, not value by value.
  if (counts.size > 0 && counts.size <= 2 && [...counts.keys()].every((v) => RE.ynFlag.test(v))) {
    dominantType = 'yn';
    dominantShare = 1;
  }

  return {
    name,
    total,
    populated,
    fill: total ? populated / total : 0,
    empty,
    whitespaceOnly,
    placeholder,
    padded,
    minLen: populated ? minLen : 0,
    maxLen,
    longestSample,
    distinct: counts.size,
    topValues: sortedValues.slice(0, 5),
    topMasks: sortedMasks.slice(0, 3),
    maskCount: maskCounts.size,
    dominantType,
    dominantShare,
    observedTypes,
    numMin: numeric ? numMin : null,
    numMax: numeric ? numMax : null,
    isConstant: counts.size === 1 && populated > 0,
    isUnique: populated === total && counts.size === total && total > 0,
  };
}

module.exports = { profileColumn, classify, mask };
