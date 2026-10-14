/* ==========================================================================
   SIRIUS — FullHDFilmizlesene  (sıfırdan, Nuvio/Patron akışı; yalnız film)

   Adımlar (Patron `patronFullHDFilmizlesene` ile aynı amaç):
     1. Alan adı: siteurl.txt (fullhdfilmizlesene) → bilinen adresler
     2. Arama:  /arama/{slug} → film kartları (film-title)
     3. Sayfadaki `scx = {…}` JSON'u → anahtar başına link listesi;
        her link rot13 + base64 ile açılır (atom/advid/proton/fast/…)
     4. Sunucu çözücüler: VidMoxy (hex file), TurboImgz, TRsTX (POST
        playlist), RapidVid (reverse+atob+K9L kaydırma), TurkeyPlayer,
        doğrudan m3u8/mp4; iframe kalanlar ATILIR
     5. Site Cloudflare challenge kullanır: hızlı yol başarısızsa tek
        istekte gizli tarayıcı (ORION'daki gibi son çare).
   ========================================================================== */

import {
  istek, gonder, izleyici, mutlak, koken, medyaMi, kaynak,
  temizBaslik, slugla, baslikEslesir, duzMetin, m3u8eCevir, alanAdiCoz, yilUyar,
} from './kit.js';
import { extractEmbedStream } from '../services/embedExtractors.js';

const BILINEN = ['https://www.fullhdfilmizlesene.now'];
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
const PLAYER_UA = 'okhttp/4.9.2';
const SCX_ANAHTARLAR = ['atom', 'advid', 'advidprox', 'proton', 'fast', 'fastly', 'tr', 'en'];

export const kimlik = { id: 'fhdf', alias: 'Sirius', mediaTypes: ['movie'] };

/* ── şifre açıcılar ───────────────────────────────────────────────────── */
function rot13(s) {
  return String(s).replace(/[a-zA-Z]/g, (c) => {
    const taban = c <= 'Z' ? 65 : 97;
    return String.fromCharCode(((c.charCodeAt(0) - taban + 13) % 26) + taban);
  });
}
function b64coz(s) {
  try { return atob(String(s).replace(/\s+/g, '')); } catch (_) { return ''; }
}
/** RapidVid `av()`: ters çevir → base64 → "K9L" anahtarıyla char kaydır → base64. */
function avCoz(kodlu) {
  try {
    const ters = b64coz(String(kodlu).split('').reverse().join(''));
    const anahtar = 'K9L';
    let kaydirilmis = '';
    for (let i = 0; i < ters.length; i++) {
      kaydirilmis += String.fromCharCode(ters.charCodeAt(i) - (anahtar.charCodeAt(i % anahtar.length) % 5 + 1));
    }
    return b64coz(kaydirilmis);
  } catch (_) { return ''; }
}

/* ── sayfadaki scx bloğu → {anahtar: [url, …]} ────────────────────────── */
function scxLinkleri(html) {
  const m = String(html).match(/scx\s*=\s*(\{[\s\S]*?\});/);
  if (!m) return [];
  let veri = null;
  try { veri = JSON.parse(m[1]); } catch (_) { return []; }
  const gruplar = [];
  for (const anahtar of SCX_ANAHTARLAR) {
    const t = veri?.[anahtar]?.sx?.t;
    if (!t) continue;
    const coz = (x) => b64coz(rot13(String(x)));
    const linkler = Array.isArray(t) ? [t.map(coz).filter(Boolean).join(',')]
      : typeof t === 'object' ? Object.values(t).filter((v) => typeof v === 'string').map(coz) : [];
    const acik = linkler.join(',').split(',').map((u) => u.trim()).filter((u) => /^https?:\/\//i.test(u));
    if (acik.length) gruplar.push({ anahtar, linkler: acik });
  }
  return gruplar;
}

/* ── arama sonuçları ──────────────────────────────────────────────────── */
function aramaKartlari(html, base) {
  const cikar = [];
  const gorulen = new Set();
  const ekle = (href, ad) => {
    const url = mutlak(href, base);
    if (!url || gorulen.has(url) || !/\/(film-izle|video-page)-?/i.test(url)) return;
    gorulen.add(url);
    cikar.push({ url, ad: duzMetin(ad) });
  };
  // birincil: li.film > a > span.film-title  (Patron kalıbı)
  for (const m of String(html).matchAll(/<li[^>]*class="[^"]*film[^"]*"[\s\S]{0,600}?<a[^>]*href="([^"]+)"[\s\S]{0,600}?<span[^>]*class="[^"]*film-title[^"]*"[^>]*>([^<]+)</gi)) ekle(m[1], m[2]);
  if (!cikar.length) {
    for (const m of String(html).matchAll(/<a\b[^>]*href="([^"]+)"[^>]*title="([^"]+)"/gi)) ekle(m[1], m[2]);
  }
  return cikar;
}

/* ── sunucu çözücüler (hepsi doğrudan yayın hedefler) ─────────────────── */
async function vidmoxyCoz(url, ref, trace, signal = null) {
  const html = await istek(url, { ref, headers: { 'User-Agent': UA }, trace, timeout: 9000, webView: false, signal });
  if (!html) return null;
  const altyazilar = [...String(html).matchAll(/captions","file":"([^"]+)","label":"([^"]+)"/g)]
    .map((m) => ({ url: m[1].replace(/\\/g, ''), src: m[1].replace(/\\/g, ''), label: m[2], language: 'tr', headers: { Referer: `${koken(url)}/`, 'User-Agent': UA } }));
  const hex = (String(html).match(/file":\s*"((?:\\x[0-9a-fA-F]{2})+)"/) || [])[1];
  let video = hex ? hex.split('\\x').filter(Boolean).map((h) => String.fromCharCode(parseInt(h, 16))).join('') : '';
  if (!video) video = ((String(html).match(/file":"([^"]+\.m3u8[^"]*)"/) || [])[1] || '').replace(/\\/g, '');
  return video ? { url: video, altyazilar } : null;
}

async function turboImgzCoz(url, ref, trace, signal = null) {
  const html = await istek(url.includes('||') ? url.split('||')[1] : url, { ref, headers: { 'User-Agent': UA }, trace, timeout: 9000, webView: false, signal });
  const t = String(html).match(/file:\s*"([^"]+)"/);
  return t ? { url: t[1] } : null;
}

async function trstxCoz(url, ref, trace, signal = null) {
  const taban = koken(url) || 'https://trstx.org';
  const html = await istek(url, { ref, headers: { 'User-Agent': UA }, trace, timeout: 9000, webView: false, signal });
  const yol = ((String(html).match(/file":"([^"]+)"/) || [])[1] || '').replace(/\\/g, '');
  if (!yol) return [];
  const ham = await gonder(`${taban}/${yol.replace(/^\/+/, '')}`, '', { ref, trace, timeout: 9000, headers: { 'User-Agent': UA }, signal });
  let liste = null;
  try { liste = JSON.parse(ham); } catch (_) { return []; }
  if (!Array.isArray(liste)) return [];
  const sonuc = [];
  for (const it of liste.slice(1, 4)) {
    if (!it?.title || !it?.file) continue;
    const m3u = await gonder(`${taban}/playlist/${it.file.replace(/^\//, '')}.txt`, '', { ref, trace, timeout: 8000, headers: { 'User-Agent': UA }, signal });
    const u = String(m3u || '').trim().split('\n').find((l) => /^https?:\/\//i.test(l.trim()));
    if (u) sonuc.push({ url: u.trim(), ad: it.title });
  }
  return sonuc;
}

async function rapidVidCoz(url, ref, trace, signal = null) {
  const html = await istek(url, { ref, headers: { 'User-Agent': UA }, trace, timeout: 9000, webView: false, signal });
  const kaynakBlok = (String(html).match(/jwSetup\.sources\s*=\s*([\s\S]*?);/) || [])[1] || '';
  const av = (kaynakBlok.match(/av\('([^']+)'\)/) || [])[1] || '';
  const video = av ? avCoz(av) : '';
  if (!video) return null;
  let altyazilar = [];
  try {
    const tracks = JSON.parse((String(html).match(/jwSetup\.tracks\s*=\s*(\[[\s\S]*?\]);/) || [])[1] || '[]');
    altyazilar = tracks.filter((t) => t?.file && t?.label).map((t) => ({ url: t.file.replace(/\\/g, ''), src: t.file.replace(/\\/g, ''), label: t.label, language: 'tr', headers: { Referer: `${koken(url)}/`, 'User-Agent': UA } }));
  } catch (_) { /* altyazısız olur */ }
  return { url: video, altyazilar };
}

async function turkeyPlayerCoz(url, ref, trace, signal = null) {
  const html = await istek(url, { ref, headers: { 'User-Agent': UA }, trace, timeout: 9000, webView: false, signal });
  let video = null;
  try { video = JSON.parse((String(html).match(/var\s+video\s*=\s*(\{[\s\S]*?\});/) || [])[1] || 'null'); } catch (_) { /* yok */ }
  if (!video?.id || !video?.md5) return null;
  return { url: `${koken(url) || 'https://watch.turkeyplayer.com'}/m3u8/8/${video.md5}/master.txt?s=1&id=${video.id}&cache=1` };
}

/** Tek gömüleni yayına çevirir; iframe/medya olmayan sonuç silinir. */
async function gomulenCoz(gomulen, ref, anahtar, trace, bitis, signal = null) {
  const u = String(gomulen || '');
  const sonuc = [];
  const itirafEt = (r, adEk) => {
    if (!r) return;
    const liste = Array.isArray(r) ? r : [r];
    for (const x of liste) {
      if (!x?.url) continue;
      const url = m3u8eCevir(mutlak(x.url, u));
      if (medyaMi(url)) sonuc.push({ url: x.url.includes('master.txt') ? x.url : url, ad: `${adEk} · ${x.ad || anahtar}`, altyazilar: x.altyazilar || [] });
    }
  };
  if (/vidmoxy\.com/.test(u)) itirafEt(await vidmoxyCoz(u, ref, trace, signal), 'VidMoxy');
  else if (/turbo\.imgz\./.test(u)) itirafEt(await turboImgzCoz(u, ref, trace, signal), 'TurboImgz');
  else if (/trstx\.org/.test(u)) itirafEt(await trstxCoz(u, ref, trace, signal), 'TRsTX');
  else if (/rapidvid\./.test(u)) itirafEt(await rapidVidCoz(u, ref, trace, signal), 'RapidVid');
  else if (/turkeyplayer\.com/.test(u)) itirafEt(await turkeyPlayerCoz(u, ref, trace, signal), 'TurkeyPlayer');
  else if (medyaMi(u)) sonuc.push({ url: u, ad: `Doğrudan · ${anahtar}`, altyazilar: [] });
  else {
    const x = await extractEmbedStream(u, ref, new Set(), bitis);
    if (x && !x.isIframe && medyaMi(x.url)) sonuc.push({ url: x.url, ad: `Gömülü · ${anahtar}`, altyazilar: x.subtitles || [] });
  }
  return sonuc;
}

export async function coz({ type = 'movie', title = '', originalTitle = '', titles = [], year = null, signal = null } = {}) {
  const trace = izleyici();
  const bas = Date.now();
  const bitis = bas + 14000;
  if (type === 'tv') { trace.koy('sonuc', { n: 0, not: 'movie-only' }); return { sources: [], trace: trace.ozet() }; }
  const adAdaylari = [...new Set([title, originalTitle, ...titles].map(temizBaslik).filter(Boolean))];
  const base = await alanAdiCoz('fullhdfilmizlesene', BILINEN, { trace, ua: UA });

  // — 1. arama (hızlı yol; CF challenge'lıysa tek istekte gizli tarayıcı)
  let contentUrl = '';
  let sayfa = '';
  const sorgular = [...new Set(adAdaylari.map((a) => slugla(a)).concat(adAdaylari).filter(Boolean))];
  for (const q of sorgular.slice(0, 3)) {
    const ham = await istek(`${base}/arama/${encodeURIComponent(q)}`, { ref: `${base}/`, headers: { 'User-Agent': UA }, trace, timeout: 9000, webView: false, signal });
    const kartlar = aramaKartlari(ham, base);
    trace.koy('arama', { q, sonuc: kartlar.length });
    const kart = kartlar.find((k) => adAdaylari.some((a) => baslikEslesir(a, [k.ad])) && yilUyar(year, k.ad));
    if (kart) { contentUrl = kart.url; break; }
    if (Date.now() - bas > 7000) break;
  }
  if (!contentUrl) {
    trace.koy('cf-son-care', { neden: 'arama boş — CF challenge olabilir' });
    const ham = await istek(`${base}/arama/${encodeURIComponent(slugla(adAdaylari[0] || '') || adAdaylari[0] || '')}`, {
      ref: `${base}/`, headers: { 'User-Agent': UA }, trace, timeout: 20000, webView: true, signal,
    });
    const kart = aramaKartlari(ham, base).find((k) => adAdaylari.some((a) => baslikEslesir(a, [k.ad])) && yilUyar(year, k.ad));
    if (kart) contentUrl = kart.url;
  }
  if (!contentUrl) { trace.koy('sonuc', { n: 0, ms: Date.now() - bas }); return { sources: [], trace: trace.ozet() }; }

  // — 2. film sayfası → scx linkleri
  sayfa = await istek(contentUrl, { ref: `${base}/`, headers: { 'User-Agent': UA }, trace, timeout: 9000, webView: false, signal });
  const gruplar = scxLinkleri(sayfa);
  trace.koy('scx', { grup: gruplar.length, url: contentUrl });

  // — 3. sunucuları paralel çöz (her anahtardan ilk 2 link)
  const islenecek = [];
  for (const g of gruplar) for (const link of g.linkler.slice(0, 2)) islenecek.push({ ...g, link });
  const cozumler = await Promise.allSettled(islenecek.map((x) => gomulenCoz(x.link, contentUrl, x.anahtar, trace, bitis, signal)));

  const liste = [];
  const gorulen = new Set();
  cozumler.forEach((r, i) => {
    if (r.status !== 'fulfilled') return;
    for (const y of r.value || []) {
      if (!y.url || gorulen.has(y.url) || !medyaMi(y.url)) continue;
      gorulen.add(y.url);
      const ref = `${koken(y.url) || base}/`;
      const dublaj = /dublaj|dub/i.test(y.ad) || /dublaj/i.test(islenecek[i].anahtar);
      liste.push(kaynak({
        id: `fhdf_${gorulen.size}_${slugla(y.ad) || 'sunucu'}`,
        ad: `Sirius ${y.ad}`,
        url: y.url, kategori: dublaj ? 'dubbed' : 'subtitled',
        headers: { Referer: ref, 'User-Agent': PLAYER_UA, Accept: '*/*' },
        altyazilar: y.altyazilar || [], kalite: '1080p',
      }));
    }
  });
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
