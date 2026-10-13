/* ==========================================================================
   AQUILA — Asya Animeleri  (sıfırdan, kit sözleşmesi)

   Nuvio/Patron "Asya Animeleri" eklentisinin bizim katmandaki karşılığı.
   Siteler yeniden OKUNDU, akış kendi helper'larımızla (kit.js) yazıldı;
   eklenti kodu taşınmadı.

   Adımlar:
     1. Alan adı: bilinen adres → siteurl.txt yedeği (kit.alanAdiCoz)
     2. Arama  : /?s={başlık}  → <article class="bs"> kartları (seri sayfası)
     3. Sezon  : sitede her sezon AYRI seri ("X 2.Sezon") → etikete göre seç
     4. Bölüm  : .eplister li → .epl-num (bölüm no) + bağlantı
     5. Oynatıcı: <select class="mirror"> option value = BASE64 iframe
     6. Yayın  : vidmoly/rumble/ailesi → extractEmbedStream → DOĞRUDAN m3u8
     7. Referer = oynatıcının kökü, UA = okhttp/4.9.2

   IFRAME YASAK: çözülemeyen gömülü sunucu listelenmez (isIframe elenir).
   HIZ: aramalar ve aynalar PARALEL (Promise.allSettled), gizli WebView
   kapalı (webView:false), toplam bütçe ~9 sn.
   ========================================================================== */

import {
  istek, izleyici, duzMetin, mutlak, koken, m3u8eCevir, medyaMi, kaynak,
  slugla, alanAdiCoz, kaliteBul, b64Ac,
} from './kit.js';
import { extractEmbedStream } from '../services/embedExtractors.js';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';
const PLAYER_UA = 'okhttp/4.9.2';
const BILINEN = ['https://asyaanimeleri.top', 'https://asyaanimeleri.to', 'https://asyaanimeleri.pw'];

export const kimlik = { id: 'asy', alias: 'Aquila', mediaTypes: ['anime'] };

/* ── yardımcılar ────────────────────────────────────────────────────────── */

const duz = (s) => String(s || '')
  .toLowerCase()
  .replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g')
  .replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c')
  .replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();

/** "X 3.Sezon" → 3; sezon etiketi yoksa 0. */
function sezonEtiketi(ad) {
  const m = String(ad || '').match(/(\d+)\s*[.)]?\s*\.?\s*sezon/i);
  return m ? +m[1] : 0;
}

const sezonsuz = (ad) => String(ad || '').replace(/\d+\s*[.)]?\.?\s*sezon/gi, ' ');

/**
 * KATI başlık eşleşmesi + sezon disiplini.
 * Tam eşleşme > öneş ek > kapsama; farklı sezon etiketi cezalandırılır,
 * böylece "Naruto" istenirken "Boruto: Naruto the Movie" seçilmez.
 */
function puanla(adayAdi, hedefler, sezon) {
  const aday = duz(sezonsuz(adayAdi));
  if (!aday) return 0;
  let en = 0;
  for (const h of hedefler) {
    const hedef = duz(h);
    if (!hedef) continue;
    if (aday === hedef) en = Math.max(en, 6);
    else if (aday.startsWith(hedef)) en = Math.max(en, 4);
    else if (hedef.startsWith(aday)) en = Math.max(en, 3);
    else if (aday.includes(hedef) || hedef.includes(aday)) en = Math.max(en, 1);
  }
  if (en < 2) return 0; // kapsama tek başına yetmez (yanlış seri riski)
  const etiket = sezonEtiketi(adayAdi);
  if (etiket) en += etiket === sezon ? 3 : -3;
  else if (sezon > 1) en -= 1;
  return en;
}

function b64Coz(s) {
  return b64Ac(s); // toleranslı (kit.b64Ac): `\/` kaçışları + base64url; katı atob aynaları çözemiyordu
}

/* ── 1. arama ───────────────────────────────────────────────────────────── */

function seriAdaylari(ham, base) {
  const out = [];
  for (const m of String(ham || '').matchAll(/<article[^>]*class="[^"]*\bbs\b[^"]*"[\s\S]*?<\/article>/gi)) {
    const href = (m[0].match(/<a[^>]*itemprop="url"[^>]*href="([^"]+)"/i) || m[0].match(/href="([^"]+)"/i) || [])[1];
    const ad = duzMetin((m[0].match(/<h2[^>]*itemprop="headline"[^>]*>([\s\S]*?)<\/h2>/i) || [])[1]
      || (m[0].match(/<a[^>]*title="([^"]+)"/i) || [])[1] || '');
    if (href && ad) out.push({ ad, url: mutlak(href, base) });
  }
  return out;
}

async function ara(base, sorgu, trace) {
  const ham = await istek(`${base}/?s=${encodeURIComponent(sorgu)}`, {
    ref: `${base}/`, headers: { 'User-Agent': UA, Accept: 'text/html' },
    timeout: 8000, trace, webView: false,
  });
  return seriAdaylari(ham, base);
}

/* ── 2. sezon / bölüm disiplini ─────────────────────────────────────────── */

function bolumler(ham, taban) {
  const out = [];
  for (const m of String(ham || '').matchAll(/<li[^>]*>\s*<a[^>]*href="([^"]+)"[\s\S]{0,200}?class="epl-num"[^>]*>([\s\S]{0,40}?)<\/div>/gi)) {
    const n = parseInt(String(m[2] || '').replace(/[^0-9]/g, ''), 10);
    if (n) out.push({ n, url: mutlak(m[1], taban) });
  }
  return out;
}

/** İstenen bölümü bul; liste yetmezse kalıp tahmini ({slug}-{n}-bolum). */
async function bolumAdresi(seriUrl, seriAdi, s, e, trace) {
  const ham = await istek(seriUrl, {
    ref: `${koken(seriUrl)}/`, headers: { 'User-Agent': UA }, timeout: 9000, trace, webView: false,
  });
  if (!ham) return { html: '', oynatmaSayfasi: '' };
  const liste = bolumler(ham, seriUrl);
  trace.koy('bolum-listesi', { n: liste.length });
  const bulunan = liste.find((x) => x.n === e);
  if (bulunan) return { html: ham, oynatmaSayfasi: bulunan.url };
  if (!liste.length) return { html: ham, oynatmaSayfasi: seriUrl }; // tek videolu seri / film
  // Bölüm listede yok: sitenin kalıbıyla bir kez dene (wrong-episode riski yok,
  // adres 404 dönerse boş gelir ve kaynak üretmeyiz).
  const yol = `${slugla(seriAdi)}-${e}-bolum`;
  for (const ek of [`${yol}/`, `${yol}-izle/`]) {
    const deneme = `${koken(seriUrl)}/${ek}`;
    const html = await istek(deneme, { ref: `${koken(seriUrl)}/`, headers: { 'User-Agent': UA }, timeout: 7000, trace, webView: false });
    if (html && /class="mirror"|id="pembed"/i.test(html)) return { html, oynatmaSayfasi: deneme };
  }
  return { html: ham, oynatmaSayfasi: '' };
}

/* ── 3. aynalar (gömülü sunucular) ──────────────────────────────────────── */

function aynalar(ham, oynatmaSayfasi) {
  const out = [];
  const gorulen = new Set();
  const ekle = (raw, ad) => {
    let u = mutlak(String(raw || '').trim(), oynatmaSayfasi);
    if (!u || /^data:/i.test(u)) return;
    // Patron'un bilinen kısayolu: gdplayer gömülüsü aslında VidMoly'dir.
    u = u.replace(/gdplayer\.to\/embed\/([^/?#]+)/i, 'vidmoly.to/embed-$1.html');
    if (gorulen.has(u)) return;
    gorulen.add(u);
    out.push({ url: u, ad: duzMetin(ad) || 'Sunucu' });
  };
  for (const blok of String(ham || '').matchAll(/<select[^>]*class="mirror"[\s\S]*?<\/select>/gi)) {
    for (const o of blok[0].matchAll(/<option[^>]*value="([^"]+)"[^>]*>([\s\S]{0,60}?)<\/option>/gi)) {
      const v = (o[1] || '').trim();
      if (!v || v.length < 8) continue;
      const ic = b64Coz(v);
      const src = (ic.match(/src\s*=\s*["']?([^"'\s>]+)/i) || ic.match(/(https?:\/\/[^\s"'>]+)/) || [])[1];
      if (src) ekle(src, o[2]);
    }
  }
  for (const m of String(ham || '').matchAll(/<iframe[^>]*src="(https?:\/\/[^"]+|\/\/[^"]+)"/gi)) ekle(m[1], 'Varsayılan');
  return out;
}

/** Rumble gömülüsü sayfada JSON olarak taşır: "hls":{"url":"…playlist.m3u8"}. */
async function rumbleCoz(url, ref, trace) {
  const ham = await istek(url, { ref, headers: { 'User-Agent': UA }, timeout: 8000, trace, webView: false });
  const ham_url = (ham.match(/"hls"\s*:\s*\{\s*"url"\s*:\s*"([^"]+)"/i) || [])[1];
  if (!ham_url) return '';
  const u = mutlak(ham_url.replace(/\\\//g, '/'), url);
  return medyaMi(u) ? u : '';
}

/** Bir aynayı doğrudan yayına çevirir; olmazsa null (IFRAME ASLA dönmez). */
async function yayingaCevir(ayna, ctx) {
  const hamUrl = m3u8eCevir(ayna.url);
  if (medyaMi(hamUrl)) return { url: hamUrl, oynatici: koken(hamUrl) };

  let bul = '';
  if (/rumble\.com/i.test(hamUrl)) {
    bul = await rumbleCoz(hamUrl, ctx.epUrl, ctx.trace);
  } else {
    const r = await extractEmbedStream(hamUrl, ctx.epUrl, new Set(), ctx.bitis);
    if (r && !r.isIframe) bul = m3u8eCevir(r.url || '');
  }
  if (!bul || !medyaMi(bul)) return null;
  return { url: bul, oynatici: koken(hamUrl) || koken(bul) };
}

/* ── ana akış ───────────────────────────────────────────────────────────── */

export async function coz({ type = 'anime', title = '', originalTitle = '', titles = [], season = 1, episode = 1 } = {}) {
  const trace = izleyici();
  const s = +season || 1;
  const e = +episode || 1;
  const hedefler = [...new Set([originalTitle, title, ...titles].filter((t) => t && String(t).trim().length > 1))];
  if (!hedefler.length) return { sources: [], trace: trace.ozet() };

  // — 1. seri sayfası: arama adayları PARALEL (sezonsuz + sezonlu sorgular)
  let base = BILINEN[0];
  const sorgular = [];
  for (const h of hedefler.slice(0, 2)) {
    if (s > 1) sorgular.push(`${h} ${s}.Sezon`, `${h} ${s}`);
    sorgular.push(h);
  }
  const turlar = [...new Set(sorgular.filter(Boolean))].slice(0, 4);
  let bulunan = [];
  for (const b of [base]) {
    const sonuclar = await Promise.allSettled(turlar.map((q) => ara(b, q, trace)));
    for (const r of sonuclar) if (r.status === 'fulfilled') bulunan = bulunan.concat(r.value || []);
    if (!bulunan.length) { // alan adı değişmiş olabilir → canlı adresi çöz
      base = await alanAdiCoz('asyaanimeleri', BILINEN, { trace, ua: UA });
      const yedek = await Promise.allSettled(turlar.slice(0, 2).map((q) => ara(base, q, trace)));
      for (const r of yedek) if (r.status === 'fulfilled') bulunan = bulunan.concat(r.value || []);
    }
  }
  // en yüksek puanlı kartı seç (aynı kart birden çok sorguda çıkabilir)
  let secenek = null; let enPuan = 0;
  for (const a of bulunan) {
    const p = puanla(a.ad, hedefler, s);
    if (p > enPuan) { enPuan = p; secenek = a; }
  }
  trace.koy('arama', { aday: bulunan.length, secili: secenek ? secenek.ad : '', puan: enPuan });
  if (!secenek) return { sources: [], trace: trace.ozet() };

  // — 2. sezon + bölüm
  const { html, oynatmaSayfasi } = await bolumAdresi(secenek.url, secenek.ad, s, e, trace);
  if (!html && !oynatmaSayfasi) return { sources: [], trace: trace.ozet() };
  const epUrl = oynatmaSayfasi || secenek.url;
  const epHam = oynatmaSayfasi && oynatmaSayfasi !== secenek.url
    ? await istek(epUrl, { ref: secenek.url, headers: { 'User-Agent': UA }, timeout: 9000, trace, webView: false })
    : html;
  trace.koy('bolum', { url: epUrl, oynatici: /class="mirror"/i.test(epHam || '') });

  // — 3. aynalar → yayınlar (paralel, tek bütçe)
  const ctx = { epUrl, bitis: Date.now() + 6500, trace };
  const adaylar = aynalar(epHam, epUrl).slice(0, 6);
  const sonuclar = await Promise.allSettled(adaylar.map((a) => yayingaCevir(a, ctx)));

  const kaynaklar = [];
  const gorulen = new Set();
  sonuclar.forEach((r, i) => {
    if (r.status !== 'fulfilled' || !r.value || gorulen.has(r.value.url)) return;
    gorulen.add(r.value.url);
    const ayna = adaylar[i];
    const dublaj = /dub|dublaj|turkce sesi/i.test(`${ayna.ad} ${r.value.url}`);
    const kalite = kaliteBul(r.value.url) || kaliteBul(ayna.ad) || '720p';
    kaynaklar.push(kaynak({
      id: `asy_${slugla(secenek.ad) || 'anime'}_s${s}e${e}_${slugla(ayna.ad) || i}_${dublaj ? 'dub' : 'sub'}`,
      ad: `Aquila ${duzMetin(ayna.ad).slice(0, 16) || 'Sunucu'} ${kalite} ${dublaj ? 'TR Dublaj' : 'Altyazı'}`,
      url: r.value.url,
      kategori: dublaj ? 'dubbed' : 'subtitled',
      headers: { Referer: `${r.value.oynatici || koken(epUrl)}/`, 'User-Agent': PLAYER_UA, Accept: '*/*' },
      kalite,
    }));
  });
  trace.koy('sonuc', { ayna: adaylar.length, n: kaynaklar.length });
  return { sources: kaynaklar, trace: trace.ozet() };
}

export default {
  apiVersion: 1,
  id: kimlik.id,
  name: kimlik.alias,
  mediaTypes: kimlik.mediaTypes,
  async resolve(a) { return (await coz(a)).sources; },
};
