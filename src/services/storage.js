/* ==========================================================================
   SineFlix Pro - Local Storage & Data Management Service (No-Backend)
   Handles watch history, timestamps, favorites, watchlist, item removal, and JSON Export/Import
   ========================================================================== */

const STORAGE_KEYS = {
  WATCH_HISTORY: 'sineflix_watch_history_v1',
  FAVORITES: 'sineflix_favorites_v1',
  WATCHLIST: 'sineflix_watchlist_v1',
  USER_SETTINGS: 'sineflix_user_settings_v1'
};

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
    window.dispatchEvent(new CustomEvent('sineflix_data_changed', { detail: { key, value } }));
  } catch (err) {
    console.error(`Error saving ${key} to localStorage:`, err);
  }
}

/* ==========================================================================
   Watch History & Progress Management
   ========================================================================== */

export function getWatchHistory() {
  const history = getLocalItem(STORAGE_KEYS.WATCH_HISTORY, []);
  return history.sort((a, b) => (b.lastWatchedAt || 0) - (a.lastWatchedAt || 0));
}

export function saveWatchProgress({
  id,
  title,
  posterPath,
  backdropPath,
  type = 'tv',
  season = 1,
  episode = 1,
  currentTime = 0,
  duration = 0,
  completed = false
}) {
  if (!id) return;

  const history = getWatchHistory();
  const existingIndex = history.findIndex(item => item.id == id && item.season == season && item.episode == episode);
  
  const anyExisting = history.find(item => item.id == id && (item.posterPath || item.poster_path));
  const resolvedPoster = posterPath || (anyExisting ? (anyExisting.posterPath || anyExisting.poster_path) : '');
  const resolvedBackdrop = backdropPath || (anyExisting ? (anyExisting.backdropPath || anyExisting.backdrop_path) : '');

  const progressPercent = duration > 0 ? Math.min(100, Math.round((currentTime / duration) * 100)) : 0;
  const isCompleted = completed || progressPercent >= 90;

  const record = {
    id,
    title,
    posterPath: resolvedPoster,
    backdropPath: resolvedBackdrop,
    type,
    season: Number(season),
    episode: Number(episode),
    currentTime: Math.round(currentTime),
    duration: Math.round(duration),
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
  const history = getWatchHistory();
  return history.find(item => item.id == id && item.season == season && item.episode == episode) || null;
}

export function isMediaWatched(id, season = 1, episode = 1) {
  const progress = getMediaProgress(id, season, episode);
  return !!(progress && (progress.completed || progress.progressPercent >= 90));
}

export function markEpisodeWatched(id, season = 1, episode = 1, completed = true, mediaData = {}) {
  const history = getWatchHistory();
  const existingIndex = history.findIndex(item => item.id == id && item.season == season && item.episode == episode);
  const record = {
    id,
    title: mediaData.title || (existingIndex >= 0 ? history[existingIndex].title : 'İçerik'),
    posterPath: mediaData.posterPath || (existingIndex >= 0 ? history[existingIndex].posterPath : ''),
    backdropPath: mediaData.backdropPath || (existingIndex >= 0 ? history[existingIndex].backdropPath : ''),
    type: mediaData.type || (existingIndex >= 0 ? history[existingIndex].type : 'tv'),
    season: Number(season),
    episode: Number(episode),
    currentTime: completed ? (mediaData.duration || 2700) : 0,
    duration: mediaData.duration || 2700,
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
  return record;
}

export function toggleEpisodeWatched(id, season = 1, episode = 1, mediaData = {}) {
  const progress = getMediaProgress(id, season, episode);
  const isCompleted = progress ? (progress.completed || progress.progressPercent >= 90) : false;
  return markEpisodeWatched(id, season, episode, !isCompleted, mediaData);
}

export function markAllEpisodesWatched(seriesId, seasonsList = [], completed = true, mediaData = {}) {
  const history = getWatchHistory();
  const title = mediaData.title || 'Dizi';
  const posterPath = mediaData.posterPath || '';
  const backdropPath = mediaData.backdropPath || '';
  const type = mediaData.type || 'tv';

  for (const season of seasonsList) {
    const seasonNum = season.season_number;
    if (seasonNum === 0 && seasonsList.length > 1) continue;
    const count = season.episode_count || 10;
    for (let ep = 1; ep <= count; ep++) {
      const existingIndex = history.findIndex(item => item.id == seriesId && item.season == seasonNum && item.episode == ep);
      const record = {
        id: seriesId,
        title,
        posterPath,
        backdropPath,
        type,
        season: Number(seasonNum),
        episode: ep,
        currentTime: completed ? 2700 : 0,
        duration: 2700,
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
  const posterPath = mediaData.posterPath || '';
  const backdropPath = mediaData.backdropPath || '';
  const type = mediaData.type || 'tv';

  for (let ep = 1; ep <= episodeCount; ep++) {
    const existingIndex = history.findIndex(item => item.id == seriesId && item.season == seasonNum && item.episode == ep);
    const record = {
      id: seriesId,
      title,
      posterPath,
      backdropPath,
      type,
      season: Number(seasonNum),
      episode: ep,
      currentTime: completed ? 2700 : 0,
      duration: 2700,
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
  const duration = mediaData.duration || 5400;
  const time = currentTime || Math.round(duration * 0.5);

  return saveWatchProgress({
    id,
    title: mediaData.title || 'İçerik',
    posterPath: mediaData.posterPath || '',
    backdropPath: mediaData.backdropPath || '',
    type: mediaData.type || 'movie',
    season: Number(season),
    episode: Number(episode),
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
    return `${hrs}sa ${remMin}dk`;
  }
  return `${min}:${sec < 10 ? '0' : ''}${sec}`;
}

export function formatTotalWatchTime(totalSeconds) {
  if (!totalSeconds || totalSeconds <= 0) return '0 dakika';
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  if (hours > 0) {
    return `${hours} saat ${minutes} dakika`;
  }
  return `${minutes} dakika`;
}

export function getTotalWatchStats() {
  const history = getWatchHistory();
  let totalSeconds = 0;
  let moviesCount = 0;
  let episodesCount = 0;

  for (const item of history) {
    if (item.completed) {
      totalSeconds += (item.duration || 2700);
    } else if (item.currentTime > 0) {
      totalSeconds += item.currentTime;
    }

    if (item.type === 'movie') {
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

export function getUnifiedContinueWatching() {
  const history = getWatchHistory();
  const seriesMap = new Map();

  for (const item of history) {
    const id = item.id;
    if (!seriesMap.has(id)) {
      seriesMap.set(id, []);
    }
    seriesMap.get(id).push(item);
  }

  const unifiedList = [];

  for (const [id, records] of seriesMap.entries()) {
    records.sort((a, b) => (b.lastWatchedAt || 0) - (a.lastWatchedAt || 0));
    const firstRecord = records[0];

    if (firstRecord.type === 'movie') {
      unifiedList.push({
        ...firstRecord,
        subtitle: firstRecord.completed ? 'İzlendi' : (firstRecord.currentTime > 0 ? `Kaldığın: ${formatSecondsToTime(firstRecord.currentTime)}` : 'İzleniyor')
      });
    } else {
      const currentSeason = firstRecord.season || 1;
      const watchedEpNumbers = new Set(
        records
          .filter(r => r.season === currentSeason && (r.completed || r.progressPercent >= 90))
          .map(r => r.episode)
      );

      // Check if there is an in-progress episode (yarıda bırakılan)
      const inProgressEp = records.find(r => !r.completed && r.progressPercent > 0 && r.progressPercent < 90);

      let targetSeason = currentSeason;
      let targetEpisode = 1;
      let targetTime = 0;
      let targetProgressPercent = 0;
      let isUnwatchedNext = false;

      if (inProgressEp) {
        targetSeason = inProgressEp.season;
        targetEpisode = inProgressEp.episode;
        targetTime = inProgressEp.currentTime;
        targetProgressPercent = inProgressEp.progressPercent;
      } else {
        const maxWatched = Math.max(0, ...Array.from(watchedEpNumbers));
        let foundMissing = 0;
        for (let ep = 1; ep <= maxWatched; ep++) {
          if (!watchedEpNumbers.has(ep)) {
            foundMissing = ep;
            break;
          }
        }

        if (foundMissing > 0) {
          targetEpisode = foundMissing;
        } else {
          targetEpisode = maxWatched > 0 ? maxWatched + 1 : 1;
        }
        isUnwatchedNext = true;
      }

      unifiedList.push({
        id: firstRecord.id,
        title: firstRecord.title,
        posterPath: firstRecord.posterPath,
        backdropPath: firstRecord.backdropPath,
        type: 'tv',
        season: targetSeason,
        episode: targetEpisode,
        currentTime: targetTime,
        duration: firstRecord.duration || 2700,
        progressPercent: targetProgressPercent,
        completed: false,
        isNextEpisode: isUnwatchedNext,
        lastWatchedAt: firstRecord.lastWatchedAt,
        totalWatchedCount: watchedEpNumbers.size,
        subtitle: inProgressEp 
          ? `S${targetSeason} B${targetEpisode} • Kaldığın: ${formatSecondsToTime(targetTime)}`
          : `S${targetSeason} B${targetEpisode} • Sıradaki Bölüm`
      });
    }
  }

  return unifiedList.sort((a, b) => (b.lastWatchedAt || 0) - (a.lastWatchedAt || 0));
}

export function markAsInProgress(id, season = 1, episode = 1, minuteTime = 1200, mediaData = {}) {
  return saveWatchProgress({
    id,
    title: mediaData.title,
    posterPath: mediaData.posterPath,
    backdropPath: mediaData.backdropPath,
    type: mediaData.type || 'tv',
    season,
    episode,
    currentTime: minuteTime,
    duration: mediaData.duration || 2700,
    completed: false
  });
}

/* ==========================================================================
   Favorites & Watchlist Management
   ========================================================================== */

export function getFavorites() {
  return getLocalItem(STORAGE_KEYS.FAVORITES, []);
}

export function isFavorite(id) {
  const favorites = getFavorites();
  return favorites.some(item => item.id == id);
}

export function toggleFavorite(mediaItem) {
  let favorites = getFavorites();
  const index = favorites.findIndex(item => item.id == mediaItem.id);
  
  if (index >= 0) {
    favorites.splice(index, 1);
  } else {
    favorites.push({
      id: mediaItem.id,
      title: mediaItem.title || mediaItem.name,
      posterPath: mediaItem.poster_path || mediaItem.posterPath,
      type: mediaItem.first_air_date ? 'tv' : (mediaItem.type || 'movie'),
      voteAverage: mediaItem.vote_average || mediaItem.voteAverage,
      addedAt: Date.now()
    });
  }

  setLocalItem(STORAGE_KEYS.FAVORITES, favorites);
  return index < 0;
}

export function getWatchlist() {
  return getLocalItem(STORAGE_KEYS.WATCHLIST, []);
}

export function isWatchlist(id) {
  const watchlist = getWatchlist();
  return watchlist.some(item => item.id == id);
}

export function toggleWatchlist(mediaItem) {
  let watchlist = getWatchlist();
  const index = watchlist.findIndex(item => item.id == mediaItem.id);

  if (index >= 0) {
    watchlist.splice(index, 1);
  } else {
    watchlist.push({
      id: mediaItem.id,
      title: mediaItem.title || mediaItem.name,
      posterPath: mediaItem.poster_path || mediaItem.posterPath,
      type: mediaItem.first_air_date ? 'tv' : (mediaItem.type || 'movie'),
      addedAt: Date.now()
    });
  }

  setLocalItem(STORAGE_KEYS.WATCHLIST, watchlist);
  return index < 0;
}

/* ==========================================================================
   JSON Export & Import System
   ========================================================================== */

export function exportDataAsJSON() {
  const backupObject = {
    app: "SineFlix Pro",
    version: "1.0",
    exportedAt: new Date().toISOString(),
    watchHistory: getWatchHistory(),
    favorites: getFavorites(),
    watchlist: getWatchlist(),
    userSettings: getLocalItem(STORAGE_KEYS.USER_SETTINGS, { preferredServer: 'alfa_tr' })
  };

  const jsonString = JSON.stringify(backupObject, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const dateStr = new Date().toISOString().split('T')[0];
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = `sineflix_backup_${dateStr}.json`;
  
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
}

export function importDataFromJSON(jsonData, mode = 'merge') {
  try {
    const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;

    if (!data.app && !data.watchHistory) {
      throw new Error("Geçersiz JSON formatı. SineFlix yedek dosyası seçiniz.");
    }

    if (mode === 'replace') {
      if (Array.isArray(data.watchHistory)) setLocalItem(STORAGE_KEYS.WATCH_HISTORY, data.watchHistory);
      if (Array.isArray(data.favorites)) setLocalItem(STORAGE_KEYS.FAVORITES, data.favorites);
      if (Array.isArray(data.watchlist)) setLocalItem(STORAGE_KEYS.WATCHLIST, data.watchlist);
    } else {
      if (Array.isArray(data.watchHistory)) {
        const current = getWatchHistory();
        const merged = [...data.watchHistory];
        current.forEach(item => {
          if (!merged.some(m => m.id == item.id && m.season == item.season && m.episode == item.episode)) {
            merged.push(item);
          }
        });
        setLocalItem(STORAGE_KEYS.WATCH_HISTORY, merged);
      }

      if (Array.isArray(data.favorites)) {
        const current = getFavorites();
        const merged = [...data.favorites];
        current.forEach(item => {
          if (!merged.some(f => f.id == item.id)) merged.push(item);
        });
        setLocalItem(STORAGE_KEYS.FAVORITES, merged);
      }

      if (Array.isArray(data.watchlist)) {
        const current = getWatchlist();
        const merged = [...data.watchlist];
        current.forEach(item => {
          if (!merged.some(w => w.id == item.id)) merged.push(item);
        });
        setLocalItem(STORAGE_KEYS.WATCHLIST, merged);
      }
    }

    return { success: true, countHistory: (data.watchHistory || []).length };
  } catch (err) {
    console.error("Import JSON Error:", err);
    return { success: false, error: err.message };
  }
}

export function getStorageStats() {
  let totalBytes = 0;
  if (typeof window !== 'undefined' && window.localStorage) {
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key)) {
        totalBytes += (localStorage[key].length + key.length) * 2;
      }
    }
  }
  const kb = (totalBytes / 1024).toFixed(2);
  const historyCount = getWatchHistory().length;
  const favoritesCount = getFavorites().length;

  return { totalBytes, kb, historyCount, favoritesCount };
}

export function clearAllData() {
  if (typeof window !== 'undefined' && window.localStorage) {
    localStorage.removeItem(STORAGE_KEYS.WATCH_HISTORY);
    localStorage.removeItem(STORAGE_KEYS.FAVORITES);
    localStorage.removeItem(STORAGE_KEYS.WATCHLIST);
    window.dispatchEvent(new CustomEvent('sineflix_data_changed', { detail: { action: 'clear' } }));
  }
}
