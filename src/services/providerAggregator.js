/* ==========================================================================
   CinePulse Studio - Master Stream Aggregator
   Aggregates live Turkish & Global VIP sources:
   - VIP Hat 1 (Sinewix 1080p MKV/MP4 Direct)
   - VIP Hat 2 (DiziBal VIP 1080p)
   - VIP Hat 3 (DiziPal FastStream)
   - VIP Hat 4 (Channel Stream)
   - SezonlukDizi (VidMoly, Sibnet, VideoSoft, Netu)
   - Smashy 1080p (Top Altyazılı)
   - AutoEmbed 4K (Ultra HD Çoklu Dil)
   - MultiEmbed VIP (4K Premium)
   - VidSrc Pro (Hızlı VIP Hat)
   - AnimeTR / TRAnimeİzle / TürkAnime TV (1080p)
   - Belgesel & DMAX / TLC (Official HD Dublaj)
   ========================================================================== */

import { fetchDiziBalSources } from './diziBalScraper.js';
import { fetchSezonlukDiziEpisodeSources } from './sezonlukDiziScraper.js';
import { fetchDizipalSources } from './dizipalScraper.js';
import { fetchSinewixSources } from './sinewixScraper.js';
import { fetchFilmizlechSources } from './filmizlechScraper.js';
import { fetchAnimeTrSources } from './animeTrScraper.js';
import { fetchTrAnimeIzleSources } from './tranimeizleScraper.js';
import { fetchTurkAnimeSources } from './turkanimeScraper.js';
import { fetchBelgeselSources } from './belgeselScraper.js';
import { fetchDmaxTlcSources } from './dmaxTlcScraper.js';
import { fetchDiziyouSources } from './diziyouScraper.js';
import { fetchFilmEkseniSources } from './filmekseniScraper.js';
import { fetchHDFilmDelisiSources } from './hdfilmdelisiScraper.js';

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

  const { candidateTitles } = await resolveCandidateTitles(type, tmdbId, targetTitle, originalTitle);

  // Concurrent scraping of active, verified premium providers
  const [
    snxDub,
    dblDub,
    dblSub,
    dzpDub,
    flzDub,
    flzSub,
    szdDub,
    szdSub,
    dzyDub,
    fexDub,
    fexSub,
    hfdDub,
    antrSub,
    traSub,
    taSub,
    blgDub
  ] = await Promise.all([
    withTimeout(fetchSinewixSources({ type, titles: candidateTitles, title: targetTitle, seriesTitle: targetTitle, originalTitle, season, episode, isDub: true })),
    withTimeout(fetchDiziBalSources({ type, title: targetTitle, originalTitle, season, episode, isDub: true })),
    withTimeout(fetchDiziBalSources({ type, title: targetTitle, originalTitle, season, episode, isDub: false })),
    withTimeout(fetchDizipalSources({ type, title: targetTitle, seriesTitle: targetTitle, originalTitle, season, episode, isDub: true })),
    withTimeout(fetchFilmizlechSources({ type, title: targetTitle, seriesTitle: targetTitle, originalTitle, season, episode, isDub: true })),
    withTimeout(fetchFilmizlechSources({ type, title: targetTitle, seriesTitle: targetTitle, originalTitle, season, episode, isDub: false })),
    !isMovie ? withTimeout(fetchSezonlukDiziEpisodeSources({ titles: candidateTitles, season, episode, isDub: true })) : Promise.resolve([]),
    !isMovie ? withTimeout(fetchSezonlukDiziEpisodeSources({ titles: candidateTitles, season, episode, isDub: false })) : Promise.resolve([]),
    !isMovie ? withTimeout(fetchDiziyouSources({ titles: candidateTitles, title: targetTitle, seriesTitle: targetTitle, originalTitle, season, episode, isDub: true })) : Promise.resolve([]),
    isMovie ? withTimeout(fetchFilmEkseniSources({ type, titles: candidateTitles, title: targetTitle, originalTitle, isDub: true })) : Promise.resolve([]),
    isMovie ? withTimeout(fetchFilmEkseniSources({ type, titles: candidateTitles, title: targetTitle, originalTitle, isDub: false })) : Promise.resolve([]),
    isMovie ? withTimeout(fetchHDFilmDelisiSources({ type, titles: candidateTitles, title: targetTitle, originalTitle, isDub: true })) : Promise.resolve([]),
    withTimeout(fetchAnimeTrSources({ titles: candidateTitles, seriesTitle: targetTitle, title: targetTitle, originalTitle, season, episode, isDub: false })),
    withTimeout(fetchTrAnimeIzleSources({ titles: candidateTitles, seriesTitle: targetTitle, title: targetTitle, originalTitle, season, episode, isDub: false })),
    withTimeout(fetchTurkAnimeSources({ titles: candidateTitles, seriesTitle: targetTitle, title: targetTitle, originalTitle, season, episode, isDub: false })),
    withTimeout(fetchBelgeselSources({ titles: candidateTitles, seriesTitle: targetTitle, title: targetTitle, originalTitle, season, episode, isDub: true }))
  ]);

  function anonymizeServerLabel(rawName, fallback = 'VIP Hat') {
    if (!rawName) return fallback;
    let clean = rawName
      .replace(/\s*\([^)]*(?:Dublaj|Altyazılı|Türkçe|1080p|HD|S\d+:E\d+)[^)]*\)/gi, '')
      .replace(/\s*\(1080p\)/gi, '')
      .replace(/\s*1080p/gi, '')
      .replace(/\s*Stream\s*/gi, '')
      .trim();

    // Sanitize any site names or brand identifiers into anonymous clean labels
    clean = clean
      .replace(/sinewix/gi, 'VIP Hat 1')
      .replace(/dizibal/gi, 'VIP Hat 2')
      .replace(/dizipal/gi, 'VIP Hat 3')
      .replace(/filmizlech/gi, 'VIP Hat 4')
      .replace(/channel/gi, 'VIP Hat 4')
      .replace(/sezonlukdizi/gi, 'VIP Hat 5')
      .trim();

    if (!clean || clean.toLowerCase() === 'vip' || clean.toLowerCase() === 'fast' || clean.length < 2) {
      return fallback;
    }
    return clean;
  }

  function anonymizeBadge(rawBadge, fallback = '⚡ VIP') {
    if (!rawBadge) return fallback;
    let clean = rawBadge
      .replace(/sinewix/gi, 'VIP')
      .replace(/dizibal/gi, 'VIP')
      .replace(/dizipal/gi, 'VIP')
      .replace(/filmizlech/gi, 'VIP')
      .replace(/channel/gi, 'VIP')
      .replace(/sezonlukdizi/gi, 'VIP')
      .replace(/\s*1080p\s*/gi, '')
      .replace(/\s*HD\s*/gi, '')
      .trim();
    if (!clean || clean.length < 2) return fallback;
    return clean.startsWith('⚡') || clean.startsWith('💬') || clean.startsWith('🌿') ? clean : `⚡ ${clean}`;
  }

  const mapDubbedSources = (rawList) => (rawList || [])
    .filter(s => {
      const urlStr = (s.url || s.streamUrl || '').toLowerCase();
      return urlStr &&
        !urlStr.includes('recaptcha') &&
        !urlStr.includes('liderfilm') &&
        !urlStr.includes('filmmakinesi') &&
        !urlStr.includes('dizipal.bid') &&
        urlStr.length > 8;
    })
    .map(s => {
      const shortName = anonymizeServerLabel(s.name, 'VIP Dublaj');
      const badge = anonymizeBadge(s.badge, '⚡ VIP');
      return {
        id: s.id,
        name: shortName,
        displayName: shortName,
        badge: badge,
        category: 'dubbed',
        isHls: s.isHls,
        isDirectVideo: s.isDirectVideo,
        streamUrl: s.streamUrl,
        getUrl: () => s.streamUrl || s.url
      };
    });

  const rawCleanDubbed = [
    ...mapDubbedSources(blgDub),
    ...mapDubbedSources(dzyDub),
    ...mapDubbedSources(fexDub),
    ...mapDubbedSources(hfdDub),
    ...mapDubbedSources(snxDub),
    ...mapDubbedSources(dblDub),
    ...mapDubbedSources(dzpDub),
    ...mapDubbedSources(flzDub),
    ...mapDubbedSources(szdDub)
  ];

  // If local Turkish scrapers couldn't find active streams, provide verified fast global failovers
  const cleanDubbed = rawCleanDubbed.length > 0 ? rawCleanDubbed : [
    {
      id: 'dub_autoembed',
      name: 'AutoEmbed 4K',
      displayName: 'AutoEmbed 4K',
      badge: '⚡ AutoEmbed',
      category: 'dubbed',
      getUrl: () => isMovie
        ? `https://player.autoembed.co/embed/movie/${tmdbId}`
        : `https://player.autoembed.co/embed/tv/${tmdbId}/${season}/${episode}`
    },
    {
      id: 'dub_multiembed',
      name: 'MultiEmbed VIP',
      displayName: 'MultiEmbed VIP',
      badge: '⚡ MultiEmbed',
      category: 'dubbed',
      getUrl: () => isMovie
        ? `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1`
        : `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1&s=${season}&e=${episode}`
    },
    {
      id: 'dub_vidsrcme',
      name: 'VidSrc Pro',
      displayName: 'VidSrc Pro',
      badge: '⚡ VidSrc',
      category: 'dubbed',
      getUrl: () => isMovie
        ? `https://vidsrc.me/embed/movie?tmdb=${tmdbId}`
        : `https://vidsrc.me/embed/tv?tmdb=${tmdbId}&sea=${season}&epi=${episode}`
    }
  ];

  const mapSubtitledSources = (rawList) => (rawList || [])
    .filter(s => {
      const urlStr = (s.url || s.streamUrl || '').toLowerCase();
      return urlStr &&
        !urlStr.includes('recaptcha') &&
        !urlStr.includes('liderfilm') &&
        !urlStr.includes('filmmakinesi') &&
        !urlStr.includes('dizipal.bid') &&
        urlStr.length > 8;
    })
    .map(s => {
      const shortName = anonymizeServerLabel(s.name, 'VIP Altyazılı');
      const badge = anonymizeBadge(s.badge, '💬 Altyazılı');
      return {
        id: s.id,
        name: shortName,
        displayName: shortName,
        badge: badge,
        category: 'subtitled',
        isHls: s.isHls,
        isDirectVideo: s.isDirectVideo,
        streamUrl: s.streamUrl,
        getUrl: () => s.streamUrl || s.url
      };
    });

  const cleanSubtitled = [
    // 1. Smashy (Top / 1st source for Subtitles)
    {
      id: 'sub_smashystream',
      name: 'Smashy 1080p',
      displayName: 'Smashy 1080p',
      badge: '⚡ Smashy',
      category: 'subtitled',
      getUrl: () => isMovie
        ? `https://embed.smashystream.com/playere.php?tmdb=${tmdbId}`
        : `https://embed.smashystream.com/playere.php?tmdb=${tmdbId}&season=${season}&episode=${episode}`
    },
    // 2. AutoEmbed (Ultra HD)
    {
      id: 'sub_autoembed',
      name: 'AutoEmbed 4K',
      displayName: 'AutoEmbed 4K',
      badge: '⚡ AutoEmbed',
      category: 'subtitled',
      getUrl: () => isMovie
        ? `https://player.autoembed.co/embed/movie/${tmdbId}`
        : `https://player.autoembed.co/embed/tv/${tmdbId}/${season}/${episode}`
    },
    // 3. MultiEmbed (4K Premium)
    {
      id: 'sub_multiembed',
      name: 'MultiEmbed VIP',
      displayName: 'MultiEmbed VIP',
      badge: '⚡ MultiEmbed',
      category: 'subtitled',
      getUrl: () => isMovie
        ? `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1`
        : `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1&s=${season}&e=${episode}`
    },
    // 4. VidSrc Pro (Hızlı & Doğrulanmış)
    {
      id: 'sub_vidsrcme',
      name: 'VidSrc Pro',
      displayName: 'VidSrc Pro',
      badge: '⚡ VidSrc',
      category: 'subtitled',
      getUrl: () => isMovie
        ? `https://vidsrc.me/embed/movie?tmdb=${tmdbId}`
        : `https://vidsrc.me/embed/tv?tmdb=${tmdbId}&sea=${season}&epi=${episode}`
    },
    // 5. Local Turkish / Anime Subtitled Scrapers
    ...mapSubtitledSources(fexSub),
    ...mapSubtitledSources(dzpDub),
    ...mapSubtitledSources(dblSub),
    ...mapSubtitledSources(flzSub),
    ...mapSubtitledSources(antrSub),
    ...mapSubtitledSources(traSub),
    ...mapSubtitledSources(taSub),
    ...mapSubtitledSources(szdSub)
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
