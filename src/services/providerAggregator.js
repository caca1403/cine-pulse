/* ==========================================================================
   CinePulse Studio - Master Stream Aggregator
   Aggregates live Turkish & Global VIP sources:
   - FilmMakinesi (Rapid & CloseLoad 1080p DUAL)
   - SezonlukDizi (VidMoly, Sibnet, Netu, VideoSoft, FileMoon)
   - DiziBal (VIP 1080p Dublaj & Altyazılı)
   - Sinewix (Android VIP 1080p HLS)
   - Dizipal (1080p HLS FastStream)
   - FilmizleCh / Channel Stream (1080p)
   - Now Stream / Filmizle (1080p Dublaj & Altyazılı)
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
import { fetchFilmMakinesiSources } from './filmMakinesiScraper.js';
import { fetchAnimeTrSources } from './animeTrScraper.js';
import { fetchTrAnimeIzleSources } from './tranimeizleScraper.js';
import { fetchTurkAnimeSources } from './turkanimeScraper.js';
import { fetchBelgeselSources } from './belgeselScraper.js';
import { fetchDmaxTlcSources } from './dmaxTlcScraper.js';

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

function withTimeout(promise, ms = 5500) {
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
      const enRes = await fetch(`https://api.themoviedb.org/3/${type}/${tmdbId}?api_key=${TMDB_API_KEY}&language=en-US`, { signal: AbortSignal.timeout(1200) }).catch(() => null);
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

      const altRes = await fetch(`https://api.themoviedb.org/3/${type}/${tmdbId}/alternative_titles?api_key=${TMDB_API_KEY}`, { signal: AbortSignal.timeout(1200) }).catch(() => null);
      if (altRes && altRes.ok) {
        const altData = await altRes.json().catch(() => null);
        const altList = altData?.titles || altData?.results || [];
        for (const item of altList) {
          if (item.iso_3166_1 === 'TR' || item.iso_3166_1 === 'US' || item.iso_3166_1 === 'GB') {
            if (item.title) titles.add(cleanTitle(item.title));
          }
        }
      }
    } catch (_) {}
  }

  return { candidateTitles: Array.from(titles).filter(Boolean), detectedYear };
}

export async function getStreamingServers({
  type = 'movie',
  tmdbId = null,
  title = '',
  originalTitle = '',
  seriesTitle = '',
  year = null,
  season = 1,
  episode = 1
}) {
  const isMovie = (type === 'movie');
  const targetTitle = cleanTitle(seriesTitle || title);
  const cacheKey = `${type}_${tmdbId || targetTitle}_s${season}_e${episode}`;

  if (streamServersCache.has(cacheKey)) {
    return streamServersCache.get(cacheKey);
  }

  const { candidateTitles, detectedYear } = await resolveCandidateTitles(type, tmdbId, targetTitle, originalTitle);
  const targetYear = year || detectedYear;

  // Concurrent scraping of all premium providers
  const [
    fmkDub,
    fmkSub,
    dblDub,
    dblSub,
    szdDub,
    szdSub,
    snxDub,
    dzpDub,
    flzDub,
    flzSub,
    finDub,
    finSub,
    antrSub,
    traSub,
    taSub,
    blgDub
  ] = await Promise.all([
    withTimeout(fetchFilmMakinesiSources({ type, title: targetTitle, seriesTitle: targetTitle, originalTitle, season, episode, isDub: true })),
    withTimeout(fetchFilmMakinesiSources({ type, title: targetTitle, seriesTitle: targetTitle, originalTitle, season, episode, isDub: false })),
    withTimeout(fetchDiziBalSources({ type, title: targetTitle, originalTitle, season, episode, isDub: true })),
    withTimeout(fetchDiziBalSources({ type, title: targetTitle, originalTitle, season, episode, isDub: false })),
    !isMovie ? withTimeout(fetchSezonlukDiziEpisodeSources({ titles: candidateTitles, season, episode, isDub: true })) : Promise.resolve([]),
    !isMovie ? withTimeout(fetchSezonlukDiziEpisodeSources({ titles: candidateTitles, season, episode, isDub: false })) : Promise.resolve([]),
    withTimeout(fetchSinewixSources({ type, titles: candidateTitles, title: targetTitle, seriesTitle: targetTitle, originalTitle, season, episode, isDub: true })),
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

  function cleanServerLabel(rawName, fallback = 'VIP Stream') {
    if (!rawName) return fallback;
    let clean = rawName
      .replace(/\s*\(Dublaj\)/gi, '')
      .replace(/\s*\(Altyazılı\)/gi, '')
      .replace(/\s*\(Türkçe\)/gi, '')
      .replace(/\s*\(1080p\)/gi, '')
      .replace(/\s*1080p/gi, '')
      .replace(/\s*Stream\s*/gi, '')
      .trim();

    if (!clean || clean.toLowerCase() === 'channel' || clean.toLowerCase() === 'vip' || clean.toLowerCase() === 'fast' || clean.length < 2) {
      return fallback;
    }
    return clean;
  }

  const mapDubbedSources = (rawList) => (rawList || [])
    .filter(s => {
      const urlStr = (s.url || s.streamUrl || '').toLowerCase();
      return urlStr &&
        !urlStr.includes('recaptcha') &&
        !urlStr.includes('ag2m4.cfd') &&
        !urlStr.includes('liderfilm') &&
        urlStr.length > 8;
    })
    .map(s => {
      const shortName = cleanServerLabel(s.name, 'VIP Dublaj');
      return {
        id: s.id,
        name: shortName,
        displayName: shortName,
        badge: (s.badge || '⚡ VIP').replace(/\s*1080p\s*/gi, '').replace(/\s*HD\s*/gi, '').trim(),
        category: 'dubbed',
        isHls: s.isHls,
        isDirectVideo: s.isDirectVideo,
        streamUrl: s.streamUrl,
        getUrl: () => s.streamUrl || s.url
      };
    });

  const rawCleanDubbed = [
    ...mapDubbedSources(blgDub),
    ...mapDubbedSources(fmkDub),
    ...mapDubbedSources(dblDub),
    ...mapDubbedSources(szdDub),
    ...mapDubbedSources(snxDub),
    ...mapDubbedSources(dzpDub),
    ...mapDubbedSources(flzDub),
    ...mapDubbedSources(finDub)
  ];

  // If local Turkish scrapers couldn't find active streams, provide global multi-track VIP CDN
  const cleanDubbed = rawCleanDubbed.length > 0 ? rawCleanDubbed : [
    {
      id: 'dub_videasy',
      name: 'Videasy 4K',
      displayName: 'Videasy 4K',
      badge: '⚡ Videasy 4K',
      category: 'dubbed',
      getUrl: () => isMovie
        ? `https://player.videasy.net/movie/${tmdbId}`
        : `https://player.videasy.net/tv/${tmdbId}/${season}/${episode}`
    },
    {
      id: 'dub_vidlink',
      name: 'VidLink VIP',
      displayName: 'VidLink VIP',
      badge: '⚡ VidLink',
      category: 'dubbed',
      getUrl: () => isMovie
        ? `https://vidlink.pro/movie/${tmdbId}`
        : `https://vidlink.pro/tv/${tmdbId}/${season}/${episode}`
    },
    {
      id: 'dub_vidsrccc',
      name: 'VidSrc Pro',
      displayName: 'VidSrc Pro',
      badge: '⚡ VidSrc Pro',
      category: 'dubbed',
      getUrl: () => isMovie
        ? `https://vidsrc.cc/v2/embed/movie/${tmdbId}`
        : `https://vidsrc.cc/v2/embed/tv/${tmdbId}/${season}/${episode}`
    },
    {
      id: 'dub_2embed',
      name: '2Embed VIP',
      displayName: '2Embed VIP',
      badge: '⚡ 2Embed',
      category: 'dubbed',
      getUrl: () => isMovie
        ? `https://www.2embed.cc/embed/${tmdbId}`
        : `https://www.2embed.cc/embedtv/${tmdbId}&s=${season}&e=${episode}`
    }
  ];

  const mapSubtitledSources = (rawList) => (rawList || [])
    .filter(s => {
      const urlStr = (s.url || s.streamUrl || '').toLowerCase();
      return urlStr &&
        !urlStr.includes('recaptcha') &&
        !urlStr.includes('ag2m4.cfd') &&
        !urlStr.includes('liderfilm') &&
        urlStr.length > 8;
    })
    .map(s => {
      const shortName = cleanServerLabel(s.name);
      return {
        id: s.id,
        name: shortName,
        displayName: shortName,
        badge: (s.badge || '💬 Altyazılı').replace(/\s*1080p\s*/gi, '').replace(/\s*HD\s*/gi, '').trim(),
        category: 'subtitled',
        isHls: s.isHls,
        isDirectVideo: s.isDirectVideo,
        streamUrl: s.streamUrl,
        getUrl: () => s.streamUrl || s.url
      };
    });

  const cleanSubtitled = [
    {
      id: 'sub_videasy',
      name: 'Videasy 4K',
      displayName: 'Videasy 4K',
      badge: '⚡ Videasy 4K',
      category: 'subtitled',
      getUrl: () => isMovie
        ? `https://player.videasy.net/movie/${tmdbId}`
        : `https://player.videasy.net/tv/${tmdbId}/${season}/${episode}`
    },
    {
      id: 'sub_vidlink',
      name: 'VidLink VIP',
      displayName: 'VidLink VIP',
      badge: '⚡ VidLink',
      category: 'subtitled',
      getUrl: () => isMovie
        ? `https://vidlink.pro/movie/${tmdbId}`
        : `https://vidlink.pro/tv/${tmdbId}/${season}/${episode}`
    },
    {
      id: 'sub_vidsrccc',
      name: 'VidSrc Pro',
      displayName: 'VidSrc Pro',
      badge: '⚡ VidSrc Pro',
      category: 'subtitled',
      getUrl: () => isMovie
        ? `https://vidsrc.cc/v2/embed/movie/${tmdbId}`
        : `https://vidsrc.cc/v2/embed/tv/${tmdbId}/${season}/${episode}`
    },
    {
      id: 'sub_2embed',
      name: '2Embed VIP',
      displayName: '2Embed VIP',
      badge: '⚡ 2Embed',
      category: 'subtitled',
      getUrl: () => isMovie
        ? `https://www.2embed.cc/embed/${tmdbId}`
        : `https://www.2embed.cc/embedtv/${tmdbId}&s=${season}&e=${episode}`
    },
    {
      id: 'sub_smashystream',
      name: 'Smashy',
      displayName: 'Smashy',
      badge: '⚡ Smashy',
      category: 'subtitled',
      getUrl: () => isMovie
        ? `https://embed.smashystream.com/playere.php?tmdb=${tmdbId}`
        : `https://embed.smashystream.com/playere.php?tmdb=${tmdbId}&season=${season}&episode=${episode}`
    },
    ...mapSubtitledSources(fmkSub),
    ...mapSubtitledSources(antrSub),
    ...mapSubtitledSources(traSub),
    ...mapSubtitledSources(taSub),
    ...mapSubtitledSources(dblSub),
    ...mapSubtitledSources(szdSub),
    ...mapSubtitledSources(flzSub),
    ...mapSubtitledSources(finSub),
    {
      id: 'sub_rivestream',
      name: 'RiveStream HD',
      displayName: 'RiveStream HD',
      badge: '⚡ RiveStream',
      category: 'subtitled',
      getUrl: () => isMovie
        ? `https://rivestream.live/embed?type=movie&id=${tmdbId}`
        : `https://rivestream.live/embed?type=series&id=${tmdbId}&season=${season}&episode=${episode}`
    }
  ];

  const result = {
    dubbed: cleanDubbed,
    subtitled: cleanSubtitled,
    totalServers: cleanDubbed.length + cleanSubtitled.length
  };

  // Cache for instant navigation
  streamServersCache.set(cacheKey, result);

  return result;
}
