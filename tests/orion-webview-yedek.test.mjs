import test from 'node:test';
import assert from 'node:assert/strict';
import { coz, pahaliTuraIzin } from '../src/providers/orion.js';

const gercekFetch = globalThis.fetch;
test.afterEach(() => { globalThis.fetch = gercekFetch; });

/* Orion gizli-motor yedek kapısı (YAPILACAKLAR #0 onaylı seçenek b):
   TV + sıfır-yayın + izde-403-kanıtı + motor-boş. Film yolu asla geçmez. */

test('pahaliTuraIzin yalnız dört koşul birleşince açılır', () => {
  assert.equal(pahaliTuraIzin({ isFilm: false, yayinYok: true, kanit: true, motorBos: true }), true);
  assert.equal(pahaliTuraIzin({ isFilm: true, yayinYok: true, kanit: true, motorBos: true }), false, 'film yolu kapalı');
  assert.equal(pahaliTuraIzin({ isFilm: false, yayinYok: false, kanit: true, motorBos: true }), false, 'yayın varsa kapalı');
  assert.equal(pahaliTuraIzin({ isFilm: false, yayinYok: true, kanit: false, motorBos: true }), false, 'kanıtsız kapalı');
  assert.equal(pahaliTuraIzin({ isFilm: false, yayinYok: true, kanit: true, motorBos: false }), false, 'motor meşgulse kapalı');
});

test('TV: kanal 403 challenge verip yedek tur çözünce yayın listelenir (A vakası)', async () => {
  const once = new Map();
  const istekler = [];
  globalThis.fetch = async (url) => {
    const u = String(url);
    istekler.push(u);
    if (u.includes('siteurl.txt')) return new Response('hdfilmcehennemi:https://provider.example');
    if (u.includes('/search/')) return new Response(JSON.stringify({
      results: ['<a href="/dizi/test-dizi-izle-5/sezon-1/bolum-1/"><h4 class="title">Test Dizi</h4></a>'],
    }));
    if (u.includes('/sezon-1/bolum-1/')) {
      const n = (once.get(u) || 0) + 1; once.set(u, n);
      if (n === 1) return new Response('Just a moment...', { status: 403 });
      return new Response('<html><h1>Test Dizi</h1><iframe src="https://player.example/embed/9"></iframe></html>');
    }
    if (u === 'https://player.example/embed/9') return new Response('<script>var stream="https://cdn.example/test-dizi-s01e01-dual/master.m3u8";</script>');
    return new Response('yok', { status: 404 });
  };
  try {
    const r = await coz({ type: 'tv', title: 'Test Dizi', season: 1, episode: 1, tmdbId: 111 });
    assert.equal(r.sources.length, 1, JSON.stringify(r.trace.map((x) => x.ad)));
    const adlar = r.trace.map((x) => x.ad);
    assert.ok(adlar.includes('webview-sayfa'), '403 kanıtı sonrası gizli motor denemesi izlenmeli');
    const epIstekleri = istekler.filter((u) => u.includes('/sezon-1/bolum-1/'));
    assert.ok(epIstekleri.length >= 2, 'yedek tur bölüm sayfasını ikinci kez denemeli');
    assert.equal(r.sources[0].url, 'https://cdn.example/test-dizi-s01e01-dual/master.m3u8');
  } finally { /* fetch restorasyonu aşağıda */ }
});

test('TV: 404 boşluk (403 kanıtsız) yedek turu AÇMAZ — eski sessiz 0 korunur', async () => {
  const istekler = [];
  globalThis.fetch = async (url) => {
    const u = String(url);
    istekler.push(u);
    if (u.includes('siteurl.txt')) return new Response('hdfilmcehennemi:https://provider.example');
    if (u.includes('/search/')) return new Response(JSON.stringify({
      results: ['<a href="/dizi/olmayan-dizi-izle-5/"><h4 class="title">Olmayan Dizi</h4></a>'],
    }));
    return new Response('bulunamadi', { status: 404 });
  };
  try {
    const r = await coz({ type: 'tv', title: 'Olmayan Dizi', season: 1, episode: 1, tmdbId: 222 });
    assert.equal(r.sources.length, 0);
    const yok = r.trace.filter((x) => x.ad === 'oynatici-yok');
    assert.equal(yok.length, 1);
    assert.equal(yok[0].neden, 'sayfa-bos');
    assert.ok(!r.trace.some((x) => x.ad === 'webview-sayfa'), 'kanıtsız boşluk pahalı motora gitmez');
  } finally {}
});

test('B vakası: sayfa 200 ama /video/ ucu 403 → TV yedek turu ucu tekrarlar, film tekrarlamaz', async () => {
  const run = async (type) => {
    const gorulen = new Map();
    const istekler = [];
    globalThis.fetch = async (url) => {
      const u = String(url);
      istekler.push(u);
      if (u.includes('siteurl.txt')) return new Response('hdfilmcehennemi:https://provider.example');
      if (u.includes('/video/55/')) {
        const n = (gorulen.get(u) || 0) + 1; gorulen.set(u, n);
        if (n === 1) return new Response('Just a moment...', { status: 403 });
        return new Response(JSON.stringify({ data: { html: '<iframe src="https://rapid.example/embed/55"></iframe>' } }));
      }
      if (u === 'https://rapid.example/embed/55') return new Response('<script>var stream="https://cdn.example/x-s01e01/master.m3u8";</script>');
      if (type === 'tv' && u.includes('/sezon-1/bolum-1/')) return new Response(
        '<html><h1>Dizi</h1><button class="alternative-link" data-video="55">Rapidrame</button></html>');
      if (type === 'movie' && u.includes('film-izle')) return new Response(
        '<html><h1>Film</h1><button class="alternative-link" data-video="55">Rapidrame</button></html>');
      if (u.includes('/search/')) return new Response(JSON.stringify({
        results: [type === 'tv'
          ? '<a href="/dizi/test-dizi-izle-5/sezon-1/bolum-1/"><h4 class="title">Test Dizi</h4></a>'
          : '<a href="/test-film-izle/"><h4 class="title">Test Film</h4></a>'],
      }));
      return new Response('yok', { status: 404 });
    };
    const r = await (type === 'tv'
      ? coz({ type: 'tv', title: 'Test Dizi', season: 1, episode: 1, tmdbId: 333 })
      : coz({ type: 'movie', title: 'Test Film', tmdbId: 444 }));
    const videoTekrar = istekler.filter((u) => u.includes('/video/55/')).length;
    return { r, videoTekrar };
  };
  const tv = await run('tv');
  assert.equal(tv.r.sources.length, 1, JSON.stringify(tv.r.trace.map((x) => x.ad)));
  assert.equal(tv.videoTekrar, 2, 'TV: 403 kanıtlı uç yedek turda tekrar denenir');
  assert.ok(tv.r.trace.some((x) => x.ad === 'webview-turu'));
  const film = await run('movie');
  assert.equal(film.r.sources.length, 0, 'film yolu kapalı: PAHALI_TUR=false iken tekrar denemez');
  assert.equal(film.videoTekrar, 1, 'film: /video/ ucu TEK denemede kalır (regresyon koruması)');
});
