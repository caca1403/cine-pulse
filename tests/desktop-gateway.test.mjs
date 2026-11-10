import assert from 'node:assert/strict';
import test from 'node:test';
import { apiUrl } from '../src/services/altyapi/apiOrigin.js';

test('desktop API URLs use the per-process gateway and token', () => {
  const previousWindow = globalThis.window;
  globalThis.window = {
    CinePulseDesktop: {
      isDesktop: true,
      getApiConfig: () => ({ origin: 'http://127.0.0.1:49123', token: 'test-token' })
    }
  };

  try {
    const url = new URL(apiUrl('/api/hls_proxy?url=https%3A%2F%2Fexample.com%2Findex.m3u8'));
    assert.equal(url.origin, 'http://127.0.0.1:49123');
    assert.equal(url.pathname, '/api/hls_proxy');
    assert.equal(url.searchParams.get('url'), 'https://example.com/index.m3u8');
    assert.equal(url.searchParams.get('__cp_token'), 'test-token');
    assert.equal(apiUrl(''), 'http://127.0.0.1:49123');
    assert.equal(apiUrl('https://example.com/watch'), 'https://example.com/watch');
  } finally {
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
  }
});

test('desktop API calls fail explicitly before the gateway is ready', () => {
  const previousWindow = globalThis.window;
  globalThis.window = {
    CinePulseDesktop: {
      isDesktop: true,
      getApiConfig: () => null
    }
  };

  try {
    assert.throws(() => apiUrl('/api/health'), /ağ geçidi hazır değil/);
  } finally {
    if (previousWindow === undefined) delete globalThis.window;
    else globalThis.window = previousWindow;
  }
});
