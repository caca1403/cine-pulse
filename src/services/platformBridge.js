/* ==========================================================================
   CinePulse Studio - Platform Bridge (Web & APK Ortak Köprüsü)
   ========================================================================== */

import { showToast } from '../components/Toast.js';

/**
 * Native Android APK (Capacitor) ortamında çalışıp çalışmadığını belirler.
 * Hafif ve senkron çalışır; harici ağır kütüphane bağımlılığı içermez.
 */
export function isNativeAndroidApp() {
  if (typeof window === 'undefined') return false;
  return Boolean(
    (window.Capacitor?.isNativePlatform?.() && window.Capacitor?.getPlatform?.() === 'android') ||
    window.Capacitor?.isNativePlatform?.() ||
    (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.includes('CinePulseAndroid'))
  );
}

export const isNativeAndroid = typeof window !== 'undefined' ? isNativeAndroidApp() : false;

/**
 * Masaustu uygulamasi (Electron EXE) icinde calisip calismadigini belirler.
 * Electron preload window.CinePulseDesktop bayragi koyar; yoksa UA'ya bakilir.
 */
export function isDesktopApp() {
  if (typeof window === 'undefined') return false;
  try {
    if (window.CinePulseDesktop && window.CinePulseDesktop.isDesktop === true) return true;
    if (typeof navigator !== 'undefined' && navigator.userAgent && navigator.userAgent.includes('CinePulseDesktop')) return true;
    const params = new URLSearchParams(window.location?.search || '');
    if (params.get('desktopApp') === '1') return true;
  } catch (_) {}
  return false;
}

/**
 * Herhangi bir uygulama (APK veya EXE) icinde mi? Web'de false.
 */
export function isAppPlatform() {
  return isNativeAndroidApp() || isDesktopApp();
}

export function getPlatformType() {
  if (isNativeAndroidApp()) return 'android';
  if (isDesktopApp()) return 'desktop';
  return 'web';
}

/**
 * Web tarayıcı ortamında (Masaüstü veya Mobil Tarayıcı) olup olmadığını belirler.
 * APK veya Electron Desktop içinde kesinlikle FALSE döner.
 */
export function isWebPlatform() {
  return !isNativeAndroidApp() && !isDesktopApp();
}

/**
 * Bağımsız PWA modunda çalışıp çalışmadığını denetler.
 */
export function isPwaMode() {
  if (typeof window === 'undefined') return false;
  return Boolean(
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true ||
    document.referrer?.includes('android-app://')
  );
}

/**
 * Platforma göre uygun modülü çalışma anında dinamik (lazy) yükleyen köprü başlatıcı.
 * 3 Parçalı mimari: Android APK, Desktop (DEB/EXE), Web Tarayıcı.
 */
export async function initPlatformBridge() {
  if (typeof window === 'undefined') return;

  const platform = getPlatformType();
  document.documentElement.classList.toggle('native-android', platform === 'android');
  document.documentElement.classList.toggle('desktop-app', platform === 'desktop');
  document.documentElement.classList.toggle('web-app', platform === 'web');

  const mobileWebQuery = matchMedia('(max-width: 768px)');
  document.documentElement.classList.toggle('mobile-web', platform === 'web' && mobileWebQuery.matches);
  mobileWebQuery.addEventListener?.('change', (event) => {
    document.documentElement.classList.toggle('mobile-web', isWebPlatform() && event.matches);
  });

  if (platform === 'android') {
    try {
      const { initAndroidPlatform } = await import('./platform/androidPlatform.js');
      await initAndroidPlatform();
    } catch (err) {
      console.warn('[PlatformBridge] Android platform başlatılırken hata:', err);
    }
  } else if (platform === 'desktop') {
    try {
      const { initDesktopPlatform } = await import('./platform/desktopPlatform.js');
      await initDesktopPlatform();
    } catch (err) {
      console.warn('[PlatformBridge] Desktop platform başlatılırken hata:', err);
    }
  } else {
    try {
      const { initWebPlatform } = await import('./platform/webPlatform.js');
      await initWebPlatform();
    } catch (err) {
      console.warn('[PlatformBridge] Web platform başlatılırken hata:', err);
    }
  }
}

/**
 * Uygulama güncellemelerini platforma göre yöneten köprü fonksiyonu.
 */
export async function checkForAppUpdates(options = { manual: false }) {
  if (isNativeAndroidApp()) {
    const { checkForAppUpdates: checkNative } = await import('./appUpdater.js');
    return checkNative(options);
  } else if (isDesktopApp()) {
    try {
      const bridge = typeof window !== 'undefined' ? window.CinePulseDesktop : null;
      if (bridge && typeof bridge.checkDesktopUpdate === 'function') {
        const res = await bridge.checkDesktopUpdate(options.manual !== false);
        if (res && res.state === 'up-to-date' && options.manual) {
          showToast('CinePulse Desktop güncel.', 'info');
        }
        return res;
      }
    } catch (_) {}
    showToast('CinePulse Desktop (v1.1.51) güncel.', 'info');
  } else {
    showToast('CinePulse Web sürümü her zaman günceldir!', 'info');
  }
}

/**
 * PWA veya Uygulama yükleme istemini platforma göre tetikleyen köprü fonksiyonu.
 */
export async function promptAppInstall() {
  if (isWebPlatform()) {
    const { promptInstall } = await import('./pwaManager.js');
    promptInstall();
  }
}
