/* ==========================================================================
   CinePulse Studio - AnimeciX Dedicated Scraper
   Fetches 1080p Turkish Subtitled & Dubbed anime streams via AnimeciX API:
   - Tau Video VIP (Instant High-Speed HLS)
   - Sibnet HD
   - Vidmoly / Doodstream / OK.ru / Mail.ru
   - Automatic multi-season and translation team (Fansub) resolution
   ========================================================================== */

const CF_WORKER_PROXY = 'https://wild-credit-e1ae.cagatayca07.workers.dev';

function normalizeTitle(t) {
  if (!t) return '';
  return t
    .toLowerCase()
    .trim()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^\w\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export async function fetchAnimecixSources({
  titles = [],
  seriesTitle = '',
  title = '',
  originalTitle = '',
  season = 1,
  episode = 1,
  isDub = false
}) {
  const candidateQueries = [...new Set([
    originalTitle,
    seriesTitle,
    title,
    ...titles
  ])].filter(t => t && typeof t === 'string' && t.trim().length > 1);

  if (candidateQueries.length === 0) return [];

  const foundAnimeMatches = [];
  const seenAnimeIds = new Set();

  for (const query of candidateQueries) {
    try {
      const cleanQ = normalizeTitle(query);
      if (!cleanQ || cleanQ.length < 2) continue;

      const searchUrl = `https://animecix.net/secure/search/${encodeURIComponent(cleanQ)}`;
      const res = await fetch(`${CF_WORKER_PROXY}?url=${encodeURIComponent(searchUrl)}`, {
        signal: AbortSignal.timeout(3500)
      });
      if (!res.ok) continue;

      const data = await res.json();
      if (!data.results || !Array.isArray(data.results)) continue;

      for (const item of data.results) {
        if (item && item.id && !seenAnimeIds.has(item.id)) {
          seenAnimeIds.add(item.id);
          foundAnimeMatches.push(item);
        }
      }

      if (foundAnimeMatches.length >= 5) break;
    } catch (_) {}
  }

  if (foundAnimeMatches.length === 0) return [];

  const sources = [];
  const seenUrls = new Set();

  // Collect matching videos from top matched titles
  for (const anime of foundAnimeMatches.slice(0, 4)) {
    try {
      const epUrl = `https://animecix.net/secure/episode-videos?titleId=${anime.id}&season=${season}&episode=${episode}`;
      const epRes = await fetch(`${CF_WORKER_PROXY}?url=${encodeURIComponent(epUrl)}`, {
        signal: AbortSignal.timeout(4000)
      });
      if (!epRes.ok) continue;

      const videos = await epRes.json();
      if (!Array.isArray(videos) || videos.length === 0) continue;

      const matchedList = [];
      for (const v of videos) {
        if (!v || !v.url || typeof v.url !== 'string') continue;
        const streamUrl = v.url.trim();
        if (seenUrls.has(streamUrl) || streamUrl.length < 5) continue;
        seenUrls.add(streamUrl);

        const rawProvider = v.name || 'VIP';
        const providerName = rawProvider.replace(/animecix/gi, 'AX');
        const fansubInfo = v.extra ? ` • ${v.extra}` : '';
        const isDubbedVideo = (providerName + ' ' + (v.extra || '')).toLowerCase().includes('dublaj');

        if (isDub && !isDubbedVideo) continue;

        matchedList.push({
          id: `acx_${anime.id}_${v.id || sources.length}_${isDub ? 'dub' : 'sub'}`,
          name: `AX - ${providerName} (${isDub ? '1080p TR Dublaj' : '1080p Altyazılı'})${fansubInfo}`,
          badge: isDub ? '🎌 Dublaj' : `🎌 ${providerName}`,
          category: isDub ? 'dubbed' : 'subtitled',
          providerName,
          streamUrl: streamUrl,
          url: streamUrl,
          getUrl: () => streamUrl
        });
      }

      // Priority sort: Tau Video > Sibnet > VidMoly > Doodstream
      matchedList.sort((a, b) => {
        const getP = (item) => {
          const s = (item.providerName + ' ' + item.streamUrl).toLowerCase();
          if (s.includes('tau')) return 1;
          if (s.includes('sibnet')) return 2;
          if (s.includes('vidmoly')) return 3;
          if (s.includes('ok.ru')) return 4;
          if (s.includes('mail.ru')) return 5;
          if (s.includes('dood')) return 6;
          return 7;
        };
        return getP(a) - getP(b);
      });

      sources.push(...matchedList);
      if (sources.length >= 6) break;
    } catch (_) {}
  }

  return sources;
}
