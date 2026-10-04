/* ==========================================================================
   CinePulse Studio - Dramalar.com Scraper (Kısa Dizi / Mini Series VIP)
   High-speed direct HLS m3u8 streams from dramalar.com CDN with CORS enabled.
   ========================================================================== */

import { isStrictMediaTitleMatch } from './mediaMatcher.js';

const BASE_URL = 'https://dramalar.com';

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
        targetUrl = `/api/dml${u.pathname}${u.search}`;
      } catch (_) {
        targetUrl = pathUrl;
      }
    } else {
      targetUrl = `/api/dml${pathUrl.startsWith('/') ? '' : '/'}${pathUrl}`;
    }
  } else {
    if (!targetUrl.startsWith('http')) {
      targetUrl = `${BASE_URL}${targetUrl.startsWith('/') ? '' : '/'}${targetUrl}`;
    }
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), options.timeout || 6000);
    const res = await fetch(targetUrl, {
      ...options,
      signal: controller.signal,
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        ...(options.headers || {})
      }
    });
    clearTimeout(timeoutId);
    return res;
  } catch (err) {
    return null;
  }
}

/**
 * Searches Dramalar.com for titles matching query or discovers catalog items.
 */
export async function searchDramalar(query = '', page = 1) {
  const cleanQ = (query || '').trim();
  const searchPath = cleanQ
    ? `/kesfet?query=${encodeURIComponent(cleanQ)}${page > 1 ? `&page=${page}` : ''}`
    : `/kesfet${page > 1 ? `?page=${page}` : ''}`;

  const res = await fetchSafe(searchPath);
  if (!res) return [];

  const html = await res.text().catch(() => '');
  if (!html) return [];

  const nextDataMatch = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
  if (!nextDataMatch) return [];

  try {
    const nextData = JSON.parse(nextDataMatch[1]);
    const rows = nextData?.props?.pageProps?.initialData?.rows || [];
    return rows.map(r => {
      const coverHash = (r.cover || '').match(/\/([a-f0-9]+)\/cover/)?.[1] || '';
      return {
        id: `dml_${r.slug || r.rawSlug || r.id}`,
        slug: r.slug || r.rawSlug,
        rawSlug: r.rawSlug || r.slug,
        title: r.title,
        cover: r.cover,
        poster: r.cover,
        description: r.description || '',
        rating: r.rating || 0,
        provider: r.provider || 'netshort',
        coverHash,
        source: 'Dramalar VIP'
      };
    });
  } catch (err) {
    console.warn('[DramalarScraper] JSON parse error:', err);
    return [];
  }
}

/**
 * Fetches full details and episodes for a Dramalar series by slug.
 */
export async function fetchDramalarDetails(slug) {
  if (!slug) return null;
  const cleanSlug = slug.replace(/^dml_/, '');
  const res = await fetchSafe(`/dizi/${cleanSlug}`);
  if (!res) return null;

  const html = await res.text().catch(() => '');
  if (!html) return null;

  const nextDataMatch = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
  if (!nextDataMatch) return null;

  try {
    const nextData = JSON.parse(nextDataMatch[1]);
    const data = nextData?.props?.pageProps?.initialData;
    if (!data) return null;

    const coverHash = (data.cover || '').match(/\/([a-f0-9]+)\/cover/)?.[1] || '';
    const rawEpisodes = data.episodes?.rows || [];

    const episodes = rawEpisodes.map(ep => {
      const epNum = ep.number || 1;
      const streamUrl = ep.video || ep.streamUrl || (coverHash ? `https://cdn.dramalar.com/${coverHash}/${epNum}/index.m3u8` : '');
      return {
        id: ep.id || `dml_ep_${cleanSlug}_${epNum}`,
        season: 1,
        episode: epNum,
        number: epNum,
        title: ep.title || `${epNum}. Bölüm`,
        description: ep.description || '',
        duration: ep.durationSeconds || ep.duration || 0,
        thumb: ep.cover || ep.thumbnailUrl || data.cover,
        streamUrl,
        url: streamUrl
      };
    });

    return {
      id: `dml_${cleanSlug}`,
      slug: cleanSlug,
      title: data.title,
      description: data.description || '',
      cover: data.cover,
      poster: data.cover,
      backdrop: data.cover,
      rating: data.rating || 0,
      tags: data.tags || [],
      provider: data.provider || 'netshort',
      coverHash,
      totalEpisodes: data.totalEpisodes || episodes.length,
      episodes
    };
  } catch (err) {
    console.warn('[DramalarScraper] fetchDetails parse error:', err);
    return null;
  }
}

/**
 * Extracts direct HLS stream from dramalar.com CDN for a given series title/slug and episode.
 */
export async function fetchDramalarEpisodeSources({
  titles = [],
  seriesTitle = '',
  season = 1,
  episode = 1,
  isDub = false
}) {
  const seasonNum = parseInt(season, 10) || 1;
  const episodeNum = parseInt(episode, 10) || 1;

  const allTitles = [
    seriesTitle,
    ...(Array.isArray(titles) ? titles : [titles])
  ].filter(Boolean).map(t => t.trim());

  if (allTitles.length === 0) return [];

  // Check if any title is already a dml_ or ddz_ slug
  let targetSlug = '';
  for (const t of allTitles) {
    if (t.startsWith('dml_')) {
      targetSlug = t.replace('dml_', '');
      break;
    }
  }

  let matchedItem = null;

  if (targetSlug) {
    // We already have the exact slug, fetch details to get coverHash or stream
    const details = await fetchDramalarDetails(targetSlug);
    if (details && details.coverHash) {
      matchedItem = {
        title: details.title,
        coverHash: details.coverHash,
        slug: targetSlug
      };
    }
  }

  if (!matchedItem) {
    for (const t of allTitles) {
      const searchResults = await searchDramalar(t);
      if (searchResults.length > 0) {
        // Strict match
        for (const item of searchResults) {
          if (isStrictMediaTitleMatch(item.title, allTitles, 0.70)) {
            matchedItem = item;
            break;
          }
        }
        if (matchedItem) break;

        // Normalized match
        const normTarget = normalizeTitle(t);
        const best = searchResults.find(r => {
          const normR = normalizeTitle(r.title);
          return normR === normTarget || normR.includes(normTarget) || normTarget.includes(normR);
        });

        if (best) {
          matchedItem = best;
          break;
        }
      }
    }
  }

  if (!matchedItem || !matchedItem.coverHash) {
    // If we have a matchedItem without coverHash, try fetching details
    if (matchedItem?.slug) {
      const details = await fetchDramalarDetails(matchedItem.slug);
      if (details?.coverHash) {
        matchedItem.coverHash = details.coverHash;
      }
    }
  }

  if (!matchedItem || !matchedItem.coverHash) return [];

  const streamUrl = `https://cdn.dramalar.com/${matchedItem.coverHash}/${episodeNum}/index.m3u8`;

  const titleText = (matchedItem.title || '').toLowerCase();
  const sourceIsDub = titleText.includes('dublaj') || isDub === true;

  const label = sourceIsDub
    ? `🇹🇷 Dramalar VIP S${seasonNum}E${episodeNum} (TR Dublaj 1080p)`
    : `⚡ Dramalar VIP S${seasonNum}E${episodeNum} (TR Altyazı 1080p)`;

  return [{
    id: `dml_ep_${matchedItem.coverHash}_${seasonNum}_${episodeNum}`,
    name: label,
    displayName: label,
    badge: '👑 Dramalar VIP',
    source: 'Dramalar VIP',
    url: streamUrl,
    streamUrl: streamUrl,
    rawStreamUrl: streamUrl,
    quality: '1080p HD',
    isHls: true,
    isDirectVideo: true,
    priority: 1,
    getUrl: () => streamUrl
  }];
}
