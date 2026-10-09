/* ==========================================================================
   CinePulse Studio - SelcukFlix Scraper (ozel backend resolver)
   Pichive HLS 1080p Master akışı ve Altyazılarını çeker.
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

export async function fetchSelcukflixSources({
  type = 'movie',
  title = '',
  originalTitle = '',
  titles = [],
  season = 1,
  episode = 1
} = {}) {
  const query = cleanTitle(title || originalTitle);
  if (!query) return [];
  const isMovie = type === 'movie';
  const sNum = parseInt(season, 10) || 1;
  const epNum = parseInt(episode, 10) || 1;

  try {
    const qs = new URLSearchParams({
      provider: 'slc', type: isMovie ? 'movie' : 'tv',
      title: cleanTitle(title), originalTitle: cleanTitle(originalTitle),
      season: String(sNum), episode: String(epNum)
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

      const prov = s.provider || 'SelcukFlix';
      const url = loc(s.streamUrl);
      const suf = isMovie ? 'movie' : `s${sNum}e${epNum}`;
      const isHls = Boolean(s.isHls) || /\.m3u8/i.test(s.rawStreamUrl || '') || s.streamUrl.includes('hls_proxy');

      // 1. Dublaj Hattı
      resultSources.push({
        id: `slc_p${i}_dub_${suf}`,
        name: isMovie ? `${prov} Dublaj 1080p` : `${prov} Dublaj S${sNum}B${epNum}`,
        displayName: `${prov} Dublaj (1080p)`,
        badge: `🦅 ${prov} Dublaj 1080p`,
        source: 'SelcukFlix',
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
        id: `slc_p${i}_sub_${suf}`,
        name: isMovie ? `${prov} Altyazı 1080p` : `${prov} Altyazı S${sNum}B${epNum}`,
        displayName: `${prov} Altyazı (1080p)`,
        badge: `🦅 ${prov} Altyazı 1080p`,
        source: 'SelcukFlix',
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

