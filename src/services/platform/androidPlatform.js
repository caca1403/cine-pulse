/* ==========================================================================
   CinePulse Studio - Android Platform Controller (Sadece Native APK'da Yüklenir)
   ========================================================================== */

import { App } from '@capacitor/app';
import { initAppUpdater } from '../appUpdater.js';

export async function initAndroidPlatform() {
  console.log('[Platform] Native Android (Capacitor) ortamı etkinleştirildi.');

  // 1. Native API Fetch Origin Yönlendirmesi
  // APK ortamında Capacitor WebView https://localhost çalıştığından
  // göreceli /api isteklerinin Vercel sunucusuna yönlendirilmesi gerekir.
  const nativeFetch = window.fetch.bind(window);
  const apiOrigin = 'https://cine-pulse-drab.vercel.app';
  window.fetch = (input, init) => {
    if (typeof input === 'string' && input.startsWith('/api/')) {
      input = `${apiOrigin}${input}`;
    } else if (input instanceof URL && input.origin === window.location.origin && input.pathname.startsWith('/api/')) {
      input = `${apiOrigin}${input.pathname}${input.search}${input.hash}`;
    } else if (typeof Request !== 'undefined' && input instanceof Request) {
      const url = new URL(input.url);
      if (url.origin === window.location.origin && url.pathname.startsWith('/api/')) {
        input = new Request(`${apiOrigin}${url.pathname}${url.search}${url.hash}`, input);
      }
    }
    return nativeFetch(input, init);
  };

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

  // 3. Çevrimdışı bağlantı koptuğunda indirilenler ekranına otomatik yönlendirme
  window.addEventListener('offline', () => {
    if (window.location.hash !== '#downloads') {
      window.location.hash = '#downloads';
    }
  });

  if (typeof navigator !== 'undefined' && navigator.onLine === false && window.location.hash !== '#downloads') {
    window.location.hash = '#downloads';
  }

  // 4. In-App Otomatik Güncelleyiciyi Başlat (GitHub Releases kontrolü)
  try {
    initAppUpdater();
  } catch (err) {
    console.warn('[Platform] App updater başlatılamadı:', err);
  }
}
