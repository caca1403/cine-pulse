export default async function handler(req, res) {
  const targetPath = req.url.replace(/^\/api\/szd/, '');
  const targetUrl = `https://sezonlukdizi.cc${targetPath}`;

  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://sezonlukdizi.cc/',
    'X-Requested-With': 'XMLHttpRequest'
  };

  if (req.method === 'POST') {
    headers['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
  }

  try {
    let body = undefined;
    if (req.method === 'POST') {
      if (typeof req.body === 'object') {
        body = new URLSearchParams(req.body).toString();
      } else {
        body = req.body;
      }
    }

    const upstreamRes = await fetch(targetUrl, {
      method: req.method,
      headers: headers,
      body: body
    });

    const data = await upstreamRes.text();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(upstreamRes.status).send(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
