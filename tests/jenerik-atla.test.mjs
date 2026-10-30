import test from 'node:test';
import assert from 'node:assert/strict';

/* #1 Jenerik atlama (AniSkip): mutlak bölüm numarası + aralık çözümleme. */

const depolar = { _m: {} };
globalThis.localStorage = {
  getItem(k) { return depolar._m[k] ?? null; },
  setItem(k, v) { depolar._m[k] = String(v); },
  removeItem(k) { delete depolar._m[k]; }
};

const hizmet = await import('../src/services/oynatici/jenerikAtla.js');

function sahteFetch(yanitlar) {
  const cagrilar = [];
  globalThis.fetch = async (url) => {
    cagrilar.push(String(url));
    for (const [desen, veri] of yanitlar) {
      if (String(url).includes(desen)) {
        return { ok: true, json: async () => veri };
      }
    }
    return { ok: 404, json: async () => ({}) };
  };
  return cagrilar;
}

const aniskipCevap = (bas, bit) => ({
  resultCount: 1,
  results: [{ skipType: 'op', similarity: 0.9, interval: { startTime: bas, endTime: bit, skipTime: bit } }]
});

test('mutlakBolum: önceki sezonların bölüm sayıları toplanır', () => {
  const sezonlar = [
    { season_number: 1, episode_count: 12 },
    { season_number: 2, episode_count: 24 }
  ];
  assert.equal(hizmet.mutlakBolum(sezonlar, 2, 3), 15);
  assert.equal(hizmet.mutlakBolum(sezonlar, 1, 5), 5);
  assert.equal(hizmet.mutlakBolum([], 3, 2), 0);
});

test('anidb kaydı olmayan başlık: boş dizi, tekrar TMDB’ye gidilmez', async () => {
  depolar._m = {};
  const cagrilar = sahteFetch([
    ['external_ids', { anidb_id: null }]
  ]);
  const a = await hizmet.jenerikAraliklariBul({ tmdbId: 66332, sezon: 1, bolum: 1 });
  assert.deepEqual(a, []);
  const b = await hizmet.jenerikAraliklariBul({ tmdbId: 66332, sezon: 1, bolum: 1 });
  assert.deepEqual(b, []);
  assert.equal(cagrilar.filter(u => u.includes('external_ids')).length, 1); // negatif önbellek
});

test('aniskip aralıkları çözülür ve önbelleğe alınır', async () => {
  depolar._m = {};
  const cagrilar = sahteFetch([
    ['external_ids', { anidb_id: '4181' }],
    ['skip-times/anidb/4181/15', aniskipCevap(10, 90)]
  ]);
  const sezonlar = [{ season_number: 1, episode_count: 12 }, { season_number: 2, episode_count: 24 }];
  const a = await hizmet.jenerikAraliklariBul({ tmdbId: 1, sezon: 2, bolum: 3, sezonlarListesi: sezonlar });
  assert.equal(a.length, 1);
  assert.equal(a[0].tip, 'op');
  assert.equal(a[0].bas, 10);
  assert.equal(a[0].atla, 90);
  const ikinci = await hizmet.jenerikAraliklariBul({ tmdbId: 1, sezon: 2, bolum: 3, sezonlarListesi: sezonlar });
  assert.equal(ikinci[0].atla, 90);
  assert.equal(cagrilar.filter(u => u.includes('skip-times')).length, 1); // önbellek ikinci çağrıyı ağırlaştırmaz
});

test('mutlak numara boş dönerse sezon-içi numara denenir', async () => {
  depolar._m = {};
  const cagrilar = sahteFetch([
    ['external_ids', { anidb_id: '999' }],
    ['skip-times/anidb/999/15', { resultCount: 0, results: [] }],
    ['skip-times/anidb/999/3', aniskipCevap(5, 80)]
  ]);
  const sezonlar = [{ season_number: 1, episode_count: 12 }, { season_number: 2, episode_count: 24 }];
  const a = await hizmet.jenerikAraliklariBul({ tmdbId: 2, sezon: 2, bolum: 3, sezonlarListesi: sezonlar });
  assert.equal(a.length, 1);
  assert.equal(a[0].bas, 5);
  assert.equal(cagrilar.filter(u => u.includes('skip-times')).length, 2);
});
