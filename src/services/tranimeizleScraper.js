/* ==========================================================================
   CinePulse Studio - TRAnimeİzle Dedicated Scraper
   Fetches episode streams from tranimeizle.io / tranimeizle.net
   ========================================================================== */

const CF_WORKER_PROXY = 'https://wild-credit-e1ae.cagatayca07.workers.dev';

function toTurkishSlug(title) {
  if (!title) return '';
  return title
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

export async function fetchTrAnimeIzleSources({ titles = [], seriesTitle = '', title = '', originalTitle = '', season = 1, episode = 1, isDub = false }) {
  const candidateTitles = [...new Set([
    ...titles,
    seriesTitle,
    title,
    originalTitle
  ])].filter(t => t && typeof t === 'string' && t.trim().length > 1);

  if (candidateTitles.length === 0) return [];

  const candidateSlugs = [...new Set(candidateTitles.map(t => toTurkishSlug(t)).filter(Boolean))];

  for (const slug of candidateSlugs) {
    if (!slug) continue;
    try {
      const epUrl = `https://www.tranimeizle.io/anime/${slug}/${episode}-bolum`;
      const proxyUrl = `${CF_WORKER_PROXY}?url=${encodeURIComponent(epUrl)}`;

      const res = await fetch(proxyUrl).catch(() => null);
      if (!res || !res.ok) continue;

      const html = await res.text();
      if (html.includes('Bulunamadı') || html.includes('404')) continue;

      const iframes = [...html.matchAll(/<iframe[^>]+src="([^"]+)"/gi)].map(m => m[1]);
      if (iframes.length > 0) {
        const directUrl = iframes[0];
        return [
          {
            id: `tra_${slug}_${episode}`,
            name: `TRAnimeİzle (1080p Altyazılı)`,
            badge: '🎌 TRAnime',
            category: isDub ? 'dubbed' : 'subtitled',
            streamUrl: directUrl,
            url: directUrl,
            getUrl: () => directUrl
          }
        ];
      }

      return [
        {
          id: `tra_${slug}_${episode}`,
          name: `TRAnimeİzle (Bölüm ${episode})`,
          badge: '🎌 TRAnime',
          category: isDub ? 'dubbed' : 'subtitled',
          isExternalPopout: true,
          streamUrl: epUrl,
          url: epUrl,
          getUrl: () => epUrl
        }
      ];
    } catch (e) {
      console.warn('[TRAnimeIzleScraper] Error:', e.message);
    }
  }

  return [];
}
