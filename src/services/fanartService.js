/* Title-bearing landscape artwork from Fanart.tv. */

const artworkCache = new Map();
const SS_PREFIX = 'cp_fanart_thumb_v2_';

export async function getBestBackdrop(tmdbId, type = 'movie') {
  if (!/^\d+$/.test(String(tmdbId))) return null;
  const cacheKey = `${type === 'tv' ? 'tv' : 'movie'}:${tmdbId}`;
  if (artworkCache.has(cacheKey)) return artworkCache.get(cacheKey);

  try {
    const stored = sessionStorage.getItem(SS_PREFIX + cacheKey);
    if (stored !== null) {
      const result = stored ? JSON.parse(stored) : null;
      artworkCache.set(cacheKey, result);
      return result;
    }
  } catch (_) {}

  const request = (async () => {
    try {
      const response = await fetch(`/api/fanart?type=${type === 'tv' ? 'tv' : 'movie'}&id=${encodeURIComponent(tmdbId)}`, {
        signal: AbortSignal.timeout(8000)
      });
      if (!response.ok) return null;
      const data = await response.json();
      const artwork = data.image ? { image: data.image, logo: data.logo || null } : null;
      try { sessionStorage.setItem(SS_PREFIX + cacheKey, artwork ? JSON.stringify(artwork) : ''); } catch (_) {}
      return artwork;
    } catch (_) {
      return null;
    }
  })();
  artworkCache.set(cacheKey, request);
  const result = await request;
  artworkCache.set(cacheKey, result);
  return result;
}

export function prefetchBackdrops(items) {
  if (!Array.isArray(items)) return;
  items.forEach((item, index) => {
    if (!item?.id) return;
    const type = item.media_type === 'tv' || item.type === 'tv' ? 'tv' : 'movie';
    setTimeout(() => getBestBackdrop(item.id, type), index * 80);
  });
}
