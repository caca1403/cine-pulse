/* Trakt OAuth köprüsü: client_secret yalnız burada, dağıtım env'inde
   (TRAKT_CLIENT_SECRET) tutulur. Öncesi: sır önyüz bundle'ına gömülüydü.
   Trakt'in 400/404/409/410/429 durum kodları AYNEN geçirilir — istemcideki
   pollDeviceToken bekle/kalan mantığı bu kodlara bakar. */
export async function traktTokenKopru(req, res, body) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') { res.statusCode = 200; res.end(); return; }
  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ error: 'POST only' }));
    return;
  }

  const bodyObj = (body && typeof body === 'object') ? body : {};
  const secret = String(process.env.TRAKT_CLIENT_SECRET || '').trim();
  const clientId = String(bodyObj.client_id || process.env.TRAKT_CLIENT_ID || '').trim();
  if (!secret) {
    res.statusCode = 503;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ error: 'Trakt köprüsü yapılandırılmamış (TRAKT_CLIENT_SECRET env eksik)' }));
    return;
  }
  if (!clientId) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ error: 'client_id gerekli' }));
    return;
  }

  const payload = { client_id: clientId, client_secret: secret };
  const endpoint = bodyObj.refresh_token
    ? 'https://api.trakt.tv/oauth/token'
    : 'https://api.trakt.tv/oauth/device/token';
  if (bodyObj.refresh_token) {
    payload.refresh_token = String(bodyObj.refresh_token);
    payload.grant_type = 'refresh_token';
  } else if (bodyObj.code) {
    payload.code = String(bodyObj.code);
  } else {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ error: 'code veya refresh_token gerekli' }));
    return;
  }

  try {
    const upstream = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(10000)
    });
    const text = await upstream.text();
    res.statusCode = upstream.status;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(text);
  } catch (e) {
    res.statusCode = 502;
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify({ error: String((e && e.message) || e) }));
  }
}
