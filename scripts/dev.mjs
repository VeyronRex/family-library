// A small preview server for your own computer.
//
//   npm run dev
//
// It builds the site, shows it at http://localhost:4321, and rebuilds and
// refreshes the browser by itself every time you save a file.
// Posts marked  draft: true  are shown here, but not on the real website.

import { spawn } from 'node:child_process';
import { createReadStream, existsSync, statSync, watch } from 'node:fs';
import http from 'node:http';
import path from 'node:path';

import { DEFAULT_OUT, ROOT } from './lib/paths.mjs';

const PORT = Number(process.env.PORT) || 4321;
const OUT = DEFAULT_OUT;

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.mp4': 'video/mp4',
};

const listeners = new Set();
let building = false;
let again = false;

function rebuild() {
  if (building) {
    again = true;
    return;
  }
  building = true;
  const child = spawn(process.execPath, [path.join(ROOT, 'scripts', 'build.mjs'), '--drafts', `--out=${OUT}`], {
    stdio: 'inherit',
    env: { ...process.env, SITE_BASE: '/' },
  });
  child.on('exit', (code) => {
    building = false;
    if (code === 0) for (const send of listeners) send();
    if (again) {
      again = false;
      rebuild();
    }
  });
}

let timer;
for (const folder of ['content', 'config', 'public', 'scripts']) {
  watch(path.join(ROOT, folder), { recursive: true }, () => {
    clearTimeout(timer);
    timer = setTimeout(rebuild, 150);
  });
}

const RELOAD_SNIPPET = `<script>new EventSource('/__reload').onmessage=()=>location.reload()</script>`;

function resolveFile(urlPath) {
  const clean = path.normalize(decodeURIComponent(urlPath.split('?')[0])).replace(/^(\.\.[/\\])+/, '');
  let file = path.join(OUT, clean);
  if (!file.startsWith(OUT)) return null;
  if (existsSync(file) && statSync(file).isDirectory()) file = path.join(file, 'index.html');
  return existsSync(file) && statSync(file).isFile() ? file : null;
}

http
  .createServer((req, res) => {
    if (req.url === '/__reload') {
      res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
      const send = () => res.write('data: reload\n\n');
      listeners.add(send);
      req.on('close', () => listeners.delete(send));
      return;
    }

    let status = 200;
    let file = resolveFile(req.url);
    if (!file) {
      status = 404;
      file = resolveFile('/404.html');
    }
    if (!file) {
      res.writeHead(503, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('The site is still being built. This page will refresh by itself.');
      return;
    }

    const type = TYPES[path.extname(file).toLowerCase()] ?? 'application/octet-stream';
    res.writeHead(status, { 'Content-Type': type, 'Cache-Control': 'no-store' });
    if (type.startsWith('text/html')) {
      import('node:fs').then(({ readFileSync }) => {
        res.end(readFileSync(file, 'utf8').replace('</body>', `${RELOAD_SNIPPET}</body>`));
      });
    } else {
      createReadStream(file).pipe(res);
    }
  })
  .listen(PORT, () => {
    console.log(`\nYour library is open at  http://localhost:${PORT}\nPress Ctrl+C to stop.\n`);
  });

rebuild();
