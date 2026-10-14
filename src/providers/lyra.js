/* ==========================================================================
   LYRA — SelcukFlix  (sıfırdan, kit sözleşmesi; Patron akışının kendi
   dilimizde yeniden yazılmışı)

   Adımlar:
     1. Alan adı: siteurl.txt (selcukflix) → bilinen adres
     2. Arama:  POST /api/bg/searchContent?searchterm={imdb|başlık}
                → {response: AES-CBC zarf} → çöz → result[] → used_slug
     3. Sayfa:  /dizi/{slug}/sezon-S/bolum-E (film: /film/{slug}) —
                __NEXT_DATA__ içindeki secureData zarfı aynı anahtarla açılır
     4. Kaynak: RelatedResults.getEpisodeSources / getSerieEpisodeSources /
                getMoviePartsById→getMoviePartSourcesById_{id} → iframe ADAYI
     5. Oynatıcı: pichive/dplayer → openPlayer(v) → source2.php →
                playlist[0].sources[0].file (m.php → master.m3u8).
                Diğer gömülüler extractEmbedStream; isIframe ATILIR.
     6. Referer = oynatıcı kökü, UA = okhttp/4.9.2.
   ========================================================================== */

import {
  istek, gonder, izleyici, mutlak, koken, m3u8eCevir, medyaMi,
  kaynak, temizBaslik, baslikEslesir, alanAdiCoz, tmdbMeta, tracksAltyazilari,
} from './kit.js';
import { extractEmbedStream } from '../services/embedExtractors.js';
import { be } from '../services/hdfcDecoders.js';
import CryptoJS from '../vendor/crypto-js.js';

const BILINEN = ['https://selcukflix.app'];
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
const PLAYER_UA = 'okhttp/4.9.2';
const ZARF_ANAHTARI = '9bYMCNQiWsXIYFWYAu7EkdsSbmGBTyUI';
const SIFIR_IV = '00000000000000000000000000000000';

export const kimlik = { id: 'slc', alias: 'Lyra', mediaTypes: ['movie', 'tv'] };

/* Çözülen taban adresi modül düzeyinde önbellekte (TTL 15 dk): her çağrıda
   kök yoklama (siteurl + HEAD/GET) vergisi ödenmez. */
const _temel = { at: 0, base: '' };
async function temelAdres(trace) {
  if (_temel.base && Date.now() - _temel.at < 900000) { trace?.koy('alan-adi', { onbellek: _temel.base }); return _temel.base; }
  const base = await alanAdiCoz('selcukflix', BILINEN, { trace, ua: PLAYER_UA });
  if (base) _temel.at = Date.now(), _temel.base = base;
  return base;
}

/* ── zarf çözümü ────────────────────────────────────────────────────────── */

/** AES-CBC (sabit anahtar, sıfır IV) → düz metin. */
function aesCoz(b64) {
  const kirik = String(b64 || '').replace(/"/g, '').trim();
  if (kirik.length < 24) return '';
  try {
    const d = CryptoJS.AES.decrypt(
      { ciphertext: CryptoJS.enc.Base64.parse(kirik) },
      CryptoJS.enc.Utf8.parse(ZARF_ANAHTARI),
      { iv: CryptoJS.enc.Hex.parse(SIFIR_IV) },
    );
    return d.toString(CryptoJS.enc.Utf8) || d.toString(CryptoJS.enc.Latin1) || '';
  } catch (_) { return ''; }
}

function base64Coz(s) {
  try { return CryptoJS.enc.Base64.parse(String(s).trim()).toString(CryptoJS.enc.Utf8); } catch (_) { return ''; }
}

/** Gömülü `"getEpisodeSources"…"result":[…]` yığınlarını objeye çevir. */
function iliskileriTara(metin) {
  const bul = (anahtar) => {
    const i = String(metin).indexOf(`"${anahtar}"`);
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
  for (const k of ['getEpisodeSources', 'getSerieEpisodeSources', 'getMoviePartsById']) {
    const r = bul(k);
    if (Array.isArray(r) && r.length) { RelatedResults[k] = { result: r }; bulundu = true; }
  }
  return bulundu ? { RelatedResults } : null;
}

/** secureData / response zarfını sırayla aç: JSON → base64 → AES → gömülü tarama. */
function zarfiCoz(blok) {
  const t = String(blok || '').trim();
  if (!t) return null;
  if (t.startsWith('{') || t.startsWith('[')) { try { return JSON.parse(t); } catch (_) {} }
  const dene = (metin) => {
    if (!metin) return null;
    const m = metin.trim();
    if (m.startsWith('{') || m.startsWith('[')) { try { return JSON.parse(m); } catch (_) {} }
    return iliskileriTara(m);
  };
  if (/^(ey|Wy|Ww)/.test(t)) { const a = dene(base64Coz(t)); if (a) return a; }
  const b = dene(aesCoz(t));
  if (b) return b;
  const c = dene(base64Coz(t));
  return c;
}

/* ── sayfa / arama ─────────────────────────────────────────────────────── */

/** Dizinin __NEXT_DATA__ (veya düz gömülü) secureData zarfını bul. */
function guvenliVeri(html) {
  const nd = String(html || '').match(/__NEXT_DATA__"[^>]*>(\{[\s\S]*?\})<\/script>/i);
  if (nd) { try { const sd = JSON.parse(nd[1])?.props?.pageProps?.secureData; if (sd) return sd; } catch (_) {} }
  const m = String(html || '').match(/secureData\s*[:=]\s*["']([^"']{50,})["']/i);
  return m ? m[1] : '';
}

/** Arama yanıtından {slug, ad, dil ipucu} seç. */
function aramaSec(parsed, imdb, terim, adayBasliklar) {
  const items = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.result) ? parsed.result : [];
  if (!items.length) return null;
  const idIle = imdb ? items.find((x) => x?.object_related_imdb_id === imdb) : null;
  const adla = items.find((x) => x?.object_name && baslikEslesir(x.object_name, [...(adayBasliklar || []), terim].filter(Boolean)) && x?.used_slug);
  // Kör seçim YASAK (denetim matrisi #1): tek-sonuç ve items[0] kısayolları
  // dolgu/çöp yanıtta kimlik kanıtsız içeriğe indiriyordu — imdb veya başlık
  // kanıtı yoksa hiçbir şey seçilmez.
  const it = idIle || adla;
  const slug = it?.used_slug || it?.slug || '';
  return slug ? { slug, ad: it?.object_name || it?.title || '' } : null;
}

/** pichive/dplayer gömülüsünü doğrudan m3u8'e çevir. */
async function pichiveCoz(iframeUrl, referer, trace, signal = null) {
  const kok = koken(iframeUrl);
  const html = await istek(iframeUrl, {
    ref: referer, timeout: 6000, trace, webView: false, signal,
    headers: { 'User-Agent': PLAYER_UA, Origin: kok },
  });
  if (!html) return null;
  let akis = '';
  const v = (html.match(/openPlayer\s*\(\s*['"]([^'"]+)['"]/) || [])[1];
  if (v) {
    const ham = await istek(`${kok}/source2.php?v=${encodeURIComponent(v)}`, {
      ref: iframeUrl, timeout: 5000, trace, webView: false, signal,
      headers: { 'User-Agent': PLAYER_UA, Origin: kok, 'X-Requested-With': 'XMLHttpRequest' },
    });
    try {
      const j = JSON.parse(ham);
      akis = j?.playlist?.[0]?.sources?.[0]?.file || (typeof j?.data === 'string' ? j.data : '');
    } catch (_) {}
  }
  if (!akis) akis = be(html) || (html.match(/["'](https?:\/\/[^"'\s]+\.m3u8[^"'\s]*)["']/i) || [])[1] || '';
  if (!akis) return null;
  const u = m3u8eCevir(mutlak(String(akis).replace(/\/?m\.php(\?|$)/i, '/master.m3u8$1'), kok));
  if (!medyaMi(u)) return null;
  const altyazilar = tracksAltyazilari(html, iframeUrl, PLAYER_UA);
  for (const m of html.matchAll(/https?:\/\/[^\s"'<>\\]+\.vtt[^\s"'<>\\]*/gi)) {
    const url = m[0].replace(/\\\//g, '/');
    if (!altyazilar.some((a) => a.url === url)) {
      const dil = /eng|\.en\./i.test(url) ? 'en' : 'tr';
      altyazilar.push({ url, src: url, label: dil === 'tr' ? 'Türkçe' : 'English', language: dil, headers: { Referer: `${kok}/`, 'User-Agent': PLAYER_UA, Accept: '*/*' } });
    }
  }
  return { url: u, altyazilar, kok };
}

/** Bir oynatıcı adayını yayına çevir; çözülemezse null (iframe ASLA dönmez). */
async function adayCoz(ada, referer, trace, signal = null) {
  const kok = koken(ada.iframe);
  if (/pichive|dplayer|iframe\.php/i.test(ada.iframe)) {
    const r = await pichiveCoz(ada.iframe, referer, trace, signal);
    if (r) return { ...r, ad: ada.ad, dil: ada.dil };
    // ayna denemeleri (Patron'un four/sn yedekleri)
    const v = (ada.iframe.match(/[?&]v=([a-zA-Z0-9]+)/) || [])[1];
    if (v) {
      const aynalar = ['four.dplayer82.site', 'sn.dplayer82.site', 'four.pichive.online']
        .map((h) => `https://${h}/iframe.php?v=${v}`).filter((u) => u !== ada.iframe);
      const denemeler = await Promise.allSettled(aynalar.map((u) => pichiveCoz(u, referer, trace, signal)));
      const iyi = denemeler.find((d) => d.status === 'fulfilled' && d.value);
      if (iyi) return { ...iyi.value, ad: ada.ad, dil: ada.dil };
    }
    return null;
  }
  if (!/^https?:/i.test(ada.iframe)) return null;
  const ic = await extractEmbedStream(ada.iframe, referer, new Set(), Date.now() + 4500);
  if (!ic || ic.isIframe || !medyaMi(ic.url)) return null;
  return { url: m3u8eCevir(ic.url), altyazilar: ic.subtitles || [], kok: kok || koken(ic.url), ad: ada.ad, dil: ada.dil };
}

/** secureData objesinden oynatıcı adaylarını topla. */
function adaylariTopla(veri) {
  const iliski = veri?.RelatedResults || veri?.content?.result?.RelatedResults || {};
  const havuz = [];
  const kaynaklariEkle = (liste, dilAdi) => {
    for (const it of Array.isArray(liste) ? liste : []) {
      const ham = String(it?.source_content || it?.source_url || '');
      const src = (ham.match(/src=["']([^"']+)["']/i) || [])[1] || (/^https?:\/\//i.test(ham) ? ham : '');
      if (!src) continue;
      havuz.push({
        iframe: src.startsWith('//') ? `https:${src}` : src,
        ad: it?.source_name || 'Sunucu',
        dil: it?.language_name || dilAdi || '',
      });
    }
  };
  kaynaklariEkle(iliski.getEpisodeSources?.result);
  kaynaklariEkle(iliski.getSerieEpisodeSources?.result);
  const parcalar = iliski.getMoviePartsById?.result;
  if (Array.isArray(parcalar)) for (const p of parcalar) kaynaklariEkle(iliski[`getMoviePartSourcesById_${p?.id}`]?.result, p?.language_name);
  for (const [k, val] of Object.entries(iliski)) {
    if (/(PartSources|MovieSources|sources)/i.test(k)) kaynaklariEkle(val?.result);
  }
  for (const k of ['sources', 'mirrors', 'links']) {
    if (Array.isArray(veri?.[k])) for (const it of veri[k]) {
      const src = it?.url || it?.file || it?.link || '';
      if (/^https?:\/\//i.test(src) || src.startsWith('//')) havuz.push({ iframe: src.startsWith('//') ? `https:${src}` : src, ad: it?.source_name || 'Sunucu', dil: it?.language_name || '' });
    }
  }
  const gorulen = new Set();
  const tekil = havuz.filter((a) => !gorulen.has(a.iframe) && gorulen.add(a.iframe));
  // pichive'nin hızlı aynaları önce oynatılsın
  tekil.sort((a, b) => (/four\.(pichive|dplayer)|sn\.dplayer/.test(a.iframe) ? 0 : /pichive|dplayer/.test(a.iframe) ? 1 : 2)
    - (/four\.(pichive|dplayer)|sn\.dplayer/.test(b.iframe) ? 0 : /pichive|dplayer/.test(b.iframe) ? 1 : 2));
  return tekil.slice(0, 4);
}

/** Nuvio `load()` eşdeğeri. */
export async function coz({ type = 'movie', title = '', originalTitle = '', titles = [], imdbId = null, tmdbId = null, season = 1, episode = 1, signal = null } = {}) {
  const trace = izleyici();
  const isFilm = type === 'movie';
  const s = +season || 1, e = +episode || 1;
  const adayBasliklar = [...new Set([title, originalTitle, ...titles].map(temizBaslik).filter(Boolean))];

  const base = await temelAdres(trace);
  if (!base) return { sources: [], trace: trace.ozet() };
  const baslıklar = { 'User-Agent': PLAYER_UA, Origin: base, Referer: `${base}/`, 'Content-Type': 'application/json' };

  // — 1. IMDb'yi bul (argüman yoksa TMDB'den)
  let imdb = imdbId && /^tt/i.test(String(imdbId)) ? String(imdbId) : '';
  let trAd = '';
  if (!imdb && tmdbId) {
    const meta = await tmdbMeta(tmdbId, isFilm ? 'movie' : 'tv', { trace });
    imdb = meta?.imdb || '';
    trAd = meta?.tr || '';
  }

  // — 2. arama: zarflı JSON; BAŞLIKLAR önce (site IMDb sorgularını soğukta
  //    throttle ediyor; sıcakta aynı POST ~220 ms), IMDb → IMDb(tt'siz) → TR ad
  //    yedek. POST tavanı 3 sn; timeout olduysa AYNI sorgunun GET kopyası
  //    denenmez (boşa bekleme), yalnız hızlı hatada GET yedeği çalışır.
  let slug = '';
  const sorgular = [...new Set([...adayBasliklar, imdb, imdb ? imdb.replace(/^tt/i, '') : '', trAd].filter(Boolean))];
  for (const q of sorgular) {
    if (slug) break;
    const uç = `${base}/api/bg/searchContent?searchterm=${encodeURIComponent(q)}`;
    const t0 = Date.now();
    let ham = await gonder(uç, '', { headers: baslıklar, timeout: 3000, trace, signal });
    if (!ham && Date.now() - t0 < 2800) ham = await istek(uç, { headers: baslıklar, timeout: 3000, trace, webView: false, signal });
    let parsed = null;
    try { const j = JSON.parse(ham); parsed = j?.response ? zarfiCoz(j.response) : j; } catch (_) { parsed = zarfiCoz(ham); }
    const secim = aramaSec(parsed, imdb, q, adayBasliklar);
    trace.koy('arama', { q: String(q).slice(0, 24), slug: secim?.slug || '' });
    if (secim) slug = secim.slug;
  }
  if (!slug) { trace.koy('sonuc', { n: 0, neden: 'arama' }); return { sources: [], trace: trace.ozet() }; }
  slug = String(slug).replace(/^\/+|\/+$/g, '');
  const cekirdek = slug.replace(/^(dizi|film|bolum)\//, '');

  // — 3. içerik sayfası: doğru sezon/bölüm URL'sini bul
  const yollar = isFilm
    ? [slug, `${slug}/izle`, `film/${cekirdek}`]
    : [`${slug}/sezon-${s}/bolum-${e}`, `${cekirdek}-${s}-sezon-${e}-bolum`, slug];
  const sayfaDenemeleri = yollar.filter((v, i, a) => a.indexOf(v) === i).map((y) => async () => {
    const html = await istek(`${base}/${y}`, { ref: `${base}/`, headers: { 'User-Agent': UA }, timeout: 8000, trace, webView: false, signal });
    const sd = html ? guvenliVeri(html) : '';
    return sd ? { url: `${base}/${y}`, sd } : null;
  });
  const bulunan = (await Promise.allSettled(sayfaDenemeleri.map((f) => f())))
    .find((r) => r.status === 'fulfilled' && r.value);
  let hedef = bulunan ? bulunan.value : null;

  // ana sayfadaki bölüm listesinden dene (slug kalıpları tutmazsa)
  if (!hedef && !isFilm) {
    const anaHtml = await istek(`${base}/${slug}`, { ref: `${base}/`, headers: { 'User-Agent': UA }, timeout: 8000, trace, webView: false, signal });
    const anaSd = anaHtml ? guvenliVeri(anaHtml) : '';
    const anaVeri = anaSd ? zarfiCoz(anaSd) : null;
    const liste = anaVeri?.RelatedResults?.getSerieSeasonAndEpisodes?.result || anaVeri?.seasons || [];
    let epSlug = '';
    for (const it of Array.isArray(liste) ? liste : []) {
      if (+it?.season_no === s && +it?.episode_no === e) { epSlug = it?.used_slug || it?.slug || ''; break; }
      const ep = (it?.episodes || []).find((x) => +x?.episode_no === e);
      if (+it?.season_no === s && ep) { epSlug = ep?.used_slug || ep?.slug || ''; break; }
    }
    if (epSlug) {
      const epUrl = `${base}/${String(epSlug).replace(/^\/+/, '')}`;
      const epHtml = await istek(epUrl, { ref: `${base}/`, headers: { 'User-Agent': UA }, timeout: 8000, trace, webView: false, signal });
      const epSd = epHtml ? guvenliVeri(epHtml) : '';
      if (epSd) hedef = { url: epUrl, sd: epSd };
    }
  }
  if (!hedef) { trace.koy('sonuc', { n: 0, neden: `sayfa-yok S${s}E${e}` }); return { sources: [], trace: trace.ozet() }; }
  const veri = zarfiCoz(hedef.sd);
  if (!veri) { trace.koy('sonuc', { n: 0, neden: 'zarf-açılmadı' }); return { sources: [], trace: trace.ozet() }; }
  trace.koy('sayfa', { url: hedef.url });

  // — 4/5. oynatıcı adaylarını paralel çöz
  const adaylar = adaylariTopla(veri);
  trace.koy('adaylar', adaylar.map((a) => a.ad));
  const cozumler = await Promise.allSettled(adaylar.map((a) => adayCoz(a, hedef.url, trace, signal)));

  const liste = [];
  const gorulen = new Set();
  for (const c of cozumler) {
    if (c.status !== 'fulfilled' || !c.value || !medyaMi(c.value.url) || gorulen.has(c.value.url)) continue;
    gorulen.add(c.value.url);
    const dublaj = /dub/i.test(c.value.dil || '') || /dublaj/i.test(c.value.ad || '');
    const etiket = String(c.value.ad || 'Sunucu').replace(/\s+/g, '').slice(0, 14);
    const taban = `${(imdbId || tmdbId || 'x').toString().replace(/\W/g, '')}_${isFilm ? 'm' : `s${s}e${e}`}`;
    liste.push(kaynak({
      id: `slc_${dublaj ? 'dub' : 'sub'}_${taban}_${liste.length}`,
      ad: `Lyra ${c.value.ad || ''} ${dublaj ? 'Dublaj' : 'Altyazı'}`.replace(/\s+/g, ' ').trim(),
      url: c.value.url,
      kategori: dublaj ? 'dubbed' : 'subtitled',
      headers: { Referer: `${c.value.kok || base}/`, 'User-Agent': PLAYER_UA, Accept: '*/*' },
      altyazilar: (c.value.altyazilar || []).map((t) => ({ ...t, url: t.url || t.src, src: t.src || t.url, headers: t.headers || { Referer: `${c.value.kok || base}/`, 'User-Agent': PLAYER_UA, Accept: '*/*' } })),
      kalite: '1080p',
    }));
  }
  trace.koy('sonuc', { n: liste.length, aday: adaylar.length });
  return { sources: liste, trace: trace.ozet() };
}

export default { apiVersion: 1, id: kimlik.id, name: kimlik.alias, mediaTypes: kimlik.mediaTypes, async resolve(a) { return (await coz(a)).sources; } };
