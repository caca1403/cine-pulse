/* ==========================================================================
   CinePulse Studio - Webteizle Scraper & Stream Resolver
   Extracts 1080p Turkish Dubbed & Subtitled Streams (VidMoly, Pixel, Filemoon, Ok.ru)
   ========================================================================== */

import { apiUrl } from './apiOrigin.js';
import { isStrictMediaTitleMatch } from './mediaMatcher.js';

const CF_WORKER_PROXY = 'https://wild-credit-e1ae.cagatayca07.workers.dev';

function normalizeTitle(t) {
  if (!t) return '';
  return t
    .toLowerCase()
    .trim()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^\w\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function slugify(text) {
  return normalizeTitle(text).replace(/\s+/g, '-');
}

function loc(path) {
  if (!path || /^https?:\/\//i.test(path)) return path;
  if (typeof window !== 'undefined') {
    const host = window.location?.hostname || '';
    if ((host === 'localhost' || host === '127.0.0.1') && !Boolean(window.Capacitor?.isNativePlatform?.()) && window.location?.protocol !== 'capacitor:') return path;
  }
  return apiUrl(path);
}

/**
 * Resolves streams from Webteizle
 */
export async function fetchWebteizleSources({
  type = 'movie',
  title = '',
  originalTitle = '',
  titles = [],
  season = 1,
  episode = 1,
  isDub = false
} = {}) {
  // Webteizle is exclusively a movie streaming platform
  if (type && type !== 'movie') return [];
  const isMovie = true;
  const candidateQueries = [...new Set([
    title,
    originalTitle,
    ...titles
  ])].filter(t => t && typeof t === 'string' && t.trim().length > 1);

  if (candidateQueries.length === 0) return [];

  // 1. Ozel backend resolver (SezonlukDizi ile ayni mantik: /api/resolve?provider=wtz).
  //    Vercel'de python webteizle.py calisir, datacenter IP'si engellenirse
  //    asagidaki webteizle_stream + CF worker fallback'lari devreye girer.
  try {
    const qs = new URLSearchParams({
      provider: 'wtz', type: 'movie',
      title: title || candidateQueries[0] || '',
      originalTitle: originalTitle || '',
      season: String(season), episode: String(episode),
      isDub: isDub ? '1' : '0'
    });
    candidateQueries.slice(0, 4).forEach((t, i) => { if (t) qs.append(`t${i}`, t); });
    // Local'de vite proxy -> :4000 (python cozuculer); canlida Vercel API.
    // (Eskiden apiUrl() local'de uzak Vercel'e gidiyor, local cozuculer
    // hic kullanilmiyor ve CloseLoad/FastPlay local'de bos donuyordu.)
    const resolveUrl = loc(`/api/resolve?${qs.toString()}`);
    const rres = await fetch(resolveUrl, { signal: AbortSignal.timeout(15000) }).catch(() => null);
    if (rres && rres.ok) {
      const rdata = await rres.json().catch(() => null);
      if (rdata && rdata.success && Array.isArray(rdata.streams) && rdata.streams.length > 0) {
        return rdata.streams.map((s, i) => {
          const prov = s.provider || 'Webteizle';
          const url = s.streamUrl || s.url;
          if (!url) return null;
          return {
            id: `wtz_${String(prov).toLowerCase().replace(/[^a-z0-9]+/g, '') || i}_movie`,
            name: `WTZ ${prov} 1080p`,
            displayName: `WTZ ${prov}`,
            badge: `🎬 ${prov} 1080p`,
            source: 'Webteizle',
            url,
            streamUrl: url,
            quality: '1080p',
            isIframe: true,
            category: isDub ? 'dubbed' : 'subtitled',
            type: 'embed',
            subtitles: Array.isArray(s.subtitles) ? s.subtitles : [],
            getUrl: () => url
          };
        }).filter(Boolean);
      }
    }
  } catch (_) {}

  // 2. Try dedicated backend resolver (bypasses Cloudflare Turnstile/Bot Challenge cleanly)
  try {
    const params = new URLSearchParams({
      title: title || candidateQueries[0] || '',
      originalTitle: originalTitle || '',
      titles: candidateQueries.join(','),
      type,
      season: String(season),
      episode: String(episode),
      isDub: isDub ? 'true' : 'false'
    });

    const serverUrl = loc(`/api/webteizle_stream?${params.toString()}`);
    const res = await fetch(serverUrl, { signal: AbortSignal.timeout(10000) }).catch(() => null);
    if (res && res.ok) {
      const data = await res.json().catch(() => null);
      if (data && data.success && Array.isArray(data.streams) && data.streams.length > 0) {
        return data.streams.map(s => ({
          ...s,
          getUrl: () => s.streamUrl || s.url
        }));
      }
    }
  } catch (_) {}

  const sources = [];
  const seenEmbeds = new Set();

  for (const q of candidateQueries) {
    const slug = slugify(q);
    if (!slug) continue;

    const dilPaths = isDub ? ['dublaj', 'altyazi'] : ['altyazi', 'dublaj'];

    for (const dilPath of dilPaths) {
      try {
        const watchUrl = isMovie
          ? `https://webteizle.info/izle/${dilPath}/${slug}`
          : `https://webteizle.info/izle/${dilPath}/${slug}/${season}-sezon-${episode}-bolum`;

        const pageRes = await fetch(`${CF_WORKER_PROXY}?url=${encodeURIComponent(watchUrl)}`, {
          signal: AbortSignal.timeout(5000),
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
          }
        }).catch(() => null);

        if (!pageRes || !pageRes.ok) continue;

        const html = await pageRes.text().catch(() => '');
        if (!html || !html.includes('data-id')) continue;

        // Extract film id from dilsec
        const idMatch = html.match(/id=["']dilsec["'][^>]*data-id=["'](\d+)["']/i);
        if (!idMatch || !idMatch[1]) continue;
        const filmId = idMatch[1];
        const dilCode = dilPath === 'altyazi' ? 1 : 0;

        // Fetch alternatives from AJAX
        const altUrl = `https://webteizle.info/ajax/dataAlternatif3.asp`;
        const altParams = new URLSearchParams({
          filmid: filmId,
          dil: dilCode.toString(),
          s: isMovie ? '' : season.toString(),
          b: isMovie ? '' : episode.toString(),
          bot: '0'
        });

        const altRes = await fetch(`${CF_WORKER_PROXY}?url=${encodeURIComponent(altUrl)}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Requested-With': 'XMLHttpRequest',
            'Referer': watchUrl
          },
          body: altParams.toString(),
          signal: AbortSignal.timeout(5000)
        }).catch(() => null);

        if (!altRes || !altRes.ok) continue;
        const altData = await altRes.json().catch(() => null);
        if (!altData || altData.status !== 'success' || !Array.isArray(altData.data)) continue;

        for (const alt of altData.data) {
          if (!alt.id) continue;

          // Request embed content for this alternative
          const embedUrl = `https://webteizle.info/ajax/dataEmbed.asp`;
          const embedRes = await fetch(`${CF_WORKER_PROXY}?url=${encodeURIComponent(embedUrl)}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              'X-Requested-With': 'XMLHttpRequest',
              'Referer': watchUrl
            },
            body: `id=${alt.id}`,
            signal: AbortSignal.timeout(4000)
          }).catch(() => null);

          if (!embedRes || !embedRes.ok) continue;
          const embedHtml = await embedRes.text().catch(() => '');
          if (!embedHtml) continue;

          let playerUrl = null;

          // Check known providers
          const iframeSrc = embedHtml.match(/<iframe[^>]+src=["']([^"']+)["']/i);
          const vidmolyMatch = embedHtml.match(/vidmoly\(['"]([^'"]+)['"]/i);
          const okruMatch = embedHtml.match(/okru\(['"]([^'"]+)['"]/i);
          const filemoonMatch = embedHtml.match(/filemoon\(['"]([^'"]+)['"]/i);
          const pixelMatch = embedHtml.match(/pixel\(['"]([^'"]+)['"]/i);

          if (vidmolyMatch && vidmolyMatch[1]) {
            playerUrl = `https://vidmoly.to/embed-${vidmolyMatch[1]}.html`;
          } else if (filemoonMatch && filemoonMatch[1]) {
            playerUrl = `https://bysezoxexe.com/e/${filemoonMatch[1]}`;
          } else if (pixelMatch && pixelMatch[1]) {
            playerUrl = `https://pixeldrain.com/u/${pixelMatch[1].split('|')[0]}`;
          } else if (okruMatch && okruMatch[1]) {
            playerUrl = `https://ok.ru/videoembed/${okruMatch[1]}`;
          } else if (iframeSrc && iframeSrc[1] && !iframeSrc[1].includes('reCAPTCHADATA')) {
            playerUrl = iframeSrc[1].startsWith('//') ? `https:${iframeSrc[1]}` : iframeSrc[1];
          }

          if (playerUrl && !seenEmbeds.has(playerUrl)) {
            seenEmbeds.add(playerUrl);
            const providerName = alt.baslik || 'WTZ';

            sources.push({
              id: `webteizle_${alt.id}`,
              name: `WTZ - ${providerName} (${dilPath === 'dublaj' ? 'Dublaj' : 'Altyazılı'})`,
              displayName: `WTZ ${providerName}`,
              badge: `🎬 ${providerName} 1080p`,
              source: 'Webteizle',
              url: playerUrl,
              streamUrl: playerUrl,
              quality: '1080p',
              isIframe: true,
              category: dilPath === 'dublaj' ? 'dubbed' : 'subtitled',
              type: 'embed',
              getUrl: () => playerUrl
            });
          }
        }

        if (sources.length > 0) break;
      } catch (err) {
        console.warn('[Webteizle Scraper] Error resolving:', err?.message);
      }
    }

    if (sources.length > 0) break;
  }

  return sources;
}
