/* ==========================================================================
   CinePulse Studio - Filmizle.now Scraper
   Fetches 1080p Vidmixi stream sources from https://filmizle.now
   Strict bidirectional whole-title matching to prevent wrong movie playback.
   ========================================================================== */

function normalizeTitle(title) {
  if (!title) return '';
  return title
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

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

function isTitleSimilar(target, candidate) {
  const normT = normalizeTitle(target).replace(/^the\s+/, '');
  const normC = normalizeTitle(candidate).replace(/^the\s+/, '');
  if (normT === normC) return true;

  const tWords = normT.split(' ').filter(w => w.length > 0);
  const cWords = normC.split(' ').filter(w => w.length > 0);

  const matched = tWords.filter(w => cWords.includes(w)).length;
  const maxLen = Math.max(tWords.length, cWords.length, 1);
  const ratio = matched / maxLen;

  return ratio >= 0.85;
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
  const rawTitle = seriesTitle || title;
  if (!rawTitle && !originalTitle) return [];

  const candidateTitles = [rawTitle];
  if (originalTitle && originalTitle !== rawTitle) {
    candidateTitles.push(originalTitle);
  }

  const isBrowser = typeof window !== 'undefined';
  const baseRoute = isBrowser ? '/api/fin' : 'http://localhost:3000/api/fin';

  for (const query of candidateTitles) {
    try {
      let targetPath = null;
      const cleanSlug = toTurkishSlug(query);
      const directPath = type === 'tv'
        ? `/dizi/${cleanSlug}/${season}-sezon-${episode}-bolum`
        : `/film/${cleanSlug}`;

      // First check direct slug
      let directRes = await fetch(`${baseRoute}${directPath}`).catch(() => null);
      if (directRes && directRes.ok) {
        targetPath = directPath;
      } else {
        // Search dynamically with strict bidirectional validation
        const searchRes = await fetch(`${baseRoute}/arama?q=${encodeURIComponent(query)}`).catch(() => null);
        if (searchRes && searchRes.ok) {
          const sHtml = await searchRes.text();
          const allHrefs = [...sHtml.matchAll(/href="([^"]*(?:film|dizi)[^"]*)"/gi)].map(m => m[1]);

          for (const h of allHrefs) {
            if (h.includes('/arama') || h.includes('/diziler') || h.includes('/kesfet') || h.includes('/seri-filmler') || h.includes('/yil/')) continue;
            const slugPart = h.split('/').pop();
            const candName = slugPart.replace(/-/g, ' ');
            if (isTitleSimilar(query, candName)) {
              const cleanHref = h.replace(/^https?:\/\/(?:www\.)?filmizle\.now/, '');
              targetPath = type === 'tv'
                ? `${cleanHref}/${season}-sezon-${episode}-bolum`
                : cleanHref;
              break;
            }
          }
        }
      }

      if (!targetPath) continue;

      const pageRes = await fetch(`${baseRoute}${targetPath}`);
      if (!pageRes.ok) continue;

      const html = await pageRes.text();
      const csrfToken = html.match(/<meta name="csrf-token" content="([^"]+)"/i)?.[1];
      const bxMatch = html.match(/x-data="bx\(JSON\.parse\('([^']+)'\)\)"/i);
      if (!bxMatch) continue;

      const rawJson = bxMatch[1].replace(/\\u0022/g, '"');
      const items = JSON.parse(rawJson);
      if (!items || items.length === 0) continue;

      const results = [];
      for (const item of items) {
        const isItemDub = item.type === 'dubbed' || item.title?.toLowerCase().includes('dublaj');
        if (isDub !== isItemDub) continue;

        const bodyData = new URLSearchParams({
          action: 'get_video',
          video_id: item.id
        });

        const videoRes = await fetch(`${baseRoute}/ajax/player`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-CSRF-TOKEN': csrfToken || '',
            'X-Requested-With': 'XMLHttpRequest'
          },
          body: bodyData.toString()
        }).catch(() => null);

        if (!videoRes || !videoRes.ok) continue;
        const videoJson = await videoRes.json().catch(() => null);
        if (!videoJson || !videoJson.url) continue;

        let finalUrl = videoJson.url;
        if (finalUrl.startsWith('//')) finalUrl = 'https:' + finalUrl;

        results.push({
          id: `fin_${item.id}`,
          name: `${item.title || 'Vidmixi Stream'} (${isDub ? 'Dublaj' : 'Altyazılı'} 1080p)`,
          badge: isDub ? '⚡ 1080p Dublaj' : '💬 1080p Altyazılı',
          category: isDub ? 'dubbed' : 'subtitled',
          streamUrl: finalUrl,
          url: finalUrl,
          getUrl: () => finalUrl
        });
      }

      if (results.length > 0) return results;
    } catch (e) {
      console.warn('[FilmizleNowScraper] Error:', e);
    }
  }

  return [];
}
