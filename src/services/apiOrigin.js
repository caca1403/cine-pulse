const PUBLIC_API_ORIGIN = 'https://cine-pulse-drab.vercel.app';
const MKV_RELAY_ORIGIN = (import.meta.env?.VITE_MKV_RELAY_ORIGIN || '').replace(/\/$/, '');
// EXE (Electron): tum /api trafigi yerel sidecar'a gider — kullanicinin kendi IP'si
// + Python cozuculer + gizli WebView cookie'leri burada devreye girer (403 avantaji).
const DESKTOP_SIDECAR = 'http://127.0.0.1:4000';

export function apiUrl(path = '') {
  if (!path || /^https?:\/\//i.test(path)) return path;
  if (typeof window === 'undefined') return `http://127.0.0.1:4000${path}`;
  try {
    if (window.CinePulseDesktop?.isDesktop === true) return `${DESKTOP_SIDECAR}${path}`;
    if (typeof navigator !== 'undefined' && (navigator.userAgent || '').includes('CinePulseDesktop')) {
      return `${DESKTOP_SIDECAR}${path}`;
    }
  } catch (_) {}
  const host = window.location?.hostname || '';
  const isCapacitorOrStatic = Boolean(
    window.Capacitor?.isNativePlatform?.() ||
    window.location?.protocol === 'capacitor:' ||
    host === 'localhost' ||
    host === '127.0.0.1' ||
    host.endsWith('github.io')
  );
  return isCapacitorOrStatic ? `${PUBLIC_API_ORIGIN}${path}` : path;
}

export function mkvRelayUrl(path = '') {
  return MKV_RELAY_ORIGIN ? `${MKV_RELAY_ORIGIN}${path}` : apiUrl(path);
}
