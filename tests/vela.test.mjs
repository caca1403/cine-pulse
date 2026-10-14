import test from 'node:test';
import assert from 'node:assert/strict';
import { coz, eslesmePuan, yilUyar } from '../src/providers/vela.js';

// Vela (FilmEkseni) — KİMLİK KAPISI kanıtı. Ölçülen kaza: site araması
// bulanık ve eski çift-yönlü `includes()` "Mucize Uğurböceği" (çocuk/anime)
// hedefini sıradan "Mucize" kartına bağlayıp sitenin NORMAL dizisinin
// bölümünü listeliyordu. Doktrin "2000 se 2000": tam=6, öneşek=4, içeren=0.

const dizi = (title, year, slug) => ({ title, slug: slug || `dizi/${title.toLowerCase().replace(/\s+/g, '-')}`, contentableType: 'App\\Models\\TVSeries', releaseYear: String(year) });
const film = (title, year, slug) => ({ title, slug: slug || title.toLowerCase().replace(/\s+/g, '-'), contentableType: 'App\\Models\\Movie', releaseYear: String(year) });

const golmeli = (payload) => `videoPlayerData = JSON.parse('${JSON.stringify(payload)}');`;
const OYUNCULAR = { Altyazi: [{ link: 'https://eksenload.top/e/abc123', template: '', service_name: 'EksenLoad', service_slug: 'eksen' }] };
const SETUP = `jwplayer("oynatici").setup(JSON.parse('${JSON.stringify({ file: 'https://cdn.eksenload.top/v/hedef.m3u8', tracks: [] })}'));`;

/** Sahte FilmEkseni: /api/search?q → senaryo listesi; bölüm sayfası → gömülü
    videoPlayerData; eksenload embed'i → imzalı m3u8. */
async function run(args, kartlar) {
  const once = globalThis.fetch;
  globalThis.fetch = async (input) => {
    const url = String(input);
    if (url.includes('/api/search')) {
      const q = decodeURIComponent(url.split('q=')[1] || '');
      const liste = Object.entries(kartlar).find(([k]) => q.startsWith(k))?.[1] || [];
      return new Response(JSON.stringify({ data: liste }));
    }
    if (/\/sezon-\d+\/bolum-\d+\/$/.test(url) || url.endsWith('/')) return new Response(`<html>${golmeli(OYUNCULAR)}</html>`);
    if (url.includes('eksenload.top')) return new Response(`<html>${SETUP}</html>`);
    if (url.endsWith('/')) return new Response('<html>site-anasayfa</html>');
    return new Response('yok', { status: 404 });
  };
  try {
    const r = await coz({ ...args });
    return { n: r.sources.length, ilk: r.sources[0], trace: r.trace };
  } finally { globalThis.fetch = once; }
}

/* ── saf kapı birimi ───────────────────────────────────────────────────── */

const LADYBUG = ['Miraculous Tales of Ladybug & Cat Noir', 'Mucize Uğurböceği'];

test('kapı birimi: çocuk/anime markasında alt-dize/alt-ad RED (içeren=0)', () => {
  assert.equal(eslesmePuan('Mucize', LADYBUG), 0); // sıradan TR dizisi — kazanın kökü
  assert.equal(eslesmePuan('Uğur Böceği', LADYBUG), 0);
  assert.equal(eslesmePuan('Mucize Sezon', LADYBUG), 0);
  assert.equal(eslesmePuan('Mucize: Uğur Böceği ile Kara Kedi, Film', LADYBUG), 0);
  assert.equal(eslesmePuan('Miraculous Shanghai', LADYBUG), 0);
  assert.equal(eslesmePuan('Mucize Uğurböceği', LADYBUG), 6); // tam
  assert.equal(eslesmePuan('La Casa de Papel 2', ['La Casa de Papel']), 4); // öneşek
  assert.equal(eslesmePuan('La Casa', ['La Casa de Papel']), 0); // ters öneşek (kısa kart) RED
});

test('kapı birimi: kart gürültüsü soyulur, "A/An" soyulmaz', () => {
  assert.equal(eslesmePuan('Matrix', ['The Matrix']), 6);
  assert.equal(eslesmePuan('The Matrix', ['Matrix']), 6);
  assert.equal(eslesmePuan('Hızlı ve Öfkeli izle', ['Hızlı ve Öfkeli']), 6);
  assert.equal(eslesmePuan('Teacher', ['An Teacher']), 0); // "An" kimliğin parçasıdır
});

test('kapı birimi: yıl ±1; hedef yılı varsa kart yılı olmalı (tek adayda da)', () => {
  assert.equal(yilUyar(2015, '2014'), true);
  assert.equal(yilUyar(2015, '2017'), false);
  assert.equal(yilUyar(2015, null), false);
  assert.equal(yilUyar(null, '2099'), true);
});

/* ── uçtan uca (sahte site) ────────────────────────────────────────────── */

// Sitenin canlı bulanık aramasının birebir taklidi (ölçüldü: q="Mucize
// Uğurböceği" komşu kartları da döndürüyor; eski kapı TVSeries "Mucize"yi
// alt-dizeyle kabul edip onun S1E1'ini listeliyordu).
const LADYBUG_SENARYO = {
  'Miraculous': [],
  'Mucize Uğurböceği': [dizi('Mucize', 2018, 'dizi/mucize'), film('Uğur Böceği', 2017), film('Mucize: Uğur Böceği ile Kara Kedi, Film', 2023, 'mucize-ugur-bocegi-ile-kara-kedi')],
};

test('çocuk/anime: alakalı görünen alt-dize kartları ELENİR → 0 kaynak', async () => {
  const r = await run({ type: 'tv', title: 'Mucize Uğurböceği', originalTitle: 'Miraculous: Tales of Ladybug & Cat Noir', year: 2015, season: 1, episode: 1 }, LADYBUG_SENARYO);
  assert.equal(r.n, 0, JSON.stringify(r.trace));
  assert.ok(r.trace.some((x) => x.ad === 'kimlik-kapi' && x.gecen === 0), JSON.stringify(r.trace));
  // Eski gevşek kapı aynı kartı kabul ederdi (gerileme bekçisi):
  const norm = (s) => String(s || '').toLowerCase().replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c').replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim();
  assert.ok(LADYBUG.map(norm).some((t) => norm('Mucize') && t.includes(norm('Mucize'))), 'eski includes() kapısı "Mucize"yi alırdı');
});

test('kontrol dizi: tam kart + doğru yıl → bölüm kaynağı listelenir', async () => {
  const r = await run({ type: 'tv', title: 'La Casa de Papel', originalTitle: 'La Casa de Papel', year: 2017, season: 1, episode: 1 }, {
    'La Casa de Papel': [dizi('La Casa de Papel', 2017, 'dizi/la-casa-de-papel'), film('La Casa de Papel: Fenomen', 2020), dizi('Berlin ve Kakımlı Kadın', 2026)],
  });
  assert.equal(r.n, 1, JSON.stringify(r.trace));
  assert.match(r.ilk.name, /^Vela Sunucu/);
  assert.ok(r.ilk.url.includes('hedef.m3u8'), r.ilk.url);
});

test('kontrol film: kart "Matrix" (TMDB tr "Matrix"/orj "The Matrix") → kaynak; yıl dışı devam filmi elenir', async () => {
  const kartlar = {
    The: [film('Matrix', 1999), film('Matrix 2: Reloaded izle', 2003), film('Matrix Resurrections', 2021)],
  };
  const r = await run({ type: 'movie', title: 'The Matrix', originalTitle: 'The Matrix', year: 1999 }, kartlar);
  assert.equal(r.n, 1, JSON.stringify(r.trace));
  assert.ok(r.ilk.url.includes('hedef.m3u8'));
  // Yıl 2003 hedeflenseydi "Matrix 2: Reloaded izle" öneşek+yıl ile yine tek doğru olurdu:
  const devami = await run({ type: 'movie', title: 'The Matrix 2: Reloaded', originalTitle: 'The Matrix 2: Reloaded', year: 2003 }, kartlar);
  assert.equal(devami.n, 1, JSON.stringify(devami.trace));
});

test('yıl kapısı: tam kart ama yıl ±1 dışı → 0 kaynak (tek adayda da denetlenir)', async () => {
  const r = await run({ type: 'tv', title: 'La Casa de Papel', originalTitle: 'La Casa de Papel', year: 2015, season: 1, episode: 1 }, {
    'La Casa de Papel': [dizi('La Casa de Papel', 2017, 'dizi/la-casa-de-papel')],
  });
  assert.equal(r.n, 0, JSON.stringify(r.trace));
  assert.ok(r.trace.some((x) => x.ad === 'kimlik-kapi' && x.gecen === 0));
});
