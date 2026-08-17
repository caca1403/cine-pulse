/* ==========================================================================
   CinePulse Studio - Comprehensive Türkçe Dublaj Belgesel Scraper
   Aggregates live 1080p Turkish dubbed documentary streams from:
   - DMAX (Official Turkish Dubbed Stream)
   - TLC (Official Turkish Dubbed Stream)
   - BelgeselX (1080p HD Embed)
   - Belgeselce (1080p HD Embed)
   ========================================================================== */

const CF_WORKER_PROXY = 'https://wild-credit-e1ae.cagatayca07.workers.dev';

function normalizeText(text) {
  if (!text) return '';
  return text
    .replace(/İ/g, 'i')
    .replace(/I/g, 'i')
    .replace(/Ğ/g, 'g')
    .replace(/Ü/g, 'u')
    .replace(/Ş/g, 's')
    .replace(/Ö/g, 'o')
    .replace(/Ç/g, 'c')
    .toLowerCase()
    .trim()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]/g, '');
}

function toTurkishSlug(title) {
  if (!title) return '';
  return title
    .replace(/\s*\(\d{4}\).*/, '')
    .replace(/[:.,!?'"()]/g, '')
    .replace(/İ/g, 'i')
    .replace(/I/g, 'i')
    .replace(/Ğ/g, 'g')
    .replace(/Ü/g, 'u')
    .replace(/Ş/g, 's')
    .replace(/Ö/g, 'o')
    .replace(/Ç/g, 'c')
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

export async function fetchBelgeselSources({
  titles = [],
  seriesTitle = '',
  title = '',
  originalTitle = '',
  season = 1,
  episode = 1
}) {
  const candidateTitles = [...new Set([
    ...titles,
    seriesTitle,
    title,
    originalTitle
  ])].filter(t => t && typeof t === 'string' && t.trim().length > 2);

  if (candidateTitles.length === 0) return [];

  const results = [];
  const seenUrls = new Set();

  for (const q of candidateTitles) {
    const slug = toTurkishSlug(q);
    if (!slug) continue;
    const normQ = normalizeText(q);

    // 1. DMAX TV (Official Turkish Dubbed Stream)
    try {
      const dmaxEpUrl = `https://www.dmax.com.tr/${slug}/${season}-sezon-${episode}-bolum`;
      const proxyDmaxUrl = `${CF_WORKER_PROXY}?url=${encodeURIComponent(dmaxEpUrl)}`;
      const res = await fetch(proxyDmaxUrl).catch(() => null);
      if (res && res.ok) {
        const html = await res.text();
        const pageTitle = html.match(/<title>([^<]+)<\/title>/i)?.[1] || '';
        const normPageTitle = normalizeText(pageTitle);
        const matchLen = Math.min(normQ.length, 6);

        if (
          !normPageTitle.includes('sayfa bulunamadi') &&
          !normPageTitle.includes('404') &&
          (normPageTitle.includes(normQ.substring(0, matchLen)) || html.includes('referenceId'))
        ) {
          if (!seenUrls.has(dmaxEpUrl)) {
            seenUrls.add(dmaxEpUrl);
            results.push({
              id: `dmax_${slug}_${season}_${episode}`,
              name: `DMAX`,
              displayName: `DMAX`,
              badge: '🌿 DMAX',
              category: 'dubbed',
              isHls: false,
              isDirectVideo: false,
              streamUrl: dmaxEpUrl,
              url: dmaxEpUrl,
              getUrl: () => dmaxEpUrl
            });
          }
        }
      }

      // If exact episode page wasn't found directly, check program catalog on DMAX
      if (results.length === 0) {
        const mainDmaxUrl = `https://www.dmax.com.tr/${slug}`;
        const mainRes = await fetch(`${CF_WORKER_PROXY}?url=${encodeURIComponent(mainDmaxUrl)}`).catch(() => null);
        if (mainRes && mainRes.ok) {
          const mainHtml = await mainRes.text();
          const pageTitle = mainHtml.match(/<title>([^<]+)<\/title>/i)?.[1] || '';
          const normPageTitle = normalizeText(pageTitle);
          const matchLen = Math.min(normQ.length, 6);

          if (
            !normPageTitle.includes('sayfa bulunamadi') &&
            !normPageTitle.includes('404') &&
            (normPageTitle.includes(normQ.substring(0, matchLen)) || mainHtml.includes('referenceId'))
          ) {
            const linkRegex = new RegExp(`href=["'](https?:\\/\\/www\\.dmax\\.com\\.tr\\/${slug}\\/(\\d+)-sezon-(\\d+)-bolum)["']`, 'gi');
            let m;
            const eps = [];
            while ((m = linkRegex.exec(mainHtml)) !== null) {
              eps.push({ url: m[1], season: parseInt(m[2], 10), episode: parseInt(m[3], 10) });
            }

            const targetUrl = eps.find(e => e.season === season && e.episode === episode)?.url ||
                              eps.find(e => e.episode === episode)?.url ||
                              eps[0]?.url ||
                              mainDmaxUrl;

            if (!seenUrls.has(targetUrl)) {
              seenUrls.add(targetUrl);
              results.push({
                id: `dmax_${slug}_${season}_${episode}`,
                name: `DMAX`,
                displayName: `DMAX`,
                badge: '🌿 DMAX',
                category: 'dubbed',
                isHls: false,
                isDirectVideo: false,
                streamUrl: targetUrl,
                url: targetUrl,
                getUrl: () => targetUrl
              });
            }
          }
        }
      }
    } catch (_) {}

    // 2. TLC TV (Official Turkish Dubbed Stream)
    try {
      const tlcEpUrl = `https://www.tlctv.com.tr/${slug}/${season}-sezon-${episode}-bolum`;
      const proxyTlcUrl = `${CF_WORKER_PROXY}?url=${encodeURIComponent(tlcEpUrl)}`;
      const res = await fetch(proxyTlcUrl).catch(() => null);
      if (res && res.ok) {
        const html = await res.text();
        const pageTitle = html.match(/<title>([^<]+)<\/title>/i)?.[1] || '';
        const normPageTitle = normalizeText(pageTitle);
        const matchLen = Math.min(normQ.length, 6);

        if (
          !normPageTitle.includes('404') &&
          !normPageTitle.includes('bulunamadi') &&
          normPageTitle.includes(normQ.substring(0, matchLen))
        ) {
          if (!seenUrls.has(tlcEpUrl)) {
            seenUrls.add(tlcEpUrl);
            results.push({
              id: `tlc_${slug}_${season}_${episode}`,
              name: `TLC (Dublaj HD)`,
              badge: '🌿 TLC',
              category: 'dubbed',
              isHls: false,
              isDirectVideo: false,
              streamUrl: tlcEpUrl,
              url: tlcEpUrl,
              getUrl: () => tlcEpUrl
            });
          }
        }
      }

      // If exact episode wasn't found, check main TLC catalog
      if (!results.some(r => r.id.startsWith('tlc_'))) {
        const mainTlcUrl = `https://www.tlctv.com.tr/${slug}`;
        const mainRes = await fetch(`${CF_WORKER_PROXY}?url=${encodeURIComponent(mainTlcUrl)}`).catch(() => null);
        if (mainRes && mainRes.ok) {
          const mainHtml = await mainRes.text();
          const pageTitle = mainHtml.match(/<title>([^<]+)<\/title>/i)?.[1] || '';
          const normPageTitle = normalizeText(pageTitle);
          const matchLen = Math.min(normQ.length, 6);

          if (
            !normPageTitle.includes('404') &&
            !normPageTitle.includes('bulunamadi') &&
            normPageTitle.includes(normQ.substring(0, matchLen))
          ) {
            const linkRegex = new RegExp(`href=["'](https?:\\/\\/www\\.tlctv\\.com\\.tr\\/${slug}\\/(\\d+)-sezon-(\\d+)-bolum)["']`, 'gi');
            let m;
            const eps = [];
            while ((m = linkRegex.exec(mainHtml)) !== null) {
              eps.push({ url: m[1], season: parseInt(m[2], 10), episode: parseInt(m[3], 10) });
            }

            const targetUrl = eps.find(e => e.season === season && e.episode === episode)?.url ||
                              eps.find(e => e.episode === episode)?.url ||
                              eps[0]?.url ||
                              mainTlcUrl;

            if (!seenUrls.has(targetUrl)) {
              seenUrls.add(targetUrl);
              results.push({
                id: `tlc_${slug}_${season}_${episode}`,
                name: `TLC (Dublaj HD)`,
                badge: '🌿 TLC',
                category: 'dubbed',
                isHls: false,
                isDirectVideo: false,
                streamUrl: targetUrl,
                url: targetUrl,
                getUrl: () => targetUrl
              });
            }
          }
        }
      }
    } catch (_) {}

    // 3. BelgeselX (1080p Embed)
    try {
      const bxUrls = [
        `https://belgeselx.com/belgeseldizi/${slug}`,
        `https://belgeselx.com/belgesel/${slug}`
      ];

      for (const bxUrl of bxUrls) {
        const proxyBxUrl = `${CF_WORKER_PROXY}?url=${encodeURIComponent(bxUrl)}`;
        const res = await fetch(proxyBxUrl).catch(() => null);
        if (res && res.ok) {
          const html = await res.text();
          const pageTitle = html.match(/<title>([^<]+)<\/title>/i)?.[1] || '';
          const normPageTitle = normalizeText(pageTitle);

          if (
            !normPageTitle.includes('404') &&
            !normPageTitle.includes('bulunamadi') &&
            normPageTitle.includes(normQ.substring(0, 5))
          ) {
            if (!seenUrls.has(bxUrl)) {
              seenUrls.add(bxUrl);
              results.push({
                id: `bx_${slug}`,
                name: `BelgeselX`,
                badge: '🌿 BelgeselX',
                category: 'dubbed',
                streamUrl: bxUrl,
                url: bxUrl,
                getUrl: () => bxUrl
              });
              break;
            }
          }
        }
      }
    } catch (_) {}

    // 4. Belgeselce (1080p Dublaj)
    try {
      const bcUrl = `https://www.belgeselce.com/${slug}`;
      const proxyBcUrl = `${CF_WORKER_PROXY}?url=${encodeURIComponent(bcUrl)}`;
      const res = await fetch(proxyBcUrl).catch(() => null);
      if (res && res.ok) {
        const html = await res.text();
        const pageTitle = html.match(/<title>([^<]+)<\/title>/i)?.[1] || '';
        const normPageTitle = normalizeText(pageTitle);

        if (!normPageTitle.includes('404') && !normPageTitle.includes('bulunamadi') && normPageTitle.includes(normQ.substring(0, 5))) {
          if (!seenUrls.has(bcUrl)) {
            seenUrls.add(bcUrl);
            results.push({
              id: `bc_${slug}`,
              name: `Belgeselce`,
              badge: '🌿 Belgeselce',
              category: 'dubbed',
              streamUrl: bcUrl,
              url: bcUrl,
              getUrl: () => bcUrl
            });
          }
        }
      }
    } catch (_) {}

    if (results.length > 0) break;
  }

  return results;
}

