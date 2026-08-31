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
import { fetchAnimecixSources } from './animecixScraper.js';
import { fetchTurkAnimeSources } from './turkanimeScraper.js';
import { fetchBelgeselSources } from './belgeselScraper.js';
import { fetchDmaxTlcSources } from './dmaxTlcScraper.js';
import { fetchDiziyouSources } from './diziyouScraper.js';
import { fetchFilmEkseniSources } from './filmekseniScraper.js';
import { fetchMultiEmbedSources } from './multiEmbedScraper.js';

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
  if (id.startsWith('dzp_') || raw.includes('dizipal')) return 'DP Stream 1080p';
  if (url.includes('ag2m4') || url.includes('agcdn') || raw.includes('alpha') || id.startsWith('dbl')) return 'Alpha Stream';
  if (url.includes('storage.diziyou') || id.startsWith('dzy')) return 'HLS FastCDN';
  if (url.includes('videasy') || id.startsWith('vds_') || raw.includes('videasy')) return 'Videasy Ultra 1080p';
  if (url.includes('smashy') || raw.includes('smashy')) return 'Smashy 1080p';
  if (url.includes('multiembed') || raw.includes('multiembed')) return 'MultiEmbed VIP';
  if (url.includes('vidlink') || raw.includes('vidlink')) return 'VidLink Pro';
  if (url.includes('vidbinge') || raw.includes('vidbinge')) return 'VidBinge Fast';
  if (raw.includes('channel') || url.includes('filmizlech')) return 'Channel Stream 1080p';
  if (id.startsWith('acx_') || raw.includes('animecix') || url.includes('tau-video')) {
    if (url.includes('tau-video') || raw.includes('tau')) return 'AX Tau 1080p';
    if (url.includes('sibnet') || raw.includes('sibnet')) return 'AX Sibnet HD';
    if (url.includes('vidmoly') || raw.includes('vidmoly')) return 'AX VidMoly 1080p';
    if (url.includes('dood') || raw.includes('dood')) return 'AX Doodstream';
    return 'AX VIP 1080p';
  }
  if (id.startsWith('ta_') || raw.includes('turkanime') || raw.includes('tr anime')) {
    if (url.includes('vidmoly')) return 'TR Anime (VidMoly 1080p)';
    if (url.includes('sibnet')) return 'TR Anime (Sibnet HD)';
    if (url.includes('dood')) return 'TR Anime (Doodstream)';
    return 'TR Anime HD (Ek Kaynak)';
  }
  if (raw.includes('tranime') || raw.includes('animetr')) return 'AnimeTR HD';
  if (raw.includes('belgesel')) return 'Belgesel TR';

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
  if (!urlStr || urlStr.length < 10) return false;

  // Block dead, refusing, sandbox-blocked or malicious redirect domains
  const blockedDomains = [
    'recaptcha',
    'media.cm',
    'cloudvideo.tv',
    'vidoza.net',
    'voe.sx',
    'bysejikuar',
    'filemoon',
    'liderfilm',
    'dizipal.bid',
    'hdfilmdelisi',
    'vidrame',
    '2embed',
    'embed.su',
    'vidsrc.cc',
    'vidsrc.icu',
    'vidsrc.me',
    'autoembed.cc'
  ];

  for (const b of blockedDomains) {
    if (urlStr.includes(b)) return false;
  }

  return true;
}

function getStreamPriorityScore(s) {
  const url = (s.url || s.streamUrl || (typeof s.getUrl === 'function' ? s.getUrl() : '') || '').toLowerCase();
  const raw = (s.displayName || s.name || '').toLowerCase();
  const id = (s.id || '').toLowerCase();

  // Priority 1: High-Speed Direct & Native Turkish / AnimeciX streams
  if (id.startsWith('acx_') || raw.includes('animecix') || url.includes('tau-video')) return 1;
  if (id.startsWith('snx') || raw.includes('direct') || url.includes('.mkv') || url.includes('.mp4') || url.includes('.webm')) return 2;
  if (url.includes('storage.diziyou') || id.startsWith('dzy') || raw.includes('fastcdn')) return 3;
  if (id.startsWith('dzp_') || raw.includes('dizipal')) return 4;
  if (url.includes('ag2m4') || url.includes('agcdn') || raw.includes('alpha') || id.startsWith('dbl')) return 4;
  if (url.includes('rapidrame') || url.includes('closeload') || url.includes('filmmakinesi')) return 5;
  if (url.includes('sibnet') || raw.includes('sibnet')) return 6;
  if (url.includes('vidmoly') || raw.includes('vidmoly')) return 7;
  if (id.startsWith('hdi_') || id.startsWith('flm_') || id.startsWith('szn_')) return 8;
  // TR Anime sources
  if (id.startsWith('ta_') || raw.includes('tr anime') || raw.includes('turkanime')) return 9;

  // Fallback Global Embeds (Working only)
  if (url.includes('smashy') || raw.includes('smashy')) return 20;
  if (url.includes('multiembed') || raw.includes('multiembed')) return 21;
  if (url.includes('vidlink') || raw.includes('vidlink')) return 22;
  if (url.includes('vidbinge') || raw.includes('vidbinge')) return 23;

  return 15;
}

/**
 * Progressive live streaming source aggregator.
 * Discovers Turkish & VIP sources with prioritized local ordering and fallback embeds.
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

  let currentDubbed = [];
  let currentSubtitled = [];
  const seenDubUrls = new Set();
  const seenSubUrls = new Set();

  const addStreams = (rawList, category) => {
    if (!Array.isArray(rawList) || rawList.length === 0) return [];
    const valid = rawList.filter(isValidStream);
    const added = [];

    for (const raw of valid) {
      const formatted = formatStreamItem(raw, category, category === 'dubbed' ? 'VIP 1080p' : 'VIP Altyazılı');
      const urlKey = (formatted.streamUrl || formatted.url || (typeof formatted.getUrl === 'function' ? formatted.getUrl() : '') || '').trim().toLowerCase();

      if (category === 'dubbed') {
        if (!seenDubUrls.has(urlKey)) {
          seenDubUrls.add(urlKey);
          currentDubbed.push(formatted);
          currentDubbed.sort((a, b) => getStreamPriorityScore(a) - getStreamPriorityScore(b));
          added.push(formatted);
        }
      } else {
        if (!seenSubUrls.has(urlKey)) {
          seenSubUrls.add(urlKey);
          currentSubtitled.push(formatted);
          currentSubtitled.sort((a, b) => getStreamPriorityScore(a) - getStreamPriorityScore(b));
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

    // FilmEkseni (Movie only)
    isMovie ? fetchFilmEkseniSources({ type, titles: candidateTitles, title: targetTitle, originalTitle, year: targetYear, isDub: true })
      .then(res => addStreams(res, 'dubbed')).catch(() => []) : Promise.resolve([]),
    isMovie ? fetchFilmEkseniSources({ type, titles: candidateTitles, title: targetTitle, originalTitle, year: targetYear, isDub: false })
      .then(res => addStreams(res, 'subtitled')).catch(() => []) : Promise.resolve([]),

    // Dizipal (Dubbed & Subtitled)
    fetchDizipalSources({ type, titles: candidateTitles, title: targetTitle, seriesTitle: targetTitle, originalTitle, year: targetYear, season, episode, isDub: true })
      .then(res => addStreams(res, 'dubbed')).catch(() => []),
    fetchDizipalSources({ type, titles: candidateTitles, title: targetTitle, seriesTitle: targetTitle, originalTitle, year: targetYear, season, episode, isDub: false })
      .then(res => addStreams(res, 'subtitled')).catch(() => []),

    // Universal MultiEmbed VIP (Subtitled & Multi-Language)
    fetchMultiEmbedSources({ type, tmdbId, season, episode, isDub: true })
      .then(res => addStreams(res, 'dubbed')).catch(() => []),
    fetchMultiEmbedSources({ type, tmdbId, season, episode, isDub: false })
      .then(res => addStreams(res, 'subtitled')).catch(() => []),

    // AX VIP (Fast Tau Video 1080p, Sibnet, VidMoly & Multi-Source Anime)
    fetchAnimecixSources({ titles: candidateTitles, seriesTitle: targetTitle, title: targetTitle, originalTitle, season, episode, isDub: true })
      .then(res => addStreams(res, 'dubbed')).catch(() => []),
    fetchAnimecixSources({ titles: candidateTitles, seriesTitle: targetTitle, title: targetTitle, originalTitle, season, episode, isDub: false })
      .then(res => addStreams(res, 'subtitled')).catch(() => []),

    // TR Anime (Backup / Alternative)
    fetchTurkAnimeSources({ titles: candidateTitles, seriesTitle: targetTitle, title: targetTitle, originalTitle, season, episode, isDub: true })
      .then(res => addStreams(res, 'dubbed')).catch(() => []),
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
