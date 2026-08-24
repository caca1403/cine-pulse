/* ==========================================================================
   CinePulse Studio - HDFilmCehennemi Scraper (hdfilmcehennemi.now)
   Extracts Rapidrame, VidMoly & FastStream Turkish Dubbed & Subtitled Streams
   Supports both Movies and TV Series.
   ========================================================================== */

function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export async function fetchHDFilmcehennemiSources({
  type = 'movie',
  titles = [],
  title = '',
  seriesTitle = '',
  originalTitle = '',
  year = null,
  season = 1,
  episode = 1,
  isDub = true
}) {
  const isMovie = type === 'movie';
  const isBrowser = typeof window !== 'undefined';
  const baseUrl = isBrowser ? '/api/hdfc' : 'https://www.hdfilmcehennemi.now';

  const allTitles = Array.from(new Set([
    seriesTitle,
    title,
    originalTitle,
    ...(Array.isArray(titles) ? titles : [])
  ])).filter(Boolean);

  if (allTitles.length === 0) return [];

  const candidateUrls = [];
  const yr = year ? String(year).trim() : '';

  for (const t of allTitles) {
    const slug = slugify(t.replace(/\s*\(\d{4}\).*/, ''));
    if (!slug) continue;

    if (isMovie) {
      candidateUrls.push(
        `${baseUrl}/${slug}/`,
        `${baseUrl}/${slug}-izle/`,
        `${baseUrl}/${slug}-hd-izle/`,
        `${baseUrl}/${slug}-turkce-dublaj-izle/`,
        `${baseUrl}/${slug}-turkce-altyazi-izle/`
      );
      if (yr) {
        candidateUrls.push(
          `${baseUrl}/${slug}-${yr}/`,
          `${baseUrl}/${slug}-${yr}-izle/`
        );
      }
    } else {
      candidateUrls.push(
        `${baseUrl}/dizi/${slug}/sezon-${season}/bolum-${episode}/`,
        `${baseUrl}/dizi/${slug}-izle/sezon-${season}/bolum-${episode}/`,
        `${baseUrl}/${slug}/sezon-${season}-bolum-${episode}/`
      );
      if (yr) {
        candidateUrls.push(
          `${baseUrl}/dizi/${slug}-${yr}/sezon-${season}/bolum-${episode}/`,
          `${baseUrl}/dizi/${slug}-${yr}-izle/sezon-${season}/bolum-${episode}/`
        );
      }
    }
  }

  if (candidateUrls.length === 0) return [];

  const uniqueUrls = [...new Set(candidateUrls)];

  const htmlResults = await Promise.all(
    uniqueUrls.map(async (targetUrl) => {
      try {
        const res = await fetch(targetUrl, {
          signal: AbortSignal.timeout(4500),
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
            'Referer': 'https://www.hdfilmcehennemi.now/'
          }
        });
        if (!res.ok) return null;
        const html = await res.text();
        if (!html || html.length < 500 || html.includes('404 Not Found')) return null;
        return { targetUrl, html };
      } catch (_) {
        return null;
      }
    })
  );

  const sources = [];

  for (const match of htmlResults.filter(Boolean)) {
    const { html } = match;

    // 1. Direct iframe / data-src match
    const embedMatches = [...html.matchAll(/(?:data-src|data-video|src)=["'](https?:\/\/(?:rapidrame|vidmoly|closeload|playmix|hdfilmcehennemi|stream)[^"']+)["']/gi)];
    for (const m of embedMatches) {
      const streamUrl = m[1];
      const name = streamUrl.includes('rapidrame') ? 'Rapidrame 1080p'
        : (streamUrl.includes('vidmoly') ? 'VidMoly 1080p'
        : (streamUrl.includes('closeload') ? 'Closeload HD' : 'HDFilmCehennemi 1080p'));

      sources.push({
        id: `hdfc_${Math.random().toString(36).substring(2, 7)}`,
        name,
        displayName: name,
        badge: isDub ? '⚡ HDFC Dublaj' : '💬 HDFC Altyazı',
        category: isDub ? 'dubbed' : 'subtitled',
        url: streamUrl,
        streamUrl: streamUrl,
        isHls: streamUrl.includes('.m3u8') || streamUrl.includes('.txt'),
        isDirectVideo: false,
        getUrl: () => streamUrl
      });
    }

    if (sources.length > 0) return sources;
  }

  return sources;
}
