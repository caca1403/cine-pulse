/* ==========================================================================
   CinePulse Studio - TMDB API Metadata Service
   ========================================================================== */

const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEYS = [
  '4e44d9029b1270a757cddc766a1bcb63',
  'fa155f635119344d33fcb84fb807649b'
];

let activeKeyIndex = 0;

function getActiveApiKey() {
  return API_KEYS[activeKeyIndex];
}

function rotateApiKey() {
  activeKeyIndex = (activeKeyIndex + 1) % API_KEYS.length;
}

export const TMDB_IMAGE_SIZES = {
  POSTER_SMALL: 'https://image.tmdb.org/t/p/w342',
  POSTER_MEDIUM: 'https://image.tmdb.org/t/p/w500',
  BACKDROP_LARGE: 'https://image.tmdb.org/t/p/w1280',
  BACKDROP_ORIGINAL: 'https://image.tmdb.org/t/p/original',
  STILL_MEDIUM: 'https://image.tmdb.org/t/p/w300'
};

const rawPosterSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="750" viewBox="0 0 500 750"><rect width="500" height="750" fill="#0b0f19"/><circle cx="250" cy="300" r="160" fill="#f59e0b" opacity="0.25"/><g transform="translate(190, 230) scale(2.5)" fill="none" stroke="#f59e0b" stroke-width="2"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></g><text x="250" y="430" font-family="sans-serif" font-weight="800" font-size="30" fill="#ffffff" text-anchor="middle">Cine<tspan fill="#f59e0b">Pulse</tspan></text><text x="250" y="470" font-family="sans-serif" font-weight="500" font-size="16" fill="#64748b" text-anchor="middle">Görsel Yüklenemedi</text></svg>`;
export const SINEFLIX_POSTER_FALLBACK = `data:image/svg+xml,${encodeURIComponent(rawPosterSvg)}`;

const rawActorSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><circle cx="50" cy="50" r="50" fill="#1e293b"/><circle cx="50" cy="40" r="18" fill="#64748b"/><path d="M 20 85 C 20 65, 80 65, 80 85 Z" fill="#64748b"/></svg>`;
export const SINEFLIX_ACTOR_FALLBACK = `data:image/svg+xml,${encodeURIComponent(rawActorSvg)}`;

export function getImageUrl(path, size = TMDB_IMAGE_SIZES.POSTER_MEDIUM) {
  if (!path || path === 'null' || path === 'undefined' || path === '') return SINEFLIX_POSTER_FALLBACK;
  if (path.startsWith('http') || path.startsWith('data:')) return path;
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${size}${cleanPath}`;
}

const translationCache = {};
export async function translateToTurkish(text) {
  if (!text || text.trim().length === 0) return '';
  if (translationCache[text]) return translationCache[text];

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=tr&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data && data[0]) {
        const translatedStr = data[0].map(item => item[0]).join('');
        translationCache[text] = translatedStr;
        return translatedStr;
      }
    }
  } catch (err) {
    console.error('Translation error:', err);
  }
  return text;
}

async function tmdbFetch(endpoint, params = {}) {
  for (let attempt = 0; attempt < API_KEYS.length; attempt++) {
    try {
      const url = new URL(`${API_BASE_URL}${endpoint}`);
      url.searchParams.append('api_key', getActiveApiKey());

      for (let key in params) {
        if (params[key] !== undefined && params[key] !== null) {
          url.searchParams.append(key, params[key]);
        }
      }

      const response = await fetch(url.toString());
      if (response.ok) {
        return await response.json();
      } else {
        console.warn(`TMDB key ${getActiveApiKey()} failed (${response.status}). Rotating key...`);
        rotateApiKey();
      }
    } catch (err) {
      console.error(`Fetch error for ${endpoint}:`, err);
      rotateApiKey();
    }
  }
  return null;
}

export async function fetchTrending(type = 'all', timeWindow = 'week', page = 1) {
  const res = await tmdbFetch(`/trending/${type}/${timeWindow}`, { page, language: 'tr-TR' });
  return res && res.results ? res.results.filter(item => item.poster_path || item.backdrop_path) : [];
}

export async function fetchPopularSeries(page = 1) {
  const res = await tmdbFetch('/discover/tv', {
    sort_by: 'vote_count.desc',
    page,
    language: 'tr-TR'
  });
  return res && res.results
    ? res.results.filter(item => item.poster_path || item.backdrop_path).map(item => ({ ...item, type: 'tv', media_type: 'tv' }))
    : [];
}

export async function fetchPopularMovies(page = 1) {
  const res = await tmdbFetch('/discover/movie', {
    sort_by: 'vote_count.desc',
    page,
    language: 'tr-TR'
  });
  return res && res.results
    ? res.results.filter(item => item.poster_path || item.backdrop_path).map(item => ({ ...item, type: 'movie', media_type: 'movie' }))
    : [];
}

export async function fetchPopularAnime(page = 1) {
  const [tvRes, movieRes] = await Promise.all([
    tmdbFetch('/discover/tv', {
      sort_by: 'vote_count.desc',
      page,
      language: 'tr-TR',
      with_genres: '16',
      with_original_language: 'ja'
    }),
    tmdbFetch('/discover/movie', {
      sort_by: 'vote_count.desc',
      page,
      language: 'tr-TR',
      with_genres: '16',
      with_original_language: 'ja'
    })
  ]);

  const tvItems = (tvRes?.results || []).map(item => ({ ...item, type: 'tv', media_type: 'tv' }));
  const movieItems = (movieRes?.results || []).map(item => ({ ...item, type: 'movie', media_type: 'movie' }));
  const combined = [...tvItems, ...movieItems].sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0));
  return combined.filter(item => item.poster_path || item.backdrop_path);
}

export async function fetchPopularDocumentaries(page = 1) {
  const [tvRes, movieRes] = await Promise.all([
    tmdbFetch('/discover/tv', {
      sort_by: 'vote_count.desc',
      page,
      language: 'tr-TR',
      with_genres: '99'
    }),
    tmdbFetch('/discover/movie', {
      sort_by: 'vote_count.desc',
      page,
      language: 'tr-TR',
      with_genres: '99'
    })
  ]);

  const tvItems = (tvRes?.results || []).map(item => ({ ...item, type: 'tv', media_type: 'tv' }));
  const movieItems = (movieRes?.results || []).map(item => ({ ...item, type: 'movie', media_type: 'movie' }));
  const combined = [...tvItems, ...movieItems].sort((a, b) => (b.vote_count || 0) - (a.vote_count || 0));
  return combined.filter(item => item.poster_path || item.backdrop_path);
}

export async function fetchTopRated(type = 'tv', page = 1) {
  const res = await tmdbFetch(`/${type}/top_rated`, { page, language: 'tr-TR' });
  return res && res.results ? res.results.filter(item => item.poster_path || item.backdrop_path) : [];
}

export async function fetchDiscoverMedia({
  type = 'tv',
  genreId = null,
  page = 1,
  sortBy = 'popularity.desc',
  minRating = 0,
  isAnime = false,
  isDoc = false
}) {
  const params = {
    sort_by: sortBy,
    page,
    language: 'tr-TR'
  };

  if (genreId) params.with_genres = genreId;
  if (isAnime) {
    params.with_genres = '16';
    params.with_original_language = 'ja';
  }
  if (isDoc) {
    params.with_genres = '99';
  }

  if (minRating > 0) {
    params['vote_average.gte'] = minRating;
    params['vote_count.gte'] = 50; // Minimum 50 votes for quality ratings
  }

  const endpoint = type === 'movie' ? '/discover/movie' : '/discover/tv';
  const res = await tmdbFetch(endpoint, params);
  const items = res?.results || [];

  return items
    .filter(item => item.poster_path || item.backdrop_path)
    .map(item => ({
      ...item,
      type: type,
      media_type: type
    }));
}

export async function fetchByGenre(type = 'tv', genreId, page = 1, sortBy = 'popularity.desc') {
  return fetchDiscoverMedia({ type, genreId, page, sortBy });
}

export async function fetchMediaDetails(type = 'tv', id) {
  const res = await tmdbFetch(`/${type}/${id}`, {
    language: 'tr-TR',
    append_to_response: 'credits,videos,recommendations,similar'
  });
  if (!res) return null;

  // 1. Overview Fallback & Auto-Translation to Turkish
  let trOverview = (res.overview || '').trim();
  if (!trOverview || trOverview.length < 15) {
    try {
      const enRes = await tmdbFetch(`/${type}/${id}`, { language: 'en-US' });
      if (enRes && enRes.overview && enRes.overview.trim().length > 10) {
        const translated = await translateToTurkish(enRes.overview.trim());
        if (translated) {
          res.overview = translated;
        }
      }
    } catch (e) {
      console.warn('Overview translation fallback error:', e);
    }
  }

  // 2. Videos / Trailer Fallback
  let videosList = res.videos?.results || [];
  const hasYoutubeTrailer = videosList.some(v => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser'));
  if (!hasYoutubeTrailer) {
    try {
      const enVideos = await tmdbFetch(`/${type}/${id}/videos`, { language: 'en-US' });
      const extraVideos = enVideos?.results || [];
      if (extraVideos.length > 0) {
        res.videos = res.videos || {};
        res.videos.results = [...videosList, ...extraVideos];
      }
    } catch (_) {}
  }

  return res;
}

export async function fetchMediaTrailer(type = 'tv', id) {
  try {
    // 1. Try Turkish trailers first
    let res = await tmdbFetch(`/${type}/${id}/videos`, { language: 'tr-TR' });
    let videos = res?.results || [];
    let trailer = videos.find(v => v.site === 'YouTube' && v.type === 'Trailer');
    if (!trailer) trailer = videos.find(v => v.site === 'YouTube' && v.type === 'Teaser');

    // 2. Fallback to English/Global trailers
    if (!trailer) {
      const enRes = await tmdbFetch(`/${type}/${id}/videos`, { language: 'en-US' });
      const enVideos = enRes?.results || [];
      trailer = enVideos.find(v => v.site === 'YouTube' && v.type === 'Trailer');
      if (!trailer) trailer = enVideos.find(v => v.site === 'YouTube' && (v.type === 'Teaser' || v.type === 'Clip'));
      if (!trailer && enVideos.length > 0) trailer = enVideos.find(v => v.site === 'YouTube');
    }

    if (trailer && trailer.key) {
      return {
        key: trailer.key,
        name: trailer.name || 'Resmi Fragman',
        site: trailer.site,
        type: trailer.type,
        embedUrl: `https://www.youtube-nocookie.com/embed/${trailer.key}?autoplay=1&rel=0&modestbranding=1`,
        watchUrl: `https://www.youtube.com/watch?v=${trailer.key}`
      };
    }
  } catch (err) {
    console.error('fetchMediaTrailer error:', err);
  }
  return null;
}

export async function fetchSeasonDetails(tvId, seasonNumber = 1) {
  const trRes = await tmdbFetch(`/tv/${tvId}/season/${seasonNumber}`, { language: 'tr-TR' });
  if (!trRes || !trRes.episodes) return trRes;

  const enRes = await tmdbFetch(`/tv/${tvId}/season/${seasonNumber}`, { language: 'en-US' });

  await Promise.all(trRes.episodes.map(async (ep, idx) => {
    let overviewText = ep.overview ? ep.overview.trim() : '';

    if (!overviewText || overviewText.length < 5) {
      if (enRes && enRes.episodes && enRes.episodes[idx] && enRes.episodes[idx].overview) {
        overviewText = enRes.episodes[idx].overview;
      }
    }

    if (overviewText && (!ep.overview || ep.overview.length < 5)) {
      ep.overview = await translateToTurkish(overviewText);
    }
  }));

  return trRes;
}

export async function searchMulti(query, page = 1) {
  if (!query || !query.trim()) return [];
  const cleanQuery = query.trim();

  // 1. Search in Turkish
  const trRes = await tmdbFetch('/search/multi', { query: cleanQuery, page, language: 'tr-TR', include_adult: false });
  let items = trRes && trRes.results ? trRes.results : [];

  // 2. If results are few (< 5), query English to catch foreign titles
  if (items.length < 5) {
    const enRes = await tmdbFetch('/search/multi', { query: cleanQuery, page, language: 'en-US', include_adult: false });
    if (enRes && enRes.results) {
      const existingIds = new Set(items.map(i => i.id));
      for (const item of enRes.results) {
        if (!existingIds.has(item.id)) {
          items.push(item);
        }
      }
    }
  }

  return items.filter(item => (item.media_type === 'tv' || item.media_type === 'movie' || (!item.media_type && (item.title || item.name))) && (item.poster_path || item.backdrop_path));
}

export const GENRE_MAP_TV = {
  ACTION_ADVENTURE: 10759,
  ANIMATION: 16,
  COMEDY: 35,
  CRIME: 80,
  DOCUMENTARY: 99,
  DRAMA: 18,
  FAMILY: 10751,
  KIDS: 10762,
  MYSTERY: 9648,
  NEWS: 10763,
  REALITY: 10764,
  SCI_FI_FANTASY: 10765,
  SOAP: 10766,
  TALK: 10767,
  WAR_POLITICS: 10768,
  WESTERN: 37
};

export const GENRE_MAP_MOVIE = {
  ACTION: 28,
  ADVENTURE: 12,
  ANIMATION: 16,
  COMEDY: 35,
  CRIME: 80,
  DOCUMENTARY: 99,
  DRAMA: 18,
  FAMILY: 10751,
  FANTASY: 14,
  HISTORY: 36,
  HORROR: 27,
  MUSIC: 10402,
  MYSTERY: 9648,
  ROMANCE: 10749,
  SCI_FI: 878,
  TV_MOVIE: 10770,
  THRILLER: 53,
  WAR: 10752,
  WESTERN: 37
};
