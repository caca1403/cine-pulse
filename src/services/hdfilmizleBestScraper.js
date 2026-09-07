/* ==========================================================================
   CinePulse Studio - HDFilmizle.best Scraper (Movies & Series Engine)
   Direct Native Master.m3u8 Streams & Multi-Language Subtitles
   Searches via REST /wp-json/ and fetches /ajax/videosrc/ & /ajax/master/
   ========================================================================== */

const BASE_URL = 'https://www.hdfilmizle.best';

function normalizeTitle(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .trim()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]/g, '');
}

async function fetchSafe(targetUrl, options = {}) {
  try {
    const res = await fetch(targetUrl, {
      ...options,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/html, */*',
        ...(options.headers || {})
      },
      signal: AbortSignal.timeout(options.timeout || 4500)
    }).catch(() => null);

    if (res && res.ok) return res;
  } catch (_) {}

  return null;
}

/**
 * Searches HDFilmizle.best for movies via WP REST API
 */
export async function searchHdfBest(query, isSeries = false) {
  if (!query || typeof query !== 'string' || query.trim().length < 2) return [];

  try {
    const endpoint = isSeries ? 'dizi' : 'film';
    const searchUrl = `${BASE_URL}/wp-json/wp/v2/${endpoint}?search=${encodeURIComponent(query.trim())}`;
    const res = await fetchSafe(searchUrl);
    if (!res) return [];

    const items = await res.json().catch(() => []);
    if (!Array.isArray(items)) return [];

    return items.map(item => ({
      id: item.id,
      title: item.title?.rendered || '',
      link: item.link || '',
      slug: item.slug || ''
    }));
  } catch (_) {
    return [];
  }
}

/**
 * Extracts streams for a Movie on HDFilmizle.best
 */
export async function fetchHdfBestMovieSources({
  titles = [],
  title = '',
  originalTitle = '',
  isDub = true
}) {
  const candidateTitles = [...new Set([...titles, title, originalTitle])].filter(t => t && typeof t === 'string' && t.trim().length > 1);
  if (candidateTitles.length === 0) return [];

  for (const query of candidateTitles) {
    const searchResults = await searchHdfBest(query, false);
    if (searchResults.length === 0) continue;

    const normQ = normalizeTitle(query);
    const matched = searchResults.find(r => {
      const normR = normalizeTitle(r.title);
      return normR === normQ || normR.includes(normQ) || normQ.includes(normR);
    }) || searchResults[0];

    if (matched) {
      try {
        const filmPageRes = await fetchSafe(matched.link);
        if (!filmPageRes) continue;

        const html = await filmPageRes.text();
        const nonceMatch = html.match(/_hdfNonce_\s*=\s*["']([^"']+)["']/i);
        const nonce = nonceMatch ? nonceMatch[1] : '';

        const langParam = isDub ? 'tr' : 'en';
        const videosrcUrl = `${BASE_URL}/ajax/videosrc/?id=${matched.id}&lang=${langParam}&mr=0`;
        const vRes = await fetchSafe(videosrcUrl, {
          headers: {
            'Referer': matched.link,
            'X-HDF-Nonce': nonce,
            'X-Requested-With': 'XMLHttpRequest'
          }
        });

        if (!vRes) continue;
        const videoData = await vRes.json().catch(() => null);
        if (!videoData || !videoData.src) continue;

        const rawMasterUrl = videoData.src;
        // Use HLS proxy to bypass Referer check on segments and playlists
        const isBrowser = typeof window !== 'undefined';
        const streamUrl = isBrowser
          ? `/api/hls_proxy?url=${encodeURIComponent(rawMasterUrl)}&ref=${encodeURIComponent(matched.link)}`
          : rawMasterUrl;

        // Extract subtitles
        const subtitles = [];
        if (Array.isArray(videoData.tracks)) {
          for (const tr of videoData.tracks) {
            if (tr.src && tr.label) {
              const subUrl = isBrowser
                ? `/api/hls_proxy?url=${encodeURIComponent(tr.src)}&ref=${encodeURIComponent(matched.link)}`
                : tr.src;
              subtitles.push({
                label: tr.label,
                src: subUrl,
                srclang: tr.srclang || 'tr'
              });
            }
          }
        }

        return [
          {
            id: `hdfb_mov_${matched.id}_${isDub ? 'dub' : 'sub'}`,
            name: isDub ? 'HDF Dublaj 1080p' : 'HDF Altyazı 1080p',
            displayName: isDub ? 'HDF Dublaj 1080p' : 'HDF Altyazı 1080p',
            badge: isDub ? '⚡ TR Dublaj' : '💬 TR Altyazı',
            source: 'HDFilmizle',
            url: streamUrl,
            streamUrl: streamUrl,
            quality: '1080p',
            isHls: true,
            isDirectVideo: true,
            type: 'hls',
            subtitles,
            isDub,
            getUrl: () => streamUrl
          }
        ];
      } catch (_) {}
    }
  }

  return [];
}
