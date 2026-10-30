// Cloudflare Pages Functions -> Vercel-style (req,res) adaptörü.
// Amaç: api/[...all].js ve diğer api/*.js dosyalarını DEĞİŞTİRMEDEN workerd
// üzerinde koşturmak. Node-compat modu 'node:stream' + Buffer sağlıyor;
// Response gövdesi olarak ham ReadableStream döner (Range/medya akışı
// tamponlanmaz).
import { Writable } from 'node:stream';

// workerd'de process.env.VERCEL tanımsız; yerel istemci dalları (execFile
// curl) bu bayrağa bakıp kendini kapatıyor — işaretleyelim.
try {
  if (typeof process !== 'undefined' && process.env && !process.env.VERCEL) {
    process.env.VERCEL = '1';
  }
} catch { /* süreç modeli fark etmez */ }

// vercel.json headers[] eşdeğeri (CF'de _headers dosyası statiklere yeter,
// fonksiyon yanıtlarına buradan basılır).
export const SECURITY_HEADERS = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=(), payment=(), usb=(), interest-cohort=()',
};

function buildRequest(cfRequest) {
  const headers = {};
  for (const [k, v] of cfRequest.headers.entries()) headers[k.toLowerCase()] = v;
  return {
    method: cfRequest.method,
    url: cfRequest.url,
    headers,
    get(key) { return headers[String(key).toLowerCase()]; },
  };
}

/* Vercel semantiği: gövdeli isteklerde req.body doldurulur (JSON ya da ham
   metin). workerd'de gövde yalnız bir kez okunur — clone ile yakala. */
async function withBody(req, cfRequest) {
  if (!['POST', 'PUT', 'PATCH'].includes(req.method)) return req;
  try {
    const uzunluk = Number(req.headers['content-length'] || 0);
    if (uzunluk > 262144) return req; // 256 KB üstü gövde okunmaz (medya akışı değil)
    const raw = await cfRequest.clone().text();
    if (!raw) return req;
    try { req.body = JSON.parse(raw); } catch { req.body = raw; }
  } catch { /* gövde yok/okunamadı */ }
  return req;
}

/**
 * Node-stili handler -> Cloudflare Request/Response.
 * commit(): ilk içerik olayında Response kurulur; o ana kadarki
 * setHeader/status çağrıları donmuş header setine girer. Handler pipe
 * başlatıp await etmeden dönerse (hls_proxy akışları) akış 'finish'
 * olayına kadar açık kalır.
 */
export async function runNodeHandler(handler, cfRequest) {
  const req = await withBody(buildRequest(cfRequest), cfRequest);

  let controller = null;
  let streamClosed = false;
  const readable = new ReadableStream({
    start(c) { controller = c; },
    cancel() { streamClosed = true; },
  });
  const enqueue = (chunk) => {
    if (streamClosed) return;
    try {
      controller.enqueue(typeof chunk === 'string' ? new TextEncoder().encode(chunk) : chunk);
    } catch { streamClosed = true; }
  };
  const closeStream = () => {
    if (streamClosed) return;
    streamClosed = true;
    try { controller.close(); } catch { /* zaten kapalı */ }
  };

  const res = new Writable({
    write(chunk, _enc, cb) { commit(); enqueue(chunk); cb(); },
    final(cb) { commit(); closeStream(); cb(); },
  });
  res._status = 200;
  res._headers = new Headers();
  let response = null;
  const commit = () => {
    if (response) return;
    response = new Response(readable, { status: res._status || 200, headers: res._headers });
  };

  res.status = (code) => { res._status = code; return res; };
  Object.defineProperty(res, 'statusCode', {
    get() { return res._status; },
    set(v) { res._status = v; },
    configurable: true,
  });
  res.setHeader = (k, v) => {
    try { if (v != null) res._headers.set(String(k), String(Array.isArray(v) ? v[0] : v)); } catch { /* geçersiz isim */ }
    return res;
  };
  res.getHeader = (k) => res._headers.get(k);
  res.removeHeader = (k) => { try { res._headers.delete(k); } catch { /* yok */ } };
  res.json = (obj) => {
    if (!res._headers.get('content-type')) res._headers.set('content-type', 'application/json; charset=utf-8');
    res.end(typeof obj === 'string' ? obj : JSON.stringify(obj));
    return res;
  };
  res.send = (data) => {
    if (data == null) return res.end();
    const isBuf = typeof Buffer !== 'undefined' && Buffer.isBuffer(data);
    if (typeof data === 'object' && !isBuf) return res.json(data);
    if (!res._headers.get('content-type')) res._headers.set('content-type', 'text/html; charset=utf-8');
    return res.end(data);
  };
  res.redirect = (a, b) => {
    const to = typeof a === 'number' ? b : a;
    res._status = typeof a === 'number' ? a : 302;
    res._headers.set('location', String(to));
    return res.end();
  };
  // Bazı yollar res.flushHeaders() deneyebilir — no-op güvenlidir.
  res.flushHeaders = () => {};

  let handlerError = null;
  try {
    await handler(req, res);
  } catch (err) {
    handlerError = err;
  }

  if (!response) {
    if (handlerError) {
      console.error('[cf-adapter] handler hatası:', handlerError && handlerError.message);
      return new Response('internal error', {
        status: 500,
        headers: { 'content-type': 'text/plain; charset=utf-8' },
      });
    }
    const piping = res.listenerCount('pipe') > 0 || (res._writableState && res._writableState.length > 0);
    if (!piping && !res.writableEnded) {
      // Handler hiçbir şey yazmadan bitti: boş 200 (ya da sadece header 405 vb.)
      commit();
      closeStream();
    }
  } else if (handlerError && !streamClosed) {
    closeStream(); // akış ortada patladı — en azından düzgün kapansın
  }
  if (!response) throw handlerError || new Error('no response');

  const out = new Response(response.body, response);
  for (const [k, v] of Object.entries(SECURITY_HEADERS)) {
    if (!out.headers.has(k)) out.headers.set(k, v);
  }
  return out;
}
