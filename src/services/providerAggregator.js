/* ==========================================================================
   CinePulse Studio - Master Stream Aggregator
   Aggregates live Turkish & Global VIP sources:
   - SezonlukDizi (VidMoly, Sibnet, Netu, VideoSoft, FileMoon)
   - DiziBal (VIP 1080p Dublaj & Altyazılı)
   - Sinewix (Android VIP 1080p HLS)
   - Dizipal (1080p HLS FastStream)
   - Now Stream / Filmizle (1080p Dublaj & Altyazılı)
   - FilmizleCh (1080p)
   - AnimeTR / TRAnimeİzle / TürkAnime TV (1080p)
   - BelgeselX / Belgeselce (1080p)
   - AutoEmbed VIP / EmbedSU / VidSrc ICU / SmashyStream / VidLink / SuperEmbed
   ========================================================================== */

import { fetchDiziBalSources } from './diziBalScraper.js';
import { fetchSezonlukDiziEpisodeSources } from './sezonlukDiziScraper.js';
import { fetchDizipalSources } from './dizipalScraper.js';
import { fetchSinewixSources } from './sinewixScraper.js';
import { fetchFilmizlechSources } from './filmizlechScraper.js';
import { fetchFilmizleNowSources } from './filmizleNowScraper.js';
import { fetchAnimeTrSources } from './animeTrScraper.js';
import { fetchTrAnimeIzleSources } from './tranimeizleScraper.js';
import { fetchTurkAnimeSources } from './turkanimeScraper.js';
import { fetchBelgeselSources } from './belgeselScraper.js';

const TMDB_API_KEY = '4e44d9029b1270a757cddc766a1bcb63';

// In-Memory Stream Cache for instant 0ms lookups
const streamServersCache = new Map();

function cleanTitle(raw) {
  if (!raw) return '';
  return raw
    .replace(/\s*-\s*S\d+E\d+.*$/i, '')
    .replace(/\s*-\s*S\d+.*$/i, '')
    .replace(/\s*-\s*\d+\.\s*Sezon.*$/i, '')
    .replace(/\s*\(\d{4}\).*/, '')
    .trim();
}

function withTimeout(promise, ms = 7500) {
  return Promise.race([
    promise.catch(() => []),
    new Promise(resolve => setTimeout(() => resolve([]), ms))
  ]);
}

async function resolveCandidateTitles(type, tmdbId, targetTitle, originalTitle) {
  const titles = new Set();
  if (targetTitle) titles.add(targetTitle);
  if (originalTitle) titles.add(originalTitle);

  let detectedYear = null;

  if (tmdbId) {
    try {
      const enRes = await fetch(`https://api.themoviedb.org/3/${type}/${tmdbId}?api_key=${TMDB_API_KEY}&language=en-US`).catch(() => null);
      if (enRes && enRes.ok) {
        const enData = await enRes.json().catch(() => null);
        if (enData) {
          const enName = enData.name || enData.title;
          if (enName) titles.add(cleanTitle(enName));
          if (enData.original_name) titles.add(cleanTitle(enData.original_name));
          if (enData.original_title) titles.add(cleanTitle(enData.original_title));
          const dateStr = enData.release_date || enData.first_air_date;
          if (dateStr) detectedYear = dateStr.substring(0, 4);
        }
      }

      const altRes = await fetch(`https://api.themoviedb.org/3/${type}/${tmdbId}/alternative_titles?api_key=${TMDB_API_KEY}`).catch(() => null);
      if (altRes && altRes.ok) {
        const altData = await altRes.json().catch(() => null);
        const results = altData && (altData.results || altData.titles) ? (altData.results || altData.titles) : [];
        for (const r of results) {
          const t = r.title || r.name;
          if (t && (r.iso_3166_1 === 'US' || r.iso_3166_1 === 'JP' || r.iso_3166_1 === 'TR' || !r.iso_3166_1)) {
            titles.add(cleanTitle(t));
          }
        }
      }
    } catch (_) {}
  }

  return {
    candidateTitles: [...titles].filter(t => t && typeof t === 'string' && t.trim().length > 1),
    detectedYear
  };
}

export async function getStreamingServers({ type = 'tv', tmdbId, title = '', seriesTitle = '', originalTitle = '', year = null, season = 1, episode = 1 }) {
  const isMovie = type === 'movie';
  const targetTitle = cleanTitle(seriesTitle) || cleanTitle(title) || cleanTitle(originalTitle);

  const cacheKey = `${type}_${tmdbId || targetTitle}_s${season}_e${episode}`;
  if (streamServersCache.has(cacheKey)) {
    return streamServersCache.get(cacheKey);
  }

  const { candidateTitles, detectedYear } = await resolveCandidateTitles(type, tmdbId, targetTitle, originalTitle);
  const targetYear = year || detectedYear;

  const [
    dblDub, dblSub,
    szdDub, szdSub,
    snxDub,
    dzpDub,
    flzDub, flzSub,
    finDub, finSub,
    antrSub,
    traSub,
    taSub,
    blgDub
  ] = await Promise.all([
    withTimeout(fetchDiziBalSources({ titles: candidateTitles, type, title: targetTitle, seriesTitle: targetTitle, originalTitle, year: targetYear, season, episode, isDub: true })),
    withTimeout(fetchDiziBalSources({ titles: candidateTitles, type, title: targetTitle, seriesTitle: targetTitle, originalTitle, year: targetYear, season, episode, isDub: false })),
    !isMovie ? withTimeout(fetchSezonlukDiziEpisodeSources({ titles: candidateTitles, seriesTitle: targetTitle, originalTitle, season, episode, isDub: true })) : Promise.resolve([]),
    !isMovie ? withTimeout(fetchSezonlukDiziEpisodeSources({ titles: candidateTitles, seriesTitle: targetTitle, originalTitle, season, episode, isDub: false })) : Promise.resolve([]),
    withTimeout(fetchSinewixSources({ type, title: targetTitle, originalTitle, year: targetYear, season, episode, isDub: true })),
    withTimeout(fetchDizipalSources({ type, title: targetTitle, seriesTitle: targetTitle, originalTitle, season, episode, isDub: true })),
    withTimeout(fetchFilmizlechSources({ type, title: targetTitle, seriesTitle: targetTitle, originalTitle, season, episode, isDub: true })),
    withTimeout(fetchFilmizlechSources({ type, title: targetTitle, seriesTitle: targetTitle, originalTitle, season, episode, isDub: false })),
    withTimeout(fetchFilmizleNowSources({ type, title: targetTitle, seriesTitle: targetTitle, originalTitle, year: targetYear, season, episode, isDub: true })),
    withTimeout(fetchFilmizleNowSources({ type, title: targetTitle, seriesTitle: targetTitle, originalTitle, year: targetYear, season, episode, isDub: false })),
    withTimeout(fetchAnimeTrSources({ titles: candidateTitles, seriesTitle: targetTitle, title: targetTitle, originalTitle, season, episode, isDub: false })),
    withTimeout(fetchTrAnimeIzleSources({ titles: candidateTitles, seriesTitle: targetTitle, title: targetTitle, originalTitle, season, episode, isDub: false })),
    withTimeout(fetchTurkAnimeSources({ titles: candidateTitles, seriesTitle: targetTitle, title: targetTitle, originalTitle, season, episode, isDub: false })),
    withTimeout(fetchBelgeselSources({ titles: candidateTitles, seriesTitle: targetTitle, title: targetTitle, originalTitle, season, episode, isDub: true }))
  ]);

  const mapDubbedSources = (rawList) => (rawList || [])
    .filter(s => {
      const urlStr = (s.url || s.streamUrl || '').toLowerCase();
      return urlStr && !urlStr.includes('recaptcha') && urlStr.length > 8;
    })
    .map(s => ({
      id: s.id,
      name: s.name,
      badge: s.badge || '⚡ 1080p',
      category: 'dubbed',
      isHls: s.isHls,
      isDirectVideo: s.isDirectVideo,
      streamUrl: s.streamUrl,
      getUrl: () => s.streamUrl || s.url
    }));

  const cleanDubbed = [
    ...mapDubbedSources(dblDub),
    ...mapDubbedSources(szdDub),
    ...mapDubbedSources(snxDub),
    ...mapDubbedSources(dzpDub),
    ...mapDubbedSources(flzDub),
    ...mapDubbedSources(finDub),
    ...mapDubbedSources(blgDub)
  ];

  const mapSubtitledSources = (rawList) => (rawList || [])
    .filter(s => {
      const urlStr = (s.url || s.streamUrl || '').toLowerCase();
      return urlStr && !urlStr.includes('recaptcha') && urlStr.length > 8;
    })
    .map(s => ({
      id: s.id,
      name: s.name,
      badge: s.badge || '💬 1080p',
      category: 'subtitled',
      isHls: s.isHls,
      isDirectVideo: s.isDirectVideo,
      streamUrl: s.streamUrl,
      getUrl: () => s.streamUrl || s.url
    }));

  const cleanSubtitled = [
    {
      id: 'sub_smashystream',
      name: 'Smashy Stream (1080p Altyazılı)',
      badge: '⚡ Smashy 1080p',
      category: 'subtitled',
      getUrl: () => isMovie
        ? `https://embed.smashystream.com/playere.php?tmdb=${tmdbId}`
        : `https://embed.smashystream.com/playere.php?tmdb=${tmdbId}&season=${season}&episode=${episode}`
    },
    ...mapSubtitledSources(antrSub),
    ...mapSubtitledSources(traSub),
    ...mapSubtitledSources(taSub),
    ...mapSubtitledSources(dblSub),
    ...mapSubtitledSources(szdSub),
    ...mapSubtitledSources(flzSub),
    ...mapSubtitledSources(finSub),
    {
      id: 'sub_autoembed',
      name: 'AutoEmbed VIP (1080p Altyazılı)',
      badge: '⚡ AutoEmbed',
      category: 'subtitled',
      getUrl: () => isMovie
        ? `https://player.autoembed.cc/embed/movie/${tmdbId}`
        : `https://player.autoembed.cc/embed/tv/${tmdbId}/${season}/${episode}`
    },
    {
      id: 'sub_embedsu',
      name: 'EmbedSU 4K VIP (Altyazılı)',
      badge: '⚡ EmbedSU 4K',
      category: 'subtitled',
      getUrl: () => isMovie
        ? `https://embed.su/embed/movie/${tmdbId}`
        : `https://embed.su/embed/tv/${tmdbId}/${season}/${episode}`
    },
    {
      id: 'sub_vidsrc_icu',
      name: 'VidSrc ICU (1080p Altyazılı)',
      badge: '⚡ VidSrc 1080p',
      category: 'subtitled',
      getUrl: () => isMovie
        ? `https://vidsrc.icu/embed/movie/${tmdbId}`
        : `https://vidsrc.icu/embed/tv/${tmdbId}/${season}/${episode}`
    },
    {
      id: 'sub_vidlink',
      name: 'VidLink VIP Stream',
      badge: '⚡ VidLink 1080p',
      category: 'subtitled',
      getUrl: () => isMovie
        ? `https://vidlink.pro/movie/${tmdbId}`
        : `https://vidlink.pro/tv/${tmdbId}/${season}/${episode}`
    },
    {
      id: 'sub_superembed',
      name: 'SuperEmbed Stream (1080p Altyazılı)',
      badge: '💬 SuperEmbed',
      category: 'subtitled',
      getUrl: () => isMovie
        ? `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1`
        : `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1&s=${season}&e=${episode}`
    }
  ];

  if (cleanDubbed.length === 0) {
    cleanDubbed.push({
      id: 'dub_not_found',
      name: 'Dublaj Bulunamadı',
      badge: '⚠️ Yok',
      category: 'dubbed',
      notFound: true,
      getUrl: () => ''
    });
  }

  const result = {
    dubbed: cleanDubbed,
    subtitled: cleanSubtitled
  };

  streamServersCache.set(cacheKey, result);
  return result;
}
