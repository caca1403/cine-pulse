// Cloudflare Workers tam giris (cinepulse.cinepulse.workers.dev).
// /api/* + /cinepulse.apk -> Vercel-uyumlu api/ yigini (adapter uzerinden).
// Kalan her sey -> Worker'a yuklenen ASSETS. Pages/Vercel bagimliligi yok.
import { onRequest } from '../functions/[[route]].js';

async function serveAsset(request, env, url) {
  const upstream = await env.ASSETS.fetch(request);
  if (upstream.status === 404 && !(url.pathname.split('/').pop() || '').includes('.')) {
    return Response.redirect(`${url.origin}/#${url.pathname}${url.search}`, 302);
  }
  return upstream;
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

    return serveAsset(request, env, url);
  },
};
