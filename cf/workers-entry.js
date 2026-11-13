// Cloudflare Workers tam giris (cinepulse.cinepulse.workers.dev).
// /api/* + /cinepulse.apk -> Vercel-uyumlu api/ yigini (adapter uzerinden).
// Kalan her sey -> Worker'a yuklenen ASSETS. Pages/Vercel bagimliligi yok.
import { onRequest } from '../functions/[[route]].js';
import { saglayiciYaniti } from './provider-routes.js';
import { proxyYedekDene } from './proxy-failover.js';

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

    // SAĞLAYICI ROTALARI (2026-11-13): çekirdeklerin göreli `/api/<kod>/...`
    // istekleri Android'de native-routes.json ile karşılanıyor; web'de aynı
    // tabloyu burada çözmek mobil+web paritesini kurar. Tabloda olmayan veya
    // worker'ın kendi uçları olan yollar aşağıdaki normal akışa düşer.
    if (url.pathname.startsWith('/api/')) {
      const saglayiciCevap = await saglayiciYaniti(request, url);
      if (saglayiciCevap) return saglayiciCevap;
    }

    if (url.pathname.startsWith('/api') || url.pathname === '/cinepulse.apk') {
      const cevap = await onRequest({ request, env, waitUntil: (p) => ctx.waitUntil(p) });
      // /api/proxy 5xx: yedek alan adı varsa aynı istek orada denenir.
      return proxyYedekDene(cevap, request, url, (istek) =>
        onRequest({ request: istek, env, waitUntil: (p) => ctx.waitUntil(p) }));
    }

    return serveAsset(request, env, url);
  },
};
