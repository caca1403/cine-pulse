import { guardNodeRequest } from './_security.js';

const CF_WORKER_PROXY = 'https://wild-credit-e1ae.cagatayca07.workers.dev';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (guardNodeRequest(req, res, { limit: 180, bucket: 'snx' })) return;

  const urlObj = new URL(req.url, `https://${req.headers.host || 'localhost'}`);
  
  let subPath = req.query?.path || urlObj.searchParams.get('path');
  if (!subPath) {
    subPath = urlObj.pathname.replace(/^\/api\/snx/, '');
  }
  if (!subPath.startsWith('/')) subPath = '/' + subPath;

  const cleanSearch = urlObj.search ? urlObj.search.replace(/[?&]path=[^&]*/g, '').replace(/^&/, '?') : '';
  const targetUrl = `https://ydfvfdizipanel.ru/public/api${subPath}${cleanSearch}`;

  const customHeaders = {
    'hash256': 'f4d4bc98a3fc4600e7f2c2bab7533f1f03d8a70ff03c256bb11dc57050536bd0',
    'signature': '308202c3308201aba0030201020204075cec01300d06092a864886f70d01010b050030123110300e0603550403130753696e65776978301e170d3231303932313233333334395a170d3436303931353233333334395a30123110300e0603550403130753696e6577697830820122300d06092a864886f70d01010105000382010f003082010a0282010100b0a2a1bc5c3f16f19c3b2456cfd0a6128ced9f5e2e2c4cca1a100e17b07b86256258f372e76a95a17e9e4a1c048e364835723a95e8ef6d5bdfb5694b50277c65a64f7b012fdf164e5dc93629561f6ca29b7dc82ebb3d6f3c8e8fc6795847fe331ad4a13ed6c059a83804c43d3747526d769580f3a4153752eb22dac66dd15f1582caa43305dc49f55ac7b1b89013e654d2ca8c94c30956659674cc673256c04208f09118bae14cdd72d78f9ee2aece958084a8c2e315deff45726d4fc1f18ec39569ff1abe4f36a8d01090e5f68c07c28763513b88208bcac1a6e1941f6fd8bfdd52f832098ddb2154c8f565bc5d58c7106a19e03787e75c7f34997000e3bcf30203010001a321301f301d0603551d0e04160414b545fc18e74a791d9402b53940ae38b96e9e209c300d06092a864886f70d01010b05000382010100a8a64d9e7c8b5db102af15d3caf94ff8d3e9be9008bb0021117ca2f0762e68583354b126a041bb1fb6e6308e421e4b5a71f779cde63e5d2fc5976bff966c3c4034e852c077d8e74458fbae2ec1db74b1f4082e188bf8ef7c42a44e3fbfb693bb00ee2a727096b42360ddce1bdcd3536f50c8693bcc62a7b7204bcefe2ecf1f7c820bcd63e1d7a6acc8bf6163086915fc5f607cf51bc7a8635f98bb4c65a8f24b7b5a82c7b06868f565cb0d6ac4775c4aac777536ddd1a565f990fd8cbe539185fa7aab610b7855a687a00f4e55536d72873444552c50fd10727dbf298a9be6ed6ae62148dd1de365f3729915dd31975e28a472d752ac14db3db548405cc31e1e',
    'packagename': 'com.sinewix',
    'User-Agent': 'EasyPlex (Android 14; SM-A546B; Samsung Galaxy A54 5G; tr)'
  };

  try {
    let upstreamRes = await fetch(targetUrl, {
      method: req.method,
      headers: customHeaders,
      signal: AbortSignal.timeout(4500)
    }).catch(() => null);

    const isBlocked = !upstreamRes || !upstreamRes.ok || (upstreamRes.headers.get('content-type') || '').includes('text/html');

    if (isBlocked) {
      const workerUrl = `${CF_WORKER_PROXY}?url=${encodeURIComponent(targetUrl)}`;
      const workerRes = await fetch(workerUrl, {
        method: req.method,
        headers: customHeaders,
        signal: AbortSignal.timeout(6000)
      }).catch(() => null);

      if (workerRes && workerRes.ok) {
        upstreamRes = workerRes;
      }
    }

    if (!upstreamRes) {
      return res.status(502).json({ error: 'Failed to reach Sinewix upstream API' });
    }

    const data = await upstreamRes.arrayBuffer();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', upstreamRes.headers.get('content-type') || 'application/json');
    return res.status(upstreamRes.status).send(Buffer.from(data));
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
