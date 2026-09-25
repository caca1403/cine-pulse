/* ==========================================================================
   CinePulse Studio - In-App Auto-Update & Mobile Version Manager
   Checks remote release version on app launch and provides instant,
   in-app seamless APK downloads & updates.
   ========================================================================== */

import { showToast } from '../components/Toast.js';
import { renderIcons } from './icons.js';

export const CURRENT_APP_VERSION = '1.1.6';
export const CURRENT_VERSION_CODE = 116;

const REMOTE_VERSION_URL = 'https://raw.githubusercontent.com/caca1403/cine-pulse/main/public/version.json';
const SNOOZE_KEY = 'cinepulse_update_snoozed_until';

/**
 * Checks if running as a native Android app via Capacitor
 */
export function isNativeAndroidApp() {
  if (typeof window === 'undefined') return false;
  return Boolean(
    window.Capacitor?.isNativePlatform?.() ||
    window.Capacitor?.getPlatform?.() === 'android' ||
    navigator.userAgent.includes('CinePulseAndroid')
  );
}

/**
 * Semver compare: returns true if remote > current
 */
function isNewerVersion(remote, current) {
  if (!remote || !current) return false;
  const parse = (v) => String(v).replace(/^v/i, '').split('.').map(n => parseInt(n, 10) || 0);
  const [rMaj, rMin, rPat] = parse(remote);
  const [cMaj, cMin, cPat] = parse(current);
  if (rMaj > cMaj) return true;
  if (rMaj === cMaj && rMin > cMin) return true;
  if (rMaj === cMaj && rMin === cMin && rPat > cPat) return true;
  return false;
}

/**
 * Shows the luxury in-app update notification modal
 */
export function showUpdateModal(updateInfo) {
  // Prevent duplicate modals
  if (document.getElementById('cinepulse-update-modal')) return;

  const directUrl = updateInfo.downloadUrl || 'https://cine-pulse.vercel.app/api/download_apk';
  const githubUrl = updateInfo.githubDownloadUrl || 'https://github.com/caca1403/cine-pulse/releases/latest';

  const modal = document.createElement('div');
  modal.id = 'cinepulse-update-modal';
  modal.className = 'cinepulse-modal-overlay';
  modal.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: 999999;
    background: rgba(4, 7, 14, 0.85);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 1.5rem;
    animation: fadeInModal 0.25s ease-out;
  `;

  const notesHTML = (updateInfo.releaseNotes || 'Performans iyileştirmeleri ve hata düzeltmeleri.')
    .split('\n')
    .filter(Boolean)
    .map(line => `<li style="margin-bottom: 0.45rem;">${escapeText(line.replace(/^[•\-\*]\s*/, ''))}</li>`)
    .join('');

  modal.innerHTML = `
    <div class="cinepulse-update-card" style="
      background: linear-gradient(145deg, rgba(19, 24, 38, 0.98), rgba(13, 17, 26, 0.98));
      border: 1px solid rgba(245, 158, 11, 0.35);
      border-radius: 24px;
      padding: 2.2rem 2rem;
      max-width: 460px;
      width: 100%;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.7), 0 0 35px rgba(245, 158, 11, 0.15);
      position: relative;
      text-align: center;
      color: #fff;
    ">
      <!-- Glow Header Icon -->
      <div style="
        width: 64px;
        height: 64px;
        border-radius: 20px;
        background: linear-gradient(135deg, rgba(245, 158, 11, 0.25), rgba(217, 119, 6, 0.1));
        border: 1px solid rgba(245, 158, 11, 0.4);
        margin: 0 auto 1.4rem;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #f59e0b;
        box-shadow: 0 0 20px rgba(245, 158, 11, 0.25);
      ">
        <i data-lucide="sparkles" style="width: 30px; height: 30px;"></i>
      </div>

      <div style="display: inline-flex; align-items: center; gap: 0.4rem; padding: 0.25rem 0.85rem; border-radius: 9999px; background: rgba(245, 158, 11, 0.15); border: 1px solid rgba(245, 158, 11, 0.3); color: #fbbf24; font-size: 0.76rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 0.8rem;">
        <span>YENİ GÜNCELLEME MEVCUT</span>
      </div>

      <h2 style="font-size: 1.45rem; font-weight: 800; margin: 0 0 0.5rem; letter-spacing: -0.02em;">
        ${escapeText(updateInfo.title || `CinePulse v${updateInfo.version}`)}
      </h2>

      <p style="font-size: 0.88rem; color: #94a3b8; margin: 0 0 1.2rem; line-height: 1.5;">
        Daha akıcı oynatıcı ve yeni özellikler içeren resmi CinePulse güncellemesi hazır!
      </p>

      <div style="
        text-align: left;
        background: rgba(0, 0, 0, 0.35);
        border: 1px solid rgba(255, 255, 255, 0.07);
        border-radius: 14px;
        padding: 1rem 1.2rem;
        margin-bottom: 1.3rem;
        max-height: 140px;
        overflow-y: auto;
      ">
        <div style="font-size: 0.76rem; font-weight: 700; color: #cbd5e1; text-transform: uppercase; margin-bottom: 0.5rem; letter-spacing: 0.04em;">
          Yenilikler:
        </div>
        <ul style="margin: 0; padding-left: 1.1rem; font-size: 0.84rem; color: #94a3b8; line-height: 1.45;">
          ${notesHTML}
        </ul>
      </div>

      <!-- Action Buttons -->
      <div style="display: flex; flex-direction: column; gap: 0.65rem;">
        <a id="btn-update-download" href="${directUrl}" download="cinepulse.apk" target="_blank" rel="noopener noreferrer" style="
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.6rem;
          background: linear-gradient(135deg, #f59e0b, #d97706);
          color: #0b0f19;
          font-weight: 800;
          font-size: 0.95rem;
          padding: 0.85rem 1.6rem;
          border-radius: 9999px;
          text-decoration: none;
          box-shadow: 0 8px 24px rgba(245, 158, 11, 0.35);
          transition: all 0.2s ease;
        ">
          <i data-lucide="download" style="width: 18px; height: 18px; stroke-width: 2.5;"></i>
          <span>Hemen İndir (Hızlı Sunucu)</span>
        </a>

        <a id="btn-update-github" href="${githubUrl}" target="_blank" rel="noopener noreferrer" style="
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          color: #cbd5e1;
          font-weight: 600;
          font-size: 0.84rem;
          padding: 0.65rem 1.2rem;
          border-radius: 9999px;
          text-decoration: none;
          transition: all 0.2s ease;
        ">
          <i data-lucide="external-link" style="width: 15px; height: 15px;"></i>
          <span>GitHub Releases (Yedek)</span>
        </a>

        ${!updateInfo.mandatory ? `
          <button id="btn-update-later" type="button" style="
            background: transparent;
            border: none;
            color: #64748b;
            font-size: 0.84rem;
            font-weight: 600;
            padding: 0.4rem;
            cursor: pointer;
            transition: color 0.2s ease;
          ">
            Daha Sonra Hatırlat
          </button>
        ` : ''}
      </div>

      <div style="margin-top: 1rem; padding: 0.65rem 0.85rem; border-radius: 12px; background: rgba(245, 158, 11, 0.08); border: 1px solid rgba(245, 158, 11, 0.2); text-align: left; font-size: 0.76rem; color: #fde68a; line-height: 1.4;">
        <div style="font-weight: 700; margin-bottom: 0.2rem; display: flex; align-items: center; gap: 0.35rem; color: #fbbf24;">
          <i data-lucide="info" style="width: 13px; height: 13px;"></i>
          <span>İndirme İpucu</span>
        </div>
        Chrome tarayıcısında <em>"Zararlı dosya olabilir"</em> uyarısı çıkarsa bildirim çubuğunu indirip <strong>"Yine de indir"</strong> butonuna basarak indirmeyi tamamlayabilirsiniz.
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  renderIcons(modal);

  const laterBtn = modal.querySelector('#btn-update-later');
  if (laterBtn) {
    laterBtn.addEventListener('click', () => {
      try {
        // Snooze for 12 hours
        localStorage.setItem(SNOOZE_KEY, String(Date.now() + 12 * 60 * 60 * 1000));
      } catch (_) {}
      modal.remove();
    });
  }

  const triggerDownload = (targetUrl) => {
    showToast('APK indirmesi başlatılıyor...', 'info');
    if (isNativeAndroidApp()) {
      try {
        const opened = window.open(targetUrl, '_system');
        if (!opened) {
          window.location.href = targetUrl;
        }
      } catch (_) {
        window.location.href = targetUrl;
      }
    } else {
      try {
        const a = document.createElement('a');
        a.href = targetUrl;
        a.download = 'cinepulse.apk';
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        document.body.appendChild(a);
        a.click();
        setTimeout(() => a.remove(), 1000);
      } catch (_) {
        window.location.href = targetUrl;
      }
    }
    setTimeout(() => {
      try { modal.remove(); } catch (_) {}
    }, 2000);
  };

  const downloadBtn = modal.querySelector('#btn-update-download');
  if (downloadBtn) {
    downloadBtn.addEventListener('click', (e) => {
      if (isNativeAndroidApp()) {
        e.preventDefault();
        triggerDownload(directUrl);
      } else {
        triggerDownload(directUrl);
      }
    });
  }

  const githubBtn = modal.querySelector('#btn-update-github');
  if (githubBtn) {
    githubBtn.addEventListener('click', (e) => {
      if (isNativeAndroidApp()) {
        e.preventDefault();
        triggerDownload(githubUrl);
      }
    });
  }
}

function escapeText(str = '') {
  return String(str).replace(/[&<>'"]/g, c => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
  }[c]));
}

/**
 * Fetches latest version and prompts if update available
 */
export async function checkForAppUpdates({ manual = false } = {}) {
  // If not manual, check snooze timestamp
  if (!manual) {
    try {
      const snoozedUntil = parseInt(localStorage.getItem(SNOOZE_KEY) || '0', 10);
      if (Date.now() < snoozedUntil) return null;
    } catch (_) {}
  }

  try {
    // Check GitHub raw /version.json first with cache buster
    const res = await fetch(`${REMOTE_VERSION_URL}?_t=${Date.now()}`, {
      signal: AbortSignal.timeout(6000),
      cache: 'no-store'
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();

    if (data && isNewerVersion(data.version, CURRENT_APP_VERSION)) {
      showUpdateModal(data);
      return data;
    } else if (manual) {
      showToast(`✓ CinePulse güncel (v${CURRENT_APP_VERSION})`, 'success');
      return null;
    }
  } catch (err) {
    if (manual) {
      showToast('Güncelleme sunucusuna erişilemedi.', 'error');
    }
    return null;
  }
}

/**
 * Initializes automatic background update checks on app launch
 */
export function initAppUpdater() {
  if (typeof window === 'undefined') return;

  // Run initial check 4 seconds after page load so it never impacts startup speed
  window.setTimeout(() => {
    checkForAppUpdates({ manual: false }).catch(() => {});
  }, 4000);
}
