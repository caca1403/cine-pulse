/* ==========================================================================
   CinePulse Studio - HDFilmCehennemi Scraper & Direct Stream Engine
   Extracts direct 1080p HLS streams and official Turkish subtitles
   Bypasses Cloudflare & SAMEORIGIN without 403 Forbidden errors
   ========================================================================== */

import { apiUrl } from './apiOrigin.js';
import { Capacitor, CapacitorHttp } from '@capacitor/core';

const HDFC_BASES = ['https://www.hdfilmcehennemi.nl', 'https://hdfilmcehennemi.mobi'];
const HDFC_DOMAINS_URL = 'https://raw.githubusercontent.com/manitux-app/cs-plugins/main/domains.json';
const HDFC_UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

function hdfcSlug(value) {
  return String(value || '').normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

function responseText(response) {
  return typeof response?.data === 'string' ? response.data : '';
}

async function getOnDevice(url, referer, origin, httpClient = CapacitorHttp, timeoutMs = 8000) {
  try {
    const response = await httpClient.get({
      url,
      headers: {
        // Match the same browser identity and AJAX headers used by the working
        // desktop resolver. HDFC rejects otherwise-valid device requests.
        'User-Agent': HDFC_UA,
        'Referer': referer || `${origin}/`,
        'Origin': origin,
        'Accept': 'text/html,application/json,application/xhtml+xml,*/*;q=0.8',
        'Content-Type': 'application/json',
        'X-Requested-With': 'fetch'
      },
      responseType: 'text',
      connectTimeout: Math.min(5000, timeoutMs),
      readTimeout: timeoutMs
    });
    return response?.status >= 200 && response.status < 400 ? responseText(response) : '';
  } catch (_) {
    return '';
  }
}

function pageAlternatives(html) {
  const out = [];
  const buttons = /<(?:button|a|div)\b(?=[^>]*\bdata-video=["']?(\d+))(?=[^>]*\bclass=["'][^"']*alternative-link[^"']*["'])[^>]*>([\s\S]*?)<\/(?:button|a|div)>/gi;
  for (const match of html.matchAll(buttons)) {
    const id = match[1];
    if (!id || out.some(item => item.id === id)) continue;
    const label = match[2].replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    out.push({ id, label });
  }
  return out;
}

function videoEmbedUrl(payload) {
  let html = '';
  try { html = JSON.parse(payload)?.data?.html || ''; } catch (_) {}
  const match = html.match(/<iframe\b[^>]*(?:data-src|src)=["']([^"']+)["'][^>]*>/i);
  if (!match) return '';
  return match[1].startsWith('//') ? `https:${match[1]}` : match[1];
}

// Vercel's datacenter egress can be blocked by HDFC. On Android, resolve the
// episode page from the device network and give the player the provider iframe.
export async function resolveHdfcEmbedsOnDevice({ title, originalTitle, season, episode, type, httpClient = CapacitorHttp, platform = Capacitor.getPlatform() }) {
  if (platform !== 'android' && httpClient === CapacitorHttp) return [];
  const slug = hdfcSlug(title || originalTitle);
  if (!slug) return [];
  const s = Number.parseInt(season, 10) || 1;
  const e = Number.parseInt(episode, 10) || 1;
  const isMovie = type === 'movie';
  const paths = isMovie
    ? [`/${slug}/`, `/hd-${slug}-izle/`, `/${slug}-izle/`]
    : [`/dizi/${slug}-izle-3/sezon-${s}/bolum-${e}/`, `/dizi/${slug}-izle/sezon-${s}/bolum-${e}/`];
  let bases = [...HDFC_BASES];
  try {
    const domainsText = await getOnDevice(HDFC_DOMAINS_URL, HDFC_DOMAINS_URL, 'https://raw.githubusercontent.com', httpClient, 1200);
    const dynamicDomain = JSON.parse(domainsText || '{}')?.hdfilmcehennemi;
    if (typeof dynamicDomain === 'string' && /^https:\/\//i.test(dynamicDomain)) {
      const normalized = dynamicDomain.replace(/\/$/, '');
      bases = [normalized, ...bases.filter(base => base !== normalized)];
    }
  } catch (_) {}
  const requests = bases.flatMap(base => paths.map(path => ({ base, url: `${base}${path}` })));
  let page = null;
  const pages = await Promise.all(requests.map(async candidate => ({
    ...candidate,
    html: await getOnDevice(candidate.url, `${candidate.base}/`, candidate.base, httpClient)
  })));
  page = pages.find(candidate => pageAlternatives(candidate.html).length > 0);
  if (!page) return [];

  const alternatives = pageAlternatives(page.html).slice(0, 5);
  const resolved = await Promise.all(alternatives.map(async alternative => {
    const payload = await getOnDevice(`${page.base}/video/${alternative.id}/`, page.url, page.base, httpClient);
    const embedUrl = videoEmbedUrl(payload);
    if (!embedUrl || /pixel|filemoon|vidmoly/i.test(`${alternative.label} ${embedUrl}`)) return null;
    const provider = /rapid|rplayer/i.test(`${alternative.label} ${embedUrl}`) ? 'Rapidrame' : 'CloseLoad';
    return { provider, embedUrl, id: alternative.id };
  }));

  const sources = [];
  for (const item of resolved.filter(Boolean)) {
    const key = item.provider === 'Rapidrame' ? 'rapid' : 'close';
    for (const category of ['dubbed', 'subtitled']) {
      sources.push({
        id: `hdfc_${key}_device_${item.id}_${isMovie ? 'movie' : `s${s}e${e}`}_${category}`,
        name: `HDFC ${item.provider}`,
        displayName: `HDFC ${item.provider}`,
        source: item.provider,
        url: item.embedUrl,
        streamUrl: item.embedUrl,
        movieUrl: page.url,
        category,
        type: 'embed',
        isIframe: true,
        isDirectVideo: false,
        getUrl: () => item.embedUrl
      });
    }
  }
  return sources;
}

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

    if (!res || !res.ok) {
      return await resolveHdfcEmbedsOnDevice({ title: searchTitle, originalTitle: searchOriginal, season: sNum, episode: epNum, type });
    }

    const data = await res.json().catch(() => null);
    if (!data || !data.success || (!data.streamUrl && !Array.isArray(data.streams))) {
      return await resolveHdfcEmbedsOnDevice({ title: searchTitle, originalTitle: searchOriginal, season: sNum, episode: epNum, type });
    }

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
