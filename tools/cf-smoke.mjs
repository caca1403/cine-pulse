const origin = process.env.CF_SITE || 'https://cinepulse.cinepulse.workers.dev';
const headers = { 'User-Agent': 'Mozilla/5.0 Chrome/124' };
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
await check('/cinepulse.apk', 302, {}, (_, r) => r.headers.get('location')?.startsWith('https://github.com/caca1403/cine-pulse/releases/'));
console.log('Production smoke passed; provider playback is not covered by this test.');
