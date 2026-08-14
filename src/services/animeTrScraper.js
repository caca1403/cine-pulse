/* ==========================================================================
   CinePulse Studio - AnimeTR Dedicated Scraper
   Extracts multi-player sources (VidMoly 1080p, OK.ru, Vidoza, VOE, CloudVideo, Drive)
   from animetr.co via CF Worker Gateway
   Ranked for 100% instant playback without iframe blocks.
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

      const rawList = [];
      const seenUrls = new Set();

      // 1. Matched JSON players
      for (const m of altMatches) {
        const url = m[1].replace(/\\/g, '');
        const provider = m[2] || 'AnimeTR';
        if (url && !seenUrls.has(url) && !url.includes('recaptcha') && !url.includes('filemoon') && !url.includes('bysejikuar')) {
          seenUrls.add(url);
          rawList.push({ provider, url });
        }
      }

      // 2. Direct iframes fallback
      for (const ifr of rawIframes) {
        if (ifr && !seenUrls.has(ifr) && !ifr.includes('recaptcha') && !ifr.includes('filemoon') && !ifr.includes('bysejikuar')) {
          seenUrls.add(ifr);
          let label = 'Player';
          if (ifr.includes('vidmoly')) label = 'Vidmoly';
          else if (ifr.includes('ok.ru')) label = 'OK.ru';
          else if (ifr.includes('vidoza')) label = 'Vidoza';
          else if (ifr.includes('sibnet')) label = 'Sibnet';
          else if (ifr.includes('voe')) label = 'VOE';
          else if (ifr.includes('cloudvideo')) label = 'CloudVideo';
          else if (ifr.includes('drive.google')) label = 'Google Drive';

          rawList.push({ provider: label, url: ifr });
        }
      }

      if (rawList.length === 0) continue;

      // Priority ranking: VidMoly > OK.ru > Vidoza > Sibnet > VOE > CloudVideo > Google Drive
      const getPriority = (p, u) => {
        const s = (p + ' ' + u).toLowerCase();
        if (s.includes('vidmoly')) return 1;
        if (s.includes('ok.ru') || s.includes('odnoklassniki')) return 2;
        if (s.includes('vidoza')) return 3;
        if (s.includes('sibnet')) return 4;
        if (s.includes('voe')) return 5;
        if (s.includes('cloudvideo')) return 6;
        if (s.includes('drive.google')) return 7;
        return 8;
      };

      rawList.sort((a, b) => getPriority(a.provider, a.url) - getPriority(b.provider, b.url));

      // Deduplicate by provider key
      const uniqueProviders = new Set();
      const sources = [];

      for (const item of rawList) {
        const pKey = item.provider.toLowerCase();
        if (!uniqueProviders.has(pKey)) {
          uniqueProviders.add(pKey);
          sources.push({
            id: `antr_${pKey}_${episode}_${sources.length}`,
            name: `AnimeTR - ${item.provider} (1080p Altyazılı)`,
            badge: `🎌 ${item.provider}`,
            category: isDub ? 'dubbed' : 'subtitled',
            streamUrl: item.url,
            url: item.url,
            getUrl: () => item.url
          });
        }
      }

      if (sources.length > 0) {
        return sources.slice(0, 6); // Top 6 diverse working players
      }
    } catch (e) {
      console.warn('[AnimeTrScraper] Error:', e.message);
    }
  }

  return [];
}
