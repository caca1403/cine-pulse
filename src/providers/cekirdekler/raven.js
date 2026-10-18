/* ==========================================================================
   CinePulse — "Raven" çekirdeği (birinci taraf, bağımlılıksız) — film + TV
   --------------------------------------------------------------------------
   Ne yapıyor: Büyük Türkçe dizi/film sitesinin (alan: dizipal ailesi) arama
   ucundan içeriği bulur; bölüm/film sayfası "Doğrulama gerekiyor" (Turnstile)
   kapılı olduğu için sayfayı cihazın gizli WebView'ında açtırır, oradan
   çıkan oynatıcı yapılandırmasını (data-cfg) site API'sinden geçırıp doğrudan
   yayına çevirir.

   Ölçülen gerçekler (2026-10-18, bu çekirdek yazılırken canlı doğrulandı):
     • Alan adı aynası SIK değişiyor (1229 → 1587 → 2140) — adres ALANLAR
       haritasından/-canlı listeden çözülür, koda gömülmez.
     • GET {site}/ajax-search?q=<metin> → JSON {success, results:[{url,title,
       year,type}]} — arama düz HTTP çalışır (ölçüldü; dizipal2140 HTTP 200).
     • Dizi sayfasında bölüm bağlantıları: /bolum/<slug>-{S}-sezon-{E}-bolum
     • Bölüm sayfası ANONİM HTTP'de "Doğrulama gerekiyor" (Turnstile) veya 429
       döndürüyor (ölçüldü) → sayfa gizli WebView'da açılır; cihazda WebView
       çerezleri CookieManager'da biriktiği için sonraki API POST'u geçer.
     • Sayfadaki data-cfg (HTML-varlık kaçıklı) → POST {site}/ajax-player-config
       gövde "cfg=<cfg>" → JSON {config:{v,t}} ya da {enc:{c,iv,k1,k2}}
       (enc: anahtar = k1⊕k2 bayt bayt, AES-256-CBC PKCS7, WebCrypto ile çözülür)
     • v düz medya ise direkt yayın; imagestoo embed'i POST getVideo ile çözülür.
     • İframe ASLA listelenmez — yalnız doğrudan m3u8/mp4.
   ========================================================================== */

import { metinAl, jsonAl, jsonBayt, m3u8eCevir, sadeles, adayBasliklar, tmdbBilgi, zamanAsimi } from '../ortakCekirdek.js';
import { alanYaniti } from '../alanlar.js';
import { resolvePageInNativeWebView, hasNativeWebViewResolver } from '../../services/platform/androidWebViewResolver.js';

const AD = 'Raven';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
const YAYIN_BASLIK = { 'User-Agent': 'okhttp/4.9.2', Accept: '*/*' };
const YEDEK_KOKLER = ['https://dizipal2140.com', 'https://dizipal.com'];

const norm = s => sadeles(String(s || '')).replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
const eslesir = (a, b) => { const x = norm(a), y = norm(b); return x && y && (x === y || x.includes(y) || y.includes(x)); };

function entitySoy(s) {
  let out = String(s || '');
  for (let i = 0; i < 3; i++) {
    out = out.replace(/&amp;quot;/g, '"').replace(/&quot;/g, '"').replace(/&amp;/g, '&')
      .replace(/&#0?39;|&apos;/g, "'").replace(/&lt;/g, '<').replace(/&gt;/g, '>');
  }
  return out;
}

/* Alan adını canlı haritadan çöz; düşerse yedekleri dene. */
function kokler() {
  let canli = '';
  try { canli = alanYaniti().domains['Raven'] || ''; } catch (_) { /* sabit haritaya düş */ }
  return [...new Set([canli, ...YEDEK_KOKLER].filter(Boolean))];
}

/* base64/b64url → bayt */
function b64Bayt(s) {
  const temiz = String(s || '').replace(/-/g, '+').replace(/_/g, '/').replace(/[\s=]+/g, '');
  const bin = atob(temiz + '='.repeat((4 - (temiz.length % 4)) % 4));
  return Uint8Array.from(bin, c => c.charCodeAt(0));
}

/* enc:{c,iv,k1,k2} → düzmetin (anahtar = k1⊕k2; AES-CBC PKCS7). */
async function encCoz(enc) {
  try {
    const k1 = b64Bayt(enc.k1), k2 = b64Bayt(enc.k2);
    if (!k1.length || k1.length !== k2.length) return '';
    const anahtar = new Uint8Array(k1.length);
    for (let i = 0; i < k1.length; i++) anahtar[i] = k1[i] ^ k2[i];
    const sub = typeof crypto !== 'undefined' ? (crypto.subtle || crypto.webkitSubtle) : null;
    if (!sub) return '';
    const anahtarObj = await sub.importKey('raw', anahtar, { name: 'AES-CBC' }, false, ['decrypt']);
    const duz = await sub.decrypt({ name: 'AES-CBC', iv: b64Bayt(enc.iv) }, anahtarObj, b64Bayt(enc.c));
    return new TextDecoder().decode(duz);
  } catch (_) {
    return '';
  }
}

/* data-cfg → site API'sinden oynatıcı adresi (v düzmetni). */
async function cfgCoz(base, cfgDuz, sayfaRef) {
  const govde = `cfg=${encodeURIComponent(cfgDuz)}`;
  const basliklar = {
    'User-Agent': UA, 'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
    Referer: sayfaRef,
  };
  const dene = async yol => {
    const j = await jsonBayt(`${base}${yol}`, { ms: 6000, govde, basliklar });
    if (!j) return '';
    const v = String(j?.config?.v || '').trim();
    if (v) return v;
    if (j?.enc?.c) return await encCoz(j.enc);
    return '';
  };
  /* İki uç yarışır; ilki boş dönerse ikincisi denenir (uçlar değişken). */
  let v = await dene('/ajax-player-config');
  if (!v) v = await dene('/ajax');
  return v;
}

/* imagestoo gömülüsünü kısayoldan çöz. */
async function imagestooCoz(embed, icerikRef) {
  const hash = embed.match(/imagestoo\.[a-z]+\/(?:video|embed)\/([a-z0-9]+)/i)?.[1]
    || embed.match(/[?&]data=([a-z0-9]{16,})/)?.[1];
  if (!hash) return '';
  const j = await jsonAl(`https://imagestoo.com/player/index.php?data=${hash}&do=getVideo`, {
    ms: 5000, ref: embed,
    govde: `hash=${hash}&r=${encodeURIComponent(icerikRef)}`,
    basliklar: { 'User-Agent': UA, 'Content-Type': 'application/x-www-form-urlencoded', Origin: new URL(embed).origin },
  });
  const ham = String(j?.securedLink || j?.videoSource || '');
  if (!ham) return '';
  const url = m3u8eCevir(ham);
  return /\.(m3u8|mp4)(\?|#|$)/i.test(url) ? url : '';
}

/* Yayın adresini doğrula: #EXTM3U veya uzantılı medya. */
async function yayinKabul(url, ref) {
  const oynaticiKoku = new URL(url).origin;
  if (/\.mp4(\?|#|$)/i.test(url)) return { kalite: '' };
  const metin = await metinAl(url, { ms: 7000, ref, basliklar: { ...YAYIN_BASLIK, Referer: `${oynaticiKoku}/` } });
  return /#EXTM3U/.test(metin.slice(0, 200)) ? { kalite: '' } : null;
}

/* Bölüm bağlantısını dizi sayfasında bul (üç URL kalıbı + metin). */
function bolumBul(ham, base, S, E) {
  const hrefler = [...String(ham).matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([\s\S]{0,120}?)<\/a>/gi)];
  const kaliplar = [
    new RegExp(`(?<![0-9])-${S}-sezon-${E}-bolum`),
    new RegExp(`/sezon-${S}/bolum-${E}(/|$)`),
    new RegExp(`(?<![0-9])-${S}x${E}(-|$|/)`),
  ];
  for (const [, href, metin] of hrefler) {
    if (kaliplar.some(k => k.test(href))) return href.startsWith('http') ? href : `${base}${href}`;
  }
  for (const [, href, metin] of hrefler) {
    const m = entitySoy(metin);
    if (new RegExp(`${S}\\.\\s*sezon`, 'i').test(m) && new RegExp(`${E}\\.\\s*b[oö]l[uü]m`, 'i').test(m)) {
      return href.startsWith('http') ? href : `${base}${href}`;
    }
  }
  return '';
}

/* Sayfayı aç: gizli WebView varsa önce o (Turnstile'ı gerçek Chromium çözer,
   çerezler cihazın CookieManager'ında birikir; dokunuş adımı onay kutusunu da
   tıklar — ölçüldü 2026-10-18: data-cfg geldi). Sonuç Kullanilabilir değilse
   (interstisial/429) düz HTTP'ye düş; ölçülen: WebView bazen interstisial'i
   ok-html sanip bos donuyordu — çekirdek onu kabul edip 0'a düşmesin. */
async function sayfaAc(adres) {
  const gecerli = h => {
    const s = String(h || '');
    return s.length > 4000 && !/do\u011frulama gerekiyor|too many requests|just a moment|cf-chl|error code: 4\d\d/i.test(s.slice(0, 9000));
  };
  if (hasNativeWebViewResolver()) {
    try {
      const cozum = await resolvePageInNativeWebView(adres, { timeoutMs: 18000, media: true });
      if (cozum?.ok) {
        const ham = /^\s*[[{]/.test(String(cozum.text || '')) ? String(cozum.text) : String(cozum.html || '');
        const akislar = Array.isArray(cozum.streams) ? cozum.streams : [];
        if (akislar.length || /data-cfg/i.test(ham) || gecerli(ham)) return { ham, akislar };
      }
    } catch (_) { /* düz HTTP'ye düş */ }
  }
  return { ham: await metinAl(adres, { ms: 6000, basliklar: { 'User-Agent': UA } }), akislar: [] };
}

export async function getStreams(kimlik, tur = 'movie', sezon = 1, bolum = 1) {
  const dizi = tur === 'tv';
  const bilgi = await tmdbBilgi(kimlik, tur);
  const adaylar = (bilgi ? adayBasliklar(bilgi) : [String(kimlik || '')]).filter(t => t.length > 1);
  if (!adaylar.length) return [];

  /* Çalışan alan adını aramadan kanıtla (ayna rotasyonu sık — 2026-10 ölçümü). */
  let base = '';
  let kartlar = [];
  for (const kok of kokler()) {
    for (const soru of adaylar.slice(0, 2)) {
      const j = await jsonBayt(`${kok}/ajax-search?q=${encodeURIComponent(soru)}`, {
        ref: `${kok}/`, ms: 7000,
        basliklar: { 'User-Agent': UA, 'X-Requested-With': 'XMLHttpRequest' },
      });
      if (!j || !Array.isArray(j.results)) continue;
      base = kok;
      kartlar = j.results;
      break;
    }
    if (base) break;
  }
  if (!base) return [];

  const tipKapi = u => (dizi ? /\/(dizi|series)\//i.test(u) : /\/(film|movie)s?\//i.test(u));
  const icerik = kartlar.find(k => tipKapi(String(k.url || '')) && adaylar.some(a => eslesir(k.title, a)))
    || kartlar.find(k => tipKapi(String(k.url || '')));
  if (!icerik?.url) return [];

  let sayfaAdres = String(icerik.url);
  if (dizi) {
    const diziSayfa = await metinAl(sayfaAdres, { ms: 9000, basliklar: { 'User-Agent': UA } });
    sayfaAdres = bolumBul(diziSayfa, base, +sezon || 1, +bolum || 1);
    if (!sayfaAdres) return [];
  }

  const { ham, akislar } = await sayfaAc(sayfaAdres);

  /* 1) WebView akış yakaladıysa bunlar en temiz kanıttır. */
  const bulunan = [];
  const gorulen = new Set();
  for (const a of akislar) {
    const url = String(a?.url || '');
    if (!/\.(m3u8|mp4|mpd)([?#]|$)/i.test(url) || /\/ads?\/|preroll|vast|doubleclick/i.test(url)) continue;
    const anahtar = url.split(/[?#]/)[0];
    if (gorulen.has(anahtar)) continue;
    gorulen.add(anahtar);
    bulunan.push({ url, headers: { ...(a.headers || {}), Referer: sayfaAdres } });
    if (bulunan.length >= 3) break;
  }

  /* 2) data-cfg → site API'si → doğrudan yayın / imagestoo. */
  if (!bulunan.length && ham) {
    const cfgDuz = entitySoy(ham.match(/data-cfg=["']([^"']+)["']/i)?.[1] || '');
    if (cfgDuz) {
      let v = await cfgCoz(base, cfgDuz, sayfaAdres);
      v = String(v || '').trim();
      if (v.startsWith('//')) v = `https:${v}`;
      let url = '';
      if (/^https?:/i.test(v)) {
        const donusen = m3u8eCevir(v);
        if (/\.(m3u8|mp4|mpd)(\?|#|$)/i.test(donusen)) url = donusen;
        else if (/imagestoo\.[a-z]+\/(?:video|embed)\//i.test(v) || /[?&]data=[a-z0-9]{16,}/.test(v)) url = await imagestooCoz(v, sayfaAdres);
        else {
          const iframeici = v.match(/<iframe[^>]*src=["']([^"']+)["']/i)?.[1] || '';
          if (/imagestoo/i.test(iframeici)) url = await imagestooCoz(iframeici, sayfaAdres);
        }
      }
      if (url && !gorulen.has(url)) {
        gorulen.add(url);
        const oynaticiKoku = new URL(url).origin;
        bulunan.push({ url, headers: { ...YAYIN_BASLIK, Referer: `${oynaticiKoku}/` } });
      }
    }
  }

  return bulunan.slice(0, 3).map((b, i) => ({
    name: AD,
    title: `${AD} ${/dual|trdub|dublaj/i.test(b.url) ? 'Dublaj' : 'Akış'} ${i + 1}`,
    url: b.url,
    quality: '1080p',
    format: /\.mp4/i.test(b.url) ? 'mp4' : 'm3u8',
    headers: b.headers,
  }));
}

if (typeof globalThis !== 'undefined') globalThis.getStreams = getStreams;
export default getStreams;
