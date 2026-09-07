/* ==========================================================================
   CinePulse Studio - DramaDizilerim Scraper (Kısa Dizi / Short Drama VIP)
   Extracts Turkish Dubbed & Subtitled Short Dramas (FlexTV, NetShort, ShortMax, etc.)
   Features direct MP4/HLS streams & safe iframe player fallbacks.
   ========================================================================== */

const BASE_URL = 'https://dramadizilerim.com';
const CF_WORKER_PROXY = 'https://wild-credit-e1ae.cagatayca07.workers.dev';

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

async function fetchSafe(url, options = {}) {
  // 1. Direct fetch with timeout
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        ...(options.headers || {})
      },
      signal: AbortSignal.timeout(5000)
    }).catch(() => null);

    if (res && res.ok) return res;
  } catch (_) {}

  // 2. CF Worker proxy fallback
  try {
    const workerUrl = `${CF_WORKER_PROXY}?url=${encodeURIComponent(url)}`;
    const res = await fetch(workerUrl, {
      ...options,
      signal: AbortSignal.timeout(5000)
    }).catch(() => null);

    if (res && res.ok) return res;
  } catch (_) {}

  return null;
}

/**
 * Searches DramaDizilerim for matching short drama series
 */
export async function searchDramaDizilerim(query) {
  if (!query || typeof query !== 'string' || query.trim().length < 2) return [];

  const cleanQuery = query.trim();
  const searchUrl = `${BASE_URL}/search?q=${encodeURIComponent(cleanQuery)}`;
  const res = await fetchSafe(searchUrl);
  if (!res) return [];

  const html = await res.text().catch(() => '');
  if (!html) return [];

  const results = [];
  const cardRegex = /<a[^>]+href=["'](?:https:\/\/dramadizilerim\.com)?\/dizi\/([a-zA-Z0-9_-]+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match;

  while ((match = cardRegex.exec(html)) !== null) {
    const slug = match[1];
    const inner = match[2];
    const titleMatch = inner.match(/<h[2-6][^>]*>(.*?)<\/h[2-6]>/i) || inner.match(/class=["'][^"']*title[^"']*["'][^>]*>(.*?)<\//i);
    const posterMatch = inner.match(/src=["']([^"']+)["']/i);

    const title = (titleMatch ? titleMatch[1] : slug).replace(/<[^>]+>/g, '').trim();
    const poster = posterMatch ? (posterMatch[1].startsWith('http') ? posterMatch[1] : `${BASE_URL}${posterMatch[1]}`) : '';

    if (!results.some(r => r.slug === slug)) {
      results.push({
        title,
        slug,
        poster,
        url: `${BASE_URL}/dizi/${slug}`
      });
    }
  }

  return results;
}

/**
 * Extracts episode sources for DramaDizilerim
 */
export async function fetchDramaDizilerimEpisodeSources({
  titles = [],
  seriesTitle = '',
  season = 1,
  episode = 1,
  isDub = true
}) {
  const allTitles = [...new Set([...titles, seriesTitle])].filter(t => t && typeof t === 'string' && t.trim().length > 1);
  if (allTitles.length === 0) return [];

  let matchedSlug = null;

  // 1. Check if slug matches candidate titles directly
  for (const t of allTitles) {
    const s = toTurkishSlug(t);
    const directUrl = `${BASE_URL}/izle/${s}?s=${season}&e=${episode}`;
    const headCheck = await fetchSafe(directUrl, { method: 'HEAD' });
    if (headCheck && headCheck.ok) {
      matchedSlug = s;
      break;
    }
  }

  // 2. If not found by direct slug, search by title
  if (!matchedSlug) {
    for (const t of allTitles) {
      const searchResults = await searchDramaDizilerim(t);
      if (searchResults.length > 0) {
        const normTarget = normalizeStr(t);
        const best = searchResults.find(r => {
          const normR = normalizeStr(r.title);
          return normR === normTarget || normR.includes(normTarget) || normTarget.includes(normR);
        }) || searchResults[0];

        if (best) {
          matchedSlug = best.slug;
          break;
        }
      }
    }
  }

  if (!matchedSlug) return [];

  // 3. Fetch episode watch page
  const watchUrl = `${BASE_URL}/izle/${matchedSlug}?s=${season}&e=${episode}`;
  const watchRes = await fetchSafe(watchUrl, {
    headers: { 'Referer': BASE_URL }
  });
  if (!watchRes) return [];

  const watchHtml = await watchRes.text().catch(() => '');
  if (!watchHtml) return [];

  // 4. Extract embed iframe
  const iframeMatch = watchHtml.match(/<iframe[^>]+src=["']([^"']*embed\.php[^"']*)["']/i);
  if (!iframeMatch) return [];

  let embedUrl = iframeMatch[1];
  if (!embedUrl.startsWith('http')) {
    embedUrl = `${BASE_URL}${embedUrl.startsWith('/') ? '' : '/'}${embedUrl}`;
  }

  // 5. Fetch embed player HTML
  const embedRes = await fetchSafe(embedUrl, {
    headers: { 'Referer': watchUrl }
  });
  if (!embedRes) return [];

  const embedHtml = await embedRes.text().catch(() => '');
  if (!embedHtml) return [];

  const extractedStreams = [];

  // Check 5a: Direct let source = "..."
  const directSourceMatch = embedHtml.match(/let\s+source\s*=\s*["']([^"']+)["']/);
  if (directSourceMatch) {
    const rawSrc = directSourceMatch[1];
    if (rawSrc && (rawSrc.startsWith('http://') || rawSrc.startsWith('https://'))) {
      const isM3U8 = rawSrc.includes('.m3u8') || rawSrc.includes('stream-m3u8');
      const isMp4 = rawSrc.includes('.mp4');

      extractedStreams.push({
        name: isM3U8 ? 'Short Drama HLS 1080p' : 'Short Drama Direct 1080p',
        source: 'DramaDizilerim',
        url: rawSrc,
        quality: '1080p',
        type: isM3U8 ? 'hls' : (isMp4 ? 'mp4' : 'direct'),
        isDub: isDub,
        headers: {
          'Referer': BASE_URL
        }
      });
    }
  }

  // Check 5b: Fallback player embed
  extractedStreams.push({
    name: 'Short Drama VIP Player',
    source: 'DramaDizilerim',
    url: embedUrl,
    quality: '1080p',
    type: 'iframe',
    isDub: isDub,
    headers: {
      'Referer': watchUrl
    }
  });

  return extractedStreams;
}
