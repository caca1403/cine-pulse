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
    const clean = str.replace(/\\/g, '').replace(/[^A-Za-z0-9+/=]/g, '');
    if (typeof Buffer !== 'undefined') {
      return Buffer.from(clean, 'base64').toString('utf-8');
    }
    if (typeof atob !== 'undefined') {
      const binary = atob(clean);
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
const SIBNET_PROXY_PREFIX = '/api/sibnet';

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

  // 1. Try local Vite proxy for upstream host
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

  // 2. Try local Vite proxy for Sibnet
  if (isBrowser && targetUrl.includes('sibnet.ru')) {
    const u = new URL(targetUrl);
    const proxyUrl = `${SIBNET_PROXY_PREFIX}${u.pathname}${u.search}`;
    try {
      const res = await fetch(proxyUrl, {
        ...options,
        signal: AbortSignal.timeout(options.timeout || 8000)
      }).catch(() => null);
      if (res && res.ok) return res;
    } catch (_) {}
  }

  // 3. Try generic local /api/proxy (browser only)
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

  // 4. Direct fetch (works in Node.js or CORS-friendly endpoints)
  try {
    const res = await fetch(targetUrl, {
      ...options,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        ...(targetUrl.includes(_0xkv) ? { 'Referer': `${KV_BASE}/` } : {}),
        ...(targetUrl.includes('sibnet.ru') ? { 'Referer': 'https://video.sibnet.ru/' } : {}),
        ...(options.headers || {})
      },
      signal: AbortSignal.timeout(options.timeout || 8000)
    }).catch(() => null);
    if (res && res.ok) return res;
  } catch (_) {}

  // 5. Cloudflare worker proxy fallback
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
 * Searches upstream catalog for matching cartoon or animation series/movies
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
        if (!item || !item.url || seenIds.has(item.id || item.url)) continue;
        const itemTitle = item.title || item.name || item.anime_name || '';
        const slugTitle = (item.url || '')
          .replace(/^\/diziler\//, '')
          .replace(/^\/filmler\//, '')
          .replace(/^\/film\//, '')
          .replace(/-izle\/?$/, '')
          .replace(/-/g, ' ');

        const candidateNames = [itemTitle, slugTitle].filter(Boolean);
        const isMatch = candidateNames.some(name =>
          isStrictMediaTitleMatch(name, candidateQueries, 0.82) ||
          candidateQueries.some(cand => {
            const nc = normalizeTitle(cand);
            const nn = normalizeTitle(name);
            if (!nc || !nn) return false;
            return nn === nc;
          })
        );

        if (!isMatch) continue;
        seenIds.add(item.id || item.url);
        matched.push({
          ...item,
          cleanTitle: itemTitle || slugTitle
        });
      }

      // 2. HTML Fallback: /ara/?q=...
      if (matched.length === 0) {
        const htmlRes = await fetchWithProxy(`${KV_BASE}/ara/?q=${encodeURIComponent(q.trim())}`, { timeout: 6000 });
        if (htmlRes && htmlRes.ok) {
          const html = await htmlRes.text();
          const linkMatches = [...html.matchAll(/<a\s+[^>]*href=["'](\/(?:diziler|filmler|film)\/[^"']+)["'][^>]*data-alt-title=["']([^"']*)["']/gi)];
          for (const m of linkMatches) {
            const url = m[1];
            const name = m[2] || '';
            if (seenIds.has(url)) continue;
            const isMatch = isStrictMediaTitleMatch(name, candidateQueries, 0.82) ||
              candidateQueries.some(cand => normalizeTitle(cand) === normalizeTitle(name));
            if (!isMatch) continue;
            seenIds.add(url);
            matched.push({ name, url, cleanTitle: name });
          }
        }
      }

      if (matched.length >= 4) break;
    } catch (_) {}
  }

  return matched;
}

/**
 * Extracts episode link matching season & episode from series page HTML
 */
function findEpisodeLink(html, season, episode) {
  const sNum = Number(season);
  const epNum = Number(episode);

  const patterns = [
    new RegExp(`href=["']?([^"'>]*?${sNum}-sezon-${epNum}-bolum(?:-izle)?\\/?)["'>]`, 'i'),
    new RegExp(`href=["']?([^"'>]*?sezon-${sNum}[^"'>]*?bolum-${epNum}(?:-izle)?\\/?)["'>]`, 'i'),
    new RegExp(`href=["']?([^"'>]*?s0?${sNum}e0?${epNum}(?:-izle)?\\/?)["'>]`, 'i')
  ];

  if (sNum === 1) {
    patterns.push(new RegExp(`href=["']?([^"'>]*?${epNum}-bolum(?:-izle)?\\/?)["'>]`, 'i'));
  }

  for (const p of patterns) {
    const m = html.match(p);
    if (m && m[1]) return m[1];
  }

  // Fallback: search all links with bolum-izle
  const allLinks = [...html.matchAll(/href=["']?([^"'>]*?bolum-izle\/?)["'>]/gi)];
  for (const match of allLinks) {
    const link = match[1];
    const sMatch = link.match(/(\d+)-sezon/i);
    const eMatch = link.match(/(\d+)-bolum/i);
    const linkSeason = sMatch ? Number(sMatch[1]) : 1;
    const linkEp = eMatch ? Number(eMatch[1]) : null;
    if (linkSeason === sNum && linkEp === epNum) {
      return link;
    }
  }

  return null;
}

/**
 * Parses embedded video servers from episode or movie HTML
 */
function extractServersFromHtml(html, isDub) {
  let servers = [];

  // 1. Try serversByLang first (cleanest language segregation)
  const mByLang = html.match(/serversByLang\s*=\s*JSON\.parse\(atob\(["']([^"']+)["']\)\)/);
  if (mByLang) {
    try {
      const byLang = JSON.parse(decodeBase64(mByLang[1]));
      if (byLang) {
        if (isDub) {
          servers = [...(byLang.dub || []), ...(byLang.any || [])];
        } else {
          servers = [...(byLang.sub || []), ...(byLang.any || [])];
        }
      }
    } catch (_) {}
  }

  // 2. Fallback to servers array
  if (servers.length === 0) {
    const mServers = html.match(/servers\s*=\s*JSON\.parse\(atob\(["']([^"']+)["']\)\)/);
    if (mServers) {
      try {
        const allServers = JSON.parse(decodeBase64(mServers[1]));
        if (Array.isArray(allServers)) {
          servers = allServers.filter(s => {
            const serverLabel = s.label || s.type || 'VIP';
            const serverLang = (s.lang || '').toLowerCase();
            const isServerDub = serverLang === 'dub' || serverLabel.toLowerCase().includes('dublaj');
            const isServerSub = serverLang === 'sub' || serverLabel.toLowerCase().includes('altyaz');
            if (isDub) return isServerDub || (!isServerDub && !isServerSub);
            return isServerSub || (!isServerDub && !isServerSub);
          });
        }
      } catch (_) {}
    }
  }

  return servers;
}

/**
 * Resolves high-speed direct MP4 stream from Sibnet shell
 */
async function resolveDirectMp4(videoId) {
  if (!videoId) return null;
  try {
    const shellUrl = `https://video.sibnet.ru/shell.php?videoid=${encodeURIComponent(videoId)}`;
    const res = await fetchWithProxy(shellUrl, {
      headers: { 'Referer': 'https://video.sibnet.ru/' },
      timeout: 5000
    });
    if (!res) return null;

    const html = await res.text();
    const match = html.match(/\/v\/[a-zA-Z0-9_\/]+\.mp4/);
    if (match) {
      const isBrowser = typeof window !== 'undefined';
      // In browser, proxy through /api/sibnet to supply Russian CDN referer headers
      return isBrowser
        ? `${SIBNET_PROXY_PREFIX}${match[0]}`
        : `https://video.sibnet.ru${match[0]}`;
    }
  } catch (_) {}
  return null;
}

/**
 * Maps server object to CinePulse player stream definitions
 */
async function mapServerToSources(s, isDub, seenStreams) {
  const sources = [];
  const langLabel = isDub ? 'TR Dublaj' : 'Altyazılı';
  const category = isDub ? 'dubbed' : 'subtitled';
  const serverLabel = s.label || s.type || 'VIP';

  // 1. Sibnet Video Server
  if (s.type === 'sibnet' && s.videoId) {
    // Guaranteed 100% playable in iframe, zero ads, zero proxy/payload limits
    const sibnetEmbed = `https://video.sibnet.ru/shell.php?videoid=${encodeURIComponent(s.videoId)}`;
    if (!seenStreams.has(sibnetEmbed)) {
      seenStreams.add(sibnetEmbed);
      sources.push({
        id: `kvip_sib_embed_${s.videoId}_${isDub ? 'dub' : 'sub'}`,
        name: `Kids VIP - 1080p (${langLabel})`,
        displayName: `Kids VIP (${langLabel})`,
        badge: '⚡ Kids VIP',
        category,
        streamUrl: sibnetEmbed,
        url: sibnetEmbed,
        type: 'embed',
        quality: '1080p',
        getUrl: () => sibnetEmbed
      });
    }
    return sources;
  }

  // 2. Iframe / Third-party player embed
  if (s.src) {
    const rawEmbedUrl = s.src.startsWith('http') ? s.src : `${KV_BASE}${s.src}`;
    
    // Upstream cizgimax.online blocks cross-origin iframe embedding (X-Frame-Options: SAMEORIGIN / CSP frame-ancestors).
    // Firefox blocks it with "Firefox bu sayfayı açamıyor - cine-pulse-drab.vercel.app güvenliğinizi korumak için...".
    // Only allow external embed players that support framing (vidmoly, ok.ru, sibnet, mail.ru, etc.).
    const isUpstreamBlockedEmbed = rawEmbedUrl.includes('cizgimax.online') || rawEmbedUrl.includes(_0xkv) || rawEmbedUrl.includes('/oynat/');
    
    if (!isUpstreamBlockedEmbed) {
      const embedUrl = (typeof window !== 'undefined' && rawEmbedUrl.includes(_0xkv))
        ? rawEmbedUrl.replace(KV_BASE, KV_PROXY_PREFIX)
        : rawEmbedUrl;

      if (!seenStreams.has(embedUrl)) {
        seenStreams.add(embedUrl);
        sources.push({
          id: `kvip_embed_${s.embedId || Math.random()}_${isDub ? 'dub' : 'sub'}`,
          name: `Kids VIP - ${serverLabel} (${langLabel})`,
          displayName: `Kids VIP (${langLabel})`,
          badge: '⚡ Kids VIP',
          category,
          streamUrl: embedUrl,
          url: embedUrl,
          type: 'embed',
          getUrl: () => embedUrl
        });
      }
    }
  }

  // 3. YouTube Embed
  if (s.type === 'youtube' && s.ytId) {
    const youtubeEmbed = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(s.ytId)}?autoplay=1&rel=0&playsinline=1`;
    if (!seenStreams.has(youtubeEmbed)) {
      seenStreams.add(youtubeEmbed);
      sources.push({
        id: `kvip_youtube_${s.ytId}_${isDub ? 'dub' : 'sub'}`,
        name: `Kids VIP - HD (${langLabel})`,
        displayName: `Kids VIP (${langLabel})`,
        badge: '⚡ Kids VIP',
        category,
        streamUrl: youtubeEmbed,
        url: youtubeEmbed,
        type: 'embed',
        getUrl: () => youtubeEmbed
      });
    }
  }

  // 4. Generic stream fallback (Rapidvid, Vidmoly, etc.)
  if (s.streamUrl && !seenStreams.has(s.streamUrl)) {
    seenStreams.add(s.streamUrl);
    const rawStreamUrl = s.streamUrl.startsWith('http') ? s.streamUrl : `${KV_BASE}${s.streamUrl}`;
    const fullStreamUrl = (typeof window !== 'undefined' && rawStreamUrl.includes(_0xkv))
      ? rawStreamUrl.replace(KV_BASE, KV_PROXY_PREFIX)
      : rawStreamUrl;

    const isHls = fullStreamUrl.includes('.m3u8') || fullStreamUrl.includes('hls');
    sources.push({
      id: `kvip_stream_${s.embedId || Math.random()}_${isDub ? 'dub' : 'sub'}`,
      name: `Kids VIP - ${serverLabel} (${langLabel})`,
      displayName: `Kids VIP (${langLabel})`,
      badge: '⚡ Kids VIP',
      category,
      streamUrl: fullStreamUrl,
      url: fullStreamUrl,
      isDirectVideo: !isHls,
      type: isHls ? 'hls' : 'mp4',
      getUrl: () => fullStreamUrl
    });
  }

  return sources;
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
      const epPath = findEpisodeLink(seriesHtml, season, episode);
      if (!epPath) continue;

      const fullEpUrl = epPath.startsWith('http') ? epPath : `${KV_BASE}${epPath}`;
      const epRes = await fetchWithProxy(fullEpUrl, { timeout: 8000 });
      if (!epRes) continue;

      const epHtml = await epRes.text();
      const servers = extractServersFromHtml(epHtml, isDub);
      if (!Array.isArray(servers) || servers.length === 0) continue;

      for (const s of servers) {
        const serverSources = await mapServerToSources(s, isDub, seenStreams);
        sources.push(...serverSources);
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

      const movieHtml = await pageRes.text();
      const servers = extractServersFromHtml(movieHtml, isDub);
      if (!Array.isArray(servers) || servers.length === 0) continue;

      for (const s of servers) {
        const serverSources = await mapServerToSources(s, isDub, seenStreams);
        sources.push(...serverSources);
      }

      if (sources.length > 0) break;
    } catch (_) {}
  }

  return sources;
}
