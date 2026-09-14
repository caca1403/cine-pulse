import { guardEdgeRequest } from './_security.js';

export const config = {
  runtime: 'edge'
};

export default async function handler(request) {
  const blockedResponse = guardEdgeRequest(request, { limit: 180, bucket: 'rtv' });
  if (blockedResponse) return blockedResponse;
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
      }
    });
  }

  try {
    const urlObj = new URL(request.url);

    let subPath = request.headers.get('x-rtv-path') || urlObj.searchParams.get('path');
    if (!subPath) {
      subPath = urlObj.pathname.replace(/^\/api\/rtv\/?/, '');
    }

    const searchParams = new URLSearchParams(urlObj.search);
    searchParams.delete('path');
    const queryString = searchParams.toString() ? `?${searchParams.toString()}` : '';

    if (!subPath.startsWith('/')) subPath = '/' + subPath;

    const targetUrl = `https://a.prectv70.lol/api${subPath}${queryString}`;

    const forwardHeaders = new Headers();
    forwardHeaders.set('user-agent', 'okhttp/4.12.0');

    // Forward all incoming custom headers from the client
    for (const [k, v] of request.headers.entries()) {
      const lk = k.toLowerCase();
      if (lk === 'host' || lk === 'origin' || lk === 'referer' || lk === 'user-agent' || lk === 'x-rtv-path') continue;
      forwardHeaders.set(k, v);
    }

    let body = null;
    if (request.method === 'POST' || request.method === 'PUT') {
      body = await request.text();
    }

    const upstreamRes = await fetch(targetUrl, {
      method: request.method,
      headers: forwardHeaders,
      body: body || undefined
    });

    const responseData = await upstreamRes.arrayBuffer();

    const responseHeaders = new Headers();
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
    responseHeaders.set('Content-Type', upstreamRes.headers.get('content-type') || 'application/json');

    return new Response(responseData, {
      status: upstreamRes.status,
      headers: responseHeaders
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store'
      }
    });
  }
}
