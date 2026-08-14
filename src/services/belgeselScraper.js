/* ==========================================================================
   CinePulse Studio - Comprehensive Türkçe Dublaj Belgesel Scraper
   Aggregates live 1080p Turkish dubbed documentary streams from:
   - DMAX (Direct 1080p HLS)
   - TLC (Direct 1080p HLS)
   - BelgeselX (1080p Embed)
   - Belgeselce (1080p Embed)
   - TürkçeBelgesel (1080p Embed)
   ========================================================================== */

const CF_WORKER_PROXY = 'https://wild-credit-e1ae.cagatayca07.workers.dev';

function normalizeText(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .trim()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/İ/g, 'i')
    .replace(/I/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]/g, '');
}

function toTurkishSlug(title) {
  if (!title) return '';
  return title
    .toLowerCase()
    .trim()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/İ/g, 'i')
    .replace(/I/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export async function fetchBelgeselSources({ titles = [], seriesTitle = '', title = '', originalTitle = '', season = 1, episode = 1, isDub = true }) {
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

    // 1. DMAX TV (Direct HLS Stream)
    try {
      const dmaxEpUrl = `https://www.dmax.com.tr/${slug}/${season}-sezon-${episode}-bolum`;
      const proxyDmaxUrl = `${CF_WORKER_PROXY}?url=${encodeURIComponent(dmaxEpUrl)}`;
      const res = await fetch(proxyDmaxUrl).catch(() => null);
      if (res && res.ok) {
        const html = await res.text();
        const pageTitle = html.match(/<title>([^<]+)<\/title>/i)?.[1] || '';
        const normPageTitle = normalizeText(pageTitle);

        if (!normPageTitle.includes('canlitv') && !normPageTitle.includes('404') && normPageTitle.includes(normQ.substring(0, 5))) {
          const refId = html.match(/referenceId\s*:\s*['"]([^'"]+)['"]/i)?.[1];
          if (refId) {
            const metaUrl = `https://www.dmax.com.tr/player/info?referenceId=${refId}`;
            const metaRes = await fetch(`${CF_WORKER_PROXY}?url=${encodeURIComponent(metaUrl)}`, {
              headers: { 'X-Requested-With': 'XMLHttpRequest' }
            }).catch(() => null);

            if (metaRes && metaRes.ok) {
              const metaData = await metaRes.json().catch(() => null);
              const hlsUrl = metaData?.video?.data?.flavors?.hls;
              if (hlsUrl && !seenUrls.has(hlsUrl)) {
                seenUrls.add(hlsUrl);
                results.push({
                  id: `dmax_${slug}_${season}_${episode}`,
                  name: `DMAX HD (Türkçe Dublaj 1080p)`,
                  badge: '🌿 DMAX HD',
                  category: 'dubbed',
                  isHls: true,
                  isDirectVideo: false,
                  streamUrl: hlsUrl,
                  url: hlsUrl,
                  getUrl: () => hlsUrl
                });
              }
            }
          }
        }
      }
    } catch (_) {}

    // 2. TLC TV (Direct HLS Stream)
    try {
      const tlcEpUrl = `https://www.tlctv.com.tr/${slug}/${season}-sezon-${episode}-bolum`;
      const proxyTlcUrl = `${CF_WORKER_PROXY}?url=${encodeURIComponent(tlcEpUrl)}`;
      const res = await fetch(proxyTlcUrl).catch(() => null);
      if (res && res.ok) {
        const html = await res.text();
        const pageTitle = html.match(/<title>([^<]+)<\/title>/i)?.[1] || '';
        const normPageTitle = normalizeText(pageTitle);

        if (!normPageTitle.includes('canlitv') && !normPageTitle.includes('404') && normPageTitle.includes(normQ.substring(0, 5))) {
          const refId = html.match(/referenceId\s*:\s*['"]([^'"]+)['"]/i)?.[1];
          if (refId) {
            const metaUrl = `https://www.tlctv.com.tr/player/info?referenceId=${refId}`;
            const metaRes = await fetch(`${CF_WORKER_PROXY}?url=${encodeURIComponent(metaUrl)}`, {
              headers: { 'X-Requested-With': 'XMLHttpRequest' }
            }).catch(() => null);

            if (metaRes && metaRes.ok) {
              const metaData = await metaRes.json().catch(() => null);
              const hlsUrl = metaData?.video?.data?.flavors?.hls;
              if (hlsUrl && !seenUrls.has(hlsUrl)) {
                seenUrls.add(hlsUrl);
                results.push({
                  id: `tlc_${slug}_${season}_${episode}`,
                  name: `TLC TV HD (Türkçe Dublaj 1080p)`,
                  badge: '🌿 TLC HD',
                  category: 'dubbed',
                  isHls: true,
                  isDirectVideo: false,
                  streamUrl: hlsUrl,
                  url: hlsUrl,
                  getUrl: () => hlsUrl
                });
              }
            }
          }
        }
      }
    } catch (_) {}

    // 3. BelgeselX (1080p Embed)
    try {
      const bxUrl = `https://belgeselx.com/belgeseldizi/${slug}`;
      const proxyBxUrl = `${CF_WORKER_PROXY}?url=${encodeURIComponent(bxUrl)}`;
      const res = await fetch(proxyBxUrl).catch(() => null);
      if (res && res.ok) {
        const html = await res.text();
        const pageTitle = html.match(/<title>([^<]+)<\/title>/i)?.[1] || '';
        const normPageTitle = normalizeText(pageTitle);

        if (!normPageTitle.includes('404') && !normPageTitle.includes('bulunamadi') && normPageTitle.includes(normQ.substring(0, 5))) {
          if (!seenUrls.has(bxUrl)) {
            seenUrls.add(bxUrl);
            results.push({
              id: `bx_${slug}`,
              name: `BelgeselX (Türkçe Dublaj 1080p)`,
              badge: '🌿 BelgeselX',
              category: 'dubbed',
              streamUrl: bxUrl,
              url: bxUrl,
              getUrl: () => bxUrl
            });
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
              name: `Belgeselce (Türkçe Dublaj 1080p)`,
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
