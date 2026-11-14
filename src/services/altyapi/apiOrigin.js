const PUBLIC_API_ORIGIN = 'https://cinepulse.cinepulse.workers.dev';
const MKV_RELAY_ORIGIN = (import.meta.env?.VITE_MKV_RELAY_ORIGIN || '').replace(/\/$/, '');
export function apiUrl(path = '') {
  if (typeof window === 'undefined') return `${PUBLIC_API_ORIGIN}${path}`;
  const isDesktop = window.CinePulseDesktop?.isDesktop === true;
  if (/^https?:\/\//i.test(path)) {
    if (isDesktop) {
      const config = window.CinePulseDesktop.getApiConfig?.();
      if (!config?.origin || !config?.token) {
        throw new Error('Masaüstü yerel medya ağ geçidi hazır değil');
      }
      const url = new URL(path);
      if (url.origin === config.origin) url.searchParams.set('__cp_token', config.token);
      return url.href;
    }
    return path;
  }
  if (isDesktop) {
    const config = window.CinePulseDesktop.getApiConfig?.();
    if (!config?.origin || !config?.token) {
      throw new Error('Masaüstü yerel medya ağ geçidi hazır değil');
    }
    if (!path) return config.origin;
    const url = new URL(path, config.origin);
    url.searchParams.set('__cp_token', config.token);
    return url.href;
  }
  let desktopUserAgent = false;
  try {
    desktopUserAgent = typeof navigator !== 'undefined' && (navigator.userAgent || '').includes('CinePulseDesktop');
  } catch (_) {}
  if (desktopUserAgent) throw new Error('Masaüstü API köprüsü başlatılamadı');
  if (isNativeCapacitor()) {
    const origin = window.CinePulseNative?.getApiOrigin?.();
    if (!origin) throw new Error('Android yerel API başlatılamadı');
    return `${origin}${path}`;
  }
  const host = window.location?.hostname || '';
  const isViteDev = Boolean(typeof import.meta !== 'undefined' && import.meta.env?.DEV);
  const isCapacitorOrStatic = Boolean(
    window.Capacitor?.isNativePlatform?.() ||
    window.location?.protocol === 'capacitor:' ||
    (!isViteDev && (host === 'localhost' || host === '127.0.0.1')) ||
    host.endsWith('github.io')
  );
  return isCapacitorOrStatic ? `${PUBLIC_API_ORIGIN}${path}` : path;
}

export function mediaPlaybackProxyUrl(streamUrl, referer, origin = '') {
  const query = `url=${encodeURIComponent(streamUrl)}&ref=${encodeURIComponent(referer)}`;
  const originQuery = origin ? `&origin=${encodeURIComponent(origin)}` : '';
  return apiUrl(`/api/hls_proxy?${query}${originQuery}`);
}

export function mkvRelayUrl(path = '') {
  if (isNativeCapacitor()) return apiUrl(path);
  return MKV_RELAY_ORIGIN ? `${MKV_RELAY_ORIGIN}${path}` : apiUrl(path);
}

/**
 * Alt-yol/sunucuya-özel rotalar (ör. /api/subtitles) için adres.
 * ANDROID'de apiUrl() YEREL geçidi (NativeMediaGateway) döner ve geçit bu
 * rotayı tanımaz → 501 `native-route-unavailable` (ölçüldü 2026-10-17).
 * Rota CORS'a açık (Access-Control-Allow-Origin: *) olduğundan WebView bunu
 * doğrudan herkese açık worker kökünden çeker. Masaüstü/web: apiUrl yeterli.
 */
export function publicApiUrl(path = '') {
  if (isNativeCapacitor()) return `${PUBLIC_API_ORIGIN}${path}`;
  return apiUrl(path);
}

export function isNativeCapacitor() {
  try {
    if (typeof window === 'undefined') return false;
    if (window.Capacitor?.isNativePlatform?.()) return true;
    if (window.location?.protocol === 'capacitor:') return true;
    return false;
  } catch (_) {
    return false;
  }
}

// Dev localhost (vite -> :4000) ile APK localhost'unu ayirt eder.
// APK'da hostname localhost olsa bile native'tir, relative /api birakilmamalidir.
export function isLocalDevHost() {
  try {
    if (typeof window === 'undefined') return false;
    if (isNativeCapacitor()) return false;
    const host = window.location?.hostname || '';
    return host === 'localhost' || host === '127.0.0.1';
  } catch (_) {
    return false;
  }
}
