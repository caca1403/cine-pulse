/* ==========================================================================
   CinePulse - Uygulama Tanitim Bileseni (web'de takilanlara)
   APK / EXE indirme + exe:// derin baglanti. Web'de gosterilir, uygulamada gizlenir.
   ========================================================================== */

import { isAppPlatform } from '../services/platformBridge.js';
import { renderIcons } from '../services/icons.js';

export const EXE_DOWNLOAD_URL =
  'https://github.com/caca1403/cine-pulse/releases/latest/download/cinepulse-setup.exe';
export const APK_DOWNLOAD_URL = '/api/download_apk';

export function shouldShowAppPromo() {
  try {
    return !isAppPlatform();
  } catch (_) {
    return true;
  }
}

export function exeDeepLink() {
  try {
    const hash = window.location?.hash || '#home';
    return `exe://go?view=${encodeURIComponent(hash)}`;
  } catch (_) {
    return 'exe://go?view=%23home';
  }
}

export function appPromoHtml(title = 'Kesintisiz izlemek ister misin?') {
  if (!shouldShowAppPromo()) return '';
  return `
    <div class="app-promo-box" style="margin-top:1.1rem;padding:1rem;border-radius:12px;background:rgba(223, 255, 118,.08);border:1px solid rgba(223, 255, 118,.3);text-align:center;">
      <div style="color:#dfff76;font-weight:800;font-size:.9rem;margin-bottom:.3rem;">${title}</div>
      <div style="color:#94a3b8;font-size:.78rem;margin-bottom:.8rem;">
        Web sürümünde bazı yayınlar engellenebilir. Uygulamada hepsi doğrudan açılır.
      </div>
      <div style="display:flex;gap:.5rem;justify-content:center;flex-wrap:wrap;">
        <a href="${APK_DOWNLOAD_URL}" style="display:inline-flex;align-items:center;gap:.4rem;background:#dfff76;color:#000;font-weight:800;font-size:.8rem;padding:.55rem 1rem;border-radius:9px;text-decoration:none;">
          <i data-lucide="smartphone" style="width:14px;height:14px;"></i> APK İndir
        </a>
        <a href="${EXE_DOWNLOAD_URL}" style="display:inline-flex;align-items:center;gap:.4rem;background:rgba(255,255,255,.08);color:#fff;font-weight:700;font-size:.8rem;padding:.55rem 1rem;border-radius:9px;text-decoration:none;border:1px solid rgba(255,255,255,.16);">
          <i data-lucide="monitor" style="width:14px;height:14px;"></i> EXE İndir
        </a>
        <a href="${exeDeepLink()}" data-exe-open style="display:inline-flex;align-items:center;gap:.4rem;background:transparent;color:#dfff76;font-weight:700;font-size:.8rem;padding:.55rem 1rem;border-radius:9px;text-decoration:none;border:1px dashed rgba(223, 255, 118,.5);">
          <i data-lucide="external-link" style="width:14px;height:14px;"></i> Uygulamada Aç
        </a>
      </div>
    </div>
  `;
}

export function attachAppPromoEvents(root) {
  try {
    renderIcons(root || document);
  } catch (_) {}
}
