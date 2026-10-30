/* ==========================================================================
   CinePulse — "Vision" çekirdeği (birinci taraf) — SezonlukDizi ailesi
   --------------------------------------------------------------------------
   Ölçülen zincir (2026-10-30, Node'da uçtan uca doğrulandı):
     • Arama:  POST {site}/ajax/arama.asp  q=<küçük harf başlık>
       → { status, results:{ diziler:{results:[{did,title:"Ad (2008)",
         url:"/diziler/<slug>.html",image,imdb}]}, filmler, sanatcilar } }
       (site HTML ve AJAX windows-1254 kodludur; başlık eşleştirme cp1254
        çözümüyle yapılır. q büyük harf içermemeli: "breaking+bad" çalışır,
        "Breaking Bad" boş dizi listesi döner — ölçüldü.)
     • Bölüm:  GET /<slug>/{S}-sezon-{E}-bolum.html  (deterministik kalıp)
       → #dilsec[data-id] = bölüm id (bid). dublaj yolu /<slug>/dublaj/...
        AYNI bid'i kullanır; dil ayrımcılığı dataAlternatif22'deki `dil`
        parametresindedir (1=Altyazı, 0=Dublaj).
     • Kaynak: POST /ajax/dataAlternatif22.asp {bid, dil}
       → { status:"success", data:[{id, baslik, kalite}] }
       • Uçlar zaman zaman BOŞ 200 döner (kota/limit) → tekrar deneme şart.
     • Embed:  POST /ajax/dataEmbed22.asp {id} → <iframe src=...>
       Pixel/VidMoly uçları İLK istekte captcha stub'ı döner
       (src="/ajax/reCAPTCHADATA.asp" → Turnstile sitekey'li sayfa; token
       iframe içinde /ajax/reCAPTCHA.asp'e POST edilir, "ok" → sunucu ASP
        oturumunu doğrulanmış işaretler → aynı oturumla TEKRAR sorulunca
       GERÇEK iframe src döner — ölçüldü 2026-10-30, cihaz). Stub'ı aşmanın
       TEK çalışan yolu: gizli NATİF WebView (androidWebViewResolver) captcha
       sayfasını FIRST-PARTY açar; Turnstile kendini çözer, Set-Cookie
       CookieManager'a düşer (CapacitorHttp ile aynı kavanoz) → retry.
       Uygulama içi <iframe> hilesi ÇALIŞMIYOR (üçüncü-taraf çerez blokajı:
       reCAPTCHA.asp "ok" dönse bile bayrak istemci oturumuna dönemiyor).
       Okru: public ok.ru/videoembed/<id> (data-options→flashvars.metadata:
        hlsManifestUrl + videos[]; bazı videolarda players[] string kalite).
       VidMoly: //vidmoly.net/embed-<kod>.html (301→vidmoly.biz) düz-metin
        jwplayer `sources:[{file:...}]` + `label` (eval-packed DEĞİL; yine de
        paketli varyant için Dean-Edwards unpacker yedeği var). master imzalı
        (t/s/e/asn) → Referer tek başına şart değil, proxyGerekmez şart.
       Pixel: /player/pixel.asp?v=<v> sayfası POST /ajax/pixelapi.asp
        {id:<v>, embedid} bekler; ölçüldü: pixelapi artık her embed'de
       pixelserver'ın "authentication_required" hatasını proxy'liyor — site
        tarafı bozuk (Node + cihaz aynı hata) → aile en iyimser deneme, hata
        nedenini `neden` alanına yazar. Dosya çıkarsa pixeldrain doğrudan
        akış: https://pixeldrain.com/api/file/<id>.
       Filemoon alternatifi Doğrudan erişilebilir Byse frontend'i döndürür:
       https://<byse-dönen-domain>/e/<kod>  (alan adı döner; iframe'den okunur).
     • Byse:   GET {origin}/api/videos/<kod>/ → playback{version, iv, payload,
       key_parts[30]} AES-256-GCM; anahtar = b64url(key_parts[v-1]) ++
       b64url(key_parts[30-v]) (32B), iv=b64url(iv), payload'un son 16B'yi
       GCM tag'i → JSON { sources:[{quality,label,height,url:master.m3u8}] }.
       (Bu, SAYFA JS'ini ÇALIŞTIRMAK değil, şifre çözmeyi birebir yeniden
        üretmektir; çekirdek uzaktan JS İCRA ETMEZ.)
     • Dil:    master m3u8'de EXT-X-MEDIA yoksa TS segman PMT dil tanıtıcısı
       okunur (dublajKestirme safları). Ölçüldü: sprintcdn master'ları tek
       muxed ses taşır, PMT'de dil tanıtıcısı YOK → doğrulanamayan satır
       rozetsiz yayınlanır; "Türkçe Dublaj" yalnız master kanıtıyla yazılır.
   ========================================================================== */

import { tmdbBilgi, adayBasliklar, sadeles, yilUyar } from '../ortakCekirdek.js';
import { m3u8SesDokumu, baytSesDilleri } from '../../services/dogrudan/dublajKestirme.js';
import { hasNativeWebViewResolver, resolvePageInNativeWebView } from '../../services/platform/androidWebViewResolver.js';

const AD = 'Vision';
const SITE = 'https://sezonlukdizi.cc';
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

const sinyal = (ms) => (typeof AbortSignal?.timeout === 'function' ? AbortSignal.timeout(ms) : undefined);

/* Site windows-1254 yayar; çözüm bilinemezse UTF-8'e düş. */
function cp1254Coz(buf) {
  try { return new TextDecoder('windows-1254').decode(buf); } catch (_) {
    try { return new TextDecoder('utf-8').decode(buf); } catch (__) { return String(buf); }
  }
}

const ONBELLEK_CK = { deger: '' };     /* captcha sonrasının ASP oturum çerezi */
let UCAN_CAPTCHA = null;               /* uçan-Promise: aynı anda tek çözüm */

async function iste(url, { ref = SITE + '/', ms = 12000, govde = null, tekrar = 2 } = {}) {
  for (let deneme = 0; deneme <= tekrar; deneme++) {
    try {
      const basliklar = { 'User-Agent': UA, Accept: 'text/html,application/json,*/*', Referer: ref };
      if (ONBELLEK_CK.deger) basliklar.Cookie = ONBELLEK_CK.deger;
      if (govde) {
        basliklar['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
        basliklar['X-Requested-With'] = 'XMLHttpRequest';
      }
      const r = await fetch(url, {
        method: govde ? 'POST' : 'GET',
        headers: basliklar,
        body: govde ? new URLSearchParams(govde).toString() : undefined,
        signal: sinyal(ms),
      });
      const buf = await r.arrayBuffer();
      const metin = cp1254Coz(buf);
      if (r.ok && metin.trim()) return metin;
    } catch (_) { /* dene */ }
    if (deneme < tekrar) await new Promise((c) => setTimeout(c, 900 * (deneme + 1)));
  }
  return '';
}

const norm = (s) => sadeles(String(s || '')).replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();

/* ── Byse AES-256-GCM çözümü (uzaktan JS icra YOK; sadece kripto) ─────── */
function b64urlTam(s) {
  let t = String(s || '').replace(/-/g, '+').replace(/_/g, '/');
  while (t.length % 4) t += '=';
  return t;
}
function b64urlBayt(s) {
  const t = b64urlTam(s);
  if (typeof Buffer !== 'undefined') return new Uint8Array(Buffer.from(t, 'base64'));
  const bin = atob(t); const u = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
  return u;
}

async function gcmCoz(key, iv, veri, etiket) {
  if (typeof process !== 'undefined' && process.versions?.node) {
    try {
      const { createDecipheriv } = await import('node:crypto');
      const dc = createDecipheriv('aes-256-gcm', key, iv);
      dc.setAuthTag(etiket);
      return Buffer.concat([dc.update(veri), dc.final()]).toString('utf8');
    } catch (_) { /* WebCrypto'ya düş */ }
  }
  const ham = new Uint8Array(veri.length + etiket.length);
  ham.set(veri); ham.set(etiket, veri.length);
  const k = await crypto.subtle.importKey('raw', key, 'AES-GCM', false, ['decrypt']);
  const duz = await crypto.subtle.decrypt({ name: 'AES-GCM', iv, tagLength: 128 }, k, ham);
  return new TextDecoder().decode(duz);
}

/* playback bloğunu çöz → sources[] veya null
   ÖLÇÜM (2026-10-30): version sunucuda HER istekte değişiyor (3,9,20 ölçüldü) ve
   parça uzunlukları 24/16 karışık → `v-1` + `30-v` indeksleri v>15'te taşıyor,
   anahtar 32 bayta inmiyordu (Vision bu yüzden satır kaybediyordu). Birleşimi
   veriden seçiyoruz: tam olarak 32 bayt veren, diğerinden BAĞIMSIZ (farklı
   indisli) çiftler; tercih sırası ölçümde doğrulanan simetrik kuraldan yanadır. */
function byseAnahtarAdaylari(kp, v) {
  const bayt = kp.map((p) => b64urlBayt(p));
  const siralar = [];
  const ekle = (i, j) => {
    if (i < 0 || j < 0 || i >= bayt.length || j >= bayt.length || i === j) return;
    if (siralar.some(([a, b]) => a === i && b === j)) return;
    siralar.push([i, j]);
  };
  // 1) ölçümde doğrulanan simetrik kural: v-1 ve 30-v
  ekle(v - 1, 30 - v);
  // 2) yarım eşleme: v-1 ve v+14 (30 parça = 2×15)
  ekle(v - 1, v + 14);
  // 3) sıralı çiftler (v'yi yok say)
  const yarim = Math.floor(kp.length / 2);
  for (let i = 0; i < yarim; i++) { ekle(i, i + yarim); ekle(i + yarim, i); }
  return siralar
    .map(([i, j]) => ({ key: new Uint8Array([...bayt[i], ...bayt[j]]), i, j }))
    .filter((a) => a.key.length === 32);
}

/* playback bloğunu çöz → sources[] veya null */
async function byseCoz(playback) {
  const pb = playback;
  if (!pb || !pb.payload || !pb.iv || !Array.isArray(pb.key_parts)) return null;
  const v = parseInt(String(pb.version).trim(), 10) || 0;
  const kp = pb.key_parts;
  const iv = b64urlBayt(pb.iv);
  const blob = b64urlBayt(pb.payload);
  if (blob.length < 17 || iv.length !== 12) return null;
  const veri = blob.subarray(0, blob.length - 16);
  const etiket = blob.subarray(blob.length - 16);
  for (const aday of byseAnahtarAdaylari(kp, v)) {
    try {
      const duz = await gcmCoz(aday.key, iv, veri, etiket);
      const dec = JSON.parse(duz);
      if (Array.isArray(dec?.sources)) return dec.sources;
    } catch (_) { /* sıradaki birleşim */ }
  }
  return null;
}

/* ── Turnstile stub aşma: gizli natif WebView first-party çözüm ─────────
   dataEmbed22 Pixel/VidMoly için önce /ajax/reCAPTCHADATA.asp stub'ı döner.
   Gizli WebView captcha sayfasını kendi birinci-şahsi bağlamında açar;
   sayfanın kendi JS'i Turnstile'ı çözüp reCAPTCHA.asp'e POST eder ("ok"),
   sunucu ASP oturumunu doğrulanmış işaretler ve Set-Cookie CookieManager'a
   düşer. Sonraki dataEmbed22 (aynı çerezle) GERÇEK iframe src döner. */
async function captchaCoz(ref) {
  if (UCAN_CAPTCHA) return UCAN_CAPTCHA;
  UCAN_CAPTCHA = (async () => {
    if (!hasNativeWebViewResolver()) return false;
    try {
      const sonuc = await resolvePageInNativeWebView(
        `${SITE}/ajax/reCAPTCHADATA.asp?r=${Date.now()}`,
        { timeoutMs: 40000, referer: ref });
      const ck = String(sonuc?.cookies || '');
      if (ck) ONBELLEK_CK.deger = ck;
      return Boolean(sonuc);
    } catch (_) { return false; }
  })();
  try { return await UCAN_CAPTCHA; } finally { UCAN_CAPTCHA = null; }
}

/* dataEmbed22: stub gelirse captcha çöz + tekrarla (modül başına 1 çözüm).
   429 (hız limiti) boş döner → kısa bekleme ile EN FAZLA 2 tur; çok-ajanlı
   deneme hammer'ı limiti tetikliyor, saldırgan tekrar yasak. */
async function embedIste(id, ref) {
  for (let tur = 0; tur < 2; tur++) {
    const metin = await iste(`${SITE}/ajax/dataEmbed22.asp`, { govde: { id: String(id) }, ref, ms: 10000, tekrar: 0 });
    if (metin && !/reCAPTCHADATA/i.test(metin)) return metin;
    if (/reCAPTCHADATA/i.test(metin)) {
      const cozuldu = await captchaCoz(ref);
      if (!cozuldu) return '';
      continue;
    }
    await new Promise((c) => setTimeout(c, 1200));
  }
  return '';
}

/* ── Dean-Edwards string-unpacker (paketli embed JS yedeği) ────────────── */
function paketCoz(govde) {
  const m = String(govde).match(
    /eval\(function\(p,a,c,k,e,[dr]\)\{[\s\S]*?\}\('([^']*)',(\d+),(\d+),'([^']*)'\.split\('\|'\)/);
  if (!m) return '';
  const [, p, aStr, cStr, kw] = m;
  const a = parseInt(aStr, 10); const kelimeler = kw.split('|');
  let c = parseInt(cStr, 10); const harita = {};
  for (let i = 0; i < kelimeler.length && c > 0; i++, c--) {
    if (kelimeler[i]) harita[i.toString(a)] = kelimeler[i];
  }
  try {
    return p.replace(/\b[0-9a-z]+\b/g, (w) => harita[w] || w);
  } catch (_) { return ''; }
}

/* HTML varlıklarını (&quot; &#39; &amp; ...) açar. */
function htmlDegis(s) {
  return String(s || '')
    .replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&#x27;/gi, "'")
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
}

/* ── Okru: ok.ru/videoembed/<id → data-options → flashvars.metadata ───── */
const OKRU_KALITE = { full: '1080p', hd: '720p', aboveAverage: '540p', regular: '480p', mobile: '480p', low: '360p', lowest: '240p' };
function okruSec(met) {
  const havuz = [];
  if (met.hlsManifestUrl) havuz.push({ master: String(met.hlsManifestUrl), kalite: '' });
  const oyna = (dizi) => {
    for (const s of dizi) {
      const u = String(s?.url || s?.videoUrl || '');
      if (!/^https?:/i.test(u)) continue;
      const etiketAd = String(s.name || s.label || s.quality || s.strQuality || '').toLowerCase();
      havuz.push({ master: u, kalite: OKRU_KALITE[etiketAd] || (/\d+p/.test(etiketAd) ? etiketAd : (s.strQuality || '')) });
    }
  };
  if (Array.isArray(met.players)) oyna(met.players);
  if (Array.isArray(met.videos)) oyna(met.videos);
  return havuz;
}
function okruCoz(sayfa, iframeSrc) {
  const m = sayfa.match(/data-options="([^"]+)"/i) || sayfa.match(/data-options='([^']+)'/i);
  if (!m) return { adaylar: [], neden: 'data-options yok' };
  let opt = null; try { opt = JSON.parse(htmlDegis(m[1])); } catch (_) { return { adaylar: [], neden: 'data-options parse hatası' }; }
  let met = opt?.flashvars?.metadata;
  if (!met) return { adaylar: [], neden: 'flashvars.metadata yok (geo/giriş kısıtı?)' };
  if (typeof met === 'string') { try { met = JSON.parse(met); } catch (_) { return { adaylar: [], neden: 'metadata parse hatası' }; } }
  const adaylar = okruSec(met);
  return adaylar.length ? { adaylar } : { adaylar: [], neden: 'metadata içinde akış adresi yok' };
}

/* ── VidMoly: jwplayer sources (düz metin; paketliyse unpacker) ────────── */
function vidmolyCoz(sayfa, iframeSrc) {
  let letenek = String(sayfa);
  let m = letenek.match(/sources:\s*\[\s*\{[^}]*?file:\s*['"]([^'"]+\.(?:m3u8|mp4)[^'"]*)['"]/i);
  if (!m) {
    const acik = paketCoz(letenek);
    if (acik) m = acik.match(/sources:\s*\[\s*\{[^}]*?file:\s*['"]([^'"]+\.(?:m3u8|mp4)[^'"]*)['"]/i);
  }
  const kalite = (letenek.match(/label:\s*['"]([^'"]+)['"]/i) || [])[1] || '';
  if (!m) return { adaylar: [], neden: 'sources/file bulunamadı' };
  let origin = ''; try { origin = new URL(iframeSrc).origin; } catch (_) {}
  return { adaylar: [{ master: m[1], kalite }], origin };
}

/* ── Pixel: pixelapi.asp → pixeldrain doğrudan dosya (en iyimser) ────────
   Ölçüm 2026-10-30: pixelapi.asp tüm embed'lerde pixelserver'ın
   "authentication_required" yanıtını proxy'liyor (Node + cihaz) — site
   tarafı bozuk; yine de success gelirse dosya pixeldrain akışıdır. */
async function pixelCoz(vParam, embedId, ref) {
  const v = String(vParam || '').split('|')[0].trim();
  if (!v) return { adaylar: [], neden: 'v parametresi yok' };
  const id = v.split('/').pop();
  const ham = await iste(`${SITE}/ajax/pixelapi.asp`, {
    govde: { id, embedid: String(embedId) }, ref, ms: 10000, tekrar: 0,
  });
  let j = null; try { j = JSON.parse(ham); } catch (_) { return { adaylar: [], neden: 'pixelapi JSON değil' }; }
  const yeni = j?.id || j?.value?.id || '';
  if (yeni && /^[\w-]+$/.test(String(yeni))) {
    return { adaylar: [{ master: `https://pixeldrain.com/api/file/${yeni}`, kalite: '' }] };
  }
  return { adaylar: [], neden: String(j?.error || j?.value || 'pixelapi id vermedi').slice(0, 90) };
}

/* ── embed → master adresi ──────────────────────────────────────────────── */
async function embedCoz(embedHtml, iframeSrc, ctx = {}) {
  /* Pixel ailesi: /player/pixel.asp?v=<v> — site-içi sarmalayıcı sayfa */
  const px = iframeSrc.match(/\/player\/pixel\.asp\?v=([^&"']+)/i);
  if (px) {
    const r = await pixelCoz(decodeURIComponent(px[1]), ctx.altId || '', ctx.bolumUrl || iframeSrc);
    if (r.adaylar?.length) return { master: r.adaylar[0].master, kalite: r.adaylar[0].kalite, origin: SITE };
    return null;
  }
  /* Okru ailesi: ok.ru / odnoklassniki.ru videoembed */
  if (/^(https?:)?\/\/(www\.)?(ok\.ru|odnoklassniki\.ru)\/videoembed\//i.test(iframeSrc)) {
    const tam = iframeSrc.startsWith('//') ? `https:${iframeSrc}` : iframeSrc;
    const sayfa = embedHtml || await iste(tam, { ref: '', ms: 12000, tekrar: 1 });
    const r = okruCoz(sayfa, tam);
    if (r.adaylar?.length) return { master: r.adaylar[0].master, kalite: r.adaylar[0].kalite, origin: 'https://ok.ru' };
    return null;
  }
  /* VidMoly ailesi: vidmoly.<tld>/embed-<kod>.html */
  if (/vidmoly\.[a-z.]+\/embed-/i.test(iframeSrc)) {
    const tam = iframeSrc.startsWith('//') ? `https:${iframeSrc}` : iframeSrc;
    const sayfa = embedHtml || await iste(tam, { ref: `${SITE}/`, ms: 12000, tekrar: 1 });
    const r = vidmolyCoz(sayfa, tam);
    if (r.adaylar?.length) return { master: r.adaylar[0].master, kalite: r.adaylar[0].kalite, origin: r.origin };
    return null;
  }
  /* Byse ailesi: https://<rotating>/e/<kod> → api/videos API'si */
  const m = iframeSrc.match(/^https?:\/\/[^/]+\/(?:e\/|embed\/)([A-Za-z0-9]+)/);
  if (m) {
    const url = new URL(iframeSrc);
    const api = await iste(`${url.origin}/api/videos/${m[1]}/`, { ref: `${url.origin}/`, ms: 10000 });
    let j = null;
    try { j = JSON.parse(api); } catch (_) {}
    const sources = await byseCoz(j?.playback);
    const iyi = (sources || []).filter((s) => /^https?:/i.test(String(s?.url || '')))
      .sort((a, b) => (b.height || 0) - (a.height || 0));
    if (iyi.length) return { master: iyi[0].url, kalite: String(iyi[0].label || ''), origin: url.origin };
  }
  /* Jenerik: jwplayer dos satırında düz m3u8/mp4 */
  const duz = (embedHtml.match(/file:\s*["']([^"']+\.m3u8[^"']*)["']/i) || [])[1]
    || (embedHtml.match(/["'](https?:\/\/[^"']+\.m3u8[^"']*)["']/i) || [])[1];
  if (duz) return { master: duz, kalite: '', origin: new URL(iframeSrc).origin };
  return null;
}

/* ── master doğrulama + dil kanıtı (master → muxed segman) ──────────────── */
async function baytSinirli(url, ref, tavan = 262144) {
  try {
    const r = await fetch(url, {
      headers: { 'User-Agent': UA, Referer: ref, Range: 'bytes=0-262143' },
      signal: sinyal(9000),
    });
    if (!r.ok && r.status !== 206) return null;
    const parca = r.body?.getReader ? r.body.getReader() : null;
    if (!parca) return new Uint8Array(await (await r.arrayBuffer().catch(() => null))?.slice?.(0, tavan));
    const parcalar = []; let toplam = 0; let bitti = false;
    while (!bitti) {
      const { done, value } = await parca.read();
      if (done) break;
      parcalar.push(value); toplam += value.length;
      if (toplam >= tavan) { await parca.cancel().catch(() => {}); bitti = true; }
    }
    const hepsi = new Uint8Array(toplam); let i = 0;
    for (const p of parcalar) { hepsi.set(p, i); i += p.length; }
    return hepsi;
  } catch (_) { return null; }
}

async function kanitla(master, ref) {
  const metin = await iste(master, { ref, ms: 9000, tekrar: 1 });
  if (!/#EXTM3U|#EXT-X-|#EXTINF/i.test(metin)) return null;
  let dokum = m3u8SesDokumu(metin);
  if (!dokum.kanitlanabilir) {
    const varUrl = (metin.match(/^(https?:\/\/\S+\.m3u8\S*)/m) || [])[1];
    if (varUrl) {
      const v = await iste(varUrl, { ref, ms: 9000, tekrar: 0 });
      const seg = (v.match(/^(https?:\/\/\S+)(?:\?|\s|$)/m) || v.match(/^(?!#)(\S+)$/m) || [])[1];
      if (seg) {
        let tam = seg;
        try { tam = new URL(seg, varUrl).href; } catch (_) {}
        const bayt = await baytSinirli(tam, ref);
        if (bayt) {
          const diller = baytSesDilleri(bayt);
          if (diller && diller.size) {
            dokum = { diller: [...diller], trMi: diller.has('tr'), trAltyaziMi: false, cokluMu: diller.size > 1, kanitlanabilir: true };
          }
        }
      }
    }
  }
  const yuk = (metin.match(/RESOLUTION=\d+x(\d+)/g) || []).map((x) => Number((x.match(/x(\d+)/) || [])[1])).filter(Boolean);
  const h = yuk.length ? Math.max(...yuk) : 0;
  return { dokum, h };
}

/* ── arama + sayfa yardımcıları ─────────────────────────────────────────── */
async function ara(adaylar) {
  for (const soru of adaylar.slice(0, 3)) {
    const ham = await iste(`${SITE}/ajax/arama.asp`, { govde: { q: String(soru).toLowerCase() }, ms: 10000 });
    let j = null; try { j = JSON.parse(ham); } catch (_) { continue; }
    const liste = j?.results?.diziler?.results || [];
    const kayit = liste.find((x) => {
      const baslik = String(x?.title || '').replace(/\((?:19|20)\d{2}\)\s*$/, '');
      const b = norm(baslik);
      return b && adaylar.some((a) => { const n = norm(a); return n && (b === n || b.includes(n) || n.includes(b)); });
    }) || liste[0];
    const yol = String(kayit?.url || '');
    const slug = (yol.match(/\/diziler\/([a-z0-9-]+)\.html/i) || [])[1];
    if (!slug) continue;
    const yil = Number(((String(kayit.title || '').match(/\((19|20)\d{2}\)/) || [])[0] || '').replace(/[()]/g, '')) || 0;
    return { slug, yil, baslik: kayit.title };
  }
  return null;
}

const ONBELLEK = new Map();
const ONBELLEK_MS = 15 * 60 * 1000;
const UCAN = new Map();

export async function getStreams(kimlik, tur = 'tv', sezon = 1, bolum = 1) {
  if (tur !== 'tv') return []; // sitede yalnız dizi kataloğu var
  const kim = (kimlik && typeof kimlik === 'object') ? (kimlik.tmdbId || kimlik.id || kimlik.imdbId || '') : kimlik;
  const bilgi = await tmdbBilgi(kim, tur);
  const adaylar = bilgi ? adayBasliklar(bilgi) : [];
  if (!adaylar.length) return [];

  const s = +sezon || 1;
  const b = +bolum || 1;
  const anahtar = `tv:${bilgi?.baslik || kim}:${s}:${b}`;
  const hazir = ONBELLEK.get(anahtar);
  if (hazir && Date.now() - hazir.t < ONBELLEK_MS) return hazir.sonuc;
  if (UCAN.has(anahtar)) return UCAN.get(anahtar);

  const is = (async () => {
    /* 1) arama → slug */
    let kayit = await ara(adaylar);
    if (kayit && bilgi?.yil && kayit.yil && !yilUyar(kayit.yil, bilgi.yil)) kayit = null;
    if (!kayit) return [];

    /* 2) bölüm sayfası → bid */
    const bolumUrl = `${SITE}/${kayit.slug}/${s}-sezon-${b}-bolum.html`;
    const html = await iste(bolumUrl, { ref: `${SITE}/${kayit.slug}/`, ms: 12000, tekrar: 1 });
    const bid = (html.match(/id="dilsec"[^>]*data-id="(\d+)"/) || html.match(/bid="(\d+)"/) || [])[1];
    if (!bid) return [];

    /* 3) dil kolları: dublaj (0) önce denenir, satırda rozet yine kanıttan.
       TÜM sunucular denenir (yalnız ilk 4 değil): aynı bölümde her sunucu ayrı
       master taşır, kırpma dublaj/altyazı kaynaklarını atıyordu (2026-10-30). */
    const denenecek = [];
    for (const dil of [0, 1]) {
      const ham = await iste(`${SITE}/ajax/dataAlternatif22.asp`, { govde: { bid, dil: String(dil) }, ref: bolumUrl, ms: 10000 });
      let j = null; try { j = JSON.parse(ham); } catch (_) {}
      const satirlar = (j?.status === 'success' && Array.isArray(j.data) ? j.data : [])
        .filter((x) => x?.id && x?.baslik)
        .sort((x, y) => (y.kalite || 0) - (x.kalite || 0));
      for (const satir of satirlar) denenecek.push({ ...satir, dil });
    }
    if (!denenecek.length) return [];

    /* 4) embed başına iframe → master (Turnstile stub'ı gizli WebView ile aşılır) */
    const hamleler = denenecek.slice(0, 12);
    const adaylar2 = (await Promise.allSettled(hamleler.map(async (alt) => {
      const emb = await embedIste(alt.id, bolumUrl);
      const src = (emb.match(/<iframe[^>]+src="([^"]+)"/i) || [])[1] || '';
      if (!src || /recaptcha/i.test(src)) return null;
      const tam = src.startsWith('//') ? `https:${src}` : /^https?:/i.test(src) ? src : `${SITE}${src}`;
      if (/recaptcha/i.test(tam)) return null;
      /* Pixel site-içi sarmalayıcıdır; diğer aileler harici embed sayfası ister */
      const harici = !/\/player\/pixel\.asp/i.test(tam);
      const embedSayfa = harici ? await iste(tam, { ref: bolumUrl, ms: 12000, tekrar: 0 }) : '';
      const cozum = await embedCoz(embedSayfa, tam, { altId: alt.id, bolumUrl });
      return cozum ? { ...cozum, host: String(alt.baslik || 'Kaynak'), dil: alt.dil } : null;
    }))).filter((o) => o.status === 'fulfilled' && o.value).map((o) => o.value);

    /* 5) masterları paralel doğrula (8 sn tavan; düşse de satır yayınlanır).
       SUNUCU SIRASI korunur: aynı master'ı (aynı URL tabanı) taşıyan ikinci
       sunucu tekrar olmasın, ama dublaj/altyazı satırı BİR KEZ kaybolmasın. */
    const dogrulamalar = await Promise.allSettled(adaylar2.map((a) => kanitla(a.master, `${a.origin}/`)));
    const sonuc = [];
    const gorulen = new Set();
    adaylar2.forEach((a, i) => {
      if (gorulen.size >= 10) return;
      const kanit = dogrulamalar[i]?.status === 'fulfilled' ? dogrulamalar[i].value : null;
      const anahtar2 = a.master.split('?')[0];
      if (gorulen.has(anahtar2)) return;
      gorulen.add(anahtar2);
      const d = kanit?.dokum;
      const kanitliTr = Boolean(d?.kanitlanabilir && d.trMi);
      const kanitliTrAltyazi = Boolean(d?.kanitlanabilir && d.trAltyaziMi);
      const kalite = a.kalite || (kanit?.h >= 2000 ? '4K' : kanit?.h >= 1000 ? '1080p' : kanit?.h >= 700 ? '720p' : kanit?.h >= 400 ? '480p' : 'HD');
      /* DİL ETİKETİ: 'Türkçe Dublaj' YALNIZ master/segman kanıtıyla yazılır.
         Kanıt yoksa site varyantı dürüstçe adlandırılır; rozet ALANLARA yazılmaz. */
      const etiket = kanitliTr ? 'Türkçe Dublaj'
        : kanitliTrAltyazi ? 'TR Altyazı'
        : d?.kanitlanabilir ? 'Orijinal'
        : a.dil === 0 ? 'Dublaj (doğrulanmamış)' : 'Altyazı';
      const hlsMu = /\.m3u8(?:\?|#|$)/i.test(a.master);
      sonuc.push({
        name: AD,
        title: `${AD} · ${a.host} · ${kalite} · ${etiket}${d?.cokluMu ? ` · ${d.diller.length} Ses` : ''}`,
        url: a.master,
        quality: String(kalite),
        format: hlsMu ? 'hls' : 'direct',
        isM3u8: hlsMu,
        diller: kanitliTr ? ['tr'] : kanitliTrAltyazi ? ['altyazi'] : [],
        trSes: kanitliTr,
        trAltyazi: kanitliTrAltyazi,
        ...(d?.kanitlanabilir ? { dilDurumu: kanitliTr ? 'dublaj' : (kanitliTrAltyazi ? 'altyazi' : 'orijinal') } : {}),
        headers: { 'User-Agent': UA, Referer: `${a.origin}/` },
        proxyGerekmez: true, // CDN imzası çekirdeğin IP'sine bağlanabilir — oynatıcı cihazdan çeksin
      });
    });

    if (sonuc.length) ONBELLEK.set(anahtar, { t: Date.now(), sonuc });
    if (ONBELLEK.size > 200) ONBELLEK.delete(ONBELLEK.keys().next().value);
    return sonuc;
  })();

  UCAN.set(anahtar, is);
  try { return await is; } finally { UCAN.delete(anahtar); }
}

if (typeof globalThis !== 'undefined') {
  globalThis.getStreams = getStreams;
  globalThis.__cpVision = getStreams;
}
export default getStreams;
