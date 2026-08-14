/* ==========================================================================
   CinePulse Studio - Filmizle.now Scraper (Now Stream / Vidmixi)
   Fetches ultra-fast 1080p Vidmixi stream sources directly from filmizle.now
   ========================================================================== */

const CF_WORKER_PROXY = 'https://wild-credit-e1ae.cagatayca07.workers.dev';

function toTurkishSlug(title) {
  if (!title) return '';
  const cleanStr = title.replace(/\s*\(\d{4}\).*/, '').trim();
  return cleanStr
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

export async function fetchFilmizleNowSources({
  type = 'movie',
  seriesTitle = '',
  title = '',
  originalTitle = '',
  season = 1,
  episode = 1,
  isDub = true
}) {
  const targetTitle = seriesTitle || title;
  const isMovie = type === 'movie';
  if (!targetTitle) return [];

  const candidateTitles = [targetTitle];
  if (originalTitle && originalTitle !== targetTitle) {
    candidateTitles.push(originalTitle);
  }

  const candidateSlugs = [];
  candidateTitles.forEach(t => {
    const slug = toTurkishSlug(t);
    if (slug) {
      if (!candidateSlugs.includes(slug)) candidateSlugs.push(slug);
      if (slug.startsWith('the-')) {
        const noThe = slug.replace(/^the-/, '');
        if (!candidateSlugs.includes(noThe)) candidateSlugs.push(noThe);
      }
    }
  });

  const baseDomain = 'https://filmizle.now';
  const targetPaths = [];

  for (const slug of candidateSlugs) {
    if (isMovie) {
      targetPaths.push(`/film/${slug}`);
    } else {
      targetPaths.push(`/dizi/${slug}/${season}-sezon-${episode}-bolum`, `/dizi/${slug}/sezon-${season}-bolum-${episode}`);
    }
  }

  for (const path of targetPaths) {
    try {
      const fullUrl = `${baseDomain}${path}`;
      const proxyUrl = typeof window !== 'undefined'
        ? `/api/fin${path}`
        : `${CF_WORKER_PROXY}?url=${encodeURIComponent(fullUrl)}`;

      const res = await fetch(proxyUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Referer': 'https://filmizle.now/'
        },
        signal: AbortSignal.timeout(2200)
      }).catch(() => null);

      if (!res || !res.ok) continue;
      const html = await res.text();

      // Check for Vidmixi items in Alpine.js bxMatch
      const bxMatch = html.match(/x-data="bx\(JSON\.parse\('([^']+)'\)\)"/i);
      if (bxMatch) {
        const rawJson = bxMatch[1].replace(/\\u0022/g, '"');
        const items = JSON.parse(rawJson);
        if (items && items.length > 0) {
          const item = items[0];
          if (item && item.s) {
            const vidmixiUrl = `https://vidmixi.com/e/${item.s}`;
            return [
              {
                id: `fin_vidmixi_${isDub ? 'dub' : 'sub'}_${season}_${episode}`,
                name: `Now Stream (${isDub ? 'Dublaj' : 'Altyazılı'})`,
                badge: '⚡ Now Stream',
                category: isDub ? 'dubbed' : 'subtitled',
                url: vidmixiUrl,
                streamUrl: vidmixiUrl,
                getUrl: () => vidmixiUrl
              }
            ];
          }
        }
      }

      // Check for direct iframe src
      const iframes = [...html.matchAll(/<iframe[^>]*(?:data-src|src)="([^"]+)"/gi)].map(m => m[1]);
      const validIframe = iframes.find(u => u.includes('vidmixi') || u.includes('embed') || u.includes('player'));
      if (validIframe) {
        return [
          {
            id: `fin_iframe_${isDub ? 'dub' : 'sub'}_${season}_${episode}`,
            name: `Now Stream (${isDub ? 'Dublaj' : 'Altyazılı'})`,
            badge: '⚡ Now Stream',
            category: isDub ? 'dubbed' : 'subtitled',
            url: validIframe,
            streamUrl: validIframe,
            getUrl: () => validIframe
          }
        ];
      }
    } catch (_) {
      continue;
    }
  }

  return [];
}
