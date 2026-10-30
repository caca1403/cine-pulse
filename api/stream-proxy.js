/**
 * CinePulse Stream Proxy API Handler
 * Web istemcileri icin HLS/M3U8 ve TS parcalarini CORS ve Referer korumasiyla tuneller.
 */

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const urlObj = new URL(req.url, `https://${req.headers.host || 'localhost'}`);
  const targetUrl = req.query?.url || urlObj.searchParams.get('url');

  if (!targetUrl) {
    return res.status(400).json({ error: 'url parametresi gerekli' });
  }

  let parsedTarget;
  try {
    parsedTarget = new URL(targetUrl);
  } catch (_) {
    return res.status(400).json({ error: 'Gecersiz hedef URL' });
  }

  const customReferer = req.query?.referer || urlObj.searchParams.get('referer') || `${parsedTarget.origin}/`;
  const customOrigin = req.query?.origin || urlObj.searchParams.get('origin') || parsedTarget.origin;

  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    'Referer': customReferer,
    'Origin': customOrigin,
    'Accept': '*/*'
  };

  if (req.headers.range) {
    headers['Range'] = req.headers.range;
  }

  try {
    const response = await fetch(targetUrl, {
      method: req.method === 'HEAD' ? 'HEAD' : 'GET',
      headers,
      redirect: 'follow'
    });

    const contentType = response.headers.get('content-type') || '';
    const isM3U8 = contentType.includes('mpegurl') || targetUrl.includes('.m3u8') || targetUrl.includes('.m3u');

    res.status(response.status);
    response.headers.forEach((val, key) => {
      const k = key.toLowerCase();
      if (k !== 'content-security-policy' && k !== 'x-frame-options' && k !== 'access-control-allow-origin') {
        res.setHeader(key, val);
      }
    });
    res.setHeader('Access-Control-Allow-Origin', '*');

    if (isM3U8 && response.ok) {
      const text = await response.text();
      const baseUrl = response.url || targetUrl;
      const baseObj = new URL(baseUrl);

      const rewritten = text.split('\n').map(line => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith('#')) {
          if (trimmed.startsWith('#EXT-X-KEY:') && trimmed.includes('URI="')) {
            return trimmed.replace(/URI="([^"]+)"/, (_, keyUrl) => {
              const resolvedKey = new URL(keyUrl, baseObj).href;
              const proxied = `/api/stream-proxy?url=${encodeURIComponent(resolvedKey)}&referer=${encodeURIComponent(customReferer)}`;
              return `URI="${proxied}"`;
            });
          }
          return line;
        }
        try {
          const resolved = new URL(trimmed, baseObj).href;
          return `/api/stream-proxy?url=${encodeURIComponent(resolved)}&referer=${encodeURIComponent(customReferer)}`;
        } catch (_) {
          return line;
        }
      }).join('\n');

      res.setHeader('Content-Type', 'application/vnd.apple.mpegurl; charset=utf-8');
      return res.send(rewritten);
    }

    const buffer = await response.arrayBuffer();
    return res.send(Buffer.from(buffer));
  } catch (err) {
    return res.status(502).json({ error: 'Stream proxy hatasi: ' + err.message });
  }
}
