/* ==========================================================================
   CinePulse Studio - Kids VIP Dedicated Scraper (Cartoons & Animations)
   Fetches 1080p Turkish Dubbed & Subtitled cartoon & animation streams:
   - Ultra-High-Speed Direct 1080p MP4 Streams (Zero Ads, FastCDN)
   - Native TR Dublaj & Altyazı for top cartoon franchises
   ========================================================================== */

import { isStrictMediaTitleMatch } from './mediaMatcher.js';

const CF_WORKER_PROXY = 'https://wild-credit-e1ae.cagatayca07.workers.dev';

function decodeBase64(str) {
  if (!str) return '';
  try {
    if (typeof Buffer !== 'undefined') {
      return Buffer.from(str, 'base64').toString('utf-8');
    }
    if (typeof atob !== 'undefined') {
      const binary = atob(str);
      try {
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          bytes[i] = binary.charCodeAt(i);
        }
        return new TextDecoder('utf-8').decode(bytes);
      } catch (_) {
        return binary;
      }
    }
    return '';
  } catch (_) {
    return '';
  }
}

// Obfuscated host references to prevent external tracking/scraping recognition
const _0xkv = decodeBase64('Y2l6Z2ltYXgub25saW5l');
const KV_BASE = `https://${_0xkv}`;
const KV_PROXY_PREFIX = '/api/kvip';

function normalizeTitle(t) {
  if (!t) return '';
  return t
    .toLowerCase()
    .trim()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^\w\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

async function fetchWithProxy(targetUrl, options = {}) {
  const isBrowser = typeof window !== 'undefined';

  // 1. Try local Vite proxy or [...all].js (browser only)
  if (isBrowser && targetUrl.includes(_0xkv)) {
    const u = new URL(targetUrl);
    const proxyUrl = `${KV_PROXY_PREFIX}${u.pathname}${u.search}`;
    try {
      const res = await fetch(proxyUrl, {
        ...options,
        signal: AbortSignal.timeout(options.timeout || 8000)
      }).catch(() => null);
      if (res && res.ok) return res;
    } catch (_) {}
  }

  // 2. Try generic local /api/proxy (browser only)
  if (isBrowser) {
    const localProxy = `/api/proxy?url=${encodeURIComponent(targetUrl)}`;
    try {
      const res = await fetch(localProxy, {
        ...options,
        signal: AbortSignal.timeout(options.timeout || 8000)
      }).catch(() => null);
      if (res && res.ok) return res;
    } catch (_) {}
  }

  // 3. Direct fetch (works in Node.js or CORS-friendly endpoints)
  try {
    const res = await fetch(targetUrl, {
      ...options,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        ...(targetUrl.includes(_0xkv) ? { 'Referer': `${KV_BASE}/` } : {}),
        ...(options.headers || {})
      },
      signal: AbortSignal.timeout(options.timeout || 8000)
    }).catch(() => null);
    if (res && res.ok) return res;
  } catch (_) {}

  // 4. Cloudflare worker proxy fallback
  try {
    const workerUrl = `${CF_WORKER_PROXY}?url=${encodeURIComponent(targetUrl)}`;
    const res = await fetch(workerUrl, {
      ...options,
      signal: AbortSignal.timeout(options.timeout || 8000)
    }).catch(() => null);
    if (res && res.ok) return res;
  } catch (_) {}

  return null;
}

/**
 * Searches upstream catalog for matching cartoon or animation series
 */
async function searchUpstreamCatalog(candidateQueries) {
  const seenIds = new Set();
  const matched = [];

  for (const q of candidateQueries) {
    if (!q || q.length < 2) continue;
    try {
      const searchUrl = `${KV_BASE}/api/search/suggest/?q=${encodeURIComponent(q.trim())}`;
      const res = await fetchWithProxy(searchUrl, {
        headers: { 'Accept': 'application/json' },
        timeout: 6000
      });
      if (!res) continue;

      const data = await res.json().catch(() => null);
      if (!data || !Array.isArray(data.animes)) continue;

      for (const item of data.animes) {
        if (!item || !item.url || seenIds.has(item.id)) continue;
        const itemTitle = item.title || item.name || item.anime_name || item.slug || '';
        if (!isStrictMediaTitleMatch(itemTitle, candidateQueries)) continue;
        seenIds.add(item.id);
        matched.push(item);
      }

      if (matched.length >= 4) break;
    } catch (_) {}
  }

  return matched;
}

/**
 * Resolves high-speed direct MP4 stream
 */
async function resolveDirectMp4(videoId) {
  if (!videoId) return null;
  try {
    const shellUrl = `https://video.sibnet.ru/shell.php?videoid=${encodeURIComponent(videoId)}`;
    const res = await fetchWithProxy(shellUrl, {
      headers: { 'Referer': 'https://video.sibnet.ru/' },
      timeout: 4000
    });
    if (!res) return null;

    const html = await res.text();
    const match = html.match(/\/v\/[a-zA-Z0-9_\/]+\.mp4/);
    if (match) {
      return `https://video.sibnet.ru${match[0]}`;
    }
  } catch (_) {}
  return null;
}

/**
 * Main episode scraper for Kids VIP Cartoon sources
 */
export async function fetchKidsVipSources({
  titles = [],
  seriesTitle = '',
  title = '',
  originalTitle = '',
  season = 1,
  episode = 1,
  isDub = true
}) {
  const candidateQueries = [...new Set([
    seriesTitle,
    title,
    originalTitle,
    ...titles
  ])].filter(t => t && typeof t === 'string' && t.trim().length > 1);

  if (candidateQueries.length === 0) return [];

  const matchedShows = await searchUpstreamCatalog(candidateQueries);
  if (matchedShows.length === 0) return [];

  const sources = [];
  const seenStreams = new Set();

  for (const show of matchedShows.slice(0, 3)) {
    try {
      const showPageUrl = show.url.startsWith('http') ? show.url : `${KV_BASE}${show.url}`;
      const pageRes = await fetchWithProxy(showPageUrl, { timeout: 8000 });
      if (!pageRes) continue;

      const seriesHtml = await pageRes.text();

      // Look for episode link matching season & episode
      let epMatch = seriesHtml.match(new RegExp(`href="([^"]*?${season}-sezon-${episode}-bolum-izle\/)"`, 'i'));
      let epPath = epMatch ? epMatch[1] : null;

      // Fallback for season 1 where "-1-sezon-" might be omitted
      if (!epPath && Number(season) === 1) {
        const epFallback = seriesHtml.match(new RegExp(`href="([^"]*?${episode}-bolum-izle\/)"`, 'i'));
        if (epFallback) epPath = epFallback[1];
      }

      if (!epPath) continue;

      const fullEpUrl = epPath.startsWith('http') ? epPath : `${KV_BASE}${epPath}`;
      const epRes = await fetchWithProxy(fullEpUrl, { timeout: 8000 });
      if (!epRes) continue;

      const epHtml = await epRes.text();
      const serversMatch = epHtml.match(/servers\s*=\s*JSON\.parse\(atob\(["']([^"']+)["']\)\)/);
      if (!serversMatch) continue;

      let servers = [];
      try {
        servers = JSON.parse(decodeBase64(serversMatch[1]));
      } catch (_) {
        continue;
      }

      if (!Array.isArray(servers) || servers.length === 0) continue;

      for (const s of servers) {
        const serverLabel = s.label || s.type || 'VIP';
        const serverLang = (s.lang || '').toLowerCase();
        const isServerDub = serverLang === 'dub' || serverLabel.toLowerCase().includes('dublaj');
        const isServerSub = serverLang === 'sub' || serverLabel.toLowerCase().includes('altyaz');

        // Check language filter
        if (isDub && isServerSub && !isServerDub) continue;
        if (!isDub && isServerDub && !isServerSub) continue;

        // 1. Direct high-speed MP4 stream
        if (s.type === 'sibnet' && s.videoId) {
          const directMp4 = await resolveDirectMp4(s.videoId);
          if (directMp4 && !seenStreams.has(directMp4)) {
            seenStreams.add(directMp4);
            sources.push({
              id: `kvip_sib_${s.videoId}_${isDub ? 'dub' : 'sub'}`,
              name: `Kids VIP - 1080p (${isDub ? 'TR Dublaj' : 'Altyazılı'})`,
              displayName: `Kids VIP (${isDub ? 'TR Dublaj' : 'Altyazılı'})`,
              badge: '⚡ Kids VIP',
              category: isDub ? 'dubbed' : 'subtitled',
              streamUrl: directMp4,
              url: directMp4,
              isDirectVideo: true,
              type: 'mp4',
              quality: '1080p',
              getUrl: () => directMp4
            });
            continue;
          }
        }

        // 2. Generic stream fallback
        if (s.streamUrl && !seenStreams.has(s.streamUrl)) {
          seenStreams.add(s.streamUrl);
          const rawStreamUrl = s.streamUrl.startsWith('http')
            ? s.streamUrl
            : `${KV_BASE}${s.streamUrl}`;
          const fullStreamUrl = (typeof window !== 'undefined' && rawStreamUrl.includes(_0xkv))
            ? rawStreamUrl.replace(KV_BASE, KV_PROXY_PREFIX)
            : rawStreamUrl;

          sources.push({
            id: `kvip_stream_${s.embedId || Math.random()}_${isDub ? 'dub' : 'sub'}`,
            name: `Kids VIP - HD (${isDub ? 'TR Dublaj' : 'Altyazılı'})`,
            displayName: `Kids VIP (${isDub ? 'TR Dublaj' : 'Altyazılı'})`,
            badge: '⚡ Kids VIP',
            category: isDub ? 'dubbed' : 'subtitled',
            streamUrl: fullStreamUrl,
            url: fullStreamUrl,
            type: 'hls',
            getUrl: () => fullStreamUrl
          });
        }
      }

      if (sources.length > 0) break;
    } catch (_) {}
  }

  return sources;
}

/**
 * Movie scraper for Kids VIP animation & cartoon films
 */
export async function fetchKidsVipMovieSources({
  titles = [],
  title = '',
  originalTitle = '',
  isDub = true
}) {
  const candidateQueries = [...new Set([
    title,
    originalTitle,
    ...titles
  ])].filter(t => t && typeof t === 'string' && t.trim().length > 1);

  if (candidateQueries.length === 0) return [];

  const matchedShows = await searchUpstreamCatalog(candidateQueries);
  if (matchedShows.length === 0) return [];

  const sources = [];
  const seenStreams = new Set();

  for (const show of matchedShows.slice(0, 3)) {
    try {
      const showPageUrl = show.url.startsWith('http') ? show.url : `${KV_BASE}${show.url}`;
      const pageRes = await fetchWithProxy(showPageUrl, { timeout: 8000 });
      if (!pageRes) continue;

      const epHtml = await pageRes.text();
      const serversMatch = epHtml.match(/servers\s*=\s*JSON\.parse\(atob\(["']([^"']+)["']\)\)/);
      if (!serversMatch) continue;

      let servers = [];
      try {
        servers = JSON.parse(decodeBase64(serversMatch[1]));
      } catch (_) {
        continue;
      }

      for (const s of servers) {
        const serverLabel = s.label || s.type || 'VIP';
        const isServerDub = (s.lang === 'dub') || serverLabel.toLowerCase().includes('dublaj');
        const isServerSub = (s.lang === 'sub') || serverLabel.toLowerCase().includes('altyaz');

        if (isDub && isServerSub && !isServerDub) continue;
        if (!isDub && isServerDub && !isServerSub) continue;

        if (s.type === 'sibnet' && s.videoId) {
          const directMp4 = await resolveDirectMp4(s.videoId);
          if (directMp4 && !seenStreams.has(directMp4)) {
            seenStreams.add(directMp4);
            sources.push({
              id: `kvip_movie_${s.videoId}_${isDub ? 'dub' : 'sub'}`,
              name: `Kids VIP - 1080p (${isDub ? 'TR Dublaj' : 'Altyazılı'})`,
              displayName: `Kids VIP (${isDub ? 'TR Dublaj' : 'Altyazılı'})`,
              badge: '⚡ Kids VIP',
              category: isDub ? 'dubbed' : 'subtitled',
              streamUrl: directMp4,
              url: directMp4,
              isDirectVideo: true,
              type: 'mp4',
              quality: '1080p',
              getUrl: () => directMp4
            });
          }
        }
      }

      if (sources.length > 0) break;
    } catch (_) {}
  }

  return sources;
}
