/* ==========================================================================
   Diziyou Scraper (Diziyou.one)
   High-quality Turkish TV Series & Episodes (Direct HLS/m3u8 & Player Embeds)
   Parallel Candidate URL resolution for ultra-fast response (<500ms)
   ========================================================================== */

const CF_WORKER_PROXY = 'https://wild-credit-e1ae.cagatayca07.workers.dev';
const DIZIYOU_BASE = 'https://www.diziyou.one';

function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function fetchDiziyou(endpointOrUrl, options = {}) {
  const isBrowser = typeof window !== 'undefined';
  let pathOnly = endpointOrUrl;
  if (pathOnly.startsWith('http')) {
    try {
      const u = new URL(pathOnly);
      pathOnly = u.pathname + u.search;
    } catch (_) {}
  }
  pathOnly = pathOnly.replace(/^\/api\/dzy/, '');
  if (!pathOnly.startsWith('/')) pathOnly = `/${pathOnly}`;

  const fullUrl = `${DIZIYOU_BASE}${pathOnly}`;

  // 1. In browser, try /api/dzy proxy first (bypasses CORS)
  if (isBrowser) {
    try {
      const proxyUrl = `/api/dzy${pathOnly}`;
      const res = await fetch(proxyUrl, {
        ...options,
        signal: AbortSignal.timeout(options.timeout || 4000)
      }).catch(() => null);
      if (res && res.ok) return res;
    } catch (_) {}
  }

  // 2. Direct fetch (for Node.js or if CORS allowed)
  try {
    const res = await fetch(fullUrl, {
      ...options,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Referer': 'https://www.diziyou.one/',
        ...(options.headers || {})
      },
      signal: AbortSignal.timeout(options.timeout || 4000)
    }).catch(() => null);
    if (res && res.ok) return res;
  } catch (_) {}

  // 3. Local proxy fallback
  if (isBrowser) {
    try {
      const localProxyUrl = `/api/proxy?url=${encodeURIComponent(fullUrl)}&ref=${encodeURIComponent('https://www.diziyou.one/')}`;
      const res = await fetch(localProxyUrl, {
        ...options,
        signal: AbortSignal.timeout(options.timeout || 4000)
      }).catch(() => null);
      if (res && res.ok) return res;
    } catch (_) {}
  }

  // 4. Cloudflare Worker fallback
  try {
    const workerUrl = `${CF_WORKER_PROXY}?url=${encodeURIComponent(fullUrl)}`;
    const res = await fetch(workerUrl, {
      ...options,
      signal: AbortSignal.timeout(options.timeout || 4500)
    }).catch(() => null);
    if (res && res.ok) return res;
  } catch (_) {}

  return null;
}

export async function fetchDiziyouSources({
  titles = [],
  title = '',
  seriesTitle = '',
  originalTitle = '',
  season = 1,
  episode = 1,
  isDub = false
}) {
  const sNum = parseInt(season, 10) || 1;
  const epNum = parseInt(episode, 10) || 1;

  const allTitles = Array.from(new Set([
    seriesTitle,
    title,
    originalTitle,
    ...(titles || [])
  ])).filter(Boolean);

  const candidatePaths = new Set();
  for (const t of allTitles) {
    const slug = slugify(t);
    if (!slug) continue;

    candidatePaths.add(`/${slug}-${sNum}-sezon-${epNum}-bolum/`);
    candidatePaths.add(`/${slug}2-${sNum}-sezon-${epNum}-bolum/`);
    candidatePaths.add(`/${slug}-${sNum}-sezon-${epNum}-bolum-izle/`);
    candidatePaths.add(`/dizi/${slug}-${sNum}-sezon-${epNum}-bolum/`);
  }

  // Search fallback if candidate URLs fail
  let htmlResults = await Promise.all(
    [...candidatePaths].map(async (epPath) => {
      try {
        const res = await fetchDiziyou(epPath, { timeout: 4500 });
        if (!res) return null;
        const html = await res.text();
        if (!html || html.length < 500) return null;
        return { epPath, html };
      } catch (_) {
        return null;
      }
    })
  );

  let validMatches = htmlResults.filter(Boolean);

  // If direct paths returned nothing, try search
  if (validMatches.length === 0) {
    for (const q of allTitles.slice(0, 2)) {
      try {
        const searchRes = await fetchDiziyou(`/?s=${encodeURIComponent(q)}`, { timeout: 3500 });
        if (!searchRes) continue;
        const sHtml = await searchRes.text();
        const epRegex = new RegExp(`href="([^"]*(?:${sNum}-sezon-${epNum}-bolum|bolum)[^"]*)"`, 'gi');
        const foundLinks = [...sHtml.matchAll(epRegex)].map(m => m[1]);
        for (const link of foundLinks.slice(0, 3)) {
          const epRes = await fetchDiziyou(link, { timeout: 4000 });
          if (epRes) {
            const h = await epRes.text();
            if (h && h.length > 500) {
              validMatches.push({ epPath: link, html: h });
              break;
            }
          }
        }
        if (validMatches.length > 0) break;
      } catch (_) {}
    }
  }

  const sources = [];

  for (const match of validMatches) {
    const { html } = match;

    // 1. Extract Player Iframe & direct HLS
    const iframeMatch = html.match(/<iframe[^>]+src=["']([^"']*(?:player|embed)[^"']*)["']/i);
    const playerIdMatch = html.match(/\/player\/(\d+)\.html/i);

    if (playerIdMatch) {
      const playerId = playerIdMatch[1];
      const directM3u8 = `https://storage.diziyou.one/episodes/${playerId}/play.m3u8`;

      sources.push({
        id: `dyu_m3u8_${playerId}`,
        name: isDub ? 'Diziyou 1080p (TR Altyazı)' : 'Diziyou 1080p (TR Altyazı)',
        displayName: 'Diziyou 1080p',
        badge: '💬 Diziyou Altyazı',
        url: directM3u8,
        streamUrl: directM3u8,
        isHls: true,
        isDirectVideo: true,
        source: 'Diziyou',
        getUrl: () => directM3u8
      });

      const playerEmbedUrl = `https://www.diziyou.one/player/${playerId}.html`;
      sources.push({
        id: `dyu_frame_${playerId}`,
        name: isDub ? 'Diziyou VIP (TR Altyazı)' : 'Diziyou VIP (TR Altyazı)',
        displayName: 'Diziyou VIP',
        badge: '💬 Diziyou Web',
        url: playerEmbedUrl,
        streamUrl: playerEmbedUrl,
        isHls: false,
        isDirectVideo: false,
        source: 'Diziyou',
        getUrl: () => playerEmbedUrl
      });
      break;
    } else if (iframeMatch) {
      const iframeSrc = iframeMatch[1].startsWith('//') ? `https:${iframeMatch[1]}` : iframeMatch[1];
      sources.push({
        id: `dyu_frame_${Math.random().toString(36).substring(2, 6)}`,
        name: isDub ? 'Diziyou VIP (TR Altyazı)' : 'Diziyou VIP (TR Altyazı)',
        displayName: 'Diziyou VIP',
        badge: '💬 Diziyou Web',
        url: iframeSrc,
        streamUrl: iframeSrc,
        isHls: false,
        isDirectVideo: false,
        source: 'Diziyou',
        getUrl: () => iframeSrc
      });
      break;
    }
  }

  return sources;
}
