/* ==========================================================================
   CinePulse Studio - Diziyo Scraper (Movies & TV Series Engine)
   Extracts direct VidMoly HLS 1080p (.m3u8) streams from Diziyo.so
   Supports Turkish Dubbed (Türkçe Dublaj) & Subtitled (Türkçe Altyazılı).
   ========================================================================== */

import { extractVidmolyStream } from './streamExtractors.js';

const CF_WORKER_PROXY = 'https://wild-credit-e1ae.cagatayca07.workers.dev';
const DIZIYO_BASE = 'https://www.diziyo.so';

async function fetchDiziyo(url, options = {}) {
  const isBrowser = typeof window !== 'undefined';
  const cleanUrl = url.startsWith('http') ? url : `${DIZIYO_BASE}${url.startsWith('/') ? url : `/${url}`}`;

  // 1. Direct fetch (Node / Serverless)
  try {
    const res = await fetch(cleanUrl, {
      ...options,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        ...(options.headers || {})
      },
      signal: AbortSignal.timeout(options.timeout || 4000)
    }).catch(() => null);
    if (res && res.ok) return res;
  } catch (_) {}

  // 2. Vercel proxy fallback
  if (isBrowser) {
    try {
      const u = new URL(cleanUrl);
      const proxyUrl = `/api/dzyo${u.pathname}${u.search}`;
      const res = await fetch(proxyUrl, {
        ...options,
        signal: AbortSignal.timeout(options.timeout || 4000)
      }).catch(() => null);
      if (res && res.ok) return res;
    } catch (_) {}
  }

  // 3. Cloudflare Worker fallback
  try {
    const workerUrl = `${CF_WORKER_PROXY}?url=${encodeURIComponent(cleanUrl)}`;
    const res = await fetch(workerUrl, {
      ...options,
      signal: AbortSignal.timeout(options.timeout || 4500)
    }).catch(() => null);
    if (res && res.ok) return res;
  } catch (_) {}

  return null;
}

function normalizeTitle(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]/g, '');
}

function toSlug(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * Searches Diziyo for series & movies
 */
export async function searchDiziyo(query) {
  if (!query || typeof query !== 'string' || query.trim().length < 2) return [];
  try {
    const res = await fetchDiziyo(`/arama?q=${encodeURIComponent(query.trim())}`, { timeout: 3500 });
    if (!res) return [];
    const html = await res.text().catch(() => '');
    if (!html) return [];

    const matches = Array.from(new Set(html.match(/href="https:\/\/www\.diziyo\.so\/(?:dizi|film)\/[^"]+"/g) || []));
    return matches.map(m => {
      const url = m.replace('href="', '').replace('"', '');
      const isSeries = url.includes('/dizi/');
      const slugMatch = url.match(/\/(?:dizi|film)\/([^/]+)/);
      return {
        url,
        slug: slugMatch ? slugMatch[1] : '',
        isSeries
      };
    });
  } catch (_) {
    return [];
  }
}

/**
 * Resolves player gate on Diziyo by posting _token and fetching watch iframe
 */
async function resolveDiziyoPlayerEmbed(playerGateUrl, refererUrl) {
  try {
    const gateRes = await fetchDiziyo(playerGateUrl, {
      headers: {
        'Referer': refererUrl
      },
      timeout: 4000
    });
    if (!gateRes) return null;

    const gateHtml = await gateRes.text();
    const tokenMatch = gateHtml.match(/name="_token"\s+value="([^"]+)"/);
    const actionMatch = gateHtml.match(/action="([^"]+)"/);
    if (!tokenMatch || !actionMatch) return null;

    const token = tokenMatch[1];
    const authUrl = actionMatch[1];

    // Clean cookie header
    let cookieHeader = '';
    if (typeof gateRes.headers.getSetCookie === 'function') {
      cookieHeader = gateRes.headers.getSetCookie().map(c => c.split(';')[0].trim()).join('; ');
    } else {
      const rawCookie = gateRes.headers.get('set-cookie') || '';
      cookieHeader = rawCookie.split(/,\s*(?=[a-zA-Z0-9_-]+=)/).map(c => c.split(';')[0].trim()).join('; ');
    }

    // POST authorize with redirect manual to capture 302
    const postRes = await fetch(authUrl, {
      method: 'POST',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Content-Type': 'application/x-www-form-urlencoded',
        'Referer': playerGateUrl,
        'Origin': DIZIYO_BASE,
        ...(cookieHeader ? { 'Cookie': cookieHeader } : {})
      },
      body: new URLSearchParams({ _token: token }),
      redirect: 'manual',
      signal: AbortSignal.timeout(4000)
    }).catch(() => null);

    if (!postRes) return null;

    let watchUrl = postRes.headers.get('location');
    if (!watchUrl && (postRes.status === 200 || postRes.ok)) {
      const postHtml = await postRes.text().catch(() => '');
      const iframeMatch = postHtml.match(/<iframe[^>]+src="([^"]+)"/i);
      if (iframeMatch) return iframeMatch[1];
      const refreshMatch = postHtml.match(/url='([^']+)'/i) || postHtml.match(/url="([^"]+)"/i);
      if (refreshMatch) watchUrl = refreshMatch[1];
    }

    if (watchUrl) {
      const watchRes = await fetch(watchUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Referer': authUrl,
          ...(cookieHeader ? { 'Cookie': cookieHeader } : {})
        },
        signal: AbortSignal.timeout(4000)
      }).catch(() => null);

      if (watchRes) {
        const watchHtml = await watchRes.text().catch(() => '');
        const iframeMatch = watchHtml.match(/<iframe[^>]+src="([^"]+)"/i);
        if (iframeMatch) return iframeMatch[1];
      }
    }
  } catch (_) {}

  return null;
}

/**
 * Fetches Episode sources from Diziyo
 */
export async function fetchDiziyoEpisodeSources({ titles = [], seriesTitle, originalTitle, season, episode, isDub = false }) {
  const sources = [];
  const sNum = parseInt(season, 10) || 1;
  const epNum = parseInt(episode, 10) || 1;

  const candidateQueries = new Set();
  if (Array.isArray(titles)) titles.forEach(t => t && candidateQueries.add(t));
  if (seriesTitle) candidateQueries.add(seriesTitle);
  if (originalTitle) candidateQueries.add(originalTitle);

  let targetEpUrl = null;

  // 1. Try candidate slugs directly
  for (const q of candidateQueries) {
    const slug = toSlug(q);
    if (!slug) continue;
    const testUrl = `https://www.diziyo.so/dizi/${slug}/sezon-${sNum}/bolum-${epNum}/`;
    try {
      const res = await fetchDiziyo(testUrl, { timeout: 5000 });
      if (res && res.ok) {
        targetEpUrl = testUrl;
        break;
      }
    } catch (_) {}
  }

  // 2. Fallback: search
  if (!targetEpUrl) {
    for (const q of candidateQueries) {
      const results = await searchDiziyo(q);
      const seriesResult = results.find(r => r.isSeries);
      if (seriesResult && seriesResult.slug) {
        const testUrl = `https://www.diziyo.so/dizi/${seriesResult.slug}/sezon-${sNum}/bolum-${epNum}/`;
        const res = await fetchDiziyo(testUrl, { timeout: 3000 });
        if (res && res.ok) {
          targetEpUrl = testUrl;
          break;
        }
      }
    }
  }

  if (!targetEpUrl) return [];

  try {
    const epRes = await fetchDiziyo(targetEpUrl, { timeout: 6000 });
    if (!epRes) return [];
    const html = await epRes.text().catch(() => '');
    if (!html) return [];

    // Parse player sources
    const playerMatches = [...html.matchAll(/data-player-source="([^"]+)"[^>]*data-player-language-name="([^"]+)"/gi)];
    if (playerMatches.length === 0) return [];

    // Filter by dub or sub
    let selectedPlayer = null;
    for (const match of playerMatches) {
      const playerUrl = match[1];
      const lang = (match[2] || '').toLowerCase();
      if (isDub && (lang.includes('dublaj') || lang.includes('turkce') || lang.includes('tr'))) {
        selectedPlayer = playerUrl;
        break;
      }
      if (!isDub && (lang.includes('altyaz') || lang.includes('sub'))) {
        selectedPlayer = playerUrl;
        break;
      }
    }

    if (!selectedPlayer) {
      selectedPlayer = playerMatches[0][1];
    }

    // Resolve embed
    const embedUrl = await resolveDiziyoPlayerEmbed(selectedPlayer, targetEpUrl);
    if (embedUrl) {
      if (embedUrl.includes('vidmoly')) {
        const directStream = await extractVidmolyStream(embedUrl).catch(() => null);
        if (directStream && directStream.streamUrl) {
          sources.push({
            id: `dzy_vidmoly_s${sNum}e${epNum}`,
            name: isDub ? 'Diziyo VidMoly 1080p (TR Dublaj)' : 'Diziyo VidMoly 1080p (TR Altyazı)',
            displayName: 'Diziyo VidMoly 1080p',
            streamUrl: directStream.streamUrl,
            url: directStream.streamUrl,
            isHls: true,
            isDirectVideo: true,
            source: 'Diziyo',
            badge: isDub ? '⚡ Diziyo Dublaj' : '💬 Diziyo Altyazı'
          });
          return sources;
        }
      }

      sources.push({
        id: `dzy_embed_s${sNum}e${epNum}`,
        name: isDub ? 'Diziyo Player (TR Dublaj)' : 'Diziyo Player (TR Altyazı)',
        displayName: 'Diziyo Player',
        streamUrl: embedUrl,
        url: embedUrl,
        isHls: false,
        isDirectVideo: false,
        source: 'Diziyo',
        badge: isDub ? '⚡ Diziyo Dublaj' : '💬 Diziyo Altyazı'
      });
    }
  } catch (_) {}

  return sources;
}

/**
 * Fetches Movie sources from Diziyo
 */
export async function fetchDiziyoMovieSources({ titles = [], title, originalTitle, isDub = false }) {
  const sources = [];
  const candidateQueries = new Set();
  if (Array.isArray(titles)) titles.forEach(t => t && candidateQueries.add(t));
  if (title) candidateQueries.add(title);
  if (originalTitle) candidateQueries.add(originalTitle);

  let targetMovieUrl = null;

  // 1. Direct slug test
  for (const q of candidateQueries) {
    const slug = toSlug(q);
    if (!slug) continue;
    const testUrl = `https://www.diziyo.so/film/${slug}/`;
    try {
      const res = await fetchDiziyo(testUrl, { timeout: 3000 });
      if (res && res.ok) {
        targetMovieUrl = testUrl;
        break;
      }
    } catch (_) {}
  }

  // 2. Search fallback
  if (!targetMovieUrl) {
    for (const q of candidateQueries) {
      const results = await searchDiziyo(q);
      const movieResult = results.find(r => !r.isSeries);
      if (movieResult && movieResult.url) {
        targetMovieUrl = movieResult.url;
        break;
      }
    }
  }

  if (!targetMovieUrl) return [];

  try {
    const mRes = await fetchDiziyo(targetMovieUrl, { timeout: 4000 });
    if (!mRes) return [];
    const html = await mRes.text().catch(() => '');
    if (!html) return [];

    const playerMatches = [...html.matchAll(/data-player-source="([^"]+)"[^>]*data-player-language-name="([^"]+)"/gi)];
    if (playerMatches.length === 0) return [];

    let selectedPlayer = null;
    for (const match of playerMatches) {
      const playerUrl = match[1];
      const lang = (match[2] || '').toLowerCase();
      if (isDub && (lang.includes('dublaj') || lang.includes('tr'))) {
        selectedPlayer = playerUrl;
        break;
      }
      if (!isDub && (lang.includes('altyaz') || lang.includes('sub'))) {
        selectedPlayer = playerUrl;
        break;
      }
    }

    if (!selectedPlayer) selectedPlayer = playerMatches[0][1];

    const embedUrl = await resolveDiziyoPlayerEmbed(selectedPlayer, targetMovieUrl);
    if (embedUrl) {
      if (embedUrl.includes('vidmoly')) {
        const directStream = await extractVidmolyStream(embedUrl).catch(() => null);
        if (directStream && directStream.streamUrl) {
          sources.push({
            id: 'dzy_vidmoly_movie',
            name: isDub ? 'Diziyo VidMoly 1080p (TR Dublaj)' : 'Diziyo VidMoly 1080p (TR Altyazı)',
            displayName: 'Diziyo VidMoly 1080p',
            streamUrl: directStream.streamUrl,
            url: directStream.streamUrl,
            isHls: true,
            isDirectVideo: true,
            source: 'Diziyo',
            badge: isDub ? '⚡ Diziyo Dublaj' : '💬 Diziyo Altyazı'
          });
          return sources;
        }
      }

      sources.push({
        id: 'dzy_embed_movie',
        name: isDub ? 'Diziyo Player (TR Dublaj)' : 'Diziyo Player (TR Altyazı)',
        displayName: 'Diziyo Player',
        streamUrl: embedUrl,
        url: embedUrl,
        isHls: false,
        isDirectVideo: false,
        source: 'Diziyo',
        badge: isDub ? '⚡ Diziyo Dublaj' : '💬 Diziyo Altyazı'
      });
    }
  } catch (_) {}

  return sources;
}
