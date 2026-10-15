import test from 'node:test';
import assert from 'node:assert/strict';
import { coz } from '../src/providers/atlas.js';

/* Cache-fallback savunması (Atlas / dizisolScraper):
   Site API'si kısa süreli engelleme (challenge HTML / 403) verdiğinde, son iyi
   yanıt 10 saat boyunca kaynak listelemeye devam etmeli. Akış:
     1. çağrı → iyi JSON (önbellek dolar)
     2. çağrı → her yol engelli (CF HTML/403) → coz() yine kaynak verir ve
        iz'e anonim 'cache-fallback' olayı düşer. */

const CHALLENGE_HTML = '<!DOCTYPE html><html lang="en-US"><head><title>Just a moment...</title></head><body>cf_chl_prog challenge-platform</body></html>';

function iyiJson(obj) {
  return new Response(JSON.stringify(obj), { status: 200, headers: { 'content-type': 'application/json' } });
}
function engelli() {
  return new Response(CHALLENGE_HTML, { status: 403, headers: { 'content-type': 'text/html' } });
}

// Önbelleğin 2 dk'lık taze slotunu beklemek yerine saati ilerlet;
// 10 saatlik lastGood bu kaymayla bozulmaz.
function saatIlerlet(ms) {
  const gercek = Date.now;
  Date.now = () => gercek() + ms;
  return () => { Date.now = gercek; };
}

function sahteAg(handler) {
  const once = globalThis.fetch;
  const istekler = [];
  globalThis.fetch = async (input) => {
    const u = String(input);
    istekler.push(u);
    return handler(u);
  };
  return { istekler, geriAl: () => { globalThis.fetch = once; } };
}

const FILM_TMDB = '910001';
const DIZI_TMDB = '910002';

const COZ_FILM = { type: 'movie', title: 'Deneme Filmi', originalTitle: 'Deneme Filmi', tmdbId: FILM_TMDB };
const COZ_DIZI = { type: 'tv', title: 'Deneme Dizisi', originalTitle: 'Deneme Dizisi', tmdbId: DIZI_TMDB, season: 1, episode: 1 };

/* ── Film: çözümleyici (resolver) yolu ─────────────────────────────────── */

test('film: ilk çekim iyi JSON ile önbelleği doldurur, kaynak anon etiketle listelenir', async () => {
  const { istekler, geriAl } = sahteAg((u) => {
    if (u.includes('/api/resolve?')) {
      return iyiJson({
        success: true, streams: [{
          provider: 'VIP', tag: 'vip',
          rawStreamUrl: 'https://cdn.example.org/film-1080.m3u8',
          streamUrl: 'https://cdn.example.org/film-1080.m3u8',
          subtitles: [],
        }],
      });
    }
    return engelli();
  });
  try {
    const r = await coz(COZ_FILM);
    // Node'da resolver yolu artık mutlak olmalı (apiUrl → yerel geçit) ve
    // sorgu dizesi tur+tmdbId taşımalı (cache anahtarı içerik bazlı).
    assert.ok(istekler.some(u => /^https?:\/\//.test(u) && u.includes('/api/resolve?') && u.includes('tmdbId=' + FILM_TMDB)),
      `resolver geçidi Mutlak URL ile aranmalı: ${JSON.stringify(istekler)}`);
    assert.equal(r.sources.length, 1, JSON.stringify(r.trace));
    assert.match(r.sources[0].name, /^Atlas /);
    assert.ok(!r.sources[0].isIframe);
    assert.ok(!r.trace.some(e => e.ad === 'cache-fallback'), 'ilk (başarılı) çekimde fallback olayı düşmemeli');
  } finally { geriAl(); }
});

test('film: tüm yollar engelli — son iyi yanıt kaynak verir, iz anonim kalır', async () => {
  const geriSaat = saatIlerlet(3 * 60 * 1000); // taze slotu aş, lastGood (10s) geçerli
  const { istekler, geriAl } = sahteAg(() => engelli());
  try {
    const r = await coz(COZ_FILM);
    // Gerçek ağ denenmiş olmalı (gateway + doğrudan) — önbellek ağı hiç
    // denemeden devreye girmemeli.
    assert.ok(istekler.some(u => u.includes('/api/resolve?')), 'engel sonrası tekrar ağ denenmeli');
    assert.equal(r.sources.length, 1, JSON.stringify(r.trace));
    assert.ok(r.sources[0].url.includes('film-1080.m3u8'));
    const fb = r.trace.find(e => e.ad === 'cache-fallback');
    assert.ok(fb, `iz cache-fallback içermeli: ${JSON.stringify(r.trace)}`);
    assert.equal(fb.adet, 1);
    // Anonimlik: iz ve kullaniciya gorunen alanlar site adini/alanini
    // sizdirmamali. (headers.Referer oynatim icin gereken teknik basliktir,
    // UI metni degildir; bu kontrolun disindadir.)
    const gorunen = JSON.stringify({
      trace: r.trace,
      adlar: r.sources.map(s => [s.name, s.displayName, s.url, s.id, s.category, s.quality])
    }).toLowerCase();
    assert.ok(!gorunen.includes('dizisol'), 'iz/gorunen alanlar site adini tasimamali');
  } finally { geriAl(); geriSaat(); }
});

/* ── Dizi: klasik akış (bölüm listesi) yolu ─────────────────────────────── */

test('dizi: resolver sonuçsuz dönerse klasik akış bölüm listesiyle önbelleği doldurur', async () => {
  const { istekler, geriAl } = sahteAg((u) => {
    if (u.includes('/api/resolve?')) return iyiJson({ success: false, error: 'no result' });
    if (u.includes(`/movies/by-tmdb/${DIZI_TMDB}/episodes`)) {
      return iyiJson([{
        season: 1, episode: 1,
        m3u8Url: 'https://cdn.example.org/b1.m3u8',
        subtitleTr: 'https://cdn.example.org/tr.vtt',
        sources: [],
      }]);
    }
    return engelli();
  });
  try {
    const r = await coz(COZ_DIZI);
    assert.ok(istekler.some(u => u.includes(`/movies/by-tmdb/${DIZI_TMDB}/episodes`)), 'klasik bölüm listesi yolu denenmeli');
    assert.equal(r.sources.length, 1, JSON.stringify(r.trace));
    assert.ok(r.sources[0].url.includes('b1.m3u8'));
    assert.ok(!r.trace.some(e => e.ad === 'cache-fallback'), 'geçerli-ama-sonuçsuz resolver yanıtı fallback sayılmamalı');
  } finally { geriAl(); }
});

test('dizi: tüm yollar engelli — bölüm son iyi listeden gelir, cache-fallback izde', async () => {
  const geriSaat = saatIlerlet(4 * 60 * 1000);
  const { geriAl } = sahteAg(() => engelli());
  try {
    const r = await coz(COZ_DIZI);
    assert.equal(r.sources.length, 1, JSON.stringify(r.trace));
    assert.ok(r.sources[0].url.includes('b1.m3u8'));
    assert.ok(r.trace.some(e => e.ad === 'cache-fallback'), `iz cache-fallback içermeli: ${JSON.stringify(r.trace)}`);
    const gorunen = JSON.stringify({
      trace: r.trace,
      adlar: r.sources.map(s => [s.name, s.displayName, s.url, s.id, s.category, s.quality])
    }).toLowerCase();
    assert.ok(!gorunen.includes('dizisol'), 'iz/gorunen alanlar site adini tasimamali');
  } finally { geriAl(); geriSaat(); }
});
