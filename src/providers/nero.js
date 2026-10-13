/* ==========================================================================
   NERO — DiziBal  ("dzb")

   Site akışı (pilavyerplay oynatıcısı):
     /ara/oneri?q= araması → film/bölüm sayfası → data-pv slug +
     oynatıcı host'u → {host}/assets/js/s.php?s=slug (Referer kilitli) →
     window.__PLAYER__.stream = api/stream.php (doğrudan master.m3u8;
     TR dublaj varsayılan ses + EN ses + sub.php Türkçe VTT altyazı).

   IFRAME YOK: yalnızca doğrudan m3u8 listelenir. Oynatıcı sayfası
   çözülemezse extractEmbedStream ile doğrudan adrese çevrilir;
   isIframe dönorsa KAYNAK ATILIR.

   Hız: tüm aramalar/pv'ler Promise.allSettled ile paralel, istek
   başına 9 sn, toplam hedef ~8 sn, gizli WebView kapalı (webView:false).
   ========================================================================== */

import { izleyici, istek, kaynak, mutlak, m3u8eCevir, medyaMi, kaliteBul, baslikEslesir, temizBaslik, slugla, alanAdiCoz } from './kit.js';
import { extractEmbedStream } from '../services/embedExtractors.js';

export const kimlik = { id: 'dzb', alias: 'Nero', mediaTypes: ['movie', 'tv'] };

const BILINEN_TABANLAR = ['https://dizibal.org'];
const VARSAYILAN_OYNATICI = 'https://pilavyerplay.top';
const YAYIN_UA = 'okhttp/4.9.2';
const SN = 9000;        // tek istek zaman aşımı (kural: 8-9 sn)
const HEDEF = 8000;     // toplam süre hedefi — derin yedekler bunu aşınca atlanır

/* ── yardımcılar ─────────────────────────────────────────────────────────── */

function oynaticiBasliklari(host) {
  // Yayın header kuralı: Referer = oynatıcı kökü, UA = okhttp/4.9.2.
  return { Referer: `${host}/`, 'User-Agent': YAYIN_UA, Accept: '*/*' };
}

function kacisCoz(s) {
  return String(s || '').replace(/\\u0026/g, '&').replace(/\\\//g, '/').replace(/\\u002f/g, '/');
}

function oynaticiHostu(html, taban) {
  const adaylar = [...String(html || '').matchAll(/https:\/\/(?:[a-z0-9-]+\.)*pilavyer[a-z0-9.-]*\.(?:top|com|net|org|io|xyz)/gi)].map((m) => m[0]);
  const tercih = adaylar.find((u) => /pilavyerplay\./i.test(u)) || adaylar[0] || '';
  return tercih ? `${mutlak(tercih, taban).replace(/\/$/, '')}` : VARSAYILAN_OYNATICI;
}

function pvSluglari(html) {
  const out = [];
  for (const m of String(html || '').matchAll(/data-pv="([^"]+)"/gi)) {
    if (m[1] && !out.includes(m[1])) out.push(m[1]);
  }
  return out;
}

/** Oynatıcı sayfasındaki sub.php kayıtları → oynatıcı altyazı nesneleri. */
function altyaziTopla(html, host) {
  const out = [];
  const re = /\{[^{}]*"src"\s*:\s*"(https?:[^"]+)"[^{}]*\}/gi;
  let m;
  while ((m = re.exec(String(html || ''))) !== null) {
    const blok = m[0];
    if (!/sub\.php/i.test(blok)) continue;
    const url = mutlak(kacisCoz(m[1]), host);
    if (out.some((x) => x.url === url)) continue;
    const lang = ((/"lang"\s*:\s*"([^"]+)"/i.exec(blok) || [])[1] || '').toLowerCase();
    const label = (/"label"\s*:\s*"([^"]+)"/i.exec(blok) || [])[1] || lang || 'Altyazı';
    out.push({ url, src: url, label, language: lang || (/t[uü]rk/i.test(label) ? 'tr' : ''), headers: oynaticiBasliklari(host) });
  }
  return out;
}

/* ── 1. arama ─────────────────────────────────────────────────────────── */

async function ara(taban, soru, tip, { trace, signal } = {}) {
  const ham = await istek(`${taban}/ara/oneri?q=${encodeURIComponent(soru)}`, {
    ref: `${taban}/`, timeout: SN, trace, webView: false, signal,
  });
  if (!ham) return [];
  try {
    const d = JSON.parse(ham);
    const havuz = tip === 'movie' ? (d.movies || []) : (d.series || []);
    return havuz
      .filter((x) => x && x.title && x.url)
      .map((x) => ({ baslik: String(x.title), url: mutlak(x.url, taban).replace(/\/$/, '') }));
  } catch (_) {
    return [];
  }
}

/** Aday başlıklarla içerik bul: paralel arama → katı eşleşme → slug yedeği. */
async function icerikBul(taban, adaylar, tip, { trace, t0, signal } = {}) {
  const sonuclar = await Promise.allSettled(adaylar.slice(0, 3).map((q) => ara(taban, q, tip, { trace, signal })));
  const gorulen = new Set();
  const havuz = [];
  for (const s of sonuclar) {
    if (s.status !== 'fulfilled') continue;
    for (const r of s.value || []) {
      if (gorulen.has(r.url)) continue;
      gorulen.add(r.url);
      havuz.push(r);
    }
  }
  const isabetler = havuz.filter((r) => baslikEslesir(temizBaslik(r.baslik), adaylar));
  if (isabetler.length) {
    trace?.koy('arama', { secili: isabetler[0].baslik, n: isabetler.length });
    return isabetler;
  }
  // Slug yedeği: arama boşa dönerse adres tahmini (yalnız bütçe varsa).
  if (Date.now() - t0 > HEDEF) return [];
  const yedekler = await Promise.allSettled(adaylar.slice(0, 2).map(async (q) => {
    const url = `${taban}/${tip === 'movie' ? 'movie' : 'series'}/${slugla(temizBaslik(q))}`;
    const html = await istek(url, { ref: `${taban}/`, timeout: SN, trace, webView: false, signal });
    const baslik = temizBaslik(((/<title>([^<]+)<\/title>/i.exec(html || '') || [])[1] || '').replace(/\s*[-|].*$/, ''));
    return html && baslikEslesir(baslik, adaylar) ? { baslik, url } : null;
  }));
  const bulunan = yedekles(yedekler);
  if (bulunan.length) trace?.koy('arama', { secili: bulunan[0].baslik, yol: 'slug' });
  return bulunan;
}

function yedekles(settled) {
  return settled.filter((s) => s.status === 'fulfilled' && s.value).map((s) => s.value);
}

/* ── 2. oynatıcı çözümleme (data-pv → doğrudan m3u8) ──────────────────── */

async function pvCoz(host, slug, ref, { trace, t0, signal } = {}) {
  const oynaticiUrl = `${host}/assets/js/s.php?s=${encodeURIComponent(slug)}`;
  const html = await istek(oynaticiUrl, { ref, timeout: SN, trace, webView: false, signal });

  let stream = '';
  let altyazilar = [];
  if (html) {
    const m = html.match(/["']stream["']\s*:\s*["']([^"']+)["']/i);
    if (m) stream = kacisCoz(m[1]);
    altyazilar = altyaziTopla(html, host);
  }

  if (!stream && Date.now() - t0 < HEDEF + 3000) {
    // Gömülü yedeği: yalnızca DOĞRUDAN adrese çevirir; iframe asla dönmez.
    const ic = await extractEmbedStream(oynaticiUrl, ref, new Set(), t0 + SN * 2, html || '').catch(() => null);
    if (ic && !ic.isIframe && (medyaMi(ic.url) || /stream\.php/i.test(ic.url))) {
      stream = ic.url;
      for (const a of ic.subtitles || []) {
        const url = mutlak(a.src || a.url || '', host);
        if (url && !altyazilar.some((x) => x.url === url)) altyazilar.push({ url, src: url, label: a.label || 'Altyazı', headers: oynaticiBasliklari(host) });
      }
    }
  }
  if (!stream) return null;

  const url = m3u8eCevir(mutlak(stream, host));
  const headers = oynaticiBasliklari(host);
  let kalite = '';
  if (Date.now() - t0 < HEDEF) {
    // master içeriği hem canlılık kanıtı hem kalite kaynağı (ucuz tek GET)
    const master = await istek(url, { ref: `${host}/`, headers, timeout: 6000, trace, webView: false, signal });
    kalite = kaliteBul(master);
  }
  return { slug, url, host, headers, altyazilar, kalite };
}

function kaynagaCevir(pv, { id, kategori }) {
  const { url, kalite, altyazilar, headers } = pv;
  const ad = `Nero ${kalite || '1080p'} ${kategori === 'dubbed' ? 'Dublaj' : 'Altyazı'}`;
  const k = kaynak({ id, ad, url, kategori, headers, altyazilar, kalite: kalite || '1080p' });
  // stream.php gibi uzantısız API adresleri de HLS'tir (içerik doğrulamalı).
  if (!medyaMi(url)) { k.isHls = true; k.isDirectVideo = true; k.type = 'direct'; }
  // Yayın TR dublaj varsayılan ses + EN ses + TR altyazı taşır → çift dil.
  k.isDual = true;
  return k;
}

async function pvHavuzunuCoz(html, ref, { trace, t0, signal }) {
  const sluglar = pvSluglari(html).slice(0, 3);
  if (!sluglar.length) return [];
  const host = oynaticiHostu(html, ref);
  const sonuclar = await Promise.allSettled(sluglar.map((s) => pvCoz(host, s, ref, { trace, t0, signal })));
  return yedekles(sonuclar).filter((x) => x && x.url);
}

/* ── 3. akış: film / bölüm ─────────────────────────────────────────────── */

async function filmAkisi(taban, adaylar, { trace, t0, signal }) {
  const isabetler = await icerikBul(taban, adaylar, 'movie', { trace, t0, signal });
  for (const hit of isabetler.slice(0, 2)) {
    const sayfa = await istek(hit.url, { ref: `${taban}/`, timeout: SN, trace, webView: false, signal });
    const pvs = await pvHavuzunuCoz(sayfa || '', hit.url, { trace, t0, signal });
    if (!pvs.length) continue;
    return pvs.map((pv, i) => kaynagaCevir(pv, { id: `dzb_mov_${pv.slug.slice(0, 8)}${i ? `_${i}` : ''}`, kategori: 'dubbed' }));
  }
  return [];
}

async function bolumAkisi(taban, adaylar, s, e, { trace, t0, signal }) {
  const isabetler = await icerikBul(taban, adaylar, 'tv', { trace, t0, signal });
  for (const hit of isabetler.slice(0, 2)) {
    // 1) doğrudan bölüm adresi: {dizi}/season/S/episode/E
    const epUrl = `${hit.url}/season/${s}/episode/${e}`;
    let sayfa = await istek(epUrl, { ref: `${taban}/`, timeout: SN, trace, webView: false, signal });
    if (sayfa && pvSluglari(sayfa).length) {
      const pvs = await pvHavuzunuCoz(sayfa, epUrl, { trace, t0, signal });
      if (pvs.length) return bolumKaynaklari(pvs, s, e);
    }
    // 2) sezon sayfası listesi (eski akış): linki listeden bul
    const sezonSayfasi = await istek(`${hit.url}?sezon=${s}`, { ref: `${taban}/`, timeout: SN, trace, webView: false, signal });
    if (!sezonSayfasi) continue;
    const m = sezonSayfasi.match(new RegExp(`/series/[a-z0-9-]+/season/${s}/episode/${e}(?=["'\\s])`, 'i'));
    if (!m) continue;
    const bulunan = mutlak(m[0], taban);
    const ep = await istek(bulunan, { ref: hit.url, timeout: SN, trace, webView: false, signal });
    const pvs = await pvHavuzunuCoz(ep || '', bulunan, { trace, t0, signal });
    if (pvs.length) return bolumKaynaklari(pvs, s, e);
  }
  return [];
}

function bolumKaynaklari(pvs, s, e) {
  return pvs.map((pv, i) => kaynagaCevir(pv, { id: `dzb_tv_s${s}e${e}_${pv.slug.slice(0, 8)}${i ? `_${i}` : ''}`, kategori: 'dubbed' }));
}

/* ── 4. sağlayıcı girişi ───────────────────────────────────────────────── */

export async function coz({ type = 'movie', title = '', originalTitle = '', titles = [], season = 1, episode = 1, signal = null } = {}) {
  const trace = izleyici();
  const t0 = Date.now();
  const s = +season || 1;
  const e = +episode || 1;
  const adaylar = [...new Set([originalTitle, title, ...(titles || [])].map((x) => temizBaslik(x)).filter((x) => x && x.length > 1))];
  trace.koy('girdi', { type, s, e, adaylar });
  if (!adaylar.length) return { sources: [], trace: trace.ozet() };

  const akis = (taban) => (type === 'tv'
    ? bolumAkisi(taban, adaylar, s, e, { trace, t0, signal })
    : filmAkisi(taban, adaylar, { trace, t0, signal }));

  let kaynaklar = [];
  try {
    kaynaklar = await akis(BILINEN_TABANLAR[0]);
    // Alan adı değişmiş olabilir: bütçe varsa canlı adresle bir kez dene.
    if (!kaynaklar.length && Date.now() - t0 < HEDEF) {
      const taze = await alanAdiCoz('dizibal', BILINEN_TABANLAR, { trace });
      if (taze && taze.replace(/\/$/, '') !== BILINEN_TABANLAR[0]) kaynaklar = await akis(taze.replace(/\/$/, ''));
    }
  } catch (err) {
    trace.koy('hata', { mesaj: String(err).slice(0, 120) });
  }
  // Kural gereği güvenlik süzgeci: iframe/embed asla listelenmez.
  kaynaklar = (kaynaklar || []).filter((x) => x && !x.isIframe && x.type !== 'embed');
  trace.koy('sonuc', { n: kaynaklar.length, ms: Date.now() - t0 });
  return { sources: kaynaklar, trace: trace.ozet() };
}

export default { apiVersion: 1, id: kimlik.id, name: kimlik.alias, mediaTypes: kimlik.mediaTypes, async resolve(a) { return (await coz(a)).sources; } };
