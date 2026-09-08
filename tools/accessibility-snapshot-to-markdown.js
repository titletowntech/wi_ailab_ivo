#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function usage() {
  console.error('Usage: node tools/accessibility-snapshot-to-markdown.js <snapshot.txt> <output.md>');
  process.exit(1);
}

function unquote(value) {
  const trimmed = value.trim();
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    try {
      return JSON.parse(trimmed);
    } catch {
      return trimmed.slice(1, -1);
    }
  }
  return trimmed;
}

function extractQuoted(line) {
  const match = line.match(/"((?:\\.|[^"\\])*)"/);
  return match ? unquote(`"${match[1]}"`) : '';
}

function normalize(text) {
  return text.replace(/\s+/g, ' ').trim();
}

function convert(snapshot) {
  const lines = snapshot.split(/\r?\n/);
  const title = lines.find((line) => line.startsWith('Page Title: '))?.slice(12).replace(/ \| Trimble Help$/, '') ||
    extractQuoted(lines.find((line) => /heading ".+" \[level=1\]/.test(line)) || '') ||
    'Trimble App Xchange Help';
  const source = lines.find((line) => line.startsWith('URL: '))?.slice(5).trim() || '';
  const headingIndex = lines.findIndex((line) => line.includes(`heading "${title.replace(/"/g, '\\"')}" [level=1]`));
  const articleIndex = lines.findIndex((line, index) => index > headingIndex && /^\s*- article(?:\s|\[)/.test(line));

  if (articleIndex < 0) {
    throw new Error(`No article found for ${title}`);
  }

  const articleIndent = lines[articleIndex].match(/^\s*/)[0].length;
  const output = [`# ${title}`, '', `> Source: ${source}`, '> Captured: 2026-08-13', ''];
  const listItems = [];
  let paragraph = '';
  let paragraphIndent = -1;
  let paragraphIsListItem = false;
  let inCode = false;
  let code = [];

  function flushParagraph() {
    const value = normalize(paragraph);
    if (value) {
      const prefix = paragraphIsListItem ? `${'  '.repeat(Math.max(0, listItems.length - 1))}- ` : '';
      output.push(`${prefix}${value}`, '');
    }
    paragraph = '';
    paragraphIndent = -1;
    paragraphIsListItem = false;
  }

  function flushCode() {
    if (code.length) {
      flushParagraph();
      output.push('```javascript', code.join('\n').trim(), '```', '');
    }
    code = [];
    inCode = false;
  }

  for (let index = articleIndex + 1; index < lines.length; index += 1) {
    const line = lines[index];
    const indent = line.match(/^\s*/)[0].length;
    if (line.trim() && indent <= articleIndent) break;

    while (listItems.length && indent <= listItems[listItems.length - 1]) listItems.pop();
    if (/^\s*- listitem(?:\s|\[)/.test(line)) {
      flushParagraph();
      listItems.push(indent);
      paragraphIsListItem = true;
      paragraphIndent = indent;
      continue;
    }

    const heading = line.match(/heading "((?:\\.|[^"\\])*)" \[level=(\d)\]/);
    if (heading) {
      flushCode();
      flushParagraph();
      output.push(`${'#'.repeat(Math.max(2, Number(heading[2])))} ${unquote(`"${heading[1]}"`)}`, '');
      continue;
    }

    const direct = line.match(/^\s*- (?:paragraph|generic|status)(?: \[ref=[^\]]+\])?:\s*(.+)$/);
    if (direct) {
      if (paragraph && indent <= paragraphIndent) flushParagraph();
      paragraph = unquote(direct[1]);
      paragraphIndent = indent;
      paragraphIsListItem = listItems.length > 0;
      continue;
    }

    const text = line.match(/^\s*- text:\s*(.+)$/);
    if (text) {
      paragraph += `${paragraph ? ' ' : ''}${unquote(text[1])}`;
      continue;
    }

    const inlineCode = line.match(/^\s*- code(?: \[ref=[^\]]+\])?:\s*(.+)$/);
    if (inlineCode) {
      const value = unquote(inlineCode[1]);
      if (value.includes('\n') || value.length > 160) {
        flushParagraph();
        inCode = true;
        code.push(value);
      } else if (inCode) {
        code.push(value);
      } else {
        paragraph += `${paragraph ? ' ' : ''}\`${value}\``;
      }
      continue;
    }

    const link = line.match(/^\s*- link "((?:\\.|[^"\\])*)"/);
    if (link) {
      paragraph += `${paragraph ? ' ' : ''}${unquote(`"${link[1]}"`)}`;
      continue;
    }
  }

  flushCode();
  flushParagraph();
  return `${output.join('\n').replace(/\n{3,}/g, '\n\n').trim()}\n`;
}

const [, , inputPath, outputPath] = process.argv;
if (!inputPath || !outputPath) usage();

const markdown = convert(fs.readFileSync(inputPath, 'utf8'));
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, markdown, 'utf8');
console.log(`${outputPath}: ${markdown.length} characters`);