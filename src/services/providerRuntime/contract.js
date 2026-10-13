/** CinePulse Provider API v1. Every runtime emits this direct-media contract. */
import { apiUrl } from '../apiOrigin.js';

export const PROVIDER_API_VERSION = 1;
const MEDIA = /\.(m3u8|mp4|mkv|mpd|webm|m4v|mov)(?:[?#]|$)/i;
const AD = /(?:doubleclick|googlesyndication|\/ads?\/|preroll|vast\.xml)/i;

/**
 * Göreli API yolunu mutlak adrese çevirir.
 * KRİTİK: `/api/hls_proxy?...` gibi göreli adresler Android'de sayfanın
 * kendi köküne (https://localhost/) düşüyordu; oynatıcı ve doğrulama bunları
 * açamıyordu. Artık yerel medya geçidine bağlanıyor (DEB/EXE/APK'da aynı).
 */
export function mutlakApiAdresi(url) {
  const s = String(url || '');
  if (!s || /^https?:\/\//i.test(s) || s.startsWith('//') || s.startsWith('blob:')) return s;
  if (s.startsWith('/')) {
    try { return apiUrl(s); } catch (_) { return s; }
  }
  return s;
}
export function unwrapStreamUrl(value) {
  let url = String(value || '');
  const seen = new Set();
  while (!seen.has(url)) {
    seen.add(url);
    let parsed;
    try { parsed = new URL(url, 'https://localhost'); } catch (_) { return ''; }
    if (!/\/api\/(?:hls_proxy|proxy|stream_proxy|mkv_stream)$/.test(parsed.pathname) || !parsed.searchParams.get('url')) break;
    url = parsed.searchParams.get('url');
  }
  return mutlakApiAdresi(url);
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

/**
 * Sayısal kalite sırası — CloudStream `sortUrls` kalıbı (`sortedBy { -quality }`):
 * 2160/4K→4, 1080/FHD→3, 720→2, 480→1, 360→0, bilinmeyen/Auto→-1 (en son).
 * `quality`/`kalite`/ad metnindeki "4K", "1080p", "720p" gibi ifadelerden türer;
 * yayın listesi bu alanla azalan sıralanır (kalitesiz en sonda).
 */
export function qualityRank(source) {
  if (typeof source === 'number') return Number.isFinite(source) ? source : -1;
  if (typeof source === 'string') return rankFromText(source);
  if (!source || typeof source !== 'object') return -1;
  if (typeof source.qualityRank === 'number' && Number.isFinite(source.qualityRank)) return source.qualityRank;
  return rankFromText(`${source.quality ?? ''} ${source.kalite ?? ''} ${source.name ?? ''} ${source.displayName ?? ''}`);
}

function rankFromText(metin) {
  const t = String(metin || '').toLowerCase();
  const sayiVar = (sayi) => new RegExp(`(^|[^0-9])${sayi}p?([^0-9]|$)`).test(t);
  if (sayiVar(2160) || /(^|[^a-z0-9])(4k|uhd)([^a-z0-9]|$)/.test(t)) return 4;
  if (sayiVar(1080) || /(^|[^a-z0-9])fhd([^a-z0-9]|$)/.test(t)) return 3;
  if (sayiVar(720)) return 2;
  if (sayiVar(480)) return 1;
  if (sayiVar(360)) return 0;
  return -1;
}

export function normalizeStream(raw, { provider = '', index = 0 } = {}) {
  const url = mutlakApiAdresi(raw?.streamUrl || raw?.url || (typeof raw?.getUrl === 'function' ? raw.getUrl() : ''));
  if (!url || typeof url !== 'string') return null;
  return {
    ...raw,
    qualityRank: qualityRank(raw),
    id: raw.id || `${provider}_${index}`,
    provider: raw.provider || provider,
    name: raw.name || raw.displayName || provider,
    url, streamUrl: url,
    headers: { ...(raw.headers || {}), ...(raw.referer ? { Referer: raw.referer } : {}) },
    subtitles: (raw.subtitles || raw.altyazilar || []).map(sub => {
      const yeni = mutlakApiAdresi(sub?.src || sub?.url || '');
      return yeni ? { ...sub, src: yeni, url: yeni } : sub;
    }),
    category: raw.category || (raw.isDub === true ? 'dubbed' : 'subtitled'),
    getUrl: () => url,
  };
}

export function deviceMediaUrl(url, headers = {}) {
  const hedef = String(url || '');
  const query = new URLSearchParams({ url: hedef, ref: headers.Referer || headers.referer || '' });
  if (Object.keys(headers).length) query.set('headers', JSON.stringify(headers));
  return mutlakApiAdresi(`/api/hls_proxy?${query}`);
}
