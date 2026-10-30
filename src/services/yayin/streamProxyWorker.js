/**
 * CinePulse Stream Proxy Worker
 * Web ortamında m3u8/hls/ts yayınlarının CORS ve Referer duvarlarını aşması için sunucu taraflı tünel.
 */

export async function handleStreamProxy(request) {
  const url = new URL(request.url);
  const targetUrl = url.searchParams.get('url');
  if (!targetUrl) {
    return new Response(JSON.stringify({ error: 'url parametresi gerekli' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }

  let parsedTarget;
  try {
    parsedTarget = new URL(targetUrl);
  } catch (_) {
    return new Response(JSON.stringify({ error: 'Geçersiz hedef URL' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }

  const customReferer = url.searchParams.get('referer') || `${parsedTarget.origin}/`;
  const customOrigin = url.searchParams.get('origin') || parsedTarget.origin;

  const upstreamHeaders = new Headers();
  upstreamHeaders.set('User-Agent', 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36');
  upstreamHeaders.set('Referer', customReferer);
  upstreamHeaders.set('Origin', customOrigin);
  upstreamHeaders.set('Accept', '*/*');

  const range = request.headers.get('Range');
  if (range) {
    upstreamHeaders.set('Range', range);
  }

  try {
    const resp = await fetch(targetUrl, {
      method: request.method === 'HEAD' ? 'HEAD' : 'GET',
      headers: upstreamHeaders,
      redirect: 'follow'
    });

    const contentType = resp.headers.get('content-type') || '';
    const isM3U8 = contentType.includes('mpegurl') || targetUrl.includes('.m3u8') || targetUrl.includes('.m3u');

    const responseHeaders = new Headers(resp.headers);
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
    responseHeaders.set('Access-Control-Allow-Headers', '*');
    responseHeaders.delete('content-security-policy');
    responseHeaders.delete('x-frame-options');

    if (isM3U8 && resp.ok) {
      const originalText = await resp.text();
      const baseUrl = resp.url || targetUrl;
      const baseObj = new URL(baseUrl);

      // m3u8 içindeki child bağlantıları stream-proxy üzerinden geçecek şekilde yeniden yaz
      const lines = originalText.split('\n');
      const rewritten = lines.map(line => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) {
          if (trimmed.startsWith('#EXT-X-KEY:') && trimmed.includes('URI="')) {
            return trimmed.replace(/URI="([^"]+)"/, (match, keyUrl) => {
              const resolvedKey = new URL(keyUrl, baseObj).href;
              const proxiedKey = `${url.origin}/api/stream-proxy?url=${encodeURIComponent(resolvedKey)}&referer=${encodeURIComponent(customReferer)}`;
              return `URI="${proxiedKey}"`;
            });
          }
          return line;
        }

        try {
          const resolved = new URL(trimmed, baseObj).href;
          return `${url.origin}/api/stream-proxy?url=${encodeURIComponent(resolved)}&referer=${encodeURIComponent(customReferer)}`;
        } catch (_) {
          return line;
        }
      }).join('\n');

      responseHeaders.set('Content-Type', 'application/vnd.apple.mpegurl; charset=utf-8');
      return new Response(rewritten, {
        status: resp.status,
        statusText: resp.statusText,
        headers: responseHeaders
      });
    }

    return new Response(resp.body, {
      status: resp.status,
      statusText: resp.statusText,
      headers: responseHeaders
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Stream proxy hatası: ' + err.message }), {
      status: 502,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}
