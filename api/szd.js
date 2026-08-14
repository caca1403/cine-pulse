export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const path = req.query.path || req.url.replace(/^\/api\/szd\??/, '').replace(/^path=/, '');
  const urlParts = req.url.split('?');
  const userQs = urlParts.length > 1 ? `?${urlParts[1].replace(/path=[^&]*&?/, '').replace(/^&/, '')}` : '';

  const cleanSub = path.split('/').filter(Boolean).map(seg => encodeURIComponent(decodeURIComponent(seg))).join('/') + (path.endsWith('/') ? '/' : '');
  const targetUrl = `https://sezonlukdizi.cc/${cleanSub}${userQs}`;

  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    'Referer': 'https://sezonlukdizi.cc/',
    'Origin': 'https://sezonlukdizi.cc',
    'X-Requested-With': 'XMLHttpRequest'
  };

  if (req.method === 'POST') {
    headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
  }

  try {
    let body = undefined;
    if (req.method === 'POST') {
      if (req.body) {
        if (typeof req.body === 'object') {
          body = new URLSearchParams(req.body).toString();
        } else {
          body = req.body;
        }
      } else {
        const chunks = [];
        for await (const chunk of req) {
          chunks.push(chunk);
        }
        if (chunks.length > 0) {
          body = Buffer.concat(chunks).toString('utf-8');
        }
      }
    }

    const upstreamRes = await fetch(targetUrl, {
      method: req.method,
      headers: headers,
      body: body
    });

    const data = await upstreamRes.arrayBuffer();
    const contentType = upstreamRes.headers.get('content-type') || 'text/html';
    res.setHeader('Content-Type', contentType);
    return res.status(upstreamRes.status).send(Buffer.from(data));
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
