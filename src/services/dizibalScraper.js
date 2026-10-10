/* ==========================================================================
   CinePulse Studio - DiziBal Scraper (PilavyerFlow)
   Yeni akis (eski /apiolu): /ara/oneri aramasi -> dizi/film sayfasi ->
   data-pv -> pilavyerplay s.php (Referer kilitli) -> stream.php master.m3u8.
   Dogrudan CDN yerine cozumlu m3u8 dondurulur; bolum suresi gecerli
   imzali oynatma baglantisidir.
   ========================================================================== */

import { isStrictMediaTitleMatch } from './mediaMatcher.js';
import { apiUrl } from './apiOrigin.js';

const DZB_BASE = 'https://dizibal.org';
const PV_BASE = 'https://pilavyerplay.top';
const BROWSER_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

function isNative() {
  try {
    return Boolean(window.Capacitor?.isNativePlatform?.());
  } catch (_) {
    return false;
  }
}

function isLocalDev() {
  try {
    if (typeof window === 'undefined' || isNative()) return false;
    const host = window.location?.hostname || '';
    return host === 'localhost' || host === '127.0.0.1';
  } catch (_) {
    return false;
  }
}

/** Dogrudan dene, olmazsa genel proxy (/api/proxy) uzerinden (ref korunur). */
async function dzbFetchText(url, { referer = '', timeout = 7000 } = {}) {
  const headers = { 'User-Agent': BROWSER_UA, Accept: 'text/html,application/json,*/*;q=0.8' };
  if (referer) headers.Referer = referer;
  try {
    const res = await fetch(url, { headers, signal: AbortSignal.timeout(timeout) });
    if (res && res.ok) {
      const text = await res.text().catch(() => '');
      if (text && text.length > 200) return text;
    }
    throw new Error('direct failed');
  } catch (_) {
    if (typeof window === 'undefined') return '';
    try {
      const proxyUrl = apiUrl(`/api/proxy?url=${encodeURIComponent(url)}${referer ? `&ref=${encodeURIComponent(referer)}` : ''}`);
      const res = await fetch(isLocalDev() ? `/api/proxy?url=${encodeURIComponent(url)}${referer ? `&ref=${encodeURIComponent(referer)}` : ''}` : proxyUrl, {
        headers: { Accept: 'text/html,application/json,*/*;q=0.8' },
        signal: AbortSignal.timeout(timeout)
      }).catch(() => null);
      if (res && res.ok) {
        const text = await res.text().catch(() => '');
        if (text && text.length > 200) return text;
      }
    } catch (_) {}
    return '';
  }
}

function cleanQuery(q) {
  return String(q || '').replace(/\s*\(\d{4}\).*/, '').trim();
}

export async function searchDizibal(query, kind = '') {
  const q = cleanQuery(query);
  if (q.length < 2) return [];
  const text = await dzbFetchText(`${DZB_BASE}/ara/oneri?q=${encodeURIComponent(q)}`, {
    referer: `${DZB_BASE}/`, timeout: 6500
  });
  if (!text) return [];
  try {
    const data = JSON.parse(text);
    const pool = [...(data.movies || []), ...(data.series || [])];
    return pool
      .filter((it) => it && it.title && it.url)
      .filter((it) => !kind || (kind === 'series' ? it.type === 'series' : it.type === 'movie'))
      .map((it) => ({ title: it.title, url: it.url.startsWith('http') ? it.url : `${DZB_BASE}${it.url}`, type: it.type || kind || '' }));
  } catch (_) {
    return [];
  }
}

export async function searchDizibalSeries(query) {
  return searchDizibal(query, 'series');
}

export async function searchDizibalMovies(query) {
  return searchDizibal(query, 'movie');
}

function findEpisodeLink(seriesHtml, slugPart, season, episode) {
  try {
    const re = new RegExp(`/series/${slugPart}/season/${season}/episode/${episode}(?=["'\\s])`, 'i');
    const m = seriesHtml.match(re);
    if (m) return `${DZB_BASE}${m[0]}`;
    // gevsek: ayni sezon/bolum numarasi tasiyan ilk baglanti
    const all = [...seriesHtml.matchAll(/\/series\/[a-z0-9-]+\/season\/(\d+)\/episode\/(\d+)/gi)];
    const hit = all.find((x) => Number(x[1]) === Number(season) && Number(x[2]) === Number(episode));
    if (hit) return `${DZB_BASE}${hit[0]}`;
  } catch (_) {}
  return '';
}

function findPvSlug(pageHtml) {
  try {
    const m = pageHtml.match(/data-pv="([^"]+)"/i);
    return m ? m[1] : '';
  } catch (_) {
    return '';
  }
}

function parsePlayerPage(playerHtml) {
  const out = { streamUrl: '', subtitles: [] };
  try {
    const m = playerHtml.match(/["']stream["']\s*:\s*["']([^"']+)["']/i);
    if (m) out.streamUrl = m[1].replace(/\\u0026/g, '&').replace(/\\\//g, '/');
    const subRe = /\{[^{}]*"src"\s*:\s*"(https?:[^"]+)"[^{}]*\}/gi;
    let sm;
    while ((sm = subRe.exec(playerHtml))) {
      const chunk = sm[0];
      if (!/sub\.php/i.test(chunk)) continue;
      const lang = (/["']lang["']\s*:\s*["']([^"']+)["']/i.exec(chunk) || [])[1] || '';
      const label = (/["']label["']\s*:\s*["']([^"']+)["']/i.exec(chunk) || [])[1] || lang || 'Altyazı';
      const src = (/["']src["']\s*:\s*["']([^"']+)["']/i.exec(chunk) || [])[1] || '';
      if (src && !out.subtitles.some((s) => s.src === src)) {
        out.subtitles.push({ label, lang, src: src.replace(/\\u0026/g, '&').replace(/\\\//g, '/') });
      }
    }
  } catch (_) {}
  return out;
}

function findPvHost(pageHtml) {
  try {
    const m = pageHtml.match(/https:\/\/[a-z0-9.-]*pilavyerplay\.top/i);
    if (m) return m[0].replace(/\/$/, '');
  } catch (_) {}
  return PV_BASE;
}

async function resolvePvStream(pvSlug, referer, pageHtml = '') {
  if (!pvSlug) return { streamUrl: '', subtitles: [] };
  const host = findPvHost(pageHtml);
  const playerUrl = `${host}/assets/js/s.php?s=${encodeURIComponent(pvSlug)}`;
  const playerHtml = await dzbFetchText(playerUrl, { referer: referer || `${DZB_BASE}/`, timeout: 8000 });
  if (!playerHtml) return { streamUrl: '', subtitles: [], embedUrl: playerUrl };
  const parsed = parsePlayerPage(playerHtml);
  return { ...parsed, embedUrl: playerUrl };
}

function toProxiedHls(rawStreamUrl) {
  if (!rawStreamUrl) return '';
  if (typeof window !== 'undefined' && !isNative()) {
    const host = window.location?.hostname || '';
    if (host !== 'localhost' && host !== '127.0.0.1') return apiUrl(`/api/hls_proxy?url=${encodeURIComponent(rawStreamUrl)}&ref=${encodeURIComponent(`${PV_BASE}/`)}`);
  }
  if (typeof window === 'undefined' || isLocalDev() || isNative()) {
    if (isNative()) return apiUrl(`/api/hls_proxy?url=${encodeURIComponent(rawStreamUrl)}&ref=${encodeURIComponent(`${PV_BASE}/`)}`);
    return `/api/hls_proxy?url=${encodeURIComponent(rawStreamUrl)}&ref=${encodeURIComponent(`${PV_BASE}/`)}`;
  }
  return rawStreamUrl;
}

function matchTitle(itemTitle, candidates) {
  try {
    return isStrictMediaTitleMatch(itemTitle || '', candidates);
  } catch (_) {
    return false;
  }
}

export async function fetchDizibalEpisodeSources({ titles = [], seriesTitle, originalTitle, season, episode, isDub = false }) {
  const sNum = parseInt(season, 10) || 1;
  const epNum = parseInt(episode, 10) || 1;
  const queries = [...new Set([...(titles || []), seriesTitle, originalTitle].filter((t) => t && String(t).trim().length > 1))];
  if (queries.length === 0) return [];

  for (const q of queries.slice(0, 3)) {
    const results = await searchDizibalSeries(q);
    const hit = results.find((r) => matchTitle(r.title, queries));
    if (!hit) continue;
    try {
      const seriesHtml = await dzbFetchText(`${hit.url}?sezon=${sNum}`, { referer: `${DZB_BASE}/`, timeout: 7000 });
      if (!seriesHtml) continue;
      const slugPart = hit.url.split('/series/')[1]?.split('?')[0] || '';
      const epUrl = findEpisodeLink(seriesHtml, slugPart.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), sNum, epNum);
      if (!epUrl) continue;
      const epHtml = await dzbFetchText(epUrl, { referer: hit.url, timeout: 7000 });
      if (!epHtml) continue;
      const pv = findPvSlug(epHtml);
      if (!pv) continue;
      const { streamUrl, subtitles, embedUrl } = await resolvePvStream(pv, epUrl, epHtml);
      if (!streamUrl && !embedUrl) continue;
      const proxied = streamUrl && /\.m3u8/i.test(streamUrl) ? toProxiedHls(streamUrl) : '';
      const finalUrl = proxied || streamUrl || embedUrl;
      const isHls = /\.m3u8/i.test(finalUrl);
      return [{
        id: `dzb_tv_s${sNum}e${epNum}_${pv.slice(0, 8)}`,
        name: isDub ? `DP S${sNum}B${epNum} (TR Dublaj)` : `DP S${sNum}B${epNum} (TR Altyazı)`,
        displayName: `DP S${sNum}B${epNum}`,
        source: 'Dizibal',
        url: finalUrl,
        streamUrl: finalUrl,
        originalEmbedUrl: embedUrl,
        quality: '1080p',
        isHls,
        isDirectVideo: isHls,
        isIframe: !isHls,
        type: isHls ? 'hls' : 'embed',
        subtitles,
        getUrl: () => finalUrl
      }];
    } catch (_) {}
  }
  return [];
}

export async function fetchDizibalMovieSources({ titles = [], title, originalTitle, isDub = false }) {
  const queries = [...new Set([...(titles || []), title, originalTitle].filter((t) => t && String(t).trim().length > 1))];
  if (queries.length === 0) return [];

  for (const q of queries.slice(0, 3)) {
    const results = await searchDizibalMovies(q);
    const hit = results.find((r) => matchTitle(r.title, queries));
    if (!hit) continue;
    try {
      const pageHtml = await dzbFetchText(hit.url, { referer: `${DZB_BASE}/`, timeout: 7000 });
      if (!pageHtml) continue;
      const pv = findPvSlug(pageHtml);
      if (!pv) continue;
      const { streamUrl, subtitles, embedUrl } = await resolvePvStream(pv, hit.url, pageHtml);
      if (!streamUrl && !embedUrl) continue;
      const proxied = streamUrl && /\.m3u8/i.test(streamUrl) ? toProxiedHls(streamUrl) : '';
      const finalUrl = proxied || streamUrl || embedUrl;
      const isHls = /\.m3u8/i.test(finalUrl);
      return [{
        id: `dzb_mov_${pv.slice(0, 8)}`,
        name: isDub ? 'DP Film (TR Dublaj)' : 'DP Film (TR Altyazı)',
        displayName: 'DP Film',
        source: 'Dizibal',
        url: finalUrl,
        streamUrl: finalUrl,
        originalEmbedUrl: embedUrl,
        quality: '1080p',
        isHls,
        isDirectVideo: isHls,
        isIframe: !isHls,
        type: isHls ? 'hls' : 'embed',
        subtitles,
        getUrl: () => finalUrl
      }];
    } catch (_) {}
  }
  return [];
}
