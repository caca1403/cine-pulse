/* #12 uygulama kilidi servisi — state + doğrulama köprüsü davranışları.
   DOM/sahte köprüyle: overlay çizimi test edilmez (saf DOM), karar mantığı edilir. */
import test from 'node:test';
import assert from 'node:assert/strict';

const depo = new Map();
globalThis.window = {};
globalThis.localStorage = {
  getItem: (k) => (depo.has(k) ? depo.get(k) : null),
  setItem: (k, v) => depo.set(k, String(v))
};

const { kilitAcik, kilitAyarla, biometrikHazir, biometrikDogrula } =
  await import('../src/services/kabuk/uygulamaKilidi.js');

test('kilit kapalı varsayılır; kilitAyarla JS+Java köprüsüne bildirir', () => {
  assert.equal(kilitAcik(), false);
  let köprü = null;
  window.CinePulseBiometric = { ayarla: (b) => { köprü = b; }, durum: () => 'hazir' };
  kilitAyarla(true);
  assert.equal(kilitAcik(), true);
  assert.equal(köprü, true);
});

test('biometrikHazir yalnız "hazir" yanıtında true', () => {
  window.CinePulseBiometric = { durum: () => 'yok' };
  assert.equal(biometrikHazir(), false);
  window.CinePulseBiometric = { durum: () => 'hazir' };
  assert.equal(biometrikHazir(), true);
  delete window.CinePulseBiometric;
  assert.equal(biometrikHazir(), false);
});

test('biometrikDogrula köprü olayıyla çözülür ve kanalı geri verir', async () => {
  window.CinePulseBiometric = { dogrula() { setTimeout(() => window.__cpBiometrik(true), 5); } };
  assert.equal(await biometrikDogrula(1000), true);
  assert.equal(window.__cpBiometrik, undefined); // eski kanala geri döndü
});

test('köprü hiç cevap vermezse zaman aşımıyla güvenle kapanır', async () => {
  window.CinePulseBiometric = { dogrula() {} };
  assert.equal(await biometrikDogrula(30), false);
});

test('dogrula köprüsü yoksa beklemeden false', async () => {
  delete window.CinePulseBiometric;
  assert.equal(await biometrikDogrula(1000), false);
});
