/* ==========================================================================
   CinePulse Studio - Web Platform Controller (Sadece Web / PWA'da Yüklenir)
   ========================================================================== */

import { initPwa } from '../pwaManager.js';

export async function initWebPlatform() {
  console.log('[Platform] Web / PWA ortamı etkinleştirildi.');

  // 1. Service Worker Kaydı ve Güncelleme Takibi
  if ('serviceWorker' in navigator && window.location.protocol.startsWith('http')) {
    window.addEventListener('load', () => {
      const workerBuild = '20260920-mobile-preview-2';
      const reloadMarker = `cinepulse-sw-reloaded-${workerBuild}`;

      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (sessionStorage.getItem(reloadMarker)) return;
        sessionStorage.setItem(reloadMarker, '1');
        window.location.reload();
      });

      navigator.serviceWorker.register(`/sw.js?build=${workerBuild}`, { updateViaCache: 'none' })
        .then((registration) => registration.update())
        .catch(() => {});
    });
  }

  // 2. PWA Kurulum Olaylarını Başlat
  try {
    initPwa();
  } catch (err) {
    console.warn('[Platform] PWA başlatılamadı:', err);
  }
}
