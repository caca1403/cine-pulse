/* ==========================================================================
   CinePulse Studio - Filmizle.now Scraper
   Fetches 1080p Vidmixi stream sources from https://filmizle.now
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
        // Search dynamically
        const searchRes = await fetch(`${baseRoute}/arama?q=${encodeURIComponent(query)}`).catch(() => null);
        if (searchRes && searchRes.ok) {
          const sHtml = await searchRes.text();
          const allHrefs = [...sHtml.matchAll(/href="([^"]*(?:film|dizi)[^"]*)"/gi)].map(m => m[1]);
          const normQuery = normalizeTitle(query);

          for (const h of allHrefs) {
            if (h.includes('/arama') || h.includes('/diziler') || h.includes('/kesfet') || h.includes('/seri-filmler') || h.includes('/yil/')) continue;
            const slugPart = h.split('/').pop();
            const normSlug = normalizeTitle(slugPart.replace(/-/g, ' '));
            if (normSlug === normQuery || normSlug.includes(normQuery) || normQuery.includes(normSlug)) {
              const cleanHref = h.replace(/^https?:\/\/(?:www\.)?filmizle\.now/, '');
              targetPath = type === 'tv'
                ? `${cleanHref}/${season}-sezon-${episode}-bolum`
                : cleanHref;
              break;
            }
          }

          if (!targetPath) {
            const firstValid = allHrefs.find(h => 
              (type === 'tv' ? h.includes('/dizi/') : h.includes('/film/')) &&
              !h.includes('/arama') && !h.includes('/diziler') && !h.includes('/kesfet') && !h.includes('/seri-filmler') && !h.includes('/yil/')
            );
            if (firstValid) {
              const cleanHref = firstValid.replace(/^https?:\/\/(?:www\.)?filmizle\.now/, '');
              targetPath = type === 'tv'
                ? `${cleanHref}/${season}-sezon-${episode}-bolum`
                : cleanHref;
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
        try {
          const postBody = new URLSearchParams({ i: item.i, s: item.s });
          const pxRes = await fetch(`${baseRoute}/px`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
              'X-Requested-With': 'XMLHttpRequest',
              'X-CSRF-TOKEN': csrfToken || '',
              'Accept': 'application/json'
            },
            body: postBody.toString()
          });

          if (pxRes.ok) {
            const json = await pxRes.json();
            if (json && json.u) {
              const finalStreamUrl = isBrowser
                ? json.u.replace(/^https?:\/\/vidmixi\.com/, '/api/vidmixi')
                : json.u;

              results.push({
                id: `fin_${item.i}`,
                name: `Now Stream (${isDub ? 'Dublaj' : 'Altyazılı'} 1080p)`,
                badge: '⚡ Now 1080p',
                category: isDub ? 'dubbed' : 'subtitled',
                streamUrl: finalStreamUrl,
                url: finalStreamUrl,
                getUrl: () => finalStreamUrl
              });
            }
          }
        } catch (e) {}
      }

      if (results.length > 0) {
        return results;
      }
    } catch (err) {
      console.warn('[FilmizleNowScraper] Error:', err.message);
    }
  }

  return [];
}
