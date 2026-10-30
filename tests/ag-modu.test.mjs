import test from 'node:test';
import assert from 'node:assert/strict';

/* #8: ağ modu geçersiz kılma — agHizi.js saf mantık kısmı. */

globalThis.localStorage = { _m: {}, getItem(k) { return this._m[k] ?? null; }, setItem(k, v) { this._m[k] = String(v); } };
globalThis.window = {};

const { agModu, yavasAgMi, agModunuUygula } = await import('../src/services/kabuk/agHizi.js');

test('varsayılan mod: oto', () => {
  assert.equal(agModu(), 'oto');
});

test('yavas seçilirse yavaş mod zorla açılır (ölçüm olmadan)', () => {
  globalThis.window.__cpYavasAg = false; // otomatik ölçüm "hızlı" dedi
  localStorage.setItem('cp_ag_modu', 'yavas');
  assert.equal(yavasAgMi(), true);
});

test('normal seçilirse otomatik yavaş ölçümü ezilir', () => {
  globalThis.window.__cpYavasAg = true; // otomatik ölçüm "yavaş" dedi
  localStorage.setItem('cp_ag_modu', 'normal');
  assert.equal(yavasAgMi(), false);
});

test('agModunuUygula: bayrak anında yazılır (vekil.js window bayrağını okur)', () => {
  localStorage.setItem('cp_ag_modu', 'yavas');
  agModunuUygula();
  assert.equal(globalThis.window.__cpYavasAg, true);
  localStorage.setItem('cp_ag_modu', 'normal');
  agModunuUygula();
  assert.equal(globalThis.window.__cpYavasAg, false);
});

test('oto modu ölçülen bayrağa karışmaz', () => {
  localStorage.setItem('cp_ag_modu', 'oto');
  globalThis.window.__cpYavasAg = true;
  assert.equal(yavasAgMi(), true);
});
