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
    navigator.userAgent.includes('CinePulseAndroid')
  );
}

/**
 * Web tarayıcı ortamında (Masaüstü, Mobil Tarayıcı veya PWA) olup olmadığını belirler.
 */
export function isWebPlatform() {
  return !isNativeAndroidApp();
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
 */
export async function initPlatformBridge() {
  if (typeof window === 'undefined') return;

  const isAndroid = isNativeAndroidApp();
  document.documentElement.classList.toggle('native-android', isAndroid);

  const mobileWebQuery = matchMedia('(max-width: 768px)');
  document.documentElement.classList.toggle('mobile-web', !isAndroid && mobileWebQuery.matches);
  mobileWebQuery.addEventListener?.('change', (event) => {
    document.documentElement.classList.toggle('mobile-web', !isNativeAndroidApp() && event.matches);
  });

  if (isAndroid) {
    try {
      const { initAndroidPlatform } = await import('./platform/androidPlatform.js');
      await initAndroidPlatform();
    } catch (err) {
      console.warn('[PlatformBridge] Android platform başlatılırken hata:', err);
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
