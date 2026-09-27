import { apiUrl } from './apiOrigin.js';

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

async function fetchWithTimeout(url, options = {}, timeoutMs = 120000) {
  const controller = new AbortController();
  const parentSignal = options.signal;
  const abortFromParent = () => controller.abort();
  if (parentSignal?.aborted) throw new Error('İndirme iptal edildi');
  parentSignal?.addEventListener('abort', abortFromParent, { once: true });
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (err) {
    if (parentSignal?.aborted) throw new Error('İndirme iptal edildi');
    if (timedOut) throw new Error('Yayın kaynağı yanıt vermedi. İndirme durduruldu.');
    throw err;
  } finally {
    clearTimeout(timer);
    parentSignal?.removeEventListener('abort', abortFromParent);
  }
}

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

export function extractTargetAndRef(urlStr) {
  if (!urlStr || typeof urlStr !== 'string') return { target: null, ref: null };
  try {
    const raw = urlStr.startsWith('http') ? urlStr : `http://localhost${urlStr.startsWith('/') ? '' : '/'}${urlStr}`;
    const u = new URL(raw);
    const target = u.searchParams.get('url');
    const ref = u.searchParams.get('ref');
    return {
      // URLSearchParams already percent-decodes values. Decoding again corrupts
      // signed CDN URLs that contain encoded query parameters.
      target: target || null,
      ref: ref || null
    };
  } catch (_) {
    return { target: null, ref: null };
  }
}

// Android WebView's StorageManager/StatFs bridge reports real device storage.
// Browsers intentionally expose only origin quota, so use that as a fallback.
export async function getDeviceStorageInfo() {
  try {
    const nativeInfo = window.CinePulseNative?.getDeviceStorageInfo?.();
    if (nativeInfo) {
      const parsed = JSON.parse(nativeInfo);
      if (Number.isFinite(parsed.total) && Number.isFinite(parsed.free)) return parsed;
    }
  } catch (_) {}
  try {
    const { quota = 0, usage = 0 } = await navigator.storage.estimate();
    return { total: quota, free: Math.max(0, quota - usage), isOriginQuota: true };
  } catch (_) {
    return { total: 0, free: 0, isOriginQuota: true };
  }
}

export function resolvePlaylistUrl(uri, baseUrl) {
  const cleanUri = (uri || '').trim();
  if (!cleanUri) return '';
  if (cleanUri.startsWith('/api/hls_proxy?')) return apiUrl(cleanUri);
  if (/^https?:\/\//i.test(cleanUri) && cleanUri.includes('/api/hls_proxy?')) return cleanUri;
  try {
    const { target, ref } = extractTargetAndRef(baseUrl);
    const resolvedUpstream = new URL(cleanUri, target || baseUrl).href;
    if (resolvedUpstream.includes('/api/hls_proxy?')) return resolvedUpstream;
    return apiUrl(`/api/hls_proxy?url=${encodeURIComponent(resolvedUpstream)}${ref ? `&ref=${encodeURIComponent(ref)}` : ''}`);
  } catch (_) {
    return cleanUri;
  }
}

function getOfflineFetchUrl(streamUrl) {
  if (streamUrl.startsWith('/api/')) return apiUrl(streamUrl);
  if (!/^https?:\/\//i.test(streamUrl)) return streamUrl;
  if (streamUrl.includes('/api/hls_proxy?')) return streamUrl;
  const { target, ref } = extractTargetAndRef(streamUrl);
  const targetUrl = target || streamUrl;
  const isHls = /\.m3u8(?:[?#]|$)/i.test(targetUrl);
  return apiUrl(`/api/hls_proxy?url=${encodeURIComponent(targetUrl)}${ref ? `&ref=${encodeURIComponent(ref)}` : ''}${isHls ? '' : '&download=1'}`);
}

/**
 * Triggers native download on Android device (via DownloadListener / 1DM / ADM / Browser)
 */
export function triggerNativeDeviceDownload(streamUrl, filename = 'video.mp4') {
  if (!streamUrl) return false;
  
  const downloadUrl = typeof streamUrl === 'string' && streamUrl.startsWith('/api/')
    ? apiUrl(streamUrl)
    : streamUrl;

  try {
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.setAttribute('download', filename);
    a.setAttribute('target', '_blank');
    a.rel = 'noopener noreferrer';
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { try { a.remove(); } catch (_) {} }, 1000);
    return true;
  } catch (_) {
    try {
      window.open(downloadUrl, '_system');
      return true;
    } catch (_) {
      window.location.href = downloadUrl;
      return true;
    }
  }
}

async function saveHlsResource(cache, key, index, url, onProgress, progress, signal = null) {
  if (signal?.aborted) throw new Error('İndirme iptal edildi');
  let response = null;
  const { target, ref } = extractTargetAndRef(url);
  const attempts = [];

  // Go through CinePulse's same-origin API relay so provider CORS restrictions
  // cannot send users out of the app or prevent saving segments offline.
  const fullUrl = url.startsWith('/api/') ? apiUrl(url) : url;
  attempts.push(fullUrl);
  if (target && /^https?:\/\//i.test(target)) {
    attempts.push(apiUrl(`/api/hls_proxy?url=${encodeURIComponent(target)}${ref ? `&ref=${encodeURIComponent(ref)}` : ''}`));
  } else if (!url.includes('/api/hls_proxy')) {
    attempts.push(getOfflineFetchUrl(url));
  }

  let lastError = null;
  for (let attempt = 0; attempt < attempts.length; attempt++) {
    if (signal?.aborted) throw new Error('İndirme iptal edildi');
    const targetUrl = attempts[attempt];
    try {
      response = await fetchWithTimeout(targetUrl, { cache: 'no-store', signal });
      if (response && response.ok) break;
    } catch (err) {
      if (err.name === 'AbortError' || signal?.aborted) throw new Error('İndirme iptal edildi');
      lastError = err;
      if (attempt < attempts.length - 1) {
        await new Promise(r => setTimeout(r, 250 * (attempt + 1)));
      }
    }
  }
  if (!response || !response.ok) {
    throw new Error(`Bölüm parçası indirilemedi (HTTP ${response?.status || lastError?.message || 'ağ hatası'})`);
  }
  const blob = await response.blob();
  await cache.put(cacheRequest(key, index), new Response(blob, {
    headers: { 'Content-Type': response.headers.get('content-type') || 'application/octet-stream' }
  }));
  progress.loaded += blob.size;
  progress.done += 1;
  onProgress({ percent: 0, loaded: progress.loaded, total: 0, done: progress.done, count: progress.count, status: `${progress.done}/${progress.count} parça alındı` });
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
  if (!variants.length) return null;
  // Pick optimal mobile bandwidth ~1.8Mbps to 3Mbps (not excessive 4K/10Mbps that exhausts memory)
  variants.sort((a, b) => {
    const targetBw = 2200000;
    return Math.abs(a.bandwidth - targetBw) - Math.abs(b.bandwidth - targetBw);
  });
  return variants[0]?.url || null;
}

async function downloadHlsBundle(cache, key, response, firstText, onProgress, signal = null) {
  let playlistUrl = response.url || response.url;
  let playlistText = firstText;
  let mediaUrl = getMasterVariant(playlistText, playlistUrl);
  let depth = 0;
  while (mediaUrl && depth < 3) {
    if (signal?.aborted) throw new Error('İndirme iptal edildi');
    depth++;
    const mediaResponse = await fetchWithTimeout(mediaUrl, { cache: 'no-store', signal });
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
  const itemsToFetch = [];
  const rewritten = [];
  let resourceIndex = 0;

  for (const line of lines) {
    if (!line) { rewritten.push(line); continue; }
    if (line.startsWith('#EXT-X-BYTERANGE')) throw new Error('Bu kaynak parçalı byte aralığı kullanıyor; başka bir yayın hattı seçin.');
    if (line.startsWith('#EXT-X-KEY:') || line.startsWith('#EXT-X-MAP:')) {
      const match = line.match(/URI="([^"]+)"/);
      if (match) {
        const idx = resourceIndex++;
        const resUrl = resolvePlaylistUrl(match[1], playlistUrl);
        itemsToFetch.push({ index: idx, url: resUrl });
        rewritten.push(line.replace(match[0], `URI="__CP_OFFLINE_RESOURCE_${idx}__"`));
      } else {
        rewritten.push(line);
      }
      continue;
    }
    if (!line.startsWith('#')) {
      const idx = resourceIndex++;
      const resUrl = resolvePlaylistUrl(line.trim(), playlistUrl);
      itemsToFetch.push({ index: idx, url: resUrl });
      rewritten.push(`__CP_OFFLINE_RESOURCE_${idx}__`);
    } else {
      rewritten.push(line);
    }
  }

  const resourceCount = itemsToFetch.length;
  if (!resourceCount) throw new Error('Bu bölümde indirilebilir video parçası bulunamadı.');

  const progress = { done: 0, count: resourceCount, loaded: 0 };
  const resourceKeys = itemsToFetch.map(item => item.index);

  // Parallel pool with 4 concurrent workers
  const CONCURRENCY = 4;
  let cursor = 0;
  async function worker() {
    while (cursor < itemsToFetch.length) {
      if (signal?.aborted) throw new Error('İndirme iptal edildi');
      const current = itemsToFetch[cursor++];
      if (!current) break;
      await saveHlsResource(cache, key, current.index, current.url, onProgress, progress, signal);
    }
  }

  const workers = Array.from({ length: Math.min(CONCURRENCY, itemsToFetch.length) }, () => worker());
  await Promise.all(workers);

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
export async function startOfflineDownload(mediaData, onProgress = () => {}, signal = null) {
  const { tmdbId, type, title, seriesTitle = '', poster, backdrop, season, episode, streamUrl } = mediaData;
  if (!streamUrl) throw new Error('İndirilecek medya bağlantısı bulunamadı.');
  if (!('caches' in window)) throw new Error('Bu cihaz çevrimdışı depolamayı desteklemiyor.');

  if (typeof navigator !== 'undefined' && navigator.storage && navigator.storage.persist) {
    try { await navigator.storage.persist(); } catch (_) {}
  }

  const key = getItemKey(tmdbId, season, episode);
  const cacheUrl = `/offline/${key}`;

  const safeStreamUrl = getOfflineFetchUrl(streamUrl);
  onProgress({ percent: 5, loaded: 0, total: 0, status: 'Başlatılıyor...' });

  try {
    if (signal?.aborted) throw new Error('İndirme iptal edildi');
    const response = await fetchWithTimeout(safeStreamUrl, { cache: 'no-store', signal });
    if (!response.ok) throw new Error(`İndirme başarısız (${response.status})`);

    const contentType = response.headers.get('content-type') || '';
    const isHls = /mpegurl|vnd\.apple\.mpegurl/i.test(contentType) || /\.m3u8(?:[?#]|$)/i.test(streamUrl) || /\.m3u8(?:[?#]|$)/i.test(safeStreamUrl);
    if (isHls) {
      const firstText = await response.text();
      if (!firstText.includes('#EXTM3U')) throw new Error('Kaynak HLS bölüm akışı döndürmedi.');
      const cache = await caches.open(CACHE_NAME);
      const bundle = await downloadHlsBundle(cache, key, response, firstText, onProgress, signal);
      const db = await openDB();
      const itemRecord = {
        key, tmdbId: String(tmdbId), type: type || 'tv', title: title || 'İsimsiz İçerik', seriesTitle: seriesTitle || '', poster: poster || '', backdrop: backdrop || '',
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
        if (signal?.aborted) throw new Error('İndirme iptal edildi');
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        loaded += value.length;
        const percent = Math.min(99, Math.round((loaded / total) * 100));
        onProgress({ percent, loaded, total, status: `%${percent} indiriliyor...` });
        // Some providers send the complete Content-Length but leave the
        // connection open, so reader.read() never returns `done: true`.
        // The declared byte count is authoritative; close the reader and
        // continue committing the completed file once all bytes arrived.
        if (loaded >= total) {
          reader.cancel().catch(() => {});
          break;
        }
      }
      blob = new Blob(chunks, { type: response.headers.get('content-type') || 'video/mp4' });
    } else if (response.body) {
      const reader = response.body.getReader();
      const chunks = [];
      while (true) {
        if (signal?.aborted) throw new Error('İndirme iptal edildi');
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        loaded += value.length;
        onProgress({ percent: 0, loaded, total: 0, status: `${formatBytes(loaded)} alındı` });
      }
      blob = new Blob(chunks, { type: response.headers.get('content-type') || 'video/mp4' });
    } else {
      blob = await response.blob();
      loaded = blob.size;
      onProgress({ percent: 0, loaded, total: 0, status: `${formatBytes(loaded)} alındı` });
    }

    if (signal?.aborted) throw new Error('İndirme iptal edildi');
    onProgress({ percent: 99, loaded: blob.size, total: total || blob.size, status: 'İndirme tamamlandı, cihaz depolamasına yazılıyor…' });

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
    onProgress({ percent: 99, loaded: blob.size, total: total || blob.size, status: 'Video kaydedildi, İndirilenler listesi güncelleniyor…' });

    // Save metadata to IndexedDB
    const db = await openDB();
    const itemRecord = {
      key,
      tmdbId: String(tmdbId),
      type: type || 'movie',
      title: title || 'İsimsiz İçerik',
      seriesTitle: seriesTitle || '',
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
      await cache.delete(cacheUrl);
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
