/* ==========================================================================
   CinePulse Studio - Master Stream Aggregator
   Fast, reliable Turkish & Global VIP streams:
   - Sinewix (Direct 1080p MKV/MP4 Stream)
   - RecTV VIP (Direct 1080p HLS Streams)
   - DiziBal / DP (AlphaStream 1080p HLS)
   - Dizisol / DS (Native HLS with Dual TR Audio)
   - Diziyo (1080p HLS)
   - Diziyou (FastCDN 1080p HLS)
   - HDFilmizle Best (1080p HLS)
   - SezonlukDizi (1080p VIP)
   - Kids VIP / CizgiMax (Direct 1080p Sibnet for Cartoons & Animation)
   - AnimeciX / TürkAnime / AnimeTR (1080p Anime & Western Cartoons)
   - LookMovie VIP / 2Embed VIP / VidSrc VIP (Clean, low-ad 1080p embeds)
   ========================================================================== */

import { fetchSezonlukDiziEpisodeSources } from './sezonlukDiziScraper.js';
import { fetchSinewixSources } from './sinewixScraper.js';
import { fetchAnimecixSources } from './animecixScraper.js';
import { fetchTurkAnimeSources } from './turkanimeScraper.js';
import { fetchAnimeTrSources } from './animeTrScraper.js';
import { fetchDizisolMovieSources, fetchDizisolEpisodeSources } from './dizisolScraper.js';
import { fetchDizibalMovieSources, fetchDizibalEpisodeSources } from './dizibalScraper.js';
import { fetchDiziyoMovieSources, fetchDiziyoEpisodeSources } from './diziyoScraper.js';
import { fetchDiziyouSources } from './diziyouScraper.js';
import { fetchHdfBestMovieSources } from './hdfilmizleBestScraper.js';
import { fetchRecTvSources } from './rectvService.js';
import { fetchKidsVipSources, fetchKidsVipMovieSources } from './kidsVipScraper.js';
import { fetchSmashyStreamSources } from './smashyStreamService.js';
import { fetchTorrentStreamSources } from './torrentStreamService.js';
import { fetchOfficialLookMovieSources } from './lookmovieScraper.js';

// Cache version
const CACHE_VERSION = 'v22';
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

function resolveCandidateTitlesSync(targetTitle, originalTitle) {
  const titles = new Set();
  if (targetTitle) {
    titles.add(targetTitle);
    titles.add(cleanTitle(targetTitle));
  }
  if (originalTitle) {
    titles.add(originalTitle);
    titles.add(cleanTitle(originalTitle));
  }

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
      .replace(/\bpart\s+iii\b/i, 'Part 3');
    expanded.add(withNums);

    const noNums = t
      .replace(/\bPart\s+\d+\b/gi, '')
      .replace(/\bBölüm\s+\d+\b/gi, '')
      .replace(/\b(II|III|IV|V|VI)\b/g, '')
      .trim();
    if (noNums && noNums.length > 2) expanded.add(noNums);
  }

  return Array.from(expanded).filter(Boolean);
}

async function resolveCandidateTitles(type, tmdbId, targetTitle, originalTitle) {
  const immediateTitles = resolveCandidateTitlesSync(targetTitle, originalTitle);
  let detectedYear = null;
  let isAnimation = false;

  if (!tmdbId) {
    return { candidateTitles: immediateTitles, detectedYear, isAnimation };
  }

  try {
    const endpoint = type === 'movie' ? 'movie' : 'tv';
    const res = await fetch(`https://api.themoviedb.org/3/${endpoint}/${tmdbId}?api_key=${TMDB_API_KEY}&language=tr-TR`, {
      signal: AbortSignal.timeout(3500)
    });
    if (res.ok) {
      const data = await res.json();
      const trTitle = data.title || data.name;
      const origTitle = data.original_title || data.original_name;
      const releaseDate = data.release_date || data.first_air_date;
      if (releaseDate) {
        detectedYear = new Date(releaseDate).getFullYear();
      }
      if (Array.isArray(data.genres) && data.genres.some(g => g.id === 16 || (g.name || '').toLowerCase().includes('animasyon'))) {
        isAnimation = true;
      }
      if (trTitle) immediateTitles.push(trTitle, cleanTitle(trTitle));
      if (origTitle) immediateTitles.push(origTitle, cleanTitle(origTitle));
    }
  } catch (_) {}

  const deduped = Array.from(new Set(immediateTitles.map(t => (t || '').trim()).filter(Boolean)));
  return { candidateTitles: deduped, detectedYear, isAnimation };
}

function formatStreamName(s) {
  const url = (s.url || s.streamUrl || (typeof s.getUrl === 'function' ? s.getUrl() : '') || '').toLowerCase();
  const raw = (s.displayName || s.name || '').toLowerCase();
  const id = (s.id || '').toLowerCase();

  if (id.startsWith('lookmovie_') || raw.includes('lookmovie')) {
    return s.displayName || s.name || '🎬 LookMovie VIP 1080p';
  }
  if (id.startsWith('twoembed_') || raw.includes('2embed')) {
    return s.displayName || s.name || '⚡ 2Embed VIP 1080p';
  }
  if (id.startsWith('vidsrc_pm') || raw.includes('vidsrc alt')) {
    return s.displayName || s.name || '⚡ VidSrc Alt 1080p';
  }
  if (id.startsWith('vidsrc_') || raw.includes('vidsrc')) {
    return s.displayName || s.name || '🎬 VidSrc VIP 1080p';
  }
  if (id.startsWith('dzb_') || id.startsWith('dzp_') || raw.includes('dizibal') || raw.includes('dizipal')) {
    let base = (s.displayName || s.name || 'DP 1080p').replace(/dizibal/gi, 'DP').replace(/dizipal/gi, 'DP').trim();
    if (!base.startsWith('DP')) base = `DP ${base}`;
    return base;
  }
  if (id.startsWith('dzs_') || raw.includes('dizisol')) {
    let base = (s.displayName || s.name || 'DS 1080p (HLS)').replace(/dizisol/gi, 'DS').trim();
    if (!base.startsWith('DS')) base = `DS ${base}`;
    return base;
  }
  if (id.startsWith('dzy_') || raw.includes('diziyo')) {
    if (url.includes('vidmoly')) return 'Diziyo VidMoly 1080p';
    return s.displayName || s.name || 'Diziyo 1080p';
  }
  if (id.startsWith('dyu_') || raw.includes('diziyou')) {
    return s.displayName || s.name || 'Diziyou 1080p';
  }
  if (id.startsWith('hdfb_') || raw.includes('hdfilmizle')) {
    return s.displayName || s.name || 'HDF 1080p';
  }
  if (id.startsWith('tvr_') || id.startsWith('rectv_') || raw.includes('rectv') || raw.includes('tvr')) {
    return s.displayName || s.name || '⚡ TVR VIP 1080p';
  }
  if (id.startsWith('kvip_') || raw.includes('kids vip')) {
    return s.displayName || s.name || '⚡ Kids VIP Direct 1080p';
  }
  if (id.startsWith('acx_') || raw.includes('animecix')) {
    return s.displayName || s.name || 'AX Tau Direct 1080p';
  }
  if (id.startsWith('snx') || raw.includes('sinewix')) {
    return s.displayName || s.name || 'SWX Direct 1080p';
  }
  if (id.startsWith('szd_')) {
    if (url.includes('vidmoly')) return 'SZ VidMoly 1080p';
    if (url.includes('sibnet')) return 'SZ Sibnet HD';
    return s.displayName || s.name || 'SZ 1080p';
  }

  return s.displayName || s.name || 'VIP 1080p';
}

function formatStreamItem(s, category, fallbackName) {
  const streamUrl = s.streamUrl || s.url || (typeof s.getUrl === 'function' ? s.getUrl() : '') || '';
  const finalDisplayName = formatStreamName(s) || fallbackName;

  let badge = s.badge || (category === 'dubbed' ? '⚡ TR Dublaj' : '💬 TR Altyazı');
  const lowerName = finalDisplayName.toLowerCase();
  if (lowerName.includes('lookmovie')) badge = '🎬 LookMovie 1080p';
  else if (lowerName.includes('2embed')) badge = '⚡ 2Embed 1080p';
  else if (lowerName.includes('vidsrc')) badge = '🎬 VidSrc 1080p';
  else if (lowerName.includes('dp')) badge = category === 'dubbed' ? '⚡ DP Dublaj' : '💬 DP Altyazı';
  else if (lowerName.includes('ds')) badge = category === 'dubbed' ? '⚡ DS Dublaj' : '💬 DS Altyazı';
  else if (lowerName.includes('swx')) badge = '⚡ SWX 1080p';
  else if (lowerName.includes('tvr')) badge = '⚡ TVR 1080p';

  return {
    ...s,
    id: s.id || `stream_${Math.random().toString(36).slice(2, 9)}`,
    name: finalDisplayName,
    displayName: finalDisplayName,
    streamUrl,
    url: streamUrl,
    badge,
    category,
    isHls: Boolean(s.isHls || streamUrl.includes('.m3u8') || streamUrl.includes('/hls_proxy')),
    isDirectVideo: Boolean(s.isDirectVideo || s.isHls || streamUrl.includes('.m3u8') || streamUrl.includes('.mp4') || streamUrl.includes('.mkv')),
    getUrl: () => streamUrl
  };
}

function isValidStream(s) {
  const urlStr = (s.url || s.streamUrl || (typeof s.getUrl === 'function' ? s.getUrl() : '') || '').toLowerCase();
  if (!urlStr || urlStr.length < 8) return false;

  const id = (s.id || '').toLowerCase();
  const raw = (s.displayName || s.name || '').toLowerCase();

  // Allow clean torrent_p2p_ streams from torrentStreamService
  if (id.startsWith('torrent_p2p_')) {
    return true;
  }

  // Purge any raw legacy torrent or YTS headers per user request
  if (s.isTorrent && !id.startsWith('torrent_p2p_')) {
    return false;
  }
  if (id.includes('yts') || raw.includes('yts') || urlStr.includes('yts.mx')) {
    return false;
  }

  // Strictly block broken / anti-adblock domains
  if (urlStr.includes('pichive') || urlStr.includes('hotlinger') || (urlStr.includes('diziyo.so') && !urlStr.includes('.m3u8'))) {
    return false;
  }

  const blocked = [
    'recaptcha',
    'media.cm',
    'cloudvideo.tv',
    'vidoza.net',
    'voe.sx',
    'bysejikuar',
    'filemoon',
    'hdfilmdelisi',
    'play.liderfilm'
  ];
  for (const b of blocked) {
    if (urlStr.includes(b)) return false;
  }

  return true;
}

function getStreamPriorityScore(s) {
  const url = (s.url || s.streamUrl || (typeof s.getUrl === 'function' ? s.getUrl() : '') || '').toLowerCase();
  const raw = (s.displayName || s.name || '').toLowerCase();
  const id = (s.id || '').toLowerCase();

  // Priority 0: TVR, DP (DiziBal), DS (Dizisol), Sinewix (Ultra-reliable 1080p)
  if (id.startsWith('tvr_') || raw.includes('tvr') || raw.includes('rectv')) return 0;
  if (id.startsWith('dzb_') || id.startsWith('dzp_') || raw.includes('dp 1080p') || raw.includes('dizibal')) return 0;
  if (id.startsWith('dzs_') || raw.includes('dizisol') || raw.includes('ds 1080p')) return 0;
  if (id.startsWith('snx') || raw.includes('sinewix') || raw.includes('swx')) return 0;

  // Priority 1: High quality secondary platforms & High-Seed VIP P2P Streams
  if (id.startsWith('torrent_p2p_')) return 1;
  if (id.startsWith('dzy_') || raw.includes('diziyo')) return 1;
  if (id.startsWith('dyu_') || raw.includes('diziyou')) return 1;
  if (id.startsWith('szd_') || raw.includes('sezonluk')) return 1;
  if (id.startsWith('hdfb_') || raw.includes('hdfilmizle')) return 1;

  // Priority 2: LookMovie VIP, 2Embed VIP, VidSrc VIP
  if (id.startsWith('lookmovie_') || raw.includes('lookmovie')) return 2;
  if (id.startsWith('twoembed_') || raw.includes('2embed')) return 2;
  if (id.startsWith('vidsrc_') || raw.includes('vidsrc')) return 2;

  // Priority 3: Anime & Cartoons
  if (id.startsWith('kvip_') || raw.includes('kids vip')) return 3;
  if (id.startsWith('acx_') || raw.includes('animecix')) return 3;
  if (id.startsWith('ta_') || raw.includes('turkanime')) return 3;
  if (id.startsWith('atr_') || raw.includes('animetr')) return 3;

  return 5;
}

/**
 * Progressive live streaming source aggregator.
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

  const hydrateServers = (list) => {
    if (!Array.isArray(list)) return [];
    return list.map(s => {
      if (!s) return s;
      const u = s.streamUrl || s.url || '';
      return {
        ...s,
        streamUrl: u,
        url: u,
        getUrl: () => u
      };
    });
  };

  if (!streamServersCache.has(cacheKey)) {
    try {
      const sess = sessionStorage.getItem(`cp_streams_${CACHE_VERSION}_${cacheKey}`);
      if (sess) {
        const parsed = JSON.parse(sess);
        if (parsed && (parsed.dubbed?.length || parsed.subtitled?.length)) {
          const hydrated = {
            ...parsed,
            dubbed: hydrateServers(parsed.dubbed),
            subtitled: hydrateServers(parsed.subtitled)
          };
          streamServersCache.set(cacheKey, hydrated);
        }
      }
    } catch (_) {}
  }

  if (streamServersCache.has(cacheKey)) {
    const cached = streamServersCache.get(cacheKey);
    const hydrated = {
      ...cached,
      dubbed: hydrateServers(cached.dubbed),
      subtitled: hydrateServers(cached.subtitled)
    };
    onUpdate({ ...hydrated, isComplete: true });
    return hydrated;
  }

  let candidateTitles = resolveCandidateTitlesSync(targetTitle, originalTitle);
  let targetYear = year;

  const enrichmentTask = tmdbId
    ? resolveCandidateTitles(type, tmdbId, targetTitle, originalTitle).catch(() => null)
    : Promise.resolve(null);

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
      const urlStr = (formatted.streamUrl || formatted.url || '').trim().toLowerCase();
      const id = (formatted.id || '').toLowerCase();
      const providerPrefix = id.split('_').slice(0, 2).join('_');
      const urlKey = `${providerPrefix}||${urlStr}`;

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

    // Subtitle sharing
    const discoveredSubs = [...currentSubtitled, ...currentDubbed]
      .find(s => Array.isArray(s.subtitles) && s.subtitles.length > 0)?.subtitles;

    if (discoveredSubs && discoveredSubs.length > 0) {
      for (const s of currentSubtitled) {
        if (!Array.isArray(s.subtitles) || s.subtitles.length === 0) s.subtitles = discoveredSubs;
      }
      for (const s of currentDubbed) {
        if (!Array.isArray(s.subtitles) || s.subtitles.length === 0) s.subtitles = discoveredSubs;
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

  const isAnime = type === 'anime';

  const tasks = [
    // 1. RecTV VIP (1080p VIP direct streams)
    fetchRecTvSources({ type, title: targetTitle, originalTitle, season, episode, year: targetYear })
      .then(res => {
        if (!Array.isArray(res) || res.length === 0) return [];
        const dubs = res.filter(s => (s.name || '').toLowerCase().includes('dublaj'));
        const subs = res.filter(s => !(s.name || '').toLowerCase().includes('dublaj'));
        if (dubs.length > 0) addStreams(dubs, 'dubbed');
        if (subs.length > 0) addStreams(subs, 'subtitled');
        if (dubs.length === 0 && subs.length === 0) {
          addStreams(res, 'dubbed');
          addStreams(res, 'subtitled');
        }
      }).catch(() => []),

    // 2. Sinewix VIP (Direct 1080p MKV Dubbed)
    fetchSinewixSources({ type, titles: candidateTitles, title: targetTitle, seriesTitle: targetTitle, originalTitle, year: targetYear, season, episode, isDub: true })
      .then(res => addStreams(res, 'dubbed')).catch(() => []),

    // 3. DiziBal (DP 1080p AlphaStream direct HLS)
    isMovie
      ? fetchDizibalMovieSources({ titles: candidateTitles, title: targetTitle, originalTitle, isDub: true })
          .then(res => addStreams(res, 'dubbed')).catch(() => [])
      : fetchDizibalEpisodeSources({ titles: candidateTitles, seriesTitle: targetTitle, originalTitle, season, episode, isDub: true })
          .then(res => addStreams(res, 'dubbed')).catch(() => []),

    isMovie
      ? fetchDizibalMovieSources({ titles: candidateTitles, title: targetTitle, originalTitle, isDub: false })
          .then(res => addStreams(res, 'subtitled')).catch(() => [])
      : fetchDizibalEpisodeSources({ titles: candidateTitles, seriesTitle: targetTitle, originalTitle, season, episode, isDub: false })
          .then(res => addStreams(res, 'subtitled')).catch(() => []),

    // 4. Dizisol (DS 1080p HLS)
    isMovie
      ? fetchDizisolMovieSources({ titles: candidateTitles, tmdbId, title: targetTitle, originalTitle, year: targetYear, isDub: true })
          .then(res => addStreams(res, 'dubbed')).catch(() => [])
      : fetchDizisolEpisodeSources({ titles: candidateTitles, tmdbId, seriesTitle: targetTitle, originalTitle, season, episode, isDub: true })
          .then(res => addStreams(res, 'dubbed')).catch(() => []),

    isMovie
      ? fetchDizisolMovieSources({ titles: candidateTitles, tmdbId, title: targetTitle, originalTitle, year: targetYear, isDub: false })
          .then(res => addStreams(res, 'subtitled')).catch(() => [])
      : fetchDizisolEpisodeSources({ titles: candidateTitles, tmdbId, seriesTitle: targetTitle, originalTitle, season, episode, isDub: false })
          .then(res => addStreams(res, 'subtitled')).catch(() => []),

    // 5. Diziyo (Direct 1080p HLS)
    isMovie
      ? fetchDiziyoMovieSources({ titles: candidateTitles, title: targetTitle, originalTitle, isDub: true })
          .then(res => addStreams(res, 'dubbed')).catch(() => [])
      : fetchDiziyoEpisodeSources({ titles: candidateTitles, seriesTitle: targetTitle, originalTitle, season, episode, isDub: true })
          .then(res => addStreams(res, 'dubbed')).catch(() => []),

    isMovie
      ? fetchDiziyoMovieSources({ titles: candidateTitles, title: targetTitle, originalTitle, isDub: false })
          .then(res => addStreams(res, 'subtitled')).catch(() => [])
      : fetchDiziyoEpisodeSources({ titles: candidateTitles, seriesTitle: targetTitle, originalTitle, season, episode, isDub: false })
          .then(res => addStreams(res, 'subtitled')).catch(() => []),

    // 6. Diziyou (FastCDN 1080p HLS)
    (!isMovie && !isAnime)
      ? fetchDiziyouSources({ titles: candidateTitles, seriesTitle: targetTitle, title: targetTitle, originalTitle, season, episode, isDub: false })
          .then(res => {
            if (Array.isArray(res) && res.length > 0) {
              addStreams(res, 'subtitled');
              addStreams(res, 'dubbed');
            }
          }).catch(() => [])
      : Promise.resolve([]),

    // 7. SezonlukDizi (1080p VIP)
    !isMovie
      ? fetchSezonlukDiziEpisodeSources({ titles: candidateTitles, seriesTitle: targetTitle, title: targetTitle, originalTitle, season, episode, isDub: true })
          .then(res => addStreams(res, 'dubbed')).catch(() => [])
      : Promise.resolve([]),

    !isMovie
      ? fetchSezonlukDiziEpisodeSources({ titles: candidateTitles, seriesTitle: targetTitle, title: targetTitle, originalTitle, season, episode, isDub: false })
          .then(res => addStreams(res, 'subtitled')).catch(() => [])
      : Promise.resolve([]),

    // 8. HDFilmizle Best (Movies)
    isMovie
      ? fetchHdfBestMovieSources({ titles: candidateTitles, title: targetTitle, originalTitle, isDub: true })
          .then(res => addStreams(res, 'dubbed')).catch(() => [])
      : Promise.resolve([]),

    // 9. Kids VIP (Cartoons & Animations - Only for Animation / Anime genre)
    isAnime
      ? fetchKidsVipSources({ titles: candidateTitles, seriesTitle: targetTitle, title: targetTitle, originalTitle, season, episode, isDub: true })
          .then(res => addStreams(res, 'dubbed')).catch(() => [])
      : enrichmentTask.then(enr => {
          if (enr?.isAnimation) {
            return fetchKidsVipSources({ titles: enr.candidateTitles || candidateTitles, seriesTitle: targetTitle, title: targetTitle, originalTitle, season, episode, isDub: true })
              .then(res => addStreams(res, 'dubbed')).catch(() => []);
          }
          return [];
        }).catch(() => []),

    isAnime
      ? fetchKidsVipSources({ titles: candidateTitles, seriesTitle: targetTitle, title: targetTitle, originalTitle, season, episode, isDub: false })
          .then(res => addStreams(res, 'subtitled')).catch(() => [])
      : enrichmentTask.then(enr => {
          if (enr?.isAnimation) {
            return fetchKidsVipSources({ titles: enr.candidateTitles || candidateTitles, seriesTitle: targetTitle, title: targetTitle, originalTitle, season, episode, isDub: false })
              .then(res => addStreams(res, 'subtitled')).catch(() => []);
          }
          return [];
        }).catch(() => []),

    isMovie
      ? enrichmentTask.then(enr => {
          if (enr?.isAnimation) {
            return fetchKidsVipMovieSources({ titles: enr.candidateTitles || candidateTitles, title: targetTitle, originalTitle, isDub: true })
              .then(res => addStreams(res, 'dubbed')).catch(() => []);
          }
          return [];
        }).catch(() => [])
      : Promise.resolve([]),

    // 10. Clean Global VIP Embeds: VidSrc, SmashyStream, 2Embed, SuperEmbed, EmbedSu
    Promise.resolve(fetchSmashyStreamSources({ type, tmdbId, season, episode }))
      .then(res => addStreams(res, 'subtitled')).catch(() => []),

    // 10b. Official LookMovie2.la VIP Player
    fetchOfficialLookMovieSources({ type, title: targetTitle, originalTitle, season, episode })
      .then(res => addStreams(res, 'subtitled')).catch(() => []),

    // 11. Anime & Cartoons: AnimeciX, TürkAnime, AnimeTR
    isAnime
      ? fetchAnimecixSources({ titles: candidateTitles, seriesTitle: targetTitle, title: targetTitle, originalTitle, season, episode, isDub: true })
          .then(res => addStreams(res, 'dubbed')).catch(() => [])
      : enrichmentTask.then(enr => {
          if (enr?.isAnimation) {
            return fetchAnimecixSources({ titles: enr.candidateTitles || candidateTitles, seriesTitle: targetTitle, title: targetTitle, originalTitle, season, episode, isDub: true })
              .then(res => addStreams(res, 'dubbed')).catch(() => []);
          }
          return [];
        }).catch(() => []),

    isAnime
      ? fetchAnimecixSources({ titles: candidateTitles, seriesTitle: targetTitle, title: targetTitle, originalTitle, season, episode, isDub: false })
          .then(res => addStreams(res, 'subtitled')).catch(() => [])
      : enrichmentTask.then(enr => {
          if (enr?.isAnimation) {
            return fetchAnimecixSources({ titles: enr.candidateTitles || candidateTitles, seriesTitle: targetTitle, title: targetTitle, originalTitle, season, episode, isDub: false })
              .then(res => addStreams(res, 'subtitled')).catch(() => []);
          }
          return [];
        }).catch(() => []),

    isAnime
      ? fetchTurkAnimeSources({ titles: candidateTitles, seriesTitle: targetTitle, title: targetTitle, originalTitle, season, episode, isDub: true })
          .then(res => addStreams(res, 'dubbed')).catch(() => [])
      : Promise.resolve([]),

    isAnime
      ? fetchAnimeTrSources({ titles: candidateTitles, seriesTitle: targetTitle, title: targetTitle, originalTitle, season, episode, isDub: true })
          .then(res => addStreams(res, 'dubbed')).catch(() => []):

    // 12. VIP P2P Streams (2-3 high-seed torrent streams with multi-sub / OpenSubtitles)
    fetchTorrentStreamSources({ type, tmdbId, season, episode })
      .then(res => {
        if (Array.isArray(res) && res.length > 0) {
          addStreams(res, 'subtitled');
        }
      }).catch(() => [])
  ];

  // Alias expansion task
  const aliasTask = enrichmentTask.then(enriched => {
    if (!enriched?.candidateTitles?.length) return [];
    const extraTitles = enriched.candidateTitles.filter(t => !candidateTitles.includes(t));
    if (!extraTitles.length) return [];
    candidateTitles = enriched.candidateTitles;
    if (!targetYear && enriched.detectedYear) targetYear = enriched.detectedYear;

    const aliasSearches = [
      fetchSinewixSources({ type, titles: extraTitles, title: targetTitle, seriesTitle: targetTitle, originalTitle, year: targetYear, season, episode, isDub: true })
        .then(res => addStreams(res, 'dubbed')),
      isMovie
        ? fetchDizibalMovieSources({ titles: extraTitles, title: targetTitle, originalTitle, isDub: true }).then(res => addStreams(res, 'dubbed'))
        : fetchDizibalEpisodeSources({ titles: extraTitles, seriesTitle: targetTitle, originalTitle, season, episode, isDub: true }).then(res => addStreams(res, 'dubbed'))
    ];
    return Promise.allSettled(aliasSearches);
  });

  await Promise.allSettled([...tasks, aliasTask]);

  // Ensure ALL dubbed and subtitled streams have OpenSubtitles fallback support
  const defaultSubUrl = isMovie
    ? `/api/subtitles?imdbId=${tmdbId}&type=movie`
    : `/api/subtitles?imdbId=${tmdbId}&season=${season}&episode=${episode}&type=tv`;

  for (const s of currentDubbed) {
    if (!Array.isArray(s.subtitles) || s.subtitles.length === 0) {
      s.subtitles = [{ label: 'OpenSubtitles (Türkçe)', src: defaultSubUrl }];
    } else if (!s.subtitles.some(x => (x.label || '').includes('Türkçe') || x.src?.includes('/api/subtitles'))) {
      s.subtitles.push({ label: 'OpenSubtitles (Türkçe)', src: defaultSubUrl });
    }
  }

  for (const s of currentSubtitled) {
    if (!Array.isArray(s.subtitles) || s.subtitles.length === 0) {
      s.subtitles = [{ label: 'OpenSubtitles (Türkçe)', src: defaultSubUrl }];
    }
  }

  // Clean deduplication
  const dedupeServers = (list) => {
    const seenKeys = new Set();
    const result = [];
    for (const s of list) {
      const idPrefix = (s.id || '').toLowerCase().split('_').slice(0, 2).join('_');
      const nameKey = (s.displayName || s.name || s.id).toLowerCase().trim();
      const key = `${idPrefix}||${nameKey}`;
      if (!seenKeys.has(key)) {
        seenKeys.add(key);
        result.push(s);
      }
    }
    return result;
  };

  const finalDubbed = dedupeServers(currentDubbed);
  const finalSubtitled = dedupeServers(currentSubtitled);

  const payload = {
    dubbed: finalDubbed,
    subtitled: finalSubtitled,
    totalServers: finalDubbed.length + finalSubtitled.length,
    isComplete: true
  };

  if (payload.totalServers > 0) {
    streamServersCache.set(cacheKey, payload);
    try {
      sessionStorage.setItem(`cp_streams_${CACHE_VERSION}_${cacheKey}`, JSON.stringify(payload));
    } catch (_) {}
  }

  onUpdate(payload);
  return payload;
}

export const getStreamingServers = getStreamingServersProgressive;
