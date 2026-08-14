/* ==========================================================================
   CinePulse Studio - FilmMakinesi (Rapid & CloseLoad) Scraper
   Fetches verified live DUAL (Turkish Dubbed & Subtitled) Rapid and CloseLoad
   streams from FilmMakinesi via smart search & direct episode resolver.
   ========================================================================== */

function getProxyUrls(pathOrUrl) {
  const isFull = pathOrUrl.startsWith('http');
  const path = isFull ? new URL(pathOrUrl).pathname + new URL(pathOrUrl).search : pathOrUrl;
  const fullUrl = isFull ? pathOrUrl : `https://filmmakinesi.to${path}`;

  return [
    `/api/fmk${path}`,
    `https://wild-credit-e1ae.cagatayca07.workers.dev?url=${encodeURIComponent(fullUrl)}`,
    `https://api.allorigins.win/raw?url=${encodeURIComponent(fullUrl)}`
  ];
}

async function fetchWithFallback(pathOrUrl) {
  const proxies = getProxyUrls(pathOrUrl);
  for (const pUrl of proxies) {
    try {
      const res = await fetch(pUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Referer': 'https://filmmakinesi.to/'
        }
      });
      if (!res.ok) continue;
      const html = await res.text();
      if (html && html.length > 1000 && !html.includes('404 - Sayfa Bulunamadı')) {
        return html;
      }
    } catch (_) {
      continue;
    }
  }
  return null;
}

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
  if (imdbId) candidateQueries.push(imdbId);
  if (targetTitle) candidateQueries.push(targetTitle);
  if (originalTitle && originalTitle !== targetTitle) candidateQueries.push(originalTitle);

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
    const slug = toTurkishSlug(targetTitle);
    if (slug) {
      if (isMovie) {
        targetContentLinks.push(`/film/${slug}-izle/`, `/${slug}-izle-fm1/`, `/${slug}/`);
      } else {
        targetContentLinks.push(`/dizi/${slug}-izle-2022-fm1/`, `/dizi/${slug}-izle-fm1/`, `/dizi/${slug}/`);
      }
    }
  }

  // Step 2: Probe content pages for CloseLoad & Rapid embeds
  for (const link of targetContentLinks.slice(0, 4)) {
    let epPath = '';
    if (!isMovie) {
      const cleanBase = link.replace(/\/$/, '');
      epPath = `${cleanBase}/sezon-${season}/bolum-${episode}/`;
    } else {
      epPath = link.startsWith('/') ? link : `/${link}`;
    }

    const epHtml = await fetchWithFallback(epPath);
    if (!epHtml) continue;

    const videoUrls = [...epHtml.matchAll(/data-video_url="([^"]+)"/gi)].map(m => m[1]);
    const iframes = [...epHtml.matchAll(/<iframe[^>]*(?:data-src|src)="([^"]+)"/gi)].map(m => m[1]);
    const allEmbeds = [...new Set([...videoUrls, ...iframes])].filter(u => 
      (u.includes('closeload') || u.includes('rapid')) && !u.includes('google') && !u.includes('recaptcha')
    );

    if (allEmbeds.length === 0) continue;

    const sources = [];
    for (const embedUrl of allEmbeds) {
      const isRapid = embedUrl.includes('rapid');
      const isClose = embedUrl.includes('closeload');

      if (isRapid) {
        sources.push({
          id: `fmk_rapid_${isDub ? 'dub' : 'sub'}_${season}_${episode}`,
          name: `Rapid Stream (${isDub ? 'Dublaj' : 'Altyazılı'})`,
          badge: '⚡ Rapid',
          category: isDub ? 'dubbed' : 'subtitled',
          streamUrl: embedUrl,
          url: embedUrl,
          getUrl: () => embedUrl
        });
      } else if (isClose) {
        sources.push({
          id: `fmk_close_${isDub ? 'dub' : 'sub'}_${season}_${episode}`,
          name: `CloseLoad (${isDub ? 'Dublaj' : 'Altyazılı'})`,
          badge: '⚡ CloseLoad',
          category: isDub ? 'dubbed' : 'subtitled',
          streamUrl: embedUrl,
          url: embedUrl,
          getUrl: () => embedUrl
        });
      }
    }

    if (sources.length > 0) {
      return sources;
    }
  }

  return [];
}
