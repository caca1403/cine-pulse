import test from 'node:test';
import assert from 'node:assert/strict';
import { installAndroidTransport } from '../src/services/platform/androidTransport.js';

test('upstream signature and authorization survive without a forbidden browser preflight', async () => {
  const previous = globalThis.window;
  const calls = [];
  const origin = 'http://127.0.0.1:42000/device-token';
  globalThis.window = {
    location: { href: 'https://localhost/', origin: 'https://localhost' },
    CinePulseNative: { getApiOrigin: () => origin },
    fetch: async (url, options) => { calls.push({ url, options }); return new Response('#EXTM3U'); }
  };
  try {
    installAndroidTransport();
    await window.fetch('https://media.example/master.txt', {
      headers: { 'X-Sp': 'signature-proof', Authorization: 'test-token', Referer: 'https://provider.example/', Range: 'bytes=0-100' }
    });
    const call = calls[0], query = new URL(call.url);
    assert.equal(query.origin, 'http://127.0.0.1:42000');
    assert.equal(query.searchParams.get('url'), 'https://media.example/master.txt');
    const forwarded = JSON.parse(query.searchParams.get('headers'));
    assert.equal(forwarded['x-sp'], 'signature-proof');
    assert.equal(forwarded.authorization, 'test-token');
    assert.equal(forwarded.referer, 'https://provider.example/');
    assert.deepEqual(call.options.headers, { range: 'bytes=0-100' });
  } finally { globalThis.window = previous; }
});
