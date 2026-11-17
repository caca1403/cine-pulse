/* hosted-API çekirdekleri — çevrimdışı (AĞ YOK) sözleşme testleri.
   Eylül 29 (6baa792) kaynaklarından geri getirilenler:
     • Mystique → LookMovie2.la hosted JSON API (lookmovieScraper.js mirası)
     • Gambit   → TVR/RecTV hosted API (rectvService.js mirası: HMAC + AES-GCM)
   SmashyStream ve Videasy-torrent geri GELMEDİ — Eylül kodları iframe embed
   üretiyordu ve Smashy API anahtarı repoda YOK (kanıtlar testin sonunda).
   fetch enjeksiyonuyla çalışır: TMDB önbelleği tmdbBilgiTohumla ile doldurulur,
   hiçbir test gerçek ağa çıkmaz. */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createCipheriv } from 'node:crypto';

import { KAYIT } from '../src/providers/kayit.js';
import { kayitDurumu } from '../src/providers/vekil.js';
import { tmdbBilgiTohumla } from '../src/providers/ortakCekirdek.js';

const TABAN_LM = 'https://lookmovie2.la';
const TABAN_RTV = 'https://a.prectv70.lol';
const SW_KEY = '4F5A9C3D9A86FA54EACEDDD635185/c3c5bd17-e37b-4b94-a944-8a3688a30452';
const STREAM_ENC_KEY_HEX = '666482389dc76bfa57068407418f7dac9f6c14b6868856b169165b9fac7d812e';

/** fetch sahtesi: kalıp → yanıt üreticisi. Eşleşme yoksa 404 (sessiz düşüş). */
function fetchSahte(rotalar) {
  const istekler = [];
  const sahte = async (girdi, secenek = {}) => {
    const adres = typeof girdi === 'string' ? girdi : girdi?.url || '';
    istekler.push({ adres, sekenek: secenek });
    for (const [kalip, uret] of rotalar) {
      if (!kalip.test(adres)) continue;
      const yanit = await uret({ adres, secenek });
      if (yanit instanceof Response) return yanit;
      const { durum = 200, govde = '', basliklar = {} } = yanit || {};
      const metin = typeof govde === 'string' ? govde : JSON.stringify(govde);
      return new Response(durum >= 400 ? '' : metin, {
        status: durum,
        headers: { 'content-type': durum >= 400 ? 'text/plain' : (basliklar['content-type'] || 'application/json'), ...basliklar },
      });
    }
    return new Response('yok', { status: 404 });
  };
  return { sahte, istekler };
}

function fetchEnjekte(rotalar) {
  const onceki = globalThis.fetch;
  const kurgu = fetchSahte(rotalar);
  globalThis.fetch = kurgu.sahte;
  return { ...kurgu, geriAl: () => { globalThis.fetch = onceki; } };
}

/* ── kayıt bütünlüğü ───────────────────────────────────────────────────── */

test('kayıt: Mystique ve Gambit KAYIT\'ta benzersiz ve çekirdek dosyaları mevcut', () => {
  for (const ad of ['Mystique', 'Gambit']) {
    const k = KAYIT.get(ad);
    assert.ok(k, `${ad} KAYIT'ta olmalı`);
    assert.match(k.onek, /^sp_[a-z0-9]+_$/, `${ad} öneki biçimsiz`);
    assert.ok(Array.isArray(k.turler) && k.turler.includes('movie') && k.turler.includes('tv'), `${ad} film+dizi vermeli`);
    assert.equal(typeof k.yukle, 'function', `${ad} yukle fonksiyonu`);
    const yol = new URL(`../src/providers/cekirdekler/${k.dosya}`, import.meta.url);
    assert.ok(fs.existsSync(yol), `${ad}: ${k.dosya} diskte yok`);
  }
  const onekler = [...KAYIT.values()].map(k => k.onek);
  assert.equal(new Set(onekler).size, onekler.length, 'onekler benzersiz olmalı');
  const durum = kayitDurumu();
  assert.deepEqual(durum.cakisma, [], 'kod adı çakışması olmamalı');
});

/* ── Mystique: LookMovie2 hosted API ───────────────────────────────────── */

function lmTohumla(tur = 'movie') {
  tmdbBilgiTohumla({
    tmdbId: '550', imdbId: 'tt1375666', baslik: 'Dövüş Kulübü',
    orijinal: 'Fight Club', yil: 1999, tur,
  });
}

const LM_AKIS = (satir = 'https://srv1.meatort.site/hls/999/master.m3u8?token=abc') => ({
  streams: {
    '720p': satir.replace('master', '720'),
    '1080p': satir,
    auto: null,
  },
  subtitles: [
    { language: 'turkish', file: 'https://srv1.meatort.site/subs/tr_999.vtt' },
    { language: 'portuguese', file: 'https://srv1.meatort.site/subs/pt.vtt' },
  ],
});

test('Mystique movie: sahte API yanıtından m3u8 yayın + Altyazı işareti çıkarır', async () => {
  lmTohumla('movie');
  const { default: getStreams, ..._ } = await import('../src/providers/cekirdekler/mystique.js');
  const { istekler, geriAl } = fetchEnjekte([
    [/lookmovie2\.la\/api\/v1\/movies\/do-search/, () => ({ govde: { result: [{ id_movie: 999, slug: 'fight-club-1999' }] } })],
    [/lookmovie2\.la\/movies\/play\/fight-club/, () => ({
      govde: "<script>var player = { id_movie: 999, hash: 'H4SH', expires: 1770000000 };</script>",
      basliklar: { 'content-type': 'text/html' },
    })],
    [/lookmovie2\.la\/api\/v1\/security\/movie-access\?id_movie=999&hash=H4SH&expires=1770000000/, () => ({ govde: LM_AKIS() })],
  ]);
  try {
    const yayinlar = await getStreams('tt1375666', 'movie', 1, 1);
    assert.ok(Array.isArray(yayinlar) && yayinlar.length >= 1, 'en az bir yayın beklenir');
    for (const y of yayinlar) {
      assert.match(y.url, /\.m3u8(\?|$)/, 'doğrudan m3u8 olmalı');
      assert.ok(!/\/(embed|iframe|player|watch)\//i.test(y.url), 'iframe yasak');
      assert.match(`${y.title} ${y.quality}`, /altyazı/i, 'dil işareti (Altyazı) zorunlu');
      assert.equal(y.format, 'm3u8');
    }
    // kalite sırası: 1080p ilk olmalı
    assert.match(yayinlar[0].url, /master\.m3u8/);
    // TR altyazı mutlak adrese çevrilmiş ve yalnız TR/EN tutulmuş olmalı
    const tr = (yayinlar[0].subtitles || []).find(s => /türkçe/i.test(s.label || ''));
    assert.ok(tr && /^https?:\/\//.test(tr.src), 'TR altyazı mutlak URL olmalı');
    assert.ok(!(yayinlar[0].subtitles || []).some(s => /portug/i.test(JSON.stringify(s))), 'ilgisiz dil elenmeli');
    // arama aday başlıklarla (orijinal TR önce) yapılmalı
    assert.ok(istekler.some(i => /do-search\/\?q=(Fight%20Club|D%C3%B6v%C3%BC%C5%9F)/.test(i.adres)), 'başlıkla arama yapılmalı');
  } finally { geriAl(); }
});

test('Mystique tv: sezon/bölüm bloğundan id_episode bulur ve akışı döndürür', async () => {
  lmTohumla('tv');
  const { default: getStreams } = await import('../src/providers/cekirdekler/mystique.js');
  const html = `<script>
    var e1 = { id_episode: 111, season: '2', episode: '4' };
    var e2 = { id_episode: 222, season: '2', episode: '5' };
    var playerOptions = { hash: "ABC", expires: 1770000099 };
  </script>`;
  const { geriAl } = fetchEnjekte([
    [/lookmovie2\.la\/api\/v1\/shows\/do-search/, () => ({ govde: { result: [{ id_show: 77, slug: 'fight-club-show' }] } })],
    [/lookmovie2\.la\/shows\/play\//, () => ({ govde: html, basliklar: { 'content-type': 'text/html' } })],
    [/lookmovie2\.la\/api\/v1\/security\/episode-access\?id_episode=222&hash=ABC&expires=1770000099/, () => ({ govde: LM_AKIS('https://srv2.meatort.site/hls/222/master.m3u8?x=1') })],
  ]);
  try {
    const yayinlar = await getStreams('550', 'tv', 2, 5);
    assert.ok(yayinlar.length >= 1, 'S2B5 akışı beklenir');
    assert.match(yayinlar[0].url, /\/hls\/222\/master\.m3u8/, 'doğru bölüm akışı seçilmeli');
    assert.match(`${yayinlar[0].title}`, /altyazı/i);
  } finally { geriAl(); }
});

test('Mystique hata: 500 / boş / bozuk yanıt → [] ve throw yok', async () => {
  lmTohumla('movie');
  const { default: getStreams } = await import('../src/providers/cekirdekler/mystique.js');
  for (const rotalar of [
    [[/do-search/, () => ({ durum: 500 })]],
    [[/do-search/, () => ({ govde: { result: [] } })]],
    [[/do-search/, () => ({ govde: { result: [{ id_movie: 1, slug: 'x' }] } })], [/\/movies\/play\//, () => ({ govde: 'bozuk html', basliklar: { 'content-type': 'text/html' } })]],
    [[/do-search/, () => ({ govde: { result: [{ id_movie: 1, slug: 'x' }] } })], [/\/movies\/play\//, () => ({ govde: "hash: 'h', expires: 1, id_movie: 1", basliklar: { 'content-type': 'text/html' } })], [/security\/movie-access/, () => ({ durum: 500 })]],
    [[/do-search/, () => new Promise((_, reddet) => reddet(new Error('timeout-sahtesi')))]],
  ]) {
    const { geriAl } = fetchEnjekte(rotalar);
    try {
      const yayinlar = await getStreams('tt1375666', 'movie', 1, 1);
      assert.ok(Array.isArray(yayinlar) && yayinlar.length === 0, 'hata durumunda boş dizi beklenir');
    } finally { geriAl(); }
  }
});

test('Mystique: desteklenmeyen kimlik/başlık boş dizi döner (ağ isteği bile olmaz)', async () => {
  const { default: getStreams } = await import('../src/providers/cekirdekler/mystique.js');
  const { istekler, geriAl } = fetchEnjekte([]);
  try {
    assert.deepEqual(await getStreams('', 'movie'), []);
    assert.deepEqual(await getStreams('uydurma-kimlik', 'movie'), []);
    assert.equal(istekler.filter(i => !/themoviedb/.test(i.adres)).length, 0, 'çöp kimlikle siteye gidilmemeli');
  } finally { geriAl(); }
});

/* ── Gambit: TVR / RecTV hosted API ────────────────────────────────────── */

/** Eylül servisiyle AYNI AES-256-GCM şemasıyla şifreler: IV(12) + CT + TAG. */
function rtvSifrele(duzMetin) {
  const anahtar = Buffer.from(STREAM_ENC_KEY_HEX, 'hex');
  const iv = Buffer.from('0123456789ab', 'utf8');
  const sifir = createCipheriv('aes-256-gcm', anahtar, iv);
  const ct = Buffer.concat([sifir.update(duzMetin, 'utf8'), sifir.final()]);
  return Buffer.concat([iv, ct, sifir.getAuthTag()]).toString('base64');
}

function rtvTohumla(tur = 'movie') {
  tmdbBilgiTohumla({
    tmdbId: '550', imdbId: 'tt1375666', baslik: 'Dövüş Kulübü',
    orijinal: 'Fight Club', yil: 1999, tur,
  });
}

const RTV_BASE = (x = []) => x;

test('Gambit movie: HMAC imzalı aramadan AES-şifreli m3u8 çözer, dil işaretleri doğru', async () => {
  rtvTohumla('movie');
  const { default: getStreams } = await import('../src/providers/cekirdekler/gambit.js');
  const dubUrl = 'https://cdn.tvr-host.example/movie/1/dub/master.m3u8';
  const subUrl = 'https://cdn.tvr-host.example/movie/1/sub/master.m3u8';
  const posters = {
    posters: [{
      id: 42,
      title: 'Fight Club',
      type: 'movie',
      sources: [
        { id: 'a', enc_url: rtvSifrele(subUrl), title: 'Altyazılı' },
        { id: 'b', enc_url: rtvSifrele(dubUrl), title: 'Türkçe Dublaj' },
      ],
    }],
  };
  const { istekler, geriAl } = fetchEnjekte([
    [/a\.prectv70\.lol\/api\/attest\/nonce/, () => ({ govde: { nonce: Buffer.from('nonce-bytes').toString('base64url') } })],
    [/a\.prectv70\.lol\/api\/attest\/verify/, () => ({ govde: { jwt: 'SAHTE-JWT', exp: Math.floor(Date.now() / 1000) + 7200 } })],
    [/a\.prectv70\.lol\/api\/search\//, () => ({ govde: posters })],
  ]);
  try {
    const yayinlar = await getStreams('tt1375666', 'movie', 1, 1);
    assert.equal(yayinlar.length, 2, 'iki kaynak satırı beklenir');
    const urls = yayinlar.map(y => y.url).sort();
    assert.deepEqual(urls, [dubUrl, subUrl].sort(), 'şifre çözme düz adresi vermelidir');
    for (const y of yayinlar) {
      assert.equal(y.format, 'm3u8');
      assert.match(`${y.title}`, /altyazı|dublaj/i, 'dil işareti zorunlu');
    }
    assert.match(yayinlar.find(y => y.url === dubUrl).title, /dublaj/i);
    assert.match(yayinlar.find(y => y.url === subUrl).title, /altyazı/i);
    // HMAC başlıkları GERÇEKTEN gönderilmiş olmalı
    const arama = istekler.find(i => /\/api\/search\//.test(i.adres));
    assert.ok(arama, 'arama isteği görüldü');
    const basliklar = arama.sekenek.headers || {};
    const oku = ad => Object.entries(basliklar).find(([k]) => k.toLowerCase() === ad)?.[1];
    assert.ok(oku('x-signature') && oku('x-timestamp') && oku('x-nonce'), 'HMAC imza başlıkları gönderilmeli');
    assert.ok(/SW|KEY|[a-f0-9\/-]{20,}/i.test(arama.adres), 'arama SW_KEY rotası üzerinden gitmeli');
    assert.ok(/okhttp/i.test(oku('user-agent') || ''), 'okhttp UA taklit edilmeli');
  } finally { geriAl(); }
});

test('Gambit tv: sezon→bölüm→kaynak zinciri doğru S/B seçer', async () => {
  rtvTohumla('tv');
  const { default: getStreams } = await import('../src/providers/cekirdekler/gambit.js');
  const hedef = 'https://cdn.tvr-host.example/ep/9/master.m3u8';
  const { geriAl } = fetchEnjekte([
    [/a\.prectv70\.lol\/api\/attest\/nonce/, () => ({ durum: 500 })], // kimlik doğrulama düşse de akış sürer
    [/a\.prectv70\.lol\/api\/search\//, () => ({ govde: { posters: [{ id: 8, title: 'Fight Club Show', type: 'serie' }] } })],
    [/a\.prectv70\.lol\/api\/season\/by\/serie\/8\//, () => ({ govde: [{ id: 's2', title: 'Sezon 2' }] })],
    [/a\.prectv70\.lol\/api\/episode\/by\/season\/s2\//, () => ({ govde: [{ id: 'e9', title: '9. Bölüm', number: 9 }] })],
    [/a\.prectv70\.lol\/api\/source\/by\/episode\/e9\//, () => ({ govde: { sources: [{ id: 'q', enc_url: rtvSifrele(hedef), title: '' }] } })],
  ]);
  try {
    // 'Fight Club Show' tam başlık değil → isStrictMediaTitleMatch eşiği;
    // slugPuani/strict eşleşme 'Fight Club' aramasının sonucunu kabul etmeli.
    const yayinlar = await getStreams('550', 'tv', 2, 9);
    assert.ok(yayinlar.length >= 1, 'S2B9 akışı beklenir');
    assert.equal(yayinlar[0].url, hedef);
    assert.match(yayinlar[0].title, /altyazı/i);
  } finally { geriAl(); }
});

test('Gambit hata: arama 500 / boş poster / eşleşmeyen başlık → [] throw yok', async () => {
  rtvTohumla('movie');
  const { default: getStreams } = await import('../src/providers/cekirdekler/gambit.js');
  for (const rotalar of [
    [[/\/api\/search\//, () => ({ durum: 500 })]],
    [[/\/api\/search\//, () => ({ govde: { posters: [] } })]],
    [[/\/api\/search\//, () => ({ govde: { posters: [{ id: 1, title: 'Tamamen Başka Bir Film', type: 'movie', sources: [{ id: 'x', url: 'https://x.example/a.m3u8' }] }] } })]],
    [[/\/api\/search\//, () => new Promise((_, reddet) => reddet(new Error(' kopru-copy down')))]],
  ]) {
    const { geriAl } = fetchEnjekte(RTV_BASE(rotalar));
    try {
      const yayinlar = await getStreams('tt1375666', 'movie', 1, 1);
      assert.ok(Array.isArray(yayinlar) && yayinlar.length === 0, 'hata durumunda boş dizi');
    } finally { geriAl(); }
  }
});

test('Gambit: yanlış tür ve boş kimlik erken düşer', async () => {
  const { default: getStreams } = await import('../src/providers/cekirdekler/gambit.js');
  const { geriAl } = fetchEnjekte([]);
  try {
    assert.deepEqual(await getStreams('', 'movie'), []);
    assert.deepEqual(await getStreams('uydurma', 'tv', 1, 1), []);
  } finally { geriAl(); }
});

/* ── Eylül'de olmayanın kanıtı: SmashyStream kaydedilmedi ──────────────── */

test('SmashyStream geri KAYDEDİLMEDİ: repoda kullanıcı anahtarı yok, kayit.js\'te satır yok', () => {
  // Eylül kodu (git show 6baa792:src/services/smashyStreamService.js) yalnız
  // vidsrc.me / player.smashystream.com IFRAME adresi üretiyordu; API anahtarı
  // kullanmıyordu. Smashy'nin gerçek hosted API'si hesap anahtarı ister; repoda
  // (kod + .env) anahtar izi yok → kayda alınmaz (gömülü/sahte anahtar uydurulmaz).
  assert.ok(![...KAYIT.keys()].some(ad => /smashy/i.test(ad)), 'smashy kaydı olmamalı');
  const env = fs.existsSync(new URL('../.env', import.meta.url))
    ? fs.readFileSync(new URL('../.env', import.meta.url), 'utf8') : '';
  assert.ok(!/smashy/i.test(env), '.env\'de smashy anahtarı olmamalı');
});
