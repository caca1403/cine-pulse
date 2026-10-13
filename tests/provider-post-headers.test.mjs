import test from 'node:test';
import assert from 'node:assert/strict';
import { akilliPost } from '../src/services/nativeHttp.js';

test('provider POST keeps custom authentication, UA and content type', async () => {
  const original = globalThis.fetch;
  let request;
  globalThis.fetch = async (url, options) => {
    request = { url, ...options };
    return new Response('{"success":true}', { status: 200 });
  };
  try {
    const body = await akilliPost('https://provider.example/api', 'signed-body', {
      ref: 'https://provider.example/player',
      headers: { 'User-Agent': 'okhttp/4.9.2', Authorization: 'test-token', 'Content-Type': 'application/json' },
    });
    assert.equal(body, '{"success":true}');
    assert.equal(request.method, 'POST');
    assert.equal(request.body, 'signed-body');
    assert.equal(request.headers.Authorization, 'test-token');
    assert.equal(request.headers['User-Agent'], 'okhttp/4.9.2');
    assert.equal(request.headers['Content-Type'], 'application/json');
    assert.equal(request.headers.Referer, 'https://provider.example/player');
  } finally { globalThis.fetch = original; }
});
