/* ==========================================================================
   CinePulse Studio - HDFilmCehennemi Scraper & Direct Stream Engine
   Extracts direct 1080p HLS streams and official Turkish subtitles
   Bypasses Cloudflare & SAMEORIGIN without 403 Forbidden errors
   ========================================================================== */

import { apiUrl } from './apiOrigin.js';

export async function fetchHdfilmcehennemiSources({
  type = 'movie',
  tmdbId = null,
  imdbId = null,
  title = '',
  originalTitle = '',
  season = 1,
  episode = 1
} = {}) {
  const query = title || originalTitle;
  if (!query) return [];

  const sNum = parseInt(season, 10) || 1;
  const epNum = parseInt(episode, 10) || 1;
  const isMovie = type === 'movie';

  try {
    const searchTitle = cleanTitle(query);
    const searchOriginal = cleanTitle(originalTitle);
    // Localhost'ta vite proxy -> :4000 (guncel backend); canlıda Vercel API.
    const host = typeof window !== 'undefined' ? (window.location?.hostname || '') : '';
    const isLocal = host === 'localhost' || host === '127.0.0.1';
    const loc = (p) => (isLocal ? p : apiUrl(p));
    const endpoint = loc(`/api/hdfc_stream?query=${encodeURIComponent(searchTitle)}&originalTitle=${encodeURIComponent(searchOriginal)}&tmdbId=${tmdbId || ''}&imdbId=${imdbId || ''}&season=${sNum}&episode=${epNum}&type=${type || (isMovie ? 'movie' : 'tv')}`);
    
    const res = await fetch(endpoint, {
      signal: AbortSignal.timeout(11000)
    }).catch(() => null);

    if (!res || !res.ok) return [];

    const data = await res.json().catch(() => null);
    if (!data || !data.success || (!data.streamUrl && !Array.isArray(data.streams))) return [];

    const sources = [];
    const backendStreams = Array.isArray(data.streams) && data.streams.length > 0
      ? data.streams
      : [{ provider: 'HDFilmCehennemi', streamUrl: data.streamUrl, rawStreamUrl: data.rawStreamUrl, subtitles: data.subtitles }];

    for (const bs of backendStreams) {
      if (!bs || !bs.streamUrl) continue;
      const provider = bs.provider === 'Rapidrame' ? 'Rapidrame' : (bs.provider === 'CloseLoad' ? 'CloseLoad' : 'HDFilmCehennemi');
      const tag = provider === 'HDFilmCehennemi' ? 'hdfc' : (provider === 'Rapidrame' ? 'rapid' : 'close');

      // Process subtitle tracks
      const subs = [];
      if (Array.isArray(bs.subtitles)) {
        for (const sub of bs.subtitles) {
          if (sub.src) {
            subs.push({
              label: sub.label || `Türkçe (${provider})`,
              src: sub.src
            });
          }
        }
      }

    // Add fallback OpenSubtitles if no Turkish sub present
    const hasTr = subs.some(s => (s.label || '').toLowerCase().includes('türk') || (s.label || '').toLowerCase().includes('tr'));
    if (!hasTr && (imdbId || tmdbId || title)) {
      const cleanTitle = encodeURIComponent(title || originalTitle || '');
      const defaultSubUrl = isMovie
        ? `/api/subtitles?tmdbId=${tmdbId || ''}&imdbId=${imdbId || ''}&title=${cleanTitle}&type=movie`
        : `/api/subtitles?tmdbId=${tmdbId || ''}&imdbId=${imdbId || ''}&title=${cleanTitle}&season=${sNum}&episode=${epNum}&type=tv`;
      subs.unshift({ label: 'OpenSubtitles (Türkçe)', src: defaultSubUrl });
    }

      // 1. Dublaj Hattı (CloseLoad / Rapidrame Dublaj 1080p)
      sources.push({
        id: `hdfc_${tag}_dub_${tmdbId || 'q'}_${isMovie ? 'movie' : `s${sNum}e${epNum}`}`,
        name: isMovie ? `${provider} Dublaj 1080p` : `${provider} Dublaj S${sNum}B${epNum}`,
        displayName: `${provider} Dublaj (1080p)`,
        badge: provider === 'Rapidrame' ? '🚀 Rapidrame Dublaj 1080p' : (provider === 'CloseLoad' ? '⚡ CloseLoad Dublaj 1080p' : '🔥 HDFC Dublaj 1080p'),
        source: provider,
        url: loc(bs.streamUrl),
        streamUrl: loc(bs.streamUrl),
        rawStreamUrl: bs.rawStreamUrl,
        movieUrl: bs.movieUrl || data.movieUrl,
        quality: '1080p HD',
        isHls: true,
        isDirectVideo: true,
        category: 'dubbed',
        type: 'direct',
        subtitles: subs,
        getUrl: () => loc(bs.streamUrl)
      });

      // 2. Altyazılı Hattı (CloseLoad / Rapidrame Altyazı 1080p)
      sources.push({
        id: `hdfc_${tag}_sub_${tmdbId || 'q'}_${isMovie ? 'movie' : `s${sNum}e${epNum}`}`,
        name: isMovie ? `${provider} Altyazı 1080p` : `${provider} Altyazı S${sNum}B${epNum}`,
        displayName: `${provider} Altyazı (1080p)`,
        badge: provider === 'Rapidrame' ? '🚀 Rapidrame Altyazı 1080p' : (provider === 'CloseLoad' ? '⚡ CloseLoad Altyazı 1080p' : '🔥 HDFC Altyazı 1080p'),
        source: provider,
        url: loc(bs.streamUrl),
        streamUrl: loc(bs.streamUrl),
        rawStreamUrl: bs.rawStreamUrl,
        movieUrl: bs.movieUrl || data.movieUrl,
        quality: '1080p HD',
        isHls: true,
        isDirectVideo: true,
        category: 'subtitled',
        type: 'direct',
        subtitles: subs,
        getUrl: () => loc(bs.streamUrl)
      });
    }

    return sources;
  } catch (err) {
    console.warn('[HDFilmCehennemi Scraper] Failed to resolve:', err?.message);
    return [];
  }
}

function cleanTitle(raw) {
  if (!raw) return '';
  return raw
    .replace(/\s*-\s*S\d+E\d+.*$/i, '')
    .replace(/\s*-\s*S\d+.*$/i, '')
    .replace(/\s*-\s*\d+\.\s*Sezon.*$/i, '')
    .replace(/\s*\(\d{4}\).*/, '')
    .trim();
}
