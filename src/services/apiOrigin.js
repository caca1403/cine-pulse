const PUBLIC_API_ORIGIN = 'https://cine-pulse-drab.vercel.app';

export function apiUrl(path = '') {
  if (!path || /^https?:\/\//i.test(path)) return path;
  if (typeof window === 'undefined') return `http://127.0.0.1:4000${path}`;
  const host = window.location?.hostname || '';
  return host.endsWith('github.io') ? `${PUBLIC_API_ORIGIN}${path}` : path;
}
