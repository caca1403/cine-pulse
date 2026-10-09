const { test } = require('node:test');
const assert = require('node:assert/strict');
const { EventEmitter } = require('node:events');
const { Readable } = require('node:stream');
const { fetchUpdateManifest } = require('../electron/updateManifest.cjs');

function transport(routes, visited) {
  return { get(url, options, callback) {
    visited.push(url);
    const request = new EventEmitter();
    request.destroy = () => {};
    const route = routes[url];
    if (route) queueMicrotask(() => {
      const response = Readable.from([route.body || '']);
      response.statusCode = route.status || 200;
      response.headers = route.location ? { location: route.location } : {};
      callback(response);
    });
    return request;
  } };
}

test('follows latest-release and asset redirects to the manifest', async () => {
  const visited = [];
  const routes = {
    'https://github.test/latest': { status: 302, location: '/v2/version.json' },
    'https://github.test/v2/version.json': { status: 302, location: 'https://assets.test/file' },
    'https://assets.test/file': { body: '{"versionCode":162,"windowsSetupUrl":"https://assets.test/setup.exe"}' }
  };
  const manifest = await fetchUpdateManifest('https://github.test/latest', { transport: transport(routes, visited) });
  assert.equal(manifest.versionCode, 162);
  assert.equal(visited.length, 3);
});

test('rejects insecure redirects and failed responses', async () => {
  for (const route of [{ status: 302, location: 'http://assets.test/file' }, { status: 404, body: '{"versionCode":162}' }]) {
    assert.equal(await fetchUpdateManifest('https://github.test/latest', {
      transport: transport({ 'https://github.test/latest': route }, [])
    }), null);
  }
});

test('enforces a deadline when a request never responds', async () => {
  assert.equal(await fetchUpdateManifest('https://github.test/latest', { timeout: 20, transport: transport({}, []) }), null);
});
