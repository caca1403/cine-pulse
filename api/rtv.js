import { guardEdgeRequest } from './_security.js';

export const config = {
  runtime: 'edge'
};

/* ==========================================================================
   RecTV (kod adı Polaris) kenar vekili
   --------------------------------------------------------------------------
   ESKİ HATA: taban adres burada SABİT duruyordu (a.prectv70.lol). Sağlayıcı
   adresi APK'nın içinde değil, Firebase Remote Config'de döndürüyor; adres
   değişince bu vekil ölü adrese gidiyor ve web/Electron tarafında Polaris
   hiç kaynak vermiyordu (cihaz/doğrudan yolu etkilenmiyordu).

   YENİ SIRA (hiçbirinde sabit adres zorunlu değil):
     1) x-rtv-base başlığı — istemcinin çözümlediği adres, AİLE DENETİMİ ile
     2) CP_RTV_BASE ortam değişkeni (Vercel dashboard)
     3) Sunucu tarafında Remote Config çözümü (10 dk önbellek)
     4) Son yedek: son bilinen adres (aile denetiminden geçer)
   Aile denetimini geçmeyen adres 400 döner — vekil keyfi bir hedefe dönüşmez.
   ========================================================================== */

// Son bilinen değer; yalnız diğer üç yol da düşerse kullanılır.
const ADRES_YEDEK = 'https://a.prectv70.lol';

// Remote Config (sağlayıcının kendi ayar servisi; adresin tek gerçek kaynağı).
const RC_PROJE = '791583031279';
const RC_ANAHTAR = process.env.CP_RTV_RC_KEY || 'AIzaSyBbhpzG8Ecohu9yArfCO5tF13BQLhjLahc';
const RC_APPID = `1:${RC_PROJE}:android:1`;
const RC_PAKET = 'com.rectv.shot';
const ADRES_TTL_MS = 10 * 60 * 1000;

let onbellek = { taban: '', zaman: 0 };

/** RecTV ailesi: prectvNN.* / psrectvNN.* gibi alt-etkili alan adları. */
function aileUygunMu(ad) {
  try {
    const u = new URL(/^https?:\/\//i.test(ad) ? ad : `https://${ad}`);
    if (u.protocol !== 'https:') return false;
    const etiketler = u.hostname.split('.');
    if (etiketler.length < 2) return false;
    const etki = `${etiketler[etiketler.length - 2]}.${etiketler[etiketler.length - 1]}`;
    return /^[a-z]*rectv\d*\.[a-z]{2,}$/.test(etki);
  } catch (_) {
    return false;
  }
}

function temizTaban(ad) {
  if (!ad) return '';
  try {
    const u = new URL(/^https?:\/\//i.test(ad) ? ad : `https://${ad}`);
    return `${u.protocol}//${u.host}`;
  } catch (_) {
    return '';
  }
}

async function remoteConfigTaban() {
  if (onbellek.taban && Date.now() - onbellek.zaman < ADRES_TTL_MS) return onbellek.taban;
  try {
    const res = await fetch(
      `https://firebaseremoteconfig.googleapis.com/v1/projects/${RC_PROJE}/namespaces/firebase:fetch?key=${RC_ANAHTAR}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          'X-Goog-Api-Key': RC_ANAHTAR,
          'X-Android-Package': RC_PAKET,
          'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 13; SM-S901B)'
        },
        body: JSON.stringify({
          appId: RC_APPID,
          appInstanceId: 'cp-polaris-edge',
          appBuild: '160',
          packageName: RC_PAKET,
          countryCode: 'TR',
          languageCode: 'tr-TR',
          platformVersion: '33',
          sdkVersion: '21.4.1'
        }),
        signal: AbortSignal.timeout(7000)
      }
    );
    const veri = await res.json().catch(() => null);
    const girdiler = (veri && veri.entries) || {};
    const taban = [girdiler.api_url, girdiler.api_url_1, girdiler.api_url_son, girdiler.rectv_domain]
      .map(temizTaban)
      .find((t) => t && aileUygunMu(t));
    if (taban) onbellek = { taban, zaman: Date.now() };
  } catch (_) { /* yedeğe düş */ }
  return onbellek.taban || '';
}

export default async function handler(request) {
  const blockedResponse = guardEdgeRequest(request, { limit: 180, bucket: 'rtv' });
  if (blockedResponse) return blockedResponse;
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
        'Access-Control-Allow-Headers': '*'
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

    // --- taban adres çözümlemesi (sabit adres artık zorunlu değil) ---
    const istemciAdres = request.headers.get('x-rtv-base');
    if (istemciAdres && !aileUygunMu(istemciAdres)) {
      return new Response(JSON.stringify({ error: 'invalid-rtv-base' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }
      });
    }
    const ortamAdres = temizTaban(process.env.CP_RTV_BASE || '');
    const rcAdres = await remoteConfigTaban();
    const taban =
      (istemciAdres && temizTaban(istemciAdres)) ||
      (ortamAdres && aileUygunMu(ortamAdres) ? ortamAdres : '') ||
      rcAdres ||
      ADRES_YEDEK;

    const targetUrl = `${taban}/api${subPath}${queryString}`;

    const forwardHeaders = new Headers();
    // RecTV sunucusu okhttp UA'sı + kendi site Referer/Origin'i istiyor;
    // #EXTM3U ve imzalı uçlar ancak böyle dönüyor.
    forwardHeaders.set('user-agent', 'okhttp/4.12.0');
    forwardHeaders.set('referer', `${taban}/`);
    forwardHeaders.set('origin', taban);

    for (const [k, v] of request.headers.entries()) {
      const lk = k.toLowerCase();
      // Host/UA/Referer/Origin vekil tarafından kurulur; x-rtv-* vekilin işidir.
      if (lk === 'host' || lk === 'origin' || lk === 'referer' || lk === 'user-agent'
        || lk === 'x-rtv-path' || lk === 'x-rtv-base' || lk === 'cookie') continue;
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
    responseHeaders.set('Access-Control-Allow-Origin', '*');
    responseHeaders.set('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
    responseHeaders.set('Access-Control-Allow-Headers', '*');
    responseHeaders.set('Content-Type', upstreamRes.headers.get('content-type') || 'application/json');
    // Vekilin hangi adrese gittiği istemciye yalnız başlıkla bildirilir (gövde şekli değişmez).
    responseHeaders.set('x-rtv-resolved', new URL(taban).hostname);

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
