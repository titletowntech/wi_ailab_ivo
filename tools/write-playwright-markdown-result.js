#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const [, , resultPath, outputDirectory] = process.argv;
if (!resultPath || !outputDirectory) {
  console.error('Usage: node tools/write-playwright-markdown-result.js <result.txt> <output-directory>');
  process.exit(1);
}

const firstLine = fs.readFileSync(resultPath, 'utf8').split(/\r?\n/, 1)[0];
if (!firstLine.startsWith('Result: ')) {
  throw new Error('The Playwright result file does not begin with a JSON Result record.');
}

const result = JSON.parse(firstLine.slice(8));
if (!Array.isArray(result.records)) {
  throw new Error('The Playwright result does not contain a records array.');
}

fs.mkdirSync(outputDirectory, { recursive: true });
for (const record of result.records) {
  if (!record.name || !record.markdown) continue;
  fs.writeFileSync(path.join(outputDirectory, record.name), record.markdown, 'utf8');
  console.log(`${record.name}: ${record.markdown.length} characters`);
}

if (result.next) {
  fs.writeFileSync(path.join(outputDirectory, '.next-url'), `${result.next}\n`, 'utf8');
}