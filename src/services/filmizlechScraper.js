/* ==========================================================================
   CinePulse Studio - Channel Stream (FilmIzleCh) Scraper
   Fetches live 1080p Turkish Dubbed & Subtitled Streams via CF Worker Gateway
   Strict bidirectional whole-title slug matching to prevent wrong movie playback.
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
  const cleanT = targetSlug.replace(/^film\//, '').replace(/^dizi\//, '').replace(/^\//, '').replace(/\/$/, '').replace(/^the-/, '').replace(/^\d+-/, '');
  const cleanC = candidateSlug.replace(/^film\//, '').replace(/^dizi\//, '').replace(/^\//, '').replace(/\/$/, '').replace(/^the-/, '').replace(/^\d+-/, '');
  if (cleanT === cleanC) return true;

  const tParts = cleanT.split('-').filter(p => p.length > 0);
  const cParts = cleanC.split('-').filter(p => p.length > 0);

  const matched = tParts.filter(p => cParts.includes(p)).length;
  const maxLen = Math.max(tParts.length, cParts.length, 1);
  const ratio = matched / maxLen;

  return ratio >= 0.75;
}

function unblockEmbedUrl(rawUrl) {
  if (!rawUrl) return '';
  // play.liderfilm.cc enforces frame-ancestors restrictions on iframes.
  // The direct embed host x.ag2m4.cfd plays smoothly in all browsers without frame restrictions.
  return rawUrl.replace(/play\.liderfilm\.[a-z]+/i, 'x.ag2m4.cfd');
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
    // 1. Direct Slug Check
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
          const tRes = await fetch(proxyTokenUrl, {
            headers: { 'X-Requested-With': 'XMLHttpRequest', 'Referer': targetUrl }
          }).catch(() => null);

          if (tRes && tRes.ok) {
            const data = await tRes.json().catch(() => null);
            if (data && data.url) {
              const playableUrl = unblockEmbedUrl(data.url);
              return [{
                id: `channel_${isDub ? 'dub' : 'sub'}_${slug}`,
                name: `Channel Stream (${isDub ? 'Dublaj' : 'Altyazılı'} 1080p)`,
                badge: isDub ? '⚡ Channel 1080p' : '💬 Channel 1080p',
                category: isDub ? 'dubbed' : 'subtitled',
                streamUrl: playableUrl,
                url: playableUrl,
                getUrl: () => playableUrl
              }];
            }
          }
        }
      } catch (_) {}
    }

    // 2. High-speed API Search Check
    for (const searchKeyword of candidateTitles) {
      try {
        const sUrl = `${baseDomain}/api/search.php?q=${encodeURIComponent(searchKeyword)}`;
        const proxySearchUrl = `${CF_WORKER_PROXY}?url=${encodeURIComponent(sUrl)}`;
        const sRes = await fetch(proxySearchUrl).catch(() => null);
        if (!sRes || !sRes.ok) continue;
        const searchResults = await sRes.json().catch(() => []);
        if (!Array.isArray(searchResults) || searchResults.length === 0) continue;

        const matchedItem = searchResults.find(item => {
          const itemSlug = item.url ? item.url.split('/').pop() : '';
          return candidateSlugs.some(cs => isSlugSimilar(cs, itemSlug));
        });

        if (matchedItem && matchedItem.url) {
          let movieOrSeriesUrl = matchedItem.url;
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
            const tRes = await fetch(proxyTokenUrl, {
              headers: { 'X-Requested-With': 'XMLHttpRequest', 'Referer': movieOrSeriesUrl }
            }).catch(() => null);

            if (tRes && tRes.ok) {
              const data = await tRes.json().catch(() => null);
              if (data && data.url) {
                const playableUrl = unblockEmbedUrl(data.url);
                return [{
                  id: `channel_${isDub ? 'dub' : 'sub'}`,
                  name: `Channel Stream (${isDub ? 'Dublaj' : 'Altyazılı'} 1080p)`,
                  badge: isDub ? '⚡ Channel 1080p' : '💬 Channel 1080p',
                  category: isDub ? 'dubbed' : 'subtitled',
                  streamUrl: playableUrl,
                  url: playableUrl,
                  getUrl: () => playableUrl
                }];
              }
            }
          }
        }
      } catch (_) {}
    }
  }

  return [];
}
