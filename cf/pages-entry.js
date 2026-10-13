// Cloudflare Pages "advanced mode" girisi: dist kokune _worker.js olarak
// konur; statiklesmeyen her istek (tum /api/* + SPA) buraya gelir.
// functions/[[route]].js ile ayni mantik — tek fark Pages'in cagri sekli.
import { onRequest } from '../functions/[[route]].js';

export default {
  async fetch(request, env, ctx) {
    try {
      if (typeof process !== 'undefined' && process.env) {
        for (const [k, v] of Object.entries(env || {})) {
          if (typeof v === 'string') process.env[k] = v;
        }
      }
    } catch { /* ortam */ }
    return onRequest({ request, env, waitUntil: (p) => ctx.waitUntil(p) });
  },
};
