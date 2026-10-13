import test from 'node:test';
import assert from 'node:assert/strict';
import { PLUGIN_DEFS, getPluginState, isPluginEnabled, setPluginEnabled, listPlugins, resetPluginCache } from '../src/services/pluginCatalog.js';

test('eklentiler varsayilan acik gelir; yalnizca kapali-isaretli olanlar kapali', () => {
  resetPluginCache();
  const s = getPluginState();
  assert.equal(Object.keys(s).length, PLUGIN_DEFS.length);
  // Kural: liste kirlenmesin diye yanıt vermeyen sağlayıcı `kapali: true` ile
  // doğar (örn. setf/Vega ölü yayın üretiyordu, snx/Sinewix imza istiyor,
  // szd/Luna reCAPTCHA, tvr/Polaris bad_sig). Diğerleri varsayılan AÇIK.
  const kapaliIdler = PLUGIN_DEFS.filter((d) => d.kapali === true).map((d) => d.id);
  for (const def of PLUGIN_DEFS) {
    assert.equal(s[def.id], def.kapali !== true, `${def.id} varsayılanı yanlış`);
  }
  assert.ok(kapaliIdler.length < PLUGIN_DEFS.length, 'herkes kapali olamaz');
  assert.ok(!PLUGIN_DEFS.some((d) => d.id === 'setf'), 'Vega katalogdan tamamen kaldırılmış olmalı');
  assert.ok(isPluginEnabled('hdfc'), 'Orion açık olmalı');
  assert.equal(isPluginEnabled('bilinmeyen-id'), true);
});

test('kapatilan eklenti listede kapali gorunur ve taramayi atlar', async () => {
  resetPluginCache();
  // Büyük temizlik sonrası szd (Luna) kayıtlardan silindi; kapatma/açma
  // testi hâlâ katalogda olan bir sağlayıcı (dzs / Atlas) üzerinden yapılıyor.
  assert.equal(await setPluginEnabled('dzs', false), true);
  assert.equal(isPluginEnabled('dzs'), false);
  const row = listPlugins().find((p) => p.id === 'dzs');
  assert.equal(row.enabled, false);
  assert.equal(await setPluginEnabled('dzs', true), true);
  assert.equal(isPluginEnabled('dzs'), true);
});

test('bilinmeyen eklenti reddedilir', async () => {
  assert.equal(await setPluginEnabled('yok-boyle', false), false);
});
