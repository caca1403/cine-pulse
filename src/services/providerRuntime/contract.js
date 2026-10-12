/** CinePulse Provider API v1. Every runtime emits this direct-media contract. */
export const PROVIDER_API_VERSION = 1;
const MEDIA = /\.(m3u8|mp4|mkv|mpd|webm|m4v|mov)(?:[?#]|$)/i;
const AD = /(?:doubleclick|googlesyndication|\/ads?\/|preroll|vast\.xml)/i;

export function unwrapStreamUrl(value) {
  let url = String(value || '');
  const seen = new Set();
  while (!seen.has(url)) {
    seen.add(url);
    let parsed;
    try { parsed = new URL(url, 'https://localhost'); } catch (_) { return ''; }
    if (!/\/api\/(?:hls_proxy|proxy|stream_proxy)$/.test(parsed.pathname) || !parsed.searchParams.get('url')) break;
    url = parsed.searchParams.get('url');
  }
  return url;
}

export function directMediaUrl(url) {
  return /^https?:\/\//i.test(url || '') && MEDIA.test(url) && !AD.test(url);
}

export function validateProvider(definition) {
  if (!definition || definition.apiVersion !== PROVIDER_API_VERSION || !/^[a-z][a-z0-9_-]*$/.test(definition.id || ''))
    throw new TypeError('Invalid CinePulse provider identity or API version');
  if (!Array.isArray(definition.mediaTypes) || !definition.mediaTypes.length || definition.mediaTypes.some(type => !['movie', 'tv', 'anime', 'live'].includes(type)))
    throw new TypeError(`Invalid mediaTypes: ${definition.id}`);
  if (typeof definition.resolve !== 'function') throw new TypeError(`Missing resolve: ${definition.id}`);
  return definition;
}

export function normalizeStream(raw, { provider = '', index = 0 } = {}) {
  const url = raw?.streamUrl || raw?.url || (typeof raw?.getUrl === 'function' ? raw.getUrl() : '');
  if (!url || typeof url !== 'string') return null;
  return {
    ...raw,
    id: raw.id || `${provider}_${index}`,
    provider: raw.provider || provider,
    name: raw.name || raw.displayName || provider,
    url, streamUrl: url,
    headers: { ...(raw.headers || {}), ...(raw.referer ? { Referer: raw.referer } : {}) },
    subtitles: raw.subtitles || raw.altyazilar || [],
    category: raw.category || (raw.isDub === true ? 'dubbed' : 'subtitled'),
    getUrl: () => url,
  };
}

export function deviceMediaUrl(url, headers = {}) {
  const query = new URLSearchParams({ url, ref: headers.Referer || headers.referer || '' });
  if (Object.keys(headers).length) query.set('headers', JSON.stringify(headers));
  return `/api/hls_proxy?${query}`;
}
