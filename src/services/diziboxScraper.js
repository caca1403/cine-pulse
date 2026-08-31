/* ==========================================================================
   CinePulse Studio - DiziBox Scraper (TV Series Only)
   Supports DiziBox with multiple domain/proxy fallbacks
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

export async function fetchDiziboxSources({
  titles = [],
  seriesTitle = '',
  title = '',
  originalTitle = '',
  season = 1,
  episode = 1,
  isDub = false
}) {
  const candidateTitles = [...new Set([
    seriesTitle,
    title,
    originalTitle,
    ...titles
  ])].filter(t => t && typeof t === 'string' && t.trim().length > 1);

  if (candidateTitles.length === 0) return [];

  const candidateSlugs = [...new Set(candidateTitles.map(t => toTurkishSlug(t)).filter(Boolean))];

  for (const slug of candidateSlugs) {
    const urls = [
      `https://www.dizibox.live/${slug}-${season}-sezon-${episode}-bolum-izle/`,
      `https://www.dizibox.live/${slug}-${season}-sezon-${episode}-bolum/`,
      `https://www.dizibox.tv/${slug}-${season}-sezon-${episode}-bolum-izle/`
    ];

    for (const epUrl of urls) {
      try {
        const proxyUrl = `${CF_WORKER_PROXY}?url=${encodeURIComponent(epUrl)}`;
        const res = await fetch(proxyUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Referer': 'https://www.google.com/'
          },
          signal: AbortSignal.timeout(4000)
        }).catch(() => null);

        if (!res || !res.ok) continue;

        const html = await res.text();
        if (!html || html.length < 500 || html.includes('500 ERROR') || html.includes('404 Not Found')) continue;

        // Check if dubbed/sub matches request
        const isDubbedPage = html.toLowerCase().includes('dublaj');
        if (isDub && !isDubbedPage) continue;

        // Match iframe or video player
        const iframeMatch =
          html.match(/<iframe[^>]+src=["']([^"']+)["']/i) ||
          html.match(/data-source=["']([^"']+)["']/i) ||
          html.match(/src=["'](https?:\/\/[^"']*(?:vidmoly|sibnet|fembed|player|embed)[^"']*)["']/i);

        let streamUrl = iframeMatch ? iframeMatch[1] : null;

        if (streamUrl) {
          if (streamUrl.startsWith('//')) streamUrl = `https:${streamUrl}`;
          if (streamUrl.includes('google') || streamUrl.includes('facebook') || streamUrl.length < 10) continue;

          return [
            {
              id: `dzb_${slug}_s${season}_e${episode}_${isDub ? 'dub' : 'sub'}`,
              name: `DB Stream 1080p`,
              displayName: `DB Stream 1080p`,
              badge: isDub ? '⚡ TR Dublaj' : '💬 TR Altyazı',
              category: isDub ? 'dubbed' : 'subtitled',
              streamUrl,
              url: streamUrl,
              isHls: streamUrl.includes('.m3u8'),
              isDirectVideo: false,
              getUrl: () => streamUrl
            }
          ];
        }
      } catch (_) {}
    }
  }

  return [];
}
