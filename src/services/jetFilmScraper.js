/* ==========================================================================
   CinePulse Studio - JetFilm / JetFilmizle Scraper
   Direct Turkish Dubbed & Subtitled Movies & Series Provider
   Supports VIP, VidMoly, VideoPark, OK.ru, Titan players.
   Fully compatible with Browser (via Vercel proxy) & Node.js.
   ========================================================================== */

const BASE_URL = 'https://jetfilmizle.now';
const CF_WORKER_PROXY = 'https://wild-credit-e1ae.cagatayca07.workers.dev';

function normalizeStr(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]/g, '');
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

async function fetchSafe(targetUrl, options = {}) {
  const isBrowser = typeof window !== 'undefined';

  // 1. In browser, try Vercel internal proxy (/api/jet/...) to avoid CORS completely
  if (isBrowser) {
    try {
      const u = new URL(targetUrl);
      const proxyUrl = `/api/jet${u.pathname}${u.search}`;
      const res = await fetch(proxyUrl, {
        ...options,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          ...(options.headers || {})
        },
        signal: AbortSignal.timeout(options.timeout || 4500)
      }).catch(() => null);

      if (res && res.ok) {
        return res;
      }
    } catch (_) {}
  }

  // 2. Try CF Worker proxy (for GET requests)
  if (!options.method || options.method === 'GET') {
    try {
      const workerUrl = `${CF_WORKER_PROXY}?url=${encodeURIComponent(targetUrl)}`;
      const res = await fetch(workerUrl, {
        ...options,
        signal: AbortSignal.timeout(options.timeout || 4500)
      }).catch(() => null);

      if (res && res.ok) {
        return res;
      }
    } catch (_) {}
  }

  // 3. Direct fetch (Node.js or direct server requests)
  try {
    const res = await fetch(targetUrl, {
      ...options,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'X-Requested-With': 'XMLHttpRequest',
        'Referer': BASE_URL,
        'Origin': BASE_URL,
        ...(options.headers || {})
      },
      signal: AbortSignal.timeout(options.timeout || 4500)
    }).catch(() => null);

    if (res && res.ok) {
      return res;
    }
  } catch (_) {}

  return null;
}

/**
 * Searches JetFilmizle for movies or series
 */
export async function searchJetFilm(query, isSeries = false) {
  if (!query || typeof query !== 'string' || query.trim().length < 2) return [];

  const cleanQ = query.trim();
  const searchUrl = isSeries
    ? `${BASE_URL}/diziler?q=${encodeURIComponent(cleanQ)}`
    : `${BASE_URL}/arama?q=${encodeURIComponent(cleanQ)}`;

  try {
    const res = await fetchSafe(searchUrl, {
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      timeout: 4500
    });

    if (!res) return [];
    const html = await res.text();

    const results = [];
    const pattern = isSeries
      ? /<a[^>]+href=["'](https:\/\/jetfilmizle\.now\/dizi\/[^"']+)["'][^>]*title=["']([^"']+)["']/gi
      : /<a[^>]+href=["'](https:\/\/jetfilmizle\.now\/(?:film|dizi)\/[^"']+)["'][^>]*title=["']([^"']+)["']/gi;
    let match;

    while ((match = pattern.exec(html)) !== null) {
      const url = match[1];
      const rawTitle = match[2];
      const slug = url.split('/').filter(Boolean).pop();

      const title = rawTitle
        .replace(/Full.*İzle/i, '')
        .replace(/Türkçe Dublaj.*/i, '')
        .replace(/Altyazılı.*/i, '')
        .replace(/HD.*/i, '')
        .replace(/Dizisi.*/i, '')
        .trim();

      if (!results.some(r => r.url === url)) {
        results.push({
          title,
          url,
          slug,
          isSeries: isSeries || url.includes('/dizi/')
        });
      }
    }

    return results;
  } catch (_) {
    return [];
  }
}

/**
 * Extracts player streams for a Movie on JetFilmizle
 */
export async function fetchJetFilmSources({
  titles = [],
  title = '',
  originalTitle = '',
  year = null,
  isDub = true
}) {
  const allTitles = [...new Set([...titles, title, originalTitle])].filter(t => t && typeof t === 'string' && t.trim().length > 1);
  if (allTitles.length === 0) return [];

  let matchedMovieUrl = null;

  // Search candidate titles
  for (const t of allTitles) {
    const searchResults = await searchJetFilm(t, false);
    const movies = searchResults.filter(r => !r.isSeries);
    if (movies.length > 0) {
      const normT = normalizeStr(t);
      const match = movies.find(m => {
        const normM = normalizeStr(m.title);
        return normM === normT || normM.includes(normT) || normT.includes(normM);
      }) || movies[0];

      if (match) {
        matchedMovieUrl = match.url;
        break;
      }
    }
  }

  if (!matchedMovieUrl) return [];

  try {
    const res = await fetchSafe(matchedMovieUrl, {
      headers: {
        'Referer': BASE_URL
      },
      timeout: 4500
    });
    if (!res) return [];

    const html = await res.text();
    const filmIdMatch = html.match(/name=["']film_id["'][^>]*value=["'](\d+)["']/i) || html.match(/value=["'](\d+)["'][^>]*name=["']film_id["']/i);
    if (!filmIdMatch) return [];

    const filmId = filmIdMatch[1];
    const postUrl = `${BASE_URL}/jetplayer`;
    const playerType = isDub ? 'dublaj' : 'altyazili';

    const extractedSources = [];
    const sourcePromises = [];

    // Probe up to 4 sources (Vip, OPlay, OkRu, Moly)
    for (let i = 0; i < 4; i++) {
      sourcePromises.push(
        fetchSafe(postUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
            'X-Requested-With': 'XMLHttpRequest',
            'Referer': matchedMovieUrl,
            'Origin': BASE_URL
          },
          body: `film_id=${filmId}&source_index=${i}&player_type=${playerType}`,
          timeout: 4000
        })
        .then(async pRes => {
          if (!pRes) return null;
          const pText = await pRes.text();
          const iframeMatch = pText.match(/<iframe[^>]+src=['"]([^'"]+)['"]/i);
          if (!iframeMatch) return null;

          let streamUrl = iframeMatch[1];
          if (streamUrl.startsWith('//')) streamUrl = 'https:' + streamUrl;

          // Filter out trailers / placeholder youtube embeds
          if (streamUrl.includes('youtube') || streamUrl.includes('youtu.be') || streamUrl.includes('trailer')) return null;

          const isVidmoly = streamUrl.includes('vidmoly');
          const isOkru = streamUrl.includes('ok.ru');
          const isTitan = streamUrl.includes('titan');

          const name = isVidmoly 
            ? 'JetFilmizle (VidMoly 1080p)' 
            : (isOkru 
                ? 'JetFilmizle (OK.ru HD)' 
                : (isTitan ? `JetFilmizle (Titan VIP ${i + 1})` : `JetFilmizle VIP ${i + 1}`));

          return {
            id: `jet_${filmId}_${i}`,
            name,
            displayName: name,
            source: 'JetFilmizle',
            url: streamUrl,
            quality: '1080p',
            type: 'iframe',
            isDub
          };
        })
        .catch(() => null)
      );
    }

    const results = await Promise.all(sourcePromises);
    for (const r of results) {
      if (r && r.url && !extractedSources.some(s => s.url === r.url)) {
        extractedSources.push(r);
      }
    }

    return extractedSources;
  } catch (_) {
    return [];
  }
}

/**
 * Extracts player streams for a Series Episode on JetFilmizle
 */
export async function fetchJetFilmEpisodeSources({
  titles = [],
  seriesTitle = '',
  season = 1,
  episode = 1,
  isDub = true
}) {
  const allTitles = [...new Set([...titles, seriesTitle])].filter(t => t && typeof t === 'string' && t.trim().length > 1);
  if (allTitles.length === 0) return [];

  let matchedDiziUrl = null;

  // 1. Direct slug probe
  for (const t of allTitles) {
    const s = toTurkishSlug(t);
    const candidateSlugs = [s, `${s}-2025`, `${s}-2024`, `${s}-dizisi`];
    for (const c of candidateSlugs) {
      try {
        const directUrl = `${BASE_URL}/dizi/${c}`;
        const headCheck = await fetchSafe(directUrl, {
          method: 'HEAD',
          timeout: 2000
        });
        if (headCheck) {
          matchedDiziUrl = directUrl;
          break;
        }
      } catch (_) {}
    }
    if (matchedDiziUrl) break;
  }

  // 2. Search fallback
  if (!matchedDiziUrl) {
    for (const t of allTitles) {
      const searchResults = await searchJetFilm(t, true);
      const dizis = searchResults.filter(r => r.isSeries);
      if (dizis.length > 0) {
        const normT = normalizeStr(t);
        const match = dizis.find(d => {
          const normD = normalizeStr(d.title);
          return normD === normT || normD.includes(normT) || normD.includes(normD);
        }) || dizis[0];

        if (match) {
          matchedDiziUrl = match.url;
          break;
        }
      }
    }
  }

  if (!matchedDiziUrl) return [];

  try {
    const res = await fetchSafe(matchedDiziUrl, {
      headers: {
        'Referer': BASE_URL
      },
      timeout: 4500
    });
    if (!res) return [];

    const html = await res.text();
    const filmIdMatch = html.match(/name=["']film_id["'][^>]*value=["'](\d+)["']/i) || html.match(/value=["'](\d+)["'][^>]*name=["']film_id["']/i);
    if (!filmIdMatch) return [];

    const filmId = filmIdMatch[1];
    const postUrl = `${BASE_URL}/jetplayer`;
    const playerType = isDub ? 'dublaj' : 'altyazili';

    // Find the episode button matching season and episode
    const epBtnMatch = html.match(new RegExp(`data-source-index=["'](\\d+)["'][^>]*data-season=["']${season}["'][^>]*data-episode=["']${episode}["']`, 'i')) ||
                       html.match(new RegExp(`data-season=["']${season}["'][^>]*data-episode=["']${episode}["'][^>]*data-source-index=["'](\\d+)["']`, 'i'));

    const sourceIndex = epBtnMatch ? epBtnMatch[1] : (episode - 1);

    const pRes = await fetchSafe(postUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'X-Requested-With': 'XMLHttpRequest',
        'Referer': matchedDiziUrl,
        'Origin': BASE_URL
      },
      body: `film_id=${filmId}&source_index=${sourceIndex}&player_type=${playerType}`,
      timeout: 4500
    });

    if (!pRes) return [];
    const pText = await pRes.text();
    const iframeMatch = pText.match(/<iframe[^>]+src=['"]([^'"]+)['"]/i);
    if (!iframeMatch) return [];

    let streamUrl = iframeMatch[1];
    if (streamUrl.startsWith('//')) streamUrl = 'https:' + streamUrl;

    if (streamUrl.includes('youtube') || streamUrl.includes('youtu.be') || streamUrl.includes('trailer')) return [];

    const isVidmoly = streamUrl.includes('vidmoly');
    const isOkru = streamUrl.includes('ok.ru');
    const isTitan = streamUrl.includes('titan');

    const epName = isVidmoly 
      ? `JetFilmizle Dizi (VidMoly S${season}B${episode})` 
      : (isOkru 
          ? `JetFilmizle Dizi (OK.ru S${season}B${episode})` 
          : (isTitan ? `JetFilmizle Dizi (Titan S${season}B${episode})` : `JetFilmizle Dizi (VIP S${season}B${episode})`));

    return [{
      id: `jet_series_${filmId}_s${season}_e${episode}`,
      name: epName,
      displayName: epName,
      source: 'JetFilmizle',
      url: streamUrl,
      quality: '1080p',
      type: 'iframe',
      isDub
    }];
  } catch (_) {
    return [];
  }
}
