// Cloudflare Pages Function: /api/stream-proxy
// Web tarayıcıları için genel amaçlı M3U8 ve TS akış tüneli (CORS & Referer spoofing)

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Max-Age': '86400',
};

export async function onRequest(context) {
  const { request } = context;

  if (request.method === 'OPTIONS') {
    return new Response(null, { headers: CORS_HEADERS });
  }

  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return new Response('Method Not Allowed', { status: 405, headers: CORS_HEADERS });
  }

  const url = new URL(request.url);
  const targetUrl = url.searchParams.get('url');

  if (!targetUrl) {
    return new Response('Missing "url" parameter', { status: 400, headers: CORS_HEADERS });
  }

  let parsed;
  try {
    parsed = new URL(targetUrl);
  } catch {
    return new Response('Invalid URL', { status: 400, headers: CORS_HEADERS });
  }

  if (!['http:', 'https:'].includes(parsed.protocol)) {
    return new Response('Invalid protocol', { status: 400, headers: CORS_HEADERS });
  }

  try {
    const headers = new Headers();
    headers.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36');
    headers.set('Accept', '*/*');

    // Gelen referer veya origin başlığını ekle
    const referer = url.searchParams.get('referer') || (parsed.origin + '/');
    headers.set('Referer', referer);
    headers.set('Origin', parsed.origin);

    const res = await fetch(targetUrl, {
      method: request.method,
      headers,
    });

    const contentType = res.headers.get('content-type') || '';
    const isPlaylist = targetUrl.includes('.m3u8') ||
      contentType.includes('application/vnd.apple.mpegurl') ||
      contentType.includes('application/x-mpegurl');

    // .m3u8 playlist ise içindeki child URL'leri stream-proxy üzerinden geçecek şekilde yeniden yaz
    if (isPlaylist && request.method === 'GET') {
      const text = await res.text();
      const baseUrl = targetUrl.substring(0, targetUrl.lastIndexOf('/') + 1);
      const proxyBase = `${url.origin}/api/stream-proxy?url=`;
      const refererParam = `&referer=${encodeURIComponent(referer)}`;

      const rewritten = text.split('\n').map(line => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) {
          if (trimmed.includes('URI="')) {
            return trimmed.replace(/URI="([^"]+)"/, (match, uri) => {
              const resolved = uri.startsWith('http') ? uri : new URL(uri, baseUrl).href;
              return `URI="${proxyBase}${encodeURIComponent(resolved)}${refererParam}"`;
            });
          }
          return line;
        }

        const resolved = trimmed.startsWith('http') ? trimmed : new URL(trimmed, baseUrl).href;
        return `${proxyBase}${encodeURIComponent(resolved)}${refererParam}`;
      }).join('\n');

      return new Response(rewritten, {
        status: res.status,
        headers: {
          ...CORS_HEADERS,
          'Content-Type': 'application/vnd.apple.mpegurl',
          'Cache-Control': 'no-cache, no-store',
        },
      });
    }

    // TS segmenti veya binary veri: doğrudan dön
    const responseHeaders = new Headers(res.headers);
    for (const [key, val] of Object.entries(CORS_HEADERS)) {
      responseHeaders.set(key, val);
    }
    responseHeaders.set('Cache-Control', 'public, max-age=3600');

    return new Response(res.body, {
      status: res.status,
      headers: responseHeaders,
    });
  } catch (err) {
    return new Response(`Stream proxy error: ${err.message}`, { status: 502, headers: CORS_HEADERS });
  }
}
