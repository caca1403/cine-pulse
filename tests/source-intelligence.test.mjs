import test from 'node:test';
import assert from 'node:assert/strict';

const depo = new Map();
globalThis.localStorage = {
  getItem: (k) => (depo.has(k) ? depo.get(k) : null),
  setItem: (k, v) => depo.set(k, String(v)),
  removeItem: (k) => depo.delete(k),
};

const { zekaKaydet, zekaGuven, zekaCeza, zekaOzeti } = await import('../src/services/sourceIntelligence.js');

test('bilinmeyen aile tarafsız başlar ve keşif cezası ödemez', () => {
  assert.equal(zekaGuven('YeniAile'), 0.5);
  assert.equal(zekaCeza('YeniAile'), 0);
});

test('oynatan aile yükselir, oynatmayan aile ceza alır', () => {
  for (let i = 0; i < 5; i++) zekaKaydet({ aile: 'IyiAile', olay: 'oynadi' });
  for (let i = 0; i < 5; i++) zekaKaydet({ aile: 'KotuAile', olay: 'hata' });
  assert.ok(zekaGuven('IyiAile') > 0.8, `iyi güven: ${zekaGuven('IyiAile')}`);
  assert.ok(zekaGuven('KotuAile') < 0.3, `kötü güven: ${zekaGuven('KotuAile')}`);
  assert.equal(zekaCeza('IyiAile'), 0);
  assert.ok(zekaCeza('KotuAile') >= 4, `kötü ceza: ${zekaCeza('KotuAile')}`);
});

test('az denenmiş aile keşif bonusu alır (negatif ceza)', () => {
  zekaKaydet({ aile: 'AzDenenmis', olay: 'oynadi' });
  assert.ok(zekaCeza('AzDenenmis') <= 0, `keşif bonusu: ${zekaCeza('AzDenenmis')}`);
});

test('yavaş çözülme gecikme cezası ekler', () => {
  zekaKaydet({ aile: 'YavasAile', olay: 'oynadi', ms: 1200 });
  zekaKaydet({ aile: 'HizliAile', olay: 'oynadi', ms: 80 });
  assert.ok(zekaCeza('YavasAile') >= zekaCeza('HizliAile'));
});

test('boş sonuç oynatma hatasından daha hafif cezalandırılır', () => {
  zekaKaydet({ aile: 'BosAile', olay: 'bos' });
  zekaKaydet({ aile: 'OluAile', olay: 'hata' });
  assert.ok(zekaCeza('OluAile') > zekaCeza('BosAile'));
});

test('özet teşhis verisi üretir', () => {
  const ozet = zekaOzeti();
  assert.ok(ozet.some((k) => k.aile === 'IyiAile'));
  assert.ok(ozet.every((k) => typeof k.ceza === 'number' && typeof k.guven === 'number'));
});
