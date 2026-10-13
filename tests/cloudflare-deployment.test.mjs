import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../cf/workers-entry.js';
import download from '../api/download_apk.js';

test('worker serves assets directly without a Pages origin', async () => {
  const req = new Request('https://test.example/');
  const response = await worker.fetch(req, { ASSETS: { fetch: async () => new Response('app') } }, {});
  assert.equal(await response.text(), 'app');
});

test('missing extensionless asset redirects to the hash router', async () => {
  const req = new Request('https://test.example/detail');
  const response = await worker.fetch(req, { ASSETS: { fetch: async () => new Response('', { status: 404 }) } }, {});
  assert.equal(response.status, 302);
  assert.equal(response.headers.get('location'), 'https://test.example/#/detail');
});

test('APK route redirects rather than downloading the binary through the worker', async () => {
  const original = globalThis.fetch;
  const seen = [];
  globalThis.fetch = async url => {
    seen.push(url);
    return new Response(JSON.stringify({ downloadUrl: 'https://github.com/caca1403/cine-pulse/releases/download/v1.1.71/cinepulse.apk' }));
  };
  try {
    let location;
    const res = { setHeader() {}, redirect(code, url) { assert.equal(code, 302); location = url; } };
    await download({}, res);
    assert.equal(seen.length, 1);
    assert.ok(seen[0].startsWith('https://cinepulse.cinepulse.workers.dev/'));
    assert.ok(location.endsWith('/v1.1.71/cinepulse.apk'));
  } finally { globalThis.fetch = original; }
});
