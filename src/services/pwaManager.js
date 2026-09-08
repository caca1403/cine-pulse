/* ==========================================================================
   CinePulse PWA Install Manager & Service Worker Controller
   ========================================================================== */

import { showToast } from '../components/Toast.js';

let deferredPrompt = null;
let isInstalled = false;

// Check if already running in standalone PWA mode
export function isPwaMode() {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true ||
    document.referrer.includes('android-app://')
  );
}

export function initPwa() {
  if (isPwaMode()) {
    isInstalled = true;
    updatePwaButtons(false);
    return;
  }

  // Capture beforeinstallprompt event (Chromium, Android, Edge, Desktop Chrome)
  window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent default browser mini-infobar
    e.preventDefault();
    deferredPrompt = e;
    console.log('[PWA] beforeinstallprompt captured!');
    updatePwaButtons(true);
  });

  // App installed event
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    isInstalled = true;
    updatePwaButtons(false);
    showToast('CinePulse başarıyla cihazınıza yüklendi!', 'success');
  });

  // Check display-mode changes dynamically
  window.matchMedia('(display-mode: standalone)').addEventListener('change', (e) => {
    if (e.matches) {
      isInstalled = true;
      updatePwaButtons(false);
    }
  });

  // Check iOS device
  const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  if (isIos && !isPwaMode()) {
    // On iOS Safari, beforeinstallprompt never fires, but we can still guide user to Add to Home Screen
    setTimeout(() => {
      updatePwaButtons(true);
    }, 1000);
  }
}

export function updatePwaButtons(visible) {
  const buttons = document.querySelectorAll('.btn-pwa-install');
  buttons.forEach((btn) => {
    if (visible && !isInstalled && !isPwaMode()) {
      btn.classList.remove('hidden');
    } else {
      btn.classList.add('hidden');
    }
  });
}

// Trigger install flow when user clicks "Uygulamayı Yükle"
export async function promptInstall() {
  if (isPwaMode() || isInstalled) {
    showToast('CinePulse zaten bir uygulama olarak yüklü.', 'info');
    return;
  }

  if (deferredPrompt) {
    try {
      deferredPrompt.prompt();
      const choiceResult = await deferredPrompt.userChoice;
      if (choiceResult.outcome === 'accepted') {
        showToast('Yükleme başlatıldı...', 'success');
      } else {
        showToast('Yükleme iptal edildi.', 'info');
      }
      deferredPrompt = null;
    } catch (err) {
      console.warn('[PWA] Install prompt error:', err);
    }
    return;
  }

  // Fallback for iOS or browsers without native prompt
  const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  if (isIos) {
    showIosInstallModal();
  } else {
    // Desktop Chrome / Edge instruction
    showDesktopInstallGuide();
  }
}

function showIosInstallModal() {
  let modal = document.getElementById('pwa-ios-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'pwa-ios-modal';
    modal.className = 'modal-backdrop pwa-guide-modal';
    modal.innerHTML = `
      <div class="modal-content glass-panel pwa-guide-content">
        <div class="pwa-guide-header">
          <div class="pwa-guide-logo">
            <img src="/icon-192.png" alt="CinePulse" width="48" height="48" style="border-radius: 12px;" />
            <div>
              <h3>CinePulse'ı Yükle</h3>
              <p>iPhone / iPad Ana Ekranınıza Ekleyin</p>
            </div>
          </div>
          <button class="btn-icon pwa-close-btn">&times;</button>
        </div>
        <div class="pwa-guide-steps">
          <div class="pwa-step">
            <span class="step-num">1</span>
            <span>Safari'nin alt menüsündeki <strong>Paylaş</strong> (kare içinden yukarı ok) simgesine dokunun.</span>
          </div>
          <div class="pwa-step">
            <span class="step-num">2</span>
            <span>Açılan menüyü aşağı kaydırıp <strong>"Ana Ekrana Ekle"</strong> seçeneğini seçin.</span>
          </div>
          <div class="pwa-step">
            <span class="step-num">3</span>
            <span>Sağ üstteki <strong>"Ekle"</strong> butonuna dokunarak kurulumu tamamlayın.</span>
          </div>
        </div>
        <button class="btn-primary pwa-done-btn" style="width: 100%; margin-top: 16px;">Anladım</button>
      </div>
    `;
    document.body.appendChild(modal);

    modal.querySelector('.pwa-close-btn').addEventListener('click', () => {
      modal.classList.add('hidden');
    });
    modal.querySelector('.pwa-done-btn').addEventListener('click', () => {
      modal.classList.add('hidden');
    });
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.add('hidden');
    });
  }
  modal.classList.remove('hidden');
}

function showDesktopInstallGuide() {
  showToast('Tarayıcınızın adres çubuğundaki "Yükle / Uygulamayı Yükle" simgesine tıklayarak indirebilirsiniz.', 'info', 5000);
}
