/* ==========================================================================
   CinePulse - Uygulama Tanitim Bileseni (web'de takilanlara)
   APK / EXE indirme + exe:// derin baglanti. Web'de gosterilir, uygulamada gizlenir.
   ========================================================================== */

import { isAppPlatform } from '../services/platform/platformBridge.js';
import { renderIcons } from '../services/kabuk/icons.js';

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

export function appPromoHtml(title = 'CinePulse Deneyimi') {
  if (!shouldShowAppPromo()) return '';
  return `
    <div class="app-promo-box" style="margin-top:1.1rem;padding:1.1rem;border-radius:12px;background:rgba(223, 255, 118,.06);border:1px solid rgba(223, 255, 118,.25);text-align:center;">
      <div style="color:#dfff76;font-weight:800;font-size:.92rem;margin-bottom:.35rem;">${title}</div>
      <div style="color:#94a3b8;font-size:.78rem;margin-bottom:.9rem;line-height:1.4;">
        Yayın alternatifleri sunucu üzerinden otomatik köprülenir. Doğrudan cihaz donanım hızlandırması ve çevrimdışı izleme için yerel uygulamayı indirebilirsiniz.
      </div>
      <div style="display:flex;gap:.5rem;justify-content:center;flex-wrap:wrap;margin-bottom:.6rem;">
        <a href="${APK_DOWNLOAD_URL}" style="display:inline-flex;align-items:center;gap:.4rem;background:#10b981;color:#fff;font-weight:700;font-size:.8rem;padding:.55rem 1rem;border-radius:9px;text-decoration:none;">
          <i data-lucide="smartphone" style="width:14px;height:14px;"></i> APK İndir
        </a>
        <a href="${EXE_DOWNLOAD_URL}" style="display:inline-flex;align-items:center;gap:.4rem;background:rgba(255,255,255,.08);color:#fff;font-weight:700;font-size:.8rem;padding:.55rem 1rem;border-radius:9px;text-decoration:none;border:1px solid rgba(255,255,255,.16);">
          <i data-lucide="monitor" style="width:14px;height:14px;"></i> Masaüstü (EXE)
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
