/* ==========================================================================
   CinePulse Studio — Nuvio motoru CryptoJS altkümesi (kullanıcı 2026-10-29)
   Nuvio provider bundle'ları require("crypto-js") kullanıyor. Nuvio'nun kendi
   host köprüsü (CryptoBridge.kt) AES-CBC/PKCS7 + WordArray API'sini QuickJS'e
   enjekte ediyor; biz aynı API'nin SAF-JS altkümesini üretiyoruz: AES
   encrypt/decrypt (CBC + Pkcs7), WordArray, enc.Hex/Base64/Utf8/Latin1.
   SubtleCrypto asenkron olduğundan crypto-js'nin SENKRON sözleşmesini
   karşılayamaz → saf AES bloğu şarttı (Nuvio da QuickJS'e native köprüyle
   senkron sözdizimi sunuyordu). MD5/SHA/HMAC/PBKDF2 isteyen provider olursa
   net hata verir; depo taramasında hiçbir patr0n provider'ı onları çağırmıyor.
   Doğrulama: tests/nuvioMotoru.test.mjs — çıktıları Node crypto ile kıyaslanır.
   Güvenlik notu: üçüncü taraf kod bu nesneyi yalnız sandbox içinde görür.
   ========================================================================== */

/* ── AES tabloları ──────────────────────────────────────────────────────── */
const SBOX = new Uint8Array(256);
const INV_SBOX = new Uint8Array(256);
{
  // GF(2^8) tersleri: üreteç 3 PRİTİFTİR (tam 255 döngü üretir; ×2'nin mertebesi
  // 51'dir — ilk sürümde tablo bu yüzden eksikti ve S-box yanlış çıktı).
  const exp = new Uint8Array(512), log = new Uint8Array(256);
  let x = 1;
  for (let i = 0; i < 255; i++) {
    exp[i] = x; log[x] = i;
    const hi = x & 0x80; x = (x << 1) & 0xff; if (hi) x ^= 0x1b; // ×2
    x ^= exp[i];                                                  // +x  → ×3
  }
  for (let i = 255; i < 512; i++) exp[i] = exp[i - 255];
  for (let i = 0; i < 256; i++) {
    // ters(i) (0 → 0) + afin dönüşüm: SBOX[i] = Inv(i) ^ rotl(Inv,1..4) ^ 0x63
    const inv = i === 0 ? 0 : exp[255 - log[i]];
    let s = inv;
    let r = inv;
    for (let k = 0; k < 4; k++) { r = ((r << 1) | (r >>> 7)) & 0xff; s ^= r; }
    s ^= 0x63;
    SBOX[i] = s & 0xff;
  }
  for (let i = 0; i < 256; i++) INV_SBOX[SBOX[i]] = i;
}
const MUL = { 2: [], 9: [], 11: [], 13: [], 14: [] };
{
  const mul = (a, b) => { let r = 0; while (b) { if (b & 1) r ^= a; const hi = a & 0x80; a = (a << 1) & 0xff; if (hi) a ^= 0x1b; b >>>= 1; } return r; };
  for (const k of Object.keys(MUL)) for (let i = 0; i < 256; i++) MUL[k][i] = mul(i, Number(k));
}

function keyExpansion(keyBytes) {
  const Nk = keyBytes.length / 4, Nr = Nk + 6;
  const w = new Uint32Array(4 * (Nr + 1));
  for (let i = 0; i < Nk; i++) w[i] = (keyBytes[4 * i] << 24 | keyBytes[4 * i + 1] << 16 | keyBytes[4 * i + 2] << 8 | keyBytes[4 * i + 3]) >>> 0;
  const rcon = [0x01, 0x02, 0x04, 0x08, 0x10, 0x20, 0x40, 0x80, 0x1b, 0x36, 0x6c, 0xd8, 0xab, 0x4d];
  const subWord = (t) => (SBOX[t >>> 24] << 24 | SBOX[(t >>> 16) & 0xff] << 16 | SBOX[(t >>> 8) & 0xff] << 8 | SBOX[t & 0xff]) >>> 0;
  for (let i = Nk; i < 4 * (Nr + 1); i++) {
    let t = w[i - 1];
    if (i % Nk === 0) t = (subWord(((t << 8) | (t >>> 24)) >>> 0) ^ (rcon[i / Nk - 1] << 24)) >>> 0;
    else if (Nk > 6 && i % Nk === 4) t = subWord(t);
    w[i] = (w[i - Nk] ^ t) >>> 0;
  }
  const rk = [];
  for (let r = 0; r <= Nr; r++) {
    const block = new Uint8Array(16);
    for (let c = 0; c < 4; c++) {
      const word = w[r * 4 + c];
      block[c * 4] = word >>> 24; block[c * 4 + 1] = (word >>> 16) & 0xff; block[c * 4 + 2] = (word >>> 8) & 0xff; block[c * 4 + 3] = word & 0xff;
    }
    rk.push(block);
  }
  return { rk, Nr };
}

// state: byte[16], sütun-major (state[r + 4c] = bayt) — FIPS-197 sırası.
function cryptBlock(state, rk, Nr, inverse) {
  const addKey = (r) => { for (let i = 0; i < 16; i++) state[i] ^= rk[r][i]; };
  const sub = (table) => { for (let i = 0; i < 16; i++) state[i] = table[state[i]]; };
  // Kaydırmayı SATIR-GRİD üzerinden yap: grid[r][c] = state[r + 4c] — karışıklık payı yok.
  const shiftRowsOp = (inv) => {
    const grid = [[], [], [], []];
    for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) grid[r][c] = state[r + 4 * c];
    for (let r = 1; r < 4; r++) {
      const s = inv ? (4 - r) : r;            // şifreleme: soldan r; şifreçözme: sağdan r
      const row = grid[r];
      grid[r] = row.slice(s).concat(row.slice(0, s)); // soldan s kaydırma
    }
    for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) state[r + 4 * c] = grid[r][c];
  };
  const mix = (inv) => {
    for (let c = 0; c < 4; c++) {
      const i = c * 4, a0 = state[i], a1 = state[i + 1], a2 = state[i + 2], a3 = state[i + 3];
      if (!inv) {
        state[i]     = MUL[2][a0] ^ MUL[2][a1] ^ a1 ^ a2 ^ a3; // 2a0+3a1+a2+a3
        state[i + 1] = a0 ^ MUL[2][a1] ^ MUL[2][a2] ^ a2 ^ a3; // a0+2a1+3a2+a3
        state[i + 2] = a0 ^ a1 ^ MUL[2][a2] ^ MUL[2][a3] ^ a3; // a0+a1+2a2+3a3
        state[i + 3] = MUL[2][a0] ^ a0 ^ a1 ^ a2 ^ MUL[2][a3]; // 3a0+a1+a2+2a3
      } else {
        state[i]     = MUL[14][a0] ^ MUL[11][a1] ^ MUL[13][a2] ^ MUL[9][a3];
        state[i + 1] = MUL[9][a0] ^ MUL[14][a1] ^ MUL[11][a2] ^ MUL[13][a3];
        state[i + 2] = MUL[13][a0] ^ MUL[9][a1] ^ MUL[14][a2] ^ MUL[11][a3];
        state[i + 3] = MUL[11][a0] ^ MUL[13][a1] ^ MUL[9][a2] ^ MUL[14][a3];
      }
    }
  };
  if (!inverse) {
    addKey(0);
    for (let r = 1; r < Nr; r++) { sub(SBOX); shiftRowsOp(false); mix(false); addKey(r); }
    sub(SBOX); shiftRowsOp(false); addKey(Nr);
  } else {
    addKey(Nr);
    for (let r = Nr - 1; r > 0; r--) { shiftRowsOp(true); sub(INV_SBOX); addKey(r); mix(true); }
    shiftRowsOp(true); sub(INV_SBOX); addKey(0);
  }
}

/* ── WordArray (crypto-js 32-bit big-endian words sözleşmesi) ───────────── */
function bytesToWords(bytes) {
  const words = [];
  for (let i = 0; i < bytes.length; i++) words[i >>> 2] |= bytes[i] << ((3 - (i & 3)) * 8);
  return words;
}
class WordArray {
  constructor(words = [], sigBytes = words.length * 4) { this.words = words; this.sigBytes = sigBytes; }
  static create(words, sigBytes) { return new WordArray(words ? Array.from(words) : [], sigBytes); }
  clone() { return new WordArray(this.words.slice(), this.sigBytes); }
  toBytes() {
    const b = new Uint8Array(this.sigBytes);
    for (let i = 0; i < this.sigBytes; i++) b[i] = (this.words[i >>> 2] >>> ((3 - (i & 3)) * 8)) & 0xff;
    return b;
  }
  toString(enc) { return (enc || Enc.Hex).stringify(this); }
}

const Enc = {
  Hex: {
    parse(hex) {
      const clean = String(hex).replace(/[^0-9a-f]/gi, '');
      const b = new Uint8Array(clean.length >>> 1);
      for (let i = 0; i < b.length; i++) b[i] = parseInt(clean.substr(i * 2, 2), 16);
      return new WordArray(bytesToWords(b), b.length);
    },
    stringify(wa) { let s = ''; for (const x of wa.toBytes()) s += x.toString(16).padStart(2, '0'); return s; },
  },
  Base64: {
    parse(b64) {
      const s = String(b64).replace(/\s+/g, '');
      const bin = typeof globalThis.atob === 'function' ? globalThis.atob(s) : Buffer.from(s, 'base64').toString('binary');
      const b = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) b[i] = bin.charCodeAt(i);
      return new WordArray(bytesToWords(b), b.length);
    },
    stringify(wa) {
      let bin = '';
      for (const x of wa.toBytes()) bin += String.fromCharCode(x);
      return typeof globalThis.btoa === 'function' ? globalThis.btoa(bin) : Buffer.from(bin, 'binary').toString('base64');
    },
  },
  Utf8: {
    parse(str) { const b = new TextEncoder().encode(String(str)); return new WordArray(bytesToWords(b), b.length); },
    stringify(wa) {
      try { return new TextDecoder('utf-8', { fatal: true }).decode(wa.toBytes()); }
      catch (_) { return new TextDecoder('utf-8').decode(wa.toBytes()); }
    },
  },
  Latin1: {
    parse(str) {
      const s = String(str), b = new Uint8Array(s.length);
      for (let i = 0; i < s.length; i++) b[i] = s.charCodeAt(i) & 0xff;
      return new WordArray(bytesToWords(b), b.length);
    },
    stringify(wa) { let s = ''; for (const x of wa.toBytes()) s += String.fromCharCode(x); return s; },
  },
};

function aesRun(dataBytes, keyBytes, ivBytes, decrypt) {
  if (![16, 24, 32].includes(keyBytes.length)) throw new Error('crypto-js-shim: geçersiz AES anahtarı (' + keyBytes.length + ' byte)');
  if (dataBytes.length % 16 !== 0) throw new Error('crypto-js-shim: veri blok hizasında değil (' + dataBytes.length + ')');
  const { rk, Nr } = keyExpansion(keyBytes);
  const out = new Uint8Array(dataBytes.length);
  const prev = new Uint8Array(16);
  if (ivBytes) prev.set(ivBytes.subarray(0, 16));
  const block = new Uint8Array(16);
  for (let off = 0; off < dataBytes.length; off += 16) {
    if (!decrypt) { for (let i = 0; i < 16; i++) block[i] = dataBytes[off + i] ^ prev[i]; }
    else block.set(dataBytes.subarray(off, off + 16));
    const state = new Uint8Array(block);
    cryptBlock(state, rk, Nr, decrypt);
    if (decrypt) { for (let i = 0; i < 16; i++) { out[off + i] = state[i] ^ prev[i]; prev[i] = block[i]; } }
    else { out.set(state, off); prev.set(state); }
  }
  return out;
}

const asWA = (x) => {
  if (x instanceof WordArray) return x;
  if (x && Array.isArray(x.words)) return new WordArray(x.words.slice(), x.sigBytes);
  if (typeof x === 'string') throw new Error('crypto-js-shim: passphrase (string anahtar) desteklenmiyor — WordArray/enc ver');
  if (x instanceof Uint8Array) return new WordArray(bytesToWords(x), x.length);
  if (x && typeof x === 'object' && x.ciphertext) return asWA(x.ciphertext);
  throw new Error('crypto-js-shim: WordArray beklenendi');
};

const AES = {
  encrypt(msg, key, cfg = {}) {
    const data = asWA(msg).toBytes();
    const pad = 16 - (data.length % 16);
    const padded = new Uint8Array(data.length + pad);
    padded.set(data); padded.fill(pad, data.length);
    const ct = aesRun(padded, asWA(key).toBytes(), cfg.iv ? asWA(cfg.iv).toBytes() : null, false);
    return { ciphertext: new WordArray(bytesToWords(ct), ct.length) };
  },
  decrypt(cipherParams, key, cfg = {}) {
    const ct = asWA(cipherParams && cipherParams.ciphertext !== undefined ? cipherParams.ciphertext : cipherParams).toBytes();
    const plain = aesRun(ct, asWA(key).toBytes(), cfg.iv ? asWA(cfg.iv).toBytes() : null, true);
    const pad = plain[plain.length - 1];
    if (!plain.length || pad < 1 || pad > 16 || pad > plain.length) throw new Error('crypto-js-shim: Pkcs7 dolgusu bozuk (anahtar/IV yanlış olabilir)');
    const body = plain.subarray(0, plain.length - pad);
    return new WordArray(bytesToWords(body), body.length);
  },
};

const shim = {
  lib: { WordArray: { create: (w, s) => WordArray.create(w, s) } },
  enc: Enc,
  Hex: Enc.Hex, Base64: Enc.Base64, Utf8: Enc.Utf8, Latin1: Enc.Latin1,
  AES,
  mode: { CBC: { name: 'cbc' }, ECB: { name: 'ecb' } },
  pad: { Pkcs7: { name: 'pkcs7' }, NoPadding: { name: 'none' } },
};

/* Çağrılırsa sessiz yanlış sonuç üretmek yerine net hata ver. */
for (const name of ['MD5', 'SHA1', 'SHA256', 'SHA384', 'SHA512', 'RIPEMD160', 'HmacMD5', 'HmacSHA1', 'HmacSHA256', 'HmacSHA512', 'PBKDF2', 'EvpKDF', 'DES', 'TripleDES', 'RC4', 'Rabbit']) {
  shim[name] = () => { throw new Error('nuvioMotoru: crypto-js "' + name + '" altkümede yok (AES-CBC/Pkcs7 var) — provider rapora yazılmalı'); };
}
shim.algorist = shim;
shim.default = shim; // esbuild __toESM interop: require('crypto-js').default

export default shim;
export { shim as CryptoJS, WordArray, Enc };
