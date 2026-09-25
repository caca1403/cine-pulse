/* ==========================================================================
   CinePulse Studio - Best Backdrop Service
   
   Fetches the highest-voted backdrop from TMDB's /images endpoint.
   Results cached in memory + sessionStorage to avoid repeated API calls.
   ========================================================================== */

const TMDB_API_KEY = '4e44d9029b1270a757cddc766a1bcb63';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w1280';

const backdropCache = new Map();
// Version the cache so previously selected textless backdrops are refreshed.
const SS_PREFIX = 'cp_fanart_v2_';

function getFromSession(key) {
  try { return sessionStorage.getItem(SS_PREFIX + key); } catch (_) { return null; }
}

function saveToSession(key, value) {
  try {
    if (value) sessionStorage.setItem(SS_PREFIX + key, value);
    else sessionStorage.removeItem(SS_PREFIX + key);
  } catch (_) {}
}

export async function getBestBackdrop(tmdbId, type = 'movie') {
  if (!tmdbId) return null;
  const cacheKey = `${type}:${tmdbId}`;

  if (backdropCache.has(cacheKey)) return backdropCache.get(cacheKey);

  const cached = getFromSession(cacheKey);
  if (cached !== null) {
    backdropCache.set(cacheKey, cached || null);
    return cached || null;
  }

  try {
    const endpoint = type === 'tv' ? 'tv' : 'movie';
    const res = await fetch(
      `https://api.themoviedb.org/3/${endpoint}/${tmdbId}/images?api_key=${TMDB_API_KEY}&include_image_language=null,en`,
      { signal: AbortSignal.timeout(4000) }
    );

    if (!res.ok) { backdropCache.set(cacheKey, null); saveToSession(cacheKey, ''); return null; }

    const data = await res.json();
    const backdrops = Array.isArray(data.backdrops) ? data.backdrops : [];

    if (backdrops.length === 0) { backdropCache.set(cacheKey, null); saveToSession(cacheKey, ''); return null; }

    // TMDB marks title-bearing landscape artwork with a language. Prefer the
    // original/English artwork; null-language images are usually plain stills.
    const titleArt = backdrops.filter(b => b.file_path && b.iso_639_1 === 'en' && (b.aspect_ratio || 0) > 1.5);
    const candidates = titleArt.length ? titleArt : backdrops.filter(b => b.file_path && (b.aspect_ratio || 0) > 1.5);
    candidates.sort((a, b) => {
      const diff = (b.vote_average || 0) - (a.vote_average || 0);
      return Math.abs(diff) > 0.3 ? diff : (b.vote_count || 0) - (a.vote_count || 0);
    });

    const best = candidates[0] || backdrops.find(b => b.file_path);
    if (!best?.file_path) { backdropCache.set(cacheKey, null); saveToSession(cacheKey, ''); return null; }

    const fullUrl = `${TMDB_IMAGE_BASE}${best.file_path}`;
    backdropCache.set(cacheKey, fullUrl);
    saveToSession(cacheKey, fullUrl);
    return fullUrl;
  } catch (_) {
    backdropCache.set(cacheKey, null);
    return null;
  }
}

export function prefetchBackdrops(items) {
  if (!Array.isArray(items)) return;
  items.forEach((item, i) => {
    if (!item?.id) return;
    const type = item.media_type === 'tv' || item.type === 'tv' ? 'tv' : 'movie';
    const cacheKey = `${type}:${item.id}`;
    if (backdropCache.has(cacheKey) || getFromSession(cacheKey) !== null) return;
    setTimeout(() => getBestBackdrop(item.id, type), i * 80);
  });
}
