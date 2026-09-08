#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function usage() {
  console.error('Usage: node tools/app-xchange-pending-manifest.js <capture-dir> <output.md> <playwright-result.txt>...');
  process.exit(1);
}

function readResult(filePath) {
  const firstLine = fs.readFileSync(filePath, 'utf8').split(/\r?\n/, 1)[0];
  if (!firstLine.startsWith('Result: ')) return null;
  return JSON.parse(firstLine.slice(8));
}

function collectPages(value, pages) {
  if (!value) return;
  if (Array.isArray(value)) {
    value.forEach((item) => collectPages(item, pages));
    return;
  }
  if (typeof value !== 'object') return;
  if (typeof value.url === 'string' && typeof value.title === 'string') {
    const url = value.url.split('#')[0].replace(/\/$/, '');
    if (url.startsWith('https://help.trimble.com/doc/app-xchange/app-xchange/')) {
      pages.set(url, value.title.replace(/\s+/g, ' ').trim());
    }
  }
  Object.values(value).forEach((item) => collectPages(item, pages));
}

function slugFromUrl(url) {
  return url.split('/').filter(Boolean).pop().toLowerCase().replace(/[^a-z0-9-]+/g, '-');
}

const [, , captureDir, outputPath, ...resultFiles] = process.argv;
if (!captureDir || !outputPath || !resultFiles.length) usage();

const pages = new Map();
resultFiles.forEach((filePath) => collectPages(readResult(filePath), pages));

const captured = new Set(
  fs.readdirSync(captureDir)
    .filter((name) => name.endsWith('.png'))
    .map((name) => name.slice(0, -4)),
);

const pending = [...pages]
  .filter(([url]) => !captured.has(slugFromUrl(url)))
  .sort((left, right) => left[0].localeCompare(right[0]));

const lines = [
  '# Known Pending App Xchange Help Pages',
  '',
  '> Generated: 2026-08-13',
  '> Status: Capture paused because Trimble Help returned CloudFront HTTP 403 after the discovery crawl.',
  '',
  `Discovered pages: ${pages.size}`,
  '',
  `Already captured: ${pages.size - pending.length}`,
  '',
  `Known pending: ${pending.length}`,
  '',
  'This is a resumable manifest, not proof that every expanded navigation branch has been discovered.',
  '',
  '| Page | Official URL |',
  '| --- | --- |',
  ...pending.map(([url, title]) => `| ${title.replace(/\|/g, '\\|')} | ${url} |`),
  '',
];

fs.writeFileSync(outputPath, lines.join('\n'), 'utf8');
console.log(`${outputPath}: ${pages.size} discovered, ${pending.length} pending`);