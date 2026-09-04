/* ==========================================================================
   CinePulse Studio - Direct Stream Extractors (Ad-Free Engine)
   Extracts pure HLS (.m3u8) streams from VidMoly, Alpha Stream (ag2m4), and other embeds
   Bypasses all gambling ads, preroll video ads (kralbet/marsbet), popups, and VAST ads.
   ========================================================================== */

const CF_WORKER_PROXY = 'https://wild-credit-e1ae.cagatayca07.workers.dev';

async function fetchWithProxy(targetUrl, options = {}) {
  // 1. Try direct fetch first
  try {
    const res = await fetch(targetUrl, {
      ...options,
      signal: AbortSignal.timeout(options.timeout || 3500)
    }).catch(() => null);
    if (res && res.ok) return res;
  } catch (_) {}

  // 2. Try CF Worker proxy
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
        'Referer': 'https://dizibal.com/'
      },
      timeout: 4000
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
      timeout: 4000
    });

    if (!dlRes) return null;
    const dlJson = await dlRes.json().catch(() => null);
    if (!dlJson || !dlJson.url) return null;

    let m3u8Url = dlJson.url;
    if (m3u8Url.startsWith('//')) m3u8Url = `https:${m3u8Url}`;

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
      url: m3u8Url,
      streamUrl: m3u8Url,
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
 * Universal resolver: checks if a URL is VidMoly or AlphaStream and extracts direct stream.
 */
export async function resolveDirectStream(streamObj) {
  if (!streamObj) return null;
  const url = (streamObj.url || streamObj.streamUrl || (typeof streamObj.getUrl === 'function' ? streamObj.getUrl() : '') || '').toLowerCase();

  // 1. VidMoly
  if (url.includes('vidmoly')) {
    const rawUrl = streamObj.url || streamObj.streamUrl || streamObj.getUrl();
    const direct = await extractVidmolyStream(rawUrl);
    if (direct && direct.url) {
      return {
        ...streamObj,
        isHls: true,
        isDirectVideo: true,
        originalEmbedUrl: rawUrl,
        streamUrl: direct.url,
        url: direct.url,
        getUrl: () => direct.url
      };
    }
  }

  // 2. Alpha Stream (ag2m4 / agcdn / liderfilm)
  if (url.includes('ag2m4') || url.includes('agcdn') || url.includes('liderfilm') || (streamObj.id && streamObj.id.startsWith('dbl'))) {
    const rawUrl = streamObj.url || streamObj.streamUrl || streamObj.getUrl();
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
