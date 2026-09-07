export const config = {
  runtime: 'edge'
};

export default async function handler(request) {
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': '*'
      }
    });
  }

  try {
    const urlObj = new URL(request.url);

    let subPath = urlObj.searchParams.get('path');
    if (!subPath) {
      subPath = urlObj.pathname.replace(/^\/api\/jet\/?/, '');
    }

    const searchParams = new URLSearchParams(urlObj.search);
    searchParams.delete('path');
    const queryString = searchParams.toString() ? `?${searchParams.toString()}` : '';

    if (!subPath.startsWith('/')) subPath = '/' + subPath;

    const targetUrl = `https://jetfilmizle.now${subPath}${queryString}`;

    const headers = new Headers();
    headers.set('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36');
    headers.set('Referer', 'https://jetfilmizle.now/');
    headers.set('Origin', 'https://jetfilmizle.now');
    headers.set('X-Requested-With', 'XMLHttpRequest');

    let body = null;
    if (request.method === 'POST') {
      headers.set('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
      body = await request.text();
    }

    let upstreamRes = await fetch(targetUrl, {
      method: request.method,
      headers,
      body
    }).catch(() => null);

    // Fallback to Cloudflare Worker Gateway if blocked on GET
    if ((!upstreamRes || upstreamRes.status === 403) && request.method === 'GET') {
      upstreamRes = await fetch(`https://wild-credit-e1ae.cagatayca07.workers.dev?url=${encodeURIComponent(targetUrl)}`).catch(() => null);
    }

    if (!upstreamRes) {
      return new Response(JSON.stringify({ error: 'Upstream fetch failed' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    const responseHeaders = new Headers();
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    responseHeaders.set('Access-Control-Allow-Headers', '*');
    responseHeaders.set('Content-Type', upstreamRes.headers.get('content-type') || 'text/html; charset=utf-8');

    return new Response(upstreamRes.body, {
      status: upstreamRes.status,
      headers: responseHeaders
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
    });
  }
}
