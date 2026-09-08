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

import { fetchSezonlukDiziEpisodeSources } from './sezonlukDiziScraper.js';
import { fetchSinewixSources } from './sinewixScraper.js';
import { fetchAnimecixSources } from './animecixScraper.js';
import { fetchTurkAnimeSources } from './turkanimeScraper.js';
import { fetchBelgeselSources } from './belgeselScraper.js';
import { fetchDmaxTlcSources } from './dmaxTlcScraper.js';
import { fetchDiziyouSources } from './diziyouScraper.js';
import { fetchFilmEkseniSources } from './filmekseniScraper.js';
import { fetchAyfilmSources } from './ayfilmScraper.js';
import { fetchAnimeTrSources } from './animeTrScraper.js';
import { fetchTrAnimeIzleSources } from './tranimeizleScraper.js';
import { fetchDramaDizilerimEpisodeSources } from './dramaDizilerimScraper.js';
import { fetchDizipalMovieSources, fetchDizipalEpisodeSources } from './dizipalScraper.js';
import { fetchDizisolMovieSources, fetchDizisolEpisodeSources } from './dizisolScraper.js';
import { fetchYabanciDiziMovieSources, fetchYabanciDiziEpisodeSources } from './yabancidiziScraper.js';
import { fetchDizibalMovieSources, fetchDizibalEpisodeSources } from './dizibalScraper.js';
import { fetchDiziyoMovieSources, fetchDiziyoEpisodeSources } from './diziyoScraper.js';
import { fetchDizirollEpisodeSources } from './dizirollScraper.js';
import { fetchHdfBestMovieSources } from './hdfilmizleBestScraper.js';
import { fetchGlobalAutonomousSources } from './globalStreamEngine.js';
import { resolveDirectStream } from './streamExtractors.js';

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

  return Array.from(expanded).filter(Boolean);
}

async function resolveCandidateTitles(type, tmdbId, targetTitle, originalTitle) {
  const immediateTitles = resolveCandidateTitlesSync(targetTitle, originalTitle);
  let detectedYear = null;

  if (tmdbId) {
    try {
      const enRes = await fetch(`https://api.themoviedb.org/3/${type}/${tmdbId}?api_key=${TMDB_API_KEY}&language=en-US`, { signal: AbortSignal.timeout(1500) }).catch(() => null);
      if (enRes && enRes.ok) {
        const enData = await enRes.json().catch(() => null);
        if (enData) {
          const enName = enData.name || enData.title;
          if (enName) immediateTitles.push(cleanTitle(enName));
          if (enData.original_name) immediateTitles.push(cleanTitle(enData.original_name));
          if (enData.original_title) immediateTitles.push(cleanTitle(enData.original_title));
          const dateStr = enData.release_date || enData.first_air_date;
          if (dateStr) detectedYear = dateStr.substring(0, 4);
        }
      }
    } catch (_) { }
  }

  return { candidateTitles: Array.from(new Set(immediateTitles)).filter(Boolean), detectedYear };
}

export function resolveEngineName(s, fallback = 'Fast Stream') {
  const url = (s.url || s.streamUrl || (typeof s.getUrl === 'function' ? s.getUrl() : '') || '').toLowerCase();
  const raw = (s.displayName || s.name || '').toLowerCase();
  const id = (s.id || '').toLowerCase();

  // 1. CinePulse Hybrid & Autonomous Streams (Strictly preserve names!)
  if (id.startsWith('cp_hybrid_') || raw.includes('hibrit')) {
    return s.displayName || s.name || '🎬🇹🇷 CinePulse Hibrit 1080p';
  }
  if (id.startsWith('cp_global_') || raw.includes('yts') || raw.includes('torrent')) {
    return s.displayName || s.name || '⚡ Torrent 1080p';
  }
  if (id.startsWith('dzp_') || (s.source && s.source.toLowerCase().includes('dizipal')) || raw.includes('dizipal')) {
    return s.displayName || s.name || 'Dizipal 1080p';
  }
  if (id.startsWith('dzs_') || (s.source && s.source.toLowerCase().includes('dizisol')) || raw.includes('dizisol')) {
    return s.displayName || s.name || 'Dizisol 1080p (HLS)';
  }
  if (id.startsWith('ybd_') || (s.source && s.source.toLowerCase().includes('yabancidizi')) || raw.includes('yabancidizi')) {
    if (url.includes('vidmoly')) return 'YabancıDizi VidMoly 1080p';
    if (url.includes('sibnet')) return 'YabancıDizi Sibnet HD';
    return s.displayName || s.name || 'YabancıDizi 1080p';
  }
  if (id.startsWith('dzb_') || (s.source && s.source.toLowerCase().includes('dizibal')) || raw.includes('dizibal')) {
    return s.displayName || s.name || 'DiziBal 1080p Alpha';
  }
  if (id.startsWith('dzy_') || (s.source && s.source.toLowerCase().includes('diziyo')) || raw.includes('diziyo')) {
    if (url.includes('vidmoly')) return 'Diziyo VidMoly 1080p';
    return s.displayName || s.name || 'Diziyo 1080p';
  }
  if (id.startsWith('dzr_') || (s.source && s.source.toLowerCase().includes('diziroll')) || raw.includes('diziroll')) {
    return s.displayName || s.name || 'Diziroll VIP';
  }
  if (id.startsWith('fex_') || (s.source && s.source.toLowerCase().includes('filmekseni')) || raw.includes('filmekseni') || raw.includes('eksenload')) {
    if (s.isDirectVideo || s.isHls) return 'FilmEkseni 1080p VIP';
    return s.displayName || s.name || 'FilmEkseni VIP';
  }
  if (id.startsWith('hdfb_') || (s.source && s.source.toLowerCase().includes('hdfilmizle')) || raw.includes('hdf ')) {
    return s.displayName || s.name || 'HDF 1080p';
  }

  // 2. High-Speed Direct Streams
  if (s.isDirectVideo || s.isHls) {
    if (id.startsWith('acx_') || raw.includes('animecix') || url.includes('tau-video')) return 'AX Tau Direct 1080p';
    if (id.startsWith('snx') || raw.includes('sinewix')) return 'SWX Direct 1080p';
    if (url.includes('storage.diziyou') || id.startsWith('dzy')) return 'HLS FastCDN';
  }

  if (url.includes('rapidrame') || url.includes('rapid') || raw.includes('rapid')) return 'Rapid FastStream 1080p';
  if (url.includes('closeload') || raw.includes('closeload')) return 'Closeload HD';
  if (id.startsWith('snx') || raw.includes('sinewix')) return 'SWX Direct 1080p';
  if (id.startsWith('szd_')) {
    if (url.includes('vidmoly') || raw.includes('vidmoly')) return 'SZ VidMoly 1080p';
    if (url.includes('sibnet') || raw.includes('sibnet')) return 'SZ Sibnet HD';
    if (url.includes('netu') || raw.includes('netu')) return 'SZ Netu HD';
  }
  if (id.startsWith('jet_') || (s.source && s.source.toLowerCase().includes('jet')) || raw.includes('jetfilm') || raw.includes('jet film') || raw.startsWith('jet ')) {
    if (url.includes('vidmoly') || raw.includes('vidmoly')) return 'Jet VidMoly 1080p';
    if (url.includes('ok.ru') || raw.includes('ok.ru')) return 'Jet OK.ru HD';
    if (url.includes('titan') || raw.includes('titan')) return 'Jet Titan VIP';
    if (raw.includes('dizi') || raw.includes('series') || raw.includes('s1')) return s.displayName || s.name || 'Jet Dizi VIP';
    return s.displayName || s.name || 'Jet VIP';
  }
  if (id.startsWith('ddz_') || (s.source && s.source.toLowerCase().includes('drama')) || raw.includes('dramadizilerim') || raw.includes('kısa dizi')) {
    return s.displayName || s.name || 'DramaDizilerim Kısa Dizi';
  }
  if (url.includes('vidmoly') || raw.includes('vidmoly')) return 'VidMoly 1080p';
  if (url.includes('sibnet') || raw.includes('sibnet')) return 'Sibnet HD';
  if (url.includes('eksenload') || url.includes('vidload') || raw.includes('eksen')) return 'EksenLoad VIP';
  if (url.includes('storage.diziyou') || id.startsWith('dzy')) return 'HLS FastCDN';
  if (id.startsWith('ayf_') || raw.includes('ayfilm')) return 'AyFilm VIP 1080p';
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
  if (id.startsWith('antr_') || raw.includes('animetr')) {
    if (url.includes('vidmoly')) return 'AnimeTR VidMoly 1080p';
    if (url.includes('sibnet')) return 'AnimeTR Sibnet HD';
    if (url.includes('ok.ru')) return 'AnimeTR OK.ru HD';
    return 'AnimeTR HD';
  }
  if (id.startsWith('tra_') || raw.includes('tranimeizle')) return 'TRAnimeİzle VIP';
  if (raw.includes('belgesel')) return 'Belgesel TR';

  let clean = (s.displayName || s.name || '')
    .replace(/sinewix|sezonlukdizi|filmekseni|diziyou|ayfilm|turkanime|animecix|vip\s*hat\s*\d*/gi, '')
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
    isHls: s.isHls || (s.streamUrl || s.url || '').includes('.m3u8'),
    isDirectVideo: s.isDirectVideo || false,
    isTorrent: Boolean(s.isTorrent || (s.id && (s.id.startsWith('cp_global_') || s.id.startsWith('yts_')))),
    magnetUrl: s.magnetUrl || null,
    infoHash: s.infoHash || null,
    seeds: s.seeds || null,
    peers: s.peers || null,
    quality: s.quality || null,
    isYts: Boolean(s.isYts),
    streamUrl: s.streamUrl || s.url,
    url: s.streamUrl || s.url,
    subtitles: s.subtitles || [],
    getUrl: () => s.streamUrl || s.url,
    // Dual-Audio hybrid fields (video from one source + dubbed audio from another)
    dubbedAudioUrl: s.dubbedAudioUrl || null,
    dubbedAudioName: s.dubbedAudioName || null,
    dubbedAudioIsHls: s.dubbedAudioIsHls || false,
    originalEmbedUrl: s.originalEmbedUrl || null
  };
}

function isValidStream(s) {
  const urlStr = (s.url || s.streamUrl || (typeof s.getUrl === 'function' ? s.getUrl() : '') || '').toLowerCase();
  if (!urlStr || urlStr.length < 10) return false;

  const id = (s.id || '').toLowerCase();
  // Always allow torrents, P2P, CinePulse autonomous sources, Dizipal direct streams and HLS proxy streams
  if (
    s.isTorrent ||
    id.startsWith('cp_global_') ||
    id.startsWith('yts_') ||
    id.startsWith('cp_hybrid_') ||
    id.startsWith('dzp_') ||
    id.startsWith('dzs_') ||
    id.startsWith('ybd_') ||
    id.startsWith('dzb_') ||
    id.startsWith('dzy_') ||
    id.startsWith('dzr_') ||
    id.startsWith('fex_') ||
    urlStr.startsWith('magnet:') ||
    urlStr.includes('localhost:4000') ||
    urlStr.includes('hls_proxy') ||
    urlStr.includes('vidsrc.to') ||
    urlStr.includes('vidsrc.xyz')
  ) {
    return true;
  }

  // Block dead, refusing, sandbox-blocked or malicious redirect domains
  const blockedDomains = [
    'recaptcha',
    'media.cm',
    'cloudvideo.tv',
    'vidoza.net',
    'voe.sx',
    'bysejikuar',
    'filemoon',
    'hdfilmdelisi',
    'vidrame',
    '2embed',
    'embed.su',
    'vidsrc.cc',
    'vidsrc.icu',
    'vidsrc.me',
    'autoembed.cc',
    'play.liderfilm',
    'liderfilm'
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

  // Deprioritize unplayable or dead .mkv streams
  if (url.includes('.mkv') || s.isMkv) return 16;

  // Priority 0: Dizisol, Dizipal, DiziBal, Diziyo & FilmEkseni VIP Direct 1080p HLS (Highest Reliability, Instant 0ms playback)
  if (id.startsWith('dzs_') || raw.includes('dizisol')) {
    return 0;
  }
  if (id.startsWith('dzp_') || raw.includes('dizipal')) {
    return 0;
  }
  if (id.startsWith('dzb_') || raw.includes('dizibal')) {
    return 0;
  }
  if (id.startsWith('dzy_') || raw.includes('diziyo')) {
    return 0;
  }
  if ((id.startsWith('fex_') || raw.includes('filmekseni')) && (s.isDirectVideo || s.isHls || url.includes('.m3u8'))) {
    return 0;
  }

  // Priority 1: YTS Direct 1080p (MP4)
  if (id.startsWith('cp_global_yts_') || raw.includes('yts direct')) {
    return 1;
  }

  // Priority 2: Torrentio 1080p / 4K
  if (id.startsWith('cp_global_torrent_') || raw.includes('torrent direct')) {
    return 2;
  }

  // Priority 3: High-Speed Direct Streams (HLS FastCDN, Tau, MP4)
  if ((s.isDirectVideo || s.isHls || url.includes('.m3u8') || url.includes('.mp4')) && !s.isMkv && !url.includes('.mkv')) {
    if (url.includes('storage.diziyou') || id.startsWith('dzy') || raw.includes('fastcdn')) return 3;
    if (id.startsWith('acx_') || raw.includes('animecix') || url.includes('tau-video')) return 3;
    return 4;
  }

  // Priority 4: Fast Clean Embeds
  if (id.startsWith('ybd_') || raw.includes('yabancidizi')) return 4;
  if (id.startsWith('dzr_') || raw.includes('diziroll')) return 4;
  if (id.startsWith('jet_') || (s.source && s.source.toLowerCase().includes('jet')) || raw.includes('jetfilm')) return 4;
  if (url.includes('sibnet') || raw.includes('sibnet')) return 4;
  if (url.includes('vidmoly') || raw.includes('vidmoly')) return 5;
  if (url.includes('eksenload') || raw.includes('eksenload') || id.startsWith('ayf_') || raw.includes('ayfilm') || url.includes('vidmoxy')) return 5;
  if (id.startsWith('acx_') || raw.includes('animecix')) return 6;
  if (url.includes('netu') || raw.includes('netu')) return 6;
  if (url.includes('rapidrame') || url.includes('closeload') || url.includes('filmmakinesi')) return 7;
  if (id.startsWith('szd_') || id.startsWith('szn_')) return 6;

  // TR Anime sources
  if (id.startsWith('ta_') || raw.includes('tr anime') || raw.includes('turkanime')) return 10;

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
  onUpdate = () => { }
}) {
  const isMovie = (type === 'movie');
  const targetTitle = cleanTitle(seriesTitle || title);
  const cacheKey = `${type}_${tmdbId || targetTitle}_s${season}_e${episode}`;

  const hydrateServers = (list) => {
    if (!Array.isArray(list)) return [];
    return list.map(s => {
      if (!s) return s;
      const u = s.streamUrl || s.url || s.originalEmbedUrl || '';
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
      const sess = sessionStorage.getItem(`cp_streams_${cacheKey}`);
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
    // Defer slightly to let UI finish mounting and avoid synchronous race conditions
    setTimeout(() => {
      onUpdate({ ...hydrated, isComplete: true });
    }, 50);
    return hydrated;
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
        // Absolutely forbid fake VidSrc embeds
        if (formatted.id && formatted.id.startsWith('cp_global_vidsrc')) {
          continue;
        }
        if (!seenDubUrls.has(urlKey)) {
          seenDubUrls.add(urlKey);
          currentDubbed.push(formatted);
          currentDubbed.sort((a, b) => getStreamPriorityScore(a) - getStreamPriorityScore(b));
          added.push(formatted);
        }
      } else {
        // Subtitled tab allows Torrent & YTS sources as well as subtitled releases from Dizipal, SezonlukDizi, Sinewix, etc.
        if (!seenSubUrls.has(urlKey)) {
          seenSubUrls.add(urlKey);
          currentSubtitled.push(formatted);
          currentSubtitled.sort((a, b) => getStreamPriorityScore(a) - getStreamPriorityScore(b));
          added.push(formatted);
        }
      }
    }

    // Progressive Subtitle Sharing across all direct streams on every update!
    const discoveredSubs = [...currentSubtitled, ...currentDubbed]
      .find(s => Array.isArray(s.subtitles) && s.subtitles.length > 0)?.subtitles;

    if (discoveredSubs && discoveredSubs.length > 0) {
      for (const s of currentSubtitled) {
        if (!Array.isArray(s.subtitles) || s.subtitles.length === 0) {
          s.subtitles = discoveredSubs;
        }
      }
      for (const s of currentDubbed) {
        if (!Array.isArray(s.subtitles) || s.subtitles.length === 0) {
          s.subtitles = discoveredSubs;
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

  // Provider Scraper Tasks: Subtitled STRICTLY from YTS / Torrents, Dubbed from high-speed Turkish platforms
  const isAnime = type === 'anime';
  const isDoc = type === 'documentary';

  const tasks = [
    // Subtitled Sources: ONLY YTS Official (en.yts-official.com) & genuine torrents with native YTS player
    fetchGlobalAutonomousSources({ type, tmdbId, title: targetTitle, originalTitle, year: targetYear, season, episode, isDub: false })
      .then(res => addStreams(res, 'subtitled')).catch(() => []),

    // Dubbed Sources: Autonomous DUAL Torrents & Turkish Fast-Path Streaming Providers
    fetchGlobalAutonomousSources({ type, tmdbId, title: targetTitle, originalTitle, year: targetYear, season, episode, isDub: true })
      .then(res => addStreams(res, 'dubbed')).catch(() => []),

    // 1. Dizipal (Movies & Series - Direct AlphaStream HLS 1080p)
    isMovie 
      ? fetchDizipalMovieSources({ titles: candidateTitles, title: targetTitle, originalTitle, isDub: true })
          .then(res => addStreams(res, 'dubbed')).catch(() => []) 
      : fetchDizipalEpisodeSources({ titles: candidateTitles, seriesTitle: targetTitle, originalTitle, season, episode, isDub: true })
          .then(res => addStreams(res, 'dubbed')).catch(() => []),

    // 2. Dizisol (Movies & Series - Native Express API HLS with Dual TR Audio & Subtitles)
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

    // 3. YabancıDizi (Movies & Series - Clean VidMoly & Sibnet embeds)
    isMovie
      ? fetchYabanciDiziMovieSources({ titles: candidateTitles, title: targetTitle, originalTitle, year: targetYear, isDub: true })
          .then(res => addStreams(res, 'dubbed')).catch(() => [])
      : fetchYabanciDiziEpisodeSources({ titles: candidateTitles, seriesTitle: targetTitle, originalTitle, season, episode, isDub: true })
          .then(res => addStreams(res, 'dubbed')).catch(() => []),

    isMovie
      ? fetchYabanciDiziMovieSources({ titles: candidateTitles, title: targetTitle, originalTitle, year: targetYear, isDub: false })
          .then(res => addStreams(res, 'subtitled')).catch(() => [])
      : fetchYabanciDiziEpisodeSources({ titles: candidateTitles, seriesTitle: targetTitle, originalTitle, season, episode, isDub: false })
          .then(res => addStreams(res, 'subtitled')).catch(() => []),

    // 4. DiziBal (Movies & Series - Direct AlphaStream HLS 1080p & Subtitles)
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

    // 5. Diziyo (Movies & Series - Direct VidMoly HLS 1080p)
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

    // 6. Diziroll (TV Series - VIP Player Embeds)
    (!isMovie && !isAnime)
      ? fetchDizirollEpisodeSources({ titles: candidateTitles, seriesTitle: targetTitle, originalTitle, season, episode, isDub: true })
          .then(res => addStreams(res, 'dubbed')).catch(() => [])
      : Promise.resolve([]),

    (!isMovie && !isAnime)
      ? fetchDizirollEpisodeSources({ titles: candidateTitles, seriesTitle: targetTitle, originalTitle, season, episode, isDub: false })
          .then(res => addStreams(res, 'subtitled')).catch(() => [])
      : Promise.resolve([]),

    // 4. Sinewix (Direct 1080p Dubbed)
    fetchSinewixSources({ type, titles: candidateTitles, title: targetTitle, seriesTitle: targetTitle, originalTitle, year: targetYear, season, episode, isDub: true })
      .then(res => addStreams(res, 'dubbed')).catch(() => []),

    // 3. SezonlukDizi (TV Series Dubbed)
    (!isMovie && !isAnime)
      ? fetchSezonlukDiziEpisodeSources({ titles: candidateTitles, seriesTitle: targetTitle, title: targetTitle, originalTitle, season, episode, isDub: true })
          .then(res => addStreams(res, 'dubbed')).catch(() => [])
      : Promise.resolve([]),

    // 7. FilmEkseni (Movies & Series - Dubbed & Subtitled)
    fetchFilmEkseniSources({ type, titles: candidateTitles, title: targetTitle, seriesTitle: targetTitle, originalTitle, year: targetYear, season, episode, isDub: true })
      .then(res => addStreams(res, 'dubbed')).catch(() => []),

    fetchFilmEkseniSources({ type, titles: candidateTitles, title: targetTitle, seriesTitle: targetTitle, originalTitle, year: targetYear, season, episode, isDub: false })
      .then(res => addStreams(res, 'subtitled')).catch(() => []),

    isMovie
      ? fetchAyfilmSources({ type, titles: candidateTitles, title: targetTitle, originalTitle, isDub: true })
          .then(res => addStreams(res, 'dubbed')).catch(() => [])
      : Promise.resolve([]),

    isMovie
      ? fetchHdfBestMovieSources({ titles: candidateTitles, title: targetTitle, originalTitle, isDub: true })
          .then(res => addStreams(res, 'dubbed')).catch(() => [])
      : Promise.resolve([]),

    // Anime Scrapers (ONLY if content is anime)
    isAnime
      ? fetchAnimecixSources({ titles: candidateTitles, seriesTitle: targetTitle, title: targetTitle, originalTitle, season, episode, isDub: true })
          .then(res => addStreams(res, 'dubbed')).catch(() => [])
      : Promise.resolve([]),
    isAnime
      ? fetchAnimecixSources({ titles: candidateTitles, seriesTitle: targetTitle, title: targetTitle, originalTitle, season, episode, isDub: false })
          .then(res => addStreams(res, 'subtitled')).catch(() => [])
      : Promise.resolve([]),

    isAnime
      ? fetchTurkAnimeSources({ titles: candidateTitles, seriesTitle: targetTitle, title: targetTitle, originalTitle, season, episode, isDub: true })
          .then(res => addStreams(res, 'dubbed')).catch(() => [])
      : Promise.resolve([]),
    isAnime
      ? fetchTurkAnimeSources({ titles: candidateTitles, seriesTitle: targetTitle, title: targetTitle, originalTitle, season, episode, isDub: false })
          .then(res => addStreams(res, 'subtitled')).catch(() => [])
      : Promise.resolve([]),

    isAnime
      ? fetchAnimeTrSources({ titles: candidateTitles, seriesTitle: targetTitle, title: targetTitle, originalTitle, season, episode, isDub: true })
          .then(res => addStreams(res, 'dubbed')).catch(() => [])
      : Promise.resolve([]),

    isAnime
      ? fetchTrAnimeIzleSources({ titles: candidateTitles, seriesTitle: targetTitle, title: targetTitle, originalTitle, season, episode, isDub: true })
          .then(res => addStreams(res, 'dubbed')).catch(() => [])
      : Promise.resolve([]),

    // Documentaries (ONLY if documentary)
    isDoc
      ? fetchBelgeselSources({ titles: candidateTitles, seriesTitle: targetTitle, title: targetTitle, originalTitle, season, episode, isDub: true })
          .then(res => addStreams(res, 'dubbed')).catch(() => [])
      : Promise.resolve([])
  ];

  // Race tasks against a 9.0-second cap so UI never hangs while giving all scrapers time to resolve
  await Promise.race([
    Promise.allSettled(tasks),
    new Promise(resolve => setTimeout(resolve, 9000))
  ]);

  // Share available Turkish subtitles (e.g. from Dizipal / OpenSubtitles) across subtitled sources
  const availableSubtitles = currentSubtitled.find(s => Array.isArray(s.subtitles) && s.subtitles.length > 0)?.subtitles || [];
  if (availableSubtitles.length > 0) {
    for (const s of currentSubtitled) {
      if (!Array.isArray(s.subtitles) || s.subtitles.length === 0) {
        s.subtitles = availableSubtitles;
      }
    }
  }

  // Ensure Dubbed tab contains STRICTLY genuine Turkish audio sources
  currentDubbed = currentDubbed.filter(s => {
    const id = (s.id || '').toLowerCase();
    const nm = (s.displayName || s.name || '').toLowerCase();
    const u = (s.streamUrl || s.url || '').toLowerCase();
    // Allow direct active DUAL/TR streams
    if (s.isDirectVideo && (nm.includes('dual') || nm.includes('dublaj'))) {
      return true;
    }
    return !id.startsWith('cp_global_vidsrc') && 
           !id.startsWith('cp_global_torrent') &&
           !id.startsWith('yts_off_') &&
           !id.startsWith('cp_hybrid_') &&
           !u.includes(':4000/torrent') &&
           !nm.includes('torrent') &&
           !nm.includes('hibrit') &&
           !nm.includes('yts');
  });

  // Sort Subtitled list to prominently place YTS Official & Torrents at the very front
  currentSubtitled.sort((a, b) => {
    const aIsYts = a.isYts || a.id.startsWith('yts_off_') || (a.name || '').includes('YTS');
    const bIsYts = b.isYts || b.id.startsWith('yts_off_') || (b.name || '').includes('YTS');
    if (aIsYts && !bIsYts) return -1;
    if (!aIsYts && bIsYts) return 1;
    const aIsTorrent = a.id.startsWith('cp_global_torrent') || (a.name || '').includes('Torrent');
    const bIsTorrent = b.id.startsWith('cp_global_torrent') || (b.name || '').includes('Torrent');
    if (aIsTorrent && !bIsTorrent) return -1;
    if (!aIsTorrent && bIsTorrent) return 1;
    return (a.priority ?? 0) - (b.priority ?? 0);
  });

  // De-duplicate any duplicate server display names across lists
  const dedupeServers = (list) => {
    const seenNames = new Set();
    const result = [];
    for (const s of list) {
      const key = (s.displayName || s.name || s.id).toLowerCase().trim();
      if (!seenNames.has(key)) {
        seenNames.add(key);
        result.push(s);
      }
    }
    return result;
  };

  const finalDubbed = dedupeServers(currentDubbed);
  const finalSubtitled = dedupeServers(currentSubtitled);

  const finalResult = {
    dubbed: finalDubbed,
    subtitled: finalSubtitled,
    totalServers: finalDubbed.length + finalSubtitled.length
  };

  if (finalResult.totalServers > 0) {
    streamServersCache.set(cacheKey, finalResult);
    try {
      sessionStorage.setItem(`cp_streams_${cacheKey}`, JSON.stringify(finalResult));
    } catch (_) {}
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
