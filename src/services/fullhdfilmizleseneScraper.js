/* ==========================================================================
   CinePulse Studio - FullHDFilmizlesene Scraper (ozel backend resolver)
   RapidVid HLS / Master akışı ve Altyazılarını çeker.
   ========================================================================== */

import { apiUrl } from './apiOrigin.js';

function cleanTitle(raw) {
  if (!raw) return '';
  return raw
    .replace(/\s*-\s*S\d+E\d+.*$/i, '')
    .replace(/\s*-\s*S\d+.*$/i, '')
    .replace(/\s*\(\d{4}\).*/, '')
    .trim();
}

function loc(path) {
  if (!path || /^https?:\/\//i.test(path)) return path;
  if (typeof window !== 'undefined') {
    const host = window.location?.hostname || '';
    if (host === 'localhost' || host === '127.0.0.1') return path;
  }
  return apiUrl(path);
}

export async function fetchFullhdfilmSources({
  type = 'movie',
  title = '',
  originalTitle = '',
  titles = []
} = {}) {
  if (type !== 'movie') return [];
  const query = cleanTitle(title || originalTitle);
  if (!query) return [];

  try {
    const qs = new URLSearchParams({
      provider: 'fhdf', type: 'movie',
      title: cleanTitle(title), originalTitle: cleanTitle(originalTitle)
    });
    (titles || []).forEach((t, i) => { if (i < 4 && t) qs.append(`t${i}`, t); });
    const endpoint = loc(`/api/resolve?${qs.toString()}`);
    const res = await fetch(endpoint, { signal: AbortSignal.timeout(15000) }).catch(() => null);
    if (!res || !res.ok) return [];
    const data = await res.json().catch(() => null);
    if (!data || !data.success || !Array.isArray(data.streams)) return [];

    const resultSources = [];

    for (let i = 0; i < data.streams.length; i++) {
      const s = data.streams[i];
      if (!s || !s.streamUrl) continue;

      const prov = s.provider || 'FullHDFilm';
      const url = loc(s.streamUrl);
      const isHls = Boolean(s.isHls) || /\.(m3u8|txt)/i.test(s.rawStreamUrl || '') || s.streamUrl.includes('hls_proxy');

      // 1. Dublaj Hattı
      resultSources.push({
        id: `fhdf_p${i}_dub_movie`,
        name: `${prov} Dublaj 1080p`,
        displayName: `${prov} Dublaj (1080p)`,
        badge: `🎞️ ${prov} Dublaj 1080p`,
        source: 'FullHDFilm',
        url,
        streamUrl: url,
        rawStreamUrl: s.rawStreamUrl,
        quality: '1080p',
        isHls,
        isDirectVideo: !s.isIframe,
        isIframe: Boolean(s.isIframe),
        category: 'dubbed',
        type: s.isIframe ? 'embed' : 'direct',
        subtitles: Array.isArray(s.subtitles) ? s.subtitles : [],
        getUrl: () => url
      });

      // 2. Altyazılı Hattı
      resultSources.push({
        id: `fhdf_p${i}_sub_movie`,
        name: `${prov} Altyazı 1080p`,
        displayName: `${prov} Altyazı (1080p)`,
        badge: `🎞️ ${prov} Altyazı 1080p`,
        source: 'FullHDFilm',
        url,
        streamUrl: url,
        rawStreamUrl: s.rawStreamUrl,
        quality: '1080p',
        isHls,
        isDirectVideo: !s.isIframe,
        isIframe: Boolean(s.isIframe),
        category: 'subtitled',
        type: s.isIframe ? 'embed' : 'direct',
        subtitles: Array.isArray(s.subtitles) ? s.subtitles : [],
        getUrl: () => url
      });
    }

    return resultSources;
  } catch (_) {
    return [];
  }
}

