/* ==========================================================================
   ARCTURUS — Film Makinesi (filmmakinesi.to)  (sıfırdan, kit sözleşmesi)

   Adımlar (Nuvio `patronFilmMakinesi` akışının KENDİ DİLİMİZDE karşılığı;
   üçüncü taraf kod bundle edilmedi, çözücüler yeniden yazıldı):
     1. Alan adı: siteurl.txt (`filmmakinesi`) → bilinenler (filmmakinesi.to)
     2. IMDb:     argüman yoksa kit tmdbMeta ile TMDB'den çözülür
     3. Arama:    /arama/?s={imdb|başlık} → /film/… veya /dizi/… (kategori
                  filtreleri: /filmler-, /yabanci-dizi-, /tur/, /ulke/ atlanır)
     4. Dizi:     sezon-N/bolum-M bağlantısı (yoksa kalıp yol denenir)
     5. Oynatıcı: gömülü <iframe data-src|src> + <a data-video_url> butonları
                  (youtube eleme; closeload/rapid öncelik) — HEPSİ paralel
                  çözülür, yalnızca doğrudan m3u8 listelenir. IFRAME YOK.
     6. Çözücü:  oynatıcı HTML'i üç şemadan birini taşır — hepsi SAF metin
                  dönüşümüdür, kod yürütülmez:
                    ye → dizi + anahtar-karıştırma + LCG sürüm + XOR
                    vn → dizi + op dizisi (base64/ters/rot) + LCG + XOR
                    pn → packer → rot13 → base64 → mod kaydırması
                  + packer ve düz master.m3u8 yedekleri. playmix.uno ENGELLİ.

   CLOUDFLARE (ölçüldü 2026-10-12): filmmakinesi.to tamamı JS challenge'lı —
   datacenter/worker yolundan HER istek 403 "Just a moment" (hızlı düşer,
   bütçeyi yakmaz). Gerçek tarayıcı motoru challenge'ı ~2-3 sn'de kendiliğinden
   geçiyor (tarayıcı paneliyle doğrulandı). Bu yüzden Orion'daki gibi:
   içerik sayfası isteiği varsayılan webView:true gider (cihazda gizli
   WebView bir KEZ çözer, çerez paylaşımıyla gerisi hızlı akar); arama ve
   oynatıcı istekleri webView:false'tur. Node/masaüstü testinde WebView yolu
   no-op'tur → hızlı 0 sonuç.
   ========================================================================== */

import {
  istek, izleyici, anchorlar, mutlak, koken, m3u8eCevir, medyaMi,
  kaynak, temizBaslik, baslikEslesir, slugla, tracksAltyazilari,
  alanAdiCoz, tmdbMeta,
} from './kit.js';
import { b64Kaydir, packerCoz } from '../services/hdfcDecoders.js';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
const PLAYER_UA = 'okhttp/4.9.2';
const BILINEN = ['https://filmmakinesi.to'];
const ENGELLI_YAYIN = ['playmix.uno'];

export const kimlik = { id: 'fm', alias: 'Arcturus', mediaTypes: ['movie', 'tv'] };

/* ── çözücüler (saf metin; üçüncü taraf kod yürütülmez) ───────────────── */

const rot = (s, n) => String(s).replace(/[a-zA-Z]/g, (c) => {
  const base = c.charCodeAt(0) <= 90 ? 65 : 97;
  return String.fromCharCode(((c.charCodeAt(0) - base + n) % 26 + 26) % 26 + base);
});
const ters = (s) => s.split('').reverse().join('');
const sonUrl = (metin) => {
  const m = String(metin || '').match(/https?:\/\/[^\s"'<>\0\u0080-\uFFFF]+/);
  return m ? m3u8eCevir(m[0]) : '';
};

/** `ye` şeması: dizi → (pos2:op, pos1:seed) → op zinciri → LCG karıştırma → XOR. */
function yeCoz(arr) {
  try {
    if (!Array.isArray(arr) || arr.length < 5) return '';
    const kopya = [...arr];
    const n = kopya.length - 2;
    const opKey = kopya.splice(8 + (n % 5), 1)[0];
    const seedKey = kopya.splice(n % 7, 1)[0];
    if (typeof opKey !== 'string' || typeof seedKey !== 'string') return '';
    let s = kopya.join('');
    if (opKey.length > 2048) s = ters(s);
    let h1 = 0; let h2 = 0;
    for (let i = 0; i < seedKey.length; i++) {
      const c = seedKey.charCodeAt(i);
      h1 = (h1 * 37 + c) % 241;
      // referansla birebir: (c<<1)^i önce XOR, topla, sonra & 255
      h2 = (h2 + (((c << 1)) ^ i)) & 255;
    }
    let seed0 = (h1 * 3 + h2) % 256;
    const step = (h2 % 11) + 5;
    let lcg = ((h2 * 251 + h1) % 65519) + 1;
    for (let i = opKey.length - 1; i >= 0; i--) {
      const ch = opKey.charAt(i);
      if (ch === '7') s = b64Kaydir(s);
      else if (ch === '3') s = ters(s);
      else s = rot(s, (26 - ((ch.charCodeAt(0) - 96) % 26)) % 26);
    }
    if (seedKey.length > 4096) s = b64Kaydir(s);
    const idx = [];
    let l = lcg;
    for (let i = s.length - 1; i >= 1; i--) { l = (l * 97 + 41) % 65519; idx[i] = l % (i + 1); }
    const ch2 = s.split('');
    for (let i = 1; i < s.length; i++) { const j = idx[i]; const t = ch2[i]; ch2[i] = ch2[j]; ch2[j] = t; }
    s = ch2.join('');
    let kb = seed0; let out = '';
    for (let i = 0; i < s.length; i++) {
      const c = s.charCodeAt(i);
      kb = (kb * 5 + step) % 256;
      out += String.fromCharCode(c ^ kb);
      kb = (kb + c) % 256;
    }
    return sonUrl(out);
  } catch (_) { return ''; }
}

/** `vn` şeması: dizi + (anahtar, op) → op zinciri → LCG sürüm → XOR. */
function vnCoz(html) {
  try {
    const arrM = String(html).match(/var\s+[a-zA-Z0-9_$]+\s*=\s*[a-zA-Z0-9_$]+\s*\(\s*(\[[\s\S]*?\])\s*\);/);
    const keyM = String(html).match(/var\s+[a-zA-Z0-9_$]+\s*=\s*["']([a-zA-Z0-9_-]{10,})["'][\s\S]*?var\s+[a-zA-Z0-9_$]+\s*=\s*["']([a-zA-Z0-9_-]{2,10})["']/);
    if (!arrM || !keyM) return '';
    let arr = null;
    try { arr = JSON.parse(arrM[1]); } catch (_) {
      const ham = arrM[1].match(/"([^"]+)"|'([^']+)'/g);
      if (!ham) return '';
      arr = ham.map((x) => x.slice(1, -1));
    }
    const key1 = keyM[1]; const ops = keyM[2];
    let s = arr.join('');
    let h1 = 0; let h2 = 0;
    for (let i = 0; i < key1.length; i++) {
      const c = key1.charCodeAt(i);
      h1 = (h1 * 31 + c) % 251;
      h2 = ((h2 ^ (c + i))) & 255;
    }
    const seed0 = (h1 + h2) % 256;
    const step = (h1 % 13) + 3;
    let lcg = ((h1 * 256 + h2) % 65521) + 1;
    for (let i = ops.length - 1; i >= 0; i--) {
      const ch = ops.charAt(i);
      if (ch === 'b') s = b64Kaydir(s);
      else if (ch === 'v') s = ters(s);
      else s = rot(s, (26 - ((ch.charCodeAt(0) - 64) % 26)) % 26);
    }
    const idx = [];
    let l = lcg;
    for (let i = s.length - 1; i >= 1; i--) { l = (l * 75 + 74) % 65537; idx[i] = l % (i + 1); }
    const ch2 = s.split('');
    for (let i = 1; i < s.length; i++) { const j = idx[i]; const t = ch2[i]; ch2[i] = ch2[j]; ch2[j] = t; }
    s = ch2.join('');
    let kb = seed0; let out = '';
    for (let i = 0; i < s.length; i++) {
      const c = s.charCodeAt(i);
      kb = (kb + step) % 256;
      out += String.fromCharCode(c ^ kb);
      kb = (kb + c) % 256;
    }
    return sonUrl(out);
  } catch (_) { return ''; }
}

/** `pn` şeması: packer'lı sayfalarda rot13 + base64 + mod kaydırması. */
function pnCoz(html) {
  try {
    const modM = String(html).match(/charCode\s*-\s*\((\d+)\s*%\s*\(\s*i\s*\+\s*9\s*\)\)/);
    const arrM = String(html).match(/var\s+\w+\s*=\s*dc_\w+\s*\(\s*(\[[\s\S]*?\])\s*\);/);
    if (!modM || !arrM) return '';
    const mod = parseInt(modM[1], 10);
    let arr = null;
    try { arr = JSON.parse(arrM[1]); } catch (_) {
      const ham = arrM[1].match(/"([^"]+)"|'([^']+)'/g);
      if (!ham) return '';
      arr = ham.map((x) => x.slice(1, -1));
    }
    let s = ters(arr.join(''));
    s = b64Kaydir(rot(s, 13));
    let out = '';
    for (let i = 0; i < s.length; i++) out += String.fromCharCode((((s.charCodeAt(i) - (mod % (i + 9))) % 256) + 256) % 256);
    return sonUrl(out);
  } catch (_) { return ''; }
}

const yasakMi = (u) => ENGELLI_YAYIN.some((d) => String(u || '').includes(d));
const geçerli = (u) => (u && /^https?:\/\//i.test(u) && !yasakMi(u)) ? u : '';

/** Oynatıcı HTML'inden doğrudan yayın adresi + altyazıları çıkarır. */
function oynaticiCoz(html) {
  const t = String(html || '');
  let url = '';
  const dene = (u) => { if (!url) url = geçerli(u); };

  // 1) jwplayer `sources:[{file: VAR}]` — VAR dizi veya split-string taşır
  const src = t.match(/sources:\s*\[\{\s*file:\s*([a-zA-Z0-9_$]+)/i);
  if (src) {
    const v = src[1];
    const split = t.match(new RegExp(`var\\s+${v}\\s*=\\s*[a-zA-Z0-9_$]+\\s*\\(\\s*["']([\\s\\S]*?)["']\\s*\\.split\\(\\s*["']([^"']+)["']\\s*\\)\\s*\\);`));
    if (split) dene(yeCoz(split[1].replace(/\\\//g, '/').split(split[2])));
    if (!url) {
      const arrM = t.match(new RegExp(`var\\s+${v}\\s*=\\s*[a-zA-Z0-9_$]+\\s*\\(\\s*(\\[[\\s\\S]*?\\])\\s*\\);`));
      if (arrM) {
        try { dene(yeCoz(JSON.parse(arrM[1]))); } catch (_) { /* dizi çözülemedi */ }
        if (!url) dene(vnCoz(t));
      }
    }
  }
  // 2) genel split-string kalıbı
  if (!url) {
    for (const m of t.matchAll(/var\s+[a-zA-Z0-9_$]+\s*=\s*[a-zA-Z0-9_$]+\s*\(\s*["']([\s\S]*?)["']\.split\(\s*["']([^"']+)["']\s*\)\s*\);/g)) {
      if (m[1].length > 50 && m[2].length <= 3) { dene(yeCoz(m[1].replace(/\\\//g, '/').split(m[2]))); if (url) break; }
    }
  }
  // 3) packer → pn / düz m3u8; script blokları içinde vn
  if (!url && t.includes('function(p,a,c,k,e,d)')) {
    const pak = packerCoz(t);
    if (pak) {
      dene(pnCoz(pak));
      if (!url) { const m = pak.match(/https?:\/\/[^\s"'<>\0\u0080-\uFFFF]+\.m3u8[^\s"'<>\0\u0080-\uFFFF]*/i); if (m) dene(m3u8eCevir(m[0])); }
    }
  }
  if (!url) {
    for (const sm of t.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)) {
      const ic = sm[1].replace(/<!--[\s\S]*?-->/g, '');
      if (ic.includes('function(p,a,c,k,e,d)')) {
        const pak = packerCoz(ic);
        if (pak) dene(pnCoz(pak));
        if (url) break;
      }
      dene(vnCoz(ic));
      if (url) break;
    }
  }
  // 4) çıplak master.m3u8
  if (!url) { const m = t.match(/https?:\/\/[^\s"'<>]+\/master\.m3u8[^\s"'<>]*/i); if (m) dene(m3u8eCevir(m[0])); }
  return url;
}

/* ── akış ─────────────────────────────────────────────────────────────── */

const ELE = ['/filmler-', '/yabanci-dizi-', '/tur/', '/ulke/'];

function icerikBul(html, base, isFilm, adayBasliklar) {
  let ilkYedek = '';
  for (const a of anchorlar(html, base)) {
    const u = a.url;
    if (!/\/(film|dizi)\//i.test(u) || ELE.some((x) => u.includes(x))) continue;
    const dizi = /\/dizi\//i.test(u);
    const uygun = isFilm ? !dizi : dizi;
    const metinUyar = !a.metin || baslikEslesir(adayBasliklar[0] || '', [a.metin]) || adayBasliklar.some((b) => baslikEslesir(b, [a.metin]));
    if (uygun && metinUyar) return u;
    if (uygun && !ilkYedek) ilkYedek = u;
  }
  return ilkYedek;
}

function bolumBul(html, base, s, e) {
  for (const a of anchorlar(html, base)) {
    const dm = a.url.match(/sezon-(\d+)\/bolum-(\d+)/i);
    if (dm && +dm[1] === s && +dm[2] === e) return a.url;
    const sm = a.metin.match(/(\d+)\.\s*sezon/i);
    const em = a.metin.match(/(\d+)\.\s*b[oö]l[uü]m/i);
    if (sm && em && +sm[1] === s && +em[1] === e) return a.url;
  }
  return '';
}

function oynaticilar(html, base) {
  const out = []; const gorulen = new Set();
  const ekle = (u, ad) => {
    const x = mutlak(u, base);
    if (!x || /youtube|youtu\.be/i.test(x) || gorulen.has(x)) return;
    gorulen.add(x);
    out.push({ url: x, ad: ad || 'Varsayılan' });
  };
  for (const m of String(html).matchAll(/<iframe\b[^>]*?(?:data-src|src)=["']([^"']+)["']/gi)) ekle(m[1]);
  for (const m of String(html).matchAll(/<a\b[^>]*data-video_url=["']([^"']+)["'][^>]*>([\s\S]{0,160}?)<\/a>/gi)) {
    const ad = String(m[2] || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 24);
    ekle(m[1], ad || `Sunucu ${out.length + 1}`);
  }
  const puan = (p) => (/closeload/i.test(p.url) ? 4 : 0) + (/rapid/i.test(p.url) ? 3 : 0) + (/altyaz/i.test(p.ad) ? 1 : 0);
  return out.sort((a, b) => puan(b) - puan(a)).slice(0, 4);
}

/** Oynatıcı kümesini paralel doğrudan yayına çevirir. */
async function sunuculariCoz(oynaticilar, icerikUrl, trace, webView, signal = null) {
  const sonuc = await Promise.allSettled(oynaticilar.map(async (o) => {
    const ref = /rapidrame_id=|closeload|rapid/i.test(o.url) ? `${koken(icerikUrl)}/` : icerikUrl;
    const html = await istek(o.url, { ref, timeout: 9000, headers: { 'User-Agent': UA }, trace, webView, signal });
    if (!html) return null;
    const yayin = oynaticiCoz(html);
    if (!yayin || !(medyaMi(yayin) || /\.m3u8/i.test(yayin))) return null;
    const oynaticiKoken = koken(o.url) || koken(icerikUrl);
    return {
      yayin, oynaticiKoken, ad: o.ad,
      altyazilar: tracksAltyazilari(html, oynaticiKoken, PLAYER_UA),
    };
  }));
  return sonuc.filter((r) => r.status === 'fulfilled' && r.value).map((r) => r.value);
}

export async function coz({ type = 'movie', title = '', originalTitle = '', titles = [], imdbId = null, tmdbId = null, season = 1, episode = 1, signal = null } = {}) {
  const trace = izleyici();
  const bas = Date.now();
  const isFilm = type === 'movie';
  const s = +season || 1, e = +episode || 1;
  const adayBasliklar = [...new Set([title, originalTitle, ...titles].map(temizBaslik).filter(Boolean))];
  const base = await alanAdiCoz('filmmakinesi', BILINEN, { trace, ua: UA });
  if (!base) return { sources: [], trace: trace.ozet() };

  // — IMDb'yi çöz (site araması IMDb anahtarıyla en isabetli)
  let imdb = imdbId ? String(imdbId) : '';
  if (!imdb && tmdbId) imdb = (await tmdbMeta(tmdbId, isFilm ? 'movie' : 'tv', { trace }))?.imdb || '';
  if (imdb && !/^tt/i.test(imdb)) imdb = `tt${imdb}`;

  // — 1. arama (hızlı yol: webView:false)
  const sorgular = [...new Set([imdb, ...adayBasliklar].filter(Boolean))];
  let icerikUrl = '';
  let kopuk = 0; // üs-üstte taşma = CF/ulaşılamıyor: boşuna tur atma (≤8sn)
  for (const q of sorgular) {
    const ham = await istek(`${base}/arama/?s=${encodeURIComponent(q)}`, { ref: `${base}/`, timeout: 9000, headers: { 'User-Agent': UA }, trace, webView: false, signal });
    if (!ham) { if (++kopuk >= 2) break; continue; }
    kopuk = 0;
    icerikUrl = icerikBul(ham, base, isFilm, adayBasliklar);
    trace.koy('arama', { q: String(q).slice(0, 24), bulundu: Boolean(icerikUrl) });
    if (icerikUrl) break;
  }
  // — arama tutmazsa slug yolu (yalnızca host gerçekten ulaşılsaydı)
  if (!icerikUrl && !kopuk) {
    const slug = slugla(adayBasliklar[0] || '');
    if (slug) {
      const yol = isFilm ? `/${slug}/` : `/dizi/${slug}/sezon-${s}/bolum-${e}/`;
      const ham = await istek(`${base}${yol}`, { ref: `${base}/`, timeout: 8000, headers: { 'User-Agent': UA }, trace, webView: false, signal });
      if (ham && /<iframe|data-video_url/i.test(ham)) icerikUrl = `${base}${yol}`;
    }
    trace.koy('slug-yolu', { bulundu: Boolean(icerikUrl) });
  }
  if (!icerikUrl) { trace.koy('sonuc', { n: 0, neden: 'icerik-yok' }); return { sources: [], trace: trace.ozet() }; }

  // — 2. dizi: bölüm bağlantısı (içerik sayfası: cihazda tek pahalı WebView
  //    isteği burada olabilir — CF ana sayfada değil TÜM sitede; çerez bir kez
  //    çözülür, sonrası hızlı akar)
  let icerik = '';
  if (!isFilm && !icerikUrl.includes(`/sezon-${s}/bolum-${e}/`)) {
    icerik = await istek(icerikUrl, { ref: `${base}/`, timeout: 12000, headers: { 'User-Agent': UA }, trace, signal });
    const bm = bolumBul(icerik, base, s, e);
    if (bm) icerikUrl = bm;
    else icerikUrl = `${icerikUrl.replace(/\/$/, '')}/sezon-${s}/bolum-${e}/`;
    trace.koy('bolum', { bulundu: Boolean(bm) });
  }

  // — 3. oynatıcılar ve yayınlar (hızlı tur)
  const sayfa = icerik && /<iframe|data-video_url/i.test(icerik) ? icerik
    : await istek(icerikUrl, { ref: `${base}/`, timeout: 12000, headers: { 'User-Agent': UA }, trace, signal });
  if (!sayfa) { trace.koy('sonuc', { n: 0, neden: 'cf-veya-sayfa-yok', gecen: Date.now() - bas }); return { sources: [], trace: trace.ozet() }; }
  let oynaticiList = oynaticilar(sayfa, base);
  trace.koy('oynatici', oynaticiList.map((o) => o.ad));
  let bulgular = await sunuculariCoz(oynaticiList, icerikUrl, trace, false, signal);

  // — 4. ikinci tur: hiçbir şey çıkmadıysa ve bütçe varsa pahalı yol
  if (!bulgular.length && oynaticiList.length && Date.now() - bas < 45000) {
    trace.koy('webview-turu', { deneme: oynaticiList.length });
    bulgular = await sunuculariCoz(oynaticiList, icerikUrl, trace, true, signal);
  }

  // — 5. kaynak listesi
  const liste = []; const gorulen = new Set();
  for (const b of bulgular) {
    const u = m3u8eCevir(b.yayin);
    if (!u || gorulen.has(u)) continue;
    gorulen.add(u);
    const etiket = slugla(b.ad) || 'sunucu';
    const taban = `${tmdbId || imdb || slugla(adayBasliklar[0] || 'x')}_${isFilm ? 'm' : `s${s}e${e}`}_${etiket}`;
    const dublaj = /dual|trdual|trdub|dublaj/i.test(u) || /dublaj|dual/i.test(b.ad);
    liste.push(kaynak({
      id: `fm_${dublaj ? 'dub' : 'sub'}_${taban}`,
      ad: `Arcturus ${b.ad} ${dublaj ? 'Dublaj' : 'Altyazı'} (1080p)`,
      url: u,
      kategori: dublaj ? 'dubbed' : 'subtitled',
      headers: { Referer: `${b.oynaticiKoken}/`, 'User-Agent': PLAYER_UA, Accept: '*/*' },
      altyazilar: b.altyazilar || [],
      kalite: '1080p',
    }));
  }
  trace.koy('sonuc', { tip: liste.length ? 'dogrudan' : 'yok', n: liste.length, ms: Date.now() - bas });
  return { sources: liste, trace: trace.ozet() };
}

/** Sağlayıcı arayüzü (providerRuntime uyumu). */
export default {
  apiVersion: 1,
  id: kimlik.id,
  name: kimlik.alias,
  mediaTypes: kimlik.mediaTypes,
  async resolve(args) {
    const { sources } = await coz(args);
    return sources;
  },
};
