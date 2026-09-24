/* ==========================================================================
   CinePulse Studio - DramaDizilerim Scraper (Kısa Dizi / Short Drama VIP)
   Extracts Turkish Dubbed & Subtitled Short Dramas (FlexTV, NetShort, DramaBox, etc.)
   Features 100% CORS-Free Direct 1080p HLS Streams & Multi-audio support.
   ========================================================================== */

import { isStrictMediaTitleMatch } from './mediaMatcher.js';

const BASE_URL = 'https://dramadizilerim.com';

function toTurkishSlug(title) {
  if (!title) return '';
  return title
    .toLowerCase()
    .trim()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function normalizeTitle(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]/g, '');
}

async function fetchSafe(pathUrl, options = {}) {
  const isBrowser = typeof window !== 'undefined';
  let targetUrl = pathUrl;

  if (isBrowser) {
    if (pathUrl.startsWith('http')) {
      try {
        const u = new URL(pathUrl);
        targetUrl = `/api/ddz${u.pathname}${u.search}`;
      } catch (_) {
        targetUrl = pathUrl;
      }
    } else {
      targetUrl = `/api/ddz${pathUrl.startsWith('/') ? '' : '/'}${pathUrl}`;
    }
  } else {
    if (!targetUrl.startsWith('http')) {
      targetUrl = `${BASE_URL}${targetUrl.startsWith('/') ? '' : '/'}${targetUrl}`;
    }
  }

  try {
    const res = await fetch(targetUrl, {
      ...options,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Referer': BASE_URL,
        ...(options.headers || {})
      },
      signal: AbortSignal.timeout(options.timeout || 6000)
    }).catch(() => null);

    if (res && res.ok) return res;
  } catch (_) {}

  return null;
}

/**
 * Searches DramaDizilerim for candidate short dramas
 */
export async function searchDramaDizilerim(query) {
  if (!query || typeof query !== 'string' || query.trim().length < 2) return [];

  const cleanQuery = query.trim();
  const searchPath = `/search?q=${encodeURIComponent(cleanQuery)}`;
  const res = await fetchSafe(searchPath);
  if (!res) return [];

  const html = await res.text().catch(() => '');
  if (!html) return [];

  const results = [];
  const cardRegex = /<a[^>]+href=["'](?:https:\/\/dramadizilerim\.com)?\/dizi\/([a-zA-Z0-9_-]+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match;

  while ((match = cardRegex.exec(html)) !== null) {
    const slug = match[1];
    const inner = match[2];
    const titleMatch = inner.match(/alt=["']([^"']+)["']/i) || inner.match(/<h[2-6][^>]*>(.*?)<\/h[2-6]>/i);
    const title = titleMatch ? titleMatch[1].replace(/<[^>]+>/g, '').trim() : slug;

    if (!results.some(r => r.slug === slug)) {
      results.push({
        title,
        slug,
        url: `${BASE_URL}/dizi/${slug}`
      });
    }
  }

  return results;
}

/**
 * Extracts direct HLS / MP4 stream from DramaDizilerim for a given series and episode
 */
export async function fetchDramaDizilerimEpisodeSources({
  titles = [],
  seriesTitle = '',
  season = 1,
  episode = 1,
  isDub = true
}) {
  const allTitles = [...new Set([...titles, seriesTitle])].filter(t => t && typeof t === 'string' && t.trim().length > 1);
  if (allTitles.length === 0) return [];

  const seasonNum = parseInt(season, 10) || 1;
  const episodeNum = parseInt(episode, 10) || 1;

  let matchedSlug = null;
  let matchedItem = null;

  // 1. Direct slug test
  for (const t of allTitles) {
    const s = toTurkishSlug(t);
    const testPath = `/izle/${s}?s=${seasonNum}&e=${episodeNum}`;
    const headCheck = await fetchSafe(testPath, { method: 'HEAD', timeout: 3500 });
    if (headCheck && headCheck.ok) {
      matchedSlug = s;
      break;
    }
  }

  // 2. Search by titles if direct slug didn't match
  if (!matchedSlug) {
    for (const t of allTitles) {
      const searchResults = await searchDramaDizilerim(t);
      if (searchResults.length > 0) {
        // Try strict media title matching
        for (const item of searchResults) {
          if (isStrictMediaTitleMatch(item.title, allTitles, 0.75)) {
            matchedSlug = item.slug;
            matchedItem = item;
            break;
          }
        }
        if (matchedSlug) break;

        // Try normalized fuzzy matching
        const normTarget = normalizeTitle(t);
        const best = searchResults.find(r => {
          const normR = normalizeTitle(r.title);
          return normR === normTarget || normR.includes(normTarget) || normTarget.includes(normR);
        });

        if (best) {
          matchedSlug = best.slug;
          matchedItem = best;
          break;
        }
      }
    }
  }

  if (!matchedSlug) return [];

  // 3. Fetch watch page
  const watchPath = `/izle/${matchedSlug}?s=${seasonNum}&e=${episodeNum}`;
  const watchRes = await fetchSafe(watchPath);
  if (!watchRes) return [];

  const watchHtml = await watchRes.text().catch(() => '');
  if (!watchHtml) return [];

  // 4. Extract embed.php URL from data-src or src
  const embedMatch = watchHtml.match(/(?:data-src|src)=["']([^"']*embed\.php[^"']*)["']/i);
  if (!embedMatch) return [];

  let embedUrl = embedMatch[1].replace(/&amp;/g, '&');
  if (!embedUrl.startsWith('http')) {
    embedUrl = `${BASE_URL}${embedUrl.startsWith('/') ? '' : '/'}${embedUrl}`;
  }

  // 5. Fetch embed player HTML
  const embedRes = await fetchSafe(embedUrl, {
    headers: { 'Referer': `${BASE_URL}${watchPath}` }
  });
  if (!embedRes) return [];

  const embedHtml = await embedRes.text().catch(() => '');
  if (!embedHtml) return [];

  const streams = [];

  // 6. Direct let source = "..." stream extraction
  const sourceMatch = embedHtml.match(/let\s+source\s*=\s*["']([^"']+)["']/);
  let rawUrl = (sourceMatch && sourceMatch[1].startsWith('http')) ? sourceMatch[1] : null;

  if (!rawUrl) {
    const directMedia = embedHtml.match(/https?:\/\/[^"'\s\\]+\.(?:m3u8|mp4)[^"'\s\\]*/);
    if (directMedia) rawUrl = directMedia[0];
  }

  if (rawUrl) {
    const isM3U8 = rawUrl.includes('.m3u8') || rawUrl.includes('mpegurl');
    const titleText = (matchedItem?.title || matchedSlug).toLowerCase();
    const sourceIsDub = titleText.includes('dublaj') || isDub === true;

    const label = sourceIsDub
      ? `🇹🇷 DDZ VIP S${seasonNum}E${episodeNum} (TR Dublaj)`
      : `⚡ DDZ VIP S${seasonNum}E${episodeNum} (TR Altyazı)`;

    streams.push({
      id: `ddz_ep_${matchedSlug}_${seasonNum}_${episodeNum}`,
      name: label,
      displayName: label,
      badge: '🎭 DDZ VIP',
      source: 'DDZ VIP',
      url: rawUrl,
      streamUrl: rawUrl,
      rawStreamUrl: rawUrl,
      quality: '1080p HD',
      isHls: isM3U8,
      isDirectVideo: true,
      priority: 2,
      getUrl: () => rawUrl
    });
  }

  return streams;
}
