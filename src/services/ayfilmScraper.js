/* ==========================================================================
   CinePulse Studio - AyFilm Scraper (Movie Stream Engine)
   Fetches decoded VIP embed players from ayfilm.net with STRICT Title Matching
   ========================================================================== */

const CF_WORKER_PROXY = 'https://wild-credit-e1ae.cagatayca07.workers.dev?url=';

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

async function fetchWithProxy(targetUrl, options = {}) {
  try {
    const res = await fetch(targetUrl, {
      ...options,
      signal: AbortSignal.timeout(options.timeout || 3500)
    }).catch(() => null);
    if (res && res.ok) return res;
  } catch (_) {}

  try {
    const workerUrl = `${CF_WORKER_PROXY}${encodeURIComponent(targetUrl)}`;
    const res = await fetch(workerUrl, {
      ...options,
      signal: AbortSignal.timeout(options.timeout || 3500)
    }).catch(() => null);
    if (res && res.ok) return res;
  } catch (_) {}

  return null;
}

function decodeBase64(str) {
  try {
    if (typeof atob !== 'undefined') return atob(str);
    if (typeof Buffer !== 'undefined') return Buffer.from(str, 'base64').toString('utf-8');
  } catch (_) {}
  return '';
}

function isStrictMatch(candidateSlug, querySlugs) {
  if (!candidateSlug) return false;
  const cleanCand = candidateSlug.replace(/-film-izle|-izle|-seyret/g, '');
  for (const qSlug of querySlugs) {
    if (!qSlug) continue;
    if (cleanCand === qSlug) return true;
  }
  return false;
}

export async function fetchAyfilmSources({
  type = 'movie',
  titles = [],
  title = '',
  originalTitle = '',
  year = null,
  isDub = true
}) {
  if (type !== 'movie') return [];

  const targetTitle = title || originalTitle;
  const candidateTitles = Array.from(new Set([
    targetTitle,
    originalTitle,
    ...(titles || [])
  ])).filter(Boolean);

  const querySlugs = candidateTitles.map(slugify).filter(Boolean);

  for (const query of candidateTitles) {
    try {
      const searchUrl = `https://www.ayfilm.net/arama/?s=${encodeURIComponent(query)}`;
      const res = await fetchWithProxy(searchUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      });
      if (!res) continue;
      const html = await res.text();
      if (!html || html.length < 500) continue;

      const listsIdx = html.indexOf('class="lists"');
      if (listsIdx === -1) continue;

      const restHtml = html.substring(listsIdx);
      const endListsIdx = restHtml.indexOf('id="menu-sidebar"');
      const listsHtml = endListsIdx !== -1 ? restHtml.substring(0, endListsIdx) : restHtml;

      if (listsHtml.includes('Hiç Sonuç Bulunamadı') || listsHtml.includes('sonuc-yok')) continue;

      const items = [...listsHtml.matchAll(/<div[^>]+class=["']move_k["'][^>]*>([\s\S]*?)<\/div>\s*<\/div>/gi)].map(m => m[1]);
      if (items.length === 0) continue;

      for (const itemHtml of items) {
        const linkMatch = itemHtml.match(/<a[^>]+href=["'](https:\/\/www\.ayfilm\.net\/[a-z0-9-]+(?:-film-izle|-izle|-seyret)[^"']*)["'][^>]*title=["']([^"']*)["']/i) ||
                          itemHtml.match(/<a[^>]+title=["']([^"']*)["'][^>]*href=["'](https:\/\/www\.ayfilm\.net\/[a-z0-9-]+(?:-film-izle|-izle|-seyret)[^"']*)["']/i);
        if (!linkMatch) continue;

        const targetMovieUrl = linkMatch[1].startsWith('http') ? linkMatch[1] : linkMatch[2];
        const cardTitle = linkMatch[1].startsWith('http') ? linkMatch[2] : linkMatch[1];
        
        const origMatch = itemHtml.match(/<span[^>]*class=["'][^"']*orj[^"']*["'][^>]*>(.*?)<\/span>/i);
        const origTitle = origMatch ? origMatch[1].replace(/<[^>]+>/g, '').trim() : '';
        
        const yearMatch = itemHtml.match(/<span[^>]*class=["'][^"']*year[^"']*["'][^>]*>(\d{4})<\/span>/i);
        const cardYear = yearMatch ? yearMatch[1] : null;

        const cardSlug = slugify(cardTitle);
        const origSlug = slugify(origTitle);
        const rawSlug = targetMovieUrl.replace(/https:\/\/www\.ayfilm\.net\//, '').replace(/-film-izle|-izle|-seyret|\//g, '');

        // STRICT MATCH VALIDATION: Movie title / origTitle / slug must strictly match query
        const matchesQuery = isStrictMatch(cardSlug, querySlugs) ||
                             isStrictMatch(origSlug, querySlugs) ||
                             isStrictMatch(rawSlug, querySlugs);

        if (!matchesQuery) {
          continue; // Skip unrelated movie card!
        }

        // Check if user specified a year and it conflicts significantly
        if (year && cardYear && Math.abs(parseInt(cardYear, 10) - parseInt(year, 10)) > 2) {
          continue;
        }

        const mRes = await fetchWithProxy(targetMovieUrl, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });
        if (!mRes) continue;
        const mHtml = await mRes.text();

        // Look for base64 encoded player: var ilkpartkod = '...';
        const partMatch = mHtml.match(/var\s+ilkpartkod\s*=\s*['"]([^'"]+)['"]/i);
        if (partMatch && partMatch[1]) {
          const decoded = decodeBase64(partMatch[1]);
          const srcMatch = decoded.match(/src=["']([^"']+)["']/i);
          const streamUrl = srcMatch ? srcMatch[1] : null;

          if (streamUrl && streamUrl.startsWith('http')) {
            return [
              {
                id: `ayf_${rawSlug}_${isDub ? 'dub' : 'sub'}`,
                name: `AyFilm HD`,
                displayName: `AyFilm VIP 1080p`,
                badge: isDub ? '⚡ TR Dublaj' : '💬 TR Altyazı',
                url: streamUrl,
                streamUrl: streamUrl,
                originalEmbedUrl: streamUrl,
                isHls: false,
                isDirectVideo: false,
                getUrl: () => streamUrl
              }
            ];
          }
        }
      }
    } catch (_) {}
  }

  return [];
}
