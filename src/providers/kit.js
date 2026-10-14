/* ==========================================================================
   CinePulse sağlayıcı çekirdeği ("kendi dilimiz")

   TASARIM — CloudStream / Nuvio eklenti şekli: her sağlayıcı üç adımdır
       search()  → içerik adayları (url + başlık)
       load()    → oynatılabilir kaynaklar (doğrudan m3u8/mp4 + altyazı)
       play()    → oynatıcı girdisi (proxy/başlık)

   KURAL:
     - Doğrudan yayın bulunursa IFRAME ASLA dönülmez.
     - iframe yalnızca doğrulamalı modellerde (Luna) onay sonrası
       asıl yayına yönlendirme için kullanılır.
     - Hibrit yol: önce cihazın yerel IP'si; olmazsa YALNIZCA o istek
       için proxy yedeği.

   Her adım `iz` (trace) defterine yazar; cihazda tek sorguyla nerede
   koptuğunu görebiliriz.
   ========================================================================== */

import { akilliGet, akilliPost, nativeHttpAktifMi } from '../services/nativeHttp.js';

/* ── 1. HTTP (hibrit) ─────────────────────────────────────────────────── */

export function izleyici() {
  const kayit = [];
  return {
    kayit,
    koy: (ad, veri) => { kayit.push({ ad, t: Date.now(), ...veri }); return veri; },
    ozet: () => kayit,
  };
}

/**
 * İptal sinyali birleştirme — `AbortSignal.any([signal, AbortSignal.timeout(ms)])`
 * kalıbı. Ortamda `AbortSignal.any` yoksa (Node 18, eski WebView) elle
 * AbortController + 'abort' dinleyicisiyle kurulur; dinleyiciler `bırak()` ile
 * temizlenir, sızma olmaz. Dönen `{ signal, birak }`.
 */
export function iptalSinyali(signal, ms) {
  const zamanAsimi = typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function'
    ? AbortSignal.timeout(Math.max(1, ms)) : null;
  if (!signal) return { signal: zamanAsimi || undefined, birak() {} };
  if (typeof AbortSignal !== 'undefined' && typeof AbortSignal.any === 'function')
    return { signal: zamanAsimi ? AbortSignal.any([signal, zamanAsimi]) : signal, birak() {} };
  const ac = new AbortController();
  const yolla = () => { try { ac.abort(new Error('aborted')); } catch (_) { ac.abort(); } };
  if (signal.aborted) yolla(); else signal.addEventListener('abort', yolla, { once: true });
  const timer = setTimeout(yolla, Math.max(1, ms));
  return { signal: ac.signal, birak() { clearTimeout(timer); signal.removeEventListener('abort', yolla); } };
}

/** Sinyal düşünce beklemede bırakma: istek ASLA fırlatmaz, `dus` değerine düşer. */
function iptalYarisi(promise, signal, dus) {
  if (!signal) return promise;
  if (signal.aborted) return Promise.resolve(dus);
  let bitti = false;
  return new Promise(resolve => {
    const onAbort = () => { if (!bitti) { bitti = true; resolve(dus); } };
    signal.addEventListener('abort', onAbort, { once: true });
    promise.then(deger => { bitti = true; signal.removeEventListener('abort', onAbort); resolve(deger); },
      () => { bitti = true; signal.removeEventListener('abort', onAbort); resolve(dus); });
  });
}

/**
 * Tek istek. Akış:
 *   1) cihaz IP'si (CapacitorHttp) — çerez paylaşımıyla
 *   2) gizli WebView (CF challenge, gerçek tarayıcı)
 *   3) yedekCek (hibrit: yalnızca bu istek için dış geçit)
 *
 * `opts.signal`: iptal yayılımı (batch.js AbortController'ı). Sinyal düşünce
 * bekleyen istek anında '' döner (zombi bekleme yok) ve YENİ istek hiç
 * başlatılmaz; birleşik sinyal (`iptalSinyali`) yedekCek'e ve fetch katmanına
 * (akilliGet `signal`'i desteklediği anda) iletilir.
 */
export async function istek(url, { ref = '', headers = {}, timeout = 12000, yedekCek = null, trace = null, webView = true, signal = null } = {}) {
  const kural = { url, ref };
  if (signal?.aborted) { if (trace) trace.koy('http', { ...kural, iptal: true }); return ''; }
  const { signal: birlesik, birak } = iptalSinyali(signal, timeout + 1000);
  const yedek = signal && typeof yedekCek === 'function'
    ? (u, o) => (signal.aborted ? '' : yedekCek(u, o)) // sinyal düştüyse yeni ağ isteği yok
    : yedekCek;
  try {
    const ham = await iptalYarisi(akilliGet(url, { ref, timeout, headers, yedekCek: yedek, webView, signal: birlesik }), signal, '');
    if (trace) trace.koy('http', { ...kural, uz: (ham || '').length, yol: signal?.aborted ? 'iptal' : ham ? 'akilli' : 'bos' });
    return ham || '';
  } catch (e) {
    if (trace) trace.koy('http', { ...kural, hata: String(e).slice(0, 80) });
    return '';
  } finally { birak(); }
}

export async function gonder(url, govde, { ref = '', headers = {}, timeout = 12000, yedekCek = null, trace = null, signal = null } = {}) {
  if (signal?.aborted) { if (trace) trace.koy('http-post', { url, iptal: true }); return ''; }
  const { signal: birlesik, birak } = iptalSinyali(signal, timeout + 1000);
  try {
    const ham = await iptalYarisi(akilliPost(url, govde, { ref, timeout, headers, yedekCek, signal: birlesik }), signal, '');
    if (trace) trace.koy('http-post', { url, uz: (ham || '').length });
    return ham || '';
  } catch (e) {
    if (trace) trace.koy('http-post', { url, hata: String(e).slice(0, 80) });
    return '';
  } finally { birak(); }
}

/* ── 2. HTML / metin yardımcıları ─────────────────────────────────────── */

export function anchorlar(html, taban = '') {
  const out = [];
  for (const m of String(html || '').matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
    out.push({ url: mutlak(m[1], taban), metin: duzMetin(m[2]) });
  }
  return out;
}

export function duzMetin(html) {
  return String(html || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

export function nitelik(html, etiket, ad) {
  const re = new RegExp(`<${etiket}\\b[^>]*\\b${ad}=["']([^"']+)["']`, 'i');
  const m = String(html || '').match(re);
  return m ? m[1] : '';
}

export function etiketler(html, etiket) {
  return [...String(html || '').matchAll(new RegExp(`<${etiket}\\b[^>]*>`, 'gi'))].map((m) => m[0]);
}

export function ilkGrup(metin, desen) {
  const m = String(metin || '').match(desen);
  return m ? (m[1] ?? '') : '';
}

/* ── 2b. base64 (toleranslı) ───────────────────────────────────────────── */

/** Toleranslı base64 çözücü: site gövdelerindeki `\/` kaçışları, base64url
 *  alfabesi (`-`,`_`) ve eksik dolgu KATI `atob`'ı patlatıyordu (ölçüldü →
 *  Betelgeuse 0 sonuç). ASLA fırlatmaz; çöp/uyumsuz girdide ham metni döner,
 *  çağıran yine de adres/JSON parçalayabilir. */
export function b64Ac(s) {
  const ham = String(s ?? '');
  try {
    let x = ham.replace(/\\/g, '').replace(/\s+/g, '').replace(/-/g, '+').replace(/_/g, '/');
    while (x.length % 4) x += '=';
    if (!x) return '';
    let metin = '';
    if (typeof atob === 'function') {
      try { metin = atob(x); } catch (_) { metin = typeof Buffer !== 'undefined' ? Buffer.from(x, 'base64').toString('utf8') : ''; }
    } else if (typeof Buffer !== 'undefined') {
      metin = Buffer.from(x, 'base64').toString('utf8');
    }
    if (!metin) return ham;
    const bas = metin.slice(0, 200);
    // çöp çıktı (girdi zaten base64 değildi — düz URL vb.) → ham metni döndür
    if (/[\u0000-\u0008\u000e-\u001f]/.test(bas) || (bas.match(/\uFFFD/g) || []).length > 2) return ham;
    return metin;
  } catch (_) { return ham; }
}

/* ── 3. URL yardımcıları ──────────────────────────────────────────────── */

export function mutlak(link, taban = '') {
  const s = String(link || '').trim();
  if (!s) return '';
  if (s.startsWith('//')) return `https:${s}`;
  if (/^https?:\/\//i.test(s)) return s;
  try { return new URL(s, taban || 'https://localhost').href; } catch (_) { return s; }
}

export function koken(url) {
  try { return new URL(url).origin; } catch (_) { return ''; }
}

/** master.txt → master.m3u8 (Patron/Kekik ortak kuralı). */
export function m3u8eCevir(url) {
  return String(url || '')
    .replace(/\/txt\/master\.txt/i, '/master.m3u8')
    .replace(/\/master\.txt/i, '/master.m3u8')
    .replace(/\.txt(\?|$)/i, '.m3u8$1');
}

export function medyaMi(url) {
  return /\.(m3u8|mp4|mkv|webm|m4v|mov|mpd)(\?|#|$)/i.test(String(url || ''));
}

/* ── 3b. Kalite tespiti (Patron: m3u8 içeriğinden) ────────────────────── */

export function kaliteBul(m3u8Metni) {
  const t = String(m3u8Metni || '');
  if (!t) return '';
  if (/\b2160p?\b|4k/i.test(t)) return '2160p';
  if (/\b1080p?\b/.test(t)) return '1080p';
  if (/\b720p?\b/.test(t)) return '720p';
  if (/\b480p?\b/.test(t)) return '480p';
  if (/\b360p?\b/.test(t)) return '360p';
  return '';
}

/* ── 3c. TMDB meta (Patron: tmdbId → başlık + imdb) ───────────────────── */

const TMDB_KEY = '500330721680edb6d5f7f12ba7cd9023';

export async function tmdbMeta(tmdbId, mediaType = 'movie', { trace = null } = {}) {
  if (!tmdbId) return null;
  const tip = mediaType === 'movie' ? 'movie' : 'tv';
  const url = `https://api.themoviedb.org/3/${tip}/${encodeURIComponent(tmdbId)}?api_key=${TMDB_KEY}&language=tr-TR&append_to_response=external_ids`;
  const ham = await istek(url, { headers: { Accept: 'application/json' }, timeout: 8000, trace });
  try {
    const d = JSON.parse(ham);
    const tr = (tip === 'movie' ? d.title : d.name) || '';
    const orj = (tip === 'movie' ? d.original_title : d.original_name) || '';
    const imdb = (tip === 'movie' ? d.imdb_id : d?.external_ids?.imdb_id) || '';
    trace?.koy('tmdb', { tr: Boolean(tr), imdb: Boolean(imdb) });
    return { tr: String(tr).trim(), orj: String(orj).trim(), imdb: String(imdb).trim() };
  } catch (_) {
    return null;
  }
}

/* ── 3d. Alan adı çözümü (siteurl.txt + bilinen adresler) ─────────────── */

const SITEURL = 'https://raw.githubusercontent.com/patr0nq/veriler/refs/heads/main/siteurl.txt';
const _siteurlOnbellek = { at: 0, harita: {} };

export async function siteurlHaritasi({ trace = null } = {}) {
  const simdi = Date.now();
  if (simdi - _siteurlOnbellek.at < 1800000 && Object.keys(_siteurlOnbellek.harita).length) return _siteurlOnbellek.harita;
  const ham = await istek(SITEURL, { ref: 'https://raw.githubusercontent.com/', timeout: 8000, trace });
  const harita = {};
  for (const satir of String(ham || '').split('\n')) {
    const i = satir.indexOf(':');
    if (i < 0) continue;
    const k = satir.slice(0, i).trim().toLowerCase();
    const v = satir.slice(i + 1).trim().replace(/\/$/, '');
    if (k && /^https:\/\//i.test(v)) harita[k] = v;
  }
  if (Object.keys(harita).length) _siteurlOnbellek.at = simdi, _siteurlOnbellek.harita = harita;
  return harita;
}

/** Canlı alan adı: siteurl.txt → bilinen adresler (HEAD ile sağlamlık). */
export async function alanAdiCoz(anahtar, bilinenler = [], { trace = null, ua = '' } = {}) {
  const harita = await siteurlHaritasi({ trace });
  const aday = [harita[anahtar], ...bilinenler].filter(Boolean);
  const tekil = [...new Set(aday.map((u) => u.replace(/\/$/, '')))];
  for (const u of tekil) {
    const html = await istek(`${u}/`, { ref: `${u}/`, timeout: 7000, headers: ua ? { 'User-Agent': ua } : {}, trace });
    if (html && html.length > 500) { trace?.koy('alan-adi', { secili: u }); return u; }
  }
  trace?.koy('alan-adi', { secili: tekil[0] || '', sağlam: false });
  return tekil[0] || '';
}

/* ── 4. Başlık / arama yardımcıları ───────────────────────────────────── */

export function temizBaslik(s) {
  return String(s || '')
    .replace(/\s*[-–]\s*S\d+E\d+.*$/i, '')
    .replace(/\s*[-–]\s*\d+\.\s*Sezon.*$/i, '')
    .replace(/\s*\(\d{4}\).*$/, '')
    .trim();
}

export function slugla(s) {
  return String(s || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g')
    .replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export function baslikEslesir(a, adaylar) {
  const s = (x) => String(x || '').toLowerCase().replace(/[^a-z0-9çğıöşü ]/g, ' ').replace(/\s+/g, ' ').trim();
  const hedef = s(a);
  if (!hedef) return false;
  return (adaylar || []).some((c) => {
    const t = s(c);
    if (!t) return false;
    return hedef === t || hedef.includes(t) || t.includes(hedef);
  });
}

/** Sıkı başlık puanı (emsal: arsiv.js `puanla`): tam=6, "hedef …" öneşek=4,
 *  içeren=2, ilgisiz=0. Kapı eşiği ≥4 olmalı — içeren ASLA kabul edilmez. */
export function adPuan(kartAdi, hedefler) {
  // toLowerCase TR-I açığı kapatılır: 'İ'→'i̇'(i+U+0307) ve 'ı'→'i' tek sınıfa
  // katlanır; yoksa "MUHTEŞEM YÜZYIL" ≠ "Muhteşem Yüzyıl" kalırdı (test yakaladı).
  const s = (x) => String(x || '').toLowerCase().replace(/i\u0307/g, 'i').replace(/ı/g, 'i')
    .replace(/[^a-z0-9çğıöşü ]/g, ' ').replace(/\s+/g, ' ').trim();
  const k = s(kartAdi);
  if (!k) return 0;
  let en = 0;
  for (const h of (hedefler || []).map(s).filter(Boolean)) {
    if (k === h) return 6;
    let p = 0;
    if (k.startsWith(`${h} `)) p = 4;
    else if (k.includes(h)) p = 2;
    if (p > en) en = p;
  }
  return en;
}

/** Yıl kapısı (doktrin "2000 se 2000"): hedef yılı bilinmeyen veya kartında yıl
 *  kanıtı olmayan aday geçer (kanıt yoksa ihbar yok); ikisi de biliniyorsa ±1
 *  şart. Kart yılı metindeki/alanındaki bağımsız (19|20)yy sayısından alınır. */
export function yilUyar(hedefYil, ...metinler) {
  const h = parseInt(hedefYil, 10);
  if (!h || h < 1900 || h > 2100) return true;
  const yillar = [];
  for (const m of metinler) {
    const t = String(m ?? '').trim();
    if (!t) continue;
    if (/^\d{4}$/.test(t)) { const n = parseInt(t, 10); if (n >= 1900 && n <= 2100) yillar.push(n); continue; }
    for (const mm of t.matchAll(/(?:^|[^0-9a-zA-Z])((?:19|20)\d{2})(?:[^0-9]|$)/g)) yillar.push(parseInt(mm[1], 10));
  }
  if (!yillar.length) return true;
  return yillar.some((y) => Math.abs(y - h) <= 1);
}

/* ── 5. Altyazı ───────────────────────────────────────────────────────── */

/** `tracks:[{file,label,kind}]` → altyazı listesi. */
export function tracksAltyazilari(html, taban, ua = 'okhttp/4.9.2') {
  const out = [];
  const blok = String(html || '').match(/tracks\s*:\s*(\[[\s\S]*?\])/);
  if (!blok) return out;
  let liste = null;
  try { liste = JSON.parse(blok[1]); } catch (_) {}
  if (!Array.isArray(liste)) {
    const re = /"file"\s*:\s*"([^"]+)"[\s\S]*?"label"\s*:\s*"([^"]+)"/gi;
    let m; liste = [];
    while ((m = re.exec(blok[1])) !== null) liste.push({ file: m[1].replace(/\\\//g, '/'), label: m[2] });
  }
  for (const it of liste) {
    if (!it || !it.file || /get_slides/i.test(it.file) || it.kind === 'thumbnails') continue;
    const url = it.file.startsWith('http') ? it.file : mutlak(it.file, taban);
    const label = it.label || 'Türkçe';
    out.push({ url, src: url, label, language: /t[uü]rk/i.test(label) ? 'tr' : (/ing|eng/i.test(label) ? 'en' : label),
      headers: { Referer: `${koken(url) || taban}/`, 'User-Agent': ua, Accept: '*/*' } });
  }
  return out;
}

/** URL içinde 48 dil kodundan altyazı dili tahmini (Kekik altyazı yedeği). */
export function altyaziDili(url) {
  const m = String(url || '').match(/(?:^|[._-])([a-z]{2,3})(?:[._-]|\.vtt|\.srt)/i);
  const kod = (m ? m[1] : '').toLowerCase();
  const tr = ['tr', 'tur', 'turkce', 'türkçe'];
  if (tr.includes(kod)) return 'tr';
  return kod || '';
}

/* ── 6. Sağlayıcı iskeleti ────────────────────────────────────────────── */

/** Ortak kaynak nesnesi — tüm sağlayıcılar bunu döndürür. */
export function kaynak({ id, ad, url, kategori = 'subtitled', headers = {}, altyazilar = [], kalite = '', iframe = false, dogrulama = false }) {
  const u = String(url || '');
  const relay = /\/api\/(?:hls_proxy|mkv_stream|stream_proxy)[?#]/i.test(u);
  return {
    id, name: ad, displayName: ad,
    source: ad, url: u, streamUrl: u, rawStreamUrl: u,
    headers, subtitles: altyazilar, quality: kalite,
    category: kategori,
    isDual: !iframe && /dual|trdual|trdub|dublaj/i.test(u),
    isHls: /\.m3u8(\?|#|$)/i.test(u) || /\/api\/hls_proxy[?#]/i.test(u),
    isDirectVideo: !iframe && (medyaMi(u) || relay),
    isIframe: iframe, type: iframe ? 'embed' : 'direct',
    requiresVerification: dogrulama,
    getUrl: () => u,
  };
}

export { nativeHttpAktifMi };
