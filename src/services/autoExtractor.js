/* ==========================================================================
   OTONOM ÇÖZÜMLEYİCİ
   "Verilen adresten oynatılabilir yayını bul" — siteye özel kod olmadan.

   CloudStream / Nuvio / KekikStream'ın yaptığı işin genel hâli: siteyi hiç
   tanımadan, otomatik olarak keşfedip çözmeye çalışmak. Bizim avantajımız
   bunu tarayıcıda (paket açma, AES çözme dahil) yapabilmemiz.

   STRATEJİ SIRA (ucuzdan pahalıya):
     0) Adres zaten doğrudan medya mı?                       → bitti
     1) Sayfayı indir, yayın kalıplarını tara                 → genelde biter
     2) Sayfada gömülü oynatıcı / video etiketi var mı?       → çözümleyiciye ver
     3) Sayfa bir İÇERİK sayfası mı (dizi/film/bölüm)?        → bağlantıları izle
     4) Sayfa bir ARAMA sonucu mu?                             → ilk sonuca git
     5) Site kökü mü? Başlıkla ara: bilinen arama desenlerini dene,
        WordPress REST API'yi dene, kök bağlantılarını tara
     6) Hiçbiri olmazsa → siteyi tanı.

   Her adım bir zaman bütçesine sahiptir; hiçbiri sonsuza kadar beklemez.
   ========================================================================== */

import { extractEmbedStream, isDirectStream, isStreamPlayable } from './embedExtractors.js';
import { akilliGet } from './nativeHttp.js';

const UA_BROWSER = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';

const ZAMAN = { sayfa: 9000, zincir: 12000, arama: 11000 };
// Sert bütçe: kullanıcı beklemez. Aşıldığında eldeki sonuç döner.
// 0 = sınırsız. Uygulamada (oynatıcı ekranı) sınır KOYULUR, çünkü ekran
// asılı kalmasın; CLI'de varsayılan sınırsızdır.
const VARSAYILAN_BUTCE = 0;
const GURL = /\/tara|yeni-eklenenler|yeni|arsiv|filmler|diziler|kanallar|kategori|wp-|iletisim|hakkimizda|gizlilik|kvkk|login|uye|abone|feed|page|tag|category/;

/** Ortak arama URL kalıpları. Çoğu Türkçe site bunlardan birini kullanır. */
const ARAMA_DESENLERI = [
  (b) => `/?s=${encodeURIComponent(b)}`,                  // WordPress
  (b) => `/arama/?q=${encodeURIComponent(b)}`,
  (b) => `/arama/${encodeURIComponent(b)}/`,
  (b) => `/search?q=${encodeURIComponent(b)}`,
  (b) => `/search/${encodeURIComponent(b)}`,
  (b) => `/ara?q=${encodeURIComponent(b)}`,
  (b) => `/?q=${encodeURIComponent(b)}`,
  (b) => `/q/${encodeURIComponent(b)}`
];

function tumlak(base, link) {
  if (!link) return '';
  try { return new URL(link, base).toString(); } catch (_) { return ''; }
}

/** Kalan süre. Bütçe bitmişse 0 döner; çağıranlar bunu kontrol edip durur. */
function kalan(butce) {
  return Math.max(0, butce.bitis - Date.now());
}
// Butce gercekten verilmis mi? (sonsuz modda his kontrol yapilmaz)
function butceVar(butce) {
  return Boolean(butce) && butce.bitis - butce.baslangic < 30000;
}
function butceHatasi(butce) {
  return Date.now() >= butce.bitis;
}

function hostOf(url) {
  try { return (new URL(url).hostname || '').toLowerCase(); } catch (_) { return ''; }
}

/** Sayfadaki bağlantıları toplar (mutlak hâle getirilmiş, sıra korunmuş). */
function baglantilar(html, base) {
  const out = [];
  const gorulen = new Set();
  for (const m of html.matchAll(/href=["']([^"'#]+)["']/gi)) {
    const abs = tumlak(base, m[1].replace(/\\\//g, '/'));
    if (!abs || !/^https?:/i.test(abs)) continue;
    if (gorulen.has(abs)) continue;
    gorulen.add(abs);
    out.push(abs);
  }
  return out;
}

/** Oynatıcı olabilecek aday bağlantılar (içerik sayfaları). */
function icerikBaglantilari(html, base, host) {
  return baglantilar(html, base).filter((u) => {
    if (hostOf(u) !== host) return false;
    const p = u.split('?')[0].toLowerCase();
    if (GURL.test(p)) return false;
    // Bölüm/sezon/dizi/film işaretleri
    return /(sezon|bolum|episode|watch|izle|\/dizi|\/film|\/video|\/watch)/i.test(p)
        || /\d{3,}/.test(p.split('/').pop() || '');
  });
}

/** Gömülü oynatıcı adayları. */
function gomuluAdaylari(html, base) {
  const out = [];
  for (const m of html.matchAll(/<iframe[^>]*\ssrc=["']([^"']+)["']/gi)) {
    const u = tumlak(base, m[1].replace(/\\\//g, '/'));
    if (u && !out.includes(u)) out.push(u);
  }
  return out;
}

/* ─────────────────────────── dışa açılan API ─────────────────────────── */

/**
 * Bir adresten oynatılabilir yayın çözer.
 *
 * @param {string} url       Site kökü, arama sonucu, içerik veya gömülü adresi
 * @param {object} secenekler
 *   baslik  – Arama yapılacaksa kullanılacak başlık
 *   referer – Gömülü çözümlemede kullanılacak adres
 *   izgara  – true ise yalnızca oynatılabilir olanı doğrular
 * @returns {Promise<{url, via, sayfa, zincir}|null>}
 */
export async function otonomCoz(url, secenekler = {}, butce, derinlik = 0) {
  const { baslik = '', referer = '', izgara = false, yedekCek = null } = secenekler;
  // Özyineleme derinliği: sonsuz site→içerik→bölüm→gömülü zincirleri var.
  if (derinlik > 3) return null;
  if (!url || !/^https?:\/\//i.test(url)) return null;
  // Her çağrı kendi bütçesini devralır; en dıştaki çağrı butce olmadan
  // başlatır. Böylece özyineleme derinliği süreyi uzatamaz.
  const pay = secenekler.butceMs ?? VARSAYILAN_BUTCE;
  const b = butce || { baslangic: Date.now(), bitis: Date.now() + (pay > 0 ? pay : 365 * 24 * 3600 * 1000) };
  if (secenekler.butceMs === undefined ? false : butceHatasi(b)) return null;

  const kok = hostOf(url);
  const zincir = [];

  // 0) Doğrudan medya
  if (isDirectStream(url)) {
    return { url, via: 'doğrudan', sayfa: url, zincir };
  }

  // 1) Sayfayı indir
  const html = await akilliGet(url, { ref: referer, timeout: Math.min(ZAMAN.sayfa, kalan(b) || 1), yedekCek });
  if (!html) return null;
  zincir.push({ adim: 'sayfa', url, bayt: html.length });

  // 2) Yayın kalıbı — doğrudan m3u8 ya da gömülü (iframe).
  //    İkisi de geçerli sonuçtır: çözülemezse oynatıcı iframe'de açılır ve
  //    tarayıcı onu kendi motoruyla çalıştırır. Bu yüzden "her türden site"
  //    ancak bu adım varsa mümkün.
  const dogrudan = await extractEmbedStream(url, referer || url, new Set(), b.bitis);
  if (dogrudan && (isDirectStream(dogrudan.url) || dogrudan.isIframe)) {
    if (!izgara || dogrudan.isIframe || await isStreamPlayable(dogrudan.url, dogrudan.referer || '')) {
      return { ...dogrudan, sayfa: url, zincir };
    }
  }

  // 3) Gömülü oynatıcılar → çözümleyici
  const gomuler = gomuluAdaylari(html, url);
  for (const g of gomuler.slice(0, 4)) {
    if (isDirectStream(g)) return { url: g, via: 'iframe-dogrudan', sayfa: url, zincir };
    const c = await extractEmbedStream(g, url, new Set(), b.bitis);
    if (c && (isDirectStream(c.url) || c.isIframe)) return { ...c, sayfa: url, zincir };
  }

  // 4) İçerik sayfası → bölüm/sezon bağlantılarını izle
  const icerik = icerikBaglantilari(html, url, kok);
  if (icerik.length) {
    zincir.push({ adim: 'icerik-sayfasi', adet: icerik.length });
    for (const c of icerik.slice(0, 2)) {
      if (butceVar(b) && butceHatasi(b)) break;
      const r = await otonomCoz(c, { ...secenekler, referer: url }, b, derinlik + 1);
      if (r) return { ...r, zincir: [...zincir, ...(r.zincir || [])] };
    }
  }

  // 5) Arama sonucuysa ilk gerçek sonuca git
  const sonuclar = icerik.length ? icerik : baglantilar(html, url).filter((u) => {
    if (hostOf(u) !== kok) return false;
    const p = u.split('?')[0].toLowerCase();
    return !GURL.test(p) && p.split('/').filter(Boolean).length <= 2;
  });
  if (sonuclar.length && sonuclar[0] !== url) {
    if (secenekler.butceMs === undefined ? false : butceHatasi(b)) return null;
    const r = await otonomCoz(sonuclar[0], { ...secenekler, referer: url }, b, derinlik + 1);
    if (r) return { ...r, zincir: [...zincir, ...(r.zincir || [])] };
  }

  // 6) Site köküyse başlıkla ara
  if (baslik && (url === kok || url === `${kok}/` || url.endsWith('/'))) {
    const kok2 = `${kok}/`;
    for (const desen of ARAMA_DESENLERI) {
      const aramaUrl = tumlak(kok2, desen(baslik));
      if (!aramaUrl || aramaUrl === url) continue;
      if (butceVar(b) && butceHatasi(b)) break;
      const ar = await akilliGet(aramaUrl, { timeout: Math.min(ZAMAN.arama, kalan(b) || 1), yedekCek });
      if (!ar || ar.length < 800) continue;
      const bulunan = icerikBaglantilari(ar, aramaUrl, kok);
      if (!bulunan.length) continue;
      zincir.push({ adim: 'arama', desen: desen(baslik).slice(0, 40), adet: bulunan.length });
      for (const c of bulunan.slice(0, 2)) {
        if (butceVar(b) && butceHatasi(b)) break;
        const r = await otonomCoz(c, { ...secenekler, referer: aramaUrl }, b, derinlik + 1);
        if (r) return { ...r, zincir: [...zincir, ...(r.zincir || [])] };
      }
    }
    // WordPress REST API
    const wp = `${kok}/wp-json/wp/v2/search?search=${encodeURIComponent(baslik)}&per_page=5`;
    try {
      const j = await akilliGet(wp, { timeout: ZAMAN.arama, yedekCek });
      if (j && j.trim().startsWith('[')) {
        const kayitlar = JSON.parse(j);
        for (const k of kayitlar.slice(0, 3)) {
          if (!k?.url) continue;
          const r = await otonomCoz(k.url, { ...secenekler, referer: kok }, b, derinlik + 1);
          if (r) return { ...r, zincir: [...zincir, { adim: 'wp-json' }, ...(r.zincir || [])] };
        }
      }
    } catch (_) {}
  }

  return null;
}

/**
 * Birden çok aday dener, ilk oynatılabilir olanı döner.
 * (Sıralama girdisinin önüne geçer; hangisinin gerçekten açıldığını bilmiyoruz.)
 */
export async function otonomCozIlk(adresler, secenekler = {}) {
  const liste = (adresler || []).filter((a) => typeof a === 'string' && a);
  // Her adrese eşit pay: ilk adres tüm bütçeyi yemesin.
  const pay = Math.max(4000, Math.floor(VARSAYILAN_BUTCE / Math.max(1, Math.min(liste.length, 6))));
  for (const a of liste.slice(0, 6)) {
    const b = { baslangic: Date.now(), bitis: Date.now() + pay };
    const r = await otonomCoz(a, { ...secenekler, izgara: true }, b);
    if (r) return r;
  }
  return null;
}

/** Siteyi tanı: hangi tür bir site olduğunu ve neler deneneceğini söyler. */
export async function siteTani(url) {
  const kok = hostOf(url);
  const html = await akilliGet(url, { timeout: ZAMAN.sayfa });
  if (!html) return { ok: false, url, hata: 'sayfa alınamadı' };
  const baslik = (html.match(/<title[^>]*>([^<]{2,90})/i) || [])[1] || '';
  return {
    ok: true,
    url,
    baslik: baslik.trim(),
    wordpress: /wp-content|wp-includes/i.test(html),
    wpRest: /wp-json/.test(html) || /wp-content/.test(html),
    videoEtiketi: /<video\b/i.test(html),
    iframe: (html.match(/<iframe/gi) || []).length,
    m3u8: /\.m3u8/i.test(html),
    engelMi: /just a moment|attention required|cf-browser-verification/i.test(html.slice(0, 3000)),
    baglanti: baglantilar(html, url).length,
    icerikSayfasi: icerikBaglantilari(html, url, kok).length,
    aramaDeseni: ARAMA_DESENLERI.length
  };
}

export { UA_BROWSER as AUTONOM_UA };