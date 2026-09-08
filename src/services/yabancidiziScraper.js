/* ==========================================================================
   CinePulse Studio - YabancıDizi Scraper (Movies & TV Series Engine)
   Extracts VidMoly 1080p & Sibnet streams from yabancidizi.news
   Supports AJAX search and episode source extraction.
   ========================================================================== */

const CF_WORKER_PROXY = 'https://wild-credit-e1ae.cagatayca07.workers.dev';
const YBD_BASE = 'https://yabancidizi.news';

async function fetchYbd(targetUrl, options = {}) {
  const isBrowser = typeof window !== 'undefined';
  const customHeaders = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,application/json,*/*;q=0.8',
    'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
    'Referer': 'https://yabancidizi.news/',
    ...(options.headers || {})
  };

  // 1. Vercel / Local rewrite proxy (/api/ybd/...)
  if (isBrowser) {
    try {
      const cleanPath = targetUrl.replace(/^https?:\/\/yabancidizi\.news/, '');
      const localProxyUrl = `/api/ybd${cleanPath.startsWith('/') ? cleanPath : '/' + cleanPath}`;
      const res = await fetch(localProxyUrl, {
        ...options,
        headers: customHeaders,
        signal: AbortSignal.timeout(options.timeout || 4000)
      }).catch(() => null);
      if (res && res.ok) return res;
    } catch (_) {}

    // Universal proxy fallback
    try {
      const uProxy = `/api/proxy?url=${encodeURIComponent(targetUrl)}`;
      const res = await fetch(uProxy, {
        ...options,
        headers: customHeaders,
        signal: AbortSignal.timeout(options.timeout || 4000)
      }).catch(() => null);
      if (res && res.ok) return res;
    } catch (_) {}
  }

  // 2. Direct fetch
  try {
    const res = await fetch(targetUrl, {
      ...options,
      headers: customHeaders,
      signal: AbortSignal.timeout(options.timeout || 4000)
    }).catch(() => null);
    if (res && res.ok) return res;
  } catch (_) {}

  // 3. CF Worker Proxy fallback
  try {
    const workerUrl = `${CF_WORKER_PROXY}?url=${encodeURIComponent(targetUrl)}`;
    const res = await fetch(workerUrl, {
      ...options,
      headers: customHeaders,
      signal: AbortSignal.timeout(options.timeout || 4000)
    }).catch(() => null);
    if (res && res.ok) return res;
  } catch (_) {}

  return null;
}

function cleanTitle(raw) {
  if (!raw) return '';
  return raw
    .toLowerCase()
    .replace(/\s*-\s*s\d+e\d+.*$/i, '')
    .replace(/\s*-\s*s\d+.*$/i, '')
    .replace(/\s*-\s*\d+\.\s*sezon.*$/i, '')
    .replace(/\s*\(\d{4}\).*/, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function toSlug(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

/**
 * Searches yabancidizi.news via its AJAX search endpoint
 */
export async function searchYabanciDizi(query) {
  if (!query || typeof query !== 'string' || query.trim().length < 2) return [];

  try {
    const cleanQ = query.trim();
    const searchUrl = `${YBD_BASE}/search?qr=${encodeURIComponent(cleanQ)}`;
    const res = await fetchYbd(searchUrl, {
      method: 'GET',
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json, text/javascript, */*; q=0.01',
        'Referer': 'https://yabancidizi.news/'
      },
      timeout: 4500
    });

    if (!res) return [];
    const json = await res.json().catch(() => null);
    const results = json?.data?.result || [];
    return Array.isArray(results) ? results : [];
  } catch (_) {
    return [];
  }
}

/**
 * Parses VidMoly and player embeds from YabancıDizi page HTML
 */
function extractStreamsFromHtml(html, isDub) {
  const streams = [];
  if (!html) return streams;

  // 1. Match VidMoly download / stream links
  // e.g. <a href="https://vidmoly.me/dl/82kiu4di02bn" ...>Türkçe Dublaj İndir</a>
  const vidmolyLinks = [...html.matchAll(/<a[^>]+href=["'](https?:\/\/[^"']*(?:vidmoly|vidmoxy)[^"']*)["'][^>]*>([\s\S]*?)<\/a>/gi)];
  for (const match of vidmolyLinks) {
    const rawLink = match[1];
    const text = (match[2] || '').toLowerCase();
    const linkDub = text.includes('dublaj') || text.includes('dub') || rawLink.includes('dub');
    const linkSub = text.includes('altyaz') || text.includes('sub') || rawLink.includes('sub');

    // Filter by requested category if explicit
    if (isDub && linkSub && !linkDub) continue;
    if (!isDub && linkDub && !linkSub) continue;

    const idMatch = rawLink.match(/(?:\/dl\/|\/embed-|\/v\/|\/)([a-zA-Z0-9_-]{8,16})/);
    const embedId = idMatch ? idMatch[1] : null;
    if (!embedId) continue;

    const embedUrl = `https://vidmoly.net/embed-${embedId}.html`;
    if (!streams.some(s => s.url === embedUrl)) {
      streams.push({
        id: `ybd_vm_${embedId}_${isDub ? 'dub' : 'sub'}`,
        name: isDub ? 'YabancıDizi VidMoly 1080p' : 'YabancıDizi VidMoly (Altyazılı)',
        displayName: isDub ? 'YabancıDizi VidMoly 1080p' : 'YabancıDizi VidMoly (Altyazılı)',
        badge: isDub ? '⚡ TR Dublaj' : '💬 TR Altyazı',
        source: 'YabanciDizi',
        url: embedUrl,
        streamUrl: embedUrl,
        originalEmbedUrl: embedUrl,
        quality: '1080p',
        isHls: false,
        isDirectVideo: false,
        type: 'embed',
        isDub,
        getUrl: () => embedUrl
      });
    }
  }

  // 2. Match Sibnet embeds if present
  const sibnetMatches = [...html.matchAll(/https?:\/\/video\.sibnet\.ru\/shell\.php\?videoid=(\d+)/gi)];
  for (const match of sibnetMatches) {
    const fullUrl = match[0];
    const id = match[1];
    if (!streams.some(s => s.url === fullUrl)) {
      streams.push({
        id: `ybd_sib_${id}_${isDub ? 'dub' : 'sub'}`,
        name: 'YabancıDizi Sibnet HD',
        displayName: 'YabancıDizi Sibnet HD',
        badge: isDub ? '⚡ TR Dublaj' : '💬 TR Altyazı',
        source: 'YabanciDizi',
        url: fullUrl,
        streamUrl: fullUrl,
        originalEmbedUrl: fullUrl,
        quality: '720p',
        isHls: false,
        isDirectVideo: false,
        type: 'embed',
        isDub,
        getUrl: () => fullUrl
      });
    }
  }

  return streams;
}

/**
 * Extracts TV Episode streams from yabancidizi.news
 */
export async function fetchYabanciDiziEpisodeSources({
  titles = [],
  seriesTitle = '',
  originalTitle = '',
  season = 1,
  episode = 1,
  isDub = true
}) {
  try {
    const candidates = [...new Set([...titles, seriesTitle, originalTitle])].filter(t => t && t.trim().length > 1);
    if (candidates.length === 0) return [];

    const candidateLinks = [];

    // 1. Search endpoint
    for (const q of candidates) {
      const results = await searchYabanciDizi(q);
      if (results.length > 0) {
        const normQ = cleanTitle(q);
        const match = results.find(r => cleanTitle(r.s_name).includes(normQ) || normQ.includes(cleanTitle(r.s_name))) || results[0];
        if (match && match.s_link) {
          candidateLinks.push(match.s_link);
          break;
        }
      }
    }

    // 2. Add predicted slug variations as fallback
    for (const c of candidates) {
      const slug = toSlug(c);
      if (slug) {
        candidateLinks.push(`${slug}-izle-1`);
        candidateLinks.push(`${slug}-izle`);
        candidateLinks.push(slug);
      }
    }

    const uniqueLinks = [...new Set(candidateLinks)];

    for (const link of uniqueLinks) {
      const epPageUrl = `${YBD_BASE}/dizi/${link}/sezon-${season}/bolum-${episode}`;
      const res = await fetchYbd(epPageUrl, { timeout: 4000 });
      if (!res || !res.ok) continue;

      const html = await res.text().catch(() => '');
      const streams = extractStreamsFromHtml(html, isDub);
      if (streams.length > 0) {
        return streams;
      }
    }

    return [];
  } catch (err) {
    console.warn('[YabanciDiziScraper] Episode error:', err);
    return [];
  }
}

/**
 * Extracts Movie streams from yabancidizi.news
 */
export async function fetchYabanciDiziMovieSources({
  titles = [],
  title = '',
  originalTitle = '',
  isDub = true
}) {
  try {
    const candidates = [...new Set([...titles, title, originalTitle])].filter(t => t && t.trim().length > 1);
    if (candidates.length === 0) return [];

    const candidateLinks = [];

    // 1. Search endpoint
    for (const q of candidates) {
      const results = await searchYabanciDizi(q);
      if (results.length > 0) {
        const normQ = cleanTitle(q);
        const match = results.find(r => r.s_type === '1' || cleanTitle(r.s_name).includes(normQ)) || results[0];
        if (match && match.s_link) {
          candidateLinks.push(match.s_link);
          break;
        }
      }
    }

    // 2. Add predicted slug variations
    for (const c of candidates) {
      const slug = toSlug(c);
      if (slug) {
        candidateLinks.push(`${slug}-izle`);
        candidateLinks.push(`${slug}-izle-1`);
        candidateLinks.push(slug);
      }
    }

    const uniqueLinks = [...new Set(candidateLinks)];

    for (const link of uniqueLinks) {
      const moviePageUrl = `${YBD_BASE}/film/${link}`;
      const res = await fetchYbd(moviePageUrl, { timeout: 4000 });
      if (!res || !res.ok) continue;

      const html = await res.text().catch(() => '');
      const streams = extractStreamsFromHtml(html, isDub);
      if (streams.length > 0) {
        return streams;
      }
    }

    return [];
  } catch (err) {
    console.warn('[YabanciDiziScraper] Movie error:', err);
    return [];
  }
}
