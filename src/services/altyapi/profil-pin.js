/* ==========================================================================
   Profil PIN & Yaş Kademesi — saf çekirdek (DOM/depo bağımsız)
   Bu bir YEREL EŞİKtir, kriptografik koruma DEĞİLDİR: PIN hash'i aynı
   cihazdaki localStorage'da durur. UI bu çerçeveyi açıkça yazmalı.
   ========================================================================== */

export const PIN_HATA_ESIGI = 3;
export const PIN_KILIT_MS = 30000;
export const YAS_KADEMELERI = ['cocuk', 'genclik', 'yetiskin'];

// PIN girdisini sadeleştirir: boşlukları atar, yalnız hane bırakır.
export function pinNormalize(pin) {
  return String(pin ?? '').replace(/\s+/g, '');
}

export function pinGecerliMi(pin) {
  return /^\d{4,6}$/.test(pinNormalize(pin));
}

export function yasKademesiGecerliMi(kademe) {
  return YAS_KADEMELERI.includes(kademe);
}

// Eski profillerde yasKademesi alanı YOKTUR: mevcut davranış korunur
// (isKid=true → 'cocuk' yani bugünün kid-safe filtresi; diğer → 'yetiskin').
export function varsayilanYasKademesi(isKid) {
  return isKid === true ? 'cocuk' : 'yetiskin';
}

export function pinAktifMi() {
  return typeof globalThis.crypto?.subtle?.digest === 'function';
}

// SHA-256 hex. crypto.subtle YOKSA null döner — uydurma hash asla üretilmez.
export async function pinHashla(pin) {
  const temiz = pinNormalize(pin);
  if (!pinGecerliMi(temiz) || !pinAktifMi()) return null;
  const veri = new TextEncoder().encode(temiz);
  const tampon = await globalThis.crypto.subtle.digest('SHA-256', veri);
  return Array.from(new Uint8Array(tampon)).map(b => b.toString(16).padStart(2, '0')).join('');
}

// 3 hatadan sonra 30 sn kilit — saf hesap; sayaç depoya YAZILMAZ.
export function pinKilitDurumu(hataSayisi, kilitBaslamaMs, simdiMs) {
  if (hataSayisi < PIN_HATA_ESIGI || !kilitBaslamaMs) return { kilitli: false, kalanMs: 0 };
  const kalanMs = kilitBaslamaMs + PIN_KILIT_MS - simdiMs;
  return kalanMs > 0 ? { kilitli: true, kalanMs } : { kilitli: false, kalanMs: 0 };
}
