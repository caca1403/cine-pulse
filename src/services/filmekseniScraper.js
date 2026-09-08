/* ==========================================================================
   CinePulse Studio - FilmEkseni Scraper (Movies & TV Series Engine)
   Fetches VIP 1080p Streams from FilmEkseni & EksenLoad Player
   ========================================================================== */

import { extractEksenloadStream } from './streamExtractors.js';

const CF_WORKER_PROXY = 'https://wild-credit-e1ae.cagatayca07.workers.dev';
const FILM_EKSENI_BASE = 'https://filmekseni.vip';

function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function fetchFex(endpointOrUrl, options = {}) {
  const isBrowser = typeof window !== 'undefined';
  const fullUrl = endpointOrUrl.startsWith('http')
    ? endpointOrUrl
    : `${FILM_EKSENI_BASE}${endpointOrUrl.startsWith('/') ? endpointOrUrl : `/${endpointOrUrl}`}`;

  // 1. In browser, try /api/fex proxy first (bypasses CORS)
  if (isBrowser) {
    try {
      const cleanPath = endpointOrUrl.startsWith('http')
        ? new URL(endpointOrUrl).pathname + new URL(endpointOrUrl).search
        : (endpointOrUrl.startsWith('/') ? endpointOrUrl : `/${endpointOrUrl}`);
      const proxyUrl = `/api/fex${cleanPath}`;
      const res = await fetch(proxyUrl, {
        ...options,
        signal: AbortSignal.timeout(options.timeout || 4000)
      }).catch(() => null);
      if (res && res.ok) return res;
    } catch (_) {}
  }

  // 2. Direct fetch (for Node.js or if CORS allowed)
  try {
    const res = await fetch(fullUrl, {
      ...options,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Referer': 'https://filmekseni.vip/',
        ...(options.headers || {})
      },
      signal: AbortSignal.timeout(options.timeout || 4000)
    }).catch(() => null);
    if (res && res.ok) return res;
  } catch (_) {}

  // 3. Cloudflare Worker fallback
  try {
    const workerUrl = `${CF_WORKER_PROXY}?url=${encodeURIComponent(fullUrl)}`;
    const res = await fetch(workerUrl, {
      ...options,
      signal: AbortSignal.timeout(options.timeout || 4500)
    }).catch(() => null);
    if (res && res.ok) return res;
  } catch (_) {}

  return null;
}

/**
 * Searches FilmEkseni via public /api/search?q=
 */
export async function searchFilmEkseni(query) {
  if (!query || typeof query !== 'string' || query.trim().length < 2) return [];
  try {
    const res = await fetchFex(`/api/search?q=${encodeURIComponent(query.trim())}`, { timeout: 3500 });
    if (!res) return [];
    const data = await res.json().catch(() => null);
    return Array.isArray(data?.data) ? data.data : [];
  } catch (_) {
    return [];
  }
}

export async function fetchFilmEkseniSources({
  type = 'movie',
  titles = [],
  title = '',
  seriesTitle = '',
  originalTitle = '',
  season = null,
  episode = null,
  isDub = true
}) {
  const isSeries = type === 'series' || type === 'tv' || season !== null;
  const sNum = parseInt(season, 10) || 1;
  const epNum = parseInt(episode, 10) || 1;

  const isBrowser = typeof window !== 'undefined';
  const baseUrl = isBrowser ? '/api/fex' : 'https://filmekseni.vip';

  const allTitles = Array.from(new Set([
    title,
    seriesTitle,
    originalTitle,
    ...(titles || [])
  ])).filter(Boolean);

  const candidateUrls = new Set();

  // 1. Candidate URLs from direct slug guesses
  for (const t of allTitles) {
    const slug = slugify(t);
    if (!slug) continue;

    if (isSeries) {
      candidateUrls.add(`${baseUrl}/dizi/${slug}/sezon-${sNum}/bolum-${epNum}/`);
      candidateUrls.add(`${baseUrl}/dizi/${slug}/sezon-${sNum}/bolum-${epNum}`);
      candidateUrls.add(`${baseUrl}/dizi/hd-${slug}/sezon-${sNum}/bolum-${epNum}/`);
      candidateUrls.add(`${baseUrl}/dizi/${slug}-izle/sezon-${sNum}/bolum-${epNum}/`);
    } else {
      candidateUrls.add(`${baseUrl}/${slug}-izle/`);
      candidateUrls.add(`${baseUrl}/hd-${slug}-izle/`);
      candidateUrls.add(`${baseUrl}/${slug}/`);
      candidateUrls.add(`${baseUrl}/hd-${slug}/`);
      candidateUrls.add(`${baseUrl}/${slug}-izle-hd/`);
    }
  }

  // 2. Search API query to uncover localized titles (e.g. "Dark Matter" -> "dizi/karanlik-madde")
  try {
    const searchQueries = allTitles.slice(0, 2);
    for (const q of searchQueries) {
      const searchItems = await searchFilmEkseni(q);
      if (Array.isArray(searchItems) && searchItems.length > 0) {
        for (const item of searchItems.slice(0, 4)) {
          if (!item.slug) continue;
          const cleanSlug = item.slug.replace(/^\/+/, '').replace(/\/+$/, '');

          if (isSeries) {
            if (cleanSlug.startsWith('dizi/')) {
              candidateUrls.add(`${baseUrl}/${cleanSlug}/sezon-${sNum}/bolum-${epNum}/`);
              candidateUrls.add(`${baseUrl}/${cleanSlug}/sezon-${sNum}/bolum-${epNum}`);
            } else {
              candidateUrls.add(`${baseUrl}/dizi/${cleanSlug}/sezon-${sNum}/bolum-${epNum}/`);
            }
          } else {
            if (!cleanSlug.startsWith('dizi/')) {
              candidateUrls.add(`${baseUrl}/${cleanSlug}/`);
              candidateUrls.add(`${baseUrl}/${cleanSlug}-izle/`);
            }
          }
        }
      }
    }
  } catch (_) {}

  if (candidateUrls.size === 0) return [];

  const uniqueUrls = [...candidateUrls];

  // 3. Fetch candidate URLs in parallel
  const htmlResults = await Promise.all(
    uniqueUrls.map(async (pageUrl) => {
      try {
        const res = await fetchFex(pageUrl, { timeout: 4500 });
        if (!res) return null;
        const html = await res.text();
        if (!html || html.length < 500 || html.includes('404 Not Found')) return null;
        return { pageUrl, html };
      } catch (_) {
        return null;
      }
    })
  );

  const sources = [];

  for (const match of htmlResults.filter(Boolean)) {
    const { html } = match;

    // Check for videoPlayerData JSON
    let parsedData = null;
    const jsonParseMatch = html.match(/videoPlayerData\(JSON\.parse\('([\s\S]*?)'\)/i)
      || html.match(/JSON\.parse\('(\{\\u0022[\s\S]*?\})'\)/i);

    if (jsonParseMatch) {
      try {
        const unescaped = jsonParseMatch[1]
          .replace(/\\u0022/g, '"')
          .replace(/\\"/g, '"')
          .replace(/\\\\/g, '\\');
        parsedData = JSON.parse(unescaped);
      } catch (_) {}
    }

    if (!parsedData) {
      const rawMatch = html.match(/videoPlayerData\((\{[\s\S]*?\}),\s*(?:['"][a-z]+['"]|defaultLang)/i);
      if (rawMatch) {
        try {
          parsedData = JSON.parse(rawMatch[1]);
        } catch (_) {}
      }
    }

    if (parsedData) {
      // FilmEkseni series are almost always provided as "dual" (TR Dub + Original Audio).
      // We include "dual" in both isDub: true and isDub: false so series are never missed!
      const items = isDub
        ? (parsedData.dual || parsedData.tr || parsedData.dublaj || [])
        : (parsedData.dual || parsedData.sub || parsedData.altyazi || parsedData.en || []);

      for (const item of items) {
        if (item.link) {
          let playerUrl = `https://eksenload.top/eplayer/${item.link}`;
          if (item.template) {
            try {
              const decodedTemplate = atob(item.template);
              const srcMatch = decodedTemplate.match(/data-src=["']([^"']+)["']/i) || decodedTemplate.match(/src=["']([^"']+)["']/i);
              if (srcMatch) {
                playerUrl = srcMatch[1].replace('{url}', item.link).replace('{slug}', item.slug || 'media');
                if (playerUrl.startsWith('//')) playerUrl = `https:${playerUrl}`;
              }
            } catch (_) {}
          }

          // Try extracting pure direct HLS from EksenLoad
          const directHls = await extractEksenloadStream(playerUrl).catch(() => null);

          if (directHls && directHls.streamUrl) {
            let finalStreamUrl = directHls.streamUrl;
            if (finalStreamUrl.startsWith('http') && !finalStreamUrl.includes('/api/hls_proxy')) {
              finalStreamUrl = `/api/hls_proxy?url=${encodeURIComponent(finalStreamUrl)}&ref=${encodeURIComponent('https://eksenload.top/')}`;
            }
            sources.push({
              id: `fex_direct_${item.service_slug || 'vip'}_${item.link}`,
              name: isDub ? 'FilmEkseni 1080p VIP (TR Dublaj)' : 'FilmEkseni 1080p VIP (TR Altyazı)',
              displayName: 'FilmEkseni 1080p VIP',
              badge: isDub ? '⚡ FilmEkseni Dublaj' : '💬 FilmEkseni Altyazı',
              url: finalStreamUrl,
              streamUrl: finalStreamUrl,
              isHls: true,
              isDirectVideo: true,
              source: 'FilmEkseni',
              getUrl: () => finalStreamUrl
            });
          }

          // Also provide embed option
          const hostName = item.service_name || (playerUrl.includes('eksenload') ? 'EksenLoad VIP' : 'FilmEkseni VIP');
          sources.push({
            id: `fex_${item.service_slug || 'vip'}_${item.link}`,
            name: `${hostName}`,
            displayName: `${hostName}`,
            badge: isDub ? '⚡ FilmEkseni Dublaj' : '💬 FilmEkseni Altyazı',
            url: playerUrl,
            streamUrl: playerUrl,
            isHls: false,
            isDirectVideo: false,
            source: 'FilmEkseni',
            getUrl: () => playerUrl
          });
        }
      }
    }

    // Direct iframes fallback
    if (sources.length === 0) {
      const iframes = html.match(/<iframe[^>]+src=["']([^"']*(?:eksenload|vidmoly|fembed|streamtape|snwix)[^"']*)["']/gi) || [];
      for (const ifr of iframes) {
        const src = (ifr.match(/src=["']([^"']+)["']/i) || [])[1];
        if (src && !src.includes('youtube.com')) {
          const isVidmoly = src.includes('vidmoly');
          const fullSrc = src.startsWith('//') ? `https:${src}` : src;
          const name = isVidmoly ? 'FilmEkseni VidMoly' : 'FilmEkseni VIP';

          sources.push({
            id: `fex_iframe_${Math.random().toString(36).substring(2, 6)}`,
            name: name,
            displayName: name,
            badge: isDub ? '⚡ FilmEkseni Dublaj' : '💬 FilmEkseni Altyazı',
            url: fullSrc,
            streamUrl: fullSrc,
            isHls: false,
            isDirectVideo: false,
            source: 'FilmEkseni',
            getUrl: () => fullSrc
          });
        }
      }
    }

    if (sources.length > 0) return sources;
  }

  return sources;
}
