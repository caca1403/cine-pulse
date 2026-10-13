/* ==========================================================================
   NIMBUS — JetFilmizle  (sıfırdan, Nuvio/Patron akışı)

   Adımlar (Patron `patronJetFilmizle` ile aynı amaç, kendi akışımız):
     1. Alan adı: siteurl.txt (jetfilm) → bilinen adresler
     2. HIZLI YOL: videopark jetembed API'si — imdbId ile doğrudan
        sunucu listesi (/jetembed/backend/api_sources.php?imdb=…)
     3. ANA YOL: arama (GET /arama?q=) → içerik sayfası → film_id +
        player-source-btn düğmeleri → POST /jetplayer → iframe adresleri
     4. Oynatıcılar: videopark apollo (POST get_video.php → hlsUrl),
        videopark titan (sayfadaki _sd JSON'u), jetembed API,
        diğer gömülenler → embedExtractors (iframe kalanlar ATILIR)
     5. Yalnızca doğrudan m3u8/mp4 listelenir; Referer = oynatıcı kökü.
   ========================================================================== */

import {
  istek, gonder, izleyici, mutlak, koken, medyaMi, kaynak,
  temizBaslik, slugla, baslikEslesir, duzMetin, alanAdiCoz,
} from './kit.js';
import { extractEmbedStream } from '../services/embedExtractors.js';

const BILINEN = ['https://jetfilmizle.now'];
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
const PLAYER_UA = 'okhttp/4.9.2';
const VP = 'https://videopark.top';

export const kimlik = { id: 'jet', alias: 'Nimbus', mediaTypes: ['movie', 'tv'] };

const kartAdi = (s) => String(duzMetin(s) || '').toLowerCase()
  .replace(/\b(full|hd|1080p| Türkçe Dublaj İzle| Türkçe Altyazılı İzle|İzle)\b/gi, ' ')
  .replace(/\b(türkçe dublaj|turkce dublaj|dublaj|altyazılı|altyazili)\b/gi, ' ')
  .replace(/\b(izle|sezon \d+|bölüm \d+)\b/gi, ' ')
  .replace(/[^a-z0-9çğıöşü ]/g, ' ').replace(/\s+/g, ' ').trim();

/* ── arama sonuçları: kart → {url, ad} ───────────────────────────────── */
function aramaKartlari(html, base) {
  const cikar = [];
  const gorulen = new Set();
  const ekle = (href, ad) => {
    const url = mutlak(href, base);
    if (!url || gorulen.has(url) || !/\/(film|dizi)\//.test(url)) return;
    gorulen.add(url);
    cikar.push({ url, ad: kartAdi(ad) });
  };
  // .film-card kutuları (href + title birlikteliği)
  for (const m of String(html).matchAll(/class="[^"]*film-card[\s\S]{0,900}?<a\b[^>]*href="([^"]+)"[^>]*title="([^"]+)"/gi)) ekle(m[1], m[2]);
  // yedek: başlıklı tüm içerik bağlantıları
  if (!cikar.length) {
    for (const m of String(html).matchAll(/<a\b[^>]*href="(https?:\/\/[^"]+\/(?:film|dizi)\/[^"]+)"[^>]*title="([^"]+)"/gi)) ekle(m[1], m[2]);
  }
  return cikar;
}

function secKart(kartlar, adayAdlar, isFilm) {
  const turIyi = (k) => (isFilm ? /\/film\//.test(k.url) : /\/dizi\//.test(k.url));
  return kartlar.find((k) => turIyi(k) && adayAdlar.some((a) => baslikEslesir(a, [k.ad]))) || null;
}

/* ── oynatıcı düğmeleri (çok satırlı attribute'lar dahil) ─────────────── */
function oynaticiDugmeleri(html) {
  const dugmeler = [];
  const gorulen = new Set();
  for (const m of String(html).matchAll(/<button\b[\s\S]{0,600}?player-source-btn[\s\S]{0,600}?>/g)) {
    const tag = m[0];
    const attr = (a) => (tag.match(new RegExp(`data-${a}="([^"]+)"`, 'i')) || [])[1] || '';
    const idx = attr('source-index');
    const tip = (attr('player-type') || 'genel').toLowerCase();
    if (idx === '' || gorulen.has(`${tip}:${idx}`)) continue;
    gorulen.add(`${tip}:${idx}`);
    dugmeler.push({ index: +idx, tip, sezon: +attr('season') || 1, bolum: +attr('episode') || 1 });
  }
  return dugmeler;
}

/* ── /jetplayer POST → iframe adresi ──────────────────────────────────── */
async function jetplayerIframe(base, filmId, dugme, contentUrl, trace) {
  const govde = await gonder(`${base}/jetplayer`, `film_id=${filmId}&source_index=${dugme.index}&player_type=${dugme.tip}`, {
    ref: contentUrl, trace, timeout: 8000,
    headers: { 'User-Agent': UA, 'X-Requested-With': 'XMLHttpRequest' },
  });
  const src = (String(govde).match(/<iframe\b[^>]*src=['"]([^'"]+)['"]/i) || [])[1] || '';
  return src ? mutlak(src, base) : '';
}

/* ── videopark apollo: POST get_video.php → hlsUrl (doğrudan HLS) ─────── */
async function apolloCoz(embedUrl, trace) {
  const id = (embedUrl.match(/[?&]id=([\w-]+)/) || [])[1] || '';
  if (!id) return null;
  const govde = await gonder(`${VP}/apollo/get_video.php`, `id=${id}`, {
    ref: embedUrl, trace, timeout: 8000,
    headers: { 'User-Agent': UA, 'X-Requested-With': 'XMLHttpRequest' },
  });
  try {
    const hls = JSON.parse(govde)?.hlsUrl || '';
    if (!hls) return null;
    return { url: mutlak(hls, `${VP}/apollo/`), altyazilar: [], uzantisiz: !medyaMi(hls) };
  } catch (_) { return null; }
}

/* ── videopark titan: sayfadaki `_sd` JSON'u → stream_url + altyazılar ── */
async function titanCoz(embedUrl, trace) {
  const html = await istek(embedUrl, { ref: embedUrl, headers: { 'User-Agent': UA }, trace, timeout: 9000, webView: false });
  const m = String(html).match(/var\s+_sd\s*=\s*(\{[\s\S]*?\});/);
  if (!m) return null;
  let sd = null;
  try { sd = JSON.parse(m[1]); } catch (_) { return null; }
  if (!sd?.stream_url) return null;
  const altyazilar = (sd.subtitles || [])
    .filter((t) => t?.file && !/forced/i.test(t.label || ''))
    .map((t) => ({
      url: t.file, src: t.file, label: t.label || 'Altyazı',
      language: /türk|turk/i.test(t.label || '') ? 'tr' : (/ing|eng/i.test(t.label || '') ? 'en' : ''),
      headers: { Referer: `${VP}/`, 'User-Agent': UA, Accept: '*/*' },
    }));
  return { url: sd.stream_url, altyazilar, uzantisiz: !medyaMi(sd.stream_url) };
}

/* ── videopark jetembed API'si (imdb → sunucu listesi) ────────────────── */
async function jetembedSunuculari(imdb, isFilm, s, e, trace) {
  const q = isFilm ? `imdb=${encodeURIComponent(imdb)}` : `imdb=${encodeURIComponent(imdb)}&type=tv&season=${s}&episode=${e}`;
  const ham = await istek(`${VP}/jetembed/backend/api_sources.php?${q}`, {
    ref: `${VP}/`, headers: { 'User-Agent': UA }, trace, timeout: 8000, webView: false,
  });
  try {
    const d = JSON.parse(ham);
    return (Array.isArray(d?.sources) ? d.sources : [])
      .filter((x) => x?.url && !/videopark/.test(x.url))
      .sort((a, b) => (b.priority_score || 0) - (a.priority_score || 0))
      .slice(0, 6)
      .map((x) => ({ ad: String(x.name || 'Sunucu').slice(0, 14), url: x.url }));
  } catch (_) { return []; }
}

/* ── tek gömüleni doğrudan yayına çevir (iframe ASLA dönmez) ──────────── */
async function gomulenCoz(embedUrl, referer, trace, bitis) {
  if (/videopark\.top\/apollo\//.test(embedUrl)) return apolloCoz(embedUrl, trace);
  if (/videopark\.top\/titan\//.test(embedUrl)) return titanCoz(embedUrl, trace);
  if (/videopark\.top\/jetembed\//.test(embedUrl)) return null; // jetembed API'si hızlı yolda deneniyor
  const x = await extractEmbedStream(embedUrl, referer, new Set(), bitis);
  if (!x || x.isIframe) return null;
  if (!(medyaMi(x.url) || /master\.txt/i.test(x.url))) return null;
  return { url: x.url, altyazilar: x.subtitles || [], uzantisiz: !medyaMi(x.url) };
}

/* ── ortak kaynak kaydı ───────────────────────────────────────────────── */

/** Kabul edilebilir yayın adresi. DELİK KAPANDI (ölçüldü): `uzantisiz`
 *  yüzünden `…workers.dev/e/<token>` gömülü sayfası (403) isHls etiketiyle
 *  listeleniyordu. Yalnız `/apollo/hls/` (ölçülmüş HLS) veya açık
 *  `.m3u8`/`.mp4`/`master.txt` desenleri kabul edilir; `/e/` yolları ATILIR. */
function yayinKabulMi(url) {
  const u = String(url || '');
  if (/\/e\//i.test(u)) return false;
  // boş şablon sorgusu (ölçüldü: `master.m3u8?q=` → 404 HTML dönüyordu)
  if (/[?&][A-Za-z_][\w.-]*=(&|$)/.test(u)) return false;
  return /\/apollo\/hls\//i.test(u) || /\.(m3u8|mp4)(\?|#|$)/i.test(u) || /master\.txt/i.test(u);
}

function kaydedici(liste, gorulen) {
  return (r, ad, kategori) => {
    if (!r?.url || gorulen.has(r.url)) return;
    if (!yayinKabulMi(r.url)) return;
    gorulen.add(r.url);
    const ref = `${koken(r.url) || `${VP}/`}`;
    const k = kaynak({
      id: `jet_${gorulen.size}_${slugla(ad) || 'sunucu'}`, ad, url: r.url, kategori,
      headers: { Referer: `${ref}/`, 'User-Agent': PLAYER_UA, Accept: '*/*' },
      altyazilar: r.altyazilar || [], kalite: '1080p',
    });
    // apollo/hls ve master.txt adresleri uzantısız/`.txt` ama içerik HLS'tir;
    // oynatıcı türü baştan bilinen biçimde işaretlenir.
    const hls = /\.m3u8(\?|#|$)/i.test(r.url) || /master\.txt/i.test(r.url) || /\/apollo\/hls\//i.test(r.url);
    liste.push(hls ? { ...k, isHls: true, isDirectVideo: true } : k);
  };
}

export async function coz(args = {}) {
  // SERT BÜTÇE (ölçüldü: toplam 25 sn'ye çıkıyordu): 12 sn dolunca ne
  // bulduysak döner — arka plan çözümü askıda kalır, kullanıcı beklemez.
  const bas = Date.now();
  const BUTCE = 12000;
  const ctx = { trace: izleyici(), bas, bitis: bas + BUTCE, liste: [], gorulen: new Set() };
  const akis = anaAkis(args, ctx);
  akis.catch(() => { /* bütçe/ ağ hatası: birikeni döndürmek yeter */ });
  await Promise.race([akis, new Promise((r) => setTimeout(r, BUTCE))]);
  ctx.trace.koy('sonuc', { n: ctx.liste.length, ms: Date.now() - bas });
  return { sources: ctx.liste, trace: ctx.trace.ozet() };
}

async function anaAkis({ type = 'movie', title = '', originalTitle = '', titles = [], imdbId = null, season = 1, episode = 1 } = {}, ctx) {
  const trace = ctx.trace;
  const bas = ctx.bas;
  const bitis = ctx.bitis;
  const isFilm = type !== 'tv';
  const s = +season || 1, e = +episode || 1;
  const adAdaylari = [...new Set([title, originalTitle, ...titles].map(temizBaslik).filter(Boolean))];
  const base = await alanAdiCoz('jetfilm', BILINEN, { trace, ua: UA });
  const liste = ctx.liste;
  const gorulen = ctx.gorulen;
  const kaydet = kaydedici(liste, gorulen);

  // — 1. HIZLI YOL: imdb ile jetembed sunucuları — arka planda çözülür.
  // Süresi sıkıdır (≤8,5 sn): üçüncü taraf gömülenler yavaşsa ana yol
  // zaten sonucu getirir; hızlı yol toplam süreyi uzatamaz.
  const hizliBitis = bas + 8500;
  const hizliYol = (async () => {
    if (!imdbId) return;
    const sunucular = await jetembedSunuculari(imdbId, isFilm, s, e, trace);
    const yayinlar = await Promise.allSettled(sunucular.map((x) => gomulenCoz(x.url, `${base}/`, trace, hizliBitis)));
    sunucular.forEach((x, i) => {
      const r = yayinlar[i];
      if (r?.status === 'fulfilled' && r.value) kaydet(r.value, `Jet ${x.ad}`, 'subtitled');
    });
    trace.koy('hizli-yol', { sunucu: sunucular.length, toplam: liste.length, ms: Date.now() - bas });
  })();

  // — 2. ANA YOL: arama → içerik sayfası (film/dizi)
  let contentUrl = '';
  let pageHtml = '';
  for (const q of adAdaylari) {
    const ham = await istek(`${base}/arama?q=${encodeURIComponent(q)}`, {
      ref: `${base}/`, headers: { 'User-Agent': UA }, trace, timeout: 8000, webView: false,
    });
    const kartlar = aramaKartlari(ham, base);
    trace.koy('arama', { q, sonuc: kartlar.length });
    const kart = secKart(kartlar, adAdaylari, isFilm);
    if (kart) { contentUrl = kart.url; break; }
    if (Date.now() - bas > 9000) break;
  }
  if (!contentUrl) {
    // slug denemesi: arama popüler dizileri bazen listelemiyor
    for (const ad of [...new Set([slugla(originalTitle || ''), slugla(title || '')])].filter(Boolean)) {
      const yol = `${base}/${isFilm ? 'film' : 'dizi'}/${ad}`;
      const html = await istek(yol, { ref: `${base}/`, headers: { 'User-Agent': UA }, trace, timeout: 8000, webView: false });
      if (html && /player-source-btn/.test(html)) { contentUrl = yol; pageHtml = html; break; }
      if (Date.now() - bas > 11000) break;
    }
  }
  if (contentUrl && !pageHtml) {
    pageHtml = await istek(contentUrl, { ref: `${base}/`, headers: { 'User-Agent': UA }, trace, timeout: 8000, webView: false });
  }

  // — 3. içerik sayfası → film_id + düğme seçimi → jetplayer POST'ları
  const filmId = (String(pageHtml).match(/name="film_id"\s+value="(\d+)"/) || [])[1] || '';
  let dugmeler = oynaticiDugmeleri(pageHtml);
  if (!isFilm) dugmeler = dugmeler.filter((d) => d.sezon === s && d.bolum === e);
  const tipSayac = {};
  dugmeler = dugmeler.filter((d) => { tipSayac[d.tip] = (tipSayac[d.tip] || 0) + 1; return tipSayac[d.tip] <= 2; });
  trace.koy('icerik', { url: contentUrl, filmId: Boolean(filmId), dugme: dugmeler.length });

  if (filmId && dugmeler.length && contentUrl) {
    const iframeler = await Promise.allSettled(dugmeler.map((d) => jetplayerIframe(base, filmId, d, contentUrl, trace)));
    const acilan = dugmeler
      .map((d, i) => (iframeler[i].status === 'fulfilled' && iframeler[i].value ? { ...d, iframeUrl: iframeler[i].value } : null))
      .filter(Boolean);
    const yayinlar = await Promise.allSettled(acilan.map((a) => gomulenCoz(a.iframeUrl, contentUrl, trace, bitis)));
    acilan.forEach((a, i) => {
      const r = yayinlar[i];
      if (r?.status === 'fulfilled' && r.value) kaydet(r.value, `Jet ${a.tip === 'dublaj' ? 'Dublaj' : 'Altyazı'} ${a.index + 1}`, a.tip === 'dublaj' ? 'dubbed' : 'subtitled');
    });
    trace.koy('jetplayer', { oynatici: acilan.length, toplam: liste.length, ms: Date.now() - bas });
  }

  // Hızlı yolun sonucunu en fazla ~1,5 sn daha bekle; uzarsa kesilir.
  await Promise.race([hizliYol, new Promise((r) => setTimeout(r, 1500))]);
  trace.koy('sonuc', { n: liste.length, ms: Date.now() - bas });
  return { sources: liste, trace: trace.ozet() };
}

/** Sağlayıcı arayüzü (providerRuntime uyumu). */
export default {
  apiVersion: 1,
  id: kimlik.id,
  name: kimlik.alias,
  mediaTypes: kimlik.mediaTypes,
  async resolve(args) {
    const { sources } = await coz(args);
    return sources;
  },
};
