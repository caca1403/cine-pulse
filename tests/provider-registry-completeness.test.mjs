import test from 'node:test';
import assert from 'node:assert/strict';
import { readdir } from 'node:fs/promises';
import { KAYIT } from '../src/providers/index.js';
import { listProviderDefinitions } from '../src/services/providerRuntime/inventory.js';

test('every hand-written provider file is loadable and registered exactly once', async () => {
  const helpers = new Set(['index.js', 'kit.js', '_template.js']);
  const files = (await readdir(new URL('../src/providers/', import.meta.url))).filter(f => f.endsWith('.js') && !helpers.has(f));
  const expectedIds = [];
  for (const file of files) {
    const mod = await import(new URL(`../src/providers/${file}`, import.meta.url));
    assert.ok(mod.kimlik?.id, `${file}: missing identity`);
    assert.equal(typeof mod.coz, 'function', `${file}: missing resolver`);
    assert.equal(typeof mod.default?.resolve, 'function', `${file}: missing runtime adapter`);
    assert.ok(Array.isArray(mod.kimlik.mediaTypes) && mod.kimlik.mediaTypes.length, `${file}: missing media types`);
    assert.ok(KAYIT[mod.kimlik.id], `${file}: not registered`);
    assert.equal((await KAYIT[mod.kimlik.id]()).coz, mod.coz, `${file}: wrong registry slot`);
    expectedIds.push(mod.kimlik.id);
  }
  assert.equal(new Set(expectedIds).size, files.length, 'duplicate identity');
  assert.deepEqual(Object.keys(KAYIT).sort(), expectedIds.sort());
  const runtimeIds = listProviderDefinitions().map(p => p.id);
  for (const id of expectedIds) assert.equal(runtimeIds.filter(x => x === id).length, 1, `${id}: runtime missing or duplicated`);
});
