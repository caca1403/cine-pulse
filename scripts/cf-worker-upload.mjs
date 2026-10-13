import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { build } from 'esbuild';

const token = process.env.CF_TOKEN;
const account = process.env.CF_ACCOUNT;
if (!token || !account) throw new Error('CF_TOKEN and CF_ACCOUNT required');
const api = `https://api.cloudflare.com/client/v4/accounts/${account}/workers`;
const bundle = await build({
  entryPoints: ['cf/workers-entry.js'], bundle: true, format: 'esm', platform: 'browser',
  target: 'esnext', external: ['stream', 'node:*', 'util', 'zlib'], minify: true, write: false,
});
async function call(url, init, auth = token) {
  const r = await fetch(url, { ...init, headers: { ...init.headers, Authorization: `Bearer ${auth}` } });
  const j = await r.json();
  if (!r.ok || j.success === false) throw new Error(JSON.stringify(j.errors));
  return j.result;
}
const manifest = {};
const files = new Map();
async function walk(dir) {
  for (const ent of await fs.readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) { await walk(full); continue; }
    if (['_worker.js', '_routes.json', '_headers'].includes(ent.name)) continue;
    const data = await fs.readFile(full);
    const ext = path.extname(full).slice(1);
    const hash = crypto.createHash('sha256').update(data.toString('base64') + ext).digest('hex').slice(0, 32);
    manifest['/' + path.relative('dist', full).split(path.sep).join('/')] = { hash, size: data.length };
    files.set(hash, { data, ext });
  }
}
await walk('dist');
const session = await call(`${api}/scripts/cinepulse/assets-upload-session`, {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ manifest }),
});
let completion = session.buckets.length ? null : session.jwt;
const types = { html: 'text/html', js: 'application/javascript', css: 'text/css', json: 'application/json', svg: 'image/svg+xml', png: 'image/png', jpg: 'image/jpeg', ico: 'image/x-icon', webp: 'image/webp' };
for (const bucket of session.buckets) {
  const form = new FormData();
  for (const hash of bucket) {
    const { data, ext } = files.get(hash);
    form.append(hash, new Blob([data.toString('base64')], { type: types[ext] || 'application/octet-stream' }), hash);
  }
  const result = await call(`${api}/assets/upload?base64=true`, { method: 'POST', body: form }, session.jwt);
  if (result.jwt) completion = result.jwt;
  console.log('Asset bucket uploaded:', bucket.length);
}
if (!completion) throw new Error('Missing completion JWT');
const form = new FormData();
form.append('metadata', JSON.stringify({
  main_module: 'index.mjs', compatibility_date: '2025-10-01', compatibility_flags: ['nodejs_compat'],
  assets: { jwt: completion }, bindings: [{ name: 'ASSETS', type: 'assets' }],
  keep_bindings: ['secret_text', 'plain_text'],
}));
form.append('index.mjs', new Blob([bundle.outputFiles[0].contents], { type: 'application/javascript+module' }), 'index.mjs');
await call(`${api}/scripts/cinepulse`, { method: 'PUT', body: form });
console.log('Worker and static assets deployed');
