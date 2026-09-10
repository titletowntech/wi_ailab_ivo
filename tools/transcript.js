'use strict';

const zlib = require('zlib');

const ENTITIES = new Map([['amp', '&'], ['lt', '<'], ['gt', '>'], ['quot', '"'], ['apos', "'"], ['nbsp', ' ']]);

function decodeEntities(value) {
  return value.replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (match, code) => {
    if (code[0] === '#') {
      const point = code[1] === 'x' || code[1] === 'X' ? parseInt(code.slice(2), 16) : Number(code.slice(1));
      return Number.isFinite(point) && point > 0 ? String.fromCodePoint(point) : match;
    }
    return ENTITIES.get(code.toLowerCase()) ?? match;
  });
}

function collapseBlankLines(value) {
  return value.replace(/[ \t]+$/gm, '').replace(/\n{3,}/g, '\n\n').trim();
}

// A .docx is a ZIP archive; the document text lives in word/document.xml. Read the archive
// directly so the project keeps its no-dependency rule.
function readZipEntry(buffer, wanted) {
  const END_SIGNATURE = 0x06054b50;
  let end = -1;
  for (let offset = buffer.length - 22; offset >= 0 && end < 0; offset -= 1) {
    if (buffer.readUInt32LE(offset) === END_SIGNATURE) end = offset;
  }
  if (end < 0) throw new Error('That file is not a readable Word document.');
  const total = buffer.readUInt16LE(end + 10);
  let pointer = buffer.readUInt32LE(end + 16);
  for (let index = 0; index < total; index += 1) {
    if (pointer + 46 > buffer.length || buffer.readUInt32LE(pointer) !== 0x02014b50) break;
    const method = buffer.readUInt16LE(pointer + 10);
    const compressedSize = buffer.readUInt32LE(pointer + 20);
    const nameLength = buffer.readUInt16LE(pointer + 28);
    const extraLength = buffer.readUInt16LE(pointer + 30);
    const commentLength = buffer.readUInt16LE(pointer + 32);
    const localOffset = buffer.readUInt32LE(pointer + 42);
    const name = buffer.toString('utf8', pointer + 46, pointer + 46 + nameLength);
    if (name === wanted) {
      if (buffer.readUInt32LE(localOffset) !== 0x04034b50) throw new Error('That Word document is damaged.');
      const localNameLength = buffer.readUInt16LE(localOffset + 26);
      const localExtraLength = buffer.readUInt16LE(localOffset + 28);
      const start = localOffset + 30 + localNameLength + localExtraLength;
      const data = buffer.subarray(start, start + compressedSize);
      if (method === 0) return data;
      if (method === 8) return zlib.inflateRawSync(data);
      throw new Error('That Word document uses an unsupported compression method.');
    }
    pointer += 46 + nameLength + extraLength + commentLength;
  }
  throw new Error('That file does not contain Word document text.');
}

function docxText(buffer) {
  const xml = readZipEntry(buffer, 'word/document.xml').toString('utf8');
  const text = xml
    .replace(/<w:tab\b[^>]*\/?>/g, '\t')
    .replace(/<w:br\b[^>]*\/?>/g, '\n')
    .replace(/<\/w:p>/g, '\n')
    .replace(/<[^>]+>/g, '');
  return collapseBlankLines(decodeEntities(text));
}

// WebVTT and SubRip carry one caption per cue. Drop cue numbers and timing lines, keep the
// speaker when the cue declares one, and collapse the repeats rolling captions produce.
function captionText(raw) {
  const lines = raw.replace(/^﻿/, '').split(/\r?\n/);
  const kept = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (/^WEBVTT/i.test(trimmed) || /^(NOTE|STYLE|REGION)\b/i.test(trimmed)) continue;
    if (trimmed.includes('-->') || /^\d+$/.test(trimmed)) continue;
    const speaker = trimmed.match(/^<v\s+([^>]+)>(.*?)(?:<\/v>)?$/i);
    const text = decodeEntities(speaker ? `${speaker[1].trim()}: ${speaker[2].trim()}` : trimmed.replace(/<[^>]+>/g, ''));
    if (text && text !== kept[kept.length - 1]) kept.push(text);
  }
  return collapseBlankLines(kept.join('\n'));
}

const EXTENSIONS = ['.txt', '.md', '.vtt', '.srt', '.docx'];

function extractText(name, buffer) {
  if (!Buffer.isBuffer(buffer) || !buffer.length) throw new Error('That file is empty.');
  const extension = String(name || '').toLowerCase().match(/\.[a-z0-9]+$/)?.[0];
  if (!EXTENSIONS.includes(extension)) {
    throw new Error(`Choose a ${EXTENSIONS.join(', ')} file.`);
  }
  if (extension === '.docx') return docxText(buffer);
  const raw = buffer.toString('utf8');
  if (extension === '.vtt' || extension === '.srt') return captionText(raw);
  return collapseBlankLines(raw.replace(/^﻿/, ''));
}

module.exports = { extractText, EXTENSIONS };
