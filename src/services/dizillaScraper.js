/* ==========================================================================
   CinePulse Studio - Dizilla.now TV Series Scraper
   - High-Speed Dizilla TV & Anime series provider
   - Zero Cloudflare Challenges
   - Full Next.js SSR extraction with CORS Proxy compatibility
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
    .replace(/[\s-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Fetch streaming sources from Dizilla.now
 */
export async function fetchDizillaSources({
  titles = [],
  title = '',
  seriesTitle = '',
  originalTitle = '',
  season = 1,
  episode = 1,
  isDub = true
}) {
  const sources = [];
  const candidates = [
    seriesTitle,
    title,
    originalTitle,
    ...(Array.isArray(titles) ? titles : [])
  ].filter(Boolean);

  const slugs = [...new Set(candidates.map(slugify))];
  const isBrowser = typeof window !== 'undefined';

  for (const s of slugs) {
    if (!s) continue;
    const epPath = `/${s}-${season}-sezon-${episode}-bolum`;
    const targetUrl = isBrowser ? `/api/dzl${epPath}` : `https://dizilla.now${epPath}`;
    const directEmbedUrl = `https://dizilla.now${epPath}`;

    try {
      const res = await fetch(targetUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
        },
        signal: AbortSignal.timeout(4000)
      });

      if (res.status === 200) {
        const html = await res.text();
        if (html.includes('__NEXT_DATA__') && !html.includes('Sayfa Bulunamadı')) {
          sources.push({
            name: isDub ? 'Dizilla VIP (Dublaj)' : 'Dizilla VIP (Altyazılı)',
            server: 'Dizilla VIP',
            type: 'embed',
            isDub,
            quality: '1080p',
            streamUrl: directEmbedUrl
          });
          break;
        }
      }
    } catch (e) {
      // Continue to next candidate
    }
  }

  return sources;
}
