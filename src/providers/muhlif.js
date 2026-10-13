/* ==========================================================================
   MUHLIF — Dizipal  (sıfırdan, kit sözleşmesi; Patron akışının kendi
   dilimizde yeniden yazılmışı)

   Adımlar:
     1. Alan adı: siteurl.txt (dizipalDiger → dizipal) → bilinenler
     2. Arama:  /ajax-search?q={imdb|başlık} → JSON results[]
     3. Dizi:   "{slug}-{S}-sezon-{E}-bolum" bağlantısı (metin/URL eşleşmesi)
     4. Oynatıcı: bölüm sayfasındaki data-cfg → POST /ajax-player-config
        (cfg O TUR BÖLÜMÜN oturumuna bağlıdır; cihazda çerez kutusu otomatik,
         Node/masaüstünde modülün kendi kutusu taşınır) → {config:{v,t}} veya
        {enc} → AES-CBC (k1⊕k2) → embed adresi.
     5. Embed:  imagestoo → index.php?do=getVideo → securedLink;
        diğerleri → extractEmbedStream. isIframe ise KAYNAK LISTELENMEZ.
     6. Referer = oynatıcı kökü, UA = okhttp/4.9.2.
   ========================================================================== */

import {
  istek, gonder, izleyici, mutlak, koken, m3u8eCevir, medyaMi, anchorlar,
  kaynak, temizBaslik, baslikEslesir, alanAdiCoz, siteurlHaritasi, nativeHttpAktifMi,
} from './kit.js';
import { extractEmbedStream } from '../services/embedExtractors.js';
import CryptoJS from '../vendor/crypto-js.js';

const BILINEN = ['https://dizipal2138.com', 'https://dizipal.com'];
const UA = 'Mozilla/5.0 (Linux; Android 13) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Mobile Safari/537.36';
const PLAYER_UA = 'okhttp/4.9.2';

export const kimlik = { id: 'dzp', alias: 'Muhlif', mediaTypes: ['tv', 'movie'] };

/* ── çerezli tek geçit ───────────────────────────────────────────────────
   config uçları bölüm sayfasıyla AYNI oturumu ister. Android'de cihazın
   kendi HTTP yığını çerezleri kendisi taşır → kit.istek/gonder yeterlidir.
   Orada değilseniz (test/masaüstüNode) aynı sayfa akışını küçük bir çerez
   kutusuyla kendimiz süreriz. */
function oturumAc() { return { parcalar: {}, get cerez() { return Object.entries(this.parcalar).map(([k, v]) => `${k}=${v}`).join('; '); } } }

function cerezTopla(oturum, yanit) {
  if (!oturum || !yanit) return;
  let hamlar = [];
  try { hamlar = typeof yanit.headers.getSetCookie === 'function' ? yanit.headers.getSetCookie() : [yanit.headers.get('set-cookie')].filter(Boolean); } catch (_) {}
  for (const h of hamlar) {
    const m = String(h).match(/^\s*([^=;]+)=([^;]*)/);
    if (!m) continue;
    if (m[2]) oturum.parcalar[m[1]] = m[2]; else delete oturum.parcalar[m[1]];
  }
}

async function gecir(url, { ref = '', govde = null, headers = {}, timeout = 8000, trace = null, oturum = null, signal = null } = {}) {
  if (!oturum || nativeHttpAktifMi()) {
    return govde
      ? gonder(url, govde, { ref, headers: { 'User-Agent': UA, ...headers }, timeout, trace, signal })
      : istek(url, { ref, headers: { 'User-Agent': UA, ...headers }, timeout, trace, webView: false, signal });
  }
  const ac = new AbortController();
  const zaman = setTimeout(() => ac.abort(), timeout);
  // İptal yayılımı: çağıranın sinyali kendi zaman-aşımı denetleyicisini de düşürür
  // (yalnız sinyal iletimi — davranış süresi kısalır, değerler aynı).
  const iptalEt = () => { try { ac.abort(new Error('aborted')); } catch (_) { ac.abort(); } };
  if (signal) { if (signal.aborted) iptalEt(); else signal.addEventListener('abort', iptalEt, { once: true }); }
  try {
    const r = await fetch(url, {
      method: govde ? 'POST' : 'GET',
      body: govde || undefined,
      signal: ac.signal,
      headers: {
        'User-Agent': UA,
        Accept: govde ? 'application/json, text/javascript, */*; q=0.01' : '*/*',
        ...(ref ? { Referer: ref } : {}),
        ...(oturum.cerez ? { Cookie: oturum.cerez } : {}),
        ...(govde ? { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8', 'X-Requested-With': 'XMLHttpRequest' } : {}),
        ...headers,
      },
    });
    cerezTopla(oturum, r);
    if (trace) trace.koy('http', { url, uz: r.ok ? 'ok' : `HTTP ${r.status}`, yol: 'cerezli' });
    if (!r.ok) return '';
    return await r.text();
  } catch (e) {
    if (trace) trace.koy('http', { url, hata: String(e).slice(0, 80), yol: 'cerezli' });
    return '';
  } finally { clearTimeout(zaman); if (signal) signal.removeEventListener('abort', iptalEt); }
}

/* ── şifre yardımcıları ────────────────────────────────────────────────── */

/** HTML entity katmanlarını soy (data-cfg kaçırılmış gelir). */
function entitySoy(s) {
  let t = String(s || '');
  for (let i = 0; i < 3; i++) {
    const y = t.replace(/&amp;quot;/g, '"').replace(/&quot;/g, '"').replace(/&amp;/g, '&')
      .replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
    if (y === t) break;
    t = y;
  }
  return t;
}

/** base64 (tire/altçizgi toleranslı) → ikili dizgi. */
function b64Ikili(s) {
  const K = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const t = String(s || '').replace(/[\s=]+/g, '').replace(/-/g, '+').replace(/_/g, '/');
  let out = '';
  for (let i = 0; i < t.length; i += 4) {
    const a = K.indexOf(t[i]), b = K.indexOf(t[i + 1]), c = K.indexOf(t[i + 2]), d = K.indexOf(t[i + 3]);
    if (a < 0 || b < 0) break;
    out += String.fromCharCode((a << 2) | (b >> 4));
    if (c >= 0) {
      out += String.fromCharCode(((b & 15) << 4) | (c >> 2));
      if (d >= 0) out += String.fromCharCode(((c & 3) << 6) | d);
    }
  }
  return out;
}

const ikiliSoz = (s) => { const b = b64Ikili(s); const u = new Uint8Array(b.length); for (let i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); return u; };
const xorla = (a, b) => { const n = Math.min(a.length, b.length); const o = new Uint8Array(n); for (let i = 0; i < n; i++) o[i] = a[i] ^ b[i]; return o; };
const sozcuklestir = (bytes) => {
  const w = [];
  for (let i = 0; i < bytes.length; i += 4) w.push((bytes[i] || 0) << 24 | (bytes[i + 1] || 0) << 16 | (bytes[i + 2] || 0) << 8 | (bytes[i + 3] || 0));
  return CryptoJS.lib.WordArray.create(w, bytes.length);
};

/** {c, iv, k1, k2} → AES-CBC düz metin (anahtar = k1 ⊕ k2). */
function sifreCoz(enc) {
  if (!enc || !enc.c || !enc.iv || !enc.k1 || !enc.k2) return '';
  try {
    const d = CryptoJS.AES.decrypt({ ciphertext: sozcuklestir(ikiliSoz(enc.c)) }, sozcuklestir(xorla(ikiliSoz(enc.k1), ikiliSoz(enc.k2))),
      { iv: sozcuklestir(ikiliSoz(enc.iv)), mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
    return d.toString(CryptoJS.enc.Utf8) || '';
  } catch (_) { return ''; }
}

/* ── akış ──────────────────────────────────────────────────────────────── */

/** JSON arama yanıtından içerik URL'si seç. */
function sonucSec(results, isFilm, arananlar) {
  const tipli = (u) => (isFilm ? /\/(film|movies)\//i.test(u) : /\/(dizi|series)\//i.test(u));
  const havuz = (results || []).filter((x) => x && x.url);
  const dogru = havuz.find((x) => tipli(x.url) && (!arananlar.length || !x.title || baslikEslesir(x.title, arananlar)))
    || havuz.find((x) => tipli(x.url));
  return (dogru || havuz[0] || {}).url || '';
}

/** Dizi sayfasından sezon/bölüm bağlantısı. */
function bolumLinku(ham, taban, sezon, bolum) {
  const a = anchorlar(ham, taban);
  const kaliplar = [
    new RegExp(`(?<![0-9])-${sezon}-sezon-${bolum}-bolum`),
    new RegExp(`/sezon-${sezon}/bolum-${bolum}(/|$)`),
    new RegExp(`(?<![0-9])-${sezon}x${bolum}(-|$|/)`),
  ];
  for (const p of kaliplar) { const m = a.find((x) => p.test(x.url)); if (m) return m.url; }
  for (const x of a) {
    const s = x.metin.match(/(\d+)\.\s*sezon/i);
    const e = x.metin.match(/(\d+)\.\s*b[oö]l[uü]m/i);
    if (s && e && +s[1] === sezon && +e[1] === bolum) return x.url;
  }
  return '';
}

/** data-cfg'yi oynatıcı konfigürasyonuna çevir: iki uç birden denenir.
 *  Filmlerde uçlar flaky (3 denemenin 2'sinde bulunamadı) → bölüm sayfasının
 *  çerezlerini taşıyan oturumla KISA beklemeli TEK bir tekrar. Tavan:
 *  6000 + 700 + 4500 ≈ 11,2 sn (≤12 sn). */
async function konfigBul(base, icerikUrl, cfg, oturum, trace, signal = null) {
  const uclar = [`${base}/ajax-player-config`, `${base}/ajax`];
  const tur = async (timeout) => {
    const sonuclar = await Promise.allSettled(uclar.map(async (u) => {
      const ham = await gecir(u, { ref: icerikUrl, govde: `cfg=${encodeURIComponent(cfg)}`, timeout, trace, oturum, signal });
      if (!ham) return null;
      try {
        const j = JSON.parse(ham);
        if (j?.config?.v) return j.config;                    // {v, t, p}
        if (j?.enc) { const s = sifreCoz(j.enc); if (s) return { v: s, t: 'embed' }; }
      } catch (_) {}
      return null;
    }));
    return (sonuclar.find((r) => r.status === 'fulfilled' && r.value) || {}).value || null;
  };
  let iyi = await tur(6000);
  if (!iyi) {
    await new Promise((r) => setTimeout(r, 700));  // oturumun yerine oturması için kısa bekleme
    iyi = await tur(4500);
  }
  trace.koy('konfig', { bulundu: Boolean(iyi) });
  return iyi;
}

/** Gömülü oynatıcıyı doğrudan yayına çevir (iframe asla döndürülmez). */
async function oynaticiCoz(embedUrl, icerikUrl, trace, signal = null) {
  // imagestoo: API kısayolu — embed sayfasını açmadan yayına iner
  const hash = (embedUrl.match(/imagestoo\.[a-z]+\/(?:video|embed)\/([a-z0-9]+)/i) || [])[1]
    || (embedUrl.match(/[?&]data=([a-z0-9]{16,})/i) || [])[1];
  if (hash && /imagestoo\./i.test(embedUrl)) {
    const api = `https://imagestoo.com/player/index.php?data=${hash}&do=getVideo`;
    const ham = await gecir(api, {
      ref: embedUrl, govde: `hash=${hash}&r=${encodeURIComponent(icerikUrl)}`, timeout: 5000, trace, signal,
      headers: { Origin: koken(embedUrl) },
    });
    try {
      const j = JSON.parse(ham);
      const u = m3u8eCevir(j?.securedLink || j?.videoSource || '');
      if (u && medyaMi(u)) return { url: u, altyazilar: [] };
    } catch (_) {}
  }
  // genel gömülüler: kalkanlı zincir (be/packer/dl-api/iframe-çözüm)
  const ic = await extractEmbedStream(embedUrl, icerikUrl, new Set(), Date.now() + 6500);
  if (!ic || ic.isIframe || !medyaMi(ic.url)) { trace.koy('embed', { cozuldu: false, via: ic ? ic.via : 'yok' }); return null; }
  const kok = koken(embedUrl) || '';
  const altyazilar = (ic.subtitles || []).map((t) => {
    const url = t.src || t.url || '';
    return { url, src: url, label: t.label || 'Altyazı', language: /t[uü]rk/i.test(t.label || '') ? 'tr' : (/eng|ing/i.test(t.label || '') ? 'en' : ''), headers: { Referer: `${kok ? kok + '/' : icerikUrl}`, 'User-Agent': PLAYER_UA, Accept: '*/*' } };
  });
  trace.koy('embed', { cozuldu: true, via: ic.via });
  return { url: m3u8eCevir(ic.url), altyazilar };
}

/** Nuvio `load()` eşdeğeri. */
export async function coz({ type = 'tv', title = '', originalTitle = '', titles = [], imdbId = null, season = 1, episode = 1, signal = null } = {}) {
  const trace = izleyici();
  const isFilm = type === 'movie';
  const s = +season || 1, e = +episode || 1;
  const oturum = oturumAc();

  // — 1. alan adı: patronun tercih sırası (dizipalDiger önce). Ölü ayna
  //      (dizipal1587) asla ilk denenmez → soğukta 7-14 sn kök yoklama
  //      vergisi çöp olur; en sona itilir.
  const harita = await siteurlHaritasi({ trace });
  const alanAdaylari = [harita.dizipalDiger, harita.dizipal, ...BILINEN].filter(Boolean)
    .map((u) => u.replace(/\/$/, ''))
    .filter((u, i, a) => a.indexOf(u) === i);
  const oluAyna = (u) => /dizipal1587\./i.test(u);
  const base = await alanAdiCoz('', [...alanAdaylari.filter((u) => !oluAyna(u)), ...alanAdaylari.filter(oluAyna)], { trace, ua: UA });
  if (!base) return { sources: [], trace: trace.ozet() };

  // — 2. arama: IMDb önce, başlık yedek
  const arananlar = [...new Set([title, originalTitle, ...titles].map(temizBaslik).filter(Boolean))];
  const sorgular = [];
  if (imdbId) { sorgular.push(String(imdbId)); if (/^tt/i.test(String(imdbId))) sorgular.push(String(imdbId).replace(/^tt/i, '')); }
  sorgular.push(...arananlar);
  let icerikUrl = '';
  for (const q of sorgular) {
    if (icerikUrl) break;
    const ham = await gecir(`${base}/ajax-search?q=${encodeURIComponent(q)}`,
      { ref: `${base}/`, timeout: 7000, trace, oturum, signal, headers: { 'X-Requested-With': 'XMLHttpRequest' } });
    let liste = [];
    try { liste = JSON.parse(ham)?.results || []; } catch (_) {}
    trace.koy('arama', { q: String(q).slice(0, 24), sonuc: liste.length });
    if (liste.length) icerikUrl = mutlak(sonucSec(liste, isFilm, /^tt/i.test(String(q)) ? [] : arananlar), base);
  }
  if (!icerikUrl) { trace.koy('sonuc', { n: 0, neden: 'arama' }); return { sources: [], trace: trace.ozet() }; }

  // — 3. dizi: bölüm sayfasına in (sezon/bölüm KARİŞTIRMA — doğru bölüm şart)
  let icerikHtml = '';
  if (!isFilm) {
    const diziHtml = await gecir(icerikUrl, { ref: `${base}/`, timeout: 8000, trace, oturum, signal });
    const bl = diziHtml ? bolumLinku(diziHtml, icerikUrl, s, e) : '';
    if (!bl) { trace.koy('sonuc', { n: 0, neden: `bolum-yok S${s}E${e}` }); return { sources: [], trace: trace.ozet() }; }
    icerikUrl = mutlak(bl, icerikUrl);
    trace.koy('bolum', { icerikUrl });
    icerikHtml = await gecir(icerikUrl, { ref: `${base}/`, timeout: 8000, trace, oturum, signal }) || '';
  } else {
    icerikHtml = await gecir(icerikUrl, { ref: `${base}/`, timeout: 8000, trace, oturum, signal }) || '';
  }
  if (!icerikHtml) { trace.koy('sonuc', { n: 0, neden: 'sayfa' }); return { sources: [], trace: trace.ozet() }; }

  // — 4. oynatıcı konfigi: data-cfg → ajax (oturumlu) → {v, t}
  let embedUrl = '';
  let dogrudan = '';
  const cfgM = icerikHtml.match(/data-cfg=["']([^"']+)["']/);
  if (cfgM) {
    const konfig = await konfigBul(base, icerikUrl, entitySoy(cfgM[1]), oturum, trace, signal);
    const v = konfig ? String(konfig.v || '').trim() : '';
    if (v) {
      const temizV = v.startsWith('//') ? `https:${v}` : v;
      if (/^https?:/i.test(temizV) && medyaMi(temizV)) dogrudan = m3u8eCevir(temizV);
      else if (/^https?:/i.test(temizV)) embedUrl = temizV;
      else { const i = (v.match(/<iframe[^>]*src=["']([^"']+)["']/i) || [])[1]; if (i) embedUrl = mutlak(i, base); }
    }
  }
  if (!embedUrl && !dogrudan) {
    const i = (icerikHtml.match(/<iframe[^>]*src=["']([^"']+)["']/i) || [])[1];
    if (i) embedUrl = mutlak(i, base);
  }

  // — 5. yayın
  const liste = [];
  const gorulen = new Set();
  let bulgu = dogrudan ? { url: dogrudan, altyazilar: [] } : (embedUrl ? await oynaticiCoz(embedUrl, icerikUrl, trace, signal) : null);
  if (bulgu && bulgu.url && medyaMi(bulgu.url) && !gorulen.has(bulgu.url)) {
    gorulen.add(bulgu.url);
    const oynaticiKoku = koken(embedUrl) || koken(dogrudan) || base;
    const dublaj = /dual|trdub|dublaj/i.test(bulgu.url);
    const taban = `${(imdbId || 'x').replace(/\W/g, '')}_${isFilm ? 'm' : `s${s}e${e}`}`;
    liste.push(kaynak({
      id: `dzp_${dublaj ? 'dub' : 'sub'}_${taban}`,
      ad: `Muhlif ${dublaj ? 'Dublaj' : 'Akış'}`,
      url: bulgu.url,
      kategori: dublaj ? 'dubbed' : 'subtitled',
      headers: { Referer: `${oynaticiKoku}/`, 'User-Agent': PLAYER_UA, Accept: '*/*' },
      altyazilar: bulgu.altyazilar || [],
      kalite: '1080p',
    }));
  }
  trace.koy('sonuc', { n: liste.length });
  return { sources: liste, trace: trace.ozet() };
}

export default { apiVersion: 1, id: kimlik.id, name: kimlik.alias, mediaTypes: kimlik.mediaTypes, async resolve(a) { return (await coz(a)).sources; } };
