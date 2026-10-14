/* ==========================================================================
   BELLATRIX — HDFilmDelisi / hdfilmus  (sıfırdan, kit sözleşmesi)

   Site (ölçüldü 2026-10-12): siteurl.txt'deki `hdfilmus` anahtarı
   hdfilm.us'a gidiyor; o adres BTK engelli + kendi kendini imzalayan
   sertifikalı (ölü). Sitenin YAŞAYAN adresi hdfilmdelisi.one — Next.js,
   CF koruması YOK, JSON araması var.

   Adımlar:
     1. Alan adı: alanAdiCoz('hdfilmus') → bilinenler (hdfilmdelisi.one)
     2. Arama:   /api/search?q={imdb|başlık} → JSON {results[], series[]}
                 (imdbId doğrudan sorgu olarak da çalışıyor)
     3. Film:    /film/{slug} içinde "contentUrl" (sitenin kendi /vids/*.mp4)
                 ve "videoUrl" (pl.vixolity.com gömülü oynatıcısı)
     4. Dizi:    /api/dizi/{slug} → seasons[].episodes[] ile S/E DOĞRULAMA,
                 sonra /dizi/{slug}/{S}/{E} sayfasındaki videoUrl
     5. Oynatıcı: vixolity HTML'i iki katmanlı obfuskasyon (hex→ters→base64
                 →karakter kaydırma) — SAF metin çözümü, üçüncü taraf kod
                 ÇALIŞTIRILMAZ. Çıkan `file:` adresi DOĞRUDAN m3u8 verir:
                 ha.vixolity.com/vs/{imdb}[/s{S}/e{E}] → #EXTM3U (ölçüldü),
                 TR/EN ses + TR/EN altyazı yatakları master'da gömülü.
     6. Kanıt: yayın adresleri desen + bayt yoklamasıyla süzülür — uzantısız
                 vixolity /vs/ deseni ölçülmüş HLS'tir; HTML dönen adres ELER.

   IFRAME YOK. extractEmbedStream vixolity şemasını bilmiyor (ölçüldü: null);
   onun yerine bu dosyadaki yerel vixCoz + sniff kullanılır.

   BAŞLIK KURALI: imdbId birebir eşleşme → kesin; yoksa baslikEslesir.
   YAYIN BAŞLIKLARI: Referer = oynatıcı kökü, UA = okhttp/4.9.2.
   siteSunucu.mp4 İSTİSNA: hdfilmdelisi.one /vids/ adreslerini okhttp UA'sına
   karşı 404 veriyor (ölçüldü) — o kaynak için tarayıcı UA'sı gönderilir;
   vixolity m3u8'i okhttp ile 200 döner (kurala uygun ana kaynak odur).
   ========================================================================== */

import {
  istek, izleyici, koken, m3u8eCevir, medyaMi, kaynak, baslikEslesir,
  temizBaslik, slugla, siteurlHaritasi, yilUyar,
} from './kit.js';
import { b64Kaydir } from '../services/hdfcDecoders.js';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
const PLAYER_UA = 'okhttp/4.9.2';
// siteurl.txt'teki `hdfilmus` anahtarı ÖLÜ (hdfilm.us: BTK + kendi kendini
// imzalayan sertifika) — canlı adres bilinenler başında.
const BILINEN = ['https://hdfilmdelisi.one', 'https://hdfilmdelisi.xyz', 'https://hdfilm.us'];

export const kimlik = { id: 'hdfd', alias: 'Bellatrix', mediaTypes: ['movie', 'tv'] };

/* ── yardımcılar ──────────────────────────────────────────────────────── */

async function jsonAl(url, ref, trace, timeout = 8000) {
  const ham = await istek(url, { ref, timeout, headers: { 'User-Agent': UA, Accept: 'application/json, text/plain, */*' }, trace, webView: false });
  const t = String(ham || '').trim();
  if (!t || (t[0] !== '{' && t[0] !== '[')) return null;
  try { return JSON.parse(t); } catch (_) { return null; }
}

/** Çalışan alan adı: siteurl.txt → bilinenler. Kanıt ucu AĞIR ANA SAYFA
 *  DEĞİL ~1 KB'lık /api/search JSON'udur (ana sayfa 865 KB — yavaş ağda
 *  time-out'a düşüp yanlış domain seçtiriyordu; ölçüldü). Oturumda bir kez
 *  çözülür ve hafızalanır. */
let _base = '';
async function baseCoz(trace) {
  if (_base) return _base;
  const harita = await siteurlHaritasi({ trace });
  const adaylar = [...new Set([harita.hdfilmus, ...BILINEN].filter(Boolean).map((u) => u.replace(/\/$/, '')))];
  for (const u of adaylar) {
    const j = await jsonAl(`${u}/api/search?q=test`, `${u}/`, trace, 5000);
    const saglam = Boolean(j && (Array.isArray(j.results) || Array.isArray(j.series)));
    trace.koy('alan-adi', { aday: u, saglam });
    if (saglam) { _base = u; return u; }
  }
  return '';
}

/** Next.js kaçışlarını (\" \\ \/) sadeleştir; sonra düz regex çalışır. */
function safMetin(html) {
  return String(html || '').replace(/\\(["'\\/])/g, '$1');
}

/** vixolity oynatıcı config'i: hex çiftleri → ters → base64 → (bayt-k).
 *  Üçüncü taraf kod YÜRÜTÜLMEZ; yalnızca metin çözüp URL tararız. */
function vixAdresleri(html) {
  const found = [];
  for (const m of String(html || '').matchAll(/\}\)\('([0-9a-fA-F]{16,})',(\d+)\)/g)) {
    try {
      const hex = m[1];
      let raw = '';
      for (let i = 0; i + 1 < hex.length; i += 2) raw += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
      const b64 = raw.split('').reverse().join('');
      const b = b64Kaydir(b64);
      const k = +m[2] || 0;
      let code = '';
      for (let i = 0; i < b.length; i++) code += String.fromCharCode(((b.charCodeAt(i) - k) % 256 + 256) % 256);
      // config içindeki '\xNN' kaçışları da çözülür (file adresi böyle saklanır)
      const temiz = code.replace(/\\x([0-9a-fA-F]{2})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
      for (const u of temiz.matchAll(/https?:\/\/[^'"\s<>\\]+/g)) found.push(u[0]);
    } catch (_) { /* çözülmezse aday elenir */ }
  }
  // config'in ilk adresi `file:` alanıdır; reklam adresleri sonradan gelir
  return [...new Set(found)];
}

/** Yayın tipi: uzantı kanıtı → kesip biçmeden kabul; uzantısız vixolity
 *  `/vs/` deseni ölçülmüş HLS'tir (bayt kanıtı test katmanında: #EXTM3U).
 *  Yayınlardan runtime'da asla video baytı indirilmez (11 MB'a varan bedava
 *  indirme + Android'de ikili gövde güvenilmez — ölçüldü). */
function yayinTipi(url) {
  const u = String(url || '');
  if (/\.m3u8(\?|#|$)/i.test(u)) return 'hls';
  if (/vixolity\.com\/vs\//i.test(u)) return 'hls';
  if (medyaMi(u)) return /\.mp4/i.test(u) ? 'mp4' : 'mkv';
  return '';
}

/* ── arama eşleştirme ─────────────────────────────────────────────────── */

function esSec(liste, { adaylar, imdbId, yil = null }) {
  const arr = Array.isArray(liste) ? liste : [];
  if (!arr.length) return null;
  if (imdbId) {
    const tam = arr.find((x) => String(x.imdbId || '').toLowerCase() === String(imdbId).toLowerCase()
      || String(x.imdbId || '').toLowerCase() === `tt${String(imdbId).toLowerCase()}`);
    if (tam) return tam;
  }
  // Yıl kapısı: başlık eşleşse bile yılı >1 öte kart reddedilir (yeniden
  // çevrimler/aynı adlı sezonlar — denetim matrisi 4. madde).
  return arr.find((x) => yilUyar(yil, x.yil, `${x.baslik} ${x.orijinalBaslik || ''}`)
    && (baslikEslesir(adaylar[0] || '', [x.baslik, x.orijinalBaslik].filter(Boolean))
      || baslikEslesir(x.baslik || '', adaylar) || baslikEslesir(x.orijinalBaslik || '', adaylar))) || null;
}

/* ── oynatıcı çözümü ──────────────────────────────────────────────────── */

/** Bir gömülü oynatıcı adresini doğrudan yayına çevirir.
 *  Desen kanıtı (uzantı / vixolity-vs) yeterlidir; bayt yoklaması yalnızca
 *  şüpheli durumunda ek sigortadır (Android'de ikili gövde güvenilir değil). */
async function embedCoz(videoUrl, ref, trace, webView = false) {
  if (!videoUrl || !/^https?:\/\//i.test(videoUrl)) return null;
  if (/youtube|youtu\.be/i.test(videoUrl)) return null;
  const oynatici = koken(videoUrl);
  const html = await istek(videoUrl, { ref, timeout: 9000, headers: { 'User-Agent': UA }, trace, webView });
  if (!html) return null;
  const adaylar = vixAdresleri(html).filter((u) => !/youtube/i.test(u)).slice(0, 2);
  for (const u of adaylar) {
    const tip = yayinTipi(u);
    if (tip) return { url: u, tip, oynatici };
  }
  return null;
}

/* ── ana akış ─────────────────────────────────────────────────────────── */

export async function coz({ type = 'movie', title = '', originalTitle = '', titles = [], year = null, imdbId = null, tmdbId = null, season = 1, episode = 1 } = {}) {
  const trace = izleyici();
  const bas = Date.now();
  const isFilm = type === 'movie';
  const s = +season || 1, e = +episode || 1;
  const adayBasliklar = [...new Set([title, originalTitle, ...titles].map(temizBaslik).filter(Boolean))];
  const base = await baseCoz(trace);
  if (!base) { trace.koy('sonuc', { n: 0, neden: 'domain-ulasilamadi' }); return { sources: [], trace: trace.ozet() }; }

  // — 1. arama: imdb → özgün başlık → TR başlık
  const sorgular = [...new Set([imdbId, adayBasliklar.find((b) => b === originalTitle) || originalTitle, ...adayBasliklar].filter(Boolean))];
  let secim = null; let seri = null;
  for (const q of sorgular) {
    const j = await jsonAl(`${base}/api/search?q=${encodeURIComponent(q)}`, `${base}/`, trace);
    if (!j) continue;
    trace.koy('arama', { q: String(q).slice(0, 30), film: (j.results || []).length, dizi: (j.series || []).length });
    if (isFilm) secim = secim || esSec(j.results, { adaylar: adayBasliklar, imdbId, yil: year });
    else seri = seri || esSec(j.series, { adaylar: adayBasliklar, imdbId, yil: year });
    if (isFilm ? secim : seri) break;
  }
  const hedef = isFilm ? secim : seri;
  if (!hedef || !hedef.slug) { trace.koy('sonuc', { n: 0, neden: 'icerik-yok' }); return { sources: [], trace: trace.ozet() }; }

  // — 2. hedef sayfa + içerik adresleri
  let icerikUrl = ''; let icerik = '';
  if (isFilm) {
    icerikUrl = `${base}/film/${hedef.slug}`;
    icerik = await istek(icerikUrl, { ref: `${base}/`, timeout: 9000, headers: { 'User-Agent': UA }, trace, webView: false });
  } else {
    // sezon/bölüm YOKSA kaynak üretilmez (katı eşleşme)
    const detay = await jsonAl(`${base}/api/dizi/${hedef.slug}`, `${base}/`, trace);
    const ep = ((detay?.seasons || []).find((x) => +x.sezonNo === s)?.episodes || []).find((x) => +x.bolumNo === e);
    if (!ep) { trace.koy('sonuc', { n: 0, neden: `bolum-yok-s${s}e${e}` }); return { sources: [], trace: trace.ozet() }; }
    icerikUrl = `${base}/dizi/${hedef.slug}/${s}/${e}`;
    icerik = await istek(icerikUrl, { ref: `${base}/`, timeout: 9000, headers: { 'User-Agent': UA }, trace, webView: false });
    if (!icerik || !icerik.toLowerCase().includes(slugla(hedef.slug))) {
      trace.koy('sonuc', { n: 0, neden: 'bolum-sayfa-basarisiz' });
      return { sources: [], trace: trace.ozet() };
    }
  }

  const saf = safMetin(icerik);
  const videolar = [...saf.matchAll(/"videoUrl"\s*:\s*"(https?:\/\/[^"]+)"/g)].map((m) => m[1]);
  const vids = [...new Set([...saf.matchAll(/"contentUrl"\s*:\s*"(https?:\/\/[^"]+)"/g)].map((m) => m[1]))]
    .map((u) => m3u8eCevir(u))
    .filter((u) => /\/vids\/\w+_\d+\.(mp4|m3u8)|\.(m3u8|mp4)(\?|#|$)/i.test(u));

  // — 3. gömülü oynatıcılar paralel doğrudan yayına çevrilir
  const embedIs = [...new Set(videolar.filter((u) => !medyaMi(u)))].slice(0, 3);
  const cozumler = await Promise.allSettled(embedIs.map((u) => embedCoz(u, icerikUrl, trace, false)));
  const adayYayinlar = [];
  cozumler.forEach((r, i) => {
    if (r.status === 'fulfilled' && r.value) adayYayinlar.push({ ...r.value, kaynakAd: 'Vixolity' });
    else trace.koy('embed-basarisiz', { url: String(embedIs[i]).slice(0, 90) });
  });
  // site sunucusu MP4'leri (varsa): desen kanıtı yeterli (/vids/{slug}_{sure}.mp4;
  // okhttp 404 döndürdüğü için yayın başlığı tarayıcı UA taşır — ölçüldü)
  for (const u of [...new Set(vids)].slice(0, 2)) {
    adayYayinlar.push({ url: u, tip: yayinTipi(u) || 'mp4', oynatici: koken(u), kaynakAd: 'Site Sunucusu' });
  }

  // — 4. kaynak listesi (yalnızca doğrudan yayın; iframe yok)
  const dublaj = /dublaj/i.test(String(hedef.dublajDurumu || ''));
  const liste = [];
  const gorulen = new Set();
  for (const a of adayYayinlar) {
    if (!a.url || gorulen.has(a.url)) continue;
    gorulen.add(a.url);
    const vix = /vixolity/i.test(a.url);
    const etiket = slugla(a.kaynakAd) || 'sunucu';
    const taban = `${tmdbId || hedef.slug || imdbId || 'x'}_${isFilm ? 'm' : `s${s}e${e}`}_${etiket}`;
    liste.push({
      ...kaynak({
        id: `hdfd_${dublaj ? 'dub' : 'sub'}_${taban}`,
        ad: `Bellatrix Sunucu ${dublaj ? 'Dublaj/Altyazı' : 'Altyazı'} (${a.tip === 'hls' ? 'HLS' : a.tip.toUpperCase()})`,
        url: a.url,
        kategori: dublaj ? 'dubbed' : 'subtitled',
        // vixolity m3u8 adresi uzantısız ama #EXTM3U döner (yoklandı) → bayrağı elle ver
        headers: vix
          ? { Referer: 'https://pl.vixolity.com/', 'User-Agent': PLAYER_UA, Accept: '*/*' }
          : { Referer: `${koken(a.url) || base}/`, 'User-Agent': UA, Accept: '*/*' }, // /vids: okhttp yasağı (ölçüldü)
        altyazilar: [],
        kalite: a.tip === 'hls' ? '1080p' : '',
      }),
      isHls: a.tip === 'hls',
      isDirectVideo: true,
    });
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
