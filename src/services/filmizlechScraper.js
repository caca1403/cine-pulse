/* ==========================================================================
   CinePulse Studio - Filmizlech Scraper (Movies & Series Engine)
   Fetches VIP stream tokens from filmizlech.org
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

export async function fetchFilmizlechSources({
  type = 'movie',
  titles = [],
  title = '',
  seriesTitle = '',
  originalTitle = '',
  season = 1,
  episode = 1,
  isDub = true
}) {
  const isMovie = type === 'movie';
  const targetTitle = seriesTitle || title;
  const candidateTitles = Array.from(new Set([
    targetTitle,
    originalTitle,
    ...(titles || [])
  ])).filter(Boolean);

  for (const query of candidateTitles) {
    try {
      const searchUrl = `https://filmizlech.org/arama?q=${encodeURIComponent(query)}`;
      const res = await fetchWithProxy(searchUrl, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      });
      if (!res) continue;
      const html = await res.text();
      if (!html || html.length < 500) continue;

      if (isMovie) {
        // Look for /film/{slug}
        const movieLinks = [...html.matchAll(/href=["'](https:\/\/filmizlech\.org\/film\/[^"']+)["']/g)].map(m => m[1]);
        const uniqueMovies = Array.from(new Set(movieLinks));
        if (uniqueMovies.length === 0) continue;

        const targetMovieUrl = uniqueMovies[0];
        const mRes = await fetchWithProxy(targetMovieUrl, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });
        if (!mRes) continue;
        const mHtml = await mRes.text();

        const btnMatch = mHtml.match(/<button[^>]*class=["'][^"']*player-cover-btn[^"']*["'][^>]*data-pid=["']([^"']+)["'][^>]*data-ts=["']([^"']+)["'][^>]*data-sig=["']([^"']+)["']/i);
        if (btnMatch) {
          const pid = btnMatch[1];
          const ts = btnMatch[2];
          const sig = btnMatch[3];
          const tokenUrl = `https://filmizlech.org/api/player-token.php?pid=${pid}&_t=${ts}&_s=${encodeURIComponent(sig)}`;
          const tokenRes = await fetchWithProxy(tokenUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
              'Referer': targetMovieUrl
            }
          });
          if (tokenRes) {
            const data = await tokenRes.json().catch(() => null);
            if (data && data.url) {
              const streamUrl = data.url;
              return [
                {
                  id: `flm_mov_${pid}_${isDub ? 'dub' : 'sub'}`,
                  name: `FLM Stream 1080p`,
                  displayName: `FLM VIP 1080p`,
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
      } else {
        // TV Series: Look for /dizi/{slug}
        const seriesLinks = [...html.matchAll(/href=["'](https:\/\/filmizlech\.org\/dizi\/[^"']+)["']/g)].map(m => m[1]);
        const uniqueSeries = Array.from(new Set(seriesLinks)).filter(l => !l.includes('/sezon-'));
        if (uniqueSeries.length === 0) continue;

        const targetSeriesUrl = uniqueSeries[0];
        const sRes = await fetchWithProxy(targetSeriesUrl, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });
        if (!sRes) continue;
        const sHtml = await sRes.text();

        // Match episode url: /dizi/{slug}/sezon-{season}/bolum-{episode}
        const epRegex = new RegExp(`href=["'](https:\/\/filmizlech\\.org\/dizi\/[^"']+\/sezon-${season}\/bolum-${episode})["']`, 'i');
        const epMatch = sHtml.match(epRegex);
        if (!epMatch) continue;

        const epUrl = epMatch[1];
        const epRes = await fetchWithProxy(epUrl, {
          headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
        });
        if (!epRes) continue;
        const epHtml = await epRes.text();

        const btnMatch = epHtml.match(/<button[^>]*class=["'][^"']*player-cover-btn[^"']*["'][^>]*data-pid=["']([^"']+)["'][^>]*data-ts=["']([^"']+)["'][^>]*data-sig=["']([^"']+)["']/i);
        if (btnMatch) {
          const pid = btnMatch[1];
          const ts = btnMatch[2];
          const sig = btnMatch[3];
          const tokenUrl = `https://filmizlech.org/api/player-token.php?pid=${pid}&_t=${ts}&_s=${encodeURIComponent(sig)}`;
          const tokenRes = await fetchWithProxy(tokenUrl, {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
              'Referer': epUrl
            }
          });
          if (tokenRes) {
            const data = await tokenRes.json().catch(() => null);
            if (data && data.url) {
              const streamUrl = data.url;
              return [
                {
                  id: `flm_tv_${pid}_s${season}_e${episode}_${isDub ? 'dub' : 'sub'}`,
                  name: `FLM Stream 1080p`,
                  displayName: `FLM VIP 1080p`,
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
      }
    } catch (_) {}
  }

  return [];
}
