/* ==========================================================================
   CinePulse — "Lyra" çekirdeği (birinci taraf, bağımlılıksız)
   --------------------------------------------------------------------------
   Ne yapıyor: sitenin kapalı-kutu JSON arama ucunu (rota: slc) AES-CBC
   zarfıyla açar, içerik sayfasındaki __NEXT_DATA__/secureData zarfından
   oynatıcı adaylarını (dplayer/pichive ailesi) çıkarır ve source2 zinciriyle
   canlı HLS'e çevirir. IFRAME listelenmez; yalnız DOĞRUDAN yayın döner.

   Ölçülen gerçekler (2026-10-18, bu çekirdek yazılırken canlı doğrulandı):
     • POST {site}/api/bg/searchContent?searchterm=<metin> (boş gövde)
       → {"response":"<AES-CBC zarfı>"}; zarf: sabit anahtar + sıfır IV,
         base64 gövde → JSON result[] {object_name, used_slug}
     • İçerik sayfası <script id="__NEXT_DATA__"> içinde props.pageProps
       .secureData — AYNI zarfla; açılınca RelatedResults.getEpisodeSources /
       getSerieEpisodeSources / getMoviePartSourcesById_<id> → iframe ADAYI
     • dplayer/pichive: iframe.php?v=<v> içindeki openPlayer('<v>') →
       GET source2.php?v=<v> (X-Requested-With) → playlist[0].sources[0].file
       → m.php şablonu /master.m3u8'e çevrilir (okhttp/4.9.2 + Origin)
     • Aynalar: four./sn.dplayer82.site, four.pichive.online (kök host ölü,
       aynalar canlı — vendor çekirdeklerinin kullandığı hostlarla aynı)
   Kriptografi: WebCrypto (Node ≥16 ve tarayıcıda ortak), crypto-js GÖMÜLMEZ.
   ========================================================================== */

import { rotaYol, metinAl, jsonAl, tmdbBilgi, adayBasliklar, sadeles } from '../ortakCekirdek.js';
import { beCoz } from '../kodCozler.js';
import { resolvePageInNativeWebView, hasNativeWebViewResolver } from '../../services/platform/androidWebViewResolver.js';

const AD = 'Lyra';
const ROTA = 'slc';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
const YAYIN_BASLIK = { 'User-Agent': 'okhttp/4.9.2', Accept: '*/*' };
const ZARF_ANAHTARI = '9bYMCNQiWsXIYFWYAu7EkdsSbmGBTyUI';

const norm = s => sadeles(String(s || '')).replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const eslesir = (a, b) => { const x = norm(a), y = norm(b); return x && y && (x === y || x.includes(y) || y.includes(x)); };

/* ── zarf açıcılar (AES-CBC sabit anahtar, sıfır IV — WebCrypto) ───────── */

let _anahtar = null;
async function aesCoz(b64) {
  const kirik = String(b64 || '').replace(/"/g, '').trim();
  if (kirik.length < 24 || typeof crypto === 'undefined' || !crypto.subtle) return '';
  try {
    if (!_anahtar) _anahtar = crypto.subtle.importKey('raw', new TextEncoder().encode(ZARF_ANAHTARI), 'AES-CBC', false, ['decrypt']);
    const anahtar = await _anahtar;
    const ham = Uint8Array.from(atob(kirik), c => c.charCodeAt(0));
    const duz = await crypto.subtle.decrypt({ name: 'AES-CBC', iv: new Uint8Array(16) }, anahtar, ham);
    return new TextDecoder().decode(duz);
  } catch (_) { return ''; }
}

const b64Coz = s => { try { return atob(String(s || '').trim()); } catch (_) { return ''; } };

/* Gömülü "getEpisodeSources"…"result":[…] yığınlarını objeye çevir. */
function iliskileriTara(metin) {
  const bul = (ad) => {
    const i = String(metin).indexOf(`"${ad}"`);
    if (i < 0) return null;
    const r = String(metin).indexOf('"result":', i);
    if (r < 0 || r - i > 250) return null;
    const a = String(metin).indexOf('[', r);
    if (a < 0) return null;
    let derinlik = 0;
    for (let k = a; k < metin.length; k++) {
      if (metin[k] === '[') derinlik++;
      else if (metin[k] === ']' && --derinlik === 0) {
        try { return JSON.parse(metin.slice(a, k + 1)); } catch (_) { return null; }
      }
    }
    return null;
  };
  const RelatedResults = {};
  let bulundu = false;
  const adlar = ['getEpisodeSources', 'getSerieEpisodeSources', 'getMoviePartsById'];
  // Film kaynak anahtarları parça numarasıyla dinamik (ölçüldü 2026-10-18:
  // "getMoviePartSourcesById_6992") — metinde geçenler toplanmazsa film 0 dönerdi.
  for (const m of String(metin).matchAll(/"getMoviePartSourcesById_(\d+)"/g)) adlar.push(m[1]);
  for (const ad of [...new Set(adlar)]) {
    const r = bul(ad);
    if (Array.isArray(r) && r.length) { RelatedResults[ad] = { result: r }; bulundu = true; }
  }
  return bulundu ? { RelatedResults } : null;
}

/* Zarfı sırayla aç: JSON → base64 → AES-CBC (WebCrypto, async). */
function deneMetin(metin) {
  const m = String(metin || '').trim();
  if (!m) return null;
  if (m[0] === '{' || m[0] === '[') { try { return JSON.parse(m); } catch (_) {} }
  return iliskileriTara(m);
}
async function zarfAc(blok) {
  const t = String(blok || '').trim();
  if (!t) return null;
  const duz = deneMetin(t); if (duz) return duz;
  if (/^(ey|Wy|Ww)/.test(t)) { const a = deneMetin(b64Coz(t)); if (a) return a; }
  return deneMetin(await aesCoz(t));
}

/* ── sayfa / arama ─────────────────────────────────────────────────────── */

function guvenliVeri(html) {
  const nd = String(html || '').match(/__NEXT_DATA__"[^>]*>(\{[\s\S]*?\})<\/script>/i);
  if (nd) { try { const sd = JSON.parse(nd[1])?.props?.pageProps?.secureData; if (sd) return sd; } catch (_) {} }
  const m = String(html || '').match(/secureData\s*[:=]\s*["']([^"']{50,})["']/i);
  return m ? m[1] : '';
}

/* secureData objesinden oynatıcı adayları (pichive/dplayer aynaları önce). */
function adaylariTopla(veri) {
  const iliski = veri?.RelatedResults || {};
  const havuz = [];
  const ekle = (liste, dilAdi) => {
    for (const it of Array.isArray(liste) ? liste : []) {
      const ham = String(it?.source_content || it?.source_url || '');
      const src = (ham.match(/src=["']([^"']+)["']/i) || [])[1] || (/^https?:\/\//i.test(ham) ? ham : '');
      if (src) havuz.push({ iframe: src.startsWith('//') ? `https:${src}` : src, ad: it?.source_name || 'Sunucu', dil: it?.language_name || dilAdi || '' });
    }
  };
  ekle(iliski.getEpisodeSources?.result);
  ekle(iliski.getSerieEpisodeSources?.result);
  for (const p of Array.isArray(iliski.getMoviePartsById?.result) ? iliski.getMoviePartsById.result : [])
    ekle(iliski[`getMoviePartSourcesById_${p?.id}`]?.result, p?.language_name);
  const gorulen = new Set();
  return havuz
    .filter(a => !gorulen.has(a.iframe) && gorulen.add(a.iframe))
    .sort((a, b) => (/dplayer|pichive/i.test(a.iframe) ? 0 : 1) - (/dplayer|pichive/i.test(b.iframe) ? 0 : 1))
    .slice(0, 4);
}

/* WebView zinciri (ölçüldü 2026-10-18): düz HTTP 403 (CF parmak izi) ama gerçek
   Chromium Referer ile açınca zincir tam çalışıyor:
   iframe → openPlayer(token) → /source2.php?v=token → playlist.sources[0].file
   (m.php?v=…) → master.m3u8. */
async function pichiveCozWebView(iframeUrl, referer) {
  const kok = iframeUrl.split('/').slice(0, 3).join('/');
  const ilk = await resolvePageInNativeWebView(iframeUrl, { timeoutMs: 8000, media: false, referer });
  const v = (String(ilk?.html || '').match(/openPlayer\s*\(\s*['"]([^'"]+)['"]/) || [])[1];
  if (!v) return null;
  const ikinci = await resolvePageInNativeWebView(`${kok}/source2.php?v=${encodeURIComponent(v)}`, {
    timeoutMs: 8000, media: false, referer: iframeUrl,
  });
  let j = null;
  try { j = JSON.parse(String(ikinci?.text || ikinci?.html || '').trim()); } catch (_) {}
  const akis = j?.playlist?.[0]?.sources?.[0]?.file || '';
  if (!akis) return null;
  let u = String(akis).replace(/\/?m\.php(\?|$)/i, '/master.m3u8$1');
  if (!/\.m3u8(\?|#|$)/i.test(u)) return null;
  if (!/^https?:/i.test(u)) u = `${kok}${u.startsWith('/') ? '' : '/'}${u}`;
  return { url: u, kok, altyazilar: [] };
}

/* dplayer/pichive gömülüsünü canlı HLS'e çevir (ayna denemeleriyle). */
async function pichiveCoz(iframeUrl, referer) {
  const kok = iframeUrl.split('/').slice(0, 3).join('/');
  const html = await metinAl(iframeUrl, { ref: referer, ms: 6000, basliklar: { ...YAYIN_BASLIK, Origin: kok } });
  if (!html) return null;
  let akis = '';
  const v = (html.match(/openPlayer\s*\(\s*['"]([^'"]+)['"]/) || [])[1];
  if (v) {
    const j = await jsonAl(`${kok}/source2.php?v=${encodeURIComponent(v)}`, {
      ref: iframeUrl, ms: 5000,
      basliklar: { ...YAYIN_BASLIK, Origin: kok, 'X-Requested-With': 'XMLHttpRequest' },
    });
    akis = j?.playlist?.[0]?.sources?.[0]?.file || (typeof j?.data === 'string' ? j.data : '');
  }
  if (!akis) akis = beCoz(html) || (html.match(/["'](https?:\/\/[^"'\s]+\.m3u8[^"'\s]*)["']/i) || [])[1] || '';
  if (!akis) return null;
  let u = String(akis).replace(/\/?m\.php(\?|$)/i, '/master.m3u8$1');
  if (!/\.m3u8(\?|#|$)/i.test(u) && !/\.mp4(\?|#|$)/i.test(u)) return null;
  if (!/^https?:/i.test(u)) u = `${kok}${u.startsWith('/') ? '' : '/'}${u}`;
  const altyazilar = [...html.matchAll(/https?:\/\/[^\s"'<>\\]+\.vtt[^\s"'<>\\]*/g)]
    .map(m => m[0].replace(/\\\//g, '/')).slice(0, 2)
    .map(src => ({ src, label: /eng|\.en\./i.test(src) ? 'English' : 'Türkçe' }));
  return { url: u, kok, altyazilar };
}

async function adayCoz(ada, referer) {
  const kok = ada.iframe.split('/').slice(0, 3).join('/');

  /* Cihazda gerçek WebView zinciri ÖNCE: pichive/dplayer aileleri düz HTTP'ye
     403 (CF) veya DNS-bloklu (uptostream) — düz denemeler bütçeyi yiyordu
     (ölçüldü 2026-10-18: 4 düz deneme 25sn → zincire sıra gelmiyordu). */
  if (hasNativeWebViewResolver() && /dplayer|pichive|iframe\.php/i.test(ada.iframe)) {
    const v = (ada.iframe.match(/[?&]v=([a-zA-Z0-9]+)/) || [])[1];
    const host = ((kok.match(/([a-z0-9-]+\.[a-z]{2,})$/i) || [])[1] || '');
    // host numaraları rotasyonlu ve bazıları DNS'de ölü (ölçüldü: dplayer74
    // çözülmüyor) — aynı token'la bilinen aynalar denenir; token host'a özel
    // olduğu için yalnız aynı aile denenir.
    const aynalar = v ? [...new Set([
      ada.iframe,
      `https://four.${host}/iframe.php?v=${v}`,
      `https://sn.${host}/iframe.php?v=${v}`,
      `https://four.dplayer82.site/iframe.php?v=${v}`,
      `https://four.pichive.online/iframe.php?v=${v}`,
    ])] : [ada.iframe];
    for (const hedef of aynalar.slice(0, 3)) {
      const zincir = await pichiveCozWebView(hedef, referer);
      if (zincir) return { ...zincir, ad: ada.ad, dil: ada.dil };
      const cozum = await resolvePageInNativeWebView(hedef, { timeoutMs: 8000, media: true, referer });
      const akis = (cozum?.streams || []).find(a => /\.(m3u8|mp4)([?#]|$)/i.test(String(a?.url || ''))
        && !/\/ads?\/|preroll|vast|doubleclick/i.test(String(a?.url || '')));
      if (akis) return { url: String(akis.url), kok: hedef.split('/').slice(0, 3).join('/'), altyazilar: [], ad: ada.ad, dil: ada.dil };
    }
    return null;
  }

  /* Uptostream/uptostream ailesi: CF'siz; düz sayfada mp4/m3u8 aranır.
     (TR'de DNS'i sık bloklanır — erişilmezse sessizce düşer.) */
  if (/uptostream|uptobox/i.test(ada.iframe)) {
    const html = await metinAl(ada.iframe, { ref: referer, ms: 4000, basliklar: { ...YAYIN_BASLIK, Origin: kok } });
    const u = ((html || '').match(/["'](https?:\/\/[^"'\s]+\.(?:mp4|m3u8)[^"'\s]*)["']/i) || [])[1];
    if (u) return { url: u, kok, altyazilar: [], ad: ada.ad, dil: ada.dil };
    return null;
  }

  if (!/dplayer|pichive|iframe\.php/i.test(ada.iframe)) return null;
  const bulundu = await pichiveCoz(ada.iframe, referer);
  if (bulundu) return { ...bulundu, ad: ada.ad, dil: ada.dil };
  const v = (ada.iframe.match(/[?&]v=([a-zA-Z0-9]+)/) || [])[1];
  // host numaraları rotasyonlu (dplayer74/82 ölçüldü) — aynı host kalıbının
  // bilinen aynaları denenir; iframe zaten doğru hosttaysa tek deneme yeter.
  const host = ((kok.match(/([a-z0-9-]+\.[a-z]{2,})$/i) || [])[1] || '');
  const aynalar = v ? [...new Set([
    `https://four.${host}/iframe.php?v=${v}`,
    `https://sn.${host}/iframe.php?v=${v}`,
    `https://four.dplayer82.site/iframe.php?v=${v}`,
    `https://sn.dplayer82.site/iframe.php?v=${v}`,
    `https://four.pichive.online/iframe.php?v=${v}`,
  ])].filter(u => u !== ada.iframe) : [];
  for (const ayna of aynalar) {
    const t = await pichiveCoz(ayna, referer);
    if (t) return { ...t, ad: ada.ad, dil: ada.dil };
  }

  /* Ölçülen (2026-10-18): pichive/dplayer aynalarının TAMAMI düz HTTP'ye
     403 dönüyor (CF parmak izi) — önce WebView zinciri (iframe→source2→m.php),
     o da vermezse gömülü gizli-WebView ile açılır ve oynatıcının akışı
     istek-kaçırmadan yakalanır. */
  if (hasNativeWebViewResolver()) {
    for (const hedef of [ada.iframe, ...aynalar].slice(0, 2)) {
      const zincir = await pichiveCozWebView(hedef, referer);
      if (zincir) return { ...zincir, ad: ada.ad, dil: ada.dil };
      const cozum = await resolvePageInNativeWebView(hedef, { timeoutMs: 8000, media: true, referer });
      const akis = (cozum?.streams || []).find(a => /\.(m3u8|mp4)([?#]|$)/i.test(String(a?.url || ''))
        && !/\/ads?\/|preroll|vast|doubleclick/i.test(String(a?.url || '')));
      if (akis) return { url: String(akis.url), kok: hedef.split('/').slice(0, 3).join('/'), altyazilar: [], ad: ada.ad, dil: ada.dil };
    }
  }
  return null;
}

export async function getStreams(kimlik, tur = 'movie', sezon = 1, bolum = 1) {
  const bilgi = await tmdbBilgi(kimlik, tur);
  const adaylar = bilgi ? adayBasliklar(bilgi) : [];
  if (!adaylar.length) return [];
  const isFilm = tur !== 'tv';

  /* 1. arama: zarflı POST; başlık kanıtı olmadan hiçbir şey seçilmez. */
  let slug = '';
  for (const soru of adaylar.slice(0, 2)) {
    const j = await jsonAl(rotaYol(ROTA, '/api/bg/searchContent', { searchterm: soru }), {
      ms: 6000, govde: '',
      // form CT ZORUNLU: json CT cihazda CORS ön-kontrolü patlatıyor (ölçüldü 2026-10-18)
      basliklar: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    const parsed = j?.response ? await zarfAc(j.response) : j;
    const items = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.result) ? parsed.result : [];
    const it = items.find(x => x?.object_name && eslesir(x.object_name, soru) && (x?.used_slug || x?.slug));
    if (it) { slug = String(it.used_slug || it.slug).replace(/^\/+|\/+$/g, ''); break; }
  }
  if (!slug) return [];
  const cekirdek = slug.replace(/^(dizi|film|bolum)\//, '');

  /* 2. içerik sayfası → secureData zarfı → adaylar. */
  const yollar = isFilm
    ? [slug, `film/${cekirdek}`]
    : [`${slug}/sezon-${+sezon || 1}/bolum-${+bolum || 1}`, `${cekirdek}-${sezon}-sezon-${bolum}-bolum`, slug];
  let sd = '';
  let sayfaUrl = '';
  for (const yol of [...new Set(yollar)]) {
    const html = await metinAl(rotaYol(ROTA, `/${yol}`), { ref: `${rotaYol(ROTA)}/`, ms: 8000, basliklar: { 'User-Agent': UA } });
    const bulunan = html ? guvenliVeri(html) : '';
    if (bulunan) { sd = bulunan; sayfaUrl = rotaYol(ROTA, `/${yol}`); break; }
  }
  if (!sd) return [];
  const veri = await zarfAc(sd);
  if (!veri) return [];

  /* 3. oynatıcıları paralel çöz; yalnız doğrudan yayın listelenir. */
  const adaylarOyn = adaylariTopla(veri);
  // SIRAYLA: cihazda TEK gizli-WebView var — paralel ateşleme kuyruğu
  // şişirip bütçeyi yiyordu (ölçüldü 2026-10-18). İlk başarılı adayda durulur.
  const sonuc = [];
  const gorulen = new Set();
  for (const ada of adaylarOyn) {
    const v = await adayCoz(ada, sayfaUrl);
    if (!v || gorulen.has(v.url)) continue;
    gorulen.add(v.url);
    const dublaj = /dub/i.test(`${v.dil || ''} ${v.ad || ''}`);
    sonuc.push({
      name: AD,
      title: `${AD} ${String(v.ad).replace(/\s+/g, ' ').slice(0, 14)} ${dublaj ? 'Dublaj' : 'Altyazı'}`,
      url: v.url, quality: '1080p', format: /\.mp4/i.test(v.url) ? 'mp4' : 'm3u8',
      headers: { ...YAYIN_BASLIK, Referer: `${v.kok}/` },
      subtitles: v.altyazilar,
    });
    break;
  }
  return sonuc;
}

if (typeof globalThis !== 'undefined') globalThis.getStreams = getStreams;
export default getStreams;
