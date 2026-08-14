/* ==========================================================================
   CinePulse Studio - Belgesel (Documentary) Multi-Source Scraper
   Fetches Turkish documentary streams from BelgeselX, TLC TV, and DMAX TV
   ========================================================================== */

const CF_WORKER_PROXY = 'https://wild-credit-e1ae.cagatayca07.workers.dev';

function toSlug(text) {
  if (!text) return '';
  return text
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

export async function fetchBelgeselSources({ seriesTitle = '', title = '', originalTitle = '', season = 1, episode = 1, isDub = true }) {
  const query = seriesTitle || title || originalTitle;
  if (!query) return [];

  const candidateQueries = [query];
  if (originalTitle && originalTitle !== query) {
    candidateQueries.push(originalTitle);
  }

  const results = [];
  const seenUrls = new Set();

  for (const q of candidateQueries) {
    const slug = toSlug(q);
    if (!slug) continue;

    // 1. Check DMAX TV
    try {
      const dmaxUrl = `https://www.dmax.com.tr/${slug}/${season}-sezon-${episode}-bolum`;
      const proxyDmaxUrl = `${CF_WORKER_PROXY}?url=${encodeURIComponent(dmaxUrl)}`;
      const res = await fetch(proxyDmaxUrl).catch(() => null);
      if (res && res.ok) {
        const html = await res.text();
        if (html.includes('data-video-id') || html.includes('DMAX')) {
          if (!seenUrls.has(dmaxUrl)) {
            seenUrls.add(dmaxUrl);
            results.push({
              id: `dmax_${slug}_${season}_${episode}`,
              name: `DMAX HD (Türkçe Dublaj 1080p)`,
              badge: '🌿 DMAX',
              category: isDub ? 'dubbed' : 'subtitled',
              streamUrl: dmaxUrl,
              url: dmaxUrl,
              getUrl: () => dmaxUrl
            });
          }
        }
      }
    } catch (_) {}

    // 2. Check TLC TV
    try {
      const tlcUrl = `https://www.tlctv.com.tr/${slug}/${season}-sezon-${episode}-bolum`;
      const proxyTlcUrl = `${CF_WORKER_PROXY}?url=${encodeURIComponent(tlcUrl)}`;
      const res = await fetch(proxyTlcUrl).catch(() => null);
      if (res && res.ok) {
        const html = await res.text();
        if (html.includes('data-video-id') || html.includes('TLC')) {
          if (!seenUrls.has(tlcUrl)) {
            seenUrls.add(tlcUrl);
            results.push({
              id: `tlc_${slug}_${season}_${episode}`,
              name: `TLC TV HD (Türkçe Dublaj 1080p)`,
              badge: '🌿 TLC',
              category: isDub ? 'dubbed' : 'subtitled',
              streamUrl: tlcUrl,
              url: tlcUrl,
              getUrl: () => tlcUrl
            });
          }
        }
      }
    } catch (_) {}

    // 3. Check BelgeselX
    try {
      const bxDiziUrl = `https://belgeselx.com/belgeseldizi/${slug}`;
      const proxyBxUrl = `${CF_WORKER_PROXY}?url=${encodeURIComponent(bxDiziUrl)}`;
      const res = await fetch(proxyBxUrl).catch(() => null);
      if (res && res.ok) {
        const html = await res.text();
        if (html.includes('BelgeselX') && !html.includes('404')) {
          if (!seenUrls.has(bxDiziUrl)) {
            seenUrls.add(bxDiziUrl);
            results.push({
              id: `bx_${slug}`,
              name: `BelgeselX (Türkçe Dublaj HD)`,
              badge: '🌿 BelgeselX',
              category: isDub ? 'dubbed' : 'subtitled',
              streamUrl: bxDiziUrl,
              url: bxDiziUrl,
              getUrl: () => bxDiziUrl
            });
          }
        }
      }
    } catch (_) {}
  }

  return results;
}
