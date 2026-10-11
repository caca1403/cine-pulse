/* ==========================================================================
   MD5 + AES-256-CBC çözücü — saf JavaScript, harici bağımlılık YOK

   NEDEN VAR: Daha önce crypto-js kütüphanesi kullanılıyordu. CommonJS
   olduğu için geliştirme sürümünde şu hata oluyordu ve şifreli oynatıcı
   hiç çözülemiyordu:

     SyntaxError: The requested module '/src/vendor/crypto-js.min.cjs?import'
     does not provide an export named 'default'

   Kütüphaneyi kaldırıp ihtiyacımız olan iki algoritmayı yazdık. Böylece
   paketleyicinin CORS/ESM davranışına bağımlı olmuyoruz.

   DOĞRULAMA: Bu modülün çıktısı, aynı sayfanın crypto-js ile çözülmüş
   haliyle karakter karakter karşılaştırıldı (bkz. tests/encryptedPlayer.test.mjs).
   ========================================================================== */

/* ── MD5 ─────────────────────────────────────────────────────────────── */

const MD5_S = [
  7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
  5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
  4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
  6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21
];
// K = floor(abs(sin(i+1)) * 2^32)
const MD5_K = new Uint32Array(64);
for (let i = 0; i < 64; i++) MD5_K[i] = Math.floor(Math.abs(Math.sin(i + 1)) * 4294967296) >>> 0;

function md5(bayt) {
  const len = bayt.length;
  const bitLen = len * 8;
  // Dolgu: 0x80 + sıfır + 8 bayt uzunluk (LE)
  const dolgu = ((56 - (len + 1) % 64) + 64) % 64;
  const toplam = len + 1 + dolgu + 8;
  const m = new Uint8Array(toplam);
  m.set(bayt);
  m[len] = 0x80;
  const dv = new DataView(m.buffer);
  dv.setUint32(toplam - 8, bitLen >>> 0, true);
  dv.setUint32(toplam - 4, Math.floor(bitLen / 4294967296), true);

  let a0 = 0x67452301, b0 = 0xefcdab89, c0 = 0x98badcfe, d0 = 0x10325476;
  const M = new Uint32Array(16);

  for (let ofs = 0; ofs < toplam; ofs += 64) {
    for (let i = 0; i < 16; i++) M[i] = dv.getUint32(ofs + i * 4, true);
    let A = a0, B = b0, C = c0, D = d0;
    for (let i = 0; i < 64; i++) {
      let F, g;
      if (i < 16) { F = (B & C) | (~B & D); g = i; }
      else if (i < 32) { F = (D & B) | (~D & C); g = (5 * i + 1) % 16; }
      else if (i < 48) { F = B ^ C ^ D; g = (3 * i + 5) % 16; }
      else { F = C ^ (B | ~D); g = (7 * i) % 16; }
      F = (F + A + MD5_K[i] + M[g]) >>> 0;
      A = D; D = C; C = B;
      B = (B + ((F << MD5_S[i]) | (F >>> (32 - MD5_S[i])))) >>> 0;
    }
    a0 = (a0 + A) >>> 0; b0 = (b0 + B) >>> 0;
    c0 = (c0 + C) >>> 0; d0 = (d0 + D) >>> 0;
  }
  const out = new Uint8Array(16);
  const odv = new DataView(out.buffer);
  odv.setUint32(0, a0, true); odv.setUint32(4, b0, true);
  odv.setUint32(8, c0, true); odv.setUint32(12, d0, true);
  return out;
}

/* ── AES-256-CBC (çözme) ──────────────────────────────────────────────── */

const SBOX = new Uint8Array(256);
const RCON = new Uint8Array(11);
(function aesTablo()) {
  // S-box: çarpımsal ters + affine dönüşüm
  let p = 1, q = 1;
  do {
    p = p ^ (p << 1) & 0xff ^ (p & 0x80 ? 0x1b : 0);
    q ^= q << 1; q ^= q << 2; q ^= q << 4; q &= 0xff;
    if (q & 0x80) q ^= 0x09;
    const x = (q ^ ((q << 1) | (q >>> 7)) ^ ((q << 2) | (q >>> 6)) ^ ((q << 3) | (q >>> 5)) ^ ((q << 4) | (q >>> 4))) & 0xff ^ 0x63;
    SBOX[p] = x;
  } while (p !== 1);
  SBOX[0] = 0x63;
  let r = 1;
  for (let i = 1; i <= 10; i++) { RCON[i] = r; r = (r << 1) & 0xff ^ (r & 0x80 ? 0x11b : 0); }
})();

// Ters S-box (çözme için)
const INV_SBOX = new Uint8Array(256);
for (let i = 0; i < 256; i++) INV_SBOX[SBOX[i]] = i;

function xtime(a) { return ((a << 1) ^ (a & 0x80 ? 0x1b : 0)) & 0xff; }
function mul(a, b) {
  let r = 0;
  while (b) { if (b & 1) r ^= a; a = xtime(a); b >>= 1; }
  return r & 0xff;
}

function anahtarGenislet(anahtar) {
  const nk = anahtar.length / 4;          // 8 (256-bit) → 60 kelime
  const nr = nk + 6;
  const w = new Uint8Array(nr * 4);
  w.set(anahtar);
  let rcon = 1;
  for (let i = nk; i < nr; i++) {
    let t0 = w[(i - 1) * 4], t1 = w[(i - 1) * 4 + 1], t2 = w[(i - 1) * 4 + 2], t3 = w[(i - 1) * 4 + 3];
    if (i % nk === 0) {
      const tmp = t0; t0 = SBOX[t1] ^ rcon; t1 = SBOX[t2]; t2 = SBOX[t3]; t3 = SBOX[tmp];
      rcon = xtime(rcon);
    } else if (nk > 6 && i % nk === 4) {
      t0 = SBOX[t0]; t1 = SBOX[t1]; t2 = SBOX[t2]; t3 = SBOX[t3];
    }
    w[i * 4] = w[(i - nk) * 4] ^ t0;
    w[i * 4 + 1] = w[(i - nk) * 4 + 1] ^ t1;
    w[i * 4 + 2] = w[(i - nk) * 4 + 2] ^ t2;
    w[i * 4 + 3] = w[(i - nk) * 4 + 3] ^ t3;
  }
  return { w, nr };
}

/** AES-256-CBC çözme. @returns {Uint8Array} PKCS#7 dolgusu çözülmüş baytlar */
export function aesCbcCoz(sifreli, anahtar, iv) {
  const { w, nr } = anahtarGenislet(anahtar);
  const nk = anahtar.length / 4;
  const blk = 16;
  const out = new Uint8Array(sifreli.length - blk);
  let onceki = iv.slice();

  for (let ofs = 0; ofs < sifreli.length; ofs += blk) {
    const kaynak = new Uint8Array(16);
    for (let i = 0; i < 16; i++) kaynak[i] = sifreli[ofs + i] ^ onceki[i];

    // Ters sütun dönüşümleri
    const st = new Uint8Array(16);
    for (let c = 0; c < 4; c++) {
      for (let r = 0; r < 4; r++) st[c * 4 + r] = INV_SBOX[kaynak[c * 4 + r]];
    }
    // Satır kaydırma (InvShiftRows): satır r sola r
    for (let r = 1; r < 4; r++) {
      for (let c = 0; c < 4; c++) st[c * 4 + r] = st[((c + r) % 4) * 4 + r];
    }
    for (let c = 0; c < 4; c++) st[c * 4] = st[c * 4];
    // InvShiftRows doğru uygulandıktan sonra satırları ters çevir
    for (let r = 1; r < 4; r++) {
      const gecici = [st[r], st[4 + r], st[8 + r], st[12 + r]];
      for (let c = 1; c < 4; c++) st[c * 4 + r] = gecici[(c + r) % 4];
    }

    // InvSubColumns
    for (let i = 0; i < 16; i++) st[i] = INV_SBOX[st[i]];

    // AddRoundKey + ters turlar (rond anahtarları geriye doğru)
    for (let round = nr - 1; round >= 0; round--) {
      // Karıştır (InvMixColumns), son anahtar hariç
      if (round > 0) {
        for (let c = 0; c < 4; c++) {
          const a0 = st[c * 4], a1 = st[c * 4 + 1], a2 = st[c * 4 + 2], a3 = st[c * 4 + 3];
          st[c * 4]     = mul(a0, 14) ^ mul(a1, 11) ^ mul(a2, 13) ^ mul(a3, 9);
          st[c * 4 + 1] = mul(a0, 9)  ^ mul(a1, 14) ^ mul(a2, 11) ^ mul(a3, 13);
          st[c * 4 + 2] = mul(a0, 13) ^ mul(a1, 9)  ^ mul(a2, 14) ^ mul(a3, 11);
          st[c * 4 + 3] = mul(a0, 11) ^ mul(a1, 13) ^ mul(a2, 9)  ^ mul(a3, 14);
        }
      }
      // AddRoundKey
      for (let c = 0; c < 4; c++) {
        const k = (nr - round) * 4;
        for (let r = 0; r < 4; r++) st[c * 4 + r] ^= w[k + c * 4 + r];
      }
    }

    onceki = new Uint8Array(16);
    for (let i = 0; i < 16; i++) { out[ofs + i] = st[i]; onceki[i] = sifreli[ofs + i]; }
  }

  // PKCS#7 dolgusunu çöz
  const dolgu = out[out.length - 1];
  if (dolgu >= 1 && dolgu <= 16 && dolgu <= out.length) {
    let dogru = true;
    for (let i = out.length - dolgu; i < out.length; i++) if (out[i] !== dolgu) dogru = false;
    if (dogru) return out.slice(0, out.length - dolgu);
  }
  return out;
}

/**
 * CryptoJS.AES.decrypt(şifreliMetin, parola) ile BİREBİR aynı.
 *
 * CryptoJS'in OpenSSL biçimi: metin "Salted__" ile başlıyorsa ilk 8 bayt
 * tuz, kalanı şifreli veridir. Anahtar ve IV, EvpKDF ile türetilir:
 * MD5(tuz+parola) zinciri, 32 bayt anahtar + 16 bayt IV.
 *
 * @param {string} sifreliMetin latin1 (bayt=bayt) metin
 * @param {string} parola      latin1 parola
 * @returns {Uint8Array|null}
 */
export function cryptoJsAesCoz(sifreliMetin, parola) {
  try {
    const bayt = latin1Bayt(sifreliMetin);
    // "Salted__" başlığı (8 bayt) + tuz (8 bayt)
    if (bayt.length < 16 || !(bayt[0] === 0x53 && bayt[1] === 0x61 && bayt[2] === 0x6c && bayt[3] === 0x74)) return null;
    const tuz = bayt.slice(8, 16);
    const govde = bayt.slice(16);
    if (govde.length === 0 || govde.length % 16 !== 0) return null;

    const parolaBayt = latin1Bayt(parola);
    const turetilmis = evpKdf(parolaBayt, tuz, 48);
    return aesCbcCoz(govde, turetilmis.slice(0, 32), turetilmis.slice(32, 48));
  } catch (_) {
    return null;
  }
}

function latin1Bayt(s) {
  const d = String(s == null ? '' : s);
  const b = new Uint8Array(d.length);
  for (let i = 0; i < d.length; i++) b[i] = d.charCodeAt(i) & 0xff;
  return b;
}

/** CryptoJS EvpKDF: MD5 zinciri, istenen uzunluk kadar. */
function evpKdf(parola, tuz, uzunluk) {
  let turetilmis = new Uint8Array(0);
  let blok = new Uint8Array(0);
  for (let sayac = 1; turetilmis.length < uzunluk; sayac++) {
    const girdi = new Uint8Array(blok.length + parola.length);
    girdi.set(blok, 0);
    girdi.set(parola, blok.length);
    blok = md5(girdi);
    const yeni = new Uint8Array(turetilmis.length + blok.length);
    yeni.set(turetilmis, 0);
    yeni.set(blok, turetilmis.length);
    turetilmis = yeni;
    // Sonraki turlarda blok döndürülür (son kelime başa)
    if (turetilmis.length < uzunluk) {
      const dond = new Uint8Array(blok.length);
      dond[0] = blok[3]; dond[1] = blok[0]; dond[2] = blok[1]; dond[3] = blok[2];
      for (let i = 4; i < dond.length; i++) dond[i] = blok[i];
      blok = dond;
    }
  }
  return turetilmis.slice(0, uzunluk);
}

/** Standart base64 → bayt (latin1 tabanlı) */
export function base64Bayt(s) {
  const d = String(s || '');
  const temiz = d.replace(/[\r\n\t =]+/g, '');
  const out = new Uint8Array(Math.floor(temiz.length * 3 / 4));
  let o = 0, i = 0;
  const V = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  while (i < temiz.length) {
    const a = V.indexOf(temiz[i]), b = V.indexOf(temiz[i + 1]);
    const c = i + 2 < temiz.length ? V.indexOf(temiz[i + 2]) : -1;
    const d = i + 3 < temiz.length ? V.indexOf(temiz[i + 3]) : -1;
    if (a < 0 || b < 0) break;
    out[o++] = (a << 2) | (b >> 4);
    if (c >= 0) {
      out[o++] = ((b & 15) << 4) | (c >> 2);
      if (d >= 0) out[o++] = ((c & 3) << 6) | d;
    }
    i += 4;
  }
  return out.slice(0, o);
}