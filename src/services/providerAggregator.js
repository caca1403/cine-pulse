/* ==========================================================================
   CinePulse Studio - Master Stream Aggregator (Progressive Live Streaming)
   Aggregates live Turkish & Global VIP sources with 0ms fast-start & progressive discovery:
   - FilmMakinesi (Rapid HLS 1080p Master & Closeload HD)
   - Sinewix (Direct 1080p MKV/MP4 Stream)
   - DiziBal (Alpha Stream 1080p)
   - SezonlukDizi (VidMoly 1080p, Sibnet HD, Netu)
   - Diziyou (HLS FastCDN 1080p)
   - HDFilmizle / FilmEkseni / DiziPal / Filmizlech
   - Smashy 1080p / AutoEmbed 4K / MultiEmbed VIP / VidSrc Pro
   - AnimeTR / TRAnimeİzle / TürkAnime TV (1080p)
   - Belgesel & DMAX / TLC
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
import { fetchHDFilmizleSources } from './hdfilmizleScraper.js';
import { fetchFilmMakinesiSources } from './filmMakinesiScraper.js';
import { fetchDizimomSources } from './dizimomScraper.js';
import { fetchHDFilmcehennemiSources } from './hdfilmcehennemiScraper.js';

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

async function resolveCandidateTitles(type, tmdbId, targetTitle, originalTitle) {
  const titles = new Set();
  if (targetTitle) titles.add(targetTitle);
  if (originalTitle) titles.add(originalTitle);

  let detectedYear = null;

  if (tmdbId) {
    try {
      const enRes = await fetch(`https://api.themoviedb.org/3/${type}/${tmdbId}?api_key=${TMDB_API_KEY}&language=en-US`, { signal: AbortSignal.timeout(1500) }).catch(() => null);
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

      const altRes = await fetch(`https://api.themoviedb.org/3/${type}/${tmdbId}/alternative_titles?api_key=${TMDB_API_KEY}`, { signal: AbortSignal.timeout(1500) }).catch(() => null);
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

  // Smart franchise and sequel alias expansions
  const expanded = new Set(titles);
  for (const t of titles) {
    if (!t) continue;
    const withNums = t
      .replace(/\bpart\s+two\b/i, 'Part 2')
      .replace(/\bpart\s+three\b/i, 'Part 3')
      .replace(/\bpart\s+four\b/i, 'Part 4')
      .replace(/\bpart\s+one\b/i, 'Part 1')
      .replace(/\bbolum\s+iki\b/i, 'Bölüm 2')
      .replace(/\bbolum\s+uc\b/i, 'Bölüm 3')
      .replace(/\bpart\s+ii\b/i, 'Part 2')
      .replace(/\bpart\s+iii\b/i, 'Part 3')
      .replace(/\bpart\s+iv\b/i, 'Part 4')
      .replace(/\bpart\s+i\b/i, 'Part 1');
    expanded.add(withNums);

    const noNums = t
      .replace(/\bPart\s+\d+\b/gi, '')
      .replace(/\bBölüm\s+\d+\b/gi, '')
      .replace(/\b(II|III|IV|V|VI)\b/g, '')
      .trim();
    if (noNums && noNums.length > 2) expanded.add(noNums);
  }

  return { candidateTitles: Array.from(expanded).filter(Boolean), detectedYear };
}

export function resolveEngineName(s, fallback = 'Fast Stream') {
  const url = (s.url || s.streamUrl || (typeof s.getUrl === 'function' ? s.getUrl() : '') || '').toLowerCase();
  const raw = (s.displayName || s.name || '').toLowerCase();
  const id = (s.id || '').toLowerCase();

  if (url.includes('rapidrame') || url.includes('rapid') || raw.includes('rapid')) return 'Rapid FastStream 1080p';
  if (url.includes('closeload') || raw.includes('closeload')) return 'Closeload HD';
  if (url.includes('filmmakinesi') || raw.includes('filmmakinesi')) return 'FilmMakinesi VIP';
  if (id.startsWith('snx') || raw.includes('direct') || url.includes('.mkv') || url.includes('.webm') || url.includes('sinewix')) return 'Direct 1080p';
  if (url.includes('vidmoly') || raw.includes('vidmoly')) return 'VidMoly 1080p';
  if (url.includes('sibnet') || raw.includes('sibnet')) return 'Sibnet HD';
  if (url.includes('videosoft') || raw.includes('videosoft')) return 'VideoSoft Fast';
  if (url.includes('vidrame') || raw.includes('vidrame')) return 'Vidrame Pro';
  if (url.includes('eksenload') || url.includes('vidload') || raw.includes('eksen')) return 'EksenLoad VIP';
  if (url.includes('vidmody') || raw.includes('vidmody')) return 'VidMody Ultra';
  if (url.includes('rapidame') || raw.includes('rapidame')) return 'Rapidame 1080p';
  if (url.includes('ag2m4') || url.includes('agcdn') || raw.includes('alpha') || id.startsWith('dbl')) return 'Alpha Stream';
  if (url.includes('storage.diziyou') || id.startsWith('dzy')) return 'HLS FastCDN';
  if (url.includes('smashy') || raw.includes('smashy')) return 'Smashy 1080p';
  if (url.includes('autoembed') || raw.includes('autoembed')) return 'AutoEmbed 4K';
  if (url.includes('multiembed') || raw.includes('multiembed')) return 'MultiEmbed VIP';
  if (url.includes('vidsrc') || raw.includes('vidsrc')) return 'VidSrc Pro';
  if (raw.includes('channel') || url.includes('filmizlech')) return 'Channel Stream 1080p';
  if (url.includes('hdplayersystem') || url.includes('hdmomplayer') || id.startsWith('dzm') || raw.includes('dizimom')) return 'DiziMOM HD';
  if (raw.includes('belgesel')) return 'Belgesel TR';
  if (raw.includes('tranime') || raw.includes('turkanime') || raw.includes('animetr')) return 'Anime VIP';

  let clean = (s.displayName || s.name || '')
    .replace(/sinewix|dizibal|dizipal|dizimom|filmizlech|sezonlukdizi|filmekseni|hdfilmdelisi|hdfilmizle|hdfilmcehennemi|diziyou|vip\s*hat\s*\d*/gi, '')
    .replace(/\s*\(.*?\)/g, '')
    .trim();

  if (clean && clean.length > 2) return clean;
  return s.isDirectVideo || s.isHls ? 'Direct 1080p' : fallback;
}

function formatStreamItem(s, category, fallbackName) {
  const engineName = resolveEngineName(s, fallbackName);
  const badge = s.badge || (category === 'dubbed' ? '⚡ TR Dublaj' : '💬 TR Altyazı');
  return {
    id: s.id,
    name: engineName,
    displayName: engineName,
    badge: badge,
    category: category,
    isHls: s.isHls,
    isDirectVideo: s.isDirectVideo,
    streamUrl: s.streamUrl || s.url,
    url: s.streamUrl || s.url,
    getUrl: () => s.streamUrl || s.url
  };
}

function isValidStream(s) {
  const urlStr = (s.url || s.streamUrl || (typeof s.getUrl === 'function' ? s.getUrl() : '') || '').toLowerCase();
  return urlStr &&
    !urlStr.includes('recaptcha') &&
    !urlStr.includes('liderfilm') &&
    !urlStr.includes('dizipal.bid') &&
    !urlStr.includes('hdfilmdelisi') &&
    urlStr.length > 8;
}

/**
 * Progressive live streaming source aggregator.
 * Immediately returns baseline embeds, and streams live sources as they are discovered.
 */
export async function getStreamingServersProgressive({
  type = 'movie',
  tmdbId = null,
  title = '',
  originalTitle = '',
  seriesTitle = '',
  year = null,
  season = 1,
  episode = 1,
  onUpdate = () => {}
}) {
  const isMovie = (type === 'movie');
  const targetTitle = cleanTitle(seriesTitle || title);
  const cacheKey = `${type}_${tmdbId || targetTitle}_s${season}_e${episode}`;

  if (streamServersCache.has(cacheKey)) {
    const cached = streamServersCache.get(cacheKey);
    onUpdate({ ...cached, isComplete: true });
    return cached;
  }

  const { candidateTitles, detectedYear } = await resolveCandidateTitles(type, tmdbId, targetTitle, originalTitle);
  const targetYear = year || detectedYear;

  // Baseline instant Subtitled Embeds
  const initialSubtitled = [
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
    {
      id: 'sub_vidsrcme',
      name: 'VidSrc Pro',
      displayName: 'VidSrc Pro',
      badge: '⚡ VidSrc',
      category: 'subtitled',
      getUrl: () => isMovie
        ? `https://vidsrc.me/embed/movie?tmdb=${tmdbId}`
        : `https://vidsrc.me/embed/tv?tmdb=${tmdbId}&sea=${season}&epi=${episode}`
    }
  ];

  let currentDubbed = [];
  let currentSubtitled = [...initialSubtitled];
  const seenDubUrls = new Set();
  const seenSubUrls = new Set(initialSubtitled.map(s => s.getUrl()));

  // Send initial fast embeds immediately
  onUpdate({
    dubbed: [...currentDubbed],
    subtitled: [...currentSubtitled],
    totalServers: currentDubbed.length + currentSubtitled.length,
    isComplete: false
  });

  const addStreams = (rawList, category) => {
    if (!Array.isArray(rawList) || rawList.length === 0) return [];
    const valid = rawList.filter(isValidStream);
    const added = [];

    for (const raw of valid) {
      const formatted = formatStreamItem(raw, category, category === 'dubbed' ? 'VIP 1080p' : 'VIP Altyazılı');
      const urlKey = (formatted.streamUrl || formatted.url || formatted.getUrl() || '').trim().toLowerCase();

      if (category === 'dubbed') {
        if (!seenDubUrls.has(urlKey)) {
          seenDubUrls.add(urlKey);
          currentDubbed.push(formatted);
          added.push(formatted);
        }
      } else {
        if (!seenSubUrls.has(urlKey)) {
          seenSubUrls.add(urlKey);
          currentSubtitled.push(formatted);
          added.push(formatted);
        }
      }
    }

    if (added.length > 0) {
      onUpdate({
        dubbed: [...currentDubbed],
        subtitled: [...currentSubtitled],
        totalServers: currentDubbed.length + currentSubtitled.length,
        isComplete: false,
        newStream: added[0],
        isDubbedStream: category === 'dubbed'
      });
    }

    return added;
  };

  // Provider Scraper Tasks (NO HARD ABORT CUTOFF - allows full discovery)
  const tasks = [
    // FilmMakinesi (Dubbed & Subtitled)
    fetchFilmMakinesiSources({ type, titles: candidateTitles, title: targetTitle, originalTitle, year: targetYear, season, episode, tmdbId, isDub: true })
      .then(res => addStreams(res, 'dubbed')).catch(() => []),
    fetchFilmMakinesiSources({ type, titles: candidateTitles, title: targetTitle, originalTitle, year: targetYear, season, episode, tmdbId, isDub: false })
      .then(res => addStreams(res, 'subtitled')).catch(() => []),

    // Sinewix (Dubbed & Subtitled)
    fetchSinewixSources({ type, titles: candidateTitles, title: targetTitle, seriesTitle: targetTitle, originalTitle, year: targetYear, season, episode, isDub: true })
      .then(res => addStreams(res, 'dubbed')).catch(() => []),
    fetchSinewixSources({ type, titles: candidateTitles, title: targetTitle, seriesTitle: targetTitle, originalTitle, year: targetYear, season, episode, isDub: false })
      .then(res => addStreams(res, 'subtitled')).catch(() => []),

    // DiziBal (Dubbed & Subtitled)
    fetchDiziBalSources({ type, titles: candidateTitles, title: targetTitle, seriesTitle: targetTitle, originalTitle, year: targetYear, season, episode, isDub: true })
      .then(res => addStreams(res, 'dubbed')).catch(() => []),
    fetchDiziBalSources({ type, titles: candidateTitles, title: targetTitle, seriesTitle: targetTitle, originalTitle, year: targetYear, season, episode, isDub: false })
      .then(res => addStreams(res, 'subtitled')).catch(() => []),

    // SezonlukDizi (TV only)
    !isMovie ? fetchSezonlukDiziEpisodeSources({ titles: candidateTitles, season, episode, isDub: true })
      .then(res => addStreams(res, 'dubbed')).catch(() => []) : Promise.resolve([]),
    !isMovie ? fetchSezonlukDiziEpisodeSources({ titles: candidateTitles, season, episode, isDub: false })
      .then(res => addStreams(res, 'subtitled')).catch(() => []) : Promise.resolve([]),

    // Diziyou (TV only)
    !isMovie ? fetchDiziyouSources({ titles: candidateTitles, title: targetTitle, seriesTitle: targetTitle, originalTitle, season, episode, isDub: true })
      .then(res => addStreams(res, 'dubbed')).catch(() => []) : Promise.resolve([]),

    // HDFilmizle (Movie & TV Series)
    fetchHDFilmizleSources({ type, titles: candidateTitles, title: targetTitle, seriesTitle: targetTitle, originalTitle, year: targetYear, season, episode, isDub: true })
      .then(res => addStreams(res, 'dubbed')).catch(() => []),
    fetchHDFilmizleSources({ type, titles: candidateTitles, title: targetTitle, seriesTitle: targetTitle, originalTitle, year: targetYear, season, episode, isDub: false })
      .then(res => addStreams(res, 'subtitled')).catch(() => []),

    // HDFilmcehennemi (Movie & TV Series)
    fetchHDFilmcehennemiSources({ type, titles: candidateTitles, title: targetTitle, seriesTitle: targetTitle, originalTitle, year: targetYear, season, episode, isDub: true })
      .then(res => addStreams(res, 'dubbed')).catch(() => []),
    fetchHDFilmcehennemiSources({ type, titles: candidateTitles, title: targetTitle, seriesTitle: targetTitle, originalTitle, year: targetYear, season, episode, isDub: false })
      .then(res => addStreams(res, 'subtitled')).catch(() => []),

    // FilmEkseni (Movie only)
    isMovie ? fetchFilmEkseniSources({ type, titles: candidateTitles, title: targetTitle, originalTitle, year: targetYear, isDub: true })
      .then(res => addStreams(res, 'dubbed')).catch(() => []) : Promise.resolve([]),
    isMovie ? fetchFilmEkseniSources({ type, titles: candidateTitles, title: targetTitle, originalTitle, year: targetYear, isDub: false })
      .then(res => addStreams(res, 'subtitled')).catch(() => []) : Promise.resolve([]),

    // Dizipal (Dubbed)
    fetchDizipalSources({ type, titles: candidateTitles, title: targetTitle, seriesTitle: targetTitle, originalTitle, year: targetYear, season, episode, isDub: true })
      .then(res => addStreams(res, 'dubbed')).catch(() => []),

    // Filmizlech (Dubbed & Subtitled)
    fetchFilmizlechSources({ type, titles: candidateTitles, title: targetTitle, seriesTitle: targetTitle, originalTitle, year: targetYear, season, episode, isDub: true })
      .then(res => addStreams(res, 'dubbed')).catch(() => []),
    fetchFilmizlechSources({ type, titles: candidateTitles, title: targetTitle, seriesTitle: targetTitle, originalTitle, year: targetYear, season, episode, isDub: false })
      .then(res => addStreams(res, 'subtitled')).catch(() => []),

    // DiziMOM (Dubbed & Subtitled)
    fetchDizimomSources({ type, titles: candidateTitles, title: targetTitle, originalTitle, year: targetYear, season, episode, isDub: true })
      .then(res => addStreams(res, 'dubbed')).catch(() => []),
    fetchDizimomSources({ type, titles: candidateTitles, title: targetTitle, originalTitle, year: targetYear, season, episode, isDub: false })
      .then(res => addStreams(res, 'subtitled')).catch(() => []),

    // AnimeTR / TRAnime / TurkAnime / Belgesel
    fetchAnimeTrSources({ titles: candidateTitles, seriesTitle: targetTitle, title: targetTitle, originalTitle, season, episode, isDub: false })
      .then(res => addStreams(res, 'subtitled')).catch(() => []),
    fetchTrAnimeIzleSources({ titles: candidateTitles, seriesTitle: targetTitle, title: targetTitle, originalTitle, season, episode, isDub: false })
      .then(res => addStreams(res, 'subtitled')).catch(() => []),
    fetchTurkAnimeSources({ titles: candidateTitles, seriesTitle: targetTitle, title: targetTitle, originalTitle, season, episode, isDub: false })
      .then(res => addStreams(res, 'subtitled')).catch(() => []),
    fetchBelgeselSources({ titles: candidateTitles, seriesTitle: targetTitle, title: targetTitle, originalTitle, season, episode, isDub: true })
      .then(res => addStreams(res, 'dubbed')).catch(() => [])
  ];

  // Wait for all tasks to settle
  await Promise.allSettled(tasks);

  const finalResult = {
    dubbed: currentDubbed,
    subtitled: currentSubtitled,
    totalServers: currentDubbed.length + currentSubtitled.length
  };

  if (finalResult.totalServers > 0) {
    streamServersCache.set(cacheKey, finalResult);
  }

  onUpdate({
    ...finalResult,
    isComplete: true
  });

  return finalResult;
}

export async function getStreamingServers(params) {
  return new Promise(async (resolve) => {
    let resolved = false;
    await getStreamingServersProgressive({
      ...params,
      onUpdate: (data) => {
        if (data.isComplete && !resolved) {
          resolved = true;
          resolve(data);
        }
      }
    });
  });
}
