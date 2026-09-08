/* ==========================================================================
   CinePulse Studio - RecTV 19.6 Autonomous VIP Service
   100% Reverse Engineered Authentication & Handshake Pipeline:
   - Native HMAC-SHA256 Request Signing (libnative-secrets)
   - RSA-2048 Hardware-Backed Attestation Handshake
   - Device Approval Token (JWT) Lifecycle Management
   - Hardware AES-256-GCM Stream URL Decryption
   - Ultra-Fast Direct HLS Master (.m3u8) Streaming with ZERO ADS
   ========================================================================== */

const HMAC_KEY_HEX = '3508611138826751fdf77beaa6f93eb93fd27e6a5acb910e7aad22665513dd6e';
const STREAM_ENC_KEY_HEX = '666482389dc76bfa57068407418f7dac9f6c14b6868856b169165b9fac7d812e';
const SW_KEY = '4F5A9C3D9A86FA54EACEDDD635185/c3c5bd17-e37b-4b94-a944-8a3688a30452';
const APK_SIG_SHA256_B64URL = 'aLhsnd71BqsMC_HZoT8MR_TrfZS1_WcAzYT5nROaUKI';

// Pre-registered RSA-2048 device credentials
const DEVICE_PRIV_KEY_B64 = 'MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDq5iorf3BOWNqObZFRyco/sa7GrDO5r094yhO1FsWRvwoTRneD1ryv+yVLwJrr0IOmjhD2hgyErvs6XRhAmNa18fcMlHJqHlghHA0dt2FnkFlqlZ029/w1inZ8+g5XFjffNp8Xb5T44PrsowlI5Mjfe0JpkHCN20tLkmGdMUes9yQNbKwpUXvBPq/bLYn8IJNoR/kP/4mis7mMeRzWgIupc9AlFx6HH7IZ6NfYmyqDdo7xdSg+WNl/rcuYcPccuN6dIhqWeceSOFiChaGHJMtuEzbHHefRqbK529eNHVTpUmRtfaZu2a+DRXkoz2TU1KCrnSDuNztvlKjiztiJZMdlAgMBAAECggEACCjTmSw1lfsfKGhk7l7gkCLXa95Kc65Dx/HZCmbOmRf2PSIq/6DjcAd8zatUllFpaU0xCKcyYx+C6Y2XTJMijjJn/v9fFBGWxRuo1vnqP8MzX/Dvg5vMnn1/TSsQeXTznuTSVOmS1qxV+wdUyLvtwFmTPoB+cGcIMAlXK7MtBrSD9kCRcpJZgFNUILhn6ISm9NpaqU+5xBBuJRsXaMDvSUTHi1IKK2ZUneetFAgg6BVE5StmORBjMgXfNRIsD+oOHUvtsEczcHnAP2hW19I0lXfwnLhaAicKIECCDpn6cwfBtQWnSDSENCLMemM2O8KYvAizBW4ET3BZBqSDrZEzRwKBgQD/9o7qbE2LEJ19Mkg+4PTqMJ06bFWKUvUB3JuS4Iu/wy9u6tAU7uQySo9vSDDclG8TaDjkz6c2eTmDy7LdFESwLgiHV6cmpm0sieoTMaz1pVkpykifQo1fv2Q60t/co6oEyUWfmdk3iaK6j3MFhjqRpkmZcUYvBYyuRUv8ewKtcwKBgQDq7tRYL2c6cIznwqTJdLuap3eFRP21ymjV/TTp2DrZtVevw9rNYflDK88mIxZdbbAqPT10zbRc3UnqeE2+76UKBAodUJpSPXg2WvA0hZe57q1VnU7gQhMgvDWRPrTG7qbij+FnRtPHWZ1HGLFfl2DSDnFEVsJo2xXQjw5vMTOBxwKBgQDlbKQQ7t5aRZxD+WvUIGKl/skO8seBYnYFIy226tmYGmVLr+Cuwql7gmUqQ7S4Ibul04cbYBzqsKGixlQd4OroV3qBhUlnVUkJ4NwUNDRpQbm3wX5ycX6yUaSPLTBGXdQo0hc7xPRz2UQooCdizjt1DW1uwZ88ymacVbSUK9XsjQKBgGTNhR8xd8GDeXIX+kzWYYjCQm5UY+gUqVboBkQwG1A+lxk7mC5301QXABMFCxubbPMyw6PSf4k5CfYpGHLMsKvTf+OEKjMPXP01l8txZuDIoGcT0Dw5Hav2FaX0meyhicm8oqKFqWjn8qwG1FSHx2tZ9w+zikcjegC64R6kpc0RAoGAO4/tqaXM5CUUWtHanK/1j6KYbFqsKL13FeqIr8TprF4LXpzrzFAPMCmWL6XFq8JZqZj/KNjH9vvt9f7/9QMvI4nZ+0vXihRqdX7LO+XliGRhuXjHp3RlUU4s8eJt9Af7PCFWFX0gwfM8SnkVUTkE3tOQHgk7hM3PUOPH0yZ+gQ8=';
const DEVICE_CERT_CHAIN_B64URL = 'MIIDDDCCAfSgAwIBAgIJYFwVX3W1KCXxMA0GCSqGSIb3DQEBCwUAMBgxFjAUBgNVBAMMDWF0dGVzdF9yc2FfdjEwHhcNMjYwOTA4MTUwMjMyWhcNMjcwOTA4MTUwMjMyWjAYMRYwFAYDVQQDDA1hdHRlc3RfcnNhX3YxMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA6uYqK39wTljajm2RUcnKP7Guxqwzua9PeMoTtRbFkb8KE0Z3g9a8r_slS8Ca69CDpo4Q9oYMhK77Ol0YQJjWtfH3DJRyah5YIRwNHbdhZ5BZapWdNvf8NYp2fPoOVxY33zafF2-U-OD67KMJSOTI33tCaZBwjdtLS5JhnTFHrPckDWysKVF7wT6v2y2J_CCTaEf5D_-JorO5jHkc1oCLqXPQJRcehx-yGejX2Jsqg3aO8XUoPljZf63LmHD3HLjenSIalnnHkjhYgoWhhyTLbhM2xx3n0amyudvXjR1U6VJkbX2mbtmvg0V5KM9k1NSgq50g7jc7b5So4s7YiWTHZQIDAQABo1kwVzAMBgNVHRMBAf8EAjAAMA4GA1UdDwEB_wQEAwIFoDAdBgNVHSUEFjAUBggrBgEFBQcDAQYIKwYBBQUHAwIwGAYDVR0RBBEwD4INYXR0ZXN0X3JzYV92MTANBgkqhkiG9w0BAQsFAAOCAQEAREcHgi7mZGgOpu1jBzN89IJIdMSRjYI5AYwhePByZy7U4SOeqq5WTXPsOZdUjGyib1CJzvs44ro8_L9hLfeJCzNTRk9yyAt_EJ6QHAqdyMIBwNSSb3wDg6N7T4x4MJrgoHJ7uRf2iGEdMfazb2aZFyHQjyt4paUCrix5jt7FXY_02pyEQWPLYQb8U6nf8strd4nNdrm9EPAEF7zY7ZXD5L8egXvTkdmvsBRU5OQLftw1JaPkLu85zMQ2hZtscmCQ2ImxxwBlUqS7V_QmaMFHkdJrWQdXF7vU2Ws0qv3qBU7-FJgqGUSuDMFw7sMeeWuVKvg7WjSxolwPZrqIo6ZSUA';

// Base64 & Base64Url Helpers
function toBase64Url(uint8) {
  let bin = '';
  for (let i = 0; i < uint8.length; i++) bin += String.fromCharCode(uint8[i]);
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function fromBase64Url(str) {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) base64 += '=';
  const bin = atob(base64);
  const buf = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
  return buf;
}

function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  }
  return bytes;
}

function bytesToHex(bytes) {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

// SHA-256 via Web Crypto
async function sha256Hex(str) {
  const data = new TextEncoder().encode(str);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return bytesToHex(new Uint8Array(digest));
}

// HMAC-SHA256 via Web Crypto
async function hmacSha256Hex(keyHex, message) {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(keyHex),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const sigBuf = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return bytesToHex(new Uint8Array(sigBuf));
}

// Generates RecTV okhttp HMAC headers
async function createHmacHeaders(method, pathUrl, bodyStr = '') {
  const ts = Math.floor(Date.now() / 1000).toString();
  const nonce = (typeof crypto.randomUUID === 'function') 
    ? crypto.randomUUID() 
    : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0;
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
      });

  const bodyHash = await sha256Hex(bodyStr);
  const payloadToSign = `${method}\n${pathUrl}\n${ts}\n${nonce}\n${bodyHash}`;
  const sig = await hmacSha256Hex(HMAC_KEY_HEX, payloadToSign);

  return {
    'user-agent': 'okhttp/4.12.0',
    'X-Timestamp': ts,
    'X-Nonce': nonce,
    'X-Signature': sig,
    'X-App-Version': '110',
    'X-Client-Id': 'rectv-android'
  };
}

let cachedRsaKey = null;
async function getRsaPrivateKey() {
  if (cachedRsaKey) return cachedRsaKey;
  const rawBin = atob(DEVICE_PRIV_KEY_B64);
  const der = new Uint8Array(rawBin.length);
  for (let i = 0; i < rawBin.length; i++) der[i] = rawBin.charCodeAt(i);

  cachedRsaKey = await crypto.subtle.importKey(
    'pkcs8',
    der,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  );
  return cachedRsaKey;
}

// In-Memory JWT Cache
let memoryJwt = null;
let memoryJwtExp = 0;

const isNodeEnv = typeof window === 'undefined';
function getRtvFetchUrl(subPath) {
  return isNodeEnv ? `https://a.prectv70.lol/api${subPath}` : `/api/rtv${subPath}`;
}

/**
 * Ensures a valid RecTV JWT token via RSA Key Attestation
 */
export async function getValidRecTvJwt() {
  const now = Math.floor(Date.now() / 1000);
  if (memoryJwt && memoryJwtExp > now + 120) {
    return memoryJwt;
  }

  // Check localStorage if available
  if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem('rectv_jwt_token');
    const exp = parseInt(localStorage.getItem('rectv_jwt_exp') || '0', 10);
    if (stored && exp > now + 120) {
      memoryJwt = stored;
      memoryJwtExp = exp;
      return stored;
    }
  }

  try {
    // 1. GET /api/attest/nonce
    const noncePath = '/api/attest/nonce';
    const nonceHeaders = await createHmacHeaders('GET', noncePath, '');
    const nonceRes = await fetch(getRtvFetchUrl('/attest/nonce'), {
      method: 'GET',
      headers: nonceHeaders
    });

    if (!nonceRes.ok) {
      throw new Error(`Nonce request failed with status ${nonceRes.status}`);
    }

    const nonceData = await nonceRes.json();
    const serverNonce = nonceData.nonce;
    if (!serverNonce) throw new Error('Empty nonce returned');

    // 2. Decode nonce and sign with RSA private key (SHA256withRSA)
    const nonceBytes = fromBase64Url(serverNonce);
    const rsaKey = await getRsaPrivateKey();
    const proofSigBuf = await crypto.subtle.sign('RSASSA-PKCS1-v1_5', rsaKey, nonceBytes);
    const proofB64Url = toBase64Url(new Uint8Array(proofSigBuf));

    // 3. Send POST /api/attest/verify
    const verifyPath = '/api/attest/verify';
    const verifyReqBody = JSON.stringify({
      certChain: [DEVICE_CERT_CHAIN_B64URL],
      nonce: serverNonce,
      pkg: 'com.rectv.shot',
      proof: proofB64Url,
      sig: APK_SIG_SHA256_B64URL
    });

    const verifyHeaders = {
      ...(await createHmacHeaders('POST', verifyPath, verifyReqBody)),
      'Content-Type': 'application/json'
    };

    const verifyRes = await fetch(getRtvFetchUrl('/attest/verify'), {
      method: 'POST',
      headers: verifyHeaders,
      body: verifyReqBody
    });

    if (!verifyRes.ok) {
      throw new Error(`Verify attestation failed with status ${verifyRes.status}`);
    }

    const verifyData = await verifyRes.json();
    if (!verifyData.jwt) throw new Error('Verify did not return JWT');

    memoryJwt = verifyData.jwt;
    memoryJwtExp = verifyData.exp || (now + 7200);

    if (typeof localStorage !== 'undefined') {
      try {
        localStorage.setItem('rectv_jwt_token', memoryJwt);
        localStorage.setItem('rectv_jwt_exp', memoryJwtExp.toString());
      } catch (_) {}
    }

    return memoryJwt;
  } catch (err) {
    console.warn('[RecTV] Attestation error:', err.message);
    return null;
  }
}

// AES-256-GCM Stream Decryption
let cachedAesKey = null;
async function getAesCryptoKey() {
  if (cachedAesKey) return cachedAesKey;
  const keyBytes = hexToBytes(STREAM_ENC_KEY_HEX);
  cachedAesKey = await crypto.subtle.importKey('raw', keyBytes, { name: 'AES-GCM' }, false, ['decrypt']);
  return cachedAesKey;
}

export async function decryptRecTvStreamUrl(encB64) {
  if (!encB64) return '';
  if (encB64.startsWith('http://') || encB64.startsWith('https://')) return encB64;

  try {
    const bin = atob(encB64);
    const data = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) data[i] = bin.charCodeAt(i);

    const iv = data.slice(0, 12);
    const ctAndTag = data.slice(12);

    const cryptoKey = await getAesCryptoKey();
    const decBuf = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv, tagLength: 128 },
      cryptoKey,
      ctAndTag
    );
    const decUrl = new TextDecoder('utf-8').decode(decBuf);
    return decUrl;
  } catch (e) {
    console.warn('[RecTV] Stream URL Decryption failed:', e.message);
    return '';
  }
}

// Authenticated TVR (RecTV) API Request Helper
async function recTvApiRequest(apiPath, method = 'GET', bodyStr = '') {
  const jwt = await getValidRecTvJwt();
  if (!jwt) return null;

  const fullPath = `/api${apiPath}`;
  const hmacHeaders = await createHmacHeaders(method, fullPath, bodyStr);
  const headers = {
    ...hmacHeaders,
    'Authorization': `Bearer ${jwt}`,
    ...(bodyStr ? { 'Content-Type': 'application/json' } : {})
  };

  try {
    const res = await fetch(getRtvFetchUrl(apiPath), {
      method,
      headers,
      ...(bodyStr ? { body: bodyStr } : {})
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (_) {}
  return null;
}

function normalizeTitle(t) {
  if (!t) return '';
  return t
    .toLowerCase()
    .replace(/[^a-z0-9\s]/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Searches and extracts direct HLS streams from TVR (RecTV) for Movies and Series
 * Strictly camouflaged as TVR.
 */
export async function fetchRecTvSources({
  type = 'movie',
  title = '',
  originalTitle = '',
  season = 1,
  episode = 1,
  year = null
}) {
  const query = (title || originalTitle || '').trim();
  if (!query) return [];
  // Normalize season/episode to integers to avoid string vs number comparison bugs
  const seasonNum = parseInt(season, 10) || 1;
  const episodeNum = parseInt(episode, 10) || 1;

  try {
    let searchRes = await recTvApiRequest(`/search/${encodeURIComponent(query)}/${SW_KEY}/`);
    if ((!searchRes || !Array.isArray(searchRes.posters) || searchRes.posters.length === 0) && originalTitle && originalTitle.toLowerCase() !== query.toLowerCase()) {
      searchRes = await recTvApiRequest(`/search/${encodeURIComponent(originalTitle.trim())}/${SW_KEY}/`);
    }

    if (!searchRes || !Array.isArray(searchRes.posters) || searchRes.posters.length === 0) {
      return [];
    }

    const normQuery = normalizeTitle(query);
    const normOrig = normalizeTitle(originalTitle);
    const isMovie = type === 'movie';

    // Find best matching item
    let match = null;
    for (const item of searchRes.posters) {
      const itemTitle = normalizeTitle(item.title);
      const isTargetType = isMovie ? item.type === 'movie' : item.type === 'serie';
      if (!isTargetType) continue;

      if (
        itemTitle === normQuery || 
        itemTitle === normOrig || 
        itemTitle.includes(normQuery) || 
        normQuery.includes(itemTitle) ||
        (normOrig && (itemTitle.includes(normOrig) || normOrig.includes(itemTitle)))
      ) {
        match = item;
        break;
      }
    }

    if (!match) return [];

    const streams = [];

    if (isMovie) {
      // Movie sources are directly in match.sources
      if (Array.isArray(match.sources)) {
        for (const s of match.sources) {
          if (!s.enc_url && !s.url) continue;
          const rawUrl = s.enc_url ? await decryptRecTvStreamUrl(s.enc_url) : s.url;
          if (!rawUrl || !rawUrl.startsWith('http')) continue;

          // Wrap through HLS proxy for rock-solid Cloudflare bypass and CORS
          const proxiedUrl = `/api/hls_proxy?url=${encodeURIComponent(rawUrl)}&ref=https://a.prectv70.lol/`;
          const isDub = (s.title || '').toLowerCase().includes('dublaj') || (match.label || '').toLowerCase().includes('dublaj');
          const label = isDub ? '🇹🇷 TVR VIP (TR Dublaj)' : '⚡ TVR VIP (TR Altyazı)';

          streams.push({
            id: `tvr_movie_${match.id}_${s.id}`,
            name: label,
            displayName: label,
            badge: '⚡ TVR VIP',
            source: 'TVR VIP',
            url: proxiedUrl,
            streamUrl: proxiedUrl,
            rawStreamUrl: rawUrl,
            quality: '1080p HD',
            isHls: true,
            isDirectVideo: true,
            priority: 0,
            getUrl: () => proxiedUrl
          });
        }
      }
    } else {
      // Series: fetch seasons -> match season and episode
      const seasons = await recTvApiRequest(`/season/by/serie/${match.id}/${SW_KEY}/`);
      if (Array.isArray(seasons)) {
        for (const s of seasons) {
          const sTitle = (s.title || s.name || '').toLowerCase();
          const sNumMatch = sTitle.match(/(\d+)/) || [];
          const sNum = sNumMatch[1] ? parseInt(sNumMatch[1], 10) : (parseInt(s.number || s.season_number || s.num || '0', 10) || 1);
          if (sNum !== seasonNum) continue;

          const isDub = sTitle.includes('dublaj') || (s.label || '').toLowerCase().includes('dublaj');

          // Episodes may be embedded in the season object or require a separate fetch
          let episodes = Array.isArray(s.episodes) ? s.episodes : null;
          if (!episodes || episodes.length === 0) {
            const epRes = await recTvApiRequest(`/episode/by/season/${s.id}/${SW_KEY}/`);
            if (Array.isArray(epRes)) episodes = epRes;
            else if (epRes && Array.isArray(epRes.episodes)) episodes = epRes.episodes;
          }

          if (!Array.isArray(episodes) || episodes.length === 0) continue;

          for (const ep of episodes) {
            const epTitle = (ep.title || ep.name || '').toLowerCase();
            const epNumMatch = epTitle.match(/(\d+)/) || [];
            const epNum = epNumMatch[1] 
              ? parseInt(epNumMatch[1], 10) 
              : (parseInt(ep.number || ep.episode_number || ep.num || '0', 10) || 1);
            if (epNum !== episodeNum) continue;

            // Sources may be in ep.sources, ep.videos, or fetched separately
            let sources = Array.isArray(ep.sources) ? ep.sources 
              : Array.isArray(ep.videos) ? ep.videos 
              : Array.isArray(ep.streams) ? ep.streams : [];

            if (sources.length === 0 && ep.id) {
              const srcRes = await recTvApiRequest(`/source/by/episode/${ep.id}/${SW_KEY}/`);
              if (Array.isArray(srcRes)) sources = srcRes;
              else if (srcRes && Array.isArray(srcRes.sources)) sources = srcRes.sources;
            }

            for (const src of sources) {
              const encField = src.enc_url || src.encUrl || src.encrypted_url;
              const plainField = src.url || src.stream_url || src.video || src.link || src.source;
              if (!encField && !plainField) continue;
              const rawUrl = encField ? await decryptRecTvStreamUrl(encField) : plainField;
              if (!rawUrl || !rawUrl.startsWith('http')) continue;

              const proxiedUrl = `/api/hls_proxy?url=${encodeURIComponent(rawUrl)}&ref=https://a.prectv70.lol/`;
              const srcIsDub = isDub || (src.title || src.name || '').toLowerCase().includes('dublaj');
              const label = srcIsDub
                ? `🇹🇷 TVR S${seasonNum}E${episodeNum} (TR Dublaj)`
                : `⚡ TVR S${seasonNum}E${episodeNum} (TR Altyazı)`;

              streams.push({
                id: `tvr_ep_${match.id}_${ep.id || ep.number}_${src.id || rawUrl.slice(-8)}`,
                name: label,
                displayName: label,
                badge: '⚡ TVR VIP',
                source: 'TVR VIP',
                url: proxiedUrl,
                streamUrl: proxiedUrl,
                rawStreamUrl: rawUrl,
                quality: '1080p HD',
                isHls: true,
                isDirectVideo: true,
                priority: 0,
                getUrl: () => proxiedUrl
              });
            }
          }
        }
      }
    }

    return streams;
  } catch (err) {
    console.warn('[TVR] Fetch sources failed:', err.message);
    return [];
  }
}

/**
 * Fetches all unlocked TVR (RecTV) Live Channels (Sports, Cinema, Docs, etc.)
 */
export async function fetchRecTvLiveChannels() {
  try {
    const channels = [];
    // Category 1: Spor, Category 6: Sinema, Category 2: Belgesel, Category 7: Çocuk
    const targetCats = [1, 6, 2, 7];

    for (const catId of targetCats) {
      const list = await recTvApiRequest(`/channel/by/filtres/${catId}/0/0/${SW_KEY}/`);
      if (!Array.isArray(list)) continue;

      for (const ch of list) {
        const detail = await recTvApiRequest(`/channel/by/${ch.id}/${SW_KEY}/`);
        if (!detail || !Array.isArray(detail.sources)) continue;

        const src = detail.sources.find(s => !s.locked && (s.enc_url || s.url));
        if (!src) continue;

        const rawUrl = src.enc_url ? await decryptRecTvStreamUrl(src.enc_url) : src.url;
        if (!rawUrl || !rawUrl.startsWith('http')) continue;

        const proxiedUrl = `/api/hls_proxy?url=${encodeURIComponent(rawUrl)}&ref=https://a.prectv70.lol/`;
        const catName = catId === 1 ? 'sports' : (catId === 6 ? 'national' : (catId === 2 ? 'doc' : 'kids'));

        channels.push({
          id: `tvr_ch_${ch.id}`,
          name: ch.title,
          category: catName,
          logo: ch.image || '',
          quality: '1080p HD',
          streamUrl: proxiedUrl,
          rawStreamUrl: rawUrl
        });
      }
    }

    return channels;
  } catch (err) {
    console.warn('[TVR] Fetch live channels failed:', err.message);
    return [];
  }
}
