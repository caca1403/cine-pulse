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
    autoSyncOnLaunch: false
  };
}

export function saveTraktSettings(settings) {
  const current = getTraktSettings();
  const merged = { ...current, ...settings };
  localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(merged));
  return merged;
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
  const isSeries = Boolean(media.isSeries || media.type === 'tv' || media.season);

  if (isSeries) {
    return {
      show: {
        title: media.seriesTitle || media.title || '',
        ids: {
          tmdb: Number(tmdbId) || undefined
        }
      },
      episode: {
        season: Number(media.season) || 1,
        number: Number(media.episode) || 1
      },
      progress
    };
  }

  return {
    movie: {
      title: media.title || '',
      ids: {
        tmdb: Number(tmdbId) || undefined
      }
    },
    progress
  };
}

/**
 * Scrobble: Start Watching
 */
export async function scrobbleStart(media, progressPercent = 0) {
  const settings = getTraktSettings();
  if (!settings.autoScrobble || !isTraktConnected()) return null;

  const now = Date.now();
  if (lastScrobbleAction === 'start' && now - lastScrobbleTime < 10000) return null;

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
    }
  } catch (err) {
    console.warn('Trakt scrobbleStart error:', err);
  }
  return null;
}

/**
 * Scrobble: Pause Watching
 */
export async function scrobblePause(media, progressPercent = 0) {
  const settings = getTraktSettings();
  if (!settings.autoScrobble || !isTraktConnected()) return null;

  const now = Date.now();
  if (lastScrobbleAction === 'pause' && now - lastScrobbleTime < 10000) return null;

  const token = await getValidToken();
  if (!token) return null;

  try {
    const payload = buildTraktMediaPayload(media, progressPercent);
    const res = await fetch(`${TRAKT_API_URL}/scrobble/pause`, {
      method: 'POST',
      headers: getApiHeaders(token),
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      lastScrobbleAction = 'pause';
      lastScrobbleTime = now;
      return await res.json();
    }
  } catch (err) {
    console.warn('Trakt scrobblePause error:', err);
  }
  return null;
}

/**
 * Scrobble: Stop Watching (marks watched on Trakt if progress >= threshold)
 */
export async function scrobbleStop(media, progressPercent = 0) {
  const settings = getTraktSettings();
  if (!settings.autoScrobble || !isTraktConnected()) return null;

  const token = await getValidToken();
  if (!token) return null;

  try {
    const payload = buildTraktMediaPayload(media, progressPercent);
    const res = await fetch(`${TRAKT_API_URL}/scrobble/stop`, {
      method: 'POST',
      headers: getApiHeaders(token),
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      lastScrobbleAction = 'stop';
      lastScrobbleTime = Date.now();
      return await res.json();
    }
  } catch (err) {
    console.warn('Trakt scrobbleStop error:', err);
  }
  return null;
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
 */
export async function pushHistoryToTrakt(items) {
  const token = await getValidToken();
  if (!token || !items || !items.length) return null;

  const movies = [];
  const episodes = [];

  for (const item of items) {
    const tmdbId = item.id || item.tmdbId;
    if (!tmdbId) continue;

    const watchedAt = item.lastWatchedAt ? new Date(item.lastWatchedAt).toISOString() : new Date().toISOString();

    if (item.isSeries || item.type === 'tv' || item.season) {
      episodes.push({
        watched_at: watchedAt,
        ids: { tmdb: Number(tmdbId) },
        season: Number(item.season) || 1,
        number: Number(item.episode) || 1
      });
    } else {
      movies.push({
        watched_at: watchedAt,
        ids: { tmdb: Number(tmdbId) }
      });
    }
  }

  if (movies.length === 0 && episodes.length === 0) return null;

  const payload = {};
  if (movies.length > 0) payload.movies = movies;
  if (episodes.length > 0) payload.episodes = episodes;

  const res = await fetch(`${TRAKT_API_URL}/sync/history`, {
    method: 'POST',
    headers: getApiHeaders(token),
    body: JSON.stringify(payload)
  });

  if (!res.ok) return null;
  return await res.json();
}

/**
 * Full Two-Way Sync between CinePulse and Trakt.tv
 */
export async function performFullSync(storageMethods) {
  if (!isTraktConnected()) throw new Error('Trakt hesabı bağlı değil');

  const {
    getWatchHistory,
    saveWatchProgress,
    getWatchlist,
    toggleWatchlist,
    isWatchlist
  } = storageMethods;

  const syncResult = {
    pulledHistoryCount: 0,
    pulledWatchlistCount: 0,
    pushedHistoryCount: 0,
    errors: []
  };

  try {
    // 1. Pull Watchlist from Trakt
    const traktWatchlist = await fetchTraktWatchlist();
    if (Array.isArray(traktWatchlist)) {
      for (const item of traktWatchlist) {
        const media = item.movie || item.show;
        if (!media || !media.ids?.tmdb) continue;

        const tmdbId = media.ids.tmdb;
        const alreadyInWatchlist = isWatchlist(tmdbId);
        if (!alreadyInWatchlist) {
          toggleWatchlist({
            id: tmdbId,
            tmdbId: tmdbId,
            title: media.title,
            type: item.type === 'show' ? 'tv' : 'movie',
            isSeries: item.type === 'show',
            releaseDate: media.year ? `${media.year}-01-01` : ''
          });
          syncResult.pulledWatchlistCount++;
        }
      }
    }

    // 2. Pull Watched History from Trakt
    const traktHistory = await fetchTraktHistory(100);
    if (Array.isArray(traktHistory)) {
      for (const item of traktHistory) {
        let tmdbId = null;
        let title = '';
        let isSeries = false;
        let season = 1;
        let episode = 1;

        if (item.type === 'movie' && item.movie) {
          tmdbId = item.movie.ids?.tmdb;
          title = item.movie.title;
          isSeries = false;
        } else if (item.type === 'episode' && item.show) {
          tmdbId = item.show.ids?.tmdb;
          title = item.show.title;
          isSeries = true;
          season = item.episode?.season || 1;
          episode = item.episode?.number || 1;
        }

        if (tmdbId) {
          saveWatchProgress({
            id: tmdbId,
            title,
            type: isSeries ? 'tv' : 'movie',
            isSeries,
            season,
            episode,
            currentTime: 1000,
            duration: 1000,
            completed: true
          });
          syncResult.pulledHistoryCount++;
        }
      }
    }

    // 3. Push Local Completed History to Trakt
    const localHistory = getWatchHistory();
    const completedItems = (localHistory || []).filter(h => h.completed);
    if (completedItems.length > 0) {
      const pushRes = await pushHistoryToTrakt(completedItems.slice(0, 50));
      if (pushRes && pushRes.added) {
        syncResult.pushedHistoryCount = (pushRes.added.movies || 0) + (pushRes.added.episodes || 0);
      }
    }

    localStorage.setItem(STORAGE_KEYS.LAST_SYNC, String(Date.now()));
  } catch (err) {
    syncResult.errors.push(err.message || 'Senkronizasyon hatası');
    throw err;
  }

  return syncResult;
}
