/* ==========================================================================
   SineFlix Pro - Local Storage & Data Management Service (No-Backend)
   Handles watch history, timestamps, favorites, watchlist, item removal,
   watch analytics, remaining time, and JSON Export/Import
   ========================================================================== */

const STORAGE_KEYS = {
  WATCH_HISTORY: 'sineflix_watch_history_v1',
  FAVORITES: 'sineflix_favorites_v1',
  WATCHLIST: 'sineflix_watchlist_v1',
  USER_SETTINGS: 'sineflix_user_settings_v1'
};

let _watchHistoryCache = null;
let _progressMapCache = null;
let _favoritesCache = null;
let _watchlistCache = null;

function clearStorageCache() {
  _watchHistoryCache = null;
  _progressMapCache = null;
  _favoritesCache = null;
  _watchlistCache = null;
}

function getLocalItem(key, defaultValue = []) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return defaultValue;
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : defaultValue;
  } catch (err) {
    return defaultValue;
  }
}

function setLocalItem(key, value) {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return;
    localStorage.setItem(key, JSON.stringify(value));
    clearStorageCache();
    window.dispatchEvent(new CustomEvent('sineflix_data_changed', { detail: { key, value } }));
  } catch (err) {
    console.error(`Error saving ${key} to localStorage:`, err);
  }
}

/* ==========================================================================
   Watch History & Progress Management
   ========================================================================== */

export function getWatchHistory() {
  if (_watchHistoryCache) return _watchHistoryCache;
  const history = getLocalItem(STORAGE_KEYS.WATCH_HISTORY, []);
  _watchHistoryCache = history.sort((a, b) => (b.lastWatchedAt || 0) - (a.lastWatchedAt || 0));
  return _watchHistoryCache;
}

function getProgressMap() {
  if (_progressMapCache) return _progressMapCache;
  const history = getWatchHistory();
  _progressMapCache = new Map();
  for (let i = 0; i < history.length; i++) {
    const item = history[i];
    const key = `${item.id}_${item.season || 1}_${item.episode || 1}`;
    if (!_progressMapCache.has(key)) {
      _progressMapCache.set(key, item);
    }
  }
  return _progressMapCache;
}

function cleanImagePath(p) {
  if (!p || typeof p !== 'string') return '';
  let clean = p.replace(/^(undefined|null|\/undefined|\/null)$/i, '');
  if (!clean || clean.startsWith('data:') || clean.startsWith('http')) return clean;

  try {
    while (clean.includes('%')) {
      const decoded = decodeURIComponent(clean);
      if (decoded === clean) break;
      clean = decoded;
    }
  } catch (e) {}

  clean = clean.replace(/^\/+/, '/');
  if (!clean.startsWith('/')) clean = `/${clean}`;
  if (clean === '/' || clean === '/null' || clean === '/undefined') return '';
  return clean;
}

function resolveMediaImages(id, passedPoster, passedBackdrop, history = []) {
  const anyExisting = history.find(item => item.id == id && (item.posterPath || item.poster_path));
  let rawPoster = passedPoster || (anyExisting ? (anyExisting.posterPath || anyExisting.poster_path) : '');
  let rawBackdrop = passedBackdrop || (anyExisting ? (anyExisting.backdropPath || anyExisting.backdrop_path) : '');

  const resolvedPoster = cleanImagePath(rawPoster);
  const resolvedBackdrop = cleanImagePath(rawBackdrop);

  return { resolvedPoster: resolvedPoster || '', resolvedBackdrop: resolvedBackdrop || '' };
}

export function saveWatchProgress({
  id,
  title,
  posterPath,
  poster_path,
  backdropPath,
  backdrop_path,
  type,
  season = 1,
  episode = 1,
  currentTime = 0,
  duration = 0,
  completed = false,
  ...rest
}) {
  if (!id) return;

  const history = getWatchHistory();
  const existingIndex = history.findIndex(item => item.id == id && item.season == season && item.episode == episode);
  const anyExisting = history.find(item => item.id == id);
  
  // Resolve type safely: if type is passed, use it; otherwise fallback to existing record, or infer
  let resolvedType = type;
  if (!resolvedType) {
    if (existingIndex >= 0 && history[existingIndex].type) {
      resolvedType = history[existingIndex].type;
    } else if (anyExisting && anyExisting.type) {
      resolvedType = anyExisting.type;
    } else if (rest.first_air_date || rest.number_of_seasons || rest.episodesCount) {
      resolvedType = 'tv';
    } else {
      resolvedType = 'movie';
    }
  }

  const { resolvedPoster, resolvedBackdrop } = resolveMediaImages(
    id,
    posterPath || poster_path,
    backdropPath || backdrop_path,
    history
  );

  const effectiveDuration = duration > 0 ? duration : (resolvedType === 'movie' ? 6600 : 3000);
  const progressPercent = effectiveDuration > 0 ? Math.min(100, Math.round((currentTime / effectiveDuration) * 100)) : 0;
  const isCompleted = completed || progressPercent >= 90;

  const record = {
    ...rest,
    id,
    title: title || (existingIndex >= 0 ? history[existingIndex].title : (anyExisting ? anyExisting.title : 'İçerik')),
    posterPath: resolvedPoster,
    poster_path: resolvedPoster,
    backdropPath: resolvedBackdrop,
    backdrop_path: resolvedBackdrop,
    type: resolvedType,
    season: Number(season),
    episode: Number(episode),
    currentTime: Math.round(currentTime),
    duration: Math.round(effectiveDuration),
    progressPercent,
    completed: isCompleted,
    lastWatchedAt: Date.now()
  };

  if (existingIndex >= 0) {
    history[existingIndex] = record;
  } else {
    history.push(record);
  }

  setLocalItem(STORAGE_KEYS.WATCH_HISTORY, history);
}

export function removeWatchHistoryItem(id, season = 1, episode = 1) {
  let history = getWatchHistory();
  history = history.filter(item => !(item.id == id && item.season == season && item.episode == episode));
  setLocalItem(STORAGE_KEYS.WATCH_HISTORY, history);
}

export function removeSeriesFromHistory(id) {
  let history = getWatchHistory();
  history = history.filter(item => item.id != id);
  setLocalItem(STORAGE_KEYS.WATCH_HISTORY, history);
}

export function clearCompletedHistory() {
  let history = getWatchHistory();
  history = history.filter(item => !item.completed && item.progressPercent < 90);
  setLocalItem(STORAGE_KEYS.WATCH_HISTORY, history);
}

export function getMediaProgress(id, season = 1, episode = 1) {
  const map = getProgressMap();
  return map.get(`${id}_${season}_${episode}`) || null;
}

export function isMediaWatched(id, season = 1, episode = 1) {
  const progress = getMediaProgress(id, season, episode);
  return !!(progress && (progress.completed || progress.progressPercent >= 90));
}

export function markEpisodeWatched(id, season = 1, episode = 1, completed = true, mediaData = {}) {
  const history = getWatchHistory();
  const existingIndex = history.findIndex(item => item.id == id && item.season == season && item.episode == episode);
  const isMovie = (mediaData.type === 'movie');
  const duration = mediaData.duration || (isMovie ? 6600 : 3000);

  const { resolvedPoster, resolvedBackdrop } = resolveMediaImages(
    id,
    mediaData.posterPath || mediaData.poster_path,
    mediaData.backdropPath || mediaData.backdrop_path,
    history
  );

  const record = {
    id,
    title: mediaData.title || (existingIndex >= 0 ? history[existingIndex].title : 'İçerik'),
    posterPath: resolvedPoster,
    poster_path: resolvedPoster,
    backdropPath: resolvedBackdrop,
    backdrop_path: resolvedBackdrop,
    type: mediaData.type || (existingIndex >= 0 ? history[existingIndex].type : 'tv'),
    season: Number(season),
    episode: Number(episode),
    currentTime: completed ? duration : 0,
    duration: duration,
    progressPercent: completed ? 100 : 0,
    completed: !!completed,
    lastWatchedAt: Date.now()
  };

  if (existingIndex >= 0) {
    history[existingIndex] = record;
  } else {
    history.push(record);
  }

  setLocalItem(STORAGE_KEYS.WATCH_HISTORY, history);
}

export function markMediaWatched(id, completed = true, mediaData = {}) {
  markEpisodeWatched(id, 1, 1, completed, { ...mediaData, type: mediaData.type || 'movie' });
}

export function toggleEpisodeWatched(id, season = 1, episode = 1, mediaData = {}) {
  const isCurrentlyWatched = isMediaWatched(id, season, episode);
  markEpisodeWatched(id, season, episode, !isCurrentlyWatched, mediaData);
  return { completed: !isCurrentlyWatched };
}

export function markAllEpisodesWatched(seriesId, seasonsList = [], completed = true, mediaData = {}) {
  const history = getWatchHistory();
  const title = mediaData.title || 'Dizi';
  const type = mediaData.type || 'tv';
  const duration = mediaData.duration || (type === 'movie' ? 6600 : 3000);

  const { resolvedPoster, resolvedBackdrop } = resolveMediaImages(
    seriesId,
    mediaData.posterPath || mediaData.poster_path,
    mediaData.backdropPath || mediaData.backdrop_path,
    history
  );

  for (const season of seasonsList) {
    const seasonNum = season.season_number;
    if (seasonNum === 0 && seasonsList.length > 1) continue;
    const count = season.episode_count || 10;
    for (let ep = 1; ep <= count; ep++) {
      const existingIndex = history.findIndex(item => item.id == seriesId && item.season == seasonNum && item.episode == ep);
      const record = {
        id: seriesId,
        title,
        posterPath: resolvedPoster,
        poster_path: resolvedPoster,
        backdropPath: resolvedBackdrop,
        backdrop_path: resolvedBackdrop,
        type,
        season: Number(seasonNum),
        episode: ep,
        currentTime: completed ? duration : 0,
        duration: duration,
        progressPercent: completed ? 100 : 0,
        completed: !!completed,
        lastWatchedAt: Date.now()
      };
      if (existingIndex >= 0) {
        history[existingIndex] = record;
      } else {
        history.push(record);
      }
    }
  }
  setLocalItem(STORAGE_KEYS.WATCH_HISTORY, history);
}

export function markSeasonEpisodesWatched(seriesId, seasonNum, episodeCount = 10, completed = true, mediaData = {}) {
  const history = getWatchHistory();
  const title = mediaData.title || 'Dizi';
  const type = mediaData.type || 'tv';
  const duration = mediaData.duration || 3000;

  const { resolvedPoster, resolvedBackdrop } = resolveMediaImages(
    seriesId,
    mediaData.posterPath || mediaData.poster_path,
    mediaData.backdropPath || mediaData.backdrop_path,
    history
  );

  for (let ep = 1; ep <= episodeCount; ep++) {
    const existingIndex = history.findIndex(item => item.id == seriesId && item.season == seasonNum && item.episode == ep);
    const record = {
      id: seriesId,
      title,
      posterPath: resolvedPoster,
      poster_path: resolvedPoster,
      backdropPath: resolvedBackdrop,
      backdrop_path: resolvedBackdrop,
      type,
      season: Number(seasonNum),
      episode: ep,
      currentTime: completed ? duration : 0,
      duration: duration,
      progressPercent: completed ? 100 : 0,
      completed: !!completed,
      lastWatchedAt: Date.now()
    };
    if (existingIndex >= 0) {
      history[existingIndex] = record;
    } else {
      history.push(record);
    }
  }
  setLocalItem(STORAGE_KEYS.WATCH_HISTORY, history);
}

export function isEntireSeriesWatched(seriesId, seasonsList = []) {
  if (!seasonsList || seasonsList.length === 0) {
    return isMediaWatched(seriesId, 1, 1);
  }
  const history = getWatchHistory();
  for (const season of seasonsList) {
    const seasonNum = season.season_number;
    if (seasonNum === 0 && seasonsList.length > 1) continue;
    const count = season.episode_count || 1;
    for (let ep = 1; ep <= count; ep++) {
      const item = history.find(r => r.id == seriesId && r.season == seasonNum && r.episode == ep);
      if (!item || (!item.completed && item.progressPercent < 90)) {
        return false;
      }
    }
  }
  return true;
}

export function isSeasonFullyWatched(seriesId, seasonNum, episodeCount = 10) {
  const history = getWatchHistory();
  for (let ep = 1; ep <= episodeCount; ep++) {
    const item = history.find(r => r.id == seriesId && r.season == seasonNum && r.episode == ep);
    if (!item || (!item.completed && item.progressPercent < 90)) {
      return false;
    }
  }
  return true;
}

export function setMediaHalfway(id, season = 1, episode = 1, currentTime = 1500, mediaData = {}) {
  const isMovie = (mediaData.type === 'movie');
  const duration = mediaData.duration || (isMovie ? 6600 : 3000);
  const time = currentTime || Math.round(duration * 0.5);

  return saveWatchProgress({
    id,
    title: mediaData.title || 'İçerik',
    posterPath: mediaData.posterPath || mediaData.poster_path || '',
    backdropPath: mediaData.backdropPath || mediaData.backdrop_path || '',
    type: mediaData.type || (isMovie ? 'movie' : 'tv'),
    season,
    episode,
    currentTime: time,
    duration,
    completed: false
  });
}

export function getLastWatchedEpisode(seriesId) {
  const history = getWatchHistory();
  const seriesItems = history.filter(item => item.id == seriesId);
  return seriesItems.length > 0 ? seriesItems[0] : null;
}

export function formatSecondsToTime(seconds) {
  if (!seconds || seconds <= 0) return '';
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
  if (min >= 60) {
    const hrs = Math.floor(min / 60);
    const remMin = min % 60;
    return `${hrs}sa ${remMin > 0 ? remMin + 'dk' : ''}`;
  }
  return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

export function formatRemainingTime(currentTime, duration) {
  if (!duration || duration <= 0) duration = 3000;
  const remaining = Math.max(0, duration - (currentTime || 0));
  const remMin = Math.round(remaining / 60);
  if (remMin <= 0) return 'Bitti';
  if (remMin >= 60) {
    const hrs = Math.floor(remMin / 60);
    const m = remMin % 60;
    return `${hrs}sa ${m > 0 ? m + 'dk' : ''} kaldı`;
  }
  return `${remMin} dk kaldı`;
}

export function formatTotalWatchTime(totalSeconds) {
  if (!totalSeconds || totalSeconds <= 0) return '0 dakika';
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  const parts = [];
  if (days > 0) parts.push(`${days} gün`);
  if (hours > 0) parts.push(`${hours} saat`);
  if (minutes > 0 || parts.length === 0) parts.push(`${minutes} dk`);
  return parts.join(' ');
}

export function getTotalWatchStats() {
  const history = getWatchHistory();
  let totalSeconds = 0;
  let moviesCount = 0;
  let episodesCount = 0;

  for (const item of history) {
    const isMovie = item.type === 'movie';
    const itemDuration = item.duration || (isMovie ? 6600 : 3000);

    if (item.completed) {
      totalSeconds += itemDuration;
    } else if (item.currentTime > 0) {
      totalSeconds += item.currentTime;
    }

    if (isMovie) {
      if (item.completed || item.progressPercent >= 50) moviesCount++;
    } else {
      if (item.completed || item.progressPercent >= 50) episodesCount++;
    }
  }

  return {
    totalSeconds,
    totalMinutes: Math.floor(totalSeconds / 60),
    totalHours: (totalSeconds / 3600).toFixed(1),
    formattedTotalTime: formatTotalWatchTime(totalSeconds),
    moviesCount,
    episodesCount,
    totalEntries: history.length
  };
}

const KNOWN_ANIME_KEYWORDS = [
  'anime', 'kimetsu', 'yaiba', 'iblis keser', 'demon slayer', 'naruto', 'boruto', 'shingeki', 'titan',
  'jujutsu', 'kaisen', 'one piece', 'death note', 'bleach', 'dragon ball', 'hunter x hunter', 'chainsaw man',
  'tokyo ghoul', 'my hero academia', 'boku no hero', 'fullmetal', 'alchemist', 'sword art online', 'solo leveling',
  'black clover', 'vinland saga', 'spy x family', 'cyberpunk: edgerunners', 'haikyuu', 'one punch', 'berserk',
  'mob psycho', 'overlord', 'evangelion', 'cowboy bebop', 'code geass', 'frieren', 'dr. stone', 'blue lock',
  'steins;gate', 'jojo', 'kaiju no. 8', 'gintama', 'fairy tail', 'violet evergarden', 'hell\'s paradise'
];

function isAnimeRecord(item) {
  if (!item) return false;
  if (item.type === 'anime' || item.media_type === 'anime' || item.isAnime) return true;
  const genreIds = item.genre_ids || (Array.isArray(item.genres) ? item.genres.map(g => (typeof g === 'object' ? g.id : g)) : []);
  const hasAnimation = genreIds.some(id => Number(id) === 16);
  const isJapanese = item.original_language === 'ja' || (Array.isArray(item.origin_country) && item.origin_country.includes('JP'));
  if (hasAnimation && isJapanese) return true;
  if (hasAnimation && (item.origin_country?.includes('JP') || item.original_language === 'ja')) return true;
  if (Array.isArray(item.genres)) {
    const genreNames = item.genres.map(g => (typeof g === 'object' ? g.name : String(g))).filter(Boolean);
    if (genreNames.some(n => /anime/i.test(n))) return true;
  }
  if (typeof item.id === 'string' && (item.id.startsWith('ta_') || item.id.startsWith('acx_') || item.id.startsWith('tra_'))) {
    return true;
  }
  const rawTitle = (item.title || item.name || item.original_title || item.original_name || '').toLowerCase();
  for (const kw of KNOWN_ANIME_KEYWORDS) {
    if (rawTitle.includes(kw)) return true;
  }
  return false;
}

function isMovieRecord(item) {
  if (!item) return true;
  if (item.type === 'movie' || item.media_type === 'movie') return true;
  if (item.first_air_date || item.number_of_seasons || item.episodesCount || (Array.isArray(item.seasons) && item.seasons.length > 0)) return false;
  if (item.type === 'tv' || item.media_type === 'tv') return false;
  if (item.release_date && !item.first_air_date) return true;
  return false;
}

export function getContinueWatchingList() {
  const history = getWatchHistory();
  const seriesMap = new Map();

  for (const item of history) {
    const id = item.id;
    if (!seriesMap.has(id)) {
      seriesMap.set(id, []);
    }
    seriesMap.get(id).push(item);
  }

  const inProgressList = [];

  for (const [id, records] of seriesMap.entries()) {
    records.sort((a, b) => (b.lastWatchedAt || 0) - (a.lastWatchedAt || 0));
    const firstRecord = records[0];
    const isAnime = isAnimeRecord(firstRecord);
    const isMovie = isMovieRecord(firstRecord);

    if (isMovie) {
      const isCompleted = firstRecord.completed || firstRecord.progressPercent >= 90;
      // Exclude completed movies from Continue Watching!
      if (isCompleted) continue;

      if (firstRecord.currentTime > 0) {
        const duration = firstRecord.duration || 6600;
        const remStr = formatRemainingTime(firstRecord.currentTime, duration);
        const prefix = isAnime ? 'Anime Filmi • ' : '';

        inProgressList.push({
          ...firstRecord,
          type: isAnime ? 'anime' : 'movie',
          subtitle: `${prefix}Kaldığın: ${formatSecondsToTime(firstRecord.currentTime)} • ${remStr}`
        });
      }
    } else {
      const watchedEpNumbers = new Set();
      let currentActiveSeason = firstRecord.season || 1;

      for (const rec of records) {
        if (rec.season === currentActiveSeason && (rec.completed || rec.progressPercent >= 85)) {
          watchedEpNumbers.add(rec.episode);
        }
      }

      let targetEp = 1;
      const maxPossibleEp = records.length + 50;
      while (watchedEpNumbers.has(targetEp) && targetEp <= maxPossibleEp) {
        targetEp++;
      }

      const currentInProg = records.find(r => r.season === currentActiveSeason && r.episode === targetEp);
      const isCurrentEpHalfway = currentInProg && !currentInProg.completed && currentInProg.currentTime > 0;
      const currentEpTime = isCurrentEpHalfway ? currentInProg.currentTime : (firstRecord.currentTime || 0);
      const epDuration = (currentInProg ? currentInProg.duration : firstRecord.duration) || 3000;
      const remStr = formatRemainingTime(currentEpTime, epDuration);

      // If all recorded episodes are finished and not marked as halfway, exclude from continue watching
      const allWatched = records.every(r => r.completed || r.progressPercent >= 85);
      if (allWatched && !isCurrentEpHalfway) {
        continue;
      }

      const prefix = isAnime ? 'Anime Dizisi • ' : '';
      let subtitle = '';
      if (isCurrentEpHalfway) {
        subtitle = `${prefix}S${currentActiveSeason} B${targetEp} • Kaldığın: ${formatSecondsToTime(currentEpTime)} • ${remStr}`;
      } else if (watchedEpNumbers.size > 0) {
        subtitle = `${prefix}S${currentActiveSeason} B${targetEp} • Sıradaki Bölüm`;
      } else if (firstRecord.currentTime > 0) {
        subtitle = `${prefix}S${currentActiveSeason} B${firstRecord.episode || 1} • Kaldığın: ${formatSecondsToTime(firstRecord.currentTime)}`;
      } else {
        continue;
      }

      inProgressList.push({
        ...firstRecord,
        type: isAnime ? 'anime' : 'tv',
        season: currentActiveSeason,
        episode: isCurrentEpHalfway ? targetEp : (watchedEpNumbers.size > 0 ? targetEp : firstRecord.episode || 1),
        currentTime: isCurrentEpHalfway ? currentEpTime : (watchedEpNumbers.size > 0 ? 0 : firstRecord.currentTime),
        subtitle
      });
    }
  }

  inProgressList.sort((a, b) => (b.lastWatchedAt || 0) - (a.lastWatchedAt || 0));
  return inProgressList;
}

export function getCompletedWatchList() {
  const history = getWatchHistory();
  const seriesMap = new Map();

  for (const item of history) {
    const id = item.id;
    if (!seriesMap.has(id)) {
      seriesMap.set(id, []);
    }
    seriesMap.get(id).push(item);
  }

  const completedList = [];

  for (const [id, records] of seriesMap.entries()) {
    records.sort((a, b) => (b.lastWatchedAt || 0) - (a.lastWatchedAt || 0));
    const firstRecord = records[0];
    const isAnime = isAnimeRecord(firstRecord);
    const isMovie = isMovieRecord(firstRecord);

    if (isMovie) {
      const isCompleted = firstRecord.completed || firstRecord.progressPercent >= 90;
      if (isCompleted) {
        completedList.push({
          ...firstRecord,
          type: isAnime ? 'anime' : 'movie',
          completed: true,
          subtitle: isAnime ? '✓ Anime Filmi İzlendi' : '✓ Film İzlendi'
        });
      }
    } else {
      const allCompleted = records.every(r => r.completed || r.progressPercent >= 85);
      if (allCompleted && records.length > 0) {
        completedList.push({
          ...firstRecord,
          type: isAnime ? 'anime' : 'tv',
          completed: true,
          subtitle: isAnime ? `✓ ${records.length} Bölüm Anime İzlendi` : `✓ ${records.length} Bölüm İzlendi`
        });
      }
    }
  }

  completedList.sort((a, b) => (b.lastWatchedAt || 0) - (a.lastWatchedAt || 0));
  return completedList;
}

export function getGroupedWatchHistory() {
  const history = getWatchHistory();
  const seriesMap = new Map();

  for (const item of history) {
    const id = item.id;
    if (!seriesMap.has(id)) {
      seriesMap.set(id, []);
    }
    seriesMap.get(id).push(item);
  }

  const grouped = [];
  for (const [id, records] of seriesMap.entries()) {
    records.sort((a, b) => (b.lastWatchedAt || 0) - (a.lastWatchedAt || 0));
    const latest = records[0];
    const isAnime = isAnimeRecord(latest);
    const isMovie = isMovieRecord(latest);
    const resolvedType = isAnime ? 'anime' : (isMovie ? 'movie' : 'tv');

    if (isMovie) {
      const badgePrefix = isAnime ? 'Anime Filmi • ' : '';
      grouped.push({
        ...latest,
        type: resolvedType,
        subtitle: latest.completed ? `✓ ${badgePrefix}İzlendi` : (latest.progressPercent > 0 ? `${badgePrefix}%${latest.progressPercent} İzlendi` : badgePrefix.replace(' • ', ''))
      });
    } else {
      const watchedCount = records.filter(r => r.completed || r.progressPercent >= 85).length;
      const badgePrefix = isAnime ? 'Anime Dizisi • ' : '';
      grouped.push({
        ...latest,
        type: resolvedType,
        subtitle: watchedCount > 0 ? `${badgePrefix}${watchedCount} Bölüm İzlendi` : `${badgePrefix}S${latest.season || 1} B${latest.episode || 1}`
      });
    }
  }

  grouped.sort((a, b) => (b.lastWatchedAt || 0) - (a.lastWatchedAt || 0));
  return grouped;
}

export function getUnifiedContinueWatching() {
  return getContinueWatchingList();
}

/* ==========================================================================
   Favorites & Watchlist Management & Auto-Normalization
   ========================================================================== */

export function normalizeStoredItem(item) {
  if (!item) return item;
  let type = item.type;
  
  if (isAnimeRecord(item)) {
    type = 'anime';
  } else if (!type || type === 'movie') {
    if (
      item.first_air_date ||
      item.media_type === 'tv' ||
      item.number_of_seasons ||
      item.episodesCount ||
      (!item.title && item.name)
    ) {
      type = 'tv';
    } else {
      type = type || 'movie';
    }
  }
  const poster = cleanImagePath(item.poster_path || item.posterPath || item.poster || '');
  const backdrop = cleanImagePath(item.backdrop_path || item.backdropPath || item.backdrop || '');
  return {
    ...item,
    type,
    poster_path: poster,
    posterPath: poster,
    backdrop_path: backdrop,
    backdropPath: backdrop
  };
}

export function getFavorites() {
  const favs = getLocalItem(STORAGE_KEYS.FAVORITES, []);
  return favs.map(normalizeStoredItem);
}

export function isFavorite(id) {
  const favs = getFavorites();
  return favs.some(item => item.id == id);
}

export function toggleFavorite(media) {
  if (!media || !media.id) return false;
  let favs = getFavorites();
  const index = favs.findIndex(item => item.id == media.id);
  let added = false;

  if (index >= 0) {
    favs.splice(index, 1);
  } else {
    let resolvedType = media.type;
    if (isAnimeRecord(media)) {
      resolvedType = 'anime';
    } else if (!resolvedType) {
      resolvedType = (media.first_air_date || media.media_type === 'tv' || media.number_of_seasons || (!media.title && media.name)) ? 'tv' : 'movie';
    }
    const poster = media.poster_path || media.posterPath || media.poster || '';
    const backdrop = media.backdrop_path || media.backdropPath || media.backdrop || '';

    favs.unshift({
      id: media.id,
      title: media.title || media.name || 'İsimsiz',
      poster_path: poster,
      posterPath: poster,
      backdrop_path: backdrop,
      backdropPath: backdrop,
      vote_average: media.vote_average || media.voteAverage || 8.0,
      release_date: media.release_date || media.first_air_date || '',
      first_air_date: media.first_air_date || '',
      genre_ids: media.genre_ids || (Array.isArray(media.genres) ? media.genres.map(g => (typeof g === 'object' ? g.id : g)) : []),
      genres: media.genres || [],
      original_language: media.original_language || '',
      origin_country: media.origin_country || [],
      isAnime: isAnimeRecord(media),
      type: resolvedType,
      addedAt: Date.now()
    });
    added = true;
  }

  setLocalItem(STORAGE_KEYS.FAVORITES, favs);
  return added;
}

export function removeFavorite(id) {
  let favs = getFavorites();
  favs = favs.filter(item => item.id != id);
  setLocalItem(STORAGE_KEYS.FAVORITES, favs);
  return favs;
}

export function clearFavorites() {
  setLocalItem(STORAGE_KEYS.FAVORITES, []);
}

export function getWatchlist() {
  const list = getLocalItem(STORAGE_KEYS.WATCHLIST, []);
  return list.map(normalizeStoredItem);
}

export function isWatchlist(id) {
  const list = getWatchlist();
  return list.some(item => item.id == id);
}

export function toggleWatchlist(media) {
  if (!media || !media.id) return false;
  let list = getWatchlist();
  const index = list.findIndex(item => item.id == media.id);
  let added = false;

  if (index >= 0) {
    list.splice(index, 1);
  } else {
    let resolvedType = media.type;
    if (isAnimeRecord(media)) {
      resolvedType = 'anime';
    } else if (!resolvedType) {
      resolvedType = (media.first_air_date || media.media_type === 'tv' || media.number_of_seasons || (!media.title && media.name)) ? 'tv' : 'movie';
    }
    const poster = media.poster_path || media.posterPath || media.poster || '';
    const backdrop = media.backdrop_path || media.backdropPath || media.backdrop || '';

    list.unshift({
      id: media.id,
      title: media.title || media.name || 'İsimsiz',
      poster_path: poster,
      posterPath: poster,
      backdrop_path: backdrop,
      backdropPath: backdrop,
      vote_average: media.vote_average || media.voteAverage || 8.0,
      release_date: media.release_date || media.first_air_date || '',
      first_air_date: media.first_air_date || '',
      genre_ids: media.genre_ids || (Array.isArray(media.genres) ? media.genres.map(g => (typeof g === 'object' ? g.id : g)) : []),
      genres: media.genres || [],
      original_language: media.original_language || '',
      origin_country: media.origin_country || [],
      isAnime: isAnimeRecord(media),
      type: resolvedType,
      addedAt: Date.now()
    });
    added = true;
  }

  setLocalItem(STORAGE_KEYS.WATCHLIST, list);
  return added;
}

export function removeWatchlist(id) {
  let list = getWatchlist();
  list = list.filter(item => item.id != id);
  setLocalItem(STORAGE_KEYS.WATCHLIST, list);
  return list;
}

export function clearWatchlist() {
  setLocalItem(STORAGE_KEYS.WATCHLIST, []);
}

export function clearAllWatchHistory() {
  setLocalItem(STORAGE_KEYS.WATCH_HISTORY, []);
}

export function removeEpisodeFromHistory(id, season = 1, episode = 1) {
  return removeWatchHistoryItem(id, season, episode);
}

/* ==========================================================================
   User Settings Management
   ========================================================================== */

export function getUserSettings() {
  return getLocalItem(STORAGE_KEYS.USER_SETTINGS, {
    autoplayNext: true,
    preferredResolution: '1080p',
    theme: 'dark',
    subtitlesEnabled: true
  });
}

export function saveUserSettings(settings) {
  const current = getUserSettings();
  setLocalItem(STORAGE_KEYS.USER_SETTINGS, { ...current, ...settings });
}

/* ==========================================================================
   JSON Export & Import (Backup & Restore)
   ========================================================================== */

export function exportDataAsJSON() {
  const history = getLocalItem(STORAGE_KEYS.WATCH_HISTORY, []);
  const favs = getLocalItem(STORAGE_KEYS.FAVORITES, []);
  const watch = getLocalItem(STORAGE_KEYS.WATCHLIST, []);
  const settings = getLocalItem(STORAGE_KEYS.USER_SETTINGS, {});

  const exportPayload = {
    version: '1.0.0',
    exportDate: new Date().toISOString(),
    appName: 'CinePulse Studio',
    watchHistory: history,
    favorites: favs,
    watchlist: watch,
    userSettings: settings,
    data: {
      watchHistory: history,
      favorites: favs,
      watchlist: watch,
      userSettings: settings
    }
  };

  const jsonStr = JSON.stringify(exportPayload, null, 2);
  const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `cinepulse_yedek_${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 1000);
}

export function importDataFromJSON(jsonInput, mode = 'merge') {
  try {
    let parsed = null;
    if (typeof jsonInput === 'string') {
      parsed = JSON.parse(jsonInput.trim());
    } else if (typeof jsonInput === 'object' && jsonInput !== null) {
      parsed = jsonInput;
    }

    if (!parsed) {
      throw new Error('Geçersiz veya boş yedek dosyası.');
    }

    let incomingHistory = [];
    let incomingFavs = [];
    let incomingWatchlist = [];
    let incomingSettings = {};

    if (Array.isArray(parsed)) {
      incomingHistory = parsed;
    } else if (typeof parsed === 'object') {
      incomingHistory = parsed.watchHistory || parsed.data?.watchHistory || parsed.sineflix_watch_history_v1 || parsed.history || [];
      incomingFavs = parsed.favorites || parsed.data?.favorites || parsed.sineflix_favorites_v1 || [];
      incomingWatchlist = parsed.watchlist || parsed.data?.watchlist || parsed.sineflix_watchlist_v1 || [];
      incomingSettings = parsed.userSettings || parsed.data?.userSettings || parsed.sineflix_user_settings_v1 || {};
    }

    if (!Array.isArray(incomingHistory)) incomingHistory = [];
    if (!Array.isArray(incomingFavs)) incomingFavs = [];
    if (!Array.isArray(incomingWatchlist)) incomingWatchlist = [];

    if (mode === 'replace') {
      setLocalItem(STORAGE_KEYS.WATCH_HISTORY, incomingHistory);
      setLocalItem(STORAGE_KEYS.FAVORITES, incomingFavs);
      setLocalItem(STORAGE_KEYS.WATCHLIST, incomingWatchlist);
      if (incomingSettings && typeof incomingSettings === 'object') {
        setLocalItem(STORAGE_KEYS.USER_SETTINGS, incomingSettings);
      }
    } else {
      // Merge mode
      const existingHistory = getLocalItem(STORAGE_KEYS.WATCH_HISTORY, []);
      const historyMap = new Map();

      // Load existing
      existingHistory.forEach(item => {
        const key = `${item.id}_${item.season || 1}_${item.episode || 1}`;
        historyMap.set(key, item);
      });

      // Merge incoming
      incomingHistory.forEach(item => {
        const key = `${item.id}_${item.season || 1}_${item.episode || 1}`;
        if (!historyMap.has(key)) {
          historyMap.set(key, item);
        } else {
          const existing = historyMap.get(key);
          // Keep the one with latest timestamp or completed status
          if ((item.lastWatchedAt || 0) >= (existing.lastWatchedAt || 0) || item.completed) {
            historyMap.set(key, { ...existing, ...item });
          }
        }
      });

      const mergedHistory = Array.from(historyMap.values()).sort((a, b) => (b.lastWatchedAt || 0) - (a.lastWatchedAt || 0));
      setLocalItem(STORAGE_KEYS.WATCH_HISTORY, mergedHistory);

      // Merge Favorites
      const existingFavs = getLocalItem(STORAGE_KEYS.FAVORITES, []);
      const favsMap = new Map();
      existingFavs.forEach(f => favsMap.set(String(f.id), f));
      incomingFavs.forEach(f => {
        if (!favsMap.has(String(f.id))) favsMap.set(String(f.id), f);
      });
      setLocalItem(STORAGE_KEYS.FAVORITES, Array.from(favsMap.values()));

      // Merge Watchlist
      const existingWatch = getLocalItem(STORAGE_KEYS.WATCHLIST, []);
      const watchMap = new Map();
      existingWatch.forEach(w => watchMap.set(String(w.id), w));
      incomingWatchlist.forEach(w => {
        if (!watchMap.has(String(w.id))) watchMap.set(String(w.id), w);
      });
      setLocalItem(STORAGE_KEYS.WATCHLIST, Array.from(watchMap.values()));

      // Merge Settings
      const existingSettings = getLocalItem(STORAGE_KEYS.USER_SETTINGS, {});
      setLocalItem(STORAGE_KEYS.USER_SETTINGS, { ...existingSettings, ...incomingSettings });
    }

    // Fire all legacy & active synchronization events
    window.dispatchEvent(new CustomEvent('sineflix_data_changed', { detail: { action: 'import' } }));
    window.dispatchEvent(new CustomEvent('dizibol_data_changed', { detail: { action: 'import' } }));
    window.dispatchEvent(new CustomEvent('cinepulse_data_changed', { detail: { action: 'import' } }));

    return {
      success: true,
      countHistory: incomingHistory.length,
      countFavs: incomingFavs.length,
      countWatchlist: incomingWatchlist.length,
      message: `${incomingHistory.length} izleme kaydı ve ${incomingFavs.length} favori başarıyla aktarıldı.`
    };
  } catch (err) {
    console.error('Import error:', err);
    return {
      success: false,
      error: err.message,
      message: 'Yedek dosyası okunamadı: ' + err.message
    };
  }
}

export function getStorageStats() {
  const history = getWatchHistory();
  const favorites = getFavorites();
  const watchlist = getWatchlist();
  const rawData = JSON.stringify({ history, favorites, watchlist });
  const bytes = new Blob([rawData]).size;
  const kb = (bytes / 1024).toFixed(1);

  return {
    historyCount: history.length,
    favoritesCount: favorites.length,
    watchlistCount: watchlist.length,
    bytes,
    kb
  };
}

export function clearAllData() {
  if (typeof window === 'undefined' || !window.localStorage) return;
  localStorage.removeItem(STORAGE_KEYS.WATCH_HISTORY);
  localStorage.removeItem(STORAGE_KEYS.FAVORITES);
  localStorage.removeItem(STORAGE_KEYS.WATCHLIST);
  window.dispatchEvent(new CustomEvent('sineflix_data_changed', { detail: { cleared: true } }));
}
