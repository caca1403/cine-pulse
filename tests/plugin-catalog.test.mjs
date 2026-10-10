import test from 'node:test';
import assert from 'node:assert/strict';
import { PLUGIN_DEFS, getPluginState, isPluginEnabled, setPluginEnabled, listPlugins, resetPluginCache } from '../src/services/pluginCatalog.js';

test('tum eklentiler varsayilan acik gelir', () => {
  resetPluginCache();
  const s = getPluginState();
  assert.equal(Object.keys(s).length, PLUGIN_DEFS.length);
  assert.ok(Object.values(s).every((v) => v === true));
  assert.equal(isPluginEnabled('hdfc'), true);
  assert.equal(isPluginEnabled('bilinmeyen-id'), true);
});

test('kapatilan eklenti listede kapali gorunur ve taramayi atlar', async () => {
  resetPluginCache();
  assert.equal(await setPluginEnabled('szd', false), true);
  assert.equal(isPluginEnabled('szd'), false);
  const row = listPlugins().find((p) => p.id === 'szd');
  assert.equal(row.enabled, false);
  assert.equal(await setPluginEnabled('szd', true), true);
  assert.equal(isPluginEnabled('szd'), true);
});

test('bilinmeyen eklenti reddedilir', async () => {
  assert.equal(await setPluginEnabled('yok-boyle', false), false);
});
