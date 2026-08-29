/* ==========================================================================
   CinePulse Studio - DMAX & TLC Official Documentary & Program Scraper
   Fetches 1080p / 720p Turkish Dubbed streams strictly from DMAX & TLC Turkey
   Strict matching to ensure DMAX/TLC only appears on actual DMAX/TLC content.
   ========================================================================== */

const CF_WORKER_PROXY = 'https://wild-credit-e1ae.cagatayca07.workers.dev';

function toTurkishSlug(title) {
  if (!title) return '';
  return title
    .replace(/\s*\(\d{4}\).*/, '')
    .replace(/[:.,!?'"()]/g, '')
    .replace(/İ/g, 'i')
    .replace(/I/g, 'i')
    .replace(/Ğ/g, 'g')
    .replace(/Ü/g, 'u')
    .replace(/Ş/g, 's')
    .replace(/Ö/g, 'o')
    .replace(/Ç/g, 'c')
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

function normalizeTitle(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/ğ/g, 'g')
    .replace(/ü/g, 'u')
    .replace(/ş/g, 's')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]/g, ' ')
    .trim();
}

async function verifyPageAndExtractStream(targetUrl, expectedTitle) {
  try {
    const proxyUrl = `${CF_WORKER_PROXY}?url=${encodeURIComponent(targetUrl)}`;
    const res = await fetch(proxyUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      },
      signal: AbortSignal.timeout(2500)
    }).catch(() => null);

    if (!res || !res.ok) return null;

    const html = await res.text();
    if (!html || html.length < 2000) return null;

    const lowerHtml = html.toLowerCase();

    // Check for 404 / generic SPA not-found pages
    if (
      lowerHtml.includes('sayfa bulunamadı') ||
      lowerHtml.includes('sayfa bulunamadi') ||
      lowerHtml.includes('404 not found') ||
      lowerHtml.includes('böyle bir içerik bulunmuyor') ||
      lowerHtml.includes('böyle bir sayfa yok')
    ) {
      return null;
    }

    // Verify title match in page title or h1
    const pageTitle = html.match(/<title>([^<]+)<\/title>/i)?.[1] || '';
    const normPageTitle = normalizeTitle(pageTitle);
    const normExpected = normalizeTitle(expectedTitle);

    if (!normExpected || normExpected.length < 3) return null;

    const expectedWords = normExpected.split(/\s+/).filter(w => w.length > 2);
    const matchCount = expectedWords.filter(w => normPageTitle.includes(w)).length;
    const isTitleMatched = expectedWords.length > 0 && (matchCount / expectedWords.length) >= 0.6;

    if (!isTitleMatched) {
      return null;
    }

    // Strictly check for direct m3u8 stream
    const m3u8Match = html.match(/(https?:\/\/[^"'\s\\]+?\.m3u8[^"'\s\\]*)/i);
    const directM3u8 = m3u8Match ? m3u8Match[1].replace(/\\u0026/g, '&') : null;

    if (!directM3u8) {
      return null;
    }

    return {
      streamUrl: directM3u8,
      isDirectHls: true
    };
  } catch (err) {
    return null;
  }
}

export async function fetchDmaxTlcSources({ titles = [], seriesTitle = '', title = '', originalTitle = '', season = 1, episode = 1, isDub = true }) {
  const targetTitle = seriesTitle || title;
  if (!targetTitle) return [];

  // Ignore typical Hollywood movies and Western TV series that never air on DMAX / TLC
  const normT = normalizeTitle(targetTitle);
  const skipKeywords = ['batman', 'dark knight', 'breaking bad', 'lucifer', 'avatar', 'inception', 'interstellar', 'deadpool', 'game of thrones', 'stranger things', 'spider'];
  if (skipKeywords.some(kw => normT.includes(kw))) {
    return [];
  }

  const candidateQueries = [...new Set([
    ...titles,
    seriesTitle,
    title,
    originalTitle
  ])].filter(t => t && typeof t === 'string' && t.trim().length > 2);

  const results = [];

  for (const q of candidateQueries) {
    const slug = toTurkishSlug(q);
    if (!slug) continue;

    // 1. Check DMAX
    const dmaxUrls = [
      `https://www.dmax.com.tr/${slug}/${season}-sezon-${episode}-bolum`,
      `https://www.dmax.com.tr/${slug}`
    ];

    for (const u of dmaxUrls) {
      const data = await verifyPageAndExtractStream(u, q);
      if (data) {
        results.push({
          id: `dmax_${slug}_s${season}_e${episode}`,
          name: `DMAX (Resmi Dublaj)`,
          displayName: `DMAX`,
          badge: '🌿 DMAX',
          category: 'dubbed',
          isHls: data.isDirectHls,
          isDirectVideo: data.isDirectHls,
          streamUrl: data.streamUrl,
          url: data.streamUrl,
          getUrl: () => data.streamUrl
        });
        break;
      }
    }

    // 2. Check TLC
    const tlcUrls = [
      `https://www.tlctv.com.tr/${slug}/${season}-sezon-${episode}-bolum`,
      `https://www.tlctv.com.tr/${slug}`
    ];

    for (const u of tlcUrls) {
      const data = await verifyPageAndExtractStream(u, q);
      if (data) {
        results.push({
          id: `tlc_${slug}_s${season}_e${episode}`,
          name: `TLC (Resmi Dublaj)`,
          displayName: `TLC`,
          badge: '🌿 TLC',
          category: 'dubbed',
          isHls: data.isDirectHls,
          isDirectVideo: data.isDirectHls,
          streamUrl: data.streamUrl,
          url: data.streamUrl,
          getUrl: () => data.streamUrl
        });
        break;
      }
    }

    if (results.length > 0) break;
  }

  return results;
}
