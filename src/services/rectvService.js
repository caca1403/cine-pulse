/* ==========================================================================
   CinePulse Studio — RecTV (kod adı Polaris) VIP servis sürücüsü
   --------------------------------------------------------------------------
   Sağlayıcı iki katmanlı kapı kullanır:
     1) Dönen alan adı: adres APK'da sabit DEĞİL, Firebase Remote Config'te
        durur ("api_url"). Adı kodda çözen fonksiyon: aktifAdresCoz().
     2) İstek imzası: her API çağrısı X-Timestamp / X-Nonce / X-Signature
        başlıklarıyla gelir; sunucu ayrıca X-App-Version'ın sürüm defterindeki
        güncel derleme numarasına eşit olmasını ister (aksi halde
        invalid_version / invalid_signature).
   Bu sürücü ikisini de kendisi çözer; ad önbelleğe alınır (10 dk).

   Politika: YALNIZ doğrudan oynatılabilir yayın (m3u8/mp4/mkv) döner.
   Gömülü (iframe) adres, web view ve site adı içeren etiket YOKTUR;
   kullanıcıya hep "Polaris …" kod adı görünür.
   ========================================================================== */

import { isStrictMediaTitleMatch } from './mediaMatcher.js';

/* --- Sağlayıcı sabitleri (APK içinde düz metin olarak taşınan anahtarlar) --- */
const SW_KEY = '4F5A9C3D9A86FA54EACEDDD635185/c3c5bd17-e37b-4b94-a944-8a3688a30452';
const HMAC_KEY_HEX = '3508611138826751fdf77beaa6f93eb93fd27e6a5acb910e7aad22665513dd6e';
const STREAM_ENC_KEY_HEX = '666482389dc76bfa57068407418f7dac9f6c14b6868856b169165b9fac7d812e';

/* --- Firebase Remote Config: dönen adresin tek kaynağı --- */
const RC_PROJE = '791583031279';
const RC_API_ANAHTAR = 'AIzaSyBbhpzG8Ecohu9yArfCO5tF13BQLhjLahc';
const RC_APP_KİMLİK = `1:${RC_PROJE}:android:1`;
const RC_PAKET = 'com.rectv.shot';

/* Eşleşme bulunamazsa kullanılan son bilinen değerler (RC her zaman önce). */
const DERLEME_YEDEK = '160';
const ADRES_YEDEK = 'https://a.prectv70.lol';

/* Zaman bütçesi: tek istek 8.5 sn, tüm çözümleme en fazla 12 sn. */
const TEK_ISTEK_MS = 8500;
const TOPLAM_BUTCE_MS = 12000;
const ADRES_TTL_MS = 10 * 60 * 1000;

const DOGRUDAN_UZANTI = /\.(m3u8|mp4|mkv|webm|m4s)(\?|#|$)/i;
const GOMULU_IZ = /(\/embed\/|\/embed$|iframe|dailymotion|youtube|vidmoly|yourupload|streamtape)/i;

const isNodeEnv = typeof window === 'undefined';

/* Web Crypto: tarayıcıda zaten global, Node 18 tarafında webcrypto'dan alınır. */
let webCrypto = typeof globalThis !== 'undefined' && globalThis.crypto ? globalThis.crypto : null;
if ((!webCrypto || !webCrypto.subtle) && isNodeEnv) {
  try {
    const mod = 'node:' + 'crypto';
    webCrypto = (await import(/* @vite-ignore */ mod)).webcrypto;
  } catch (_) {
    webCrypto = null;
  }
}

/** Son denemenin hata izi — arayüzde "neden yanıt yok" sorusunun cevabı. */
export const rectvTani = { hata: '', deneme: 0, durumKodu: 0, adres: '', derleme: DERLEME_YEDEK };

/* ------------------------------------------------------------------ *
 * 1) Adres çözümleme: Firebase Remote Config → api_url (+ derleme no)  *
 * ------------------------------------------------------------------ */

let adresOnbellek = { taban: '', derleme: DERLEME_YEDEK, zaman: 0 };
let adresBekliyor = null;

function geciciAdres(normalizeEdilecek) {
  const ham = String(normalizeEdilecek || '').trim();
  if (!ham) return '';
  let uri = ham;
  if (!/^https?:\/\//i.test(uri)) uri = `https://${uri}`;
  try {
    const u = new URL(uri);
    // api_url ".../api/" biçiminde gelir; biz taban origin isteriz.
    return `${u.protocol}//${u.host}`;
  } catch (_) {
    return '';
  }
}

function derlemeAyikla(girdiler) {
  const adaylar = [girdiler.updated_app_url, girdiler.updated_app_link, girdiler.app_build, girdiler.build_number];
  for (const a of adaylar) {
    const m = String(a || '').match(/(?:-(\d{2,4})[a-z]*\.apk|[_/]?build[=:]?(\d{2,4})|v=(\d{2,4}))/i);
    const sayi = m && (m[1] || m[2] || m[3]);
    if (sayi) return String(sayi);
  }
  return DERLEME_YEDEK;
}

/**
 * Sağlayıcının şu an dönen API alan adını Remote Config'den çözer.
 * Sonuç 10 dakika önbellekte tutulur; eşzamanlı çağrılar tek istek yapar.
 * @returns {Promise<{taban:string, derleme:string, kaynak:string}>}
 */
export async function aktifAdresCoz({ zorla = false } = {}) {
  const simdi = Date.now();
  if (!zorla && adresOnbellek.taban && simdi - adresOnbellek.zaman < ADRES_TTL_MS) {
    return { taban: adresOnbellek.taban, derleme: adresOnbellek.derleme, kaynak: 'onbellek' };
  }
  if (adresBekliyor) return adresBekliyor;

  adresBekliyor = (async () => {
    try {
      const res = await fetch(
        `https://firebaseremoteconfig.googleapis.com/v1/projects/${RC_PROJE}/namespaces/firebase:fetch?key=${RC_API_ANAHTAR}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-Goog-Api-Key': RC_API_ANAHTAR,
            'X-Android-Package': RC_PAKET,
            'User-Agent': 'Dalvik/2.1.0 (Linux; U; Android 13; SM-S901B)'
          },
          body: JSON.stringify({
            appId: RC_APP_KİMLİK,
            appInstanceId: 'cp-polaris-installer',
            appBuild: adresOnbellek.derleme || DERLEME_YEDEK,
            packageName: RC_PAKET,
            countryCode: 'TR',
            languageCode: 'tr-TR',
            platformVersion: '33',
            sdkVersion: '21.4.1'
          }),
          signal: AbortSignal.timeout(TEK_ISTEK_MS)
        }
      );
      rectvTani.durumKodu = res.status;
      if (!res.ok) throw new Error(`remoteconfig ${res.status}`);

      const veri = await res.json();
      const girdiler = (veri && veri.entries) || {};
      const taban =
        geciciAdres(girdiler.api_url) ||
        geciciAdres(girdiler.api_url_1) ||
        geciciAdres(girdiler.api_url_son) ||
        geciciAdres(girdiler.rectv_domain);
      if (!taban) throw new Error('remoteconfig: api_url yok');

      adresOnbellek = { taban, derleme: derlemeAyikla(girdiler), zaman: Date.now() };
      rectvTani.adres = taban;
      rectvTani.derleme = adresOnbellek.derleme;
      rectvTani.hata = '';
      return { taban, derleme: adresOnbellek.derleme, kaynak: 'remoteconfig' };
    } catch (err) {
      rectvTani.hata = `adres: ${String((err && err.message) || err)}`;
      // Önbellekte taze sayılmayan ama çalışan bir adres varsa onu kullan.
      const taban = adresOnbellek.taban || geciciAdres(ADRES_YEDEK);
      return { taban, derleme: adresOnbellek.derleme, kaynak: 'yedek' };
    } finally {
      adresBekliyor = null;
    }
  })();

  return adresBekliyor;
}

/* --------------------------------------------------------------- *
 * 2) Yardımcılar: base64 / hash / HMAC / AES-256-GCM akış çözme      *
 * --------------------------------------------------------------- */

function hexToBytes(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < bytes.length; i++) bytes[i] = parseInt(hex.substr(i * 2, 2), 16);
  return bytes;
}

function bytesToHex(bytes) {
  return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function sha256Hex(str) {
  const digest = await webCrypto.subtle.digest('SHA-256', new TextEncoder().encode(str));
  return bytesToHex(new Uint8Array(digest));
}

async function hmacSha256Hex(keyHex, message) {
  const enc = new TextEncoder();
  const key = await webCrypto.subtle.importKey('raw', enc.encode(keyHex), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  const sig = await webCrypto.subtle.sign('HMAC', key, enc.encode(message));
  return bytesToHex(new Uint8Array(sig));
}

let aesAnahtar = null;
async function aesCryptoKey() {
  if (aesAnahtar) return aesAnahtar;
  aesAnahtar = await webCrypto.subtle.importKey('raw', hexToBytes(STREAM_ENC_KEY_HEX), { name: 'AES-GCM' }, false, ['decrypt']);
  return aesAnahtar;
}

/** Sağlayıcı yayın adreslerini AES-256-GCM ile şifreli taşır; düz metin gelirse aynen döner. */
export async function decryptRecTvStreamUrl(encB64) {
  if (!encB64) return '';
  if (/^https?:\/\//i.test(encB64)) return encB64;
  try {
    const bin = atob(encB64);
    const data = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) data[i] = bin.charCodeAt(i);
    const iv = data.slice(0, 12);
    const dec = await webCrypto.subtle.decrypt({ name: 'AES-GCM', iv, tagLength: 128 }, await aesCryptoKey(), data.slice(12));
    return new TextDecoder('utf-8').decode(dec);
  } catch (_) {
    return '';
  }
}

/* --------------------------------------------------------------- *
 * 3) Cihaz doğrulama başlıkları (imza + sürüm)                       *
 * --------------------------------------------------------------- */

async function cihazBasliklari(method, tamYol, govde = '', derleme = DERLEME_YEDEK) {
  const ts = Math.floor(Date.now() / 1000).toString();
  const nonce =
    typeof webCrypto?.randomUUID === 'function'
      ? webCrypto.randomUUID()
      : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
          const r = (Math.random() * 16) | 0;
          return (c === 'x' ? r : (r & 3) | 8).toString(16);
        });
  const govdeOzeti = await sha256Hex(govde);
  const imza = await hmacSha256Hex(HMAC_KEY_HEX, `${method}\n${tamYol}\n${ts}\n${nonce}\n${govdeOzeti}`);
  return {
    'user-agent': 'okhttp/4.12.0',
    'x-app-package': RC_PAKET,
    'x-app-version': String(derleme),
    'x-client-id': 'rectv-android',
    'x-timestamp': ts,
    'x-nonce': nonce,
    'x-signature': imza
  };
}

/* --------------------------------------------------------------- *
 * 4) Kimlik: JWT (varsa) — doğrulama turu artık adres çözümlemesiyle
 *    aynı kapıdan geçtiği için eski RSA atestasyonu devre dışı.
 * --------------------------------------------------------------- */

let bellekJwt = null;
let bellekJwtBitis = 0;

/** Eski imza korundu: çağıranlar için daima null (gerekli değil). */
export async function getValidRecTvJwt() {
  const now = Math.floor(Date.now() / 1000);
  if (bellekJwt && bellekJwtBitis > now + 120) return bellekJwt;
  if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem('rectv_jwt_token');
    const exp = parseInt(localStorage.getItem('rectv_jwt_exp') || '0', 10);
    if (stored && exp > now + 120) {
      bellekJwt = stored;
      bellekJwtBitis = exp;
      return stored;
    }
  }
  return null;
}

/* --------------------------------------------------------------- *
 * 5) API istek katmanı — butça uyumlu, tek nokta                     *
 * --------------------------------------------------------------- */

function hedef(yol) {
  // Tarayıcıda CORS başlığı olmadığı için aynı istek kenar vekili üzerinden gider
  // (api/rtv.js x-rtv-path başlığını okur). Node/Electron tarafında doğrudan çözülen
  // taban adrese gidilir.
  return isNodeEnv ? `${adresOnbellek.taban || geciciAdres(ADRES_YEDEK)}/api${yol}` : `/api/rtv${yol}`;
}

/**
 * @param {string} yol  /api sonrası gelen yol (SW_KEY dahil)
 * @param {{butce?:number, method?:string, govde?:string}} opts
 */
async function apiIstek(yol, { butce = TOPLAM_BUTCE_MS, method = 'GET', govde = '' } = {}) {
  const { taban, derleme } = await aktifAdresCoz();
  const kalan = Math.max(300, Math.min(TEK_ISTEK_MS, butce));
  const tamYol = `/api${yol}`;
  const headers = await cihazBasliklari(method, tamYol, govde, derleme);
  if (!isNodeEnv) headers['x-rtv-path'] = yol;
  if (govde) headers['content-type'] = 'application/json';
  const jwt = await getValidRecTvJwt();
  if (jwt) headers.authorization = `Bearer ${jwt}`;

  try {
    const res = await fetch(isNodeEnv ? `${taban}${tamYol}` : `/api/rtv${yol}`, {
      method,
      headers,
      ...(govde ? { body: govde } : {}),
      signal: AbortSignal.timeout(kalan),
      cache: 'no-store'
    });
    rectvTani.deneme = Date.now();
    rectvTani.durumKodu = res.status;
    if (!res.ok) {
      const govdeMetin = String(await res.text().catch(() => '')).slice(0, 120);
      rectvTani.hata = `${res.status} ${govdeMetin}`.trim();
      return null;
    }
    return await res.json();
  } catch (err) {
    rectvTani.deneme = Date.now();
    rectvTani.hata = String((err && err.message) || err);
    return null;
  }
}

/* --------------------------------------------------------------- *
 * 6) Yayın havuzu — yalnız DOĞRUDAN m3u8/mp4                         *
 * --------------------------------------------------------------- */

function kaynakNesnesi({ id, rawUrl, dublaj, etiket, referans }) {
  const hls = /\.m3u8(\?|#|$)/i.test(rawUrl);
  const sifreliAdres = `/api/hls_proxy?url=${encodeURIComponent(rawUrl)}&ref=${encodeURIComponent(`${referans}/`)}`;
  return {
    id,
    name: etiket,
    displayName: etiket,
    badge: etiket,
    source: 'Polaris',
    url: sifreliAdres,
    streamUrl: sifreliAdres,
    rawStreamUrl: rawUrl,
    category: dublaj ? 'dubbed' : 'subtitled',
    headers: { Referer: `${referans}/`, Origin: referans },
    quality: '1080p',
    isHls: hls,
    isDirectVideo: true,
    isIframe: false,
    webView: false,
    type: 'direct',
    priority: 0,
    getUrl: () => sifreliAdres
  };
}

async function hamAdres(kaynak) {
  const sifreli = kaynak.enc_url || kaynak.encUrl || kaynak.encrypted_url;
  const duz = kaynak.url || kaynak.stream_url || kaynak.video || kaynak.link || kaynak.source;
  const adres = sifreli ? await decryptRecTvStreamUrl(sifreli) : duz;
  if (!adres || !/^https?:\/\//i.test(adres)) return '';
  if (GOMULU_IZ.test(adres)) return '';
  if (!DOGRUDAN_UZANTI.test(adres)) return '';
  return adres;
}

/**
 * Polaris (RecTV) için doğrudan VIP yayın listesi.
 * Sözleşme: envanter bu fonksiyon adını çağırır; girdi {type,title,
 * originalTitle,season,episode,year}, çıktı normalize kaynak dizisi.
 */
export async function fetchRecTvSources({
  type = 'movie',
  title = '',
  originalTitle = '',
  season = 1,
  episode = 1,
  year = null
} = {}) {
  void year;
  const sorgu = String(title || originalTitle || '').trim();
  if (!sorgu) return [];
  const seasonNum = parseInt(season, 10) || 1;
  const episodeNum = parseInt(episode, 10) || 1;
  const baslangic = Date.now();
  const butce = () => Math.max(300, TOPLAM_BUTCE_MS - (Date.now() - baslangic));

  try {
    const { taban } = await aktifAdresCoz();
    const beklenenler = [sorgu, originalTitle].filter(Boolean);
    const film = type === 'movie';

    let arama = await apiIstek(`/search/${encodeURIComponent(sorgu)}/${SW_KEY}/`, { butce: butce() });
    if ((!arama || !Array.isArray(arama.posters) || arama.posters.length === 0) && originalTitle && originalTitle.toLowerCase() !== sorgu.toLowerCase()) {
      arama = await apiIstek(`/search/${encodeURIComponent(originalTitle.trim())}/${SW_KEY}/`, { butce: butce() });
    }
    if (!arama || !Array.isArray(arama.posters) || arama.posters.length === 0) return [];

    const eslesir = (aday) => {
      if (!aday) return false;
      if (isStrictMediaTitleMatch(aday, beklenenler)) return true;
      return String(aday)
        .split(/\s*[-/:]\s*/)
        .filter(Boolean)
        .some(p => isStrictMediaTitleMatch(p, beklenenler));
    };

    const match = arama.posters.find(p => (film ? p.type === 'movie' : p.type === 'serie') && eslesir(p.title || p.name || ''));
    if (!match) return [];

    const havuz = [];

    if (film) {
      for (const s of (Array.isArray(match.sources) ? match.sources : [])) {
        const raw = await hamAdres(s);
        if (!raw) continue;
        const dublaj = `${s.title || s.name || ''} ${match.label || ''}`.toLowerCase().includes('dublaj');
        havuz.push(
          kaynakNesnesi({
            id: `tvr_movie_${match.id}_${s.id || havuz.length}`,
            rawUrl: raw,
            dublaj,
            etiket: dublaj ? 'Polaris 1080p · TR Dublaj' : 'Polaris 1080p · Altyazılı',
            referans: taban
          })
        );
      }
      return havuz;
    }

    const sezonlar = await apiIstek(`/season/by/serie/${match.id}/${SW_KEY}/`, { butce: butce() });
    if (!Array.isArray(sezonlar)) return havuz;

    for (const sz of sezonlar) {
      if (Date.now() - baslangic > TOPLAM_BUTCE_MS) break;
      const szBaslik = String(sz.title || sz.name || '').toLowerCase();
      const szNo = szBaslik.match(/(\d+)/)?.[1]
        ? parseInt(szBaslik.match(/(\d+)/)[1], 10)
        : parseInt(sz.number || sz.season_number || sz.num || '0', 10) || 1;
      if (szNo !== seasonNum) continue;
      const szDublaj = szBaslik.includes('dublaj') || String(sz.label || '').toLowerCase().includes('dublaj');

      let bolumler = Array.isArray(sz.episodes) ? sz.episodes : null;
      if (!bolumler || bolumler.length === 0) {
        const epRes = await apiIstek(`/episode/by/season/${sz.id}/${SW_KEY}/`, { butce: butce() });
        bolumler = Array.isArray(epRes) ? epRes : epRes && Array.isArray(epRes.episodes) ? epRes.episodes : null;
      }
      if (!Array.isArray(bolumler)) continue;

      for (const ep of bolumler) {
        const epBaslik = String(ep.title || ep.name || '').toLowerCase();
        const epNo = epBaslik.match(/(\d+)/)?.[1]
          ? parseInt(epBaslik.match(/(\d+)/)[1], 10)
          : parseInt(ep.number || ep.episode_number || ep.num || '0', 10) || 1;
        if (epNo !== episodeNum) continue;

        let kaynaklar = Array.isArray(ep.sources) ? ep.sources : Array.isArray(ep.videos) ? ep.videos : Array.isArray(ep.streams) ? ep.streams : [];
        if (kaynaklar.length === 0 && ep.id) {
          const srcRes = await apiIstek(`/source/by/episode/${ep.id}/${SW_KEY}/`, { butce: butce() });
          kaynaklar = Array.isArray(srcRes) ? srcRes : srcRes && Array.isArray(srcRes.sources) ? srcRes.sources : [];
        }

        for (const src of kaynaklar) {
          const raw = await hamAdres(src);
          if (!raw) continue;
          const dublaj = szDublaj || `${src.title || src.name || ''}`.toLowerCase().includes('dublaj');
          havuz.push(
            kaynakNesnesi({
              id: `tvr_ep_${match.id}_${ep.id || epNo}_${src.id || raw.slice(-8)}`,
              rawUrl: raw,
              dublaj,
              etiket: `Polaris S${seasonNum}E${episodeNum} · ${dublaj ? 'TR Dublaj' : 'Altyazılı'}`,
              referans: taban
            })
          );
        }
      }
    }

    return havuz;
  } catch (err) {
    rectvTani.hata = String((err && err.message) || err);
    return [];
  }
}

/* --------------------------------------------------------------- *
 * 7) Canlı kanallar (aynı kapıdan geçer)                             *
 * --------------------------------------------------------------- */

const STATIK_KANALLAR = [
  {
    id: 'tvr_ch_dmax',
    tvrId: 'dmax',
    isDaion: true,
    name: 'DMAX',
    category: 'national',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/44/DMAX_Logo_2019.svg/200px-DMAX_Logo_2019.svg.png',
    quality: 'HD Canlı',
    streamUrl: ''
  },
  {
    id: 'tvr_ch_tlc',
    tvrId: 'tlc',
    isDaion: true,
    name: 'TLC',
    category: 'national',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/73/TLC_Logo.svg/200px-TLC_Logo.svg.png',
    quality: 'HD Canlı',
    streamUrl: ''
  }
];

export async function fetchRecTvLiveChannels() {
  try {
    const liste = await apiIstek(`/channel/by/filtres/0/0/0/${SW_KEY}/`, { butce: TOPLAM_BUTCE_MS });
    if (!Array.isArray(liste)) return [...STATIK_KANALLAR];
    const kategori = new Map([[1, 'sports'], [2, 'doc'], [3, 'national'], [4, 'news'], [5, 'music'], [6, 'national'], [7, 'kids'], [8, 'national']]);
    const gorulen = new Set();
    const kanallar = [];
    for (const ch of liste) {
      const temizId = String(ch.id || '').trim();
      if (!temizId || gorulen.has(temizId) || String(ch.playas || '1') === '0') continue;
      gorulen.add(temizId);
      kanallar.push({
        id: `tvr_ch_${temizId}`,
        tvrId: temizId,
        isTvr: true,
        name: ch.title || ch.name || `Polaris ${temizId}`,
        category: kategori.get(Number(ch.categories?.[0]?.id || 0)) || 'national',
        logo: ch.image || ch.poster || '',
        quality: '1080p',
        streamUrl: ''
      });
    }
    for (const sc of STATIK_KANALLAR) {
      const varMi = kanallar.some(ch => (ch.name || '').toLowerCase().includes(sc.tvrId) || (ch.name || '').toLowerCase() === sc.name.toLowerCase());
      if (!varMi) kanallar.push(sc);
    }
    return kanallar;
  } catch (err) {
    rectvTani.hata = String((err && err.message) || err);
    return [...STATIK_KANALLAR];
  }
}

const kanalAdresOnbellegi = new Map();
const kanalAdresBekleyen = new Map();
const KANAL_TTL_MS = 2 * 60 * 1000;

/** Bir canlı kanal için taze doğrudan HLS adresi (yalnız m3u8/mp4). */
export async function getRecTvChannelStreamUrl(chId, { forceRefresh = false } = {}) {
  if (!chId) return null;
  const temizId = String(chId).replace(/^tvr_ch_/, '');

  if (temizId === 'dmax' || temizId === 'tlc' || temizId === '81' || temizId === '83') {
    const kanal = temizId === '81' || temizId === 'dmax' ? 'dmax' : 'tlc';
    const anahtar = `daion_${kanal}`;
    const onbellek = kanalAdresOnbellegi.get(anahtar);
    if (!forceRefresh && onbellek && onbellek.bitis > Date.now()) return onbellek.adres;
    try {
      const resp = await fetch(`/api/live_tv_stream?channel=${kanal}&json=1`, { signal: AbortSignal.timeout(TEK_ISTEK_MS) });
      if (resp.ok) {
        const data = await resp.json();
        const hedefAdres = data?.proxiedUrl || data?.url || data?.raw;
        if (hedefAdres) {
          kanalAdresOnbellegi.set(anahtar, { adres: hedefAdres, bitis: Date.now() + KANAL_TTL_MS });
          return hedefAdres;
        }
      }
    } catch (_) {}
    if (temizId !== '81' && temizId !== '83') return `/api/live_tv_stream?channel=${kanal}`;
  }

  const onbellek = kanalAdresOnbellegi.get(temizId);
  if (!forceRefresh && onbellek && onbellek.bitis > Date.now()) return onbellek.adres;
  if (kanalAdresBekleyen.has(temizId)) return kanalAdresBekleyen.get(temizId);
  if (forceRefresh) kanalAdresOnbellegi.delete(temizId);

  const istek = (async () => {
    try {
      const { taban } = await aktifAdresCoz();
      const detay = await apiIstek(`/channel/by/${temizId}/${SW_KEY}/`, { butce: TOPLAM_BUTCE_MS });
      if (!detay || !Array.isArray(detay.sources)) return null;
      const kaynak = detay.sources.find(s => !s.locked);
      if (!kaynak) return null;
      const raw = await hamAdres(kaynak);
      if (!raw) return null;
      const adres = `/api/hls_proxy?url=${encodeURIComponent(raw)}&ref=${encodeURIComponent(`${taban}/`)}`;
      kanalAdresOnbellegi.set(temizId, { adres, bitis: Date.now() + KANAL_TTL_MS });
      return adres;
    } catch (err) {
      rectvTani.hata = String((err && err.message) || err);
      return null;
    }
  })();

  kanalAdresBekleyen.set(temizId, istek);
  try {
    return await istek;
  } finally {
    kanalAdresBekleyen.delete(temizId);
  }
}
