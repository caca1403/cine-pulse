const origin = process.env.CF_SITE || 'https://cinepulse.cinepulse.workers.dev';
/* Kalkan (worker WAF) kırpılmış UA'ları reddediyor (ölçüldü 2026-11-14:
 * 'Mozilla/5.0 Chrome/124' → /cinepulse.apk 302/403; tam Chrome UA → 200 +
 * application/vnd.android.package-archive). Test aracının UA'sı gerçek tarayıcı
 * gibi olmalı, yoksa canlı site "bozuk" gibi görünür (yanlış pozitif). */
const headers = {
  'User-Agent':
    'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
  'Accept-Language': 'tr-TR,tr;q=0.9',
};
async function check(path, status, options = {}, validate = () => true) {
  const r = await fetch(`${origin}${path}`, { ...options, headers: { ...headers, ...options.headers }, signal: AbortSignal.timeout(30000), redirect: 'manual' });
  const body = await r.text();
  if (r.status !== status || !validate(body, r)) throw new Error(`${path}: status=${r.status}, validation failed`);
  console.log(`PASS ${path}: ${r.status}`);
  return body;
}
const html = await check('/', 200, {}, body => body.includes('id="app"'));
const js = html.match(/src="([^\"]*assets\/index-[^\"]+\.js)"/)?.[1];
if (!js) throw new Error('Missing application bundle');
await check(js, 200, {}, body => body.length > 1000);
await check('/version.json', 200, {}, body => Boolean(JSON.parse(body).version));
await check('/api/hls_proxy?url=x', 200, { method: 'OPTIONS' });
await check('/api/proxy?url=http%3A%2F%2F169.254.169.254%2Flatest%2F', 403);
// /cinepulse.apk artık 302 değil: baytlar worker üzerinden AKITILIR.
// Gövdeyi indirmeden başlıkları doğrula (80MB'lık indirme testi yapma).
{
  const r = await fetch(`${origin}/cinepulse.apk`, {
    headers, redirect: 'manual', signal: AbortSignal.timeout(30000),
  });
  try {
    if (r.status !== 200) throw new Error(`/cinepulse.apk: status=${r.status}`);
    if (!/package-archive/.test(r.headers.get('content-type') || '')) {
      throw new Error(`/cinepulse.apk: beklenmeyen content-type=${r.headers.get('content-type')}`);
    }
    console.log(`PASS /cinepulse.apk: ${r.status} (content-type=package-archive)`);
  } finally {
    try { await r.body?.cancel(); } catch { /* akış kapansın */ }
  }
}
console.log('Production smoke passed; provider playback is not covered by this test.');
