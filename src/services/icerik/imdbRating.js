/* ==========================================================================
   IMDb puanı istemcisi
   --------------------------------------------------------------------------
   TMDB IMDb puanını dönmez; puan /api/imdbRating ucundan (sunucu tarafı) gelir.
   Bu modül üç şeyi garanti eder:
     1) ADRES DOĞRU: istek apiUrl() ile mutlak yapılır. Göreli '/api/...'
        Capacitor'da https://localhost/api/... demek olduğundan 404 üretiyordu.
     2) ASLA BEKLETMEZ / PATLAMAZ: zaman aşımı + yutulan hata. Detay ekranı ve
        kart listesi IMDb verisinin durumuna bağlı kalmaz.
     3) ÜCRETSİZ KULLANIM: toplu istek + önbellek. Kart listeleri için tek
        istekte en çok 25 id çözülür, sonuç localStorage'a yazılır; aynı satır
        ikinci açılışta ağa çıkmaz.
   ========================================================================== */

import { apiUrl } from '../altyapi/apiOrigin.js';

const LS_ANAHTAR = 'cp_imdb_puanlari_v1';
const OLUMLU_OMUR = 24 * 60 * 60 * 1000;   // bulunan puan 1 gün taşınır
const OLUMSUZ_OMUR = 6 * 60 * 60 * 1000;   // bulunamayan 6 saat denemez
const TOPLU_EN_FAZLA = 25;
const VARSAYILAN_TAVAN_MS = 2500;

const OMBELLEK = new Map();                // 'movie:550' → { puan, zaman }
let tasindi = false;

/** localStorage yüklemesi; bozuk/erişilemez depolama sessizce boş sayılır. */
function yukle() {
  if (tasindi) return;
  tasindi = true;
  try {
    const ham = localStorage.getItem(LS_ANAHTAR);
    if (!ham) return;
    const veri = JSON.parse(ham);
    if (veri && typeof veri === 'object') {
      for (const [k, v] of Object.entries(veri)) {
        if (v && Number.isFinite(v.zaman)) OMBELLEK.set(k, v);
      }
    }
  } catch (_) { /* bozuk depolama → boş başla */ }
}

function sakla() {
  try {
    const nesne = {};
    let sayac = 0;
    for (const [k, v] of OMBELLEK) {
      nesne[k] = v;
      if (++sayac > 600) break;            // depolama şişmesin
    }
    localStorage.setItem(LS_ANAHTAR, JSON.stringify(nesne));
  } catch (_) { /* kota dolu olabilir — işlevi bozmaz */ }
}

function anahtarYap(tmdbId, tur) {
  return `${tur === 'tv' || tur === 'series' ? 'tv' : 'movie'}:${String(tmdbId)}`;
}

function oku(anahtar, simdi = Date.now()) {
  const kayit = OMBELLEK.get(anahtar);
  if (!kayit) return undefined;                       // hiç denenmedi
  const omur = kayit.puan === null ? OLUMSUZ_OMUR : OLUMLU_OMUR;
  if (simdi - kayit.zaman > omur) {
    OMBELLEK.delete(anahtar);
    return undefined;
  }
  return kayit.puan;                                  // null = denendi, yok
}

/** Girdi listesini önbelleğe göre ikiye böler: hazır olanlar / ağa gidecekler. */
export function onbellegeGoreAyir(girdiler, simdi = Date.now()) {
  yukle();
  const hazir = {};
  const eksik = [];
  const gorulen = new Set();
  for (const g of girdiler || []) {
    const id = String(g?.tmdbId ?? g?.id ?? '').trim();
    if (!/^\d{1,9}$/.test(id)) continue;
    const tur = g?.tur || g?.type || 'movie';
    const a = anahtarYap(id, tur);
    if (gorulen.has(a)) continue;
    gorulen.add(a);
    const deger = oku(a, simdi);
    if (deger !== undefined) {
      if (deger !== null) hazir[id] = deger;
    } else if (eksik.length < TOPLU_EN_FAZLA) {
      eksik.push({ id, tur: tur === 'tv' || tur === 'series' ? 'tv' : 'movie' });
    }
  }
  return { hazir, eksik };
}

/** 0-10 dışı/NaN değerleri eler, tek ondalığa yuvarlar. */
export function puanAyikla(deger) {
  const sayi = Number(deger);
  if (!Number.isFinite(sayi) || sayi <= 0 || sayi > 10) return null;
  return Math.round(sayi * 10) / 10;
}

/** Gösterim biçimi: '8.4' ya da boş metin. */
export function puanMetni(deger) {
  const p = puanAyikla(deger);
  return p === null ? '' : p.toFixed(1);
}

/**
 * Bir/kaç TMDB id'si için IMDb puanı.
 * @param {Array<{tmdbId:string|number, tur?:string}>} girdiler
 * @param {{timeoutMs?:number}} [secenek]
 * @returns {Promise<Record<string, number>>} id → puan (bulunamayan anahtar yok)
 */
export async function imdbPuanlari(girdiler, secenek = {}) {
  const { hazir, eksik } = onbellegeGoreAyir(girdiler);
  const sonuc = { ...hazir };
  if (!eksik.length) return sonuc;

  const tavan = Number(secenek.timeoutMs) > 0 ? Number(secenek.timeoutMs) : VARSAYILAN_TAVAN_MS;
  try {
    const ids = eksik.map(e => `${e.id}:${e.tur}`).join(',');
    const yol = apiUrl(`/api/imdbRating?ids=${encodeURIComponent(ids)}`);
    const cevap = await fetch(yol, { signal: AbortSignal.timeout(tavan) });
    if (cevap?.ok) {
      const veri = await cevap.json();
      const puanlar = veri?.puanlar || (veri?.imdbRating != null ? { [eksik[0].id]: veri.imdbRating } : {});
      const simdi = Date.now();
      for (const { id, tur } of eksik) {
        const p = puanAyikla(puanlar?.[id]);
        OMBELLEK.set(anahtarYap(id, tur), { puan: p, zaman: simdi });
        if (p !== null) sonuc[id] = p;
      }
      sakla();
    }
  } catch (_) {
    // IMDb erişilemezse arayüz puansız devam eder — negatif kayıt YAZMIYORUZ,
    // çünkü buradaki hata "puan yok" anlamına gelmez (ağ/uci kapalı olabilir).
  }
  return sonuc;
}

/** Tek içerik için kısa yol (detay ekranı). */
export async function imdbPuaniniAl(tmdbId, tur = 'movie', secenek) {
  const r = await imdbPuanlari([{ tmdbId, tur }], secenek);
  return r?.[String(tmdbId)] ?? null;
}

/**
 * Kartları toplu doldurur: `[data-imdb-id]` taşıyan öğelere puanı yazar.
 * Ağ çağrısı tek seferdir; sonuçlar hem DOM'a hem önbelleğe işlenir.
 */
export async function kartlariDoldur(kok = document) {
  const alanlar = [...(kok?.querySelectorAll?.('[data-imdb-id]') || [])]
    .filter(el => !el.dataset.imdbDolu);
  if (!alanlar.length) return {};
  const puanlar = await imdbPuanlari(
    alanlar.map(el => ({ tmdbId: el.dataset.imdbId, tur: el.dataset.imdbTur || 'movie' }))
  );
  for (const el of alanlar) {
    const metin = puanMetni(puanlar?.[el.dataset.imdbId]);
    if (!metin) continue;
    el.textContent = `${metin} IMDb`;
    el.hidden = false;
    el.dataset.imdbDolu = '1';
  }
  return puanlar;
}
