/* ==========================================================================
   PAMUK — klasik çizgi film havuzu (site adı arayüze HİÇ sızmaz)

   2026-10-15 canlı ölçümleri (anonim, anahtarsız):
     1. Arama  : /?s=<ad> → kart bağlantıları /cartoon/<slug>/; kart başlığı
                  (alt) tam kısa adı taşır (ölçüldü: "Baby Puss",
                  "The Cat and the Mermouse"). Arama motoru İLGİSİZ kart da
                  döndürebilir (ölçüldü: "pocahontas" araması Popeye kısayla
                  döndü) → kapı: birebir ad eşitliği, önek/arama sırası YOK.
     2. Sayfa  : jwplayer kurulumu tek satır: file: "https://…/<ad>.mp4"
                  (ölçüldü: ww…net/tom-and-jerry/baby-puss.mp4).
     3. Akış   : Range 0-63 → 206 + 'ftyp' bayt kanıtı iki ayrı seride
                  doğrulandı (≈207 MB / ≈116 MB, Referer'lı-Referer'sız 206).
     Dizi (S/E) DESTEĞİ YOK — bilinçli: bölüm listesi alfabetik ve kartta
     S/Eetiketi yok; konum→bölüm tahmini KANITSIZ olduğundan REDDEDİLDİ.
     Başlığı kısa adla birebir eşleşen içerik döner; eşleşme yoksa sessiz 0.
   BÜTÇE: ≤2 arama + 1 sayfa + 1 doğrulama; tek istek ≤8sn.
   ========================================================================== */

import {
  izleyici, istek, kaynak, alanAdiCoz, temizBaslik, slugla,
} from './kit.js';

export const kimlik = { id: 'pamuk', alias: 'Pamuk', mediaTypes: ['tv', 'movie'] };

const BILINEN_ADRESLER = ['https://www.supercartoons.net'];

/** HTML varlıklarını çöz + Türkçe-duyarlı düzleştir. */
export function duz(x) {
  return String(x || '')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(+n))
    .replace(/&amp;/gi, '&').replace(/&nbsp;/gi, ' ')
    .toLowerCase()
    .replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g')
    .replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, ' ').replace(/\s+/g, ' ').trim();
}

/** Arama sayfasından kart listesi: [{url, ad}] — ad = kart alt/metin başlığı. */
export function kartlarBul(html) {
  const out = [];
  const gorulen = new Set();
  for (const m of String(html || '').matchAll(
    /<a[^>]+href=["']([^"']*\/cartoon\/[^"'?#]+\/?)["'][^>]*>(?:(?!<\/a>)[\s\S]){0,400}?<img[^>]+alt=["']([^"']+)["']/gi,
  )) {
    const url = m[1].startsWith('http') ? m[1] : `https:${m[1]}`;
    const ad = duz(m[2]);
    if (!ad || gorulen.has(url)) continue;
    gorulen.add(url);
    out.push({ url: url.replace(/\/+$/, ''), ad });
  }
  // yedek: imgsiz kartlar (yalnız metin bağlantısı)
  for (const m of String(html || '').matchAll(/<a[^>]+href=["']([^"']*\/cartoon\/[^"'?#]+\/?)["']\s*>([^<]{2,80})<\/a>/gi)) {
    const url = m[1].startsWith('http') ? m[1] : `https:${m[1]}`;
    const ad = duz(m[2]);
    if (!ad || gorulen.has(url)) continue;
    gorulen.add(url);
    out.push({ url: url.replace(/\/+$/, ''), ad });
  }
  return out;
}

/** KAPI: kısa ad BİREBİR eşit (alt ya da slug). Sıra/önek güvenilmez. */
export function kartSec(kartlar, hedefler) {
  const hedeflerDuz = [...new Set(hedefler.map(duz).filter((t) => t.length >= 3))];
  for (const k of kartlar) {
    if (hedeflerDuz.includes(k.ad)) return k;
    const slug = duz((String(k.url).match(/\/cartoon\/([^/]+)\/?$/) || [])[1] || '');
    if (slug && hedeflerDuz.includes(slug)) return k;
  }
  return null;
}

/** Sayfadaki jwplayer "file:" satırlarını çıkar (mp4/m3u8). */
export function dosyaBul(html) {
  const out = [];
  for (const m of String(html || '').matchAll(/file\s*:\s*["']([^"']+\.(?:mp4|m3u8|mkv))["']/gi)) {
    if (/^https?:/i.test(m[1]) && !out.includes(m[1])) out.push(m[1]);
  }
  return out;
}

/** Bayt kanıtı: mp4 → 'ftyp'; m3u8 → '#EXTM3U'; HTML/reddiye elenir. */
async function akisDogrula(url, ref, trace) {
  const govde = await istek(url, { ref, headers: { Range: 'bytes=0-63' }, timeout: 8000, webView: false, trace });
  const b = String(govde || '');
  if (b.length < 12 || /^\s*</.test(b)) return false;
  if (/\.m3u8/i.test(url)) return /^#EXTM3U/.test(b);
  return /ftyp/.test(b.slice(0, 16));
}

/* ── giriş noktası ─────────────────────────────────────────────────────── */
export async function coz({ type = 'movie', title = '', originalTitle = '', titles = [] } = {}) {
  const trace = izleyici();
  const bas = Date.now();
  if (type !== 'movie' && type !== 'tv') return { sources: [], trace: trace.ozet() };
  const hedefler = [...new Set(
    [temizBaslik(originalTitle), temizBaslik(title), ...(titles || []).map(temizBaslik)]
      .filter((t) => t && t.length > 2),
  )];
  if (!hedefler.length) return { sources: [], trace: trace.ozet() };

  const taban = await alanAdiCoz('pamuk', BILINEN_ADRESLER, { trace });
  if (!taban) return { sources: [], trace: trace.ozet() };

  let kart = null;
  for (const h of hedefler.slice(0, 2)) {
    const html = await istek(`${taban}/?s=${encodeURIComponent(h)}`, { ref: `${taban}/`, timeout: 8000, trace });
    if (!html) continue;
    kart = kartSec(kartlarBul(html), hedefler);
    if (kart) break;
  }
  if (!kart) { trace.koy('kimlik-yok', { hedef: hedefler[0] }); return { sources: [], trace: trace.ozet() }; }
  trace.koy('kimlik', { slug: slugla(kart.ad).slice(0, 40) });

  const sayfa = await istek(`${kart.url}/`, { ref: `${taban}/`, timeout: 8000, trace });
  const out = [];
  for (const url of dosyaBul(sayfa).slice(0, 2)) {
    if (!await akisDogrula(url, `${taban}/`, trace)) { trace.koy('akis-yanlis', {}); continue; }
    out.push(kaynak({
      id: `pamuk_${slugla(kart.ad).slice(0, 40) || 'kisa'}`,
      ad: 'Pamuk Klasik',
      url,
      kategori: 'subtitled',
      headers: { Referer: `${taban}/` },
      kalite: 'Klasik',
    }));
  }
  trace.koy('sonuc', { kaynak: out.length, ms: Date.now() - bas });
  return { sources: out, trace: trace.ozet() };
}

export default {
  apiVersion: 1,
  id: kimlik.id,
  name: kimlik.alias,
  mediaTypes: kimlik.mediaTypes,
  async resolve(a) { return (await coz(a)).sources; },
};
