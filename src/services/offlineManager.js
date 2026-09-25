/* ==========================================================================
   CinePulse Studio - Offline Media Download Manager
   - Client-side offline downloads using CacheStorage + IndexedDB
   - Progress tracking, storage management, and offline video stream playback
   - Seamlessly plays downloaded movies/episodes without internet connection
   ========================================================================== */

const DB_NAME = 'cinepulse_offline_db';
const DB_VERSION = 1;
const STORE_NAME = 'downloads';
const CACHE_NAME = 'cinepulse-offline-media-v1';

let dbInstance = null;

function openDB() {
  if (dbInstance) return Promise.resolve(dbInstance);
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'key' });
        store.createIndex('tmdbId', 'tmdbId', { unique: false });
        store.createIndex('downloadedAt', 'downloadedAt', { unique: false });
      }
    };
    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
    };
    request.onerror = () => reject(request.error);
  });
}

function getItemKey(tmdbId, season = null, episode = null) {
  if (season !== null && episode !== null && season !== undefined && episode !== undefined) {
    return `${tmdbId}_s${season}_e${episode}`;
  }
  return String(tmdbId);
}

/**
 * Get list of all offline downloaded media
 */
export async function getDownloadedMediaList() {
  try {
    const db = await openDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.getAll();
      req.onsuccess = () => {
        const items = req.result || [];
        items.sort((a, b) => (b.downloadedAt || 0) - (a.downloadedAt || 0));
        resolve(items);
      };
      req.onerror = () => reject(req.error);
    });
  } catch (err) {
    console.error('getDownloadedMediaList error:', err);
    return [];
  }
}

/**
 * Check if a specific media item is already downloaded
 */
export async function isMediaDownloaded(tmdbId, season = null, episode = null) {
  try {
    const db = await openDB();
    const key = getItemKey(tmdbId, season, episode);
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const req = store.get(key);
      req.onsuccess = () => resolve(Boolean(req.result));
      req.onerror = () => resolve(false);
    });
  } catch (_) {
    return false;
  }
}

/**
 * Get offline playback URL (blob URL)
 */
export async function getDownloadedPlaybackUrl(tmdbId, season = null, episode = null) {
  try {
    const key = getItemKey(tmdbId, season, episode);
    if ('caches' in window) {
      const cache = await caches.open(CACHE_NAME);
      const response = await cache.match(`/offline/${key}`);
      if (response) {
        const blob = await response.blob();
        return URL.createObjectURL(blob);
      }
    }
    return null;
  } catch (err) {
    console.error('getDownloadedPlaybackUrl error:', err);
    return null;
  }
}

/**
 * Save / Download video stream for offline viewing with progress callback
 */
export async function startOfflineDownload(mediaData, onProgress = () => {}) {
  const { tmdbId, type, title, poster, backdrop, season, episode, streamUrl } = mediaData;
  if (!streamUrl) throw new Error('İndirilecek medya bağlantısı bulunamadı.');

  const key = getItemKey(tmdbId, season, episode);
  const cacheUrl = `/offline/${key}`;

  onProgress({ percent: 5, loaded: 0, total: 0, status: 'Başlatılıyor...' });

  try {
    const response = await fetch(streamUrl);
    if (!response.ok) throw new Error(`İndirme başarısız (${response.status})`);

    const contentLength = response.headers.get('content-length');
    const total = contentLength ? parseInt(contentLength, 10) : 0;
    let loaded = 0;

    let blob;
    if (response.body && total > 0) {
      const reader = response.body.getReader();
      const chunks = [];
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        loaded += value.length;
        const percent = Math.min(99, Math.round((loaded / total) * 100));
        onProgress({ percent, loaded, total, status: `%${percent} indiriliyor...` });
      }
      blob = new Blob(chunks, { type: response.headers.get('content-type') || 'video/mp4' });
    } else {
      onProgress({ percent: 50, loaded: 0, total: 0, status: 'Veri alınıyor...' });
      blob = await response.blob();
    }

    // Save to CacheStorage for fast zero-memory playback
    if ('caches' in window) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put(cacheUrl, new Response(blob, {
        headers: {
          'Content-Type': blob.type || 'video/mp4',
          'Content-Length': String(blob.size)
        }
      }));
    }

    // Save metadata to IndexedDB
    const db = await openDB();
    const itemRecord = {
      key,
      tmdbId: String(tmdbId),
      type: type || 'movie',
      title: title || 'İsimsiz İçerik',
      poster: poster || '',
      backdrop: backdrop || '',
      season: season !== null ? Number(season) : null,
      episode: episode !== null ? Number(episode) : null,
      sizeBytes: blob.size,
      downloadedAt: Date.now(),
      mimeType: blob.type || 'video/mp4'
    };

    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.put(itemRecord);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });

    onProgress({ percent: 100, loaded: blob.size, total: blob.size, status: 'Tamamlandı' });
    window.dispatchEvent(new CustomEvent('cinepulse_offline_changed', { detail: { action: 'add', key } }));
    return true;
  } catch (err) {
    console.error('Offline download failed:', err);
    throw err;
  }
}

/**
 * Delete a downloaded item and release device storage
 */
export async function deleteOfflineMedia(tmdbId, season = null, episode = null) {
  try {
    const key = getItemKey(tmdbId, season, episode);
    const db = await openDB();

    // 1. Delete from IndexedDB
    await new Promise((resolve, reject) => {
      const tx = db.transaction(STORE_NAME, 'readwrite');
      const store = tx.objectStore(STORE_NAME);
      const req = store.delete(key);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });

    // 2. Delete from CacheStorage
    if ('caches' in window) {
      const cache = await caches.open(CACHE_NAME);
      await cache.delete(`/offline/${key}`);
    }

    window.dispatchEvent(new CustomEvent('cinepulse_offline_changed', { detail: { action: 'delete', key } }));
    return true;
  } catch (err) {
    console.error('deleteOfflineMedia error:', err);
    return false;
  }
}

/**
 * Format bytes to readable string (e.g., 250 MB, 1.2 GB)
 */
export function formatBytes(bytes) {
  if (!bytes || bytes <= 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
}
