/* ==========================================================================
   KAYNAK ZEKÂSI — kendini öğreten kaynak sıralaması
   --------------------------------------------------------------------------
   KekikStream ve Patron statik bir liste sırasıyla çalışır: hangi kaynağın
   bu cihazda, bu ağda, bu saatte oynadığını bilmezler. CinePulse öğrenir:

   • Her kaynak ailesi (Orion, Atlas, Vega…) için oynatma doğrulaması, hata,
     boş sonuç ve çözülme süresi kaydedilir.
   • Sayaçlar zamanla sönümlenir (yarı ömür 7 gün): bayat bilgi karar vermez.
   • Güven, Beta(1,1) düzeltmeli oynatma oranıdır; az denenmiş ailelere keşif
     payı verilir (üst güven sınırı mantığı) ki yeni kaynaklar şansa çıkmasın.
   • Gecikme üstel hareketli ortalama (EWMA) ile izlenir; yavaş hat cezalandırılır.
   • Karar tek satırda: öncelik = temel sıra + zekâ cezası.

   Depolama localStorage'dadır; APK, DEB ve web sürümünde aynı kural çalışır.
   ========================================================================== */

const BEYIN_ANAHTARI = 'cinepulse_source_brain_v1';
const YARI_OMUR_MS = 7 * 24 * 60 * 60 * 1000;   // bilgi 7 günde yarılanır
const KARAR_HIZI = 0.3;                          // gecikme EWMA öğrenme oranı
const EN_FAZLA_KAYIT = 60;

function beyinOku() {
  try {
    const d = JSON.parse(localStorage.getItem(BEYIN_ANAHTARI) || '');
    return d && typeof d === 'object' ? d : {};
  } catch (_) { return {}; }
}

function beyinYaz(hal) {
  try {
    const kuyruk = Object.entries(hal)
      .sort(([, a], [, b]) => (b?.guncelleme || 0) - (a?.guncelleme || 0))
      .slice(0, EN_FAZLA_KAYIT);
    localStorage.setItem(BEYIN_ANAHTARI, JSON.stringify(Object.fromEntries(kuyruk)));
  } catch (_) { /* gizli mod: öğrenme sessizce devre dışı */ }
}

const sonumla = (gecen) => Math.pow(0.5, Math.max(0, Date.now() - gecen) / YARI_OMUR_MS);

/** Bir olayı beyne işler.
 *  @param {{aile:string, olay:'oynadi'|'hata'|'bos'|'cozuldu', ms?:number}} param */
export function zekaKaydet({ aile, olay, ms = 0 } = {}) {
  const ad = String(aile || '').trim();
  if (!ad) return;
  const hal = beyinOku();
  const eski = hal[ad] || { oynadi: 0, hata: 0, bos: 0, cozumMs: 0, guncelleme: Date.now() };
  const carpan = sonumla(eski.guncelleme || Date.now());
  const kayit = {
    oynadi: (Number(eski.oynadi) || 0) * carpan,
    hata: (Number(eski.hata) || 0) * carpan,
    bos: (Number(eski.bos) || 0) * carpan,
    cozumMs: Number(eski.cozumMs) || 0,
    guncelleme: Date.now(),
  };
  if (olay === 'oynadi') kayit.oynadi += 1;
  else if (olay === 'hata') kayit.hata += 1.3;      // kesin hata en ağır
  else if (olay === 'bos') kayit.bos += 0.4;        // içerik yok: hafif iz
  if (Number(ms) > 0) kayit.cozumMs = kayit.cozumMs ? kayit.cozumMs * (1 - KARAR_HIZI) + ms * KARAR_HIZI : ms;
  hal[ad] = kayit;
  beyinYaz(hal);
}

/** Ailenin oynatma güveni (0–1). Deneme yoksa 0.5 — tarafsız başlangıç. */
export function zekaGuven(aile) {
  const kayit = beyinOku()[String(aile || '').trim()];
  if (!kayit) return 0.5;
  const iyi = Number(kayit.oynadi) || 0;
  const kotu = (Number(kayit.hata) || 0) + (Number(kayit.bos) || 0);
  return (iyi + 1) / (iyi + kotu + 2);
}

/** Öncelik skoruna eklenecek ceza (küçük = önce). Negatif = keşif bonusu. */
export function zekaCeza(aile) {
  const ad = String(aile || '').trim();
  if (!ad) return 0;
  const kayit = beyinOku()[ad];
  if (!kayit) return 0;
  const guven = zekaGuven(ad);
  const deneme = (Number(kayit.oynadi) || 0) + (Number(kayit.hata) || 0) + (Number(kayit.bos) || 0);
  const hiz = kayit.cozumMs ? Math.min(1, kayit.cozumMs / 6000) * 1.5 : 0;
  const kesif = deneme < 3 ? (3 - deneme) * 0.8 : 0;
  // KANITLANMIŞ İYİ AİLE: güven %80'in üstündeyse ceza sıfıra çekilir.
  // (Kanıt yokken temkinli, kanıt varken ödül — öğrenmenin anlamı bu.)
  const basari = guven > 0.8 ? 1 : 0;
  const ceza = Math.max(-2, Math.min(8, Math.round((1 - guven) * 6 + hiz - kesif - basari)));
  return ceza === 0 ? 0 : ceza; // -0 yerine 0
}

/** Teşhis ekranı / ölçüm için öğrenilen ağırlıklar. */
export function zekaOzeti() {
  const hal = beyinOku();
  return Object.entries(hal).map(([aile, k]) => ({
    aile,
    guven: +zekaGuven(aile).toFixed(2),
    oynadi: +(Number(k?.oynadi) || 0).toFixed(1),
    hata: +(Number(k?.hata) || 0).toFixed(1),
    bos: +(Number(k?.bos) || 0).toFixed(1),
    cozumMs: Math.round(Number(k?.cozumMs) || 0),
    ceza: zekaCeza(aile),
  })).sort((a, b) => a.ceza - b.ceza);
}
