/* ==========================================================================
   CinePulse Studio - DMAX & TLC Official Documentary & Program Scraper
   Fetches 1080p / 720p Turkish Dubbed streams directly from DMAX & TLC Turkey
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

async function verifyPageAndExtractStream(targetUrl) {
  try {
    const proxyUrl = `${CF_WORKER_PROXY}?url=${encodeURIComponent(targetUrl)}`;
    const res = await fetch(proxyUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    }).catch(() => null);

    if (!res || !res.ok) return null;

    const html = await res.text();
    if (!html || html.length < 1500) return null;

    const lowerHtml = html.toLowerCase();

    // Geo-block detection — skip pages with Turkey-only restriction
    if (
      lowerHtml.includes('sadece türkiye') ||
      lowerHtml.includes('sadece turkiye') ||
      lowerHtml.includes('uluslararası yayın hakları') ||
      lowerHtml.includes('uluslararasi yayin haklari')
    ) {
      return null;
    }

    if (
      lowerHtml.includes('sayfa bulunamadı') ||
      lowerHtml.includes('404 not found') ||
      lowerHtml.includes('böyle bir içerik bulunmuyor')
    ) {
      return null;
    }

    // Check for video player presence on DMAX / TLC
    const hasPlayer = 
      html.includes('video-player') ||
      html.includes('data-video') ||
      html.includes('brightcove') ||
      html.includes('player') ||
      html.includes('.m3u8') ||
      html.includes('<video') ||
      html.includes('embed');

    if (!hasPlayer) return null;

    // Check if direct m3u8 is embedded in script tags
    const m3u8Match = html.match(/(https?:\/\/[^"'\s\\]+?\.m3u8[^"'\s\\]*)/i);
    const directM3u8 = m3u8Match ? m3u8Match[1].replace(/\\u0026/g, '&') : null;

    return {
      streamUrl: directM3u8 || targetUrl,
      isDirectHls: !!directM3u8
    };
  } catch (err) {
    return null;
  }
}

async function searchChannelPrograms(channelDomain, query, season, episode) {
  try {
    const searchUrl = `https://${channelDomain}/arama?sorgu=${encodeURIComponent(query)}`;
    const proxyUrl = `${CF_WORKER_PROXY}?url=${encodeURIComponent(searchUrl)}`;
    const res = await fetch(proxyUrl).catch(() => null);
    if (!res || !res.ok) return null;

    const html = await res.text();
    if (!html || html.length < 1000) return null;

    // Match links like /program-slug/1-sezon-1-bolum or /program-slug
    const linkRegex = new RegExp(`href=["']\\/([a-z0-9-]+(?:\\/${season}-sezon-${episode}-bolum)?)["']`, 'gi');
    const matchedLinks = [];
    let match;
    while ((match = linkRegex.exec(html)) !== null) {
      const path = match[1];
      if (
        !path.includes('arama') &&
        !path.includes('canli-izle') &&
        !path.includes('yayin-akisi') &&
        !path.includes('blog') &&
        !path.includes('kesfet')
      ) {
        matchedLinks.push(path);
      }
    }

    if (matchedLinks.length > 0) {
      const topSlug = matchedLinks[0].split('/')[0];
      return `https://${channelDomain}/${topSlug}/${season}-sezon-${episode}-bolum`;
    }
  } catch (e) {
    // Ignore search errors
  }
  return null;
}

export async function fetchDmaxTlcSources({
  type = 'tv',
  titles = [],
  seriesTitle = '',
  title = '',
  originalTitle = '',
  season = 1,
  episode = 1
}) {
  const targetTitles = [...new Set([
    ...titles,
    seriesTitle,
    title,
    originalTitle
  ])].filter(t => t && typeof t === 'string' && t.trim().length > 1);

  if (targetTitles.length === 0) return [];

  const streams = [];

  for (const rawTitle of targetTitles) {
    const slug = toTurkishSlug(rawTitle);
    if (!slug) continue;

    // 1. Try DMAX Turkey
    const dmaxDirectUrl = type === 'movie'
      ? `https://www.dmax.com.tr/${slug}`
      : `https://www.dmax.com.tr/${slug}/${season}-sezon-${episode}-bolum`;

    let dmaxResult = await verifyPageAndExtractStream(dmaxDirectUrl);

    if (!dmaxResult) {
      const searchDmaxUrl = await searchChannelPrograms('www.dmax.com.tr', rawTitle, season, episode);
      if (searchDmaxUrl) {
        dmaxResult = await verifyPageAndExtractStream(searchDmaxUrl);
      }
    }

    if (dmaxResult) {
      streams.push({
        id: `dmax_${slug}_${season}_${episode}`,
        name: `DMAX TV (Dublaj HD)`,
        badge: '🔴 DMAX',
        category: 'dubbed',
        isHls: dmaxResult.isDirectHls,
        isDirectVideo: dmaxResult.isDirectHls,
        streamUrl: dmaxResult.streamUrl,
        url: dmaxResult.streamUrl,
        getUrl: () => dmaxResult.streamUrl
      });
      break; // Found on DMAX
    }

    // 2. Try TLC Turkey
    const tlcDirectUrl = type === 'movie'
      ? `https://www.tlctv.com.tr/${slug}`
      : `https://www.tlctv.com.tr/${slug}/${season}-sezon-${episode}-bolum`;

    let tlcResult = await verifyPageAndExtractStream(tlcDirectUrl);

    if (!tlcResult) {
      const searchTlcUrl = await searchChannelPrograms('www.tlctv.com.tr', rawTitle, season, episode);
      if (searchTlcUrl) {
        tlcResult = await verifyPageAndExtractStream(searchTlcUrl);
      }
    }

    if (tlcResult) {
      streams.push({
        id: `tlc_${slug}_${season}_${episode}`,
        name: `TLC TV (Dublaj HD)`,
        badge: '🟣 TLC',
        category: 'dubbed',
        isHls: tlcResult.isDirectHls,
        isDirectVideo: tlcResult.isDirectHls,
        streamUrl: tlcResult.streamUrl,
        url: tlcResult.streamUrl,
        getUrl: () => tlcResult.streamUrl
      });
      break; // Found on TLC
    }
  }

  return streams;
}
