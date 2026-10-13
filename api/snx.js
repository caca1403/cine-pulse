import { guardEdgeRequest } from './_security.js';

export const config = {
  runtime: 'edge'
};

// Üçüncü taraf relay adresi Vercel ortam değişkeninden okunur (CP_SNX_RELAY);
// mevcut worker yedek olarak durur — tanım olmasa da uç çalışmaya devam eder.
const CF_WORKER_PROXY = (process.env.CP_SNX_RELAY || 'https://wild-credit-e1ae.cagatayca07.workers.dev').replace(/\/$/, '');

export default async function handler(request) {
  const blockedResponse = guardEdgeRequest(request, { limit: 180, bucket: 'snx' });
  if (blockedResponse) return blockedResponse;

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
      subPath = urlObj.pathname.replace(/^\/api\/snx\/?/, '');
    }

    const searchParams = new URLSearchParams(urlObj.search);
    searchParams.delete('path');
    const queryString = searchParams.toString() ? `?${searchParams.toString()}` : '';

    if (!subPath.startsWith('/')) subPath = '/' + subPath;

    const targetUrl = `https://ydfvfdizipanel.ru/public/api${subPath}${queryString}`;
    const workerUrl = `${CF_WORKER_PROXY}?url=${encodeURIComponent(targetUrl)}`;

    const upstreamRes = await fetch(workerUrl, {
      method: 'GET'
    }).catch(() => null);

    if (!upstreamRes || !upstreamRes.ok) {
      return new Response(JSON.stringify({ error: 'Upstream fetch failed' }), {
        status: 502,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    const responseHeaders = new Headers();
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    responseHeaders.set('Access-Control-Allow-Headers', '*');
    responseHeaders.set('Content-Type', upstreamRes.headers.get('content-type') || 'application/json');

    const body = await upstreamRes.arrayBuffer();
    return new Response(body, {
      status: upstreamRes.status,
      headers: responseHeaders
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
