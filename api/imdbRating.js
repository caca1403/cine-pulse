/* ==========================================================================
   IMDb puanı ucu  —  sunucu tarafı, anahtar gerektirmez
   --------------------------------------------------------------------------
   TMDB, IMDb PUANINI dönmez (yalnız imdb_id verir). Puanın anahtarsız tek
   kaynağı IMDb sayfasıdır; bu yüzden okuma sunucuda yapılır ve burada önbelleğe
   alınır. İstemci (uygulama) bu uca `apiUrl()` ile gider.

   Kullanım
     GET /api/imdbRating?tmdbId=550&tur=movie
       → { imdbRating: 8.4 | null }
     GET /api/imdbRating?ids=550:movie,1396:tv      (toplu — kart listeleri için)
       → { puanlar: { "550": 8.4, "1396": 9.5 } }

   Tasarım kuralları
     · Hata ASLA 5xx dönmez: puan bilinmiyorsa null / eksik alan. Uygulama
       detay ekranını bu ucun durumuna bağlı olarak bekletmemeli, ama buranın
       çökmesi de arayüzü kırmamalı.
     · Negatif sonuç DA önbelleğe yazılır (olumsuzları yeniden denemek IMDb'yi
       boşuna dövmek demek).
     · Yeni API anahtarı/secret yok.
   ========================================================================== */

const API_KEYS = ['4e44d9029b1270a757cddc766a1bcb63', '844dba0bfd8f3a4f3799f6130ef9e335'];
let aktifAnahtar = 0;

const DIS_TTL = 6 * 60 * 60 * 1000;      // bulunan puan 6 saat
const OLUMSUZ_TTL = 60 * 60 * 1000;      // bulunamayan 1 saat denemez
const EN_FAZLA_TOPLU = 25;              // tek istekte en çok kaç id

const ONBELLEK = new Map();             // anahtar → { puan, zaman }
const Tekli = new Map();                // anahtar → Promise (tek-atim tekilleştirme)

/** Basit önbellek okuma: `oy` yaşı aşmışsa undefined döner (null ile karışmaz). */
function oku(anahtar) {
  const kayit = ONBELLEK.get(anahtar);
  if (!kayit) return undefined;                       // hiç denenmedi
  const omur = kayit.puan === null ? OLUMSUZ_TTL : DIS_TTL;
  if (Date.now() - kayit.zaman > omur) {
    ONBELLEK.delete(anahtar);
    return undefined;
  }
  return kayit.puan;                                  // null = denendi, yok
}

function yaz(anahtar, puan) {
  try {
    ONBELLEK.set(anahtar, { puan: puan ?? null, zaman: Date.now() });
    if (ONBELLEK.size > 4000) {                       // sunucuda sınırsız büyümesin
      const eski = [...ONBELLEK.entries()].sort((a, b) => a[1].zaman - b[1].zaman)[0];
      if (eski) ONBELLEK.delete(eski[0]);
    }
  } catch (_) { /* önbellek kaybışı işlevi bozmaz */ }
}

/** `550:movie,1396:tv` → [{id:'550',tur:'movie'}, …] (geçici girdiler atlanır). */
export function idleriAyikla(ham) {
  return String(ham || '')
    .split(',')
    .map(parca => parca.trim())
    .filter(Boolean)
    .slice(0, EN_FAZLA_TOPLU)
    .map(girdi => {
      const [id, tur] = girdi.split(':');
      if (!/^\d{1,9}$/.test(String(id || ''))) return null;
      const t = String(tur || 'movie').toLowerCase();
      return { id: String(id), tur: t === 'tv' || t === 'series' ? 'tv' : 'movie' };
    })
    .filter(Boolean);
}

/** IMDb sayfasından puanı çıkarır (birden çok biçim denenir). */
export function puandanAyikla(html) {
  const kaliplar = [
    /"ratingValue"\s*:\s*"?([\d.]+)"?/i,
    /<span[^>]*itemprop="ratingValue"[^>]*>\s*([\d.]+)\s*<\/span>/i,
    /<meta[^>]*property="[^"]*rating[^"]*"[^>]*content="([\d.]+)"/i,
  ];
  for (const k of kaliplar) {
    const m = String(html || '').match(k);
    if (!m) continue;
    const sayi = Number.parseFloat(m[1]);
    if (Number.isFinite(sayi) && sayi >= 0 && sayi <= 10) return Math.round(sayi * 10) / 10;
  }
  return null;
}

async function tmdbDisId(tmdbId, tur) {
  for (let deneme = 0; deneme < API_KEYS.length; deneme++) {
    const anahtar = API_KEYS[aktifAnahtar];
    try {
      const url = new URL(`https://api.themoviedb.org/3/${tur}/${tmdbId}/external_ids`);
      url.searchParams.append('api_key', anahtar);
      const cevap = await fetch(url.toString(), { signal: AbortSignal.timeout(3500) });
      if (cevap.ok) {
        const veri = await cevap.json();
        return String(veri?.imdb_id || '');
      }
    } catch (_) { /* sonraki anahtar */ }
    aktifAnahtar = (aktifAnahtar + 1) % API_KEYS.length;
  }
  return '';
}

async function imdbPuani(imdbId) {
  // 1) Doğrudan deneme: bazı çıkış IP'lerinden sayfa düz gelir.
  try {
    const cevap = await fetch(`https://www.imdb.com/title/${imdbId}/`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      signal: AbortSignal.timeout(7000),
    });
    if (cevap.ok) {
      const puan = puandanAyikla(await cevap.text());
      if (puan !== null) return puan;
    }
  } catch (_) { /* proxy denemesine düş */ }
  // 2) Bot duvarı (202 challenge sayfası) buradan da puanı saklıyor; metin
  //    okuma proxy'siyle başlık satırından ("⭐ 9.2" / "9.2/10 2.7M") okunur.
  try {
    const cevap = await fetch(`https://r.jina.ai/https://www.imdb.com/title/${imdbId}/`, {
      headers: { Accept: 'text/plain' },
      signal: AbortSignal.timeout(9000),
    });
    if (!cevap.ok) return null;
    const metin = String(await cevap.text());
    const eslesme =
      metin.match(/⭐\s*(\d+(?:\.\d+)?)/) ||
      metin.match(/(\d\.\d)\s*\/\s*10\s*\d[\d.]*[KM]?\b/i) ||
      metin.match(/"ratingValue"\s*:\s*"?(\d+(?:\.\d+)?)/);
    if (!eslesme) return null;
    const sayi = Number.parseFloat(eslesme[1]);
    return Number.isFinite(sayi) && sayi >= 0 && sayi <= 10 ? Math.round(sayi * 10) / 10 : null;
  } catch (_) {
    return null;
  }
}

/** Tek bir TMDB id'si için puan; önbellek ve tek-atim birleştirme burada. */
export async function puanBul(tmdbId, tur = 'movie') {
  const anahtar = `${tur}:${tmdbId}`;
  const mevcut = oku(anahtar);
  if (mevcut !== undefined) return mevcut;
  if (Tekli.has(anahtar)) return Tekli.get(anahtar);

  const is = (async () => {
    try {
      let imdbId = await tmdbDisId(tmdbId, tur);
      // Tür yanlış olabilir (film/dizi karışımı): bir kez diğerini dene.
      if (!imdbId) imdbId = await tmdbDisId(tmdbId, tur === 'tv' ? 'movie' : 'tv');
      if (!imdbId) { yaz(anahtar, null); return null; }
      const puan = await imdbPuani(imdbId);
      yaz(`imdb:${imdbId}`, puan);
      yaz(anahtar, puan);
      return puan;
    } catch (_) {
      yaz(anahtar, null);
      return null;
    } finally {
      Tekli.delete(anahtar);
    }
  })();

  Tekli.set(anahtar, is);
  return is;
}

function gövdeYanıtla(res, durum, veri) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=3600');
  return res.status(durum).json(veri);
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') return gövdeYanıtla(res, 200, {});

  let sorgu = req.query;
  if (!sorgu || !Object.keys(sorgu).length) {
    try {
      const u = new URL(req.url || '', 'http://yerel');
      sorgu = Object.fromEntries(u.searchParams.entries());
    } catch (_) { sorgu = {}; }
  }

  // Toplu kip: kart listeleri tek istekte çözümler.
  if (sorgu.ids) {
    const istekler = idleriAyikla(sorgu.ids);
    const puanlar = {};
    await Promise.all(istekler.map(async ({ id, tur }) => {
      const p = await puanBul(id, tur);
      if (p !== null) puanlar[id] = p;
    }));
    return gövdeYanıtla(res, 200, { puanlar });
  }

  const tmdbId = String(sorgu.tmdbId || '');
  if (!/^\d{1,9}$/.test(tmdbId)) return gövdeYanıtla(res, 400, { imdbRating: null });
  const tur = ['tv', 'series'].includes(String(sorgu.tur || '').toLowerCase()) ? 'tv' : 'movie';

  const puan = await puanBul(tmdbId, tur);
  return gövdeYanıtla(res, 200, { imdbRating: puan });
}
