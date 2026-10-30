/* ==========================================================================
   CinePulse Studio - Android Platform Controller (Sadece Native APK'da Yüklenir)
   ========================================================================== */

import { App } from '@capacitor/app';
import { initAppUpdater } from '../kabuk/appUpdater.js';

export async function initAndroidPlatform() {
  console.log('[Platform] Native Android (Capacitor) ortamı etkinleştirildi.');

  // API ve medya istekleri cihazdaki gateway'e gider.
  // Geçit henüz hazır değilse 10 sn boyunca tekrar dene; asla
  // transportsuz devam etme (o zaman Vercel'e düşme riski var).
  const { installAndroidTransport } = await import('./androidTransport.js');
  let sonHata = null;
  for (let i = 0; i < 20; i++) {
    try {
      installAndroidTransport();
      sonHata = null;
      break;
    } catch (e) {
      sonHata = e;
      await new Promise((r) => setTimeout(r, 500));
    }
  }
  if (sonHata) throw sonHata;

  // 2. Android Donanım Geri Tuşu (Hardware Back-Button) Desteği
  try {
    App.addListener('backButton', ({ canGoBack }) => {
      // Açık video oynatıcı varsa önce onu kapat
      const playerContainer = document.getElementById('player-modal-container') || document.querySelector('.player-modal-overlay');
      if (playerContainer) {
        const closeBtn = document.getElementById('player-close-btn');
        if (closeBtn) closeBtn.click();
        else playerContainer.remove();
        return;
      }

      // Açık herhangi bir modal/diyalog varsa kapat
      const openModal = document.querySelector('.modal-overlay, .decision-modal-overlay, .profile-modal-overlay, .data-manager-modal');
      if (openModal) {
        const closeBtn = openModal.querySelector('.modal-close, .btn-modal-close, [data-action="close"]');
        if (closeBtn) closeBtn.click();
        else openModal.remove();
        return;
      }

      // Ana sayfada değilse ana sayfaya dön veya tarayıcı geçmişinde geri git
      const currentHash = window.location.hash || '#home';
      if (currentHash !== '#home' && currentHash !== '') {
        if (canGoBack) {
          window.history.back();
        } else {
          window.location.hash = '#home';
        }
        return;
      }

      // Ana sayfadaysa uygulamadan çık
      App.exitApp();
    });
  } catch (err) {
    console.warn('[Platform] Android backButton dinleyicisi eklenemedi:', err);
  }

  // 4. In-App Otomatik Güncelleyiciyi Başlat (GitHub Releases kontrolü)
  try {
    initAppUpdater();
  } catch (err) {
    console.warn('[Platform] App updater başlatılamadı:', err);
  }
}
