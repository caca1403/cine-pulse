/* ==========================================================================
   CinePulse Studio — İZLENİM (impression) KAYIT DEFTERİ
   --------------------------------------------------------------------------
   Sıralayıcının NEGATİF sınıfı buradan gelir: kullanıcıya gösterilen ama
   açılmayan kart. Bu olmadan model "her şey iyidir" öğrenir.

   · Depo enjekte edilir (localStorage benzeri) → node --test'te bellek deposu.
   · Halka tampon (en fazla `SINIR` kayıt): kota şişmez.
   · Kişisel veri sunucuya gitmez.
   ========================================================================== */

export const IZLENIM_ANAHTAR = 'cinepulse_ml_izlenim_v1';
export const IZLENIM_SINIR = 1200;

function depoAl(depo) {
  if (depo && typeof depo.getItem === 'function') return depo;
  try {
    if (typeof localStorage !== 'undefined') return localStorage;
  } catch (_) { /* erişim yok */ }
  return null;
}

/** Kayıtları okur (bozuk JSON → boş liste). */
export function izlenimOku(depo) {
  const d = depoAl(depo);
  if (!d) return [];
  try {
    const ham = d.getItem(IZLENIM_ANAHTAR);
    if (!ham) return [];
    const liste = JSON.parse(ham);
    if (!Array.isArray(liste)) return [];
    return liste.filter((k) => k && k.id != null && Number.isFinite(Number(k.ts)));
  } catch (_) {
    return [];
  }
}

function yaz(depo, liste) {
  const d = depoAl(depo);
  if (!d || typeof d.setItem !== 'function') return false;
  try {
    d.setItem(IZLENIM_ANAHTAR, JSON.stringify(liste.slice(-IZLENIM_SINIR)));
    return true;
  } catch (_) {
    return false;
  }
}

/**
 * Bir gösterimi kaydeder. Aynı içerik aynı gün iki kez sayılmaz (gürültü).
 * @param {object|null} depo
 * @param {{id:string|number, tip?:string, kaynak?:string, ts?:number}} olay
 * @returns {boolean}
 */
export function izlenimEkle(depo, olay) {
  if (!olay || olay.id == null) return false;
  const liste = izlenimOku(depo);
  const id = String(olay.id);
  const ts = Number.isFinite(Number(olay.ts)) ? Number(olay.ts) : Date.now();
  const gun = Math.floor(ts / 86400000);
  const varMi = liste.some((k) => String(k.id) === id && Math.floor(Number(k.ts) / 86400000) === gun);
  if (varMi) return false;
  liste.push({ id, tip: String(olay.tip || ''), kaynak: String(olay.kaynak || 'ana'), ts });
  return yaz(depo, liste);
}

/**
 * Gösterimi tıklamaya çevirir (aynı içeriğin en son gösterimi işaretlenir).
 * @returns {boolean}
 */
export function izlenimTikla(depo, id, ts = Date.now()) {
  if (id == null) return false;
  const liste = izlenimOku(depo);
  for (let i = liste.length - 1; i >= 0; i -= 1) {
    if (String(liste[i].id) === String(id)) {
      liste[i].tiklandi = true;
      liste[i].tikTs = Number(ts);
      return yaz(depo, liste);
    }
  }
  liste.push({ id: String(id), tip: '', kaynak: 'ana', ts: Number(ts), tiklandi: true, tikTs: Number(ts) });
  return yaz(depo, liste);
}

/** İzlenimleri temizler (veri yönetimi). */
export function izlenimTemizle(depo) {
  const d = depoAl(depo);
  if (!d || typeof d.removeItem !== 'function') return false;
  try {
    d.removeItem(IZLENIM_ANAHTAR);
    return true;
  } catch (_) {
    return false;
  }
}

/** Etiketli örnek üretimi: gösterim → tıklama. */
export function izlenimOrnekleri(izlenimler = []) {
  const out = [];
  for (const k of Array.isArray(izlenimler) ? izlenimler : []) {
    if (!k || k.id == null) continue;
    out.push({ id: String(k.id), y: k.tiklandi ? 1 : 0, kaynak: k.kaynak || 'ana', ts: Number(k.ts) || 0 });
  }
  return out;
}
