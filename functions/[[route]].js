// Cloudflare Pages Functions girisi — Vercel api/ yigini oldusu gibi sunar.
// Routing onceligi (Vercel semantigi):
//   1. harici rewrite'lar: /api/flz/* -> filmizlech, /api/hfd/* -> hdfilmdelisi
//   2. dosya-eslesmesi:   ddz, epg, fanart, release (node) | jet, rtv, snx (edge)
//   3. prefix rewrite:     snx|szd|jet|dzs|dzb|kvip alt yollari ?path=... olur
//   4. geri kalan her sey: catch-all ([...all].js) — proxy/hls/live/...
import { runNodeHandler, SECURITY_HEADERS } from '../cf/adapter.js';
import cfall from '../api/[...all].js';
import ddz from '../api/ddz.js';
import epg from '../api/epg.js';
import fanart from '../api/fanart.js';
import release from '../api/release.js';
import jet from '../api/jet.js';
import rtv from '../api/rtv.js';
import snx from '../api/snx.js';
import resolve from '../cf/resolve.js';

// yol -> mod (Vercel'de dosya adi neyse o; czm/dzs/kvip catch-all alias'idir)
const NODE_FILES = {
  '/api/ddz': ddz,
  '/api/epg': epg,
  '/api/fanart': fanart,
  '/api/release': release,
  // python resolve.py'nin web portu (ctv+dzs) — Faz 2
  '/api/resolve': resolve,
};
const EDGE_FILES = { '/api/jet': jet, '/api/rtv': rtv, '/api/snx': snx };
// rewrite: /api/x/DERLEYICI -> /api/x?path=DERLEYICI
const PATH_REWRITE = new Set(['/api/snx', '/api/szd', '/api/jet', '/api/dzs', '/api/dzb', '/api/kvip']);
// rewrite: /api/flz/X -> https://filmizlech.com/X (Vercel harici rewrite)
const EXTERNAL = [
  { prefix: '/api/flz', target: 'https://filmizlech.com' },
  { prefix: '/api/hfd', target: 'https://hdfilmdelisi.one' },
];

function withSecurity(response) {
  const out = new Response(response.body, response);
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
    if (!out.headers.has(k)) out.headers.set(k, v);
  }
  return out;
}

async function externalPassthrough(prefix, target, url, request) {
  const rest = url.pathname.slice(prefix.length).replace(/^\//, '');
  const dest = new URL(`${target}/${rest}${url.search}`);
  const ac = new AbortController();
  const timer = setTimeout(() => ac.abort(), 15000);
  try {
    const upstream = await fetch(dest, {
      method: request.method,
      redirect: 'follow',
      signal: ac.signal,
      headers: {
        'User-Agent': request.headers.get('user-agent') || 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/124',
        ...(request.headers.get('referer') ? { Referer: request.headers.get('referer') } : {}),
      },
    });
    const headers = new Headers();
    for (const k of ['content-type', 'content-length', 'cache-control', 'etag', 'last-modified']) {
      const v = upstream.headers.get(k);
      if (v) headers.set(k, v);
    }
    return new Response(upstream.body, { status: upstream.status, headers });
  } finally {
    clearTimeout(timer);
  }
}

export async function onRequest(context) {
  const request = context.request;
  const url = new URL(request.url);

  // Pages _worker.js modu: statikles eslesmeyen GET'ler (SPA gezinti) buraya
  // duser; uygulama hash-router kullaniyor -> /#/yol'a yonlendir.
  if (request.method === 'GET' && !url.pathname.startsWith('/api') && url.pathname !== '/cinepulse.apk'
      && !/\.[a-z0-9]{1,8}$/i.test(url.pathname)) {
    return Response.redirect(`${url.origin}/#${url.pathname}${url.search}`, 302);
  }

  try {
    if (typeof process !== 'undefined' && process.env) {
      process.env.VERCEL = '1';
      process.env.VERCEL_URL = url.host;
    }
  } catch { /* ortam */ }

  for (const ext of EXTERNAL) {
    if (url.pathname === ext.prefix || url.pathname.startsWith(`${ext.prefix}/`)) {
      return withSecurity(await externalPassthrough(ext.prefix, ext.target, url, request));
    }
  }

  let effUrl = url;
  for (const p of PATH_REWRITE) {
    if (url.pathname.startsWith(`${p}/`)) {
      effUrl = new URL(request.url);
      effUrl.pathname = p;
      effUrl.searchParams.set('path', url.pathname.slice(p.length + 1));
      break;
    }
  }
  const effRequest = effUrl === url ? request : new Request(effUrl.toString(), request);

  const file = NODE_FILES[url.pathname];
  if (file) return runNodeHandler(file, request);

  const edge = EDGE_FILES[url.pathname];
  if (edge) return withSecurity(await edge(effRequest, { env: context.env || {}, waitUntil: context.waitUntil }));

  return runNodeHandler(cfall, effRequest);
}
