/* ==========================================================================
   CinePulse Studio - FilmEkseni Scraper (ozel backend resolver)
   Duvarsiz JSON arama API + videoPlayerData: VidMoly master.m3u8 ve
   Eksenload iframe. Film + dizi cift tip.
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
    if ((host === 'localhost' || host === '127.0.0.1') && !Boolean(window.Capacitor?.isNativePlatform?.()) && window.location?.protocol !== 'capacitor:') return path;
  }
  return apiUrl(path);
}

export async function fetchFilmekseniSources({
  type = 'tv',
  title = '',
  originalTitle = '',
  titles = [],
  season = 1,
  episode = 1,
  year = null,
  imdbId = ''
} = {}) {
  const query = cleanTitle(title || originalTitle);
  if (!query) return [];
  const isMovie = type === 'movie';
  const sNum = parseInt(season, 10) || 1;
  const epNum = parseInt(episode, 10) || 1;

  try {
    const qs = new URLSearchParams({
      provider: 'fxs', type: isMovie ? 'movie' : 'tv',
      title: cleanTitle(title), originalTitle: cleanTitle(originalTitle),
      season: String(sNum), episode: String(epNum),
      ...(year ? { year: String(year) } : {}), ...(imdbId ? { imdbId } : {})
    });
    (titles || []).forEach((t, i) => { if (i < 4 && t) qs.append(`t${i}`, t); });
    const endpoint = loc(`/api/resolve?${qs.toString()}`);
    const res = await fetch(endpoint, { signal: AbortSignal.timeout(20000) }).catch(() => null);
    if (!res || !res.ok) return [];
    const data = await res.json().catch(() => null);
    if (!data || !data.success || !Array.isArray(data.streams)) return [];

    return data.streams.map((s, i) => {
      if (!s || !s.streamUrl) return null;
      const url = loc(s.streamUrl);
      const isHls = /\.m3u8/i.test(s.rawStreamUrl || '') || (s.streamUrl || '').includes('hls_proxy');
      const label = s.provider || 'FilmEkseni';
      return {
        id: `fxs_${i}_${isMovie ? 'mov' : `s${sNum}e${epNum}`}`,
        name: label,
        displayName: label,
        badge: label,
        source: 'FilmEkseni',
        url,
        streamUrl: url,
        originalEmbedUrl: s.rawStreamUrl,
        quality: '1080p',
        isHls,
        isDirectVideo: !s.isIframe,
        isIframe: Boolean(s.isIframe),
        type: s.isIframe ? 'embed' : 'direct',
        subtitles: Array.isArray(s.subtitles) ? s.subtitles : [],
        getUrl: () => url
      };
    }).filter((s) => s && s.streamUrl);
  } catch (_) {
    return [];
  }
}
