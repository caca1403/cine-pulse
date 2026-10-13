/* ==========================================================================
   HALCYON — SinemaCC / Sinemacx  (sıfırdan, Nuvio/Patron akışı; yalnız film)

   Adımlar (Patron `patronSinemacx` ile aynı amaç, kendi akışımız):
     1. Alan adı: siteurl.txt (sinemacx) → bilinen adresler
     2. Arama:  /arama/?s={başlık} → .film_kutusu kartları (başlık+yıl)
     3. Film sayfası: <iframe data-vsrc="base64…"> — yalnızca fragman ise
        {url}2/ alternatif sayfası denenir
     4. Oynatıcı: player.filmizle.in → POST index.php?data=…&do=getVideo
        → videoSource (master.txt olduğu gibi bırakılır; bu sunucuda
        .m3u8'e çevirmek 403 veriyor — ölçüldü)
     5. Altyazılar: oynatıcı sayfasındaki playerjsSubtitle "[dil]url"
        listesi (#sub.vtt ekiyle). iframe kalan kaynak ATILIR.
   ========================================================================== */

import {
  istek, gonder, izleyici, mutlak, koken, medyaMi, kaynak,
  temizBaslik, slugla, duzMetin, alanAdiCoz,
} from './kit.js';
import { extractEmbedStream } from '../services/embedExtractors.js';

const BILINEN = ['https://sinemacc.com', 'https://www.sinema.gg'];
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
const PLAYER_UA = 'okhttp/4.9.2';

export const kimlik = { id: 'sinemacc', alias: 'Halcyon', mediaTypes: ['movie'] };

/* ── base64(data-vsrc) — base64url + padding toleranslı ───────────────── */
function vsrcCoz(kodlu) {
  let b = String(kodlu || '').replace(/-/g, '+').replace(/_/g, '/');
  while (b.length % 4) b += '=';
  try { return atob(b); } catch (_) { return ''; }
}

/* ── arama kartları: {url, ad, yil} ───────────────────────────────────── */
function aramaKartlari(html, base) {
  const cikar = [];
  const gorulen = new Set();
  for (const blok of String(html).matchAll(/class="film_kutusu[^"]*"[\s\S]{0,1600}?<\/a>/g)) {
    const t = blok[0];
    const href = (t.match(/<a\b[^>]*href="([^"]+)"/i) || [])[1] || '';
    const ad = duzMetin((t.match(/<span class="text">([\s\S]*?)<\/span>/i) || [])[1] || '');
    const yil = ((t.match(/<span class="years">\s*(\d{4})/i) || [])[1] || '');
    const url = mutlak(href, base);
    if (url && /\/film\//.test(url) && !gorulen.has(url)) {
      gorulen.add(url);
      cikar.push({ url, ad, yil });
    }
  }
  return cikar;
}

/* ── arama eşleşmesi: SLUG kapsaması (kendi kopyamız — lumen.js'teki
   `puanla` mantığı; site "Interstellar"ı "Yıldızlararası" +
   /film/yildizyarasi-interstellar-2014/ olarak listeliyor, saf İngilizce
   başlıkla baslikEslesir 0 kaynak veriyordu — ölçüldü) ─────────────────── */
const duz = (s) => String(s || '')
  .toLowerCase()
  .replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g')
  .replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c')
  .replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();

function puanla(adayAdi, hedefler, adayUrl = '') {
  const aday = duz(adayAdi);
  const slug = slugla(String(adayUrl).split('/').filter(Boolean).pop().replace(/-izle+$/, ''));
  let en = 0;
  for (const h of hedefler) {
    const hedef = duz(h);
    if (!hedef) continue;
    if (aday === hedef) en = Math.max(en, 6);
    else if (aday.startsWith(hedef)) en = Math.max(en, 4);
    else if (hedef.startsWith(aday)) en = Math.max(en, 3);
    else if (aday.includes(hedef) || hedef.includes(aday)) en = Math.max(en, 1);
    const hslug = slugla(h);
    if (slug && hslug && (slug === hslug || slug.startsWith(`${hslug}-`)
      || slug.includes(`-${hslug}-`) || slug.endsWith(`-${hslug}`))) en = Math.max(en, 5);
  }
  return en >= 2 ? en : 0;
}

function kartSec(kartlar, adAdaylari) {
  let enIyi = null; let enPuan = 0;
  for (const k of kartlar || []) {
    const p = puanla(k.ad, adAdaylari, k.url);
    if (p > enPuan) { enPuan = p; enIyi = k; }
  }
  return enIyi;
}

/* ── player.filmizle.in securedLink akışı ─────────────────────────────── */
async function filmizleInCoz(embedUrl, referer, trace) {
  const id = (embedUrl.match(/\/(?:video|embed|hdplayer|player)\/([A-Za-z0-9_-]{8,90})/) || [])[1] || '';
  if (!id) return null;
  const taban = koken(embedUrl);
  // altyazılar oynatıcı sayfasında: playerjsSubtitle = "[dil]url,…"
  const sayfa = await istek(embedUrl, { ref: referer, headers: { 'User-Agent': UA }, trace, timeout: 9000, webView: false });
  const altyazilar = [];
  const sub = (String(sayfa).match(/playerjsSubtitle\s*=\s*["']([^"']+)["']/) || [])[1] || '';
  for (const m of sub.replace(/\\\//g, '/').matchAll(/\[([^\]]{0,24})\]((?:https?:)?\/\/[^"',\s]+)/g)) {
    let u = m[2].startsWith('//') ? `https:${m[2]}` : m[2];
    if (!/\.vtt/i.test(u)) u += '#sub.vtt';
    const etiket = duzMetin(m[1]) || 'Altyazı';
    altyazilar.push({
      url: u, src: u, label: etiket,
      language: /türk|turk/i.test(etiket) ? 'tr' : (/ing|eng/i.test(etiket) ? 'en' : ''),
      headers: { Referer: `${taban}/`, 'User-Agent': UA, Accept: '*/*' },
    });
  }
  // yayın adresi: POST index.php?data=…&do=getVideo
  const ham = await gonder(`${taban}/player/index.php?data=${encodeURIComponent(id)}&do=getVideo`, `hash=${id}&r=${encodeURIComponent(`${koken(referer) || taban}/`)}`, {
    ref: embedUrl, trace, timeout: 9000,
    headers: { 'User-Agent': UA, 'X-Requested-With': 'XMLHttpRequest' },
  });
  let veri = null;
  try { veri = JSON.parse(ham); } catch (_) { /* JSON değil → iframe kalmış */ }
  const yayin = veri?.videoSource || veri?.securedLink || '';
  if (!yayin || veri?.hls === false) return null;
  return { url: mutlak(yayin, taban), altyazilar };
}

/** Tek gömüleni yayına çevirir; iframe ASLA kaynak olarak dönmez. */
async function gomulenCoz(embedUrl, referer, trace, bitis) {
  if (/player\.filmizle\.in|[?&]do=getVideo/i.test(embedUrl)) {
    const r = await filmizleInCoz(embedUrl, referer, trace);
    if (r && (medyaMi(r.url) || /master\.txt/i.test(r.url))) return r;
    return null;
  }
  if (medyaMi(embedUrl)) return { url: embedUrl, altyazilar: [] };
  const x = await extractEmbedStream(embedUrl, referer, new Set(), bitis);
  if (!x || x.isIframe) return null;
  if (!(medyaMi(x.url) || /master\.txt/i.test(x.url))) return null;
  return { url: x.url, altyazilar: x.subtitles || [] };
}

export async function coz({ type = 'movie', title = '', originalTitle = '', titles = [] } = {}) {
  const trace = izleyici();
  const bas = Date.now();
  const bitis = bas + 14000;
  if (type === 'tv') { trace.koy('sonuc', { n: 0, not: 'movie-only' }); return { sources: [], trace: trace.ozet() }; }
  const adAdaylari = [...new Set([title, originalTitle, ...titles].map(temizBaslik).filter(Boolean))];
  const base = await alanAdiCoz('sinemacx', BILINEN, { trace, ua: UA });

  // — 1. arama: hem görünen hem özgün adla; ilk eşleşme yeter
  let contentUrl = '';
  for (const q of adAdaylari.slice(0, 2)) {
    const ham = await istek(`${base}/arama/?s=${encodeURIComponent(q)}`, {
      ref: `${base}/`, headers: { 'User-Agent': UA }, trace, timeout: 9000, webView: false,
    });
    const kartlar = aramaKartlari(ham, base);
    trace.koy('arama', { q, sonuc: kartlar.length });
    const kart = kartSec(kartlar, adAdaylari);
    if (kart) { contentUrl = kart.url; break; }
    if (Date.now() - bas > 9000) break;
  }
  if (!contentUrl) {
    // slug yedeği: /film/{tr-slug}-{orijinal}-{yil}/ kalıbı her zaman
    // türetilemez; arama kutusu AJAX'sız da çalışıyor, tekrar dene.
    const ham = await istek(`${base}/arama/${encodeURIComponent(slugla(adAdaylari[0] || ''))}/`, {
      ref: `${base}/`, headers: { 'User-Agent': UA }, trace, timeout: 8000, webView: false,
    });
    const kart = kartSec(aramaKartlari(ham, base), adAdaylari);
    if (kart) contentUrl = kart.url;
  }
  if (!contentUrl) { trace.koy('sonuc', { n: 0, ms: Date.now() - bas }); return { sources: [], trace: trace.ozet() }; }

  // — 2. film sayfası: data-vsrc iframe'leri (yalnız fragmansa /2/ sayfası)
  let sayfa = await istek(contentUrl, { ref: `${base}/`, headers: { 'User-Agent': UA }, trace, timeout: 9000, webView: false });
  const vsrcler = [...String(sayfa).matchAll(/<iframe\b[^>]*data-vsrc="([^"]+)"/gi)].map((m) => m[1]);
  const gercek = vsrcler.filter((b64) => {
    const u = vsrcCoz(b64).toLowerCase();
    return u && !/youtube|fragman|trailer/.test(u);
  });
  if (!gercek.length) {
    const alternatif = contentUrl.endsWith('/') ? `${contentUrl}2/` : `${contentUrl}/2/`;
    const ek = await istek(alternatif, { ref: contentUrl, headers: { 'User-Agent': UA }, trace, timeout: 8000, webView: false });
    for (const m of String(ek).matchAll(/<iframe\b[^>]*data-vsrc="([^"]+)"/gi)) {
      if (!/youtube|fragman|trailer/.test(vsrcCoz(m[1]).toLowerCase())) gercek.push(m[1]);
    }
  }
  // aynı oynatıcının kopyaları tekilleştirilir
  const hedefler = [...new Set(gercek.map(vsrcCoz).filter(Boolean).map((u) => {
    const i = u.indexOf('?img=');
    return (i > -1 ? u.slice(0, i) : u).replace(/\/$/, '');
  }).map((u) => mutlak(u, base)))].slice(0, 3);
  trace.koy('oynatici', { url: contentUrl, aday: hedefler.length });

  // — 3. gömülenleri paralel çöz
  const cozumler = await Promise.allSettled(hedefler.map((u) => gomulenCoz(u, contentUrl, trace, bitis)));
  const liste = [];
  const gorulen = new Set();
  cozumler.forEach((r, i) => {
    if (r.status !== 'fulfilled' || !r.value?.url || gorulen.has(r.value.url)) return;
    gorulen.add(r.value.url);
    const k = kaynak({
      id: `sinemacc_${gorulen.size}_${slugla(hedefler[i]) || 'sunucu'}`,
      ad: `Halcyon Sunucu ${gorulen.size}`,
      url: r.value.url, kategori: 'subtitled',
      // Yayın: oynatıcı kökü Referer; master.txt olduğu gibi bırakılır.
      headers: { Referer: `${koken(hedefler[i]) || base}/`, 'User-Agent': PLAYER_UA, Accept: '*/*' },
      altyazilar: r.value.altyazilar || [], kalite: '1080p',
    });
    const hls = /\.m3u8(\?|#|$)/i.test(r.value.url) || /master\.txt/i.test(r.value.url);
    liste.push(hls ? { ...k, isHls: true, isDirectVideo: true } : k);
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
