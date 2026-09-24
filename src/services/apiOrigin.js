const PUBLIC_API_ORIGIN = 'https://cine-pulse-drab.vercel.app';
const MKV_RELAY_ORIGIN = (import.meta.env?.VITE_MKV_RELAY_ORIGIN || '').replace(/\/$/, '');

export function apiUrl(path = '') {
  if (!path || /^https?:\/\//i.test(path)) return path;
  if (typeof window === 'undefined') return `http://127.0.0.1:4000${path}`;
  const host = window.location?.hostname || '';
  return host.endsWith('github.io') ? `${PUBLIC_API_ORIGIN}${path}` : path;
}

export function mkvRelayUrl(path = '') {
  return MKV_RELAY_ORIGIN ? `${MKV_RELAY_ORIGIN}${path}` : apiUrl(path);
}
