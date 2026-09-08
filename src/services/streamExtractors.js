/* ==========================================================================
   CinePulse Studio - Direct Stream Extractors (Ad-Free Engine)
   Extracts pure HLS (.m3u8) streams from VidMoly, Alpha Stream (ag2m4), and other embeds
   Bypasses all gambling ads, preroll video ads (kralbet/marsbet), popups, and VAST ads.
   ========================================================================== */

const CF_WORKER_PROXY = 'https://wild-credit-e1ae.cagatayca07.workers.dev';

async function fetchWithProxy(targetUrl, options = {}) {
  const isBrowser = typeof window !== 'undefined';
  const localProxyUrl = isBrowser
    ? `/api/proxy?url=${encodeURIComponent(targetUrl)}`
    : `http://localhost:4000/proxy?url=${encodeURIComponent(targetUrl)}`;

  // 1. Try local proxy first (instant, bypasses browser CORS)
  try {
    const res = await fetch(localProxyUrl, {
      ...options,
      signal: AbortSignal.timeout(options.timeout || 3500)
    }).catch(() => null);
    if (res && res.ok) return res;
  } catch (_) {}

  // 2. Try direct fetch (for Node.js)
  try {
    const res = await fetch(targetUrl, {
      ...options,
      signal: AbortSignal.timeout(options.timeout || 3500)
    }).catch(() => null);
    if (res && res.ok) return res;
  } catch (_) {}

  // 3. Try CF Worker proxy fallback
  try {
    const workerUrl = `${CF_WORKER_PROXY}?url=${encodeURIComponent(targetUrl)}`;
    const res = await fetch(workerUrl, {
      ...options,
      signal: AbortSignal.timeout(options.timeout || 3500)
    }).catch(() => null);
    if (res && res.ok) return res;
  } catch (_) {}

  return null;
}

/**
 * Extracts pure master.m3u8 from VidMoly (vidmoly.net / vidmoly.to / vidmoly.me)
 */
export async function extractVidmolyStream(embedUrl) {
  if (!embedUrl || typeof embedUrl !== 'string') return null;

  try {
    let cleanUrl = embedUrl;
    if (cleanUrl.startsWith('//')) cleanUrl = `https:${cleanUrl}`;
    if (!cleanUrl.startsWith('http')) cleanUrl = `https://${cleanUrl}`;

    const res = await fetchWithProxy(cleanUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Referer': 'https://vidmoly.net/'
      },
      timeout: 4000
    });

    if (!res) return null;
    const html = await res.text();
    if (!html) return null;

    // 1. Match m3u8 direct URLs from sources block
    const sourcesMatch = html.match(/sources\s*:\s*\[([\s\S]*?)\]/i);
    let m3u8Url = null;

    if (sourcesMatch) {
      const fileMatch = sourcesMatch[1].match(/file\s*:\s*["']([^"']+\.m3u8[^"']*)["']/i);
      if (fileMatch) m3u8Url = fileMatch[1];
    }

    if (!m3u8Url) {
      const genericM3u8 = html.match(/https?:\/\/[^"'\s<>]+\.m3u8[^"'\s<>]*/i);
      if (genericM3u8) m3u8Url = genericM3u8[0];
    }

    if (m3u8Url) {
      if (m3u8Url.startsWith('//')) m3u8Url = `https:${m3u8Url}`;
      return {
        url: m3u8Url,
        streamUrl: m3u8Url,
        isHls: true,
        isDirectVideo: true,
        type: 'hls'
      };
    }
  } catch (err) {
    console.warn('[StreamExtractors] Vidmoly extraction error:', err);
  }

  return null;
}

/**
 * Extracts pure master.m3u8 and subtitles from Alpha Stream (ag2m4 / agcdn / liderfilm)
 * Bypasses preroll ads (kralbet.mp4, marsbet.mp4) and cookie trackers completely.
 */
export async function extractAlphaStream(embedUrl) {
  if (!embedUrl || typeof embedUrl !== 'string') return null;

  try {
    let cleanUrl = embedUrl;
    if (cleanUrl.startsWith('//')) cleanUrl = `https:${cleanUrl}`;
    if (!cleanUrl.startsWith('http')) cleanUrl = `https://${cleanUrl}`;

    const hostMatch = cleanUrl.match(/^https?:\/\/([^/]+)/i);
    const host = hostMatch ? hostMatch[1] : 'x.ag2m4.cfd';
    const origin = `https://${host}`;

    const res = await fetchWithProxy(cleanUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Referer': 'https://dizibal.org/'
      },
      timeout: 4500
    });

    if (!res) return null;
    const html = await res.text();
    if (!html) return null;

    // Look for /dl?op=get_stream&view_id=...&hash=...
    const dlMatch = html.match(/fetch\(['"](\/dl\?op=get_stream[^'"]+)['"]\)/i);
    if (!dlMatch) return null;

    const dlEndpoint = `${origin}${dlMatch[1]}`;
    const dlRes = await fetchWithProxy(dlEndpoint, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Referer': cleanUrl,
        'Origin': origin,
        'Accept': '*/*'
      },
      timeout: 4500
    });

    if (!dlRes) return null;
    const dlJson = await dlRes.json().catch(() => null);
    if (!dlJson || !dlJson.url) return null;

    let m3u8Url = dlJson.url;
    if (m3u8Url.startsWith('//')) m3u8Url = `https:${m3u8Url}`;

    // IMPORTANT: uk-traffic CDN rejects requests that lack Referer: https://x.ag2m4.cfd/.
    // Routing through /api/hls_proxy with ref=https://x.ag2m4.cfd/ rewrites all playlists & .ts segments
    // with proper CORS headers so HTML5 player plays smoothly without 403 Forbidden.
    const isBrowser = typeof window !== 'undefined';
    const proxiedStreamUrl = isBrowser
      ? `/api/hls_proxy?url=${encodeURIComponent(m3u8Url)}&ref=${encodeURIComponent(origin + '/')}`
      : m3u8Url;

    // Extract subtitles from HTML if available
    const subMatch = html.match(/["']?subtitle["']?\s*:\s*["']([^"']+)["']/i);
    const subtitles = [];
    if (subMatch && subMatch[1]) {
      const parts = subMatch[1].split(',');
      for (const p of parts) {
        const langMatch = p.match(/\[(.*?)\](.*)/);
        if (langMatch) {
          subtitles.push({
            label: langMatch[1],
            src: langMatch[2]
          });
        }
      }
    }

    return {
      url: proxiedStreamUrl,
      streamUrl: proxiedStreamUrl,
      rawUrl: m3u8Url,
      isHls: true,
      isDirectVideo: true,
      type: 'hls',
      subtitles
    };
  } catch (err) {
    console.warn('[StreamExtractors] AlphaStream extraction error:', err);
  }

  return null;
}

/**
 * Extracts pure master.m3u8 from FilmEkseni Eksenload player (eksenload.top / vidload.top)
 */
export async function extractEksenloadStream(playerUrl) {
  if (!playerUrl || !playerUrl.includes('eksenload')) return null;
  try {
    const res = await fetchWithProxy(playerUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Referer': 'https://filmekseni.vip/'
      },
      timeout: 4500
    });
    if (!res) return null;
    const html = await res.text();
    const m3u8Match = html.match(/https?:\/\/[^"'\s<>]+\.m3u8[^"'\s<>]*/i);
    if (m3u8Match) {
      const rawM3u8 = m3u8Match[0];
      const isBrowser = typeof window !== 'undefined';
      const proxiedM3u8 = isBrowser
        ? `/api/hls_proxy?url=${encodeURIComponent(rawM3u8)}&ref=${encodeURIComponent('https://eksenload.top/')}`
        : rawM3u8;
      return {
        url: proxiedM3u8,
        streamUrl: proxiedM3u8,
        rawUrl: rawM3u8,
        isHls: true,
        isDirectVideo: true
      };
    }
  } catch (e) {
    console.warn('[StreamExtractors] Eksenload extraction error:', e);
  }
  return null;
}

/**
 * Universal resolver: checks if a URL is AlphaStream and extracts direct stream.
 */
export async function resolveDirectStream(streamObj) {
  if (!streamObj) return null;
  const url = (streamObj.url || streamObj.streamUrl || (typeof streamObj.getUrl === 'function' ? streamObj.getUrl() : '') || '').toLowerCase();

  // Alpha Stream (ag2m4 / agcdn / liderfilm)
  if (url.includes('ag2m4') || url.includes('agcdn') || url.includes('liderfilm') || (streamObj.id && streamObj.id.startsWith('dbl'))) {
    const rawUrl = streamObj.url || streamObj.streamUrl || (typeof streamObj.getUrl === 'function' ? streamObj.getUrl() : '');
    const direct = await extractAlphaStream(rawUrl);
    if (direct && direct.url) {
      return {
        ...streamObj,
        isHls: true,
        isDirectVideo: true,
        originalEmbedUrl: rawUrl,
        streamUrl: direct.url,
        url: direct.url,
        subtitles: direct.subtitles,
        getUrl: () => direct.url
      };
    }
  }

  return streamObj;
}
