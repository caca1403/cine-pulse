export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const urlObj = new URL(req.url, `https://${req.headers.host || 'localhost'}`);

    let subPath = req.query?.path || urlObj.searchParams.get('path');
    if (!subPath) {
      subPath = urlObj.pathname.replace(/^\/api\/ddz\/?/, '');
    }

    const searchParams = new URLSearchParams(urlObj.search);
    searchParams.delete('path');
    const queryString = searchParams.toString() ? `?${searchParams.toString()}` : '';

    if (!subPath.startsWith('/')) subPath = '/' + subPath;

    const targetUrl = `https://dramadizilerim.com${subPath}${queryString}`;

    const customHeaders = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      'Referer': 'https://dramadizilerim.com/',
      'Origin': 'https://dramadizilerim.com'
    };

    let body = undefined;
    if (req.method === 'POST') {
      customHeaders['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
      if (Buffer.isBuffer(req.body)) {
        body = req.body.toString('utf-8');
      } else if (typeof req.body === 'object' && req.body !== null) {
        body = new URLSearchParams(req.body).toString();
      } else {
        body = req.body;
      }
    }

    const upstreamRes = await fetch(targetUrl, {
      method: req.method,
      headers: customHeaders,
      body: body
    });

    const contentType = upstreamRes.headers.get('content-type') || 'text/html; charset=utf-8';
    res.setHeader('Content-Type', contentType);

    const buffer = await upstreamRes.arrayBuffer();
    return res.status(upstreamRes.status).send(Buffer.from(buffer));
  } catch (err) {
    console.error('DDZ Proxy Error:', err);
    return res.status(500).json({ error: err.message });
  }
}
