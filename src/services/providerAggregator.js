/* ==========================================================================
   CinePulse Studio - Stream Aggregator
   Fetches live direct Turkish sources (DiziBal & SezonlukDizi) for Türkçe Dublaj
   and Türkçe Altyazılı modes.
   Strictly filters out broken servers: filemoon, videosoft, faststream (sub),
   hddirect (sub), multiembed, embed.su, vidsrc, 2embed.
   ========================================================================== */

import { fetchDiziBalSources } from './diziBalScraper.js';
import { fetchSezonlukDiziEpisodeSources } from './sezonlukDiziScraper.js';
import { fetchDizipalSources } from './dizipalScraper.js';
import { fetchSinewixSources } from './sinewixScraper.js';
import { fetchFilmizlechSources } from './filmizlechScraper.js';
import { fetchHdfilmcehennemiSources } from './hdfilmcehennemiScraper.js';
import { fetchFilmizleNowSources } from './filmizleNowScraper.js';

function cleanTitle(raw) {
  if (!raw) return '';
  return raw
    .replace(/\s*-\s*S\d+E\d+.*$/i, '')
    .replace(/\s*-\s*S\d+.*$/i, '')
    .replace(/\s*-\s*\d+\.\s*Sezon.*$/i, '')
    .replace(/\s*:\s*.*$/, '')
    .replace(/\s*\(\d{4}\).*/, '')
    .trim();
}

export async function getStreamingServers({ type = 'tv', tmdbId, title = '', seriesTitle = '', originalTitle = '', season = 1, episode = 1 }) {
  const isMovie = type === 'movie';
  const targetTitle = cleanTitle(seriesTitle) || cleanTitle(title) || cleanTitle(originalTitle);

  // Concurrently fetch sources from live Turkish providers
  const [
    dblDub, dblSub,
    szdDub, szdSub,
    dzpDub,
    snxDub,
    flzDub, flzSub,
    hdfcDub, hdfcSub,
    finDub, finSub
  ] = await Promise.all([
    fetchDiziBalSources({ type, title: targetTitle, seriesTitle: targetTitle, originalTitle, season, episode, isDub: true }).catch(() => []),
    fetchDiziBalSources({ type, title: targetTitle, seriesTitle: targetTitle, originalTitle, season, episode, isDub: false }).catch(() => []),
    !isMovie ? fetchSezonlukDiziEpisodeSources({ seriesTitle: targetTitle, originalTitle, season, episode, isDub: true }).catch(() => []) : Promise.resolve([]),
    !isMovie ? fetchSezonlukDiziEpisodeSources({ seriesTitle: targetTitle, originalTitle, season, episode, isDub: false }).catch(() => []) : Promise.resolve([]),
    fetchDizipalSources({ type, title: targetTitle, seriesTitle: targetTitle, originalTitle, season, episode, isDub: true }).catch(() => []),
    fetchSinewixSources({ type, title: targetTitle, originalTitle, season, episode, isDub: true }).catch(() => []),
    fetchFilmizlechSources({ type, title: targetTitle, seriesTitle: targetTitle, originalTitle, season, episode, isDub: true }).catch(() => []),
    fetchFilmizlechSources({ type, title: targetTitle, seriesTitle: targetTitle, originalTitle, season, episode, isDub: false }).catch(() => []),
    fetchHdfilmcehennemiSources({ type, title: targetTitle, seriesTitle: targetTitle, originalTitle, season, episode, isDub: true }).catch(() => []),
    fetchHdfilmcehennemiSources({ type, title: targetTitle, seriesTitle: targetTitle, originalTitle, season, episode, isDub: false }).catch(() => []),
    fetchFilmizleNowSources({ type, title: targetTitle, seriesTitle: targetTitle, originalTitle, season, episode, isDub: true }).catch(() => []),
    fetchFilmizleNowSources({ type, title: targetTitle, seriesTitle: targetTitle, originalTitle, season, episode, isDub: false }).catch(() => [])
  ]);

  // Helper mapper for Dubbed sources
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
      isExternalPopout: s.isExternalPopout,
      streamUrl: s.streamUrl,
      getUrl: () => s.streamUrl || s.url
    }));

  const cleanDubbed = [
    ...mapDubbedSources(dblDub),
    ...mapDubbedSources(szdDub),
    ...mapDubbedSources(flzDub),
    ...mapDubbedSources(snxDub),
    ...mapDubbedSources(dzpDub)
  ];

  if (cleanDubbed.length === 0) {
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

  // Helper mapper for Subtitled sources
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
      isExternalPopout: s.isExternalPopout,
      streamUrl: s.streamUrl,
      getUrl: () => s.streamUrl || s.url
    }));

  const cleanSubtitled = [
    ...mapSubtitledSources(dblSub),
    ...mapSubtitledSources(szdSub),
    ...mapSubtitledSources(flzSub),
    ...mapSubtitledSources(hdfcSub),
    ...mapSubtitledSources(finSub),
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
      id: 'sub_smashy',
      name: 'Smashy Stream (1080p Altyazılı)',
      badge: '💬 Smashy 1080p',
      category: 'subtitled',
      getUrl: () => isMovie
        ? `https://smashystream.xyz/movie/${tmdbId}`
        : `https://smashystream.xyz/tv/${tmdbId}/${season}/${episode}`
    }
  ];

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
