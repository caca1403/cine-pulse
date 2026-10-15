/* ==========================================================================
   ORION — HDFilmCehennemi  (sıfırdan, Nuvio/Patron akışı)

   Adımlar (Patron `patronhdfcehennemi` ile birebir):
     1. Alan adı: siteurl.txt (hdfilmcehennemi) → bilinen adresler
     2. Arama:  /search?q={imdb|başlık}  + `X-Requested-With: fetch` → JSON
     3. Dizi:   sezon-N/bolum-M bağlantısı
     4. Oynatıcı: <iframe data-src|src>  ya da
                  button.alternative-link[data-video] → /video/{id}/ (JSON)
     5. Şifre çözümü: packer / dn / gn / Be  → doğrudan m3u8
     6. rapidrame: /rplayer/{id}/ yedek katmanı
     7. Referer = OYNATICI origin'i (sitenin kökü DEĞİL), UA = okhttp/4.9.2
   ========================================================================== */

import {
  istek, izleyici, anchorlar, duzMetin, mutlak, koken, m3u8eCevir,
  kaynak, temizBaslik, tracksAltyazilari, ilkGrup, medyaMi, slugla,
} from './kit.js';
import { be } from '../services/hdfcDecoders.js';

const BILINEN = ['https://www.hdfilmcehennemi.nl', 'https://hdfilmcehennemi.com']; // .now self-signed (ölçüldü) — çıkarıldı
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
const PLAYER_UA = 'okhttp/4.9.2';

/* İkinci (CloseLoad) sunucusunun çözümü gizli tarayıcıyı 10-25 sn meşgul
   ediyor; tek motor olduğu için hızlı turda bulunan Rapid yayını listelenmiş
   olsa bile tarama tavanı doluyor ve Orion HİÇ görünmüyordu. Bu yüzden pahalı
   tur varsayılan KAPALI: tek sunucu her zaman ve hızlı görünür. */
const PAHALI_TUR = false;
async function tarayiciMotoruBos() {
  try {
    const m = await import('../services/platform/androidWebViewResolver.js');
    return typeof m.resolverMesgulMu === 'function' ? !m.resolverMesgulMu() : true;
  } catch (_) { return true; }
}

/* Masaüstü (Electron) gizli BrowserWindow — Android'deki gizli WebView'ın
   KARDEŞİ. Android dallarına DOKUNULMAZ (PAHALI_TUR orada KAPALI kalır;
   ölçüldü: tek Android motorunu kilitleyip çalışanı götürüyor). Masaüstünde
   ise node/curl yolu CF challenge'a 403 yer ve gizli-pencere fallback'i
   kapalıydı → hızlı tur 0 kaynak döndüğünde Orion hiç yayın veremiyordu.
   Kural: tek deneme, ≤10 sn, signal bağlı; motor MEŞGULSE denemeden 0 dön
   (çalışanı bekletmeme). */
async function masaustuMotoruBos() {
  try {
    const p = await import('../services/platform/desktopPlatform.js');
    if (p.desktopPlatform?.() !== 'desktop') return { desktop: false, bos: false };
    const m = await import('../services/platform/desktopWebViewResolver.js');
    if (typeof m.hasNativeWebViewResolver !== 'function' || !m.hasNativeWebViewResolver()) return { desktop: true, bos: false };
    return { desktop: true, bos: typeof m.resolverMesgulMu === 'function' ? !m.resolverMesgulMu() : true };
  } catch (_) { return { desktop: false, bos: false }; }
}
const SITEURL = 'https://raw.githubusercontent.com/patr0nq/veriler/refs/heads/main/siteurl.txt';

export const kimlik = { id: 'hdfc', alias: 'Orion', mediaTypes: ['movie', 'tv'] };

async function alanAdlari(trace, signal = null) {
  const liste = [...BILINEN];
  const txt = await istek(SITEURL, { ref: 'https://raw.githubusercontent.com/', timeout: 8000, trace, signal });
  const satir = String(txt || '').split('\n').map((l) => l.trim()).find((l) => l.startsWith('hdfilmcehennemi:'));
  if (satir) {
    const u = satir.slice('hdfilmcehennemi:'.length).trim().replace(/\/$/, '');
    if (/^https:\/\//i.test(u)) liste.unshift(u);
  }
  trace?.koy('alan-adi', { secili: liste[0], alternatif: liste.length });
  return [...new Set(liste)];
}

function aramaSonuclari(ham) {
  const t = String(ham || '').trim();
  if (!t) return [];
  try {
    const d = JSON.parse(t);
    const liste = Array.isArray(d?.results) ? d.results : (Array.isArray(d) ? d : []);
    return liste.map((x) => (typeof x === 'string' ? x : (x || {}))).filter(Boolean);
  } catch (_) {}
  // Preserve result titles in HTML responses too; reducing them to hrefs
  // loses translated-title matches when the site slug differs from TMDB.
  return [t];
}

/** Arama yanıtından İÇERİK bağlantılarını {url, baslik} olarak topla.
 *  Sonuçlar üç biçimde gelebilir: HTML parçası (Kekik/Patron: <a …><h4 class
 *  ="title">BAŞLIK</h4></a>), düz URL ya da {url,link,title} nesnesi. */
function icerikBaglantilari(sonuclar) {
  const at = /\/assets\/|\.css(\?|$)|\.js(\?|$)|\.png|\.jpe?g|\.svg|\.webp|\.ico|\.woff/i;
  const gorulen = new Set();
  const out = [];
  const ekle = (u, baslik = '', year = null) => {
    const s = String(u || '').trim();
    if (!s || at.test(s) || gorulen.has(s)) return;
    gorulen.add(s);
    out.push({ url: s, baslik: String(baslik || '').trim(), year: Number(year) || null });
  };
  const hrefleriAl = (metin) => {
    // <a …href=…>…</a>: bağlantıyı İÇİNDEKİ başlıkla birlikte taşı —
    // başlıksız URL listesi yanlış içeriğe düşmenin ana yoluydu.
    for (const m of String(metin).matchAll(/<a\b[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi)) {
      // Real result cards contain an inline SVG before h4.title (~1KB).
      // A 700-character cap silently discarded the title and kept only href.
      const baslik = m[2].match(/<h[1-6]\b[^>]*class=["'][^"']*\btitle\b[^"']*["'][^>]*>([\s\S]*?)<\/h[1-6]>/i)?.[1];
      const alt = m[2].match(/<img\b[^>]*alt=["']([^"']+)["']/i)?.[1];
      const year = m[2].match(/<span\b[^>]*class=["'][^"']*\byear\b[^"']*["'][^>]*>\s*(\d{4})/i)?.[1];
      ekle(m[1], duzMetin(baslik || alt || m[2]), year);
    }
    for (const m of String(metin).matchAll(/href=["']([^"']+)["']/gi)) ekle(m[1]);
  };
  for (const x of sonuclar) {
    if (typeof x === 'string') {
      if (/^https?:\/\//i.test(x) || x.startsWith('/')) ekle(x);
      hrefleriAl(x);
    } else if (x && typeof x === 'object') {
      const bt = x.title || x.name || x.label || '';
      for (const k of ['url', 'link', 'href', 'slug', 'permalink', 'path', 'watch_url']) if (x[k]) ekle(x[k], bt, x.year);
      if (x.html) hrefleriAl(x.html);
    }
  }
  return out;
}

const _normal = (s) => String(s || '').toLowerCase()
  .replace(/&(?:ouml|uuml|ccedil|scedil|gbreve|inodot|amp);/g, (entity) => ({ '&ouml;': 'ö', '&uuml;': 'ü', '&ccedil;': 'ç', '&scedil;': 'ş', '&gbreve;': 'ğ', '&inodot;': 'ı', '&amp;': '&' }[entity]))
  .replace(/&#(?:x([0-9a-f]+)|(\d+));/g, (_, hex, dec) => String.fromCodePoint(Math.min(0x10ffff, parseInt(hex || dec, hex ? 16 : 10))))
  .replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g')
  .replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c')
  .replace(/[^a-z0-9]+/g, ' ').trim();

/** Aranan içerikle GERÇEKTEN ilgili bağlantıyı seç.
 *  Bu sitenin araması sorguyu yok sayıp aynı genel listeyi dönebiliyor
 *  (ölçüldü: 3 farklı sorgu aynı 26 sonucu verdi) — bu yüzden EŞLEŞME
 *  ARANIR: slug URL'de geçmeli VEYA sonuç başlığı istenen başlık varyantlarından
 *  birini taşımalı. Eşleşme yoksa RASTGELE bağlantı ASLA dönülmez (yanlış
 *  içerik oynatma riski); çağıran deterministik slug yoluna düşer. */
function secIcerik(sonuclar, isFilm, sluglar = [], basliklar = [], year = null) {
  const adaylar = icerikBaglantilari(sonuclar);
  const hedefler = basliklar.map(_normal).filter((h) => h.length > 2);
  const puan = (a) => {
    const u = String(a.url).toLowerCase();
    let p = 0;
    if (sluglar.some((sl) => sl && u.includes(sl))) p += 3;
    const bt = _normal(a.baslik);
    const adlar = String(a.baslik).split(/\s+[-–—]\s+/).map(_normal);
    if (hedefler.some((h) => adlar.includes(h))) p += 6;
    else if (bt && hedefler.some((h) => h === bt || h.includes(bt) || bt.includes(h))) p += 2;
    return p;
  };
  const tipOi = (a) => (isFilm ? /\/film\//i.test(a.url) ? 1 : 0 : /\/dizi\//i.test(a.url) && !/\/bolum\//i.test(a.url) ? 1 : 0);
  const enIyi = (liste) => {
    const skor = liste.map((a) => ({ a, s: puan(a) + tipOi(a) })).filter((x) => puan(x.a) > 0);
    if (!skor.length) return '';
    skor.sort((x, y) => y.s - x.s);
    return skor[0].a.url;
  };
  // Film slugs also contain -hd-izle-hdf-4, -hdf-hdf-7, leading numbers,
  // or no "izle" suffix. A narrow URL pool dropped real films whenever
  // the same search also returned a /dizi/ result.
  // Some legacy anime series live at the SITE ROOT (bleach-izle-7), not
  // under /dizi/. Movies use the same root pattern, so a root card only
  // counts for TV when its title matches EXACTLY and carries no movie
  // marker — this keeps "World Heroes' Mission"/"Reze Arc" films out.
  const tamAd = (a) => {
    const adlar = String(a.baslik).split(/\s+[-–—]\s+/).map(_normal);
    return hedefler.some((h) => adlar.includes(h));
  };
  // NOTE: the marker check must look at the PATH ONLY — the site's own
  // domain ("hdfilmcehennemi…") contains the literal word "film", which
  // would otherwise disqualify every root card.
  const uygunKok = (a) => {
    const yol = String(a.url).replace(/^https?:\/\/[^/]+/i, '');
    return !/film|movie/i.test(yol) && !/film|movie/i.test(a.baslik) && tamAd(a);
  };
  const havuz = adaylar.filter((a) => !/\/search(?:\/|\?|$)/i.test(a.url)
    && (isFilm ? !/\/dizi\/|\/bolum\//i.test(a.url)
      : /\/dizi\/|\/bolum\//i.test(a.url) || uygunKok(a)));
  // Year is a tie-breaker, not a hard gate: the site lists an anime under
  // its season/reboot year (Bleach 2018, Tokyo Ghoul 2017), so dropping
  // every year-mismatched card erased real matches. Only choose among the
  // year-matching cards when at least one exists (Cowboy Bebop 1998 vs 2021).
  const yasi = year ? havuz.filter((a) => !a.year || Number(year) === a.year) : [];
  return enIyi(yasi.length ? yasi : havuz);
}

function bolumBaglantisi(html, sezon, bolum) {
  for (const a of anchorlar(html)) {
    const dm = a.url.match(/sezon-(\d+)\/bolum-(\d+)/i);
    if (dm && +dm[1] === sezon && +dm[2] === bolum) return a.url;
    const sm = a.metin.match(/(\d+)\.\s*sezon/i);
    const em = a.metin.match(/(\d+)\.\s*b[oö]l[uü]m/i);
    if (sm && em && +sm[1] === sezon && +em[1] === bolum) return a.url;
  }
  return '';
}

/** Sayfadaki TÜM oynatıcıları toplar: gömülü iframe'ler + alternative-link
 *  butonları (CloseLoad / Rapidrame / Vidmo…). Her buton ayrı bir sunucudur;
 *  Nuvio yalnızca birini seçiyor, biz hepsini ayrı kaynak olarak listeliyoruz. */
function oynaticiAdaylari(html, taban) {
  const adaylar = [];
  const gorulen = new Set();
  const ekle = (a) => {
    const key = a.iframeUrl || `id:${a.videoId}`;
    if (!a || gorulen.has(key)) return;
    gorulen.add(key);
    adaylar.push(a);
  };

  // gömülü iframe'ler (varsayılan oynatıcı)
  for (const t of String(html).matchAll(/<iframe\b[^>]*?(?:data-src|src)=["']([^"']+)["'][^>]*>/gi)) {
    const u = mutlak(t[1], taban);
    if (/embed|player|rplayer|rapidrame|closeload|play/i.test(u)) ekle({ iframeUrl: u, ad: oynaticiAdi(u) });
  }

  // alternatif oynatıcı butonları: data-video + etiket
  for (const m of String(html).matchAll(/<button[^>]*data-video=["']?([\w-]+)["']?[^>]*>([\s\S]{0,200}?)<\/button>/gi)) {
    const etiket = duzMetin(m[2] || '').slice(0, 24) || '';
    ekle({ videoId: m[1], ad: etiket.trim() || `Sunucu ${adaylar.length + 1}` });
  }
  return adaylar;
}

/** Oynatıcı adresinden kısa sunucu adı (kapalı kaynak adları anonim kalır). */
function oynaticiAdi(url) {
  const u = String(url).toLowerCase();
  if (/rapidrame|\/rplayer\//.test(u)) return 'Rapid';
  if (/closeload|cloplayer/.test(u)) return 'Close';
  if (/vidmo/.test(u)) return 'Vidmo';
  if (/ok\.ru/.test(u)) return 'Okru';
  if (/drawlab|playerx/.test(u)) return 'Draw';
  return 'Varsayılan';
}

/** Bir adayı iframe URL'sine çevir (butonlar /video/{id}/ JSON'undan gelir). */
async function adayIframe(ada, ctx, trace, webView = false, signal = null) {
  if (ada.iframeUrl) return ada.iframeUrl;
  // webView:false — challenge ana sayfada bir kez çözülür; bu JSON ucu aynı
  // çerezi kullanır. Gizli WebView'ı burada denemek Orion'u dakikalara çıkarıyordu.
  // İkinci (pahalı) turda arayan taraf webView:true verir.
  const govde = await istek(`${ctx.base}/video/${ada.videoId}/`, {
    ref: ctx.contentUrl, trace, timeout: webView ? 20000 : 9000, webView, signal,
    headers: { 'User-Agent': UA, 'X-Requested-With': 'fetch', Accept: 'application/json, text/plain, */*' },
  });
  let html = '';
  try { html = JSON.parse(govde)?.data?.html || ''; } catch (_) {
    // Gizli WebView bir JSON adresini açtığında tarayıcı yanıtı
    // <body><pre>{...}</pre></body> olarak sarar. Etiketleri soyup JSON'u
    // tekrar deniyoruz; olmazsa metin içinde iframe aranır.
    const saf = duzMetin(govde).trim();
    try { html = JSON.parse(saf)?.data?.html || saf; } catch (_) { html = saf; }
  }
  const u = (html.match(/<iframe\b[^>]*?(?:data-src|src)=["']([^"']+)["']/i) || [])[1];
  return u ? mutlak(u, ctx.base) : '';
}

/** Ağ kilidi KANITI: iz'de TV-yolu isteğinin 403'ü (CF challenge sayfası engelSayfaMi'de
 *  süzüldüğü için gövde görünmez — tek kalıcı işaret sonHttpDurumu). Kanıtsız boşluk
 *  "içerik yok" olabilir; pahalı motora YALNIZ kilit işaretinde gidilir (madde 0/b). */
function tvYolu403(trace) {
  return (trace?.kayit || []).some((k) => k.ad === 'http' && k.st === 403 && /\/dizi\/|\/bolum\/|\/sezon-\d+\/bolum-|\/video\//i.test(String(k.url || '')));
}

/** Onaylı yedek kapısı (YAPILACAKLAR #0 seçeneği b): gizli motor turu YALNIZ
 *  (1) TV yolunda, (2) hızlı tur hiç yayın bulamadıysa, (3) izde 403 kilidi
 *  KANITLIYSA ve (4) motor boşsa açılır. Film yolu koşulu geçemez (film hızlı
 *  turda 1-2 sn'de yayın buluyor — ölçüldü). SAF fonksiyon: testte doğrulanır. */
export function pahaliTuraIzin({ isFilm = false, yayinYok = false, kanit = false, motorBos = false } = {}) {
  return !isFilm && yayinYok && kanit && motorBos;
}

/** Sayfadaki oynatıcı ADAYLARINI listeler (buton iframe'leri henüz çözülmez).
 *  `webView:true` yalnız gizli motor yedek turunda verilir: TV sayfaları CF
 *  challenge'a 403 veriyor (ölçüldü 2026-10-15: aynı IP+UA'da /dizi/* → 403
 *  challenge, film sayfaları → 200; header/UA varyasyonu sonucu değiştirmiyor). */
async function oynaticiAdaylariBul(ctx, trace, signal = null, webView = false) {
  const sayfa = ctx.html || await istek(ctx.contentUrl, { ref: `${ctx.base}/`, headers: { 'User-Agent': UA }, trace, timeout: 16000, signal, webView });
  if (!sayfa) return [];
  const adaylar = oynaticiAdaylari(sayfa, ctx.base).slice(0, 3);
  trace.koy('oynatici-adaylari', adaylar.map((a) => a.ad || a.videoId));
  return adaylar;
}

/** Adayların iframe adreslerini çözer. `webView:true` pahalı tarayıcı yolunu
 *  açar (10-20 sn) ve yalnızca ikinci turda verilir. */
async function iframeleriCoz(adaylar, ctx, trace, webView, signal = null) {
  const sonuc = await Promise.allSettled(adaylar.map((a) => adayIframe(a, ctx, trace, webView, signal)));
  return adaylar
    .map((a, i) => (sonuc[i].status === 'fulfilled' && sonuc[i].value ? { ...a, iframeUrl: sonuc[i].value } : null))
    .filter(Boolean);
}

/** Bir oynatıcı kümesini doğrudan m3u8'e çevirir. */
function sunuculariCoz(oynaticilar, contentUrl, base, trace, webView, signal = null) {
  return Promise.allSettled(oynaticilar.map((o) =>
    akisCoz(o.iframeUrl, contentUrl, base, trace, webView, signal).then((r) => ({ ...r, ad: o.ad }))));
}

async function akisCoz(iframeUrl, contentUrl, base, trace, webView = false, signal = null) {
  let html = await istek(iframeUrl, { ref: contentUrl, headers: { 'User-Agent': UA }, trace, timeout: 10000, webView, signal });
  let m3u8 = be(html || '');
  let kaynakHtml = html || '';
  const rapid = (iframeUrl.match(/rapidrame_id=([a-zA-Z0-9]+)/) || iframeUrl.match(/\/rplayer\/([a-zA-Z0-9]+)/) || [])[1];
  if (rapid && (!m3u8 || !kaynakHtml.includes('tracks:'))) {
    const rp = await istek(`${base}/rplayer/${rapid}/`, { ref: `${base}/`, headers: { 'User-Agent': UA }, trace, timeout: 9000, webView, signal });
    if (rp) { kaynakHtml = rp; if (!m3u8) m3u8 = be(rp); }
  }
  trace?.koy('akis', { m3u8: m3u8 ? 'bulundu' : 'yok', rapid: Boolean(rapid), oynatici: koken(iframeUrl) || '' });
  return { m3u8: m3u8 ? m3u8eCevir(m3u8) : '', kaynakHtml, iframeUrl };
}

/**
 * Nuvio/CloudStream `load()` eşdeğeri.
 * @returns {Promise<{sources:Array, trace:Array, iframe?:string}>}
 */
export async function coz({ type = 'movie', title = '', originalTitle = '', titles = [], imdbId = null, tmdbId = null, year = null, season = 1, episode = 1, onSources = null, signal = null } = {}) {
  const trace = izleyici();
  const isFilm = type === 'movie';
  const s = +season || 1, e = +episode || 1;
  const baslik = temizBaslik(title || originalTitle);
  const alternatifBasliklar = [title, originalTitle, ...titles].map(temizBaslik).filter(Boolean);
  const slug = slugla(baslik);
  const slugYedekleri = [...new Set(alternatifBasliklar.map(slugla).filter(Boolean))];
  const bazlar = await alanAdlari(trace, signal);
  const base = bazlar[0];

  // — 1. arama (IMDB → başlık) — içerik URL'si
  let contentUrl = '';
  let contentHtml = '';
  // Keep the successful episode shortcut, but this is only a GUESS: real
  // slugs have arbitrary numbered suffixes and translated names. Never spend
  // the hidden-browser budget on an unconfirmed address before search.
  if (!isFilm && baslik) {
    const path = `/dizi/${slugla(baslik)}-izle-3/sezon-${s}/bolum-${e}/`;
    const html = await istek(`${base}${path}`, { ref: `${base}/`, headers: { 'User-Agent': UA }, trace, timeout: 2500, webView: false, signal });
    if (html && /data-video|alternative-link|<iframe/i.test(html) && html.toLowerCase().includes(slugla(baslik))) {
      contentUrl = `${base}${path}`;
      contentHtml = html;
    }
  }
  // — 1. arama — içerik URL'si.
  // ALTIN REFERANS (Kekik HDFilmCehennemi.py): `GET /search/?q=` (SONDAKİ
  // TİRNAKLI / ŞART) + `X-Requested-With: fetch` → JSON {query, results[]},
  // her öğe <a href=…><h4 class="title">…</h4>. KANIT (curl, 2026-10-13):
  //   /search/?q=interstellar → "1-yildizlar-arasinda-film-izle-hdf-7" (TR adı!)
  //   /search/?q=kurulus → 0 sonuç   |   /search/?q=ivedik → 7 sonuç
  // yani sorguya GÖRE farklı sonuç veriyor. Eski yolumuz `/search?q=` (slash
  // YOK) CF kurallarına takılıp sorguyu YOK SAYIYOR (ölçüldü: 3 sorgu aynı 26
  // genel sonuç). IMDB ile arama sitede YOK (tt0903744 → 0 sonuç) — başlıklar
  // TR+ORJ denenir; bulunamazsa tek kelimeye yumuşatılır.
  const sluglar = [...new Set([baslik, ...alternatifBasliklar].map(slugla).filter(Boolean))];
  const tamAramalar = [...new Set([temizBaslik(originalTitle), baslik, ...alternatifBasliklar].filter(Boolean))];
  const gevsekAramalar = [...new Set(tamAramalar.map((q) => q.split(/\s+/).slice(0, 1).join(' ')).filter((q) => q.length > 3 && !tamAramalar.includes(q)))];
  const aramalar = [...tamAramalar, ...gevsekAramalar].slice(0, 3); // tavan 3 (rapor #4)
  const aramaBasliklari = [title, originalTitle, ...titles].map(temizBaslik).filter(Boolean);
  const yanitIzi = new Set();
  let aramaYolu = '/search/?q=';
  for (const q of aramalar.filter(Boolean)) {
    if (contentUrl) break;
    const ara = async (yol) => istek(`${base}${yol}${encodeURIComponent(q)}`, {
      ref: `${base}/`, trace, signal, timeout: 8000, webView: false,
      headers: { 'User-Agent': UA, 'X-Requested-With': 'fetch', Accept: 'application/json, text/plain, */*' },
    });
    let ham = await ara(aramaYolu);
    let sonuc = aramaSonuclari(ham);
    // Yedek uç yalnız İLK UÇ HTTP'HATASI verdiyse denenir (rapor #4): 200+boş
    // JSON "yok" demektir, ikinci uca gitmek 8 sn boşuna bekleme olurdu.
    if (!sonuc.length && !ham && aramaYolu === '/search/?q=') {
      ham = await ara('/search?q='); sonuc = aramaSonuclari(ham);
      if (sonuc.length) aramaYolu = '/search?q=';
    }
    const iz = `${(ham || '').length}:${String(ham || '').slice(0, 160)}`;
    // Aynı yanıt tekrar geliyorsa sorgu YOK SAYILIYOR: zinciri uzatmanın
    // anlamı yok — eşleşme de bulunamadıysa deterministik slug yoluna düşülür.
    if (ham && yanitIzi.has(iz)) { trace.koy('arama-tekrar', { q }); break; }
    if (ham) yanitIzi.add(iz);
    trace.koy('arama', { q, sonuc: sonuc.length, yol: aramaYolu });
    const bulunan = sonuc.length ? secIcerik(sonuc, isFilm, sluglar, aramaBasliklari, year) : '';
    if (bulunan) contentUrl = mutlak(bulunan, base);
    else if (sonuc.length) {
      // Cihaz hata ayıklama: arama sonuç getirdiyse ama hiçbiri eşleşmediyse
      // GELEN kartları iz'e yaz — sitenin mobil oturuma farklı (az/adsız)
      // kart döndürdüğü ölçüldü; eşleşme hatası ile veri farkı ayrışsın.
      trace.koy('eslesmedi', { q, kartlar: icerikBaglantilari(sonuc).slice(0, 4).map((a) => ({ b: a.baslik, y: a.year || 0, u: String(a.url).slice(-46) })) });
    }
  }

  // — 2. slug yolları (arama engelliyse) — sitedeki kalıp: TR/ORJ başlığın
  // slug'ı + `-izle[-N]` soneki; dizide `/dizi/{slug}-izle-N/sezon-S/bolum-E/`.
  if (!contentUrl) {
    const yollar = isFilm
      ? [`/${slug}-izle/`, `/hd-${slug}-izle/`, `/${slug}/`]
      : ['/izle-3', '/izle-2', '/izle'].map((suf) => `/dizi/${slug}${suf}/sezon-${s}/bolum-${e}/`);
    // TR/ORJ varyantları: site içeriği başka dildeki slug'la listeliyor olabilir.
    for (const alt of slugYedekleri.filter((x) => x && x !== slug).slice(0, 2)) {
      if (isFilm) yollar.push(`/${alt}-izle/`, `/hd-${alt}-izle/`, `/${alt}/`);
      else {
        // ORJ slug'lı series'ler (ölçüldü: Kalk Gidelim 200 dönerken ORJ
        // varyantı denememiştik): site ikili kalıp kullanıyor — tireli ESKİ
        // kalıp + slash'lı YENİ kalıp. İkisi de denensin; deneme tavanı (8)
        // bütçeyi yine sınırlıyor.
        yollar.push(`/dizi/${alt}-izle-3/sezon-${s}/bolum-${e}/`, `/dizi/${alt}/izle-3/sezon-${s}/bolum-${e}/`, `/dizi/${alt}/izle/sezon-${s}/bolum-${e}/`);
      }
    }
    let deneme = 0;
    for (const b of bazlar) {
      for (const y of yollar) {
        if (deneme++ >= 10) break; // bütçe: ~10 hızlı deneme (TR 3 + ORJ-1 3 + ORJ-2 3 + yedek taban)
        const html = await istek(`${b}${y}`, { ref: `${b}/`, headers: { 'User-Agent': UA }, trace, signal, webView: false });
        if (html && /data-video|alternative-link|<iframe/i.test(html)) { contentUrl = `${b}${y}`; contentHtml = html; break; }
      }
      if (contentUrl || deneme >= 10) break;
    }
    trace.koy('slug-yolu', { contentUrl });
  }
  if (!contentUrl) return { sources: [], trace: trace.ozet(), iframe: '' };

  const pageBase = koken(contentUrl) || base;

  // — 3. dizi: bölüm bağlantısı. SHOW sayfası cihazda da boş dönebiliyor
  // (CF önbeksiz yol; ölçüldü: breaking-bad-izle-8 uz:0) ama BÖLÜM sayfası
  // açılıyor (stranger-things uz:188K). Bölüm adresi gösterim sayfasından
  // türetilir: {dizi}/sezon-S/bolum-E/ — önce onu doğrudan dene.
  if (!isFilm && !contentUrl.includes(`/sezon-${s}/bolum-${e}/`)) {
    const ep = mutlak(`${String(contentUrl).replace(/\/+$/, '')}/sezon-${s}/bolum-${e}/`, base);
    const epHtml = await istek(ep, { ref: `${pageBase}/`, headers: { 'User-Agent': UA }, trace, signal, webView: false });
    if (epHtml && /data-video|alternative-link|<iframe/i.test(epHtml)) {
      contentUrl = ep; contentHtml = epHtml;
      trace.koy('bolum', { bulundu: true, yol: 'deterministik', contentUrl });
    } else {
      const showHtml = contentHtml || await istek(contentUrl, { ref: `${pageBase}/`, headers: { 'User-Agent': UA }, trace, signal, webView: false });
      const bm = bolumBaglantisi(showHtml, s, e);
      if (bm) contentUrl = mutlak(bm, pageBase);
      trace.koy('bolum', { bulundu: Boolean(bm), yol: 'gosterim', contentUrl });
    }
  }

  // — 2.5 kimlik kapısı ("2000 ise 2000"): TMDB/IMDb verisi elimizdeyse
  // sayfadaki PROVIDER'IN KENDİ tt kodu/yılı ile birebir karşılaştırılır.
  // Aynı tt = aynı yapıt (tarih farkı önemsiz); farklı tt = BAŞKA yapıt →
  // tek yayın bile listelenmez. Sayfa kimlik taşımıorsa doğrulanamaz ve
  // mevcut davranışa dönülür (yanlış reddetme yerine tarafsızlık).
  if (imdbId || year) {
    const ids = new Set();
    let yil = null;
    const oku = (h) => {
      if (!h) return;
      for (const m of h.matchAll(/imdb\.com\\?\/title\\?\/(tt\d{6,8})/gi)) ids.add(m[1].toLowerCase());
      if (!yil) yil = +((h.match(/class=["'][^"']*\byear\b[^"']*["'][^>]*>\s*(\d{4})/) || [])[1]
        || (h.match(/<title>[\s\S]{0,160}?\b(19\d{2}|20\d{2})\b/) || [])[1] || 0) || null;
    };
    oku(contentHtml);
    if (!ids.size) {
      // Bölüm sayfası kimlik taşımayabilir; gösterim sayfası taşır (ölçüldü:
      // bleach-izle-7 → imdb.com/title/tt5979872, HTTP 200).
      const gosterim = contentUrl.replace(/\/sezon-\d+\/bolum-\d+\/?$/i, '/');
      const gHtml = await istek(gosterim, { ref: `${pageBase}/`, headers: { 'User-Agent': UA }, trace, signal, timeout: 9000, webView: false });
      oku(gHtml);
      if (isFilm && gHtml && gosterim === contentUrl) contentHtml = gHtml; // film: oynatıcı da bu sayfada — yeniden indirme
    }
    const hedefImdb = (String(imdbId || '').match(/tt\d{6,8}/i) || [])[0];
    const karsilastirilabilir = Boolean(hedefImdb && ids.size);
    const imdbUydu = !karsilastirilabilir || ids.has(hedefImdb.toLowerCase());
    const yilUydu = karsilastirilabilir && imdbUydu ? true : !(year && yil) || Number(year) === yil;
    trace.koy('kimlik', { hedef: hedefImdb || String(year || ''), sayfa: [...ids][0] || '', yil: yil || 0, uydu: imdbUydu && yilUydu });
    if (!imdbUydu || !yilUydu) return { sources: [], trace: trace.ozet(), iframe: '' };
  }

  // — 4/5/6. Oynatıcılar: CloseLoad ve Rapid AYRI AYRI kaynak olarak listelenir.
  // İKİ TUR: 1) HIZ YOLU — gizli tarayıcıya hiç başvurmadan (DiziSol hızı).
  // 2) Yalnızca bir sunucu bile yayın vermediyse ve bütçe varsa, eksikler
  // gizli tarayıcıyla (Cloudflare'ı gerçek motorla çözer) bir kez daha denenir.
  const bas = Date.now();
  // DÜZELTME 1.1.76: 45 sn, agregatörün 30 sn şapkasını aşıyordu → TV turu
  // pencere AÇIKKEN bile sonuçlanamadan kesiliyordu (cihazda Orion TV hep 0).
  // Tavan, dış bütçenin altında kalacak şekilde indirildi; WebView turu (≤12 sn)
  // + hızlı turlar bu pencereye sığar.
  const BUTCE_MS = 24000;
  const ctx = { base: pageBase, contentUrl, html: contentHtml };
  let adaylar = await oynaticiAdaylariBul(ctx, trace, signal);
  if (!adaylar.length) {
    // Sessiz dönüş yok (rapor #2): "iz kimlik'te kesik" belirsizliği biter.
    // TV + 403 KANITI istisnası (YAPILACAKLAR #0 onaylı seçenek b): CF challenge
    // sayfayı yuttuysa aday listesi HİÇ kurulamaz; eski davranışta buradan sessiz
    // 0 dönülüyordu. Kanıtlı kilitte gizli motor challenge'ı BİR kez çözer
    // (cf_clearance paylaşılır), adaylar bir daha kurulur. Kapı TV+0-yayın+kanıt+
    // motor-boş; film yolu koşulu geçemez. Kanıtsız boşluk eski davranışı korur.
    const kanit = tvYolu403(trace);
    const motorBos = await tarayiciMotoruBos();
    if (!pahaliTuraIzin({ isFilm, yayinYok: true, kanit, motorBos })) {
      trace.koy('oynatici-yok', { neden: ctx.html ? 'onbellek' : 'sayfa-bos' });
      return { sources: [], trace: trace.ozet(), iframe: '' };
    }
    trace.koy('webview-sayfa', { neden: 'cf-403', contentUrl });
    const cozum = await istek(contentUrl, { ref: `${pageBase}/`, headers: { 'User-Agent': UA }, trace, signal, timeout: 12000, webView: true });
    if (cozum && /data-video|alternative-link|<iframe/i.test(cozum)) { ctx.html = cozum; adaylar.push(...await oynaticiAdaylariBul(ctx, trace, signal, true)); }
    if (!adaylar.length) { trace.koy('oynatici-yok', { neden: kanit ? 'cf-403' : (ctx.html ? 'onbellek' : 'sayfa-bos') }); return { sources: [], trace: trace.ozet(), iframe: '' }; }
  }
  const durum = adaylar.map((a) => ({ ...a, iframeUrl: a.iframeUrl || '', m3u8: '', kaynakHtml: '' }));

  const tur = async (webView) => {
    const eksik = durum.filter((d) => !d.m3u8);
    if (!eksik.length) return;
    const acilanlar = await iframeleriCoz(eksik, ctx, trace, webView, signal);
    if (!acilanlar.length) return;
    const yayinlar = await sunuculariCoz(acilanlar, contentUrl, pageBase, trace, webView, signal);
    acilanlar.forEach((o, i) => {
      const hedef = durum.find((d) => (d.videoId || d.iframeUrl) === (o.videoId || o.iframeUrl));
      const r = yayinlar[i];
      if (hedef && r && r.status === 'fulfilled' && r.value.m3u8) {
        hedef.m3u8 = r.value.m3u8; hedef.kaynakHtml = r.value.kaynakHtml; hedef.ad = r.value.ad || hedef.ad;
      }
    });
    trace.koy('tur', { yol: webView ? 'tarayici' : 'hizli', yayin: durum.filter((d) => d.m3u8).length });
  };

  await tur(false);
  // ADIM ADIM YAYIN: bulunan yayın hemen listeye düşer. Toplu taramanın zaman
  // aşımı (30 sn) dolmadan ilk sunucu ekranda görünür; pahalı tur uzasa bile
  // Orion "hiç gözükmüyor" durumuna düşmez. (Ölçüldü: pahalı tur 40 sn sürünce
  // batch Orion'u iptal ediyor, tek kaynak bile listelenmiyordu.)
  const liste = [];
  const gorulenUrl = new Set();
  const yayinla = () => {
    const yeni = [];
    for (const sunucu of durum) {
      const { m3u8, kaynakHtml, iframeUrl, ad } = sunucu;
      if (!m3u8 || sunucu.yayinlandi || !medyaMi(m3u8) || gorulenUrl.has(m3u8)) continue;
      gorulenUrl.add(m3u8); sunucu.yayinlandi = true;
      const altyazilar = tracksAltyazilari(kaynakHtml, pageBase, PLAYER_UA);
      const iframeKoken = koken(iframeUrl) || pageBase;
      const dublaj = /dual|trdual|trdub|dublaj/i.test(m3u8);
      const etiket = String(ad || 'Sunucu').replace(/\s+/g, '');
      const ortak = { headers: { Referer: `${iframeKoken}/`, 'User-Agent': PLAYER_UA, Accept: '*/*' }, altyazilar, kalite: '1080p' };
      const taban = `${tmdbId || 'x'}_${isFilm ? 'm' : `s${s}e${e}`}_${slugla(etiket) || 'sunucu'}`;
      // Yayın çift dilli ise (dual) iki dili de temsil eder; tek dilli yayın
      // yalnız kendi dilinde listelenir. (Çift dillinin karşı dile kopyalanması
      // yayıncı katmanında — publishStreams — yapılır.)
      const kay = kaynak({
        id: `hdfc_${dublaj ? 'dub' : 'sub'}_${taban}`,
        // ARAYÜZ ANONİMLİĞİ: kaynak adında site adı/kısaltması geçmez
        // (eskiden "HDFC …" yazıyordu). Yalnız kod adı + sunucu etiketi.
        ad: `Orion ${etiket} ${dublaj ? 'Dublaj' : 'Altyazı'} (1080p)`,
        url: m3u8, kategori: dublaj ? 'dubbed' : 'subtitled', ...ortak,
      });
      liste.push(kay); yeni.push(kay);
    }
    if (yeni.length && typeof onSources === 'function') { try { onSources(yeni); } catch (_) {} }
  };
  yayinla();

  // PAHALI (GİZLİ TARAYICI) TUR — VARSAYILAN OLARAK KAPALI.
  // Ölçülen gerçek davranış: Rapid hızlı turu 1-2 sn'de yayını bulup ANINDA
  // listeliyordu; ikinci sunucuyu (CloseLoad) çözmek için açılan gizli WebView
  // 10-25 sn meşgul kalıyor ve TEK tarayıcı motoru olduğu için (1) Orion'ın
  // kendi turu 12 sn yarışına rağmen ağda uçakta kalmaya devam edip SONRAKİ
  // sağlayıcıların WebView çağrılarını kilitliyor, (2) batch tavanı doluyor ve
  // "iki sunucu isterken sıfır sunucu" oluyordu — kullanıcının gördüğü buydu.
  // Kural: çalışan bir sunucu, bozan iki sunucudan iyidir. İkinci sunucu ancak
  // WebView motoru boşsa VE hızlı tur hiç yayın bulamadıysa denenir.
  const eksikSunucu = durum.filter((d) => !d.m3u8).length;
  const motorBos = await tarayiciMotoruBos();
  // TV yedek turu (onaylı istisna, YAPILACAKLAR #0/b): izde 403 kilidi KANITLIYSA
  // ve hızlı tur hiç yayın bulamadıysa gizli motor bir kez denenir — ölçüldü
  // (2026-10-15): TV uçları (.nl /dizi/ ve /video/) challenge'a 403, film 200.
  // Challenge çözümü süre yiyebildiği için 9 sn'lik "hızlı-düş" tavanı TV kanıtlı
  // yolda sağlayıcı bütçesine (BUTCE_MS) çıkar; film yolu yalnız PAHALI_TUR ile
  // davranır (DEĞİŞMEDİ).
  const yedekGecerli = eksikSunucu && !liste.length && motorBos
    && pahaliTuraIzin({ isFilm, yayinYok: true, kanit: tvYolu403(trace), motorBos: true });
  if ((PAHALI_TUR && eksikSunucu && !liste.length && motorBos && Date.now() - bas < 9000)
    || (yedekGecerli && Date.now() - bas < BUTCE_MS)) {
    trace.koy('webview-turu', { eksik: eksikSunucu, gecen: Date.now() - bas });
    await Promise.race([
      tur(true),
      new Promise((bitti) => setTimeout(bitti, 9000)),
    ]);
    yayinla();
  }

  trace.koy('sonuc', { tip: liste.length ? 'dogrudan' : 'yok', sunucu: gorulenUrl.size, n: liste.length });
  // KURAL: iframe ile açılan bir kaynak listede gösterilmez — "açılmıyor"
  // demekle aynı. Yalnızca bizim oynatıcımızda oynayan yayınlar eklenir.
  return { sources: liste, trace: trace.ozet(), iframe: '' };
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
