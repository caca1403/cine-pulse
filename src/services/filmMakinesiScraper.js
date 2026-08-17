/* ==========================================================================
   CinePulse Studio - FilmMakinesi Scraper (https://filmmakinesi.to)
   Fetches ONLY verified direct video embeds (Rapid Stream, CloseLoad, VidMoly)
   Never returns raw website page URLs to avoid iframe connection blocks.
   ========================================================================== */

const CF_WORKER_PROXY = 'https://wild-credit-e1ae.cagatayca07.workers.dev';
const FMK_BASE = 'https://filmmakinesi.to';

function toTurkishSlug(title) {
  if (!title) return '';
  const cleanStr = title.replace(/\s*\(\d{4}\).*/, '').trim();
  return cleanStr
    .toLowerCase()
    .trim()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

async function fetchWithFallback(pathOrUrl) {
  const isFull = pathOrUrl.startsWith('http');
  const fullUrl = isFull ? pathOrUrl : `${FMK_BASE}${pathOrUrl}`;
  const proxyUrl = `${CF_WORKER_PROXY}?url=${encodeURIComponent(fullUrl)}`;

  try {
    const res = await fetch(proxyUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Referer': 'https://filmmakinesi.to/'
      },
      signal: AbortSignal.timeout(2500)
    }).catch(() => null);

    if (!res || !res.ok) return null;
    const html = await res.text();
    if (html && html.length > 1000 && !html.includes('404 - Sayfa Bulunamadı') && !html.includes('Just a moment...')) {
      return html;
    }
  } catch (_) {}
  return null;
}

export async function fetchFilmMakinesiSources({
  type = 'tv',
  seriesTitle = '',
  title = '',
  originalTitle = '',
  season = 1,
  episode = 1,
  imdbId = '',
  isDub = true
}) {
  const targetTitle = seriesTitle || title;
  const isMovie = type === 'movie';
  if (!targetTitle && !imdbId) return [];

  const candidateQueries = [];
  if (targetTitle) candidateQueries.push(targetTitle);
  if (originalTitle && originalTitle !== targetTitle) candidateQueries.push(originalTitle);

  const topSlug = toTurkishSlug(targetTitle);
  if (!topSlug) return [];

  let targetContentLinks = [];

  // Step 1: Search FMK via /arama/?s=...
  for (const q of candidateQueries) {
    const searchPath = `/arama/?s=${encodeURIComponent(q)}`;
    const searchHtml = await fetchWithFallback(searchPath);
    if (searchHtml) {
      const links = [...searchHtml.matchAll(/href="([^"]*(?:\/dizi\/|\/film\/)[^"]*)"/gi)].map(m => m[1]);
      const cleanLinks = [...new Set(links)].filter(l => 
        !l.includes('/tur/') && !l.includes('/yil/') && (isMovie ? l.includes('/film/') : l.includes('/dizi/'))
      );
      if (cleanLinks.length > 0) {
        targetContentLinks = cleanLinks;
        break;
      }
    }
  }

  // Fallback candidate slugs if search is empty
  if (targetContentLinks.length === 0) {
    if (isMovie) {
      targetContentLinks.push(`/film/${topSlug}-izle-fm1/`, `/film/${topSlug}-izle/`, `/${topSlug}-izle-fm1/`);
    } else {
      targetContentLinks.push(`/dizi/${topSlug}-izle-fm1/`, `/dizi/${topSlug}/`);
    }
  }

  // Step 2: Probe content pages for actual video embeds ONLY
  for (const link of targetContentLinks.slice(0, 3)) {
    let epPath = '';
    if (!isMovie) {
      const cleanBase = link.replace(/\/$/, '');
      epPath = `${cleanBase}/sezon-${season}/bolum-${episode}/`;
    } else {
      epPath = link.startsWith('/') ? link : `/${link}`;
    }

    const epHtml = await fetchWithFallback(epPath);
    if (epHtml) {
      const videoUrls = [...epHtml.matchAll(/data-video_url="([^"]+)"/gi)].map(m => m[1]);
      const iframes = [...epHtml.matchAll(/<iframe[^>]*(?:data-src|src)="([^"]+)"/gi)].map(m => m[1]);
      const allEmbeds = [...new Set([...videoUrls, ...iframes])].filter(u => 
        (u.includes('closeload') || u.includes('rapid') || u.includes('vidmoly')) &&
        !u.includes('google') &&
        !u.includes('recaptcha') &&
        !u.includes('filmmakinesi.to')
      );

      if (allEmbeds.length > 0) {
        const sources = [];
        for (const embedUrl of allEmbeds) {
          const isRapid = embedUrl.includes('rapid');
          const isClose = embedUrl.includes('closeload');

          sources.push({
            id: `fmk_${isRapid ? 'rapid' : isClose ? 'close' : 'vid'}_${isDub ? 'dub' : 'sub'}_${season}_${episode}`,
            name: `${isRapid ? 'Rapid Stream' : isClose ? 'CloseLoad' : 'VidMoly'} (${isDub ? 'Dublaj' : 'Altyazılı'})`,
            badge: isRapid ? '⚡ Rapid' : isClose ? '⚡ CloseLoad' : '⚡ VidMoly',
            category: isDub ? 'dubbed' : 'subtitled',
            streamUrl: embedUrl,
            url: embedUrl,
            getUrl: () => embedUrl
          });
        }
        return sources;
      }
    }
  }

  return [];
}
