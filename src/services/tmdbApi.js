/* ==========================================================================
   CinePulse Studio - TMDB API Metadata Service
   ========================================================================== */

import { registerAnimeId } from './storage.js';

const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEYS = [
  '4e44d9029b1270a757cddc766a1bcb63',
  '844dba0bfd8f3a4f3799f6130ef9e335'
];

let activeKeyIndex = 0;

function getActiveApiKey() {
  return API_KEYS[activeKeyIndex];
}

function rotateApiKey() {
  activeKeyIndex = (activeKeyIndex + 1) % API_KEYS.length;
}

export const TMDB_IMAGE_SIZES = {
  POSTER_SMALL: 'https://image.tmdb.org/t/p/w185',
  POSTER_MEDIUM: 'https://image.tmdb.org/t/p/w342', // Crisp Retina & 6x lighter than w500
  BACKDROP_LARGE: 'https://image.tmdb.org/t/p/w780',
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

  // Fully decode any nested URI encoding (e.g. /%2F%252F...acYXu4KaDj1NIkMgObnhe4C4a0T.jpg)
  let clean = path;
  try {
    while (clean.includes('%')) {
      const decoded = decodeURIComponent(clean);
      if (decoded === clean) break;
      clean = decoded;
    }
  } catch (e) {
    // If malformed URI, fallback
  }

  // Remove multiple leading slashes
  clean = clean.replace(/^\/+/, '/');
  if (!clean.startsWith('/')) clean = `/${clean}`;

  // If path somehow ended up without a filename or invalid
  if (clean === '/' || clean === '/null' || clean === '/undefined') return SINEFLIX_POSTER_FALLBACK;

  return `${size}${clean}`;
}

const translationCache = {};
export async function translateToTurkish(text) {
  if (!text || text.trim().length === 0) return '';
  if (translationCache[text]) return translationCache[text];

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=tr&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(1200) });
    if (res.ok) {
      const data = await res.json();
      if (data && data[0]) {
        const translatedStr = data[0].map(item => item[0]).join('');
        translationCache[text] = translatedStr;
        return translatedStr;
      }
    }
  } catch (err) {
    // Fail gracefully without blocking UI
  }
  return text;
}

const tmdbApiCache = new Map();
async function tmdbFetch(endpoint, params = {}) {
  const cacheKey = `${endpoint}_${JSON.stringify(params)}`;
  if (tmdbApiCache.has(cacheKey)) {
    return tmdbApiCache.get(cacheKey);
  }

  for (let attempt = 0; attempt < API_KEYS.length; attempt++) {
    try {
      const url = new URL(`${API_BASE_URL}${endpoint}`);
      url.searchParams.append('api_key', getActiveApiKey());

      for (let key in params) {
        if (params[key] !== undefined && params[key] !== null) {
          url.searchParams.append(key, params[key]);
        }
      }

      const response = await fetch(url.toString(), { signal: AbortSignal.timeout(6000) });
      if (response.ok) {
        const data = await response.json();
        tmdbApiCache.set(cacheKey, data);
        return data;
      } else {
        rotateApiKey();
      }
    } catch (err) {
      rotateApiKey();
    }
  }
  return null;
}

const BLOCKED_NETWORKS = new Set([
  64,   // Discovery Channel
  84,   // TLC
  4370  // DMAX
]);

const BLOCKED_GENRE_IDS = new Set([
  10764 // Reality TV
]);

const BLOCKED_TITLES = [
  'hayalet hikayeleri',
  'a haunting',
  'altin pesinde',
  'gold rush',
  'olumcul av',
  'deadliest catch',
  'hurda avcilari',
  'salvage hunters',
  'tamirat tadilat',
  'wheeler dealers',
  'agir yasamlar',
  'my 600-lb life',
  'evlilige 90 gun',
  '90 day fiance',
  'pasta ustalari',
  'cake boss',
  'agac ev ustalari',
  'treehouse masters',
  'alaska yi kurtarmak',
  'alaskayi kurtarmak',
  'alaska: the last frontier',
  'oto kurtarma kulubu',
  'fast n loud',
  'nehir canavarlari',
  'river monsters',
  'kupon delileri',
  'extreme couponing',
  'temizlik bagimlilari',
  'obsessive compulsive cleaners',
  'asiri cimriler',
  'extreme cheapskates',
  'restoran kurtarma',
  'depo savaslari',
  'storage wars',
  'gumruk kontrol',
  'border security',
  'nasil yapilir',
  'how it\'s made',
  'how its made',
  'dmax',
  'tlc'
];

const BLOCKED_IDS = new Set([3072, 34634, 3126, 45814, 1356, 45598, 61498, 59792, 29849, 23067, 44383, 44372]);

export function isBlockedContent(item) {
  if (!item) return true;
  if (item.id && BLOCKED_IDS.has(Number(item.id))) return true;

  // 1. Filter out by TMDB Genre (Reality 10764, Soap 10766, Talk 10767, News 10763)
  const genreIds = item.genre_ids || (Array.isArray(item.genres) ? item.genres.map(g => (typeof g === 'object' ? g.id : g)) : []);
  if (genreIds.some(id => BLOCKED_GENRE_IDS.has(Number(id)))) {
    return true;
  }

  // 2. Filter out by Network (Discovery, TLC, DMAX, HGTV, Food Network, Animal Planet)
  const networks = item.networks || [];
  if (Array.isArray(networks) && networks.some(n => BLOCKED_NETWORKS.has(Number(n.id || n)))) {
    return true;
  }

  // 3. Filter out by Title keywords
  const rawTitle = (item.title || item.name || item.original_title || item.original_name || '').toLowerCase()
    .replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ş/g, 's').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ç/g, 'c');

  for (const b of BLOCKED_TITLES) {
    if (rawTitle.includes(b)) return true;
  }

  return false;
}

export async function fetchTrending(type = 'all', timeWindow = 'week', page = 1) {
  const [trRes, enRes] = await Promise.all([
    tmdbFetch(`/trending/${type}/${timeWindow}`, { page, language: 'tr-TR' }),
    tmdbFetch(`/trending/${type}/${timeWindow}`, { page, language: 'en-US' })
  ]);
  if (!trRes || !trRes.results) return [];

  const enMap = new Map((enRes?.results || []).map(i => [i.id, i.overview]));

  return trRes.results
    .filter(item => (item.poster_path || item.backdrop_path) && !isBlockedContent(item))
    .map(item => {
      const isTv = item.media_type === 'tv' || !!item.first_air_date;
      const t = isTv ? 'tv' : 'movie';
      const overview = (item.overview || '').trim();
      const enOverview = (enMap.get(item.id) || '').trim();

      return {
        ...item,
        type: t,
        media_type: t,
        overview: overview || enOverview || generateCinematicOverview(item, t)
      };
    });
}

export async function fetchPopularSeries(page = 1) {
  // All-time most popular and acclaimed series (Game of Thrones, Breaking Bad, Stranger Things, Lucifer, etc.)
  const trRes = await tmdbFetch('/discover/tv', {
    sort_by: 'vote_count.desc',
    page,
    language: 'tr-TR',
    'vote_count.gte': 300,
    without_genres: '16' // anime is handled in anime section
  });
  if (!trRes || !trRes.results) return [];

  return trRes.results
    .filter(item => (item.poster_path || item.backdrop_path) && !isBlockedContent(item))
    .map(item => {
      const overview = (item.overview || '').trim();
      return {
        ...item,
        type: 'tv',
        media_type: 'tv',
        overview: overview || generateCinematicOverview(item, 'tv')
      };
    });
}

export async function fetchPopularMovies(page = 1) {
  // All-time most popular movies (Inception, Interstellar, The Dark Knight, Avatar, Avengers, Titanic, etc.)
  const trRes = await tmdbFetch('/discover/movie', {
    sort_by: 'vote_count.desc',
    page,
    language: 'tr-TR',
    'vote_count.gte': 500
  });
  if (!trRes || !trRes.results) return [];

  return trRes.results
    .filter(item => (item.poster_path || item.backdrop_path) && !isBlockedContent(item))
    .map(item => {
      const overview = (item.overview || '').trim();
      return {
        ...item,
        type: 'movie',
        media_type: 'movie',
        overview: overview || generateCinematicOverview(item, 'movie')
      };
    });
}

export function hasNonLatinCharacters(text) {
  if (!text) return false;
  // Detects Japanese, Chinese, Korean, Arabic, Cyrillic, Thai, etc.
  const nonLatinRegex = /[\u3040-\u30ff\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff\uff66-\uff9f\u1100-\u11ff\u3130-\u318f\ua960-\ua97f\ud7b0-\ud7ff\u0600-\u06ff\u0400-\u04ff\u0e00-\u0e7f]/;
  return nonLatinRegex.test(text);
}

export async function fetchPopularAnime(page = 1) {
  // All-time most popular anime (Attack on Titan, Death Note, Demon Slayer, Naruto, One Piece, etc.)
  const [trRes, enRes] = await Promise.all([
    tmdbFetch('/discover/tv', {
      sort_by: 'vote_count.desc',
      page,
      language: 'tr-TR',
      with_genres: '16',
      with_original_language: 'ja',
      'vote_count.gte': 50
    }),
    tmdbFetch('/discover/tv', {
      sort_by: 'vote_count.desc',
      page,
      language: 'en-US',
      with_genres: '16',
      with_original_language: 'ja',
      'vote_count.gte': 50
    })
  ]);
  if (!trRes || !trRes.results) return [];

  const enMap = new Map((enRes?.results || []).map(i => [i.id, i.name || i.title]));

  return trRes.results
    .filter(item => (item.poster_path || item.backdrop_path) && !isBlockedContent(item))
    .map(item => {
      let displayName = item.name || item.title || '';
      // If Turkish name is Japanese/Kanji or non-Latin, use the clean English/Romaji name
      if (!displayName || hasNonLatinCharacters(displayName)) {
        displayName = enMap.get(item.id) || item.original_name || item.original_title || displayName;
      }
      if (item.id) registerAnimeId(item.id);
      return {
        ...item,
        name: displayName,
        title: displayName,
        type: 'anime',
        media_type: 'anime',
        isAnime: true,
        isSeries: true,
        overview: item.overview || generateCinematicOverview(item, 'tv')
      };
    });
}

export async function fetchPopularDocumentaries(page = 1) {
  const movieRes = await tmdbFetch('/discover/movie', {
    sort_by: 'popularity.desc',
    page,
    language: 'tr-TR',
    with_genres: '99'
  });
  if (!movieRes || !movieRes.results) return [];

  return movieRes.results
    .filter(item => (item.poster_path || item.backdrop_path) && !isBlockedContent(item))
    .map(item => ({
      ...item,
      type: 'movie',
      media_type: 'movie',
      overview: item.overview || generateCinematicOverview(item, 'movie')
    }));
}

export async function fetchTopRated(type = 'tv', page = 1) {
  const [trRes, enRes] = await Promise.all([
    tmdbFetch(`/${type}/top_rated`, { page, language: 'tr-TR' }),
    tmdbFetch(`/${type}/top_rated`, { page, language: 'en-US' })
  ]);
  if (!trRes || !trRes.results) return [];

  const enMap = new Map((enRes?.results || []).map(i => [i.id, i.overview]));

  return Promise.all(
    trRes.results
      .filter(item => (item.poster_path || item.backdrop_path) && !isBlockedContent(item))
      .map(async (item) => {
        let overview = (item.overview || '').trim();
        const enOverview = (enMap.get(item.id) || '').trim();

        if (!overview || overview.length < 15) {
          if (enOverview && enOverview.length > 10) {
            overview = await translateToTurkish(enOverview);
          }
        }

        return {
          ...item,
          type,
          media_type: type,
          overview: overview || enOverview || generateCinematicOverview(item, type)
        };
      })
  );
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
    .filter(item => (item.poster_path || item.backdrop_path) && !isBlockedContent(item))
    .map(item => {
      if (isAnime && item.id) registerAnimeId(item.id);
      return {
        ...item,
        type: isAnime ? 'anime' : type,
        media_type: isAnime ? 'anime' : type,
        isAnime: isAnime,
        isSeries: type === 'tv'
      };
    });
}

export async function fetchByGenre(type = 'tv', genreId, page = 1, sortBy = 'popularity.desc') {
  return fetchDiscoverMedia({ type, genreId, page, sortBy });
}

export function generateCinematicOverview(media, type = 'tv') {
  if (!media) return 'Sürükleyici atmosferi ve zengin hikaye örgüsüyle izleyicileri ekran başına kilitleyen etkileyici bir yapım.';

  const title = media.title || media.name || 'Bu yapım';
  const isTv = type === 'tv' || media.media_type === 'tv' || !!media.first_air_date || (media.seasons && media.seasons.length > 0) || !!media.number_of_seasons;
  const kind = isTv ? 'dizi' : 'film';

  // 1. Genres
  let genreNames = [];
  if (Array.isArray(media.genres) && media.genres.length > 0) {
    genreNames = media.genres.map(g => (typeof g === 'string' ? g : g.name)).filter(Boolean);
  }
  const genreText = genreNames.length > 0 ? genreNames.slice(0, 3).join(', ') : (isTv ? 'Dram ve Gerilim' : 'Sinema');

  // 2. Year
  const rawDate = media.release_date || media.first_air_date || (media.year ? String(media.year) : '');
  const yearText = rawDate ? ` ${rawDate.slice(0, 4)} yılında izleyiciyle buluşan ve` : '';

  // 3. Rating
  const rating = Number(media.vote_average || media.rating || 0);
  const ratingText = rating > 0
    ? `IMDb'de ${rating.toFixed(1)}/10 gibi başarılı bir puana sahip olan`
    : 'Eleştirmenler ve izleyiciler tarafından büyük beğeni toplayan';

  // 4. Cast / Actors
  let castText = '';
  const castList = media.credits?.cast || [];
  if (castList.length > 0) {
    const topActors = castList.slice(0, 3).map(a => a.name).filter(Boolean).join(', ');
    if (topActors) {
      castText = ` Başrollerinde ${topActors} gibi başarılı isimlerin yer aldığı`;
    }
  }

  // 5. Creator / Director
  let directorText = '';
  const directors = media.credits?.crew?.filter(c => c.job === 'Director').map(d => d.name) || [];
  const creators = media.created_by?.map(c => c.name) || [];
  const keyPerson = directors[0] || creators[0];
  if (keyPerson) {
    directorText = ` ${keyPerson} imzalı`;
  }

  // 6. Tagline
  let taglineText = '';
  if (media.tagline && media.tagline.trim().length > 6) {
    taglineText = ` "${media.tagline.trim()}" temasıyla dikkat çeken yapım,`;
  }

  return `${title}, ${genreText} türünde öne çıkan${yearText}${directorText}${castText} etkileyici bir ${kind} deneyimi sunuyor.${taglineText} ${ratingText} yapım, beklenmedik ters köşeleri, derin karakter gelişimleri ve soluksuz temposuyla izleyenlere unutulmaz anlar vadediyor.`;
}

export async function fetchMediaDetails(type = 'tv', id) {
  const res = await tmdbFetch(`/${type}/${id}`, {
    append_to_response: 'credits,similar,recommendations,videos',
    language: 'tr-TR'
  });
  if (!res) return null;

  const isAnimeMedia = (res.original_language === 'ja' || (Array.isArray(res.origin_country) && res.origin_country.includes('JP'))) &&
    Array.isArray(res.genres) && res.genres.some(g => g.id === 16 || /anim/i.test(g.name));
  if (isAnimeMedia && res.id) {
    registerAnimeId(res.id);
  }

  // 1. Overview Fallback & Auto-Translation to Turkish
  let trOverview = (res.overview || '').trim();
  if (!trOverview || trOverview.length < 15) {
    try {
      const enRes = await tmdbFetch(`/${type}/${id}`, { language: 'en-US' });
      if (enRes && enRes.overview && enRes.overview.trim().length > 10) {
        const translated = await translateToTurkish(enRes.overview.trim());
        if (translated && translated.length > 15) {
          res.overview = translated;
        }
      }
    } catch (e) {
      console.warn('Overview translation fallback error:', e);
    }
  }

  // If overview is still missing or short, dynamically generate a rich cinematic synopsis!
  if (!res.overview || res.overview.trim().length < 15) {
    res.overview = generateCinematicOverview(res, type);
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
  const cleanQuery = query.trim().toLowerCase();

  // 1. Parallel search in Turkish and English to catch multi-language queries (e.g. "Demon Slayer" or "İblis Keser")
  const [trRes, enRes, tvRes] = await Promise.all([
    tmdbFetch('/search/multi', { query: cleanQuery, page, language: 'tr-TR', include_adult: false }),
    tmdbFetch('/search/multi', { query: cleanQuery, page, language: 'en-US', include_adult: false }),
    tmdbFetch('/search/tv', { query: cleanQuery, page, language: 'tr-TR', include_adult: false })
  ]);

  const itemsMap = new Map();

  const addItems = (list) => {
    if (!Array.isArray(list)) return;
    for (const item of list) {
      if (!item || !item.id) continue;
      if (!item.poster_path && !item.backdrop_path) continue;
      if (isBlockedContent(item)) continue;
      if (!itemsMap.has(item.id)) {
        const isTv = item.media_type === 'tv' || !!item.first_air_date || (item.name && !item.title);
        itemsMap.set(item.id, {
          ...item,
          type: isTv ? 'tv' : 'movie',
          media_type: isTv ? 'tv' : 'movie'
        });
      }
    }
  };

  addItems(trRes?.results);
  addItems(enRes?.results);
  addItems(tvRes?.results);

  const allResults = Array.from(itemsMap.values());

  // Smart relevance & popularity sorting
  allResults.sort((a, b) => {
    const titleA = (a.title || a.name || a.original_title || a.original_name || '').toLowerCase();
    const titleB = (b.title || b.name || b.original_title || b.original_name || '').toLowerCase();

    const exactA = titleA === cleanQuery ? 100 : (titleA.startsWith(cleanQuery) ? 50 : 0);
    const exactB = titleB === cleanQuery ? 100 : (titleB.startsWith(cleanQuery) ? 50 : 0);

    const scoreA = exactA + Math.min(100, (a.vote_count || 0) / 50) + (a.popularity || 0) * 0.5;
    const scoreB = exactB + Math.min(100, (b.vote_count || 0) / 50) + (b.popularity || 0) * 0.5;

    return scoreB - scoreA;
  });

  return allResults;
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
