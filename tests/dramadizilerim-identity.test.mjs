/* Rhea (dramadizilerim) kimlik kapısı + altyazı sözleşmesi — offline testler.
   Canlı ölçüm özeti (2026-10): q=Kral → 48 kırpık kart; /izle/<olmayan> → 404;
   embed.php'de _captionUrl örneklerin tümde boş; m3u8'de TYPE=SUBTITLES yok. */
import test from 'node:test';
import assert from 'node:assert/strict';
import {
  identityKey,
  extractYearFromText,
  shortDramaIdentityMatch,
  extractCaptionTracks,
  looksLikeCaption,
  fetchDramaDizilerimEpisodeSources
} from '../src/services/kaynak/dramaDizilerimScraper.js';

// ── Kimlik kapısı (saf) ─────────────────────────────────────────────────────
test('identityKey: Türkçe duyarsız, noktalama boşluk, gürültü kelimeler atık', () => {
  assert.equal(identityKey('Küçük Tanrıça Lulu'), identityKey('kucuk tanrica  lulu!'));
  assert.equal(identityKey('Aşk-ı Memnu'), 'ask memnu');
  assert.equal(identityKey('ÖLÜMCÜL AV: İLK KAN'), 'olumcul av ilk kan');
  assert.equal(identityKey('Kral Full HD İzle Dublaj'), 'kral');
});

test('kapı: substring/inner eşleşme YETERLİ değildir (ihbar senaryoları)', () => {
  assert.equal(shortDramaIdentityMatch('Kraliçenin Kanı', ['Kral']), false);
  assert.equal(shortDramaIdentityMatch('Kralın Hekim Gelini', ['Kral']), false);
  assert.equal(shortDramaIdentityMatch('River', ['Riverdale']), false);
  assert.equal(shortDramaIdentityMatch('Breaking Bad: El Camino', ['Breaking Bad']), false);
  assert.equal(shortDramaIdentityMatch('Aşk', ['Aşk-ı Memnu']), false);
});

test('kapı: normalize tam eşleşme geçer (site süsleri toleranslı)', () => {
  assert.equal(shortDramaIdentityMatch('Küçük Tanrıça Lulu', ['Küçük Tanrıça Lulu']), true);
  assert.equal(shortDramaIdentityMatch('KRAL FULL HD', ['Kral']), true);
  assert.equal(shortDramaIdentityMatch('Baba, Küçük Meleğin Gitti', ['Baba Küçük Meleğin Gitti']), true);
});

test('kapı: yıl hedefte bilinirken aday yılı ±1 dışında ise RED', () => {
  assert.equal(shortDramaIdentityMatch('Lulu 2020', ['Lulu'], 2024), false);
  assert.equal(shortDramaIdentityMatch('Lulu 2023', ['Lulu'], 2024), true);
  // Kaynakta yıl alanı yok (canlı ölçüm): adayda yıl yoksa tam başlık tek kapı.
  assert.equal(shortDramaIdentityMatch('Lulu', ['Lulu'], 2024), true);
  assert.equal(shortDramaIdentityMatch('Lulu Prenses', ['Lulu'], 2024), false);
});

test('yıl çıkarıcı: 19xx/20xx', () => {
  assert.equal(extractYearFromText('Kral 2023'), 2023);
  assert.equal(extractYearFromText('Kral 1080p'), null);
  assert.equal(extractYearFromText('Kral'), null);
});

// ── Altyazı sözleşmesi (kit.js kalıbı: {url, src, label, language, headers}) ─
test('extractCaptionTracks: boş _captionUrl → hiç altyazı (ölü kaynak yok)', () => {
  assert.deepEqual(extractCaptionTracks('window._captionUrl = "";'), []);
  assert.deepEqual(extractCaptionTracks('<html>hiç yok</html>'), []);
});

test('extractCaptionTracks: dolu ise mutlak + kit sözleşmesi', () => {
  const subs = extractCaptionTracks(`
    window._captionUrl = "/uploads/sub/lulu-tr.vtt";
    window._captionLabel = "Türkçe";
    window._captionLang = "tr";`);
  assert.equal(subs.length, 1);
  assert.equal(subs[0].src, 'https://dramadizilerim.com/uploads/sub/lulu-tr.vtt');
  assert.equal(subs[0].url, subs[0].src);
  assert.equal(subs[0].label, 'Türkçe');
  assert.equal(subs[0].language, 'tr');
  assert.equal(subs[0].headers.Referer, 'https://dramadizilerim.com/');
});

test('looksLikeCaption: yalnız WebVTT/SRT geçer; HTML/XML/red', () => {
  assert.equal(looksLikeCaption('WEBVTT\n\n00:00.000 --> 00:02.000\nMerhaba'), true);
  assert.equal(looksLikeCaption('1\n00:00:01,000 --> 00:00:03,000\nSelam'), true);
  assert.equal(looksLikeCaption('<!DOCTYPE html><html>proxy login</html>'), false);
  assert.equal(looksLikeCaption('WEBVTT', 'text/html; charset=UTF-8'), false);
  assert.equal(looksLikeCaption(''), false);
});

// ── Uçtan uca kapı (mock fetch ile A/B) ─────────────────────────────────────
const card = (slug, title) =>
  `<a href="https://dramadizilerim.com/dizi/${slug}"><img src="/p.jpg" alt="${title}"></a>`;
const searchHtml = cards => `<body>${cards.map(c => card(c[0], c[1])).join('')}</body>`;
const watchHtml = title =>
  `<html><head><title>${title} 1. Bölüm Full HD İzle | Drama Dizilerim</title></head>
   <body><iframe data-src="/embed.php?ct=x&video_id=1&episode=1"></iframe></body></html>`;
const embedHtml = (source, captionUrl = '') =>
  `<html><body><script>window._captionUrl = "${captionUrl}"; window._captionLabel = "Türkçe";
   let source = "${source}";</script></body></html>`;
const VTT = 'WEBVTT\n\n00:00:00.000 --> 00:00:02.000\nMerhaba dünya\n';

function mockSite({ watchPages = {}, captions = {} }) {
  const requests = [];
  const prev = globalThis.fetch;
  globalThis.fetch = async (input, init = {}) => {
    const url = String(input);
    requests.push(url);
    const path = url.replace('https://dramadizilerim.com', '');
    if (path.startsWith('/search?q=')) {
      const q = decodeURIComponent(path.split('q=')[1] || '').toLowerCase();
      if (q.includes('kral')) {
        return new Response(searchHtml([
          ['kralicenin-kani', 'Kraliçenin Kanı'],
          ['kralin-hekim-gelini', 'Kralın Hekim Gelini'],
          ['kraliyet-aski', 'Kraliyet Aşkı Kalbimi Okuyan Prens']
        ]));
      }
      if (q.includes('tanr')) {
        return new Response(searchHtml([
          ['kraldan-kral-kucuk-tanrica-lulu', 'Kraldan Kral Küçük Tanrıça Lulu'],
          ['kucuk-tanrica-lulu', 'Küçük Tanrıça Lulu']
        ]));
      }
      return new Response(searchHtml([]));
    }
    if (path.startsWith('/izle/')) {
      const slug = path.split('/izle/')[1].split('?')[0];
      if (watchPages[slug] !== undefined) {
        return new Response(init.method === 'HEAD' ? null : watchHtml(watchPages[slug]), { status: 200 });
      }
      return new Response('🍿 Bu Sayfa Senaryodan Çıkarıldı!', { status: 404 });
    }
    if (path.startsWith('/embed.php')) {
      return new Response(embedHtml('https://cdn.example/x.m3u8', captions.__embed || ''));
    }
    if (path.startsWith('/uploads/')) {
      if (captions[path] !== undefined) {
        return new Response(captions[path].body, {
          status: 200,
          headers: { 'content-type': captions[path].ct }
        });
      }
      return new Response('not found', { status: 404 });
    }
    return new Response('not found', { status: 404 });
  };
  return { requests, restore: () => { globalThis.fetch = prev; } };
}

test('A/B-öncesi davranış taklidi: "Kral" normal dizisi → 0 kaynak (kapı keser)', async () => {
  const m = mockSite({ watchPages: {} });
  try {
    const streams = await fetchDramaDizilerimEpisodeSources({
      titles: ['Kral', 'Kral'], seriesTitle: 'Kral', season: 1, episode: 1
    });
    assert.equal(streams.length, 0, JSON.stringify(m.requests));
  } finally { m.restore(); }
});

test('A/B-öncesi: "Breaking Bad" → HEAD 404 + arama boş → 0 kaynak', async () => {
  const m = mockSite({ watchPages: {} });
  try {
    const streams = await fetchDramaDizilerimEpisodeSources({
      titles: ['Breaking Bad'], seriesTitle: 'Breaking Bad', year: 2008, season: 1, episode: 1
    });
    assert.equal(streams.length, 0);
  } finally { m.restore(); }
});

test('gerçek kısa dizi: kaynak döner, sayfa başlığı kimlik denetiminden geçer', async () => {
  const m = mockSite({ watchPages: { 'kucuk-tanrica-lulu': 'Küçük Tanrıça Lulu' } });
  try {
    const streams = await fetchDramaDizilerimEpisodeSources({
      titles: ['Küçük Tanrıça Lulu'], seriesTitle: 'Küçük Tanrıça Lulu', season: 1, episode: 1
    });
    assert.equal(streams.length, 1);
    assert.match(streams[0].id, /^ddz_ep_kucuk-tanrica-lulu_1_1$/);
    assert.ok(Array.isArray(streams[0].subtitles), 'subtitles alanı her zaman dizi olmalı');
    assert.equal(streams[0].subtitles.length, 0, 'site altyazı vermiyorsa ölü altyazı eklenmez');
  } finally { m.restore(); }
});

test('hızlı slug eşiğinde bile sayfa başlığı kapıyı geçemezse 0 kaynak', async () => {
  // /izle/kucuk-tanrica-lulu 200 döner ama sayfa BAŞKA bir yayının başlığını taşır.
  const m = mockSite({ watchPages: { 'kucuk-tanrica-lulu': 'Kraliçenin Kanı' } });
  try {
    const streams = await fetchDramaDizilerimEpisodeSources({
      titles: ['Küçük Tanrıça Lulu'], seriesTitle: 'Küçük Tanrıça Lulu', season: 1, episode: 1
    });
    assert.equal(streams.length, 0);
  } finally { m.restore(); }
});

test('altyazı: gerçek VTT dönen uç eklenir; HTML dönen uç listelenmez', async () => {
  const good = { __embed: '/uploads/sub/lulu-tr.vtt', '/uploads/sub/lulu-tr.vtt': { body: VTT, ct: 'text/vtt' } };
  const m = mockSite({ watchPages: { 'kucuk-tanrica-lulu': 'Küçük Tanrıça Lulu' }, captions: good });
  try {
    const streams = await fetchDramaDizilerimEpisodeSources({
      titles: ['Küçük Tanrıça Lulu'], seriesTitle: 'Küçük Tanrıça Lulu', season: 1, episode: 1
    });
    assert.equal(streams.length, 1);
    assert.equal(streams[0].subtitles.length, 1);
    assert.equal(streams[0].subtitles[0].src, 'https://dramadizilerim.com/uploads/sub/lulu-tr.vtt');
    assert.equal(streams[0].subtitles[0].label, 'Türkçe');
  } finally { m.restore(); }

  const bad = { __embed: '/uploads/sub/lulu-tr.vtt', '/uploads/sub/lulu-tr.vtt': { body: '<!DOCTYPE html><html>cf</html>', ct: 'text/html; charset=UTF-8' } };
  const m2 = mockSite({ watchPages: { 'kucuk-tanrica-lulu': 'Küçük Tanrıça Lulu' }, captions: bad });
  try {
    const streams = await fetchDramaDizilerimEpisodeSources({
      titles: ['Küçük Tanrıça Lulu'], seriesTitle: 'Küçük Tanrıça Lulu', season: 1, episode: 1
    });
    assert.equal(streams.length, 1);
    assert.equal(streams[0].subtitles.length, 0, 'HTML dönen altyazı ucu asla listelenmez');
  } finally { m2.restore(); }
});
