const requestBuckets = new Map();
const AUTOMATION_UA = /(?:curl|wget|python-requests|python-urllib|scrapy|aiohttp|httpx|go-http-client|libwww-perl|mechanize|phantomjs|selenium|playwright|puppeteer|headlesschrome|postmanruntime)/i;

function isPrivateIpv4(hostname) {
  const parts = hostname.split('.').map(Number);
  if (parts.length !== 4 || parts.some(part => !Number.isInteger(part) || part < 0 || part > 255)) return false;
  return parts[0] === 10
    || parts[0] === 127
    || parts[0] === 0
    || (parts[0] === 169 && parts[1] === 254)
    || (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31)
    || (parts[0] === 192 && parts[1] === 168)
    || (parts[0] === 100 && parts[1] >= 64 && parts[1] <= 127);
}

export function isSafePublicUrl(rawUrl) {
  try {
    const parsed = new URL(String(rawUrl));
    const hostname = parsed.hostname.toLowerCase().replace(/^\[|\]$/g, '');
    if (!['http:', 'https:'].includes(parsed.protocol)) return false;
    if (!hostname || hostname === 'localhost' || hostname.endsWith('.localhost') || hostname.endsWith('.local')) return false;
    if (hostname === 'metadata.google.internal' || hostname === '169.254.169.254') return false;
    if (isPrivateIpv4(hostname)) return false;
    if (hostname === '::1' || hostname === '::' || hostname.startsWith('fc') || hostname.startsWith('fd') || hostname.startsWith('fe80:')) return false;
    return true;
  } catch (_) {
    return false;
  }
}

function getClientIp(headers, fallback = 'unknown') {
  const forwarded = headers?.get
    ? headers.get('x-forwarded-for')
    : headers?.['x-forwarded-for'];
  return String(forwarded || fallback).split(',')[0].trim();
}

function consumeRateLimit(key, limit, windowMs = 60_000) {
  const now = Date.now();
  const current = requestBuckets.get(key);
  if (!current || current.resetAt <= now) {
    requestBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0 };
  }
  current.count += 1;
  if (requestBuckets.size > 10_000) requestBuckets.clear();
  return {
    allowed: current.count <= limit,
    retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000))
  };
}

function requestLooksUnsafe(headers, userAgent) {
  return !userAgent || AUTOMATION_UA.test(userAgent);
}

export function guardNodeRequest(req, res, { limit = 180, bucket = 'api' } = {}) {
  const userAgent = String(req.headers?.['user-agent'] || '');
  const ip = getClientIp(req.headers, req.socket?.remoteAddress);

  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'same-origin');
  res.setHeader('Cache-Control', 'no-store');

  if (requestLooksUnsafe(req.headers, userAgent)) {
    res.status(403).json({ error: 'Request blocked' });
    return true;
  }

  const rate = consumeRateLimit(`${bucket}:${ip}`, limit);
  res.setHeader('X-RateLimit-Limit', String(limit));
  if (!rate.allowed) {
    res.setHeader('Retry-After', String(rate.retryAfter));
    res.status(429).json({ error: 'Too many requests' });
    return true;
  }
  return false;
}

export function guardEdgeRequest(request, { limit = 180, bucket = 'api' } = {}) {
  const userAgent = String(request.headers.get('user-agent') || '');
  const ip = getClientIp(request.headers, 'unknown');
  const securityHeaders = {
    'Content-Type': 'application/json; charset=utf-8',
    'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'same-origin'
  };

  if (requestLooksUnsafe(request.headers, userAgent)) {
    return new Response(JSON.stringify({ error: 'Request blocked' }), {
      status: 403,
      headers: securityHeaders
    });
  }

  const rate = consumeRateLimit(`${bucket}:${ip}`, limit);
  if (!rate.allowed) {
    return new Response(JSON.stringify({ error: 'Too many requests' }), {
      status: 429,
      headers: { ...securityHeaders, 'Retry-After': String(rate.retryAfter) }
    });
  }
  return null;
}
