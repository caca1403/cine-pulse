/* ==========================================================================
   CinePulse Studio - Desktop Platform Controller (Sadece DEB / EXE'de Yüklenir)
   Cloudstream eklenti yönetimi + Nuvio masaüstü oynatıcı standartları
   ========================================================================== */

import { showToast } from '../../components/Toast.js';

export async function initDesktopPlatform() {
  console.log('[Platform] Desktop (Electron DEB/EXE) ortamı etkinleştirildi.');

  // 1. Masaüstü HTML Sınıfı ve Pencere Yapısı
  document.documentElement.classList.add('desktop-app');
  document.body.classList.add('desktop-runtime');

  // 2. Klavye Kısayolları (Masaüstü Standartları - Space, F, Ok Tuşları, ESC)
  attachDesktopKeyboardShortcuts();

  // 3. Yerel Medya Servisi (Sidecar: 4000 portu) Bağlantı Kontrolü
  checkDesktopSidecarHealth();

  // 4. Cloudstream Tarzı Kayıtlı Eklenti/Provider Durumunu Geri Yükle
  try {
    const { loadPersistedProviderState } = await import('../providers/providerRegistry.js');
    await loadPersistedProviderState();
  } catch (err) {
    console.warn('[DesktopPlatform] Provider durumu yüklenirken hata:', err);
  }

  // 5. İlk Çalıştırma / Kurulum Sihirbazı Kontrolü
  // SADECE ve SADECE Masaüstü (DEB/EXE) ortamında ilk açılışta açılır!
  // Web veya APK ortamlarında bu kod asla çalışmaz.
  if (!localStorage.getItem('cp_setup_done_v1')) {
    setTimeout(async () => {
      try {
        const { openSetupWizardModal } = await import('../../components/SetupWizardModal.js');
        openSetupWizardModal();
      } catch (e) {
        console.warn('[DesktopPlatform] Setup wizard açılamadı:', e);
      }
    }, 300);
  }
}

/**
 * Masaüstü ortamında global klavye kısayollarını dinler.
 */
function attachDesktopKeyboardShortcuts() {
  if (typeof window === 'undefined') return;

  window.addEventListener('keydown', (e) => {
    // Form alanlarında veya input/textarea içindeyken kısayolları engelle
    const targetTag = e.target?.tagName?.toLowerCase();
    if (targetTag === 'input' || targetTag === 'textarea' || e.target?.isContentEditable) {
      return;
    }

    const videoEl = document.getElementById('hls-video-player');
    const playerModal = document.getElementById('player-modal');
    const isPlayerOpen = playerModal && !playerModal.classList.contains('hidden');

    // F veya F11: Tam Ekran Geçişi
    if (e.key === 'f' || e.key === 'F') {
      if (isPlayerOpen) {
        e.preventDefault();
        const fsBtn = document.getElementById('custom-btn-fullscreen') || document.getElementById('btn-player-fullscreen');
        if (fsBtn) fsBtn.click();
      }
    }

    // ESC: Oynatıcıyı veya açık modalları kapat
    if (e.key === 'Escape') {
      const wizardOverlay = document.getElementById('setup-wizard-modal-overlay');
      if (wizardOverlay) {
        // Kurulum sihirbazı açıksa kapat
        wizardOverlay.remove();
        return;
      }

      if (isPlayerOpen) {
        const closeBtn = document.getElementById('player-close-btn');
        if (closeBtn) closeBtn.click();
        return;
      }

      const activeModal = document.querySelector('.modal-overlay:not(.hidden), .decision-modal-overlay');
      if (activeModal) {
        const close = activeModal.querySelector('.modal-close, .btn-modal-close');
        if (close) close.click();
        else activeModal.remove();
      }
    }

    // Boşluk (Space) veya K: Oynat / Duraklat
    if ((e.code === 'Space' || e.key === 'k' || e.key === 'K') && isPlayerOpen && videoEl) {
      e.preventDefault();
      if (videoEl.paused) videoEl.play().catch(() => {});
      else videoEl.pause();
    }

    // Sağ Ok: 10 saniye ileri
    if (e.key === 'ArrowRight' && isPlayerOpen && videoEl) {
      e.preventDefault();
      videoEl.currentTime = Math.min(videoEl.duration || 0, videoEl.currentTime + 10);
    }

    // Sol Ok: 10 saniye geri
    if (e.key === 'ArrowLeft' && isPlayerOpen && videoEl) {
      e.preventDefault();
      videoEl.currentTime = Math.max(0, videoEl.currentTime - 10);
    }

    // M: Sesi Aç / Kapat
    if ((e.key === 'm' || e.key === 'M') && isPlayerOpen && videoEl) {
      e.preventDefault();
      videoEl.muted = !videoEl.muted;
    }

    // Yukarı / Aşağı Ok: Ses Seviyesi Artır / Azalt
    if (e.key === 'ArrowUp' && isPlayerOpen && videoEl) {
      e.preventDefault();
      videoEl.volume = Math.min(1, videoEl.volume + 0.1);
    }
    if (e.key === 'ArrowDown' && isPlayerOpen && videoEl) {
      e.preventDefault();
      videoEl.volume = Math.max(0, videoEl.volume - 0.1);
    }
  });
}

/**
 * Yerel sidecar servisi (port 4000) canlılığını arka planda kontrol eder.
 */
async function checkDesktopSidecarHealth() {
  try {
    const res = await fetch('http://127.0.0.1:4000/health', { signal: AbortSignal.timeout(3000) }).catch(() => null);
    if (!res || !res.ok) {
      console.warn('[DesktopPlatform] Yerel medya servisi (port 4000) yanıt vermedi. Yeniden bağlanılıyor...');
      if (window.CinePulseDesktop?.restartSidecar) {
        await window.CinePulseDesktop.restartSidecar();
      }
    } else {
      console.log('[DesktopPlatform] Yerel medya servisi (port 4000) aktif ve hazır.');
    }
  } catch (_) {}
}
