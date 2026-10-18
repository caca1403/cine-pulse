/* ==========================================================================
   "Çünkü bunu izledin" kişisel satır çekirdeği birim testleri
   --------------------------------------------------------------------------
   Çalıştır: node --test tests/personal-rails.test.mjs
   Ağ yok, DOM yok: depo enjekte (bellek-içi sahte), girdiler fixture.
   ========================================================================== */
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  KISISSEL_RAIL_TTL_MS,
  KISISSEL_SATIR_TIPI,
  tohumSec,
  onbellekAnahtari,
  onKartlar,
  cacheOku,
  cacheYaz,
  satirBasligi
} from '../src/services/icerik/personalRails.js';

function sahteDepo(ilk = {}) {
  const harita = new Map(Object.entries(ilk));
  return {
    getItem: (k) => (harita.has(k) ? harita.get(k) : null),
    setItem: (k, v) => { harita.set(k, String(v)); },
    removeItem: (k) => { harita.delete(k); },
    _harita: harita
  };
}

const GECMIS = [
  { id: 101, title: 'Son Dizi', type: 'tv', lastWatchedAt: 3000 },
  { id: 202, title: 'Eski Film', type: 'movie', lastWatchedAt: 2000 },
  { id: 303, title: 'Daha Eski', type: 'tv', lastWatchedAt: 1000 }
];

// ----------------------------------------------------------------
// 1. Tohum seçimi: en son izlenen 2 farklı yapım
// ----------------------------------------------------------------
test('1) tohumSec: en son 2 farklı tohumu sırayla döner (tur+tmdbId+ad)', () => {
  const tohumlar = tohumSec(GECMIS, []);
  assert.equal(tohumlar.length, 2);
  assert.deepEqual(tohumlar[0], { tur: 'tv', tmdbId: 101, ad: 'Son Dizi' });
  assert.deepEqual(tohumlar[1], { tur: 'movie', tmdbId: 202, ad: 'Eski Film' });
});

test('2) tohumSec: maks seçeneği tohum sayısını sınırlar', () => {
  assert.equal(tohumSec(GECMIS, [], { maks: 1 }).length, 1);
  assert.equal(tohumSec(GECMIS, [], { maks: 5 }).length, 3);
});

// ----------------------------------------------------------------
// 2. Aynı yapım tek sayılır; idsiz/adsız kayıtlar atlanır
// ----------------------------------------------------------------
test('3) tohumSec: aynı id tekrar sayılmaz, idsiz/adsız atlanır', () => {
  const karisik = [
    { id: 101, title: 'Son Dizi', type: 'tv', lastWatchedAt: 3000 },
    { id: 101, season: 1, episode: 5, title: 'Son Dizi', type: 'tv', lastWatchedAt: 2500 },
    { title: 'Idsiz', type: 'tv' },
    { id: 404, title: '   ', type: 'movie' },
    null,
    { id: 202, name: 'Ad name alanından', type: 'movie', lastWatchedAt: 1000 }
  ];
  const tohumlar = tohumSec(karisik, []);
  assert.equal(tohumlar.length, 2);
  assert.equal(tohumlar[0].tmdbId, 101);
  assert.equal(tohumlar[1].ad, 'Ad name alanından');
});

// ----------------------------------------------------------------
// 3. Geçmiş yetmezse favorilerle doldur; ikisi de boşsa []
// ----------------------------------------------------------------
test('4) tohumSec: geçmiş tek ise ikinci tohum favoriden gelir', () => {
  const tohumlar = tohumSec(
    [{ id: 101, title: 'Tek İzlenen', type: 'tv' }],
    [{ id: 909, title: 'Favori Film', type: 'movie' }]
  );
  assert.equal(tohumlar.length, 2);
  assert.equal(tohumlar[1].tmdbId, 909);
});

test('5) tohumSec: boş profil (geçmiş+favori boş) → [] (ev bugünkü gibi kalır)', () => {
  assert.deepEqual(tohumSec([], []), []);
  assert.deepEqual(tohumSec(null, undefined), []);
});

// ----------------------------------------------------------------
// 4. Tür indirgeme: anime → tv (TMDB recommendations ucu tv|movie ister)
// ----------------------------------------------------------------
test('6) tohumSec: anime türü tv olarak indirgenir', () => {
  const tohumlar = tohumSec([{ id: 555, title: 'Bir Anime', type: 'anime' }], []);
  assert.equal(tohumlar[0].tur, 'tv');
  const film = tohumSec([{ id: 556, title: 'Bir Film', media_type: 'movie' }], []);
  assert.equal(film[0].tur, 'movie');
});

// ----------------------------------------------------------------
// 5. Önbellek anahtarı şeması
// ----------------------------------------------------------------
test('7) onbellekAnahtari şeması: cinepulse_kisisel_{tip}_{tur}_{id}', () => {
  const anahtar = onbellekAnahtari('cunku-izledin', { tur: 'tv', tmdbId: 101 });
  assert.equal(anahtar, 'cinepulse_kisisel_cunku-izledin_tv_101');
  assert.equal(onKartlar('cunku-izledin', { tur: 'movie', tmdbId: 202 }),
    'cinepulse_kisisel_cunku-izledin_movie_202');
  assert.ok(onbellekAnahtari(KISISSEL_SATIR_TIPI, { tur: 'tv', tmdbId: 7 })
    .startsWith('cinepulse_kisisel_'));
});

// ----------------------------------------------------------------
// 6. cacheYaz → cacheOku turu; TTL 6 saat; süresi dolmuş null
// ----------------------------------------------------------------
test('8) cache turu: yazılan liste aynı saatte okunur', () => {
  const depo = sahteDepo();
  const anahtar = 'cinepulse_kisisel_cunku-izledin_tv_101';
  const liste = [{ id: 1, title: 'A' }, { id: 2, title: 'B' }];
  assert.equal(cacheYaz(depo, anahtar, liste, () => 1000), true);
  assert.deepEqual(cacheOku(depo, anahtar, () => 1000 + 60_000), liste);
});

test('9) TTL: 6 saat sabiti ve sınır davranışı', () => {
  assert.equal(KISISSEL_RAIL_TTL_MS, 6 * 3600 * 1000);
  const depo = sahteDepo();
  const anahtar = 'k';
  cacheYaz(depo, anahtar, [{ id: 1 }], () => 0);
  assert.ok(cacheOku(depo, anahtar, () => KISISSEL_RAIL_TTL_MS) !== null);
  assert.equal(cacheOku(depo, anahtar, () => KISISSEL_RAIL_TTL_MS + 1), null);
});

// ----------------------------------------------------------------
// 7. Bozuk JSON / eksik alan toleransı: atma yok, null/false
// ----------------------------------------------------------------
test('10) cacheOku: bozuk JSON, boş depo, eksik alan → null (atmaz)', () => {
  const depo = sahteDepo({
    bozuk: '{bu json degil',
    eksik: JSON.stringify({ veri: [{ id: 1 }] }),
    bosliste: JSON.stringify({ savedAt: 1000, veri: [] })
  });
  assert.equal(cacheOku(depo, 'bozuk', () => 1000), null);
  assert.equal(cacheOku(depo, 'yok-boyle-anahtar', () => 1000), null);
  assert.equal(cacheOku(depo, 'eksik', () => 1000), null);
  assert.equal(cacheOku(depo, 'bosliste', () => 1000), null);
  assert.equal(cacheOku(null, 'k', () => 0), null);
  assert.equal(cacheYaz(sahteDepo(), 'k', [], () => 0), false);
  assert.equal(cacheYaz(null, 'k', [{ id: 1 }], () => 0), false);
});

// ----------------------------------------------------------------
// 8. Satır başlığı gerekçesi
// ----------------------------------------------------------------
test('11) satirBasligi: "Çünkü {ad} izledin", adsızda genel başlık', () => {
  assert.equal(satirBasligi('Son Dizi'), 'Çünkü Son Dizi izledin');
  assert.equal(satirBasligi('  '), 'Çünkü bunu izledin');
  assert.equal(satirBasligi(null), 'Çünkü bunu izledin');
});
