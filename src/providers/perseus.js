/* ==========================================================================
   PERSEUS — BelgeselX  ("blgx")

   Site akışı (canlı doğrulandı):
     /belgesel/{slug} sayfası oynatıcıyı taşır; bölüm satırları JS içinde
     diziGetir('bolumId','ic1','ic2','ic3','başlık',hit,tarih,'sezon','bolum',…)
     çağrısıyla gömülüdür. Oynatıcı adresi srcMap ile üretilir:
       GET {site}/video/data/{new1..new5}.php?id={bolumId}&sira={n}
     Yanıt gövdesinde `file:"…"` aranır:
       • uzantısı .m3u8/.mp4 → DOĞRUDAN yayın;
       • aynı sitenin /video/x.php?cid=… adresi → 302 zinciriyle mp4'e iner
         (ölçüldü: zincir + `Range: bytes=0-2047` → 206 video/mp4 "ftyp");
       • gövdede iframe/videoembed/drive/youtube/ok.ru/dailymotion izi varsa
         GÖMÜLÜDÜR → KAYNAK ATILIR (iframe yasağı). `x…` öneki dailymotion
         gömülüsüdür → at.

     Arama ucu (/arama?q=) sitede ÖLÜ (404, canlı ölçüldü); içerik adresi
     slug'tan üretilir, bulunamazsa liste sayfalarından taranır.
     Canlı TV kanalları (/belgeselkanali/*) KAPSAM DIŞI — yalnız VOD.

   Hız: istek başına 9 sn, slotlar Promise.allSettled ile paralel, toplam
   hedef ~8 sn / sert tavan 12 sn, gizli WebView kapalı (webView:false).
   ========================================================================== */

import { izleyici, istek, kaynak, mutlak, koken, medyaMi, baslikEslesir, temizBaslik, slugla, alanAdiCoz } from './kit.js';

export const kimlik = { id: 'blgx', alias: 'Perseus', mediaTypes: ['movie', 'tv'] };

const BILINEN_TABANLAR = ['https://belgeselx.com'];
const YAYIN_UA = 'okhttp/4.9.2';
const SN = 9000;        // tek istek zaman aşımı (kural: 8-9 sn)
const HEDEF = 8000;     // toplam süre hedefi — derin adımlar bunu aşınca atlanır
const TAVAN = 11500;    // sert tavan (kural: toplam ≤ 12 sn)

// Sayfadaki srcMap'in birebir karşılığı: ic kodu → veri ucu adı.
const SRC_MAP = { 0: 'new5', 2: 'new1', 3: 'new2', 4: 'new3', 5: 'new4' };
// Gömülü oynatıcı izleri: yalnızca DOĞRUDAN dosya bulunamazsa uygulanır
// ( JW-benzeri oynatıcı gövdelerinde "YouTube Tarzı menü" gibi reklam/metin
// izleri var; kör tarama tek sağlam slotu yanlışlıkla eliyordu — ölçüldü).
const GOMULU_RE = /<iframe|videoembed|drive\.google\.com\/(file|uc|open)|ok\.ru|ok\.link|dailymotion\.co\/video|myvi\.ru|vidmoly/i;

function yayinBasliklari(taban) {
  return { Referer: `${taban}/`, 'User-Agent': YAYIN_UA, Accept: '*/*' };
}

function kacisCoz(s) {
  return String(s || '').replace(/\\\//g, '/').replace(/\\u0026/g, '&');
}

/** Türkçe başlık normalizasyonu: `baslikEslesir` küçük harfe çevirirken `İ`den
 *  gelen birleşik nokta (U+0307) boşluğa düşüp eşleşmeyi kırıyordu ("FAMİLYASI"
 *  ≠ "familyasi", canlı ölçüldü). Önce ASCII kütüğe indirgeriz. */
function trDuz(s) {
  return String(s || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g')
    .replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/\s+/g, ' ').trim();
}

/* ── 1. içerik bul: slug → liste taraması ─────────────────────────────── */

function sayfaBasligi(html) {
  const t = ((/<title>([^<]+)<\/title>/i.exec(html || '') || [])[1] || '')
    .replace(/izle|—.*$/gi, ' ').replace(/\s+/g, ' ').trim();
  return temizBaslik(t);
}

async function slugSayfalari(taban, adaylar, { trace, t0 } = {}) {
  const sonuclar = await Promise.allSettled(adaylar.slice(0, 3).map(async (q) => {
    const url = `${taban}/belgesel/${slugla(q)}`;
    const html = await istek(url, { ref: `${taban}/`, timeout: SN, trace, webView: false });
    if (!html || !/diziGetir\(/.test(html)) return null;
    const baslik = sayfaBasligi(html);
    // KATİ eşleşme: sayfa zaten adayın slug'ında bulundu; başlık da (Türkçe
    // normalize edilmiş hâliyle) uymuyorsa içerik yanlış sayfadır.
    return baslikEslesir(trDuz(baslik), adaylar.map(trDuz)) ? { baslik, url, html } : null;
  }));
  const bulunan = sonuclar.filter((s) => s.status === 'fulfilled' && s.value).map((s) => s.value);
  if (bulunan.length) trace?.koy('icerik', { secili: bulunan[0].baslik, yol: 'slug' });
  return bulunan;
}

/** Slug tutmadıysa: liste sayfalarından eşleşen bağlantıyı çek (bütçe varsa). */
async function listeTara(taban, adaylar, { trace, t0 } = {}) {
  if (Date.now() - t0 > HEDEF) return [];
  const listeler = await Promise.allSettled(['/son-eklenenler', '/en-cok-izlenen-belgeseller']
    .map((yol) => istek(`${taban}${yol}`, { ref: `${taban}/`, timeout: SN, trace, webView: false })));
  const gorulen = new Set();
  const adayLinkler = [];
  for (const s of listeler) {
    if (s.status !== 'fulfilled' || !s.value) continue;
    for (const m of String(s.value).matchAll(/href="(https?:\/\/[^"]*\/belgesel(?:dizi)?\/[a-z0-9-]+)"/gi)) {
      const url = m[1];
      const slug = url.split('/').filter(Boolean).pop();
      if (gorulen.has(slug) || !slug) continue;
      if (!adaylar.some((q) => slugla(q) === slug)) continue;
      gorulen.add(slug);
      adayLinkler.push(url);
    }
  }
  const dogrular = await Promise.allSettled(adayLinkler.slice(0, 2).map(async (url) => {
    const html = await istek(url, { ref: `${taban}/`, timeout: SN, trace, webView: false });
    if (!html || !/diziGetir\(/.test(html)) return null;
    const baslik = sayfaBasligi(html);
    return baslikEslesir(trDuz(baslik), adaylar.map(trDuz)) ? { baslik, url, html } : null;
  }));
  const bulunan = dogrular.filter((s) => s.status === 'fulfilled' && s.value).map((s) => s.value);
  if (bulunan.length) trace?.koy('icerik', { secili: bulunan[0].baslik, yol: 'liste' });
  return bulunan;
}

/* ── 2. bölüm satırları ve slot çözümleme ─────────────────────────────── */

/** diziGetir('id','ic1','ic2','ic3','başlık',hit,tarih,'sezon','bolum',…) satırları. */
function bolumleriParseEt(html) {
  const out = [];
  const re = /diziGetir\('(\d+)','(\d)','(\d)','(\d)','([^']*)'[^)]*?'(\d+)','(\d+)'/g;
  for (const m of String(html || '').matchAll(re)) {
    out.push({
      id: m[1], ics: [m[2], m[3], m[4]], baslik: m[5],
      sezon: +m[6] || 1, bolum: +m[7] || 1,
    });
  }
  return out;
}

/** Tek slot (veri ucu) → doğrudan yayın adresi ya da null (gömülü/boş). */
async function slotCoz(taban, ep, ic, sira, { trace, t0 } = {}) {
  const slot = SRC_MAP[String(ic)];
  if (!slot || Date.now() - t0 > TAVAN) return null;
  const url = `${taban}/video/data/${slot}.php?id=${encodeURIComponent(ep.id)}&sira=${sira}`;
  const html = await istek(url, { ref: `${taban}/belgesel/`, timeout: SN, trace, webView: false });
  if (!html) return null;

  const adaylar = [...html.matchAll(/file\s*:\s*"([^"]+)"/gi)]
    .map((m) => kacisCoz(m[1]))
    .filter((v) => v && !/^x[0-9A-Za-z]/.test(v)); // `x…` = dailymotion gömülüsü
  for (const v of adaylar) {
    const tam = mutlak(v, taban);
    if (medyaMi(tam)) return { url: tam, slot };
    // Zincir adresi: aynı sitenin cid'li .php ucu 302 ile mp4'e iner (ölçüldü).
    if (/^https?:\/\/[^/]*belgeselx[^/]*\/video\/[a-z0-9]+\.php\?cid=/i.test(tam)
      || (koken(tam) === taban && /\/video\/[a-z0-9]+\.php\?cid=/i.test(tam))) {
      return { url: tam, slot };
    }
  }
  // IFRAME YASAĞI: doğrudan dosya yoksa ve gövde gömülü oynatıcı taşıyorsa
  // (Drive iframe / ok.ru videoembed / Drive `AF1Qip…` kimliği) slot atılır.
  if (GOMULU_RE.test(html) || /AF1Qip[0-9A-Za-z_-]{20,}|["']key=["']?[0-9A-Za-z+/=]{28,}/.test(html)) {
    trace?.koy('slot-gomulu', { slot });
    return null;
  }
  trace?.koy('slot-bos', { slot });
  return null;
}

async function bolumSlotlariniCoz(taban, ep, { trace, t0 }) {
  const slotlar = ep.ics.map((ic, i) => ({ ic, sira: i + 1 })).filter((x) => SRC_MAP[String(x.ic)]);
  const sonuclar = await Promise.allSettled(slotlar.map((s) => slotCoz(taban, ep, s.ic, s.sira, { trace, t0 })));
  const bulunan = sonuclar.filter((s) => s.status === 'fulfilled' && s.value).map((s) => s.value);
  const tekil = [...new Set(bulunan.map((b) => b.url))];
  return tekil.map((url) => {
    const zincir = !medyaMi(url);
    // Zincir (Picasa/googlevideo) hatları: yabancı Referer CDN imzasını
    // kırıyor — ölçüldü: Referer'li 403, Referer'siz 206 video/mp4.
    const headers = zincir
      ? { 'User-Agent': YAYIN_UA, Accept: '*/*' }
      : yayinBasliklari(taban);
    const k = kaynak({
      id: `blgx_${ep.id}_${url.length.toString(36)}`,
      // ANONİMLİK: etiket yalnızca kod adından üretilir, gerçek site adı YOK.
      ad: 'Perseus HD Akış',
      url, kategori: 'dubbed', headers,
    });
    // Zincir adreslerinin uzantısı yok; akışkanlığı canlı doğrulandı.
    if (zincir) { k.isDirectVideo = true; k.type = 'direct'; }
    return k;
  });
}

/* ── 3. akış ──────────────────────────────────────────────────────────── */

async function akis(taban, adaylar, type, s, e, { trace, t0 }) {
  let isabetler = await slugSayfalari(taban, adaylar, { trace, t0 });
  if (!isabetler.length) isabetler = await listeTara(taban, adaylar, { trace, t0 });
  if (!isabetler.length) return [];
  // KATİ BAŞLIK EŞLEŞMESİ slugSayfalari/listeTara içinde doğrulandı.
  const satirlar = bolumleriParseEt(isabetler[0].html);
  trace?.koy('bolumler', { n: satirlar.length });
  if (!satirlar.length) return [];

  const hedef = type === 'tv'
    ? satirlar.filter((r) => r.sezon === s && r.bolum === e)
    : satirlar;
  if (!hedef.length) { trace?.koy('bolum-yok', { s, e }); return []; }
  const ep = hedef.find((r) => r.ics.some((ic) => SRC_MAP[String(ic)])) || hedef[0];
  return bolumSlotlariniCoz(taban, ep, { trace, t0 });
}

export async function coz({ type = 'movie', title = '', originalTitle = '', titles = [], season = 1, episode = 1 } = {}) {
  const trace = izleyici();
  const t0 = Date.now();
  const s = +season || 1;
  const e = +episode || 1;
  const adaylar = [...new Set([originalTitle, title, ...(titles || [])].map((x) => temizBaslik(x)).filter((x) => x && x.length > 1))];
  trace.koy('girdi', { type, s, e, adaylar });
  if (!adaylar.length) return { sources: [], trace: trace.ozet() };

  let kaynaklar = [];
  try {
    kaynaklar = await akis(BILINEN_TABANLAR[0], adaylar, type, s, e, { trace, t0 });
    // Alan adı değişmiş olabilir: bütçe varsa canlı adresle bir kez dene.
    if (!kaynaklar.length && Date.now() - t0 < HEDEF) {
      const taze = await alanAdiCoz('belgeselx', BILINEN_TABANLAR, { trace, ua: YAYIN_UA });
      const kok = (taze || '').replace(/\/$/, '');
      if (kok && kok !== BILINEN_TABANLAR[0] && Date.now() - t0 < HEDEF) {
        kaynaklar = await akis(kok, adaylar, type, s, e, { trace, t0 });
      }
    }
  } catch (err) {
    trace.koy('hata', { mesaj: String(err).slice(0, 120) });
  }
  // Kural gereği güvenlik süzgeci: iframe/embed asla listelenmez.
  kaynaklar = (kaynaklar || []).filter((x) => x && !x.isIframe && x.type !== 'embed');
  trace.koy('sonuc', { n: kaynaklar.length, ms: Date.now() - t0 });
  return { sources: kaynaklar, trace: trace.ozet() };
}

export default { apiVersion: 1, id: kimlik.id, name: kimlik.alias, mediaTypes: kimlik.mediaTypes, async resolve(a) { return (await coz(a)).sources; } };
