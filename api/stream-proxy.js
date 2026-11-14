import { Readable } from 'node:stream';

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

  const customReferer = req.query?.referer || req.query?.ref || urlObj.searchParams.get('referer') || urlObj.searchParams.get('ref') || `${parsedTarget.origin}/`;
  const customOrigin = req.query?.origin || urlObj.searchParams.get('origin') || '';
  const rawHeadersParam = req.query?.headers || urlObj.searchParams.get('headers');

  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    'Accept': '*/*'
  };

  let sanitizedCustomHeaders = null;
  if (rawHeadersParam) {
    try {
      const parsedHeaders = typeof rawHeadersParam === 'string' ? JSON.parse(rawHeadersParam) : rawHeadersParam;
      if (parsedHeaders && typeof parsedHeaders === 'object' && !Array.isArray(parsedHeaders)) {
        sanitizedCustomHeaders = {};
        for (const [k, v] of Object.entries(parsedHeaders)) {
          const key = String(k || '').trim();
          const lower = key.toLowerCase();
          if (!key || lower === 'host' || lower === 'content-length' || lower === 'connection' || lower === 'accept-encoding') continue;
          if (v === undefined || v === null) continue;
          sanitizedCustomHeaders[key] = String(v).slice(0, 800);
          headers[key] = sanitizedCustomHeaders[key];
        }
        if (Object.keys(sanitizedCustomHeaders).length === 0) sanitizedCustomHeaders = null;
      }
    } catch (_) {}
  }

  if (customReferer) {
    headers['Referer'] = customReferer;
  }
  if (customOrigin) {
    headers['Origin'] = customOrigin;
  }

  if (req.headers.range) {
    headers['Range'] = req.headers.range;
  }

  try {
    const response = await fetch(targetUrl, {
      method: req.method === 'HEAD' ? 'HEAD' : 'GET',
      headers,
      redirect: 'follow'
    });

    const contentType = (response.headers.get('content-type') || '').toLowerCase();
    const isM3U8 = contentType.includes('mpegurl') || parsedTarget.pathname.includes('.m3u8') || parsedTarget.pathname.includes('.m3u') || targetUrl.includes('.m3u8');

    res.status(response.status);
    response.headers.forEach((val, key) => {
      const k = key.toLowerCase();
      if (
        k !== 'content-security-policy' &&
        k !== 'x-frame-options' &&
        k !== 'access-control-allow-origin' &&
        (!isM3U8 || (k !== 'content-length' && k !== 'content-encoding'))
      ) {
        res.setHeader(key, val);
      }
    });
    res.setHeader('Access-Control-Allow-Origin', '*');

    if (isM3U8 && response.ok && req.method !== 'HEAD') {
      const text = await response.text();
      const baseUrl = response.url || targetUrl;
      const baseObj = new URL(baseUrl);
      const originQuery = customOrigin ? `&origin=${encodeURIComponent(customOrigin)}` : '';
      const headersQuery = sanitizedCustomHeaders ? `&headers=${encodeURIComponent(JSON.stringify(sanitizedCustomHeaders))}` : '';
      const makeProxyHref = (resolved) => `/api/stream-proxy?url=${encodeURIComponent(resolved)}&referer=${encodeURIComponent(customReferer)}${originQuery}${headersQuery}`;

      const rewritten = text.split('\n').map(line => {
        const trimmed = line.trim();
        if (!trimmed) return line;
        if (trimmed.startsWith('#')) {
          if (trimmed.includes('URI="')) {
            return line.replace(/URI="([^"]+)"/g, (_, childUri) => {
              try {
                const resolvedUri = new URL(childUri, baseObj).href;
                return `URI="${makeProxyHref(resolvedUri)}"`;
              } catch (_) {
                return `URI="${childUri}"`;
              }
            });
          }
          return line;
        }
        try {
          const resolved = new URL(trimmed, baseObj).href;
          return makeProxyHref(resolved);
        } catch (_) {
          return line;
        }
      }).join('\n');

      res.setHeader('Content-Type', 'application/vnd.apple.mpegurl; charset=utf-8');
      return res.send(rewritten);
    }

    if (req.method === 'HEAD' || !response.body) {
      return res.end();
    }

    if (typeof res.write === 'function' && typeof res.on === 'function') {
      const readable = Readable.fromWeb(response.body);
      readable.on('error', () => {
        if (!res.headersSent) res.status(502);
        res.end();
      });
      readable.pipe(res);
      return;
    }

    const buffer = await response.arrayBuffer();
    return res.send(Buffer.from(buffer));
  } catch (err) {
    return res.status(502).json({ error: 'Stream proxy hatasi: ' + err.message });
  }
}
