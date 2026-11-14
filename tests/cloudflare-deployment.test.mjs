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

test('APK route streams the binary through the worker (GitHub engelli aglarda calisir)', async () => {
  const original = globalThis.fetch;
  const seen = [];
  globalThis.fetch = async (url, init) => {
    seen.push(String(url));
    if (String(url).includes('api.github.com')) {
      return new Response(JSON.stringify({
        assets: [{ name: 'cinepulse.apk', browser_download_url: 'https://github.com/caca1403/cine-pulse/releases/download/v1.1.71/cinepulse.apk' }],
      }));
    }
    assert.ok(String(url).endsWith('/releases/download/v1.1.71/cinepulse.apk'), 'asset URL cözülmeli');
    return new Response('APKBYTES', {
      headers: { 'content-type': 'application/vnd.android.package-archive', 'content-length': '8' },
    });
  };
  try {
    const yazilan = [];
    let bitti = false;
    const res = {
      setHeader() {}, write(c) { yazilan.push(c); return true; },
      end() { bitti = true; },
      redirect() { throw new Error('akis 302ye donmemeli'); },
    };
    await download({}, res);
    assert.ok(bitti);
    assert.equal(Buffer.concat(yazilan.map(Buffer.from)).toString(), 'APKBYTES');
    assert.equal(seen.length, 2);
  } finally { globalThis.fetch = original; }
});
