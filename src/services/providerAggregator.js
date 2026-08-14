/* ==========================================================================
   CinePulse Studio - Master Stream Aggregator
   Aggregates live Turkish sources with strict title & year matching:
   - Smashy Stream (1080p Video Embed)
   - DiziBal (VIP 1080p)
   - Sinewix (Android VIP 1080p)
   - Dizipal (1080p)
   - SezonlukDizi (VidMoly, Sibnet, Filemoon)
   - Now Stream / Filmizle (1080p Dublaj & Altyazılı)
   - AnimeTR (VidMoly, OK.ru, Vidoza, VOE, Drive 1080p)
   - TRAnimeİzle (1080p)
   - TürkAnime TV (1080p)
   - BelgeselX / Belgeselce (1080p)
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
    fetchDiziBalSources({ titles: candidateTitles, type, title: targetTitle, seriesTitle: targetTitle, originalTitle, year: targetYear, season, episode, isDub: true }).catch(() => []),
    fetchDiziBalSources({ titles: candidateTitles, type, title: targetTitle, seriesTitle: targetTitle, originalTitle, year: targetYear, season, episode, isDub: false }).catch(() => []),
    !isMovie ? fetchSezonlukDiziEpisodeSources({ titles: candidateTitles, seriesTitle: targetTitle, originalTitle, season, episode, isDub: true }).catch(() => []) : Promise.resolve([]),
    !isMovie ? fetchSezonlukDiziEpisodeSources({ titles: candidateTitles, seriesTitle: targetTitle, originalTitle, season, episode, isDub: false }).catch(() => []) : Promise.resolve([]),
    fetchSinewixSources({ type, title: targetTitle, originalTitle, year: targetYear, season, episode, isDub: true }).catch(() => []),
    fetchDizipalSources({ type, title: targetTitle, seriesTitle: targetTitle, originalTitle, season, episode, isDub: true }).catch(() => []),
    fetchFilmizlechSources({ type, title: targetTitle, seriesTitle: targetTitle, originalTitle, season, episode, isDub: true }).catch(() => []),
    fetchFilmizlechSources({ type, title: targetTitle, seriesTitle: targetTitle, originalTitle, season, episode, isDub: false }).catch(() => []),
    fetchFilmizleNowSources({ type, title: targetTitle, seriesTitle: targetTitle, originalTitle, year: targetYear, season, episode, isDub: true }).catch(() => []),
    fetchFilmizleNowSources({ type, title: targetTitle, seriesTitle: targetTitle, originalTitle, year: targetYear, season, episode, isDub: false }).catch(() => []),
    fetchAnimeTrSources({ titles: candidateTitles, seriesTitle: targetTitle, title: targetTitle, originalTitle, season, episode, isDub: false }).catch(() => []),
    fetchTrAnimeIzleSources({ titles: candidateTitles, seriesTitle: targetTitle, title: targetTitle, originalTitle, season, episode, isDub: false }).catch(() => []),
    fetchTurkAnimeSources({ titles: candidateTitles, seriesTitle: targetTitle, title: targetTitle, originalTitle, season, episode, isDub: false }).catch(() => []),
    fetchBelgeselSources({ titles: candidateTitles, seriesTitle: targetTitle, title: targetTitle, originalTitle, season, episode, isDub: true }).catch(() => [])
  ]);

  const mapDubbedSources = (rawList) => rawList
    .filter(s => {
      const urlStr = (s.url || s.streamUrl || '').toLowerCase();
      const nameStr = (s.name || '').toLowerCase();
      const isBlocked = 
        nameStr.includes('filemoon') || 
        nameStr.includes('setplay') || 
        nameStr.includes('fastplay') ||
        urlStr.includes('filemoon') || 
        urlStr.includes('bysejikuar') || 
        urlStr.includes('setplay.shop') ||
        urlStr.includes('fastplay.mom');
      return urlStr && !urlStr.includes('recaptcha') && !isBlocked && urlStr.length > 8;
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

  const mapSubtitledSources = (rawList) => rawList
    .filter(s => {
      const urlStr = (s.url || s.streamUrl || '').toLowerCase();
      const nameStr = (s.name || '').toLowerCase();
      const isBlocked = 
        nameStr.includes('filemoon') || 
        nameStr.includes('setplay') || 
        nameStr.includes('fastplay') ||
        urlStr.includes('filemoon') || 
        urlStr.includes('bysejikuar') || 
        urlStr.includes('setplay.shop') ||
        urlStr.includes('fastplay.mom');
      return urlStr && !urlStr.includes('recaptcha') && !isBlocked && urlStr.length > 8;
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
      id: 'sub_superembed',
      name: 'SuperEmbed Stream (1080p Altyazılı)',
      badge: '💬 SuperEmbed',
      category: 'subtitled',
      getUrl: () => isMovie
        ? `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1`
        : `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1&s=${season}&e=${episode}`
    },
    {
      id: 'sub_autoembed',
      name: 'AutoEmbed Stream (1080p Altyazılı)',
      badge: '💬 Auto 1080p',
      category: 'subtitled',
      getUrl: () => isMovie
        ? `https://autoembed.co/movie/tmdb/${tmdbId}`
        : `https://autoembed.co/tv/tmdb/${tmdbId}-${season}-${episode}`
    },
    {
      id: 'sub_vidsrc',
      name: 'VidSrc Stream (1080p Altyazılı)',
      badge: '💬 VidSrc 1080p',
      category: 'subtitled',
      getUrl: () => isMovie
        ? `https://vidsrc.to/embed/movie/${tmdbId}`
        : `https://vidsrc.to/embed/tv/${tmdbId}/${season}/${episode}`
    },
    {
      id: 'sub_vidsrc_me',
      name: 'VidSrc ME Stream (1080p Altyazılı)',
      badge: '💬 VidSrc ME',
      category: 'subtitled',
      getUrl: () => isMovie
        ? `https://vidsrc.me/embed/movie?tmdb=${tmdbId}`
        : `https://vidsrc.me/embed/tv?tmdb=${tmdbId}&season=${season}&episode=${episode}`
    }
  ];

  if (cleanDubbed.length === 0) {
    if (antrSub.length > 0 || traSub.length > 0 || taSub.length > 0) {
      cleanDubbed.push(
        ...mapSubtitledSources(antrSub),
        ...mapSubtitledSources(traSub),
        ...mapSubtitledSources(taSub)
      );
    } else {
      cleanDubbed.push({
        id: 'dubbed_not_found',
        name: '⚠️ Dublaj Sunucularda Bulunamadı',
        badge: '❌ Mevcut Değil',
        category: 'dubbed',
        notFound: true,
        showTitle: targetTitle,
        getUrl: () => ''
      });
    }
  }

  if (cleanSubtitled.length === 0) {
    cleanSubtitled.push({
      id: 'subtitled_not_found',
      name: '⚠️ Altyazılı Sunucularda Bulunamadı',
      badge: '❌ Mevcut Değil',
      category: 'subtitled',
      notFound: true,
      showTitle: targetTitle,
      getUrl: () => ''
    });
  }

  return {
    dubbed: cleanDubbed,
    subtitled: cleanSubtitled
  };
}
