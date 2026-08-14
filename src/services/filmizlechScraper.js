/* ==========================================================================
   CinePulse Studio - Now Stream (FilmIzleCh / Now) Scraper
   Fetches live 1080p Turkish Dubbed & Subtitled Streams via CF Worker Gateway
   Strict title matching to prevent wrong movie playback.
   ========================================================================== */

const CF_WORKER_PROXY = 'https://wild-credit-e1ae.cagatayca07.workers.dev';

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

function isSlugSimilar(targetSlug, candidateSlug) {
  if (!targetSlug || !candidateSlug) return false;
  const cleanT = targetSlug.replace(/^film\//, '').replace(/^dizi\//, '').replace(/^\//, '').replace(/\/$/, '');
  const cleanC = candidateSlug.replace(/^film\//, '').replace(/^dizi\//, '').replace(/^\//, '').replace(/\/$/, '');
  if (cleanT === cleanC) return true;

  const tParts = cleanT.split('-').filter(p => p.length > 1);
  const cParts = cleanC.split('-').filter(p => p.length > 1);

  const matched = tParts.filter(p => cParts.includes(p)).length;
  const ratio = matched / Math.max(tParts.length, 1);
  return ratio >= 0.75;
}

export async function fetchFilmizlechSources({ type = 'tv', seriesTitle = '', title = '', originalTitle = '', season = 1, episode = 1, isDub = true }) {
  const targetTitle = seriesTitle || title;
  const isMovie = type === 'movie';

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

  const baseDomains = ['https://filmizlech.com'];

  for (const baseDomain of baseDomains) {
    // 1. Try direct slugs
    for (const slug of candidateSlugs) {
      const targetUrl = isMovie
        ? `${baseDomain}/film/${slug}`
        : `${baseDomain}/dizi/${slug}/sezon-${season}/bolum-${episode}`;

      try {
        const proxyTargetUrl = `${CF_WORKER_PROXY}?url=${encodeURIComponent(targetUrl)}`;
        const res = await fetch(proxyTargetUrl).catch(() => null);

        if (!res || !res.ok) continue;
        const html = await res.text();

        const pid = html.match(/data-pid="([^"]+)"/)?.[1];
        const ts = html.match(/data-ts="([^"]+)"/)?.[1];
        const sig = html.match(/data-sig="([^"]+)"/)?.[1];

        if (pid && ts && sig) {
          const tokenUrl = `${baseDomain}/api/player-token.php?pid=${pid}&_t=${ts}&_s=${encodeURIComponent(sig)}`;
          const proxyTokenUrl = `${CF_WORKER_PROXY}?url=${encodeURIComponent(tokenUrl)}`;
          const tRes = await fetch(proxyTokenUrl).catch(() => null);

          if (tRes && tRes.ok) {
            const data = await tRes.json().catch(() => null);
            if (data && data.url) {
              return [{
                id: `now_${isDub ? 'dub' : 'sub'}`,
                name: `Now Stream (${isDub ? 'Dublaj' : 'Altyazılı'} 1080p)`,
                badge: isDub ? '⚡ Now 1080p' : '💬 Now 1080p',
                category: isDub ? 'dubbed' : 'subtitled',
                streamUrl: data.url,
                url: data.url,
                getUrl: () => data.url
              }];
            }
          }
        }
      } catch (e) {}
    }

    // 2. Try search with strict title matching
    for (const searchKeyword of candidateTitles) {
      try {
        const sUrl = `${baseDomain}/search/${encodeURIComponent(searchKeyword)}`;
        const proxySearchUrl = `${CF_WORKER_PROXY}?url=${encodeURIComponent(sUrl)}`;
        const sRes = await fetch(proxySearchUrl).catch(() => null);
        if (!sRes || !sRes.ok) continue;
        const sHtml = await sRes.text();

        const itemRegex = isMovie ? /href="([^"]*\/film\/[^"]*)"/gi : /href="([^"]*\/dizi\/[^"]*)"/gi;
        const foundHrefs = [...sHtml.matchAll(itemRegex)].map(m => m[1]);
        const cleanHrefs = [...new Set(foundHrefs)].filter(h => !h.includes('/search/'));

        // Strict slug similarity matching - NEVER blindly take cleanHrefs[0]
        const matchedHref = cleanHrefs.find(h => {
          const hrefSlug = h.split('/').pop();
          return candidateSlugs.some(cs => isSlugSimilar(cs, hrefSlug));
        });

        if (matchedHref) {
          let movieOrSeriesUrl = matchedHref.startsWith('http') ? matchedHref : `${baseDomain}${matchedHref.startsWith('/') ? '' : '/'}${matchedHref}`;
          if (!isMovie) {
            movieOrSeriesUrl = `${movieOrSeriesUrl}/sezon-${season}/bolum-${episode}`;
          }

          const proxyPageUrl = `${CF_WORKER_PROXY}?url=${encodeURIComponent(movieOrSeriesUrl)}`;
          const pageRes = await fetch(proxyPageUrl).catch(() => null);
          if (!pageRes || !pageRes.ok) continue;
          const pageHtml = await pageRes.text();

          const pid = pageHtml.match(/data-pid="([^"]+)"/)?.[1];
          const ts = pageHtml.match(/data-ts="([^"]+)"/)?.[1];
          const sig = pageHtml.match(/data-sig="([^"]+)"/)?.[1];

          if (pid && ts && sig) {
            const tokenUrl = `${baseDomain}/api/player-token.php?pid=${pid}&_t=${ts}&_s=${encodeURIComponent(sig)}`;
            const proxyTokenUrl = `${CF_WORKER_PROXY}?url=${encodeURIComponent(tokenUrl)}`;
            const tRes = await fetch(proxyTokenUrl).catch(() => null);

            if (tRes && tRes.ok) {
              const data = await tRes.json().catch(() => null);
              if (data && data.url) {
                return [{
                  id: `now_${isDub ? 'dub' : 'sub'}`,
                  name: `Now Stream (${isDub ? 'Dublaj' : 'Altyazılı'} 1080p)`,
                  badge: isDub ? '⚡ Now 1080p' : '💬 Now 1080p',
                  category: isDub ? 'dubbed' : 'subtitled',
                  streamUrl: data.url,
                  url: data.url,
                  getUrl: () => data.url
                }];
              }
            }
          }
        }
      } catch (e) {}
    }
  }

  return [];
}
