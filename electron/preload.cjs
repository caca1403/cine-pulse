/* CinePulse Desktop preload — renderer'a minimal, guvenli kopru.
 * platformBridge.js buradaki window.CinePulseDesktop bayragini gorur. */
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('CinePulseDesktop', {
  isDesktop: true,
  versions: {
    chrome: process.versions.chrome || '',
    electron: process.versions.electron || '',
    node: process.versions.node || ''
  },
  // Gizli WebView cozumu: Cloudflare'li sayfayi ghost window'da acar,
  // cozulmus HTML + cookie'leri dondurur.
  ghostResolve: (url, opts) =>
    ipcRenderer.invoke('cinepulse:ghost-resolve', url, opts || {}),
  // Kalici magaza: eklenti ac/kapa, pencere disi ayarlar (userData'da durur).
  storeGet: (key, fallback = null) =>
    ipcRenderer.invoke('cinepulse:store-get', key, fallback),
  storeSet: (key, value) => ipcRenderer.invoke('cinepulse:store-set', key, value),
  // Sistem tanılaması & servis kontrolü (Kurulum sihirbazı)
  getSystemInfo: () => ipcRenderer.invoke('cinepulse:get-system-info'),
  restartSidecar: () => ipcRenderer.invoke('cinepulse:restart-sidecar'),
  // Kurulum penceresi köprüsü (eksik bağımlılıklar için)
  setupOnProgress: (cb) => {
    const h = (_e, data) => { try { cb(data); } catch (_) {} };
    ipcRenderer.on('cinepulse:setup-progress', h);
    return () => ipcRenderer.removeListener('cinepulse:setup-progress', h);
  },
  setupAction: (action) => ipcRenderer.invoke('cinepulse:setup-action', action),
  // Masaüstü otomatik güncelleme (APK akışıyla aynı version.json)
  checkDesktopUpdate: (manual) => ipcRenderer.invoke('cinepulse:check-desktop-update', manual !== false),
  openReleasePage: () => ipcRenderer.invoke('cinepulse:open-release-page'),
  openVerificationPlayer: (options) => ipcRenderer.invoke('cinepulse:verification-player-open', options),
  positionVerificationPlayer: (options) => ipcRenderer.invoke('cinepulse:verification-player-bounds', options),
  closeVerificationPlayer: (requestId) => ipcRenderer.invoke('cinepulse:verification-player-close', requestId),
  onVerificationPlayerResolved: (callback) => {
    const handler = (_event, result) => callback(result);
    ipcRenderer.on('cinepulse:verification-player-resolved', handler);
    return () => ipcRenderer.removeListener('cinepulse:verification-player-resolved', handler);
  }
});
