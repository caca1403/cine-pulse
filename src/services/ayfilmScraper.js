/* ==========================================================================
   CinePulse Studio - AyFilm Scraper (Movie Stream Engine)
   Fetches decoded VIP embed players from ayfilm.net
   ========================================================================== */

const CF_WORKER_PROXY = 'https://wild-credit-e1ae.cagatayca07.workers.dev?url=';

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

export async function fetchAyfilmSources({
  type = 'movie',
  titles = [],
  title = '',
  originalTitle = '',
  isDub = true
}) {
  if (type !== 'movie') return [];

  const targetTitle = title || originalTitle;
  const candidateTitles = Array.from(new Set([
    targetTitle,
    originalTitle,
    ...(titles || [])
  ])).filter(Boolean);

  for (const query of candidateTitles) {
    try {
      const searchUrl = `https://www.ayfilm.net/arama/?s=${encodeURIComponent(query)}`;
      const res = await fetchWithProxy(searchUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      });
      if (!res) continue;
      const html = await res.text();
      if (!html || html.length < 500) continue;

      const links = [...html.matchAll(/href=["'](https:\/\/www\.ayfilm\.net\/[a-z0-9-]+(?:-film-izle|-izle|-seyret)[^"']*)["']/gi)].map(m => m[1]);
      const cleanLinks = Array.from(new Set(links)).filter(l => !l.includes('tema') && !l.includes('page') && !l.includes('/kategori/'));
      if (cleanLinks.length === 0) continue;

      const targetMovieUrl = cleanLinks[0];
      const mRes = await fetchWithProxy(targetMovieUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      });
      if (!mRes) continue;
      const mHtml = await mRes.text();

      // Look for base64 encoded part: var ilkpartkod = '...';
      const partMatch = mHtml.match(/var\s+ilkpartkod\s*=\s*['"]([^'"]+)['"]/i);
      if (partMatch && partMatch[1]) {
        const decoded = decodeBase64(partMatch[1]);
        const srcMatch = decoded.match(/src=["']([^"']+)["']/i);
        const streamUrl = srcMatch ? srcMatch[1] : null;

        if (streamUrl && streamUrl.startsWith('http')) {
          const slug = targetMovieUrl.replace(/https:\/\/www\.ayfilm\.net\//, '').replace(/\//g, '');
          return [
            {
              id: `ayf_${slug}_${isDub ? 'dub' : 'sub'}`,
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
    } catch (_) {}
  }

  return [];
}
