/* ==========================================================================
   CinePulse Studio - FilmMakinesi Scraper Module
   Filmmakinesi.to embed provider - bypasses Cloudflare via user's browser.
   
   Strategy: Since filmmakinesi.to is behind Cloudflare JS challenge,
   we embed it as an iframe source. The user's browser handles the
   CF challenge automatically. We provide the filmmakinesi detail page
   URL based on TMDB data, and the site's player loads natively.
   
   URL Patterns:
   - Film: https://filmmakinesi.to/film/{slug}/
   - Dizi: https://filmmakinesi.to/dizi/{slug}/sezon-{s}/bolum-{e}/
   - Search/IMDB: https://filmmakinesi.to/arama/{imdbId}/
   ========================================================================== */

const FILMMAKINESI_BASE = 'https://filmmakinesi.to';
const TMDB_API_KEY = '4e44d9029b1270a757cddc766a1bcb63';

/**
 * Converts a title + year to a filmmakinesi-compatible URL slug.
 * filmmakinesi uses: lowercase-dash-separated-title-year format
 * Example: "Colony" (2025) -> "colony-2025"
 */
function toSlug(title, year) {
  if (!title) return '';
  let slug = title
    .toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's')
    .replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  
  if (year) {
    slug += `-${year}`;
  }
  return slug;
}

/**
 * Gets the IMDB ID for a TMDB entry to use in filmmakinesi search.
 */
async function getImdbId(type, tmdbId) {
  if (!tmdbId) return null;
  try {
    const endpoint = type === 'movie' 
      ? `https://api.themoviedb.org/3/movie/${tmdbId}/external_ids?api_key=${TMDB_API_KEY}`
      : `https://api.themoviedb.org/3/tv/${tmdbId}/external_ids?api_key=${TMDB_API_KEY}`;
    
    const res = await fetch(endpoint, { signal: AbortSignal.timeout(3000) });
    if (!res.ok) return null;
    const data = await res.json();
    return data.imdb_id || null;
  } catch {
    return null;
  }
}

/**
 * Generates filmmakinesi embed sources for a given title.
 * Returns iframe-based sources that the player can load directly.
 */
export async function fetchFilmMakinesiSources({
  type = 'movie',
  titles = [],
  title = '',
  seriesTitle = '',
  originalTitle = '',
  year = null,
  season = 1,
  episode = 1,
  tmdbId = null,
  isDub = false  // filmmakinesi is mostly subtitled content
}) {
  const isMovie = type === 'movie';
  const streams = [];

  try {
    // Get IMDB ID for search-based URL
    const imdbId = tmdbId ? await getImdbId(type, tmdbId) : null;

    // Build candidate slugs from available titles
    const candidateTitles = [
      ...(Array.isArray(titles) ? titles : []),
      title,
      seriesTitle,
      originalTitle
    ].filter(Boolean);

    const slugs = [...new Set(
      candidateTitles.map(t => toSlug(t.replace(/\s*\(\d{4}\).*/, '').trim(), year)).filter(Boolean)
    )];

    // Also try without year
    const slugsNoYear = [...new Set(
      candidateTitles.map(t => toSlug(t.replace(/\s*\(\d{4}\).*/, '').trim())).filter(Boolean)
    )];

    // Build potential filmmakinesi URLs
    const candidateUrls = [];

    // 1. IMDB search URL (most reliable)
    if (imdbId) {
      candidateUrls.push({
        url: `${FILMMAKINESI_BASE}/arama/${imdbId}/`,
        label: 'FilmMakinesi (IMDB)'
      });
    }

    // 2. Direct slug URLs (with year)
    for (const slug of slugs.slice(0, 2)) {
      if (isMovie) {
        candidateUrls.push({
          url: `${FILMMAKINESI_BASE}/film/${slug}/`,
          label: 'FilmMakinesi'
        });
      } else {
        candidateUrls.push({
          url: `${FILMMAKINESI_BASE}/dizi/${slug}/sezon-${season}/bolum-${episode}/`,
          label: 'FilmMakinesi'
        });
      }
    }

    // 3. Direct slug URLs (without year)
    for (const slug of slugsNoYear.slice(0, 2)) {
      if (isMovie) {
        candidateUrls.push({
          url: `${FILMMAKINESI_BASE}/film/${slug}/`,
          label: 'FilmMakinesi'
        });
      } else {
        candidateUrls.push({
          url: `${FILMMAKINESI_BASE}/dizi/${slug}/sezon-${season}/bolum-${episode}/`,
          label: 'FilmMakinesi'
        });
      }
    }

    // Deduplicate URLs
    const seen = new Set();
    const uniqueUrls = candidateUrls.filter(({ url }) => {
      if (seen.has(url)) return false;
      seen.add(url);
      return true;
    });

    // Add the best candidate as an iframe embed source
    // The first URL (IMDB-based) is most reliable
    if (uniqueUrls.length > 0) {
      const primary = uniqueUrls[0];
      
      streams.push({
        id: `fmk_primary_${isDub ? 'dub' : 'sub'}`,
        name: 'FilmMakinesi VIP',
        displayName: 'FilmMakinesi VIP',
        badge: isDub ? '⚡ TR Dublaj' : '💬 TR Altyazı',
        category: isDub ? 'dubbed' : 'subtitled',
        streamUrl: primary.url,
        url: primary.url,
        isHls: false,
        isDirectVideo: false,
        isEmbed: true,
        getUrl: () => primary.url
      });
    }

    return streams;
  } catch (err) {
    console.warn('[FilmMakinesiScraper] Error:', err);
    return [];
  }
}
