// Cloudflare Workers statik-asset bagli tam giris (cinepulse.workers.dev).
// /api/* + /cinepulse.apk -> Vercel-uyumlu api/ yigini (adapter uzerinden),
// kalan her sey -> ASSETS (derlenmis dist). Statiklesmeyen GET -> SPA (#/yol).
import { onRequest } from '../functions/[[route]].js';

async function serveAsset(request, env, url) {
  const assetResp = await env.ASSETS.fetch(request);
  if (assetResp.status !== 404) return assetResp;
  // SPA fallback: uzantisiz yollar ana sayfaya yonlendirilir (# router).
  const last = url.pathname.split('/').pop() || '';
  if (!last.includes('.')) {
    return Response.redirect(`${url.origin}/#${url.pathname}${url.search}`, 302);
  }
  return assetResp;
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    try {
      if (typeof process !== 'undefined' && process.env && env) {
        for (const [k, v] of Object.entries(env)) {
          if (typeof v === 'string') { try { process.env[k] = v; } catch { /* salt-okunur */ } }
        }
      }
    } catch { /* env */ }

    if (url.pathname.startsWith('/api') || url.pathname === '/cinepulse.apk') {
      return onRequest({ request, env, waitUntil: (p) => ctx.waitUntil(p) });
    }

    // Statikleri edge-cache'ten gecir (Worker'in 100k/gun istek hakkini korur).
    if (request.method === 'GET' && typeof caches !== 'undefined'
        && url.pathname !== '/version.json' && url.pathname !== '/desktop-version.json') {
      const cache = caches.default;
      const key = new Request(request.url, { headers: request.headers });
      const hit = await cache.match(key);
      if (hit) return hit;
      const resp = await serveAsset(request, env, url);
      if (resp.ok && resp.status === 200 && request.headers.get('range') == null) {
        ctx.waitUntil(cache.put(key, resp.clone()));
      }
      return resp;
    }
    return serveAsset(request, env, url);
  },
};
