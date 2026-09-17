/* ==========================================================================
   CinePulse Studio - P2P WebTorrent Client Engine
   Direct browser-to-browser P2P torrent streaming using WebRTC & WebSocket trackers:
   - Zero installation / zero software required by visitors
   - Real-time Swarm HUD (Seed count, Peer count, Download Speed, Progress)
   - Intelligent failover to cloud engine if WebRTC peers are unavailable
   ========================================================================== */

const WEBRTC_TRACKERS = [
  'wss://tracker.openwebtorrent.com',
  'wss://tracker.btorrent.xyz',
  'wss://tracker.webtorrent.dev',
  'wss://tracker.files.fm:7073/announce',
  'wss://spacetrackr.link:443/announce',
  'wss://tracker.fastcast.nz:443/announce'
];

let wtClient = null;
let activeTorrent = null;
let statsTimer = null;
let watchdogTimer = null;

export function formatBytes(bytes, decimals = 1) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

export function formatSpeed(bytesPerSec) {
  if (!bytesPerSec || bytesPerSec === 0) return '0 KB/s';
  if (bytesPerSec < 1024 * 1024) {
    return `${(bytesPerSec / 1024).toFixed(1)} KB/s`;
  }
  return `${(bytesPerSec / (1024 * 1024)).toFixed(2)} MB/s`;
}

/**
 * Lazy loads WebTorrent UMD library without blocking the main bundle
 */
export async function loadWebTorrentScript() {
  if (typeof window === 'undefined') return null;
  if (window.WebTorrent) return window.WebTorrent;

  return new Promise((resolve, reject) => {
    // Check if already injected
    const existingScript = document.querySelector('script[data-wt-loader]');
    if (existingScript) {
      existingScript.addEventListener('load', () => resolve(window.WebTorrent));
      existingScript.addEventListener('error', reject);
      return;
    }

    const script = document.createElement('script');
    script.src = './js/webtorrent.min.js';
    script.setAttribute('data-wt-loader', 'true');
    script.async = true;

    script.onload = () => {
      if (window.WebTorrent) {
        resolve(window.WebTorrent);
      } else {
        fallbackCdn();
      }
    };

    script.onerror = () => {
      fallbackCdn();
    };

    function fallbackCdn() {
      const cdnScript = document.createElement('script');
      cdnScript.src = 'https://cdn.jsdelivr.net/npm/webtorrent@latest/dist/webtorrent.min.js';
      cdnScript.onload = () => resolve(window.WebTorrent);
      cdnScript.onerror = () => reject(new Error('WebTorrent kütüphanesi yüklenemedi.'));
      document.head.appendChild(cdnScript);
    }

    document.head.appendChild(script);
  });
}

/**
 * Ensures a single shared WebTorrent client instance exists
 */
async function getWebTorrentClient() {
  if (wtClient && !wtClient.destroyed) return wtClient;

  const WebTorrentClass = await loadWebTorrentScript();
  if (!WebTorrentClass) throw new Error('WebTorrent tarayıcıda desteklenmiyor.');

  wtClient = new WebTorrentClass({
    tracker: {
      rtcConfig: {
        iceServers: [
          { urls: 'stun:stun.l.google.com:19302' },
          { urls: 'stun:global.stun.twilio.com:3478' }
        ]
      }
    }
  });

  wtClient.on('error', (err) => {
    console.warn('[WebTorrent P2P Client Error]:', err?.message || err);
  });

  return wtClient;
}

/**
 * Enhances a magnet URI with high-speed WebRTC trackers
 */
export function buildEnhancedMagnetUrl(rawMagnet) {
  if (!rawMagnet || !rawMagnet.startsWith('magnet:')) return rawMagnet;

  let enhanced = rawMagnet;
  for (const tr of WEBRTC_TRACKERS) {
    const encoded = encodeURIComponent(tr);
    if (!enhanced.includes(encoded) && !enhanced.includes(tr)) {
      enhanced += `&tr=${encoded}`;
    }
  }
  return enhanced;
}

/**
 * Starts streaming a torrent directly to an HTML5 video element
 */
export async function startTorrentStream({
  magnetUrl,
  videoElement,
  onStatusUpdate = () => {},
  onSuccess = () => {},
  onFailover = () => {}
}) {
  destroyTorrentStream();

  if (!magnetUrl) {
    onFailover('Geçersiz Magnet bağlantısı.');
    return;
  }

  const enhancedMagnet = buildEnhancedMagnetUrl(magnetUrl);

  onStatusUpdate({
    status: 'connecting',
    message: '⚡ P2P Swarm ağına bağlanılıyor...',
    peers: 0,
    downloadSpeed: '0 KB/s',
    progress: 0
  });

  try {
    const client = await getWebTorrentClient();
    if (!client) {
      onFailover('P2P motoru başlatılamadı.');
      return;
    }

    // Keep user informed about swarm search state without prematurely closing stream
    watchdogTimer = setTimeout(() => {
      if (activeTorrent && activeTorrent.numPeers === 0) {
        onStatusUpdate({
          status: 'searching',
          message: '⚡ WebRTC izleyicileri taranıyor... Eşler bağlanırken bekleyin.',
          peers: 0,
          downloadSpeed: '0 KB/s',
          progress: 0
        });
      }
    }, 8000);

    activeTorrent = client.add(enhancedMagnet, {
      announce: WEBRTC_TRACKERS
    });

    activeTorrent.on('warning', (err) => {
      console.warn('[P2P Swarm Warning]:', err?.message || err);
    });

    activeTorrent.on('error', (err) => {
      console.error('[P2P Swarm Error]:', err?.message || err);
      destroyTorrentStream();
      onFailover('P2P aktarım hatası oluştu.');
    });

    activeTorrent.on('ready', () => {
      if (!activeTorrent || !activeTorrent.files || activeTorrent.files.length === 0) {
        destroyTorrentStream();
        onFailover('Torrent içinde video dosyası bulunamadı.');
        return;
      }

      // Find largest video file (prefer MP4 / WebM for zero-transcode browser rendering)
      const videoFiles = activeTorrent.files.filter(f =>
        /\.(mp4|webm|mkv|mov|m4v)$/i.test(f.name)
      );

      if (videoFiles.length === 0) {
        destroyTorrentStream();
        onFailover('Torrent içinde desteklenen video formatı yok.');
        return;
      }

      // Sort by size
      videoFiles.sort((a, b) => b.length - a.length);
      const targetFile = videoFiles[0];

      onStatusUpdate({
        status: 'ready',
        message: `🎬 Video bulundu: ${targetFile.name} (${formatBytes(targetFile.length)})`,
        peers: activeTorrent.numPeers,
        downloadSpeed: formatSpeed(activeTorrent.downloadSpeed),
        progress: 0,
        fileName: targetFile.name,
        fileSize: formatBytes(targetFile.length)
      });

      try {
        targetFile.renderTo(videoElement, {
          autoplay: true,
          controls: false // CinePulse custom controls manage the video
        }, (err) => {
          if (err) {
            console.error('[P2P Render Error]:', err);
            destroyTorrentStream();
            onFailover('Tarayıcı video akışını çözemedi.');
            return;
          }
          if (watchdogTimer) {
            clearTimeout(watchdogTimer);
            watchdogTimer = null;
          }
          onSuccess(targetFile);
        });
      } catch (renderErr) {
        console.error('[P2P renderTo Exception]:', renderErr);
        destroyTorrentStream();
        onFailover('P2P video oynatma başlatılamadı.');
      }
    });

    // Swarm Stats Tick
    statsTimer = setInterval(() => {
      if (!activeTorrent) return;

      if (activeTorrent.downloaded > 0) {
        hasReceivedData = true;
        if (watchdogTimer) {
          clearTimeout(watchdogTimer);
          watchdogTimer = null;
        }
      }

      const peers = activeTorrent.numPeers || 0;
      const speed = formatSpeed(activeTorrent.downloadSpeed);
      const upSpeed = formatSpeed(activeTorrent.uploadSpeed);
      const progress = Math.min(100, Math.round((activeTorrent.progress || 0) * 100));

      onStatusUpdate({
        status: 'downloading',
        peers,
        downloadSpeed: speed,
        uploadSpeed: upSpeed,
        progress,
        downloaded: formatBytes(activeTorrent.downloaded),
        total: formatBytes(activeTorrent.length),
        message: peers > 0
          ? `⚡ P2P Aktif • ${peers} Eş • ${speed} • %${progress}`
          : '⚡ Seed aranıyor...'
      });
    }, 1000);

  } catch (err) {
    console.error('[P2P startTorrentStream Exception]:', err);
    destroyTorrentStream();
    onFailover(err.message || 'P2P motoru başlatılamadı.');
  }
}

/**
 * Completely terminates active torrent swarm and releases memory
 */
export function destroyTorrentStream() {
  if (watchdogTimer) {
    clearTimeout(watchdogTimer);
    watchdogTimer = null;
  }
  if (statsTimer) {
    clearInterval(statsTimer);
    statsTimer = null;
  }
  if (activeTorrent) {
    try {
      activeTorrent.destroy({ destroyStore: true });
    } catch (_) {}
    activeTorrent = null;
  }
}
