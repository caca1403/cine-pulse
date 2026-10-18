/* IMDb puanı istemcisi testleri — ağ yok (fetch vekilleştirilir).
   Kural: arayüz IMDb verisinin durumuna bağlı kalamaz; hata halinde boş döner,
   ağ hatası "puan yok" olarak önbelleğe YAZILMAZ. */
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  puanAyikla,
  puanMetni,
  onbellegeGoreAyir,
  imdbPuanlari,
  imdbPuaniniAl,
} from '../src/services/icerik/imdbRating.js';

const gercekFetch = globalThis.fetch;
function fetchKur(yanit) { globalThis.fetch = async (...a) => yanit(...a); }
function fetchGeriAl() { globalThis.fetch = gercekFetch; }

const jsonCevap = (veri, ok = true) => ({ ok, json: async () => veri });

test('puan ayıklama: 0-10 dışı ve bozuk değerler elenir', () => {
  assert.equal(puanAyikla(8.44), 8.4);
  assert.equal(puanAyikla('7.9'), 7.9);
  assert.equal(puanAyikla(0), null);
  assert.equal(puanAyikla(10.1), null);
  assert.equal(puanAyikla(-1), null);
  assert.equal(puanAyikla('bad'), null);
  assert.equal(puanAyikla(undefined), null);
  assert.equal(puanAyikla(null), null);
});

test('puan metni: tek ondalık veya boş', () => {
  assert.equal(puanMetni(9), '9.0');
  assert.equal(puanMetni(8.34), '8.3');
  assert.equal(puanMetni(null), '');
  assert.equal(puanMetni('yok'), '');
});

test('geçersiz id’ler isteğe girmez, türler normalize edilir', () => {
  const { hazir, eksik } = onbellegeGoreAyir([
    { tmdbId: '550' },
    { tmdbId: '1396', tur: 'series' },
    { tmdbId: 'abc' },
    { tmdbId: '' },
    { tmdbId: '99', tur: 'tv' },
    {},
    null,
  ]);
  assert.deepEqual(hazir, {});
  assert.deepEqual(eksik.map(e => `${e.id}:${e.tur}`).sort(), ['1396:tv', '550:movie', '99:tv']);
});

test('aynı id iki kez istenirse tek kez istenir', () => {
  const { eksik } = onbellegeGoreAyir([{ tmdbId: '550' }, { tmdbId: '550', tur: 'movie' }]);
  assert.equal(eksik.length, 1);
});

test('toplu istek 25 id ile sınırlıdır', () => {
  const girdiler = Array.from({ length: 60 }, (_, i) => ({ tmdbId: String(1000 + i) }));
  const { eksik } = onbellegeGoreAyir(girdiler);
  assert.equal(eksik.length, 25);
});

test('toplu istek tek çağrıda çözülür ve puanlar eşlenir', async () => {
  let cagri = 0, yol = '';
  fetchKur(async (u) => { cagri++; yol = String(u); return jsonCevap({ puanlar: { '777001': 8.8 } }); });
  try {
    const r = await imdbPuanlari([{ tmdbId: '777001', tur: 'movie' }, { tmdbId: '777002', tur: 'tv' }]);
    assert.equal(cagri, 1, 'iki içerik için iki istek atılmamalı');
    assert.match(yol, /ids=/, 'toplu parametre kullanılmalı');
    assert.equal(r['777001'], 8.8);
    assert.equal(r['777002'], undefined, 'puan bulunmayan id sonuçta yer almaz');
  } finally { fetchGeriAl(); }
});

test('adres mutlak olmalı (göreli /api/... Capacitor’da 404 üretir)', async () => {
  let yol = '';
  fetchKur(async (u) => { yol = String(u); return jsonCevap({ puanlar: {} }); });
  try {
    await imdbPuanlari([{ tmdbId: '777003' }]);
    assert.match(yol, /^https?:\/\//, `mutlak adres bekleniyordu: ${yol}`);
    assert.ok(!yol.startsWith('/api/'), 'göreli adres kullanılamaz');
  } finally { fetchGeriAl(); }
});

test('ağ hatası yutulur ve “puan yok” olarak önbelleğe yazılmaz', async () => {
  let deneme = 0;
  fetchKur(async () => { deneme++; throw new Error('baglanti yok'); });
  try {
    const birinci = await imdbPuanlari([{ tmdbId: '777004' }]);
    assert.deepEqual(birinci, {});
    const ikinci = await imdbPuanlari([{ tmdbId: '777004' }]);
    assert.deepEqual(ikinci, {});
    assert.equal(deneme, 2, 'ağ hatası negatif önbellek olmamalı — tekrar denenmeli');
  } finally { fetchGeriAl(); }
});

test('bulunan puan önbelleğe alınır, ikinci çağrı ağa çıkmaz', async () => {
  let deneme = 0;
  fetchKur(async () => { deneme++; return jsonCevap({ puanlar: { '777005': 7.2 } }); });
  try {
    const a = await imdbPuanlari([{ tmdbId: '777005' }]);
    const b = await imdbPuanlari([{ tmdbId: '777005' }]);
    assert.equal(a['777005'], 7.2);
    assert.equal(b['777005'], 7.2);
    assert.equal(deneme, 1, 'ikinci çağrı önbellekten gelmeli');
  } finally { fetchGeriAl(); }
});

test('tekil yardımcı da aynı yoldan geçer ve null dönebilir', async () => {
  fetchKur(async () => jsonCevap({ puanlar: {} }));
  try {
    assert.equal(await imdbPuaniniAl('777006', 'movie'), null);
  } finally { fetchGeriAl(); }
});

test('uç 404 dönse bile istemci patlamaz', async () => {
  fetchKur(async () => ({ ok: false, status: 404, json: async () => ({}) }));
  try {
    const r = await imdbPuanlari([{ tmdbId: '777007' }]);
    assert.deepEqual(r, {});
  } finally { fetchGeriAl(); }
});

/* ── Uç tarafının saf yardımcıları (api/imdbRating.js) ────────────────────── */

test('uç: id listesi ayrıştırılır, çöp girdiler atlanır', async () => {
  const { idleriAyikla } = await import('../api/imdbRating.js');
  assert.deepEqual(idleriAyikla('550:movie,1396:tv'), [
    { id: '550', tur: 'movie' }, { id: '1396', tur: 'tv' },
  ]);
  assert.deepEqual(idleriAyikla('1396:series'), [{ id: '1396', tur: 'tv' }]);
  assert.deepEqual(idleriAyikla('abc:movie,666'), [{ id: '666', tur: 'movie' }]);
  assert.deepEqual(idleriAyikla(''), []);
  assert.equal(idleriAyikla(Array.from({ length: 80 }, (_, i) => `${i + 1}:movie`).join(',')).length, 25);
});

test('uç: IMDb sayfasından puan çıkarımı birkaç biçimi tanır', async () => {
  const { puandanAyikla } = await import('../api/imdbRating.js');
  assert.equal(puandanAyikla('{"ratingValue":"8.4"}'), 8.4);
  assert.equal(puandanAyikla('<span itemprop="ratingValue">7.4</span>'), 7.4);
  assert.equal(puandanAyikla('<meta property="og:rating" content="6.2">'), 6.2);
  assert.equal(puandanAyikla('puan yok'), null);
  assert.equal(puandanAyikla('"ratingValue":"19"'), null, '10 üstü geçerli değil');
  assert.equal(puandanAyikla(''), null);
});
