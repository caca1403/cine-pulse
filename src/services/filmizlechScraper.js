/* ==========================================================================
   CinePulse Studio - FilmIzleCh Scraper
   Fetches live 1080p Turkish Dubbed & Subtitled Streams from filmizlech.com
   ========================================================================== */

function toSlug(title) {
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

export async function fetchFilmizlechSources({ type = 'tv', seriesTitle = '', title = '', originalTitle = '', season = 1, episode = 1, isDub = true }) {
  const targetTitle = seriesTitle || title;
  const isMovie = type === 'movie';
  const isBrowser = typeof window !== 'undefined';
  const baseRoutes = isBrowser ? ['/api/flz', 'https://filmizlech.com'] : ['https://filmizlech.com'];

  const candidateTitles = [];
  if (targetTitle) candidateTitles.push(targetTitle);
  if (originalTitle && originalTitle !== targetTitle) candidateTitles.push(originalTitle);

  const candidateSlugs = [];
  candidateTitles.forEach(t => {
    const s = toSlug(t);
    if (s && !candidateSlugs.includes(s)) candidateSlugs.push(s);
    if (s && s.startsWith('the-')) {
      const noThe = s.replace(/^the-/, '');
      if (!candidateSlugs.includes(noThe)) candidateSlugs.push(noThe);
    }
  });

  for (const baseRoute of baseRoutes) {
    // 1. Try direct slugs
    for (const slug of candidateSlugs) {
      const targetUrl = isMovie
        ? `${baseRoute}/film/${slug}`
        : `${baseRoute}/dizi/${slug}/sezon-${season}/bolum-${episode}`;

      try {
        const isBrowser = typeof window !== 'undefined';
        const headers = isBrowser ? { 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' } : { 'User-Agent': 'Mozilla/5.0' };
        const res = await fetch(targetUrl, { headers }).catch(() => null);

        if (!res || !res.ok) continue;
        const html = await res.text();

        const pid = html.match(/data-pid="([^"]+)"/)?.[1];
        const ts = html.match(/data-ts="([^"]+)"/)?.[1];
        const sig = html.match(/data-sig="([^"]+)"/)?.[1];

        if (pid && ts && sig) {
          const tokenUrl = `${baseRoute}/api/player-token.php?pid=${pid}&_t=${ts}&_s=${encodeURIComponent(sig)}`;
          const tRes = await fetch(tokenUrl, {
            headers: isBrowser ? { 'Accept': 'application/json' } : { 'User-Agent': 'Mozilla/5.0', 'Referer': targetUrl }
          }).catch(() => null);

          if (tRes && tRes.ok) {
            const data = await tRes.json().catch(() => null);
            if (data && data.url) {
              return [{
                id: `flz_${isDub ? 'dub' : 'sub'}`,
                name: `Channel Stream (${isDub ? 'Dublaj' : 'Altyazılı'} 1080p)`,
                badge: isDub ? '⚡ Channel 1080p' : '💬 Channel 1080p',
                category: isDub ? 'dubbed' : 'subtitled',
                streamUrl: data.url,
                getUrl: () => data.url
              }];
            }
          }
        }
      } catch (e) {
        // silent fallback
      }
    }

    // 2. Try search if direct slug didn't resolve
    for (const searchKeyword of candidateTitles) {
      try {
        const isBrowser = typeof window !== 'undefined';
        const sUrl = `${baseRoute}/search/${encodeURIComponent(searchKeyword)}`;
        const sRes = await fetch(sUrl, {
          headers: isBrowser ? { 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' } : { 'User-Agent': 'Mozilla/5.0' }
        }).catch(() => null);
        if (!sRes || !sRes.ok) continue;
        const sHtml = await sRes.text();

        const itemRegex = isMovie ? /href="([^"]*\/film\/[^"]*)"/gi : /href="([^"]*\/dizi\/[^"]*)"/gi;
        const foundHrefs = [...sHtml.matchAll(itemRegex)].map(m => m[1]);
        const cleanHref = [...new Set(foundHrefs)].find(h => !h.includes('/search/'));

        if (cleanHref) {
          let movieOrSeriesUrl = cleanHref.startsWith('http') ? cleanHref : `${baseRoute}${cleanHref.startsWith('/') ? '' : '/'}${cleanHref}`;
          if (!isMovie) {
            movieOrSeriesUrl = `${movieOrSeriesUrl}/sezon-${season}/bolum-${episode}`;
          }

          const pageRes = await fetch(movieOrSeriesUrl, {
            headers: isBrowser ? { 'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8' } : { 'User-Agent': 'Mozilla/5.0' }
          }).catch(() => null);
          if (!pageRes || !pageRes.ok) continue;
          const pageHtml = await pageRes.text();

          const pid = pageHtml.match(/data-pid="([^"]+)"/)?.[1];
          const ts = pageHtml.match(/data-ts="([^"]+)"/)?.[1];
          const sig = pageHtml.match(/data-sig="([^"]+)"/)?.[1];

          if (pid && ts && sig) {
            const tokenUrl = `${baseRoute}/api/player-token.php?pid=${pid}&_t=${ts}&_s=${encodeURIComponent(sig)}`;
            const tRes = await fetch(tokenUrl, {
              headers: isBrowser ? { 'Accept': 'application/json' } : { 'User-Agent': 'Mozilla/5.0', 'Referer': movieOrSeriesUrl }
            }).catch(() => null);

            if (tRes.ok) {
              const data = await tRes.json();
              if (data && data.url) {
                return [{
                  id: `flz_${isDub ? 'dub' : 'sub'}`,
                  name: `Channel Stream (${isDub ? 'Dublaj' : 'Altyazılı'} 1080p)`,
                  badge: isDub ? '⚡ Channel 1080p' : '💬 Channel 1080p',
                  category: isDub ? 'dubbed' : 'subtitled',
                  streamUrl: data.url,
                  getUrl: () => data.url
                }];
              }
            }
          }
        }
      } catch (e) {
        // silent fallback
      }
    }
  }

  return [];
}
