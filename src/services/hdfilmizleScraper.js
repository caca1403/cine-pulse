/* ==========================================================================
   HDFilmIzle Scraper (HDFilmIzle.vip)
   Fetches Vidrame, VidMoly, Closeload & Rapidame Turkish Dubbed & Subtitled Streams
   Supports both Movies and TV Series with parallel candidate resolution
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

export async function fetchHDFilmizleSources({
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
  const baseUrl = isBrowser ? '/api/hdi' : 'https://www.hdfilmizle.vip';

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
      // TV Series episode format
      candidateUrls.push(
        `${baseUrl}/dizi/${slug}/sezon-${season}/bolum-${episode}/`,
        `${baseUrl}/dizi/${slug}-izle/sezon-${season}/bolum-${episode}/`
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

  const CF_WORKER_PROXY = 'https://wild-credit-e1ae.cagatayca07.workers.dev';

  const htmlResults = await Promise.all(
    uniqueUrls.map(async (targetUrl) => {
      try {
        // 1. Try Cloudflare Worker proxy first
        const directUrl = targetUrl.startsWith('http') ? targetUrl : `https://www.hdfilmizle.vip${targetUrl.replace(/^\/api\/hdi/, '')}`;
        const proxyUrl = `${CF_WORKER_PROXY}?url=${encodeURIComponent(directUrl)}`;
        
        let res = await fetch(proxyUrl, {
          signal: AbortSignal.timeout(4000),
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
            'Referer': 'https://www.hdfilmizle.vip/'
          }
        }).catch(() => null);

        if (!res || !res.ok) {
          res = await fetch(targetUrl, {
            signal: AbortSignal.timeout(4000),
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'Referer': 'https://www.hdfilmizle.vip/'
            }
          }).catch(() => null);
        }

        if (!res || !res.ok) return null;
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

    // 1. Check for parts JSON: let parts = [{id:..., name:..., lang:..., data:...}, ...]
    const partsMatch = html.match(/let\s+parts\s*=\s*(\[[\s\S]*?\]);/i);
    if (partsMatch) {
      try {
        const parts = JSON.parse(partsMatch[1]);
        for (const part of parts) {
          const lang = (part.lang || '').toLowerCase();
          const isDual = lang.includes('dual') || lang.includes('tr-en') || lang.includes('turkce') || lang === '' || lang === 'tr';
          const isTr = lang.includes('tr') || lang.includes('dublaj') || isDual;
          const isSub = lang.includes('sub') || lang.includes('altyazi') || lang.includes('en') || isDual;

          const matchesLang = isDub ? isTr : isSub;
          if (!matchesLang) continue;

          let playerUrl = '';
          if (part.data) {
            const srcMatch = part.data.match(/src=["']([^"']+)["']/i);
            if (srcMatch) playerUrl = srcMatch[1].replace(/\\/g, '');
          }

          if (playerUrl) {
            const name = part.name || (playerUrl.includes('vidrame') ? 'Vidrame' : (playerUrl.includes('closeload') ? 'Closeload' : 'HDFilmizle VIP'));
            const isHls = playerUrl.includes('.m3u8') || playerUrl.includes('.txt');
            sources.push({
              id: `hdi_${part.id || Math.random().toString(36).substring(2, 6)}`,
              name: `${name} 1080p`,
              displayName: `${name} 1080p`,
              badge: isDub ? '⚡ HDFilmizle Dublaj' : '💬 HDFilmizle Altyazı',
              url: playerUrl,
              streamUrl: playerUrl,
              isHls,
              isDirectVideo: false,
              getUrl: () => playerUrl
            });
          }
        }
      } catch (_) {}
    }

    // 2. Direct iframe data-src / src match
    const dataSrcMatch = html.match(/(?:data-src|src)=["'](https?:\/\/(?:vidrame|vidmoly|rapidame|closeload|stream|hdplayersystem)[^"']+)["']/i);
    if (dataSrcMatch && sources.length === 0) {
      const streamUrl = dataSrcMatch[1];
      const isVidrame = streamUrl.includes('vidrame');
      const isCloseload = streamUrl.includes('closeload');
      const serverName = isVidrame ? 'Vidrame Pro' : (isCloseload ? 'Closeload HD' : 'HDFilmizle 1080p');

      sources.push({
        id: `hdi_direct_${Math.random().toString(36).substring(2, 6)}`,
        name: serverName,
        displayName: serverName,
        badge: isDub ? '⚡ HDFilmizle Dublaj' : '💬 HDFilmizle Altyazı',
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
