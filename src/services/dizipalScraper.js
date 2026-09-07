/* ==========================================================================
   CinePulse Studio - Dizipal Scraper (Movies & Series Engine)
   Direct 1080p HLS Streams & Multi-Language Subtitles from Dizipal
   Bypasses preroll ads and extracts native master.m3u8 streams
   ========================================================================== */

import { extractAlphaStream } from './streamExtractors.js';

const BASE_URL = 'https://dizipal1227.com';

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

async function fetchSafe(targetUrl, options = {}) {
  try {
    const res = await fetch(targetUrl, {
      ...options,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        ...(options.headers || {})
      },
      signal: AbortSignal.timeout(options.timeout || 4500)
    }).catch(() => null);

    if (res && res.ok) return res;
  } catch (_) {}

  return null;
}

/**
 * Searches Dizipal for movies or series
 */
export async function searchDizipal(query) {
  if (!query || typeof query !== 'string' || query.trim().length < 2) return [];

  try {
    const searchUrl = `${BASE_URL}/ara?q=${encodeURIComponent(query.trim())}`;
    const res = await fetchSafe(searchUrl);
    if (!res) return [];

    const html = await res.text();
    const links = [...html.matchAll(/href=["'](https:\/\/dizipal1227\.com\/(film|dizi)\/([^"']+))["']/gi)];
    const results = [];

    for (const match of links) {
      const fullUrl = match[1];
      const type = match[2]; // 'film' or 'dizi'
      const slug = match[3];

      if (!results.some(r => r.url === fullUrl)) {
        results.push({
          url: fullUrl,
          type,
          slug,
          isSeries: type === 'dizi'
        });
      }
    }

    return results;
  } catch (_) {
    return [];
  }
}

/**
 * Extracts streams for a Movie on Dizipal
 */
export async function fetchDizipalMovieSources({
  titles = [],
  title = '',
  originalTitle = '',
  isDub = true
}) {
  const candidateTitles = [...new Set([...titles, title, originalTitle])].filter(t => t && typeof t === 'string' && t.trim().length > 1);
  if (candidateTitles.length === 0) return [];

  for (const query of candidateTitles) {
    const searchResults = await searchDizipal(query);
    const movieMatch = searchResults.find(r => r.type === 'film');

    if (movieMatch) {
      try {
        const pageRes = await fetchSafe(movieMatch.url);
        if (!pageRes) continue;

        const html = await pageRes.text();
        const embedMatch = html.match(/x-data=["']softPlayer\(['"](https?:\/\/[^'"]+)['"]/i);
        if (!embedMatch) continue;

        const embedUrl = embedMatch[1];
        const direct = await extractAlphaStream(embedUrl);
        if (direct && direct.url) {
          return [
            {
              id: `dzp_mov_${movieMatch.slug}_${isDub ? 'dub' : 'sub'}`,
              name: 'Dizipal Direct 1080p',
              displayName: 'Dizipal Direct 1080p',
              badge: isDub ? '⚡ TR Dublaj' : '💬 TR Altyazı',
              source: 'Dizipal',
              url: direct.url,
              streamUrl: direct.url,
              quality: '1080p',
              isHls: true,
              isDirectVideo: true,
              type: 'hls',
              subtitles: direct.subtitles || [],
              isDub,
              getUrl: () => direct.url
            }
          ];
        }
      } catch (_) {}
    }
  }

  return [];
}

/**
 * Extracts streams for a TV Episode on Dizipal
 */
export async function fetchDizipalEpisodeSources({
  titles = [],
  seriesTitle = '',
  originalTitle = '',
  season = 1,
  episode = 1,
  isDub = true
}) {
  const candidateTitles = [...new Set([...titles, seriesTitle, originalTitle])].filter(t => t && typeof t === 'string' && t.trim().length > 1);
  if (candidateTitles.length === 0) return [];

  for (const query of candidateTitles) {
    const searchResults = await searchDizipal(query);
    const seriesMatch = searchResults.find(r => r.type === 'dizi');

    if (seriesMatch) {
      try {
        // Construct standard episode URL format
        const episodeUrl = `${seriesMatch.url}/sezon-${season}/bolum-${episode}`;
        const pageRes = await fetchSafe(episodeUrl);
        if (!pageRes) continue;

        const html = await pageRes.text();
        const embedMatch = html.match(/x-data=["']softPlayer\(['"](https?:\/\/[^'"]+)['"]/i);
        if (!embedMatch) continue;

        const embedUrl = embedMatch[1];
        const direct = await extractAlphaStream(embedUrl);
        if (direct && direct.url) {
          return [
            {
              id: `dzp_tv_${seriesMatch.slug}_s${season}_e${episode}_${isDub ? 'dub' : 'sub'}`,
              name: `Dizipal 1080p (S${season}B${episode})`,
              displayName: `Dizipal 1080p (S${season}B${episode})`,
              badge: isDub ? '⚡ TR Dublaj' : '💬 TR Altyazı',
              source: 'Dizipal',
              url: direct.url,
              streamUrl: direct.url,
              quality: '1080p',
              isHls: true,
              isDirectVideo: true,
              type: 'hls',
              subtitles: direct.subtitles || [],
              isDub,
              getUrl: () => direct.url
            }
          ];
        }
      } catch (_) {}
    }
  }

  return [];
}
