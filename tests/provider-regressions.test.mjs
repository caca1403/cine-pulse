import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import CryptoJS from '../src/vendor/crypto-js.js';
import { sifreliOynaticiCoz } from '../src/services/encryptedPlayer.js';
import { siteListesi, vidlinkKaynaklari } from '../src/services/siteProviders.js';

test('ESM crypto entry decrypts the reversed-base64 provider envelope', () => {
  const html = '<video src="https://cdn.example/movie.m3u8"></video>';
  const key = 'provider-password';
  const encrypted = CryptoJS.AES.encrypt(html, key, {salt:CryptoJS.enc.Hex.parse('0011223344556677')}).toString();
  const wrap = value => Buffer.from(value, 'latin1').toString('base64').split('').reverse().join('');
  const input = `CryptoJS; document.write(decode("${wrap(encrypted)}")); var KEY=decode("${wrap(key)}");`;
  assert.equal(sifreliOynaticiCoz(input), html);
});

test('VidLink parses a short JSON response into streams, not an API iframe', () => {
  const sources = vidlinkKaynaklari(JSON.stringify({stream:{playlist:'https://cdn.example/master.m3u8',qualities:{'1080p':{url:'https://cdn.example/1080.m3u8'}}}}));
  assert.equal(sources.length, 2);
  assert.ok(sources.every(s => s.isHls && !s.isIframe));
  assert.deepEqual(vidlinkKaynaklari('{"error":"not found"}'), []);
});

test('HDFilmDelisi uses q and selects the matching title after an unrelated first link', async () => {
  const originalFetch = globalThis.fetch;
  const requests = [];
  globalThis.fetch = async input => {
    const u = String(input); requests.push(u);
    const body = u.includes('/arama?')
      ? `<a href="/film/another">Another Movie</a><a href="/film/interstellar"><img alt="Interstellar"></a>${' '.repeat(350)}`
      : u.includes('/film/interstellar')
        ? `<iframe src="https://cdn.example/master.m3u8"></iframe>${' '.repeat(350)}`
        : ' '.repeat(400);
    return new Response(body, {status:200});
  };
  try {
    const sources = await siteListesi('hdfilmdelisi', {title:'Interstellar',tmdbId:'157336',imdbId:'tt0816692'});
    assert.ok(requests.some(u => u.includes('/arama?q=')));
    assert.ok(requests.some(u => u.endsWith('/film/interstellar')));
    assert.ok(!requests.some(u => u.endsWith('/film/another')));
    assert.ok(sources.length > 0);
  } finally { globalThis.fetch = originalFetch; }
});

/* ══════════════════════════════════════════════════════════════════════════
   Sağlayıcı savunma düzeltmeleri — hepsi MOCK ağ üzerinde (canlı istek yok).
   ══════════════════════════════════════════════════════════════════════════ */

const b64 = (s) => Buffer.from(JSON.stringify(s)).toString('base64');
const sayfa = (govde) => `${govde}${' '.repeat(600)}`; // CF/engel imzası olmayan dolgu

/* ── Betelgeuse: tür bonusu başlık eşleşmesinin ÖNÜNE geçemez ───────────── */

const kart = (ad, href) => `<a href="${href}" class="movie-card" aria-label="${ad} details"></a>`;

const betelgeuseCoz = async (kartlarHtml) => {
  const originalFetch = globalThis.fetch;
  const requests = [];
  globalThis.fetch = async input => {
    const u = String(input); requests.push(u);
    if (u.includes('raw.githubusercontent.com')) return new Response('', {status:200});
    if (u.includes('/?s=')) return new Response(kartlarHtml, {status:200});
    return new Response('<html></html>', {status:200});
  };
  try {
    const { coz } = await import('../src/providers/betelgeuse.js');
    return { ...(await coz({type:'movie', title:'Interstellar'})), requests };
  } finally { globalThis.fetch = originalFetch; }
};

test('Betelgeuse: eşleşmeyen adaya tür bonusu uygulanmaz, yanlış içerik sayfası açılmaz', async () => {
  // Arama yalnız ALAKASIZ ama "-movie-" taşıyan bir kart döndürüyor.
  const r = await betelgeuseCoz(kart('Kedi Patronu 2', '/film/kedi-patronu-2-movie-izle/'));
  assert.equal(r.sources.length, 0, 'eşleşmeyen kart listelenmemeli');
  assert.ok(!r.requests.some(u => u.includes('kedi-patronu-2')), 'alakasız içerik sayfası istenmemeli');
});

test('Betelgeuse: başlığa eşleşen aday yine seçilir (tür uyarısı puanı düşürür)', async () => {
  // Film isteniyor; eşleşen kart dizi kalıbında (-2), alakasız kart film kalıbında (+2).
  const r = await betelgeuseCoz(
    kart('Kedi Patronu 2', '/film/kedi-patronu-2-movie-izle/')
    + kart('Interstellar', '/series/interstellar-series-izle/'),
  );
  assert.ok(r.requests.some(u => u.includes('interstellar-series-izle')), 'eşleşen sayfa açılmalı');
  assert.ok(!r.requests.some(u => u.includes('kedi-patronu-2')), 'alakasız sayfa açılmamalı');
});

/* ── Lumen: {type, metaUrl} taşıyan sunucu tekillik anahtarında kalsın ──── */

test('Lumen: yalnız metaUrl taşıyan sunucu elenmez, doğrudan yayını listeler', async () => {
  const originalFetch = globalThis.fetch;
  const requests = [];
  const bolumHtml = `<script>var servers = JSON.parse(atob("${b64([{ type:'hdfc', metaUrl:'/api/meta/abc.json' }])}"));</script>`;
  globalThis.fetch = async input => {
    const u = String(input); requests.push(u);
    if (u.includes('/api/search/suggest/')) {
      return new Response(JSON.stringify({ animes:[{ name:'Kedi Krali', url:'/diziler/kedi-krali-izle/' }] }), {status:200});
    }
    if (u.includes('-sezon-1-bolum-izle')) return new Response(bolumHtml, {status:200});
    if (u.includes('/api/meta/abc.json')) {
      return new Response(JSON.stringify({
        hls:'https://cdn.example/720p.kedi.m3u8',
        subs:[{ url:'https://cdn.example/tr.vtt', name:'Türkçe' }],
      }), {status:200});
    }
    if (u.includes('kedi-krali')) return new Response(sayfa('<a href="/kedi-krali-1-sezon-1-bolum-izle/">b1</a>'), {status:200});
    return new Response('', {status:200});
  };
  try {
    const { coz } = await import('../src/providers/lumen.js');
    const { sources } = await coz({ type:'tv', title:'Kedi Krali', season:1, episode:1 });
    assert.equal(sources.length, 1, 'metaUrl sunucusu yayın vermeli');
    assert.equal(sources[0].streamUrl, 'https://cdn.example/720p.kedi.m3u8');
    assert.equal(sources[0].quality, '720p');
    assert.equal(sources[0].subtitles.length, 1);
    assert.ok(requests.some(u => u.includes('/api/meta/abc.json')), 'metaUrl yoklanmalı');
  } finally { globalThis.fetch = originalFetch; }
});

/* ── Nero: master yoklaması yapıldıysa kanıt şart ───────────────────────── */

const neroCoz = async ({ master, kacir = false }) => {
  const originalFetch = globalThis.fetch;
  const gercekDateNow = Date.now;
  let kayma = 0;
  Date.now = () => gercekDateNow() + kayma;
  const requests = [];
  globalThis.fetch = async input => {
    const u = String(input); requests.push(u);
    if (u.includes('/ara/oneri?q=')) {
      await new Promise(r => setTimeout(r, 5));
      if (kacir) kayma = 9000; // bütçe doldu → master yoklaması ATLANIR
      return new Response(JSON.stringify({ movies:[{ title:'Interstellar', url:'https://dizibal.org/movie/interstellar' }] }), {status:200});
    }
    if (u.includes('/movie/interstellar')) {
      return new Response(sayfa('<div data-pv="slug-abc-123"></div> https://pilavyerplay.top/player'), {status:200});
    }
    if (u.includes('/assets/js/s.php')) {
      return new Response(JSON.stringify({ stream:'https://pilavyerplay.top/hls/master.m3u8' }), {status:200});
    }
    if (u.endsWith('/hls/master.m3u8')) return new Response(master, {status:200});
    return new Response('', {status:200});
  };
  try {
    const { coz } = await import('../src/providers/nero.js');
    return { ...(await coz({ type:'movie', title:'Interstellar' })), requests };
  } finally {
    globalThis.fetch = originalFetch;
    Date.now = gercekDateNow;
  }
};

test('Nero: master yoklaması boş dönüyorsa kaynak listelenmez', async () => {
  const r = await neroCoz({ master:'' });
  assert.ok(r.requests.some(u => u.endsWith('/hls/master.m3u8')), 'yoklama yapılmalı');
  assert.equal(r.sources.length, 0, 'ölü yayın listelenmemeli');
});

test('Nero: master yoklaması oynatma listesi değilse (engel/hata) kaynak listelenmez', async () => {
  const r = await neroCoz({ master:sayfa('<html><body>hata</body></html>') });
  assert.equal(r.sources.length, 0, 'playlistsiz yanıt = ölü yayın');
});

test('Nero: sağlam master kaliteyi de verir, kaynak listelenir', async () => {
  const r = await neroCoz({ master:'#EXTM3U\n#EXT-X-STREAM-INF:BANDWIDTH=1,RESOLUTION=1920x1080\n1080p.m3u8\n' });
  assert.equal(r.sources.length, 1);
  assert.equal(r.sources[0].quality, '1080p');
});

test('Nero: bütçe yetmediği için yoklama atlanırsa davranış aynen korunur', async () => {
  const r = await neroCoz({ master:'', kacir:true });
  assert.ok(!r.requests.some(u => u.endsWith('/hls/master.m3u8')), 'yoklama atlanmalı');
  assert.equal(r.sources.length, 1, 'atlanan yoklamada kaynak yine listelenir');
});

/* ── Atlas / Corvus: kabul edilen sinyal alt kazıyıcıya geçmeli ─────────── */

test('Atlas ve Corvus kabul ettikleri sinyali alt kazıyıcı çağrısına aktarır', async () => {
  const atlasKaynak = await readFile(new URL('../src/providers/atlas.js', import.meta.url), 'utf8');
  const corvusKaynak = await readFile(new URL('../src/providers/corvus.js', import.meta.url), 'utf8');
  // sinyal, kazıyıcıya TEK seferde verilen seçenek nesnesinin parçası olmalı
  assert.match(atlasKaynak, /const ortak = \{[^}]*\bsignal\b[^}]*\}/s, 'atlas: sinyal seçeneklere girmedi');
  assert.match(corvusKaynak, /fetchDizi77Sources\(\{[^}]*\bsignal\b[^}]*\}\)/s, 'corvus: sinyal kazıyıcıya geçmedi');
});

test('Atlas: sinyal eklendiğinde sağlayıcı yine doğrudan yayını listeler', async () => {
  const originalFetch = globalThis.fetch;
  const requests = [];
  globalThis.fetch = async input => {
    const u = String(input); requests.push(u);
    const abs = u.startsWith('/') ? `https://yanit.test${u}` : u;
    if (abs.includes('/api/resolve')) {
      return new Response(JSON.stringify({ success:true, streams:[{
        provider:'VIP', tag:'vip', rawStreamUrl:'https://cdn.example/dzs-1080p.m3u8',
        streamUrl:`/api/hls_proxy?url=${encodeURIComponent('https://cdn.example/dzs-1080p.m3u8')}`,
      }] }), {status:200});
    }
    return new Response('', {status:200});
  };
  try {
    const { coz } = await import('../src/providers/atlas.js');
    const { sources } = await coz({ type:'movie', title:'Deneme Filmi', signal:new AbortController().signal });
    assert.ok(requests.some(u => u.includes('/api/resolve')));
    assert.equal(sources.length, 1);
    assert.ok(!sources[0].isIframe);
  } finally { globalThis.fetch = originalFetch; }
});

test('Corvus: yalnız gömülü oynatıcı çözülemezse kaynak listelenmez (sinyal eklendiğinde de)', async () => {
  const originalFetch = globalThis.fetch;
  const requests = [];
  const bolum = sayfa('<title>Kral Kraliçe - 1. Sezon 1. Bölüm İzle</title><iframe src="https://dizi77.life/player/xyz"></iframe>');
  globalThis.fetch = async input => {
    const u = String(input); requests.push(u);
    const abs = u.startsWith('/') ? `https://yanit.test${u}` : u;
    if (abs.includes('workers.dev')) return new Response(bolum, {status:200});
    return new Response('', {status:200});
  };
  try {
    const { coz } = await import('../src/providers/corvus.js');
    const { sources } = await coz({ type:'tv', title:'Kral Kraliçe', season:1, episode:1, signal:new AbortController().signal });
    assert.ok(requests.some(u => u.includes(encodeURIComponent('dizi/kral-kralice/sezon/1/bolum/1'))), 'bölüm adresi denenmeli');
    assert.equal(sources.length, 0, 'iframe asla listelenmez');
  } finally { globalThis.fetch = originalFetch; }
});
