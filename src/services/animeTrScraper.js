/* ==========================================================================
   CinePulse Studio - AnimeTR Dedicated Scraper
   Extracts multi-player sources (VidMoly, Sibnet, Drive, OK.ru, Voe, Vidoza)
   from animetr.co via CF Worker Gateway
   Supports multi-alias slugs (English, Romaji, Turkish, TMDB)
   ========================================================================== */

const CF_WORKER_PROXY = 'https://wild-credit-e1ae.cagatayca07.workers.dev';

function toSlug(title) {
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

export async function fetchAnimeTrSources({ titles = [], seriesTitle = '', title = '', originalTitle = '', season = 1, episode = 1, isDub = false }) {
  const candidateTitles = [...new Set([
    ...titles,
    seriesTitle,
    title,
    originalTitle
  ])].filter(t => t && typeof t === 'string' && t.trim().length > 1);

  if (candidateTitles.length === 0) return [];

  const candidateSlugs = [...new Set(candidateTitles.map(t => toSlug(t)).filter(Boolean))];

  for (const slug of candidateSlugs) {
    if (!slug) continue;
    try {
      const watchUrl = `https://animetr.co/izle/${slug}/bolum-${episode}`;
      const proxyUrl = `${CF_WORKER_PROXY}?url=${encodeURIComponent(watchUrl)}`;

      const res = await fetch(proxyUrl).catch(() => null);
      if (!res || !res.ok) continue;

      const html = await res.text();
      if (html.includes('Sayfa Bulunamadı') || html.includes('404')) continue;

      const altMatches = [...html.matchAll(/"embed_url":"([^"]+)","provider":"([^"]+)"/gi)];
      const rawIframes = [...html.matchAll(/<iframe[^>]+src="([^"]+)"/gi)].map(m => m[1]);

      const sources = [];
      const seenUrls = new Set();

      // 1. Matched JSON players
      for (const m of altMatches) {
        const url = m[1].replace(/\\/g, '');
        const provider = m[2] || 'AnimeTR';
        if (url && !seenUrls.has(url) && !url.includes('recaptcha') && !url.includes('filemoon') && !url.includes('bysejikuar')) {
          seenUrls.add(url);
          sources.push({
            id: `antr_${provider.toLowerCase()}_${episode}_${sources.length}`,
            name: `AnimeTR - ${provider} (1080p Altyazılı)`,
            badge: `🎌 ${provider}`,
            category: isDub ? 'dubbed' : 'subtitled',
            streamUrl: url,
            url: url,
            getUrl: () => url
          });
        }
      }

      // 2. Direct iframes fallback
      for (const ifr of rawIframes) {
        if (ifr && !seenUrls.has(ifr) && !ifr.includes('recaptcha') && !ifr.includes('filemoon') && !ifr.includes('bysejikuar')) {
          seenUrls.add(ifr);
          let label = 'Player';
          if (ifr.includes('sibnet')) label = 'Sibnet';
          else if (ifr.includes('vidmoly')) label = 'Vidmoly';
          else if (ifr.includes('drive.google')) label = 'Google Drive';
          else if (ifr.includes('ok.ru')) label = 'OK.ru';
          else if (ifr.includes('vidoza')) label = 'Vidoza';
          else if (ifr.includes('voe')) label = 'VOE';

          sources.push({
            id: `antr_ifr_${episode}_${sources.length}`,
            name: `AnimeTR - ${label} (1080p Altyazılı)`,
            badge: `🎌 ${label}`,
            category: isDub ? 'dubbed' : 'subtitled',
            streamUrl: ifr,
            url: ifr,
            getUrl: () => ifr
          });
        }
      }

      if (sources.length > 0) {
        return sources.slice(0, 6); // Top 6 fastest players
      }
    } catch (e) {
      console.warn('[AnimeTrScraper] Error:', e.message);
    }
  }

  return [];
}
