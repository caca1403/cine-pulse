/**
 * CinePulse Studio - Trakt.tv Integration Service
 * Official Trakt API v2 client for:
 * - Device Code OAuth authorization (no complex callback URLs needed)
 * - Real-time playback scrobbling (start, pause, stop/watched)
 * - Two-way sync (Watched History & Watchlist)
 * - User Profile & stats management
 */

const TRAKT_API_URL = 'https://api.trakt.tv';
const DEFAULT_CLIENT_ID = 'AsVFyJXykTMViLCXPMAvFGtk7B_npj5Y3STpzljYnwY';
const DEFAULT_CLIENT_SECRET = '4b6l8YaAG-GzyY6cSPFR5ea66xrXYEqrrHhn3FiWa7k';

const STORAGE_KEYS = {
  TOKEN: 'cinepulse_trakt_token',
  USER: 'cinepulse_trakt_user',
  SETTINGS: 'cinepulse_trakt_settings',
  LAST_SYNC: 'cinepulse_trakt_last_sync'
};

let activePollController = null;
let lastScrobbleAction = null;
let lastScrobbleTime = 0;

/**
 * Get active Client ID (allow override via localStorage or fallback to default)
 */
export function getClientId() {
  return localStorage.getItem('cinepulse_trakt_custom_client_id') || DEFAULT_CLIENT_ID;
}

export function getClientSecret() {
  return localStorage.getItem('cinepulse_trakt_custom_client_secret') || DEFAULT_CLIENT_SECRET;
}

/**
 * Trakt Settings
 */
export function getTraktSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (raw) return JSON.parse(raw);
  } catch (_) {}
  return {
    autoScrobble: true,
    scrobbleThreshold: 80, // % progress to mark as completed
    autoSyncOnLaunch: true
  };
}

export function saveTraktSettings(settings) {
  const current = getTraktSettings();
  const merged = { ...current, ...settings };
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(merged));
  return merged;
}

let autoSyncRanThisSession = false;

/**
 * Background auto-sync on app launch
 */
export function initTraktAutoSync(storageMethods) {
  const settings = getTraktSettings();
  if (!settings.autoSyncOnLaunch || !isTraktConnected() || autoSyncRanThisSession) return;

  autoSyncRanThisSession = true;
  // Delay by 4s to ensure zero impact on initial view render
  window.setTimeout(async () => {
    try {
      console.log('[Trakt] Başlangıç otomatik senkronizasyonu çalışıyor...');
      await performFullSync(storageMethods);
      console.log('[Trakt] Başlangıç otomatik senkronizasyonu tamamlandı.');
    } catch (err) {
      console.warn('[Trakt] Otomatik senkronizasyon uyarısı:', err);
    }
  }, 4000);
}

/**
 * Auth Token Management
 */
export function getStoredToken() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (_) {
    return null;
  }
}

export function isTraktConnected() {
  const token = getStoredToken();
  return Boolean(token && token.access_token);
}

export function getStoredUser() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.USER);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (_) {
    return null;
  }
}

export function getLastSyncTime() {
  const t = localStorage.getItem(STORAGE_KEYS.LAST_SYNC);
  return t ? Number(t) : null;
}

/**
 * Ensure valid access token (refresh if expired)
 */
export async function getValidToken() {
  const token = getStoredToken();
  if (!token || !token.access_token) return null;

  // Refresh if token expires in less than 24 hours
  const now = Math.floor(Date.now() / 1000);
  const expiresAt = (token.created_at || 0) + (token.expires_in || 0);

  if (expiresAt - now < 86400 && token.refresh_token) {
    try {
      const refreshed = await refreshToken(token.refresh_token);
      if (refreshed?.access_token) return refreshed.access_token;
    } catch (e) {
      console.warn('Trakt token refresh failed:', e);
    }
  }

  return token.access_token;
}

/**
 * Device Authentication Step 1: Request Device Code & Verification URL
 */
export async function getDeviceCode() {
  const clientId = getClientId();
  const res = await fetch(`${TRAKT_API_URL}/oauth/device/code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: clientId })
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Device code error (${res.status}): ${errText}`);
  }

  return await res.json();
}

/**
 * Device Authentication Step 2: Poll Trakt until user authorizes the code
 */
export function pollDeviceToken(deviceCode, interval = 5, onStatusChange = () => {}) {
  if (activePollController) {
    activePollController.abort();
  }

  activePollController = new AbortController();
  const { signal } = activePollController;

  return new Promise((resolve, reject) => {
    const clientId = getClientId();
    const clientSecret = getClientSecret();
    let pollInterval = Math.max(interval, 5) * 1000;

    const checkToken = async () => {
      if (signal.aborted) {
        reject(new Error('Auth polling cancelled'));
        return;
      }

      try {
        const res = await fetch(`${TRAKT_API_URL}/oauth/device/token`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            code: deviceCode,
            client_id: clientId,
            client_secret: clientSecret
          }),
          signal
        });

        if (res.status === 200) {
          const tokenData = await res.json();
          localStorage.setItem(STORAGE_KEYS.TOKEN, JSON.stringify(tokenData));

          // Fetch user profile immediately
          let userProfile = null;
          try {
            userProfile = await fetchUserProfile(tokenData.access_token);
            if (userProfile) {
              localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userProfile));
            }
          } catch (e) {
            console.warn('Could not fetch Trakt user profile:', e);
          }

          window.dispatchEvent(new CustomEvent('cinepulse_trakt_auth_changed', {
            detail: { connected: true, user: userProfile }
          }));

          resolve(tokenData);
          return;
        }

        if (res.status === 400) {
          // Pending authorization
          onStatusChange({ status: 'pending', message: 'Kullanıcı onayı bekleniyor...' });
          if (!signal.aborted) setTimeout(checkToken, pollInterval);
          return;
        }

        if (res.status === 404) {
          throw new Error('Geçersiz cihaz kodu.');
        }

        if (res.status === 409) {
          throw new Error('Bu kod zaten kullanılmış.');
        }

        if (res.status === 410) {
          throw new Error('Kodun süresi doldu. Lütfen tekrar deneyin.');
        }

        if (res.status === 429) {
          // Rate limited, increase interval
          pollInterval += 2000;
          if (!signal.aborted) setTimeout(checkToken, pollInterval);
          return;
        }

        const err = await res.text();
        throw new Error(`Trakt auth failed: ${err}`);
      } catch (err) {
        if (signal.aborted) return;
        reject(err);
      }
    };

    // First check after interval
    setTimeout(checkToken, pollInterval);
  });
}

export function cancelDeviceAuth() {
  if (activePollController) {
    activePollController.abort();
    activePollController = null;
  }
}

/**
 * Refresh expired token
 */
export async function refreshToken(refreshTokenStr) {
  const clientId = getClientId();
  const clientSecret = getClientSecret();

  const res = await fetch(`${TRAKT_API_URL}/oauth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      refresh_token: refreshTokenStr,
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'refresh_token'
    })
  });

  if (!res.ok) throw new Error('Token refresh failed');
  const tokenData = await res.json();
  localStorage.setItem(STORAGE_KEYS.TOKEN, JSON.stringify(tokenData));
  return tokenData;
}

/**
 * Logout & disconnect Trakt
 */
export function disconnectTrakt() {
  cancelDeviceAuth();
  localStorage.removeItem(STORAGE_KEYS.TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER);
  localStorage.removeItem(STORAGE_KEYS.LAST_SYNC);
  window.dispatchEvent(new CustomEvent('cinepulse_trakt_auth_changed', {
    detail: { connected: false }
  }));
}

/**
 * Trakt API helper headers
 */
function getApiHeaders(accessToken) {
  return {
    'Content-Type': 'application/json',
    'trakt-api-version': '2',
    'trakt-api-key': getClientId(),
    'Authorization': `Bearer ${accessToken}`
  };
}

/**
 * Fetch Current User Profile
 */
export async function fetchUserProfile(tokenOverride = null) {
  const token = tokenOverride || (await getValidToken());
  if (!token) return null;

  const res = await fetch(`${TRAKT_API_URL}/users/me?extended=full`, {
    headers: getApiHeaders(token)
  });

  if (!res.ok) return null;
  const user = await res.json();
  localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
  return user;
}

/**
 * Format media item for Trakt Scrobble & Sync
 */
function buildTraktMediaPayload(media, progressPercent = 0) {
  const progress = Math.min(100, Math.max(0, Math.round(progressPercent)));
  const tmdbId = media.tmdbId || media.id;

  // Strict series detection:
  // Must NOT be a series if explicitly marked isSeries: false or type: 'movie'
  const isSeries = media.isSeries === true
    ? true
    : (media.isSeries === false || media.type === 'movie'
      ? false
      : Boolean(media.type === 'tv' || (Boolean(media.season) && Number(media.season) > 0 && media.type !== 'movie')));

  if (isSeries) {
    return {
      show: {
        title: media.seriesTitle || media.title || '',
        ids: {
          tmdb: Number(tmdbId) || undefined
        }
      },
      episode: {
        season: Math.max(1, Number(media.season) || 1),
        number: Math.max(1, Number(media.episode) || 1)
      },
      progress,
      app_version: '2.0.0',
      app_date: '2026-09-25'
    };
  }

  return {
    movie: {
      title: media.title || '',
      ids: {
        tmdb: Number(tmdbId) || undefined
      }
    },
    progress,
    app_version: '2.0.0',
    app_date: '2026-09-25'
  };
}

/**
 * Scrobble: Start Watching
 */
export async function scrobbleStart(media, progressPercent = 0) {
  const settings = getTraktSettings();
  if (!settings.autoScrobble || !isTraktConnected()) return null;

  const now = Date.now();
  if (lastScrobbleAction === 'start' && now - lastScrobbleTime < 8000) return null;

  const token = await getValidToken();
  if (!token) return null;

  try {
    const payload = buildTraktMediaPayload(media, progressPercent);
    const res = await fetch(`${TRAKT_API_URL}/scrobble/start`, {
      method: 'POST',
      headers: getApiHeaders(token),
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      lastScrobbleAction = 'start';
      lastScrobbleTime = now;
      return await res.json();
    } else {
      console.warn('Trakt scrobbleStart error status:', res.status, await res.text());
    }
  } catch (err) {
    console.warn('Trakt scrobbleStart error:', err);
  }
  return null;
}

/**
 * Scrobble: Pause Watching (Instantly moves media into Trakt's Continue Watching / On-Deck)
 */
export async function scrobblePause(media, progressPercent = 0) {
  const settings = getTraktSettings();
  if (!settings.autoScrobble || !isTraktConnected()) return null;

  const token = await getValidToken();
  if (!token) return null;

  try {
    const payload = buildTraktMediaPayload(media, progressPercent);
    const res = await fetch(`${TRAKT_API_URL}/scrobble/pause`, {
      method: 'POST',
      headers: getApiHeaders(token),
      body: JSON.stringify(payload),
      keepalive: true
    });
    if (res.ok) {
      lastScrobbleAction = 'pause';
      lastScrobbleTime = Date.now();
      return await res.json();
    } else {
      console.warn('Trakt scrobblePause error status:', res.status, await res.text());
    }
  } catch (err) {
    console.warn('Trakt scrobblePause error:', err);
  }
  return null;
}

/**
 * Scrobble: Stop Watching (marks watched on Trakt if progress >= threshold)
 */
export async function scrobbleStop(media, progressPercent = 100) {
  const settings = getTraktSettings();
  if (!settings.autoScrobble || !isTraktConnected()) return null;

  const token = await getValidToken();
  if (!token) return null;

  try {
    const payload = buildTraktMediaPayload(media, progressPercent);
    const res = await fetch(`${TRAKT_API_URL}/scrobble/stop`, {
      method: 'POST',
      headers: getApiHeaders(token),
      body: JSON.stringify(payload),
      keepalive: true
    });
    if (res.ok) {
      lastScrobbleAction = 'stop';
      lastScrobbleTime = Date.now();
      return await res.json();
    } else {
      console.warn('Trakt scrobbleStop error status:', res.status, await res.text());
    }
  } catch (err) {
    console.warn('Trakt scrobbleStop error:', err);
  }
  return null;
}

/**
 * Sync: Get Trakt In-Progress Playback (Continue Watching)
 */
export async function fetchTraktPlayback(limit = 20) {
  const token = await getValidToken();
  if (!token) return [];

  const res = await fetch(`${TRAKT_API_URL}/sync/playback?limit=${limit}`, {
    headers: getApiHeaders(token)
  });

  if (!res.ok) return [];
  return await res.json();
}

/**
 * Sync: Get Trakt Watched History
 */
export async function fetchTraktHistory(limit = 100) {
  const token = await getValidToken();
  if (!token) return [];

  const res = await fetch(`${TRAKT_API_URL}/sync/history?limit=${limit}&extended=full`, {
    headers: getApiHeaders(token)
  });

  if (!res.ok) return [];
  return await res.json();
}

/**
 * Sync: Get Trakt Watchlist
 */
export async function fetchTraktWatchlist() {
  const token = await getValidToken();
  if (!token) return [];

  const res = await fetch(`${TRAKT_API_URL}/sync/watchlist?extended=full`, {
    headers: getApiHeaders(token)
  });

  if (!res.ok) return [];
  return await res.json();
}

/**
 * Sync: Push CinePulse Watched Items to Trakt
 * Correctly maps shows -> seasons -> episodes according to official Trakt API schema.
 */
export async function pushHistoryToTrakt(items) {
  const token = await getValidToken();
  if (!token || !items || !items.length) return null;

  const movies = [];
  const showsMap = new Map();

  for (const item of items) {
    const rawId = item.id || item.tmdbId;
    const tmdbId = Number(rawId);
    if (!tmdbId || isNaN(tmdbId)) continue;

    const watchedAt = item.lastWatchedAt ? new Date(item.lastWatchedAt).toISOString() : new Date().toISOString();
    const isSeries = Boolean(item.isSeries || item.type === 'tv' || (item.season && item.season > 0));

    if (isSeries) {
      const seasonNum = Math.max(1, Number(item.season) || 1);
      const episodeNum = Math.max(1, Number(item.episode) || 1);

      if (!showsMap.has(tmdbId)) {
        showsMap.set(tmdbId, {
          title: item.title || '',
          ids: { tmdb: tmdbId },
          seasonsMap: new Map()
        });
      }
      const showEntry = showsMap.get(tmdbId);
      if (!showEntry.seasonsMap.has(seasonNum)) {
        showEntry.seasonsMap.set(seasonNum, []);
      }
      showEntry.seasonsMap.get(seasonNum).push({
        number: episodeNum,
        watched_at: watchedAt
      });
    } else {
      movies.push({
        title: item.title || '',
        watched_at: watchedAt,
        ids: { tmdb: tmdbId }
      });
    }
  }

  const shows = Array.from(showsMap.values()).map(s => ({
    title: s.title,
    ids: s.ids,
    seasons: Array.from(s.seasonsMap.entries()).map(([num, eps]) => ({
      number: num,
      episodes: eps
    }))
  }));

  if (movies.length === 0 && shows.length === 0) return null;

  const payload = {};
  if (movies.length > 0) payload.movies = movies;
  if (shows.length > 0) payload.shows = shows;

  const res = await fetch(`${TRAKT_API_URL}/sync/history`, {
    method: 'POST',
    headers: getApiHeaders(token),
    body: JSON.stringify(payload)
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Trakt API Hatası (${res.status}): ${errText}`);
  }
  return await res.json();
}

const TMDB_API_KEY = '4e44d9029b1270a757cddc766a1bcb63';

async function fetchTmdbMediaInfo(tmdbId, isSeries = false) {
  try {
    const endpoint = isSeries ? 'tv' : 'movie';
    const res = await fetch(`https://api.themoviedb.org/3/${endpoint}/${tmdbId}?api_key=${TMDB_API_KEY}&language=tr-TR`);
    if (res.ok) {
      return await res.json();
    }
  } catch (_) {}
  return null;
}

/**
 * Pull Trakt In-Progress Playback & History into CinePulse (Trakt -> CinePulse)
 */
export async function pullTraktIntoCinePulse(storageMethods) {
  const token = await getValidToken();
  if (!token) return { importedPlaybackCount: 0, importedHistoryCount: 0 };

  const { saveWatchProgress, getWatchHistory } = storageMethods;
  if (!saveWatchProgress) return { importedPlaybackCount: 0, importedHistoryCount: 0 };

  const localHistory = getWatchHistory ? getWatchHistory() : [];
  let importedPlaybackCount = 0;
  let importedHistoryCount = 0;

  // 1. Pull Playback (In-Progress Continue Watching from Trakt)
  try {
    const playbackRes = await fetch(`${TRAKT_API_URL}/sync/playback?limit=30`, {
      headers: getApiHeaders(token)
    });
    if (playbackRes.ok) {
      const playbackItems = await playbackRes.json();
      if (Array.isArray(playbackItems)) {
        for (const item of playbackItems) {
          const isMovie = item.type === 'movie';
          const mediaObj = isMovie ? item.movie : item.show;
          const tmdbId = mediaObj?.ids?.tmdb;
          if (!tmdbId) continue;

          const season = isMovie ? 1 : (item.episode?.season || 1);
          const episode = isMovie ? 1 : (item.episode?.number || 1);
          const progressPercent = Math.min(99, Math.max(1, Math.round(item.progress || 0)));
          const pausedAt = item.paused_at ? new Date(item.paused_at).getTime() : Date.now();

          // Check if local history already has this item and was updated more recently
          const existing = localHistory.find(h => h.id == tmdbId && (!h.isSeries || (h.season == season && h.episode == episode)));
          if (existing && existing.lastWatchedAt && existing.lastWatchedAt > pausedAt) {
            continue;
          }

          let posterPath = existing?.poster_path || existing?.posterPath || '';
          let backdropPath = existing?.backdrop_path || existing?.backdropPath || '';
          let title = existing?.title || mediaObj.title || '';
          let duration = isMovie ? 6600 : 3000;

          if (!posterPath || !title) {
            const tmdbData = await fetchTmdbMediaInfo(tmdbId, !isMovie);
            if (tmdbData) {
              posterPath = tmdbData.poster_path || '';
              backdropPath = tmdbData.backdrop_path || '';
              title = tmdbData.title || tmdbData.name || title;
              if (tmdbData.runtime) duration = tmdbData.runtime * 60;
              else if (tmdbData.episode_run_time?.[0]) duration = tmdbData.episode_run_time[0] * 60;
            }
          }

          const currentTime = Math.max(60, Math.round((progressPercent / 100) * duration));

          saveWatchProgress({
            id: tmdbId,
            title,
            posterPath,
            backdropPath,
            type: isMovie ? 'movie' : 'tv',
            isSeries: !isMovie,
            season: !isMovie ? season : undefined,
            episode: !isMovie ? episode : undefined,
            currentTime,
            duration,
            completed: false,
            lastWatchedAt: pausedAt
          });
          importedPlaybackCount++;
        }
      }
    }
  } catch (err) {
    console.warn('Trakt playback pull error:', err);
  }

  // 2. Pull History (Watched Items from Trakt)
  try {
    const historyRes = await fetch(`${TRAKT_API_URL}/sync/history?limit=50&extended=full`, {
      headers: getApiHeaders(token)
    });
    if (historyRes.ok) {
      const historyItems = await historyRes.json();
      if (Array.isArray(historyItems)) {
        for (const item of historyItems) {
          const isMovie = item.type === 'movie';
          const mediaObj = isMovie ? item.movie : item.show;
          const tmdbId = mediaObj?.ids?.tmdb;
          if (!tmdbId) continue;

          const season = isMovie ? 1 : (item.episode?.season || 1);
          const episode = isMovie ? 1 : (item.episode?.number || 1);
          const watchedAt = item.watched_at ? new Date(item.watched_at).getTime() : Date.now();

          const existing = localHistory.find(h => h.id == tmdbId && (!h.isSeries || (h.season == season && h.episode == episode)));
          if (existing && existing.completed) {
            continue;
          }

          let posterPath = existing?.poster_path || existing?.posterPath || '';
          let backdropPath = existing?.backdrop_path || existing?.backdropPath || '';
          let title = existing?.title || mediaObj.title || '';
          let duration = isMovie ? 6600 : 3000;

          if (!posterPath || !title) {
            const tmdbData = await fetchTmdbMediaInfo(tmdbId, !isMovie);
            if (tmdbData) {
              posterPath = tmdbData.poster_path || '';
              backdropPath = tmdbData.backdrop_path || '';
              title = tmdbData.title || tmdbData.name || title;
              if (tmdbData.runtime) duration = tmdbData.runtime * 60;
              else if (tmdbData.episode_run_time?.[0]) duration = tmdbData.episode_run_time[0] * 60;
            }
          }

          saveWatchProgress({
            id: tmdbId,
            title,
            posterPath,
            backdropPath,
            type: isMovie ? 'movie' : 'tv',
            isSeries: !isMovie,
            season: !isMovie ? season : undefined,
            episode: !isMovie ? episode : undefined,
            currentTime: duration,
            duration,
            completed: true,
            lastWatchedAt: watchedAt
          });
          importedHistoryCount++;
        }
      }
    }
  } catch (err) {
    console.warn('Trakt history pull error:', err);
  }

  if (importedPlaybackCount > 0 || importedHistoryCount > 0) {
    window.dispatchEvent(new CustomEvent('cinepulse_data_changed', { detail: { action: 'import', source: 'trakt' } }));
    window.dispatchEvent(new CustomEvent('sineflix_data_changed', { detail: { action: 'import', source: 'trakt' } }));
  }

  return { importedPlaybackCount, importedHistoryCount };
}

/**
 * Perform Full Two-Way Sync (CinePulse <-> Trakt.tv)
 */
export async function performFullSync(storageMethods) {
  if (!isTraktConnected()) throw new Error('Trakt hesabı bağlı değil');

  const { getWatchHistory, saveWatchProgress } = storageMethods;

  const syncResult = {
    pushedMoviesCount: 0,
    pushedEpisodesCount: 0,
    importedPlaybackCount: 0,
    importedHistoryCount: 0,
    errors: []
  };

  try {
    // 1. Push CinePulse -> Trakt
    const localHistory = getWatchHistory ? getWatchHistory() : [];
    const validItems = localHistory.filter(h => h.completed || (h.currentTime && h.currentTime > 60) || (h.progressPercent && h.progressPercent > 5));

    if (validItems.length > 0) {
      const pushRes = await pushHistoryToTrakt(validItems);
      if (pushRes && pushRes.added) {
        syncResult.pushedMoviesCount = pushRes.added.movies || 0;
        syncResult.pushedEpisodesCount = pushRes.added.episodes || 0;
      }
    }

    // 2. Pull Trakt -> CinePulse (Two-Way Sync)
    if (saveWatchProgress) {
      const pullRes = await pullTraktIntoCinePulse(storageMethods);
      syncResult.importedPlaybackCount = pullRes.importedPlaybackCount || 0;
      syncResult.importedHistoryCount = pullRes.importedHistoryCount || 0;
    }

    localStorage.setItem(STORAGE_KEYS.LAST_SYNC, String(Date.now()));
  } catch (err) {
    syncResult.errors.push(err.message || 'Senkronizasyon hatası');
    throw err;
  }

  return syncResult;
}

/**
 * Wipe all history records from Trakt.tv account to start fresh
 */
export async function clearTraktRemoteHistory() {
  const token = await getValidToken();
  if (!token) throw new Error('Trakt hesabı bağlı değil');

  const res = await fetch(`${TRAKT_API_URL}/sync/history?limit=1000`, {
    headers: getApiHeaders(token)
  });
  if (!res.ok) throw new Error('Trakt geçmişi alınamadı');

  const items = await res.json();
  if (!Array.isArray(items) || items.length === 0) return 0;

  const historyIds = items.map(i => i.id).filter(Boolean);
  if (historyIds.length === 0) return 0;

  const removeRes = await fetch(`${TRAKT_API_URL}/sync/history/remove`, {
    method: 'POST',
    headers: getApiHeaders(token),
    body: JSON.stringify({ ids: historyIds })
  });

  if (!removeRes.ok) {
    const errText = await removeRes.text();
    throw new Error(`Trakt geçmişi silinemedi: ${errText}`);
  }

  const result = await removeRes.json();
  return (result.deleted?.movies || 0) + (result.deleted?.episodes || 0);
}
