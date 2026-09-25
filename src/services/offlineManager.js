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
let activeOfflineObjectUrls = [];

function getRecord(key) {
  return openDB().then(db => new Promise((resolve, reject) => {
    const req = db.transaction(STORE_NAME, 'readonly').objectStore(STORE_NAME).get(key);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  }));
}

function cacheRequest(key, index) {
  return new Request(new URL(`/__cinepulse_offline__/${encodeURIComponent(key)}/${index}`, location.origin));
}

function resolvePlaylistUrl(uri, baseUrl) {
  return new URL(uri, baseUrl).href;
}

async function saveHlsResource(cache, key, index, url, onProgress, progress) {
  let response = null;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      response = await fetch(url, { cache: 'no-store' });
      if (response && response.ok) break;
    } catch (err) {
      if (attempt === 2) throw err;
      await new Promise(r => setTimeout(r, 500 * (attempt + 1)));
    }
  }
  if (!response || !response.ok) throw new Error(`Bölüm parçası indirilemedi (HTTP ${response?.status || 'ağ hatası'})`);
  const blob = await response.blob();
  await cache.put(cacheRequest(key, index), new Response(blob, { headers: { 'Content-Type': response.headers.get('content-type') || 'application/octet-stream' } }));
  progress.loaded += blob.size;
  progress.done += 1;
  const pct = Math.min(98, 8 + Math.round((progress.done / progress.count) * 90));
  onProgress({ percent: pct, loaded: progress.loaded, total: 0, status: `%${pct} · ${progress.done}/${progress.count} parça` });
  return blob.size;
}

function getMasterVariant(text, baseUrl) {
  const lines = text.split(/\r?\n/);
  const variants = [];
  for (let i = 0; i < lines.length; i += 1) {
    if (!lines[i].startsWith('#EXT-X-STREAM-INF:')) continue;
    const bandwidth = Number(lines[i].match(/(?:AVERAGE-)?BANDWIDTH=(\d+)/)?.[1]) || 0;
    const uri = lines.slice(i + 1).find(line => line && !line.startsWith('#'));
    if (uri) variants.push({ bandwidth, url: resolvePlaylistUrl(uri.trim(), baseUrl) });
  }
  return variants.sort((a, b) => b.bandwidth - a.bandwidth)[0]?.url || null;
}

async function downloadHlsBundle(cache, key, response, firstText, onProgress) {
  let playlistUrl = response.url || response.url;
  let playlistText = firstText;
  let mediaUrl = getMasterVariant(playlistText, playlistUrl);
  let depth = 0;
  while (mediaUrl && depth < 3) {
    depth++;
    const mediaResponse = await fetch(mediaUrl, { cache: 'no-store' });
    if (!mediaResponse.ok) throw new Error(`Bölüm listesi alınamadı (HTTP ${mediaResponse.status})`);
    playlistUrl = mediaResponse.url || mediaUrl;
    playlistText = await mediaResponse.text();
    mediaUrl = getMasterVariant(playlistText, playlistUrl);
  }
  if (!playlistText.includes('#EXT-X-ENDLIST')) {
    playlistText += '\n#EXT-X-ENDLIST\n';
  }
  if (playlistText.includes('#EXT-X-BYTERANGE')) throw new Error('Bu kaynak parçalı byte aralığı kullanıyor; başka bir yayın hattı seçin.');

  const lines = playlistText.split(/\r?\n/);
  const resourceCount = lines.filter(line => line && !line.startsWith('#')).length
    + (playlistText.match(/#EXT-X-(?:KEY|MAP):[^\n]*URI="[^"]+"/g) || []).length;
  if (!resourceCount) throw new Error('Bu bölümde indirilebilir video parçası bulunamadı.');
  const progress = { done: 0, count: resourceCount, loaded: 0 };
  const resourceKeys = [];
  let resourceIndex = 0;
  const resourceToken = async (url) => {
    const index = resourceIndex++;
    await saveHlsResource(cache, key, index, url, onProgress, progress);
    resourceKeys.push(index);
    return `__CP_OFFLINE_RESOURCE_${index}__`;
  };

  const rewritten = [];
  for (const line of lines) {
    if (!line) { rewritten.push(line); continue; }
    if (line.startsWith('#EXT-X-BYTERANGE')) throw new Error('Bu kaynak parçalı byte aralığı kullanıyor; başka bir yayın hattı seçin.');
    if (line.startsWith('#EXT-X-KEY:') || line.startsWith('#EXT-X-MAP:')) {
      const match = line.match(/URI="([^"]+)"/);
      if (match) {
        const token = await resourceToken(resolvePlaylistUrl(match[1], playlistUrl));
        rewritten.push(line.replace(match[0], `URI="${token}"`));
      } else rewritten.push(line);
      continue;
    }
    if (!line.startsWith('#')) rewritten.push(await resourceToken(resolvePlaylistUrl(line.trim(), playlistUrl)));
    else rewritten.push(line);
  }

  return { playlistTemplate: rewritten.join('\n'), resourceKeys, sizeBytes: progress.loaded };
}

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
    const record = await getRecord(key);
    if (!record || !('caches' in window)) return null;
    const cache = await caches.open(CACHE_NAME);
    if (record.mediaKind === 'hls') {
      let manifest = record.playlistTemplate || '';
      for (const index of record.resourceKeys || []) {
        const response = await cache.match(cacheRequest(key, index));
        if (!response) throw new Error('İndirilen bölüm dosyası eksik.');
        const url = URL.createObjectURL(await response.blob());
        activeOfflineObjectUrls.push(url);
        manifest = manifest.replaceAll(`__CP_OFFLINE_RESOURCE_${index}__`, url);
      }
      const url = URL.createObjectURL(new Blob([manifest], { type: 'application/vnd.apple.mpegurl' }));
      activeOfflineObjectUrls.push(url);
      return url;
    }
    const response = await cache.match(`/offline/${key}`);
    if (response) {
      const url = URL.createObjectURL(await response.blob());
      activeOfflineObjectUrls.push(url);
      return url;
    }
    return null;
  } catch (err) {
    console.error('getDownloadedPlaybackUrl error:', err);
    return null;
  }
}

export function releaseDownloadedPlaybackUrls() {
  activeOfflineObjectUrls.forEach(url => { try { URL.revokeObjectURL(url); } catch (_) {} });
  activeOfflineObjectUrls = [];
}

/**
 * Save / Download video stream for offline viewing with progress callback
 */
export async function startOfflineDownload(mediaData, onProgress = () => {}) {
  const { tmdbId, type, title, poster, backdrop, season, episode, streamUrl } = mediaData;
  if (!streamUrl) throw new Error('İndirilecek medya bağlantısı bulunamadı.');
  if (!('caches' in window)) throw new Error('Bu cihaz çevrimdışı depolamayı desteklemiyor.');

  const key = getItemKey(tmdbId, season, episode);
  const cacheUrl = `/offline/${key}`;

  onProgress({ percent: 5, loaded: 0, total: 0, status: 'Başlatılıyor...' });

  try {
    const response = await fetch(streamUrl, { cache: 'no-store' });
    if (!response.ok) throw new Error(`İndirme başarısız (${response.status})`);

    const contentType = response.headers.get('content-type') || '';
    const isHls = /mpegurl|vnd\.apple\.mpegurl/i.test(contentType) || /\.m3u8(?:[?#]|$)/i.test(streamUrl);
    if (isHls) {
      const firstText = await response.text();
      if (!firstText.includes('#EXTM3U')) throw new Error('Kaynak HLS bölüm akışı döndürmedi.');
      const cache = await caches.open(CACHE_NAME);
      const bundle = await downloadHlsBundle(cache, key, response, firstText, onProgress);
      const db = await openDB();
      const itemRecord = {
        key, tmdbId: String(tmdbId), type: type || 'tv', title: title || 'İsimsiz İçerik', poster: poster || '', backdrop: backdrop || '',
        season: season !== null ? Number(season) : null, episode: episode !== null ? Number(episode) : null,
        sizeBytes: bundle.sizeBytes, downloadedAt: Date.now(), mediaKind: 'hls',
        playlistTemplate: bundle.playlistTemplate, resourceKeys: bundle.resourceKeys
      };
      await new Promise((resolve, reject) => {
        const req = db.transaction(STORE_NAME, 'readwrite').objectStore(STORE_NAME).put(itemRecord);
        req.onsuccess = resolve; req.onerror = () => reject(req.error);
      });
      onProgress({ percent: 100, loaded: bundle.sizeBytes, total: bundle.sizeBytes, status: 'Tamamlandı' });
      window.dispatchEvent(new CustomEvent('cinepulse_offline_changed', { detail: { action: 'add', key } }));
      return true;
    }

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
      mimeType: blob.type || 'video/mp4',
      mediaKind: 'file'
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
    try {
      const cache = await caches.open(CACHE_NAME);
      const prefix = new URL(`/__cinepulse_offline__/${encodeURIComponent(key)}/`, location.origin).href;
      await Promise.all((await cache.keys()).filter(request => request.url.startsWith(prefix)).map(request => cache.delete(request)));
    } catch (_) {}
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
    const existing = await getRecord(key);

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
      for (const index of existing?.resourceKeys || []) await cache.delete(cacheRequest(key, index));
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
