/* ==========================================================================
   CinePulse Studio - Dizisol Scraper (Movies & TV Series Engine)
   Direct high-speed HLS (.m3u8) streams with Dual-Audio & Subtitles from Dizisol
   Supports instant TMDB lookup & keyword search.
   ========================================================================== */

import { apiUrl } from './apiOrigin.js';
import { akilliGet, engelSayfaMi } from './nativeHttp.js';

const DIZISOL_API_BASE = 'https://dizisol.com/api';

// Önbellek iki katmanlı:
//  - taze veri: 2 dk (klasik akış, bayat-JSON'a karşı kısa tutulur)
//  - son iyi yanıt (lastGood): 10 saat. Site tarafı kısa süreli engeldeyse
//    (challenge HTML / 403 → çözülebilir JSON değil) sağlayıcı son iyi
//    yanıtla kaynak listemeye devam eder; engel kalkınca kendiliğinden taze
//    veriye döner. Anahtarlar içerik bazlıdır: çözümleyici yolu type + tmdbId
//    + sezon/bölüm içeren sorgu dizisini, klasik akış by-tmdb/episodes yollarını
//    kullanır. Yeni bağımlılık yok — yalnız dizisolCache genişletildi.
const TAZE_SURE_MS = 120000;
const SON_IYI_SURE_MS = 10 * 3600 * 1000;

// Ortam bazlı /api/dzs geçiş (gateway) öneki:
//  - Node/EXE: apiUrl() yerel geçide (:4000) götürür — Node'da relative URL
//    fetch()'te throw ettiği için mutlak adres ŞART.
//  - Localhost tarayıcı dev: relative kalır (vite proxy → :4000).
//  - Capacitor/statik host: apiUrl() geçerli geçidi üretir.
function dzsGatewayBase() {
  if (typeof window !== 'undefined' && isLocalHost()) return '';
  return apiUrl('/api/dzs');
}

async function fetchDizisolApi(endpoint, options = {}) {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const directUrl = `${DIZISOL_API_BASE}${cleanEndpoint}`;
  const timeoutMs = options.timeout || 3500;

  const fetchDirect = async () => {
    const res = await fetch(directUrl, {
      ...options,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        ...(options.headers || {})
      },
      signal: AbortSignal.timeout(timeoutMs)
    });
    if (res && res.ok) return res;
    throw new Error('Direct fetch failed');
  };

  const fetchGateway = async () => {
    const res = await fetch(`${dzsGatewayBase()}${cleanEndpoint}`, {
      ...options,
      headers: {
        'Accept': 'application/json, text/plain, */*',
        ...(options.headers || {})
      },
      signal: AbortSignal.timeout(timeoutMs)
    });
    if (res && res.ok) return res;
    throw new Error('Gateway fetch failed');
  };

  // JSON görünümlü gövde mi? Challenge sayfaları bazen 200 ile de döner;
  // `res.ok` tek başına "çözülebilir JSON" garantisi değildir (ölçüldü:
  // Turnstile 403-HTML kadar 200-HTML de üretiyor).
  // Gizli WebView JSON uç noktasını gerçek motorla açtığında Chrome JSON'u
  // <pre> içine sarar — ham JSON değilse HTML kabuğundaki dış parantezi kaz.
  const jsonKaz = (metin) => {
    const t = String(metin || '').trim();
    const bas = t[0];
    if ((bas === '{' || bas === '[') && !engelSayfaMi(t)) return t;
    const kaz = (ac, kapa) => {
      const i = t.indexOf(ac);
      const j = t.lastIndexOf(kapa);
      if (i === -1 || j <= i) return '';
      const aday = t.slice(i, j + 1);
      try { JSON.parse(aday); return aday; } catch (_) { return ''; }
    };
    // DIŞ yapı, daha erken başlayan adadır: "[{..}]" gövdesinde '{' ile
    // kazmak içteki tek nesneyi çıkarır ve arama "0 sonuç" olur (test yakaladı).
    const iC = t.indexOf('{');
    const iD = t.indexOf('[');
    const onece = (iD !== -1 && (iC === -1 || iD < iC)) ? [kaz('[', ']'), kaz('{', '}')] : [kaz('{', '}'), kaz('[', ']')];
    for (const aday of onece) {
      if (aday && !engelSayfaMi(aday)) return aday;
    }
    return '';
  };

  try {
    const res = await Promise.any([fetchGateway(), fetchDirect()]);
    const metin = await res.text().catch(() => '');
    const temiz = jsonKaz(metin);
    if (temiz) {
      return new Response(temiz, { status: res.status, headers: { 'Content-Type': 'application/json' } });
    }
    // Geçerli sayılan yanıtın gövdesi JSON değil → engelli sayılır ve
    // aşağıdaki gizli WebView denemesine düşülür.
  } catch (_) { /* iki yol da düştü → webview */ }

  // TEK gizli WebView denemesi (cihaz/masaüstü gerçek tarayıcı motoru):
  // Cloudflare Turnstile challenge'ı yalnız gerçek motorla geçilir; geçen
  // çerez paylaşıldığı için aynı oturumda bu yol genelde BİR kez yürür.
  // Motor yoksa (web testi/Node) gizli deneme anında '' döner — davranış
  // eskisi gibi null → lastGood (cache-fallback) zincirine düşer.
  try {
    const metin = await akilliGet(directUrl, {
      timeout: 12000,
      headers: { Accept: 'application/json, text/plain, */*' },
      webView: true,
    });
    const temiz = jsonKaz(metin);
    if (temiz) {
      return new Response(temiz, { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
  } catch (_) { /* motor meşgul/ yok → null */ }
  return null;
}

// key -> { data, timestamp, promise, lastGood, lastGoodAt }
const dizisolCache = new Map();

function adetSayisi(d) {
  if (Array.isArray(d)) return d.length;
  if (d && Array.isArray(d.streams)) return d.streams.length;
  return d ? 1 : 0;
}

// Son iyi yanıt, SON_IYI_SURE_MS'den eski değilse döner + anonim iz olayı yazar.
// Olay yalnız adet/yas taşır — site ya da alan adı bilgisi SIZMAZ.
function sonIyiVeri(key, onEvent) {
  const e = dizisolCache.get(key);
  if (!e || !e.lastGood || Date.now() - e.lastGoodAt > SON_IYI_SURE_MS) return null;
  if (typeof onEvent === 'function') {
    onEvent('cache-fallback', {
      adet: adetSayisi(e.lastGood),
      'yas-dk': Math.round((Date.now() - e.lastGoodAt) / 60000)
    });
  }
  return e.lastGood;
}

// Genel önbellek sarmalayıcı: taze veri <2dk doğrudan döner; getirici null
// dönerse (ağ engeli / çözümleyemeyen gövde) lastGood'a düşülür. `iyiMi`
// yanlışsa yanıt geçerli ama "sonuçsuz"dur (örn. success:false) — taze slot'a
// yazılır, lastGood'a YÜKSELTİLMEZ ve fallback tetiklenmez (gerçekten
// kalkmış içerik için uydurma kaynak üretilmez).
async function onbellekle(key, getirici, onEvent, iyiMi) {
  const now = Date.now();
  const cached = dizisolCache.get(key) || {};
  if (cached.data && (now - cached.timestamp < TAZE_SURE_MS)) {
    return cached.data;
  }
  if (cached.promise) {
    return cached.promise;
  }

  const p = (async () => {
    let veri = null;
    try { veri = await getirici(); } catch (_) { veri = null; }
    const guncel = dizisolCache.get(key) || {};
    const { promise: _birak, ...temiz } = guncel; // söndürülmüş promise slotu taşınmaz
    if (veri && (!iyiMi || iyiMi(veri))) {
      dizisolCache.set(key, { ...temiz, data: veri, timestamp: Date.now(), lastGood: veri, lastGoodAt: Date.now() });
      return veri;
    }
    if (veri) {
      dizisolCache.set(key, { ...temiz, data: veri, timestamp: Date.now() });
      return veri;
    }
    // Engel/bozuk yanıt: taze slot temizlenir ki sonraki deneme tekrar ağı
    // yoklasın; lastGood korunur.
    dizisolCache.set(key, { lastGood: guncel.lastGood, lastGoodAt: guncel.lastGoodAt });
    return sonIyiVeri(key, onEvent);
  })();

  dizisolCache.set(key, { ...cached, promise: p, timestamp: now });
  return p;
}

async function fetchDizisolJson(endpoint, options = {}) {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const { onEvent, ...netOptions } = options;
  return onbellekle(`api${cleanEndpoint}`, async () => {
    const res = await fetchDizisolApi(cleanEndpoint, netOptions);
    if (!res) return null;
    // Challenge HTML / JSON dışı gövde → null → cache-fallback devreye girer.
    const veri = await res.json().catch(() => null);
    if (!veri) return null;
    // Site zarf değiştirdi (ölçüldü): bazı uçlar artık düz dizi/nesne yerine
    // {"status":200,"result":<eski şekil>} dönüyor. Dış katman açılmazsa her
    // arama "geçerli ama boş" görünüyordu — Kaynaklar'ın kaybolma nedeni.
    if (!Array.isArray(veri) && typeof veri === 'object' && 'result' in veri) {
      const ic = veri.result;
      if (Array.isArray(ic)) return ic;
      if (ic && typeof ic === 'object') {
        if (Array.isArray(ic.data)) return ic.data;
        return ic;
      }
    }
    return veri;
  }, onEvent);
}

/**
 * Searches Dizisol catalog by query
 */
export async function searchDizisol(query, onEvent) {
  if (!query || typeof query !== 'string' || query.trim().length < 2) return [];

  try {
    const data = await fetchDizisolJson(`/movies/search?q=${encodeURIComponent(query.trim())}`, { timeout: 3500, onEvent });
    return Array.isArray(data) ? data : [];
  } catch (_) {
    return [];
  }
}

function toProxiedDizisolStreamUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  const isBrowser = typeof window !== 'undefined';
  // Relative /api/ URL'leri dizisol.com'a ait — absolute'a çevir ve proxy'den geçir
  // (filmekseni gibi provider'lar Referer: dizisol.com gerektiriyor)
  const fullUrl = rawUrl.startsWith('/api/')
    ? `https://dizisol.com${rawUrl}`
    : rawUrl;
  if (isBrowser) {
    return `/api/hls_proxy?url=${encodeURIComponent(fullUrl)}&ref=${encodeURIComponent('https://dizisol.com/')}`;
  }
  return fullUrl;
}

function toProxiedDizisolSubUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== 'string') return '';
  const isBrowser = typeof window !== 'undefined';
  if (isBrowser && rawUrl.includes('dizisol.com')) {
    return `/api/hls_proxy?url=${encodeURIComponent(rawUrl)}&ref=${encodeURIComponent('https://dizisol.com/')}`;
  }
  return rawUrl;
}

function isValidDizisolStreamUrl(url) {
  if (!url || typeof url !== 'string') return false;
  // Relative /api/ URL'leri kabul et (filmekseni gibi proxy URL'leri)
  const isRelativeApi = url.startsWith('/api/');
  if (!isRelativeApi && !url.startsWith('http://') && !url.startsWith('https://')) return false;
  // Oynatılamayan formatları filtrele
  if (url.includes('picturebox.cloud')) return false;
  if (url.includes('setfilmizle::')) return false;  // embed formatı, oynatılamaz
  if (url.startsWith('setfilmizle:')) return false;
  return true;
}

function getDizisolStreamPriority(url, provider = '') {
  let score = 10;
  const lowUrl = (url || '').toLowerCase();
  const lowProv = (provider || '').toLowerCase();

  // VIP (ana m3u8Url) en güvenilir kaynaktır, her zaman ilk sırada yer almalı.
  // FilmMakinesi çalışıyor gibi görünse de ilk fragmentlardan sonra takılıyor,
  // bu nedenle otomatik seçimde asla kazanmamalı.
  if (lowProv === 'vip') score += 105;
  else if (lowProv === 'cortina') score += 100;
  else if (lowProv === 'vidmixi') score += 95;
  else if (lowProv === 'rapidrame') score += 90;
  else if (lowProv === 'hdfilmdelisi') score += 85;
  else if (lowProv === 'pal-vds' || lowProv === 'dizipal-vds') score += 80;
  else if (lowProv === 'vidrame') score += 75;
  else if (lowProv === 'dosyaload') score += 72;
  else if (lowProv === 'imagestoo') score += 70;
  else if (lowProv === 'diziyou') score += 68;
  else if (lowProv === 'fullhd') score += 65;
  else if (lowProv === 'filmekseni') score += 60;
  else if (lowProv === 'videoplays') score += 55;
  else if (lowProv === 'canlidizi') score += 50;
  else if (lowProv === 'draktar') score += 45;
  else if (lowProv === 'filmmakinesi') score += 15;
  else score += 40; // bilinmeyen sağlayıcılar için ortalama puan

  if (lowUrl.includes('dizisol.com')) score += 10;

  return score;
}

function isLocalHost() {
  if (typeof window === 'undefined') return false;
  try { if (window.Capacitor?.isNativePlatform?.() || window.location?.protocol === 'capacitor:') return false; } catch (_) {}
  const host = window.location?.hostname || '';
  return host === 'localhost' || host === '127.0.0.1';
}

function locStreamUrl(p) {
  if (!p || /^https?:\/\//i.test(p)) return p;
  if (typeof window !== 'undefined') {
    const host = window.location?.hostname || '';
    if ((host === 'localhost' || host === '127.0.0.1') && !Boolean(window.Capacitor?.isNativePlatform?.()) && window.location?.protocol !== 'capacitor:') return p;
  }
  return apiUrl(p);
}

function mapResolveData(rdata, { isDub, tagPrefix, epSuffix }) {
  try {
    if (!rdata || !rdata.success || !Array.isArray(rdata.streams)) return [];
    return rdata.streams.map((s, index) => {
      const prov = String(s.provider || 'VIP').replace(/^DS\s+/i, '') || 'VIP';
      const base = index === 0 ? 'Ana Yayın' : `Alternatif Yayın ${index}`;
      const label = epSuffix ? `${base} (${epSuffix})`.replace(' (HLS) (', ' (') : base;
      const url = locStreamUrl(s.streamUrl);
      const subs = Array.isArray(s.subtitles) ? s.subtitles : [];
      return {
        id: `${tagPrefix}_${s.tag || prov.toLowerCase().replace(/\s+/g, '')}_${index}`,
        name: label,
        displayName: label,
        badge: isDub ? '⚡ TR Dublaj' : '💬 TR Altyazı',
        source: 'DS',
        url,
        streamUrl: url,
        originalEmbedUrl: s.rawStreamUrl,
        quality: '1080p',
        isHls: true,
        isDirectVideo: true,
        type: 'hls',
        subtitles: subs,
        isDub,
        getUrl: () => url
      };
    }).filter((s) => s.streamUrl);
  } catch (_) {
    return [];
  }
}

function resolveEndpoint(provider, params = {}) {
  const qs = new URLSearchParams({ provider, ...params });
  const path = `/api/resolve?${qs.toString()}`;
  // Localhost'ta vite proxy -> :4000 (guncel resolver); canlida Vercel API.
  if (isLocalHost()) return path;
  // Node/EXE: relative yol fetch()'te throw eder ve resolver kolu hicbir zaman
  // sidecar'a ulasamiyordu; apiUrl() Node'da yerel gecide (:4000) go turur.
  return apiUrl(path);
}

// Cozumleyici yaniti ayni onbellekten gecer: gecit/ust akis engellendiyse
// (challenge HTML, 403, cozulemeyen JSON) son iyi streams yuklu yanitla
// devam edilir. Anahtar, sorgu dizesi sayesinde tur + tmdbId + sezon/bolum
// bazlidir. success:false gecici bos sayilir: taze slot'a yazilir, lastGood
// olarak yukseltilmez (iyiMi).
async function fetchResolveJson(endpoint, onEvent) {
  return onbellekle(`resolve::${endpoint}`, async () => {
    const res = await fetch(endpoint, {
      headers: { 'Accept': 'application/json' },
      signal: AbortSignal.timeout(15000)
    }).catch(() => null);
    if (!res || !res.ok) return null;
    const data = await res.json().catch(() => null);
    return data || null;
  }, onEvent, (d) => d.success !== false);
}

/**
 * Extracts Movie streams from Dizisol (ozel backend resolver).
 */
export async function fetchDizisolMovieSources({
  titles = [],
  title = '',
  originalTitle = '',
  tmdbId = null,
  isDub = true,
  onEvent = null
}) {
  try {
    // Ozel backend resolver (birincil); basarisizsa klasik akisa dus.
    try {
      const params = {
        type: 'movie', title: title || '', originalTitle: originalTitle || '',
        ...(tmdbId ? { tmdbId: String(tmdbId) } : {})
      };
      (titles || []).forEach((t, i) => { if (i < 4 && t) params[`t${i}`] = t; });
      const rdata = await fetchResolveJson(resolveEndpoint('dzs', params), onEvent);
      const mapped = mapResolveData(rdata, { isDub, tagPrefix: `dzs_mov_${tmdbId || 'q'}`, epSuffix: '' });
      if (mapped.length > 0) return mapped;
    } catch (_) {}

    let targetTmdbId = tmdbId ? Number(tmdbId) : null;

    if (!targetTmdbId) {
      const candidates = [...new Set([...titles, title, originalTitle])].filter(t => t && t.trim().length > 1);
      for (const q of candidates) {
        const results = await searchDizisol(q, onEvent);
        const match = results.find(r => r.type === 'movie');
        if (match && match.tmdbId) {
          targetTmdbId = Number(match.tmdbId);
          break;
        }
      }
    }

    if (!targetTmdbId) return [];

    const data = await fetchDizisolJson(`/movies/by-tmdb/${targetTmdbId}`, { timeout: 4000, onEvent });
    if (!data) return [];

    const subtitles = [];
    if (data.subtitleTr) subtitles.push({ label: 'Türkçe', src: toProxiedDizisolSubUrl(data.subtitleTr) });
    if (data.subtitleEn) subtitles.push({ label: 'İngilizce', src: toProxiedDizisolSubUrl(data.subtitleEn) });

    // Collect all candidate sources and filter out 403 / dead domains
    const candidateList = [];
    const seenUrls = new Set();

    if (isValidDizisolStreamUrl(data.m3u8Url)) {
      seenUrls.add(data.m3u8Url);
      candidateList.push({
        url: data.m3u8Url,
        provider: 'VIP',
        isPrimary: true,
        priority: getDizisolStreamPriority(data.m3u8Url, 'VIP')
      });
    }

    if (Array.isArray(data.sources)) {
      for (const s of data.sources) {
        if (!s || !isValidDizisolStreamUrl(s.m3u8Url) || seenUrls.has(s.m3u8Url)) continue;
        seenUrls.add(s.m3u8Url);
        candidateList.push({
          url: s.m3u8Url,
          provider: (s.provider || 'VIP').toUpperCase(),
          id: s.id,
          subtitleTr: s.subtitleTr,
          subtitleEn: s.subtitleEn,
          isPrimary: false,
          priority: getDizisolStreamPriority(s.m3u8Url, s.provider)
        });
      }
    }

    // Sort by stability/priority (best working *.dizisol.com first)
    candidateList.sort((a, b) => b.priority - a.priority);

    const streams = candidateList.map((item, index) => {
      const proxiedUrl = toProxiedDizisolStreamUrl(item.url);
      const srcSubs = [];
      if (item.subtitleTr) srcSubs.push({ label: 'Türkçe', src: toProxiedDizisolSubUrl(item.subtitleTr) });
      if (item.subtitleEn) srcSubs.push({ label: 'İngilizce', src: toProxiedDizisolSubUrl(item.subtitleEn) });

      return {
        id: `dzs_mov_${targetTmdbId}_${item.id || item.provider || index}`,
        name: index === 0 ? 'Ana Yayın' : `Alternatif Yayın ${index}`,
        displayName: index === 0 ? 'Ana Yayın' : `Alternatif Yayın ${index}`,
        badge: isDub ? '⚡ TR Dublaj' : '💬 TR Altyazı',
        source: 'DS',
        url: proxiedUrl,
        streamUrl: proxiedUrl,
        originalEmbedUrl: item.url,
        quality: '1080p',
        isHls: true,
        isDirectVideo: true,
        type: 'hls',
        subtitles: srcSubs.length > 0 ? srcSubs : subtitles,
        isDub,
        getUrl: () => proxiedUrl
      };
    });

    return streams;
  } catch (err) {
    console.warn('[DizisolScraper] Movie error:', err);
    return [];
  }
}

/**
 * Extracts TV Episode streams from Dizisol
 */
export async function fetchDizisolEpisodeSources({
  titles = [],
  seriesTitle = '',
  originalTitle = '',
  season = 1,
  episode = 1,
  tmdbId = null,
  isDub = true,
  onEvent = null
}) {
  try {
    // Ozel backend resolver (birincil); basarisizsa klasik akisa dus.
    try {
      const params = {
        type: 'tv', title: seriesTitle || titles[0] || '', originalTitle: originalTitle || '',
        season: String(season || 1), episode: String(episode || 1),
        ...(tmdbId ? { tmdbId: String(tmdbId) } : {})
      };
      (titles || []).forEach((t, i) => { if (i < 4 && t) params[`t${i}`] = t; });
      const rdata = await fetchResolveJson(resolveEndpoint('dzs', params), onEvent);
      const mapped = mapResolveData(rdata, {
        isDub, tagPrefix: `dzs_tv_${tmdbId || 'q'}_s${season || 1}_e${episode || 1}`,
        epSuffix: `S${season || 1}B${episode || 1}`
      });
      if (mapped.length > 0) return mapped;
    } catch (_) {}

    let targetTmdbId = tmdbId ? Number(tmdbId) : null;

    if (!targetTmdbId) {
      const candidates = [...new Set([...titles, seriesTitle, originalTitle])].filter(t => t && t.trim().length > 1);
      for (const q of candidates) {
        const results = await searchDizisol(q, onEvent);
        const match = results.find(r => r.type === 'tv');
        if (match && match.tmdbId) {
          targetTmdbId = Number(match.tmdbId);
          break;
        }
      }
    }

    if (!targetTmdbId) return [];

    const episodes = await fetchDizisolJson(`/movies/by-tmdb/${targetTmdbId}/episodes`, { timeout: 4500, onEvent });
    if (!Array.isArray(episodes) || episodes.length === 0) return [];

    const targetEp = episodes.find(e => Number(e.season) === Number(season) && Number(e.episode) === Number(episode));
    if (!targetEp) return [];

    const subtitles = [];
    if (targetEp.subtitleTr) subtitles.push({ label: 'Türkçe', src: toProxiedDizisolSubUrl(targetEp.subtitleTr) });
    if (targetEp.subtitleEn) subtitles.push({ label: 'İngilizce', src: toProxiedDizisolSubUrl(targetEp.subtitleEn) });

    // Collect all candidate sources and filter out 403 / dead domains
    const candidateList = [];
    const seenUrls = new Set();

    if (isValidDizisolStreamUrl(targetEp.m3u8Url)) {
      seenUrls.add(targetEp.m3u8Url);
      candidateList.push({
        url: targetEp.m3u8Url,
        provider: 'VIP',
        isPrimary: true,
        priority: getDizisolStreamPriority(targetEp.m3u8Url, 'VIP')
      });
    }

    if (Array.isArray(targetEp.sources)) {
      for (const s of targetEp.sources) {
        if (!s || !isValidDizisolStreamUrl(s.m3u8Url) || seenUrls.has(s.m3u8Url)) continue;
        seenUrls.add(s.m3u8Url);
        candidateList.push({
          url: s.m3u8Url,
          provider: (s.provider || 'VIP').toUpperCase(),
          id: s.id,
          subtitleTr: s.subtitleTr,
          subtitleEn: s.subtitleEn,
          isPrimary: false,
          priority: getDizisolStreamPriority(s.m3u8Url, s.provider)
        });
      }
    }

    // Sort by priority
    candidateList.sort((a, b) => b.priority - a.priority);

    const streams = candidateList.map((item, index) => {
      const proxiedUrl = toProxiedDizisolStreamUrl(item.url);
      const srcSubs = [];
      if (item.subtitleTr) srcSubs.push({ label: 'Türkçe', src: toProxiedDizisolSubUrl(item.subtitleTr) });
      if (item.subtitleEn) srcSubs.push({ label: 'İngilizce', src: toProxiedDizisolSubUrl(item.subtitleEn) });

      return {
        id: `dzs_tv_${targetTmdbId}_s${season}_e${episode}_${item.id || item.provider || index}`,
        name: index === 0 ? 'Ana Yayın' : `Alternatif Yayın ${index}`,
        displayName: index === 0 ? 'Ana Yayın' : `Alternatif Yayın ${index}`,
        badge: isDub ? '⚡ TR Dublaj' : '💬 TR Altyazı',
        source: 'DS',
        url: proxiedUrl,
        streamUrl: proxiedUrl,
        originalEmbedUrl: item.url,
        quality: '1080p',
        isHls: true,
        isDirectVideo: true,
        type: 'hls',
        subtitles: srcSubs.length > 0 ? srcSubs : subtitles,
        isDub,
        getUrl: () => proxiedUrl
      };
    });

    return streams;
  } catch (err) {
    console.warn('[DizisolScraper] TV episode error:', err);
    return [];
  }
}
