#!/usr/bin/env node

const fs = require('fs');
const http = require('http');
const path = require('path');

const outputDirectory = path.resolve(process.argv[2] || 'docs/app-xchange-help-markdown');
const port = Number(process.argv[3] || 43127);
fs.mkdirSync(outputDirectory, { recursive: true });

const server = http.createServer((request, response) => {
  if (request.method !== 'POST' || request.url !== '/capture') {
    response.writeHead(404).end();
    return;
  }

  let body = '';
  request.setEncoding('utf8');
  request.on('data', (chunk) => {
    body += chunk;
    if (body.length > 5 * 1024 * 1024) request.destroy();
  });
  request.on('end', () => {
    try {
      const capture = JSON.parse(body);
      const name = path.basename(capture.name || '');
      if (!name.endsWith('.md') || typeof capture.markdown !== 'string') {
        throw new Error('Invalid capture payload.');
      }
      fs.writeFileSync(path.join(outputDirectory, name), capture.markdown, 'utf8');
      response.writeHead(200, { 'content-type': 'application/json' });
      response.end(JSON.stringify({ saved: name, characters: capture.markdown.length }));
    } catch (error) {
      response.writeHead(400, { 'content-type': 'application/json' });
      response.end(JSON.stringify({ error: error.message }));
    }
  });
});

server.listen(port, '127.0.0.1', () => {
  console.log(`Markdown capture server listening on http://127.0.0.1:${port}`);
});