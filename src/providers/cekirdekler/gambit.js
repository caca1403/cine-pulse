/* ==========================================================================
   CinePulse — "Gambit" çekirdeği (birinci taraf) — TVR/RecTV hosted API
   --------------------------------------------------------------------------
   Eylül 29 (6baa792) hosted-API servisi rectvService.js'ten geri getirildi
   (kullanıcı isteği 2026-11-17): Android istemcisinin kendi (repoda git
   geçmişinde duran, ödeme/anahtar SATIN ALMA İÇERMEYEN) cihaz kimliğiyle
   konuşan HMAC imzalı API. Çıktı DOĞRUDAN AES-256-GCM şifre çözülü m3u8 —
   iframe/embed YOK.
   Ölçülen zincir (Eylül kanıtı) + çevrimdışı sözleşme testi:
     • İmza:   her istekte okhttp/4.12.0 başlıklarıyla
       X-Timestamp / X-Nonce / X-Signature = HMAC-SHA256(anahtar,
       "METHOD\n/api<path>\n<ts>\n<nonce>\n<sha256(gövde)>") + X-App-Version.
     • Attestasyon (best-effort): /api/attest/nonce → RSA-2048(PKCS1) imza →
       /api/attest/verify → JWT. Düşerse akış JWT'siz DENENİR; 5 dk ceza
       penceresiyle tekrar denemez.
     • Film:  GET /api/search/<başlık>/<SW_KEY>/ → posters[] →
       sources[].enc_url (base64: IV(12) + AES-256-GCM(şifreli adres) + TAG).
     • Dizi:  /api/season/by/serie/<id>/<SW_KEY>/ → /api/episode/by/season/...
       → /api/source/by/episode/<eid>/<SW_KEY>/.
   CDN adresleri Referer ister → satırlara headers eklenir; vekil bunu
   /api/hls_proxy üzerinden oynatır (ham URL sözleşmesi korunur).
   Hata ağının hiçbir yerinde throw YOK: her sapma → [] (vekil sözleşmesi).
   ========================================================================== */

import { tmdbBilgi, adayBasliklar, slugPuani } from '../ortakCekirdek.js';
import { jsonAl } from '../ortakCekirdek.js';

const TABAN = 'https://a.prectv70.lol';

/* Reponun kendi git geçmişindeki (6baa792) Android istemci sabitleri —
   kullanıcı ödeme anahtarı DEĞİL, uygulamanın kamuya açık reverse-engineered
   parmak izleri. Eylül servisiyle birebir aynı olmalı. */
const HMAC_KEY_HEX = '3508611138826751fdf77beaa6f93eb93fd27e6a5acb910e7aad22665513dd6e';
const STREAM_ENC_KEY_HEX = '666482389dc76bfa57068407418f7dac9f6c14b6868856b169165b9fac7d812e';
const SW_KEY = '4F5A9C3D9A86FA54EACEDDD635185/c3c5bd17-e37b-4b94-a944-8a3688a30452';
const APK_SIG_SHA256_B64URL = 'aLhsnd71BqsMC_HZoT8MR_TrfZS1_WcAzYT5nROaUKI';
const DEVICE_PRIV_KEY_B64 = 'MIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDq5iorf3BOWNqObZFRyco/sa7GrDO5r094yhO1FsWRvwoTRneD1ryv+yVLwJrr0IOmjhD2hgyErvs6XRhAmNa18fcMlHJqHlghHA0dt2FnkFlqlZ029/w1inZ8+g5XFjffNp8Xb5T44PrsowlI5Mjfe0JpkHCN20tLkmGdMUes9yQNbKwpUXvBPq/bLYn8IJNoR/kP/4mis7mMeRzWgIupc9AlFx6HH7IZ6NfYmyqDdo7xdSg+WNl/rcuYcPccuN6dIhqWeceSOFiChaGHJMtuEzbHHefRqbK529eNHVTpUmRtfaZu2a+DRXkoz2TU1KCrnSDuNztvlKjiztiJZMdlAgMBAAECggEACCjTmSw1lfsfKGhk7l7gkCLXa95Kc65Dx/HZCmbOmRf2PSIq/6DjcAd8zatUllFpaU0xCKcyYx+C6Y2XTJMijjJn/v9fFBGWxRuo1vnqP8MzX/Dvg5vMnn1/TSsQeXTznuTSVOmS1qxV+wdUyLvtwFmTPoB+cGcIMAlXK7MtBrSD9kCRcpJZgFNUILhn6ISm9NpaqU+5xBBuJRsXaMDvSUTHi1IKK2ZUneetFAgg6BVE5StmORBjMgXfNRIsD+oOHUvtsEczcHnAP2hW19I0lXfwnLhaAicKIECCDpn6cwfBtQWnSDSENCLMemM2O8KYvAizBW4ET3BZBqSDrZEzRwKBgQD/9o7qbE2LEJ19Mkg+4PTqMJ06bFWKUvUB3JuS4Iu/wy9u6tAU7uQySo9vSDDclG8TaDjkz6c2eTmDy7LdFESwLgiHV6cmpm0sieoTMaz1pVkpykifQo1fv2Q60t/co6oEyUWfmdk3iaK6j3MFhjqRpkmZcUYvBYyuRUv8ewKtcwKBgQDq7tRYL2c6cIznwqTJdLuap3eFRP21ymjV/TTp2DrZtVevw9rNYflDK88mIxZdbbAqPT10zbRc3UnqeE2+76UKBAodUJpSPXg2WvA0hZe57q1VnU7gQhMgvDWRPrTG7qbij+FnRtPHWZ1HGLFfl2DSDnFEVsJo2xXQjw5vMTOBxwKBgQDlbKQQ7t5aRZxD+WvUIGKl/skO8seBYnYFIy226tmYGmVLr+Cuwql7gmUqQ7S4Ibul04cbYBzqsKGixlQd4OroV3qBhUlnVUkJ4NwUNDRpQbm3wX5ycX6yUaSPLTBGXdQo0hc7xPRz2UQooCdizjt1DW1uwZ88ymacVbSUK9XsjQKBgGTNhR8xd8GDeXIX+kzWYYjCQm5UY+gUqVboBkQwG1A+lxk7mC5301QXABMFCxubbPMyw6PSf4k5CfYpGHLMsKvTf+OEKjMPXP01l8txZuDIoGcT0Dw5Hav2FaX0meyhicm8oqKFqWjn8qwG1FSHx2tZ9w+zikcjegC64R6kpc0RAoGAO4/tqaXM5CUUWtHanK/1j6KYbFqsKL13FeqIr8TprF4LXpzrzFAPMCmWL6XFq8JZqZj/KNjH9vvt9f7/9QMvI4nZ+0vXihRqdX7LO+XliGRhuXjHp3RlUU4s8eJt9Af7PCFWFX0gwfM8SnkVUTkE3tOQHgk7hM3PUOPH0yZ+gQ8=';
const DEVICE_CERT_CHAIN_B64URL = 'MIIDDDCCAfSgAwIBAgIJYFwVX3W1KCXxMA0GCSqGSIb3DQEBCwUAMBgxFjAUBgNVBAMMDWF0dGVzdF9yc2FfdjEwHhcNMjYwOTA4MTUwMjMyWhcNMjcwOTA4MTUwMjMyWjAYMRYwFAYDVQQDDA1hdHRlc3RfcnNhX3YxMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA6uYqK39wTljajm2RUcnKP7Guxqwzua9PeMoTtRbFkb8KE0Z3g9a8r_slS8Ca69CDpo4Q9oYMhK77Ol0YQJjWtfH3DJRyah5YIRwNHbdhZ5BZapWdNvf8NYp2fPoOVxY33zafF2-U-OD67KMJSOTI33tCaZBwjdtLS5JhnTFHrPckDWysKVF7wT6v2y2J_CCTaEf5D_-JorO5jHkc1oCLqXPQJRcehx-yGejX2Jsqg3aO8XUoPljZf63LmHD3HLjenSIalnnHkjhYgoWhhyTLbhM2xx3n0amyudvXjR1U6VJkbX2mbtmvg0V5KM9k1NSgq50g7jc7b5So4s7YiWTHZQIDAQABo1kwVzAMBgNVHRMBAf8EAjAAMA4GA1UdDwEB_wQEAwIFoDAdBgNVHSUEFjAUBggrBgEFBQcDAQYIKwYBBQUHAwIwGAYDVR0RBBEwD4INYXR0ZXN0X3JzYV92MTANBgkqhkiG9w0BAQsFAAOCAQEAREcHgi7mZGgOpu1jBzN89IJIdMSRjYI5AYwhePByZy7U4SOeqq5WTXPsOZdUjGyib1CJzvs44ro8_L9hLfeJCzNTRk9yyAt_EJ6QHAqdyMIBwNSSb3wDg6N7T4x4MJrgoHJ7uRf2iGEdMfazb2aZFyHQjyt4paUCrix5jt7FXY_02pyEQWPLYQb8U6nf8strd4nNdrm9EPAEF7zY7ZXD5L8egXvTkdmvsBRU5OQLftw1JaPkLu85zMQ2hZtscmCQ2ImxxwBlUqS7V_QmaMFHkdJrWQdXF7vU2Ws0qv3qBU7-FJgqGUSuDMFw7sMeeWuVKvg7WjSxolwPZrqIo6ZSUA';

/* ── Bayt/temel kodlama yardımcıları (WebCrypto her ortamda: Node 18+, WebView) ── */
function toBase64Url(bayt) {
  let ikili = '';
  for (let i = 0; i < bayt.length; i += 1) ikili += String.fromCharCode(bayt[i]);
  return btoa(ikili).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}
function fromBase64Url(str) {
  let b64 = String(str).replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4) b64 += '=';
  const ikili = atob(b64);
  const buf = new Uint8Array(ikili.length);
  for (let i = 0; i < ikili.length; i += 1) buf[i] = ikili.charCodeAt(i);
  return buf;
}
function hexToBytes(hex) {
  const bayt = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bayt.length; i += 1) bayt[i] = parseInt(hex.substr(i * 2, 2), 16);
  return bayt;
}
function bytesToHex(bayt) {
  return Array.from(bayt).map(b => b.toString(16).padStart(2, '0')).join('');
}
function base64ToBytes(b64) {
  const ikili = atob(b64);
  const buf = new Uint8Array(ikili.length);
  for (let i = 0; i < ikili.length; i += 1) buf[i] = ikili.charCodeAt(i);
  return buf;
}

async function sha256Hex(metin) {
  const ozet = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(metin));
  return bytesToHex(new Uint8Array(ozet));
}
async function hmacSha256Hex(anahtarHex, mesaj) {
  const kodlayici = new TextEncoder();
  const anahtar = await crypto.subtle.importKey(
    'raw', kodlayici.encode(anahtarHex), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const imza = await crypto.subtle.sign('HMAC', anahtar, kodlayici.encode(mesaj));
  return bytesToHex(new Uint8Array(imza));
}

/** okhttp/4.12.0 imza başlıkları: Eylül rectvService ile BİREBİR şema. */
async function imzaBasliklari(yontem, yol, govde = '') {
  const ts = Math.floor(Date.now() / 1000).toString();
  const nonce = (typeof crypto.randomUUID === 'function')
    ? crypto.randomUUID()
    : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0;
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
      });
  const govdeOzeti = await sha256Hex(govde);
  const imzalanacak = `${yontem}\n${yol}\n${ts}\n${nonce}\n${govdeOzeti}`;
  const imza = await hmacSha256Hex(HMAC_KEY_HEX, imzalanacak);
  return {
    'user-agent': 'okhttp/4.12.0',
    'X-Timestamp': ts,
    'X-Nonce': nonce,
    'X-Signature': imza,
    'X-App-Version': '110',
    'X-Client-Id': 'rectv-android',
  };
}

/* ── Best-effort RSA cihaz attestasyonu (JWT) ──────────────────────────── */
let rsaAnahtari = null;
async function rsaGizliAnahtar() {
  if (rsaAnahtari) return rsaAnahtari;
  rsaAnahtari = await crypto.subtle.importKey(
    'pkcs8', base64ToBytes(DEVICE_PRIV_KEY_B64),
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']
  );
  return rsaAnahtari;
}

let hafizaJeton = null;
let hafizaJetonBitis = 0;
let sonAttestasyonBasarisizligi = 0;

async function attestasyonJetonu() {
  const simdi = Math.floor(Date.now() / 1000);
  if (hafizaJeton && hafizaJetonBitis > simdi + 120) return hafizaJeton;
  try {
    if (typeof localStorage !== 'undefined') {
      const kayitli = localStorage.getItem('rectv_jwt_token');
      const bitis = parseInt(localStorage.getItem('rectv_jwt_exp') || '0', 10);
      if (kayitli && bitis > simdi + 120) {
        hafizaJeton = kayitli; hafizaJetonBitis = bitis;
        return kayitli;
      }
    }
  } catch (_) { /* storage yoksa bellek yeterli */ }
  if (Date.now() - sonAttestasyonBasarisizligi < 300000) return null; // 5 dk ceza
  try {
    const nonceVeri = await jsonAl(`${TABAN}/api/attest/nonce`, {
      basliklar: await imzaBasliklari('GET', '/api/attest/nonce', ''), ms: 6000,
    });
    const sunucuNonce = nonceVeri?.nonce;
    if (!sunucuNonce) throw new Error('boş nonce');

    const kanit = await crypto.subtle.sign(
      'RSASSA-PKCS1-v1_5', await rsaGizliAnahtar(), fromBase64Url(sunucuNonce)
    );
    const govde = JSON.stringify({
      certChain: [DEVICE_CERT_CHAIN_B64URL],
      nonce: sunucuNonce,
      pkg: 'com.rectv.shot',
      proof: toBase64Url(new Uint8Array(kanit)),
      sig: APK_SIG_SHA256_B64URL,
    });
    const verify = await jsonAl(`${TABAN}/api/attest/verify`, {
      govde,
      basliklar: await imzaBasliklari('POST', '/api/attest/verify', govde),
      ms: 6000,
    });
    if (!verify?.jwt) throw new Error('JWT dönmedi');
    hafizaJeton = verify.jwt;
    hafizaJetonBitis = verify.exp || simdi + 7200;
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('rectv_jwt_token', hafizaJeton);
        localStorage.setItem('rectv_jwt_exp', String(hafizaJetonBitis));
      }
    } catch (_) { /* storage opsiyonel */ }
    return hafizaJeton;
  } catch (_) {
    sonAttestasyonBasarisizligi = Date.now();
    return null;
  }
}

/* ── AES-256-GCM akış adresi çözümü: base64( IV(12) + şifreli + TAG ) ──── */
let aesAnahtari = null;
async function aesCozmeAnahtari() {
  if (aesAnahtari) return aesAnahtari;
  aesAnahtari = await crypto.subtle.importKey(
    'raw', hexToBytes(STREAM_ENC_KEY_HEX), { name: 'AES-GCM' }, false, ['decrypt']
  );
  return aesAnahtari;
}
export async function akisiCoz(encB64) {
  if (!encB64) return '';
  if (/^https?:\/\//.test(encB64)) return encB64;
  try {
    const veri = base64ToBytes(encB64);
    const sifresiz = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: veri.slice(0, 12), tagLength: 128 },
      await aesCozmeAnahtari(), veri.slice(12)
    );
    return new TextDecoder('utf-8').decode(sifresiz);
  } catch (_) {
    return '';
  }
}

/** İmzalı API isteği; attestasyon düşse de istek JWT'siz denenir. */
async function apiIstegi(yol, yontem = 'GET', govde = '') {
  let jwt = null;
  try { jwt = await attestasyonJetonu(); } catch (_) { /* sessiz */ }
  const basliklar = {
    ...(await imzaBasliklari(yontem, `/api${yol}`, govde)),
    ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
  };
  return jsonAl(`${TABAN}/api${yol}`, { govde: govde || null, basliklar, ms: 8000 });
}

function diziMi(tur) {
  return /tv|series|anime/.test(String(tur || '').toLowerCase());
}
function dublajMi(...parcalar) {
  return /dublaj|seslendir/i.test(parcalar.filter(Boolean).join(' '));
}
function sayiBu(text, yedek) {
  const m = String(text || '').match(/(\d+)/);
  return m ? parseInt(m[1], 10) : (parseInt(yedek, 10) || 0);
}

/** Yayın satırı: ham doğrudan m3u8 + Referer (vekil hls_proxy'si bu başlıkla sarar). */
function satir(url, dub, kalite) {
  return {
    name: 'Gambit',
    url,
    title: `${dub ? 'Dublaj' : 'Altyazı'}${kalite ? ` ${kalite}` : ''}`,
    quality: kalite || '1080p',
    format: 'm3u8',
    headers: { Referer: `${TABAN}/` },
  };
}

/** kimlik → arama(SW_KEY) → en iyi eşleşen poster → film kaynakları ya da S/B zinciri. */
export async function getStreams(kimlik, tur = 'movie', sezon = 1, bolum = 1) {
  try {
    const tv = diziMi(tur);
    const bilgi = await tmdbBilgi(kimlik, tv ? 'tv' : 'movie');
    if (!bilgi) return [];
    const beklenenler = [...new Set([bilgi.orijinal, bilgi.baslik].filter(Boolean))];
    if (!beklenenler.length) return [];

    let esleme = null;
    let eniyiPuan = 0;
    for (const sorgu of adayBasliklar(bilgi)) {
      const arama = await apiIstegi(`/search/${encodeURIComponent(sorgu)}/${SW_KEY}/`);
      const posters = Array.isArray(arama?.posters) ? arama.posters : [];
      for (const p of posters) {
        if ((tv ? p.type === 'serie' : p.type === 'movie') !== true) continue;
        const baslik = String(p.title || p.name || '');
        /* "Fight Club Show" gibi yakınlara 1 puan; alakasız başlık 0 → elenir. */
        let puan = slugPuani(baslik, beklenenler);
        for (const parcasi of baslik.split(/\s*[-/:]\s*/).filter(Boolean)) {
          puan = Math.max(puan, slugPuani(parcasi, beklenenler));
        }
        if (puan > eniyiPuan) { eniyiPuan = puan; esleme = p; }
      }
      if (eniyiPuan >= 3) break;
      if (esleme && eniyiPuan > 0) break;
    }
    if (!esleme || eniyiPuan <= 0) return [];

    const satirlar = [];
    if (!tv) {
      for (const s of (Array.isArray(esleme.sources) ? esleme.sources : [])) {
        const ham = s.enc_url ? await akisiCoz(s.enc_url) : String(s.url || '');
        if (!ham.startsWith('http')) continue;
        satirlar.push(satir(ham, dublajMi(s.title, s.name, esleme.label), s.quality || '1080p'));
      }
      return satirlar;
    }

    const sNum = parseInt(sezon, 10) || 1;
    const eNum = parseInt(bolum, 10) || 1;
    const sezonlar = await apiIstegi(`/season/by/serie/${esleme.id}/${SW_KEY}/`);
    for (const s of (Array.isArray(sezonlar) ? sezonlar : [])) {
      const sBaslik = String(s.title || s.name || '');
      if (sayiBu(sBaslik, s.number ?? s.season_number ?? s.num) !== sNum) continue;
      const sDub = dublajMi(sBaslik, s.label);

      let bolumler = Array.isArray(s.episodes) ? s.episodes : null;
      if (!bolumler || !bolumler.length) {
        const yanit = await apiIstegi(`/episode/by/season/${s.id}/${SW_KEY}/`);
        bolumler = Array.isArray(yanit) ? yanit : (Array.isArray(yanit?.episodes) ? yanit.episodes : []);
      }
      for (const b of bolumler) {
        const bBaslik = String(b.title || b.name || '');
        if (sayiBu(bBaslik, b.number ?? b.episode_number ?? b.num) !== eNum) continue;

        let kaynaklar = Array.isArray(b.sources) ? b.sources
          : Array.isArray(b.videos) ? b.videos
          : Array.isArray(b.streams) ? b.streams : [];
        if (!kaynaklar.length && b.id) {
          const yanit = await apiIstegi(`/source/by/episode/${b.id}/${SW_KEY}/`);
          kaynaklar = Array.isArray(yanit) ? yanit : (Array.isArray(yanit?.sources) ? yanit.sources : []);
        }
        for (const k of kaynaklar) {
          const enc = k.enc_url || k.encUrl || k.encrypted_url;
          const ham = enc ? await akisiCoz(enc) : String(k.url || k.stream_url || k.video || k.link || k.source || '');
          if (!ham.startsWith('http')) continue;
          satirlar.push(satir(ham, sDub || dublajMi(k.title, k.name), k.quality || '1080p'));
        }
      }
    }
    return satirlar;
  } catch (_) {
    return [];
  }
}

if (typeof globalThis !== 'undefined') {
  globalThis.getStreams = getStreams;
  globalThis.__cpGambit = getStreams;
}

export default getStreams;
