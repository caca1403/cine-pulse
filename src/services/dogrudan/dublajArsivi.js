/* ==========================================================================
   DUBLAJ ARŞİVİ — kanıt temelli arşiv çekirdeği (CLI + test ortak katmanı)
   --------------------------------------------------------------------------
   Kullanıcı kuralları (bağlayıcı):
     · Kanıt olmadan 'orijinal' YAZILMAZ: ağ hatası/404/timeout → 'bilinmiyor'.
     · Kayıtta gerçek site adı / hero kod adı / sağlayıcı adı ALAN OLARAK
       YOKTUR; yalnız hash'lenmiş host (kaynakKok) ve hash'lenmiş adres
       özeti (adresOzet) taşınır.
     · Dil kanıtı dublajKestirme okuyucularından gelir (YENİDEN KULLANILIR):
       m3u8SesDokumu (playlist) → baytSesDilleri/tsSesDilleri (segman baytı).
   Kanıt gücü sırası: m3u8/ts > mp4/mkv > etiket > yok.
   Durum sözleşmesi: 'dublaj' | 'altyazi' | 'orijinal' | 'bilinmiyor'.
   Ağ bağımlılığı yoktur: fetch enjekte edilir (fetchImpl), zaman aşımı
   varsayılan 8000 ms. Çalıştır: node --test tests/dublaj-arsivi.test.mjs
   ========================================================================== */
import {
  m3u8SesDokumu, baytSesDilleri, tsSesDilleri, m3u8Mi,
} from './dublajKestirme.js';

/* ── SHA-256 (senkron, bağımlılıksız — hostHashla senkron çağrılır) ───────── */
const SHA_K = new Uint32Array([
  0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1,
  0x923f82a4, 0xab1c5ed5, 0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3,
  0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174, 0xe49b69c1, 0xefbe4786,
  0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
  0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147,
  0x06ca6351, 0x14292967, 0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13,
  0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85, 0xa2bfe8a1, 0xa81a664b,
  0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
  0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a,
  0x5b9cca4f, 0x682e6ff3, 0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208,
  0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2,
]);
const rotr = (x, n) => ((x >>> n) | (x << (32 - n))) >>> 0;

function sha256Hex(metin) {
  const veri = new TextEncoder().encode(String(metin));
  const bit = veri.length * 8;
  const uz = Math.ceil((veri.length + 9) / 64) * 64;
  const t = new Uint8Array(uz);
  t.set(veri);
  t[veri.length] = 0x80;
  const dv = new DataView(t.buffer);
  dv.setUint32(uz - 8, Math.floor(bit / 4294967296), false);
  dv.setUint32(uz - 4, bit >>> 0, false);
  const h = [0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a,
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19];
  const w = new Uint32Array(64);
  for (let blok = 0; blok < uz; blok += 64) {
    for (let i = 0; i < 16; i++) w[i] = dv.getUint32(blok + i * 4, false);
    for (let i = 16; i < 64; i++) {
      const s0 = rotr(w[i - 15], 7) ^ rotr(w[i - 15], 18) ^ (w[i - 15] >>> 3);
      const s1 = rotr(w[i - 2], 17) ^ rotr(w[i - 2], 19) ^ (w[i - 2] >>> 10);
      w[i] = (w[i - 16] + s0 + w[i - 7] + s1) >>> 0;
    }
    let a = h[0], b = h[1], c = h[2], d = h[3];
    let e = h[4], f = h[5], g = h[6], hh = h[7];
    for (let i = 0; i < 64; i++) {
      const s1 = rotr(e, 6) ^ rotr(e, 11) ^ rotr(e, 25);
      const ch = (e & f) ^ (~e & g);
      const t1 = (hh + s1 + ch + SHA_K[i] + w[i]) >>> 0;
      const s0 = rotr(a, 2) ^ rotr(a, 13) ^ rotr(a, 22);
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const t2 = (s0 + maj) >>> 0;
      hh = g; g = f; f = e; e = (d + t1) >>> 0;
      d = c; c = b; b = a; a = (t1 + t2) >>> 0;
    }
    h[0] = (h[0] + a) >>> 0; h[1] = (h[1] + b) >>> 0;
    h[2] = (h[2] + c) >>> 0; h[3] = (h[3] + d) >>> 0;
    h[4] = (h[4] + e) >>> 0; h[5] = (h[5] + f) >>> 0;
    h[6] = (h[6] + g) >>> 0; h[7] = (h[7] + hh) >>> 0;
  }
  return h.map(x => x.toString(16).padStart(8, '0')).join('');
}

const HASH_ONEK = 'cp-v1|';

/** Host'u geri döndürülemez biçimde hash'ler (16+ hex karakter, deterministik). */
export function hostHashla(host) {
  return sha256Hex(HASH_ONEK + 'host|' + String(host ?? '').trim().toLowerCase()).slice(0, 32);
}

/** Adresi hash'ler; token/query ve fragment özete YAZILMAZ (özetsiz kimlik). */
function adresOzetle(adres) {
  const temiz = String(adres || '').split('#')[0].split('?')[0];
  return sha256Hex(HASH_ONEK + 'adres|' + temiz).slice(0, 32);
}

/* ── Kanıt gücü: m3u8/ts > mp4/mkv > etiket > yok ─────────────────────────── */
const KANIT_GUCU = { m3u8: 4, ts: 4, mp4: 3, mkv: 3, etiket: 1, yok: 0 };
/** 'orijinal' iddiasının yalnız yazılabileceği kanıt tipleri (medya okuması). */
const GUVENILIR_KANIT = new Set(['m3u8', 'ts', 'mp4', 'mkv']);
const GECERLI_DURUMLAR = new Set(['dublaj', 'altyazi', 'orijinal', 'bilinmiyor']);

/** Bir kaydın kanıt gücünü döndürür (bilinmeyen kanıt → 0). */
export function kanitGucu(kayit) {
  return KANIT_GUCU[String(kayit?.kanit || 'yok').toLowerCase()] ?? 0;
}

/** a'nın b'ye karşı kanıt üstünlüğü: >0 ise a güçlü, <0 ise b güçlü, 0 = eşit. */
export function dilDurumuKiyasla(a, b) {
  return kanitGucu(a) - kanitGucu(b);
}

function gucluOlan(mevcut, yeni) {
  return dilDurumuKiyasla(yeni, mevcut) > 0 ? yeni : mevcut;
}

/* ── Kayıt kuralları ───────────────────────────────────────────────────────── */

/** Girdiyi arşiv kaydına dönüştürür: host/adres hash'lenir, ham metin
    (domain/token/hero kod adı) kayıtta kalmaz; kanıtsız iddia düşürülür. */
function kayitKur(g) {
  const x = g || {};
  const diller = [...new Set((Array.isArray(x.diller) ? x.diller : [])
    .map(d => String(d || '').trim().toLowerCase())
    .filter(d => /^[a-z]{2}$/.test(d)))];
  let dilDurumu = String(x.dilDurumu || 'bilinmiyor').trim().toLowerCase();
  const kanit = String(x.kanit || 'yok').trim().toLowerCase();
  // KURAL: kanıt olmadan 'orijinal' yazılmaz (etiket tahmini de kanıt değildir).
  if (dilDurumu === 'orijinal' && !GUVENILIR_KANIT.has(kanit)) dilDurumu = 'bilinmiyor';
  // 'dublaj'/'altyazi' de kanıtsız dayanamaz: medya okuması yoksa bilinmiyor.
  if ((dilDurumu === 'dublaj' || dilDurumu === 'altyazi') && kanit === 'yok') dilDurumu = 'bilinmiyor';
  if (!GECERLI_DURUMLAR.has(dilDurumu)) dilDurumu = 'bilinmiyor';
  return {
    tmdbTip: String(x.tmdbTip || ''),
    tmdbId: String(x.tmdbId ?? ''),
    sezon: x.sezon ?? null,
    bolum: x.bolum ?? null,
    dilDurumu,
    kanit,
    diller,
    kaynakKok: x.kaynakKok || hostHashla(x.host || ''),
    adresOzet: x.adresOzet || adresOzetle(x.adres || ''),
  };
}

/** Kayıt anahtarı: tür|id|sezon|bolum|hostHash|adresOzet (ham metin yok). */
export function girisAnahtari(kayit) {
  const k = kayit || {};
  const kok = k.kaynakKok || hostHashla(k.host || '');
  const ozet = k.adresOzet || adresOzetle(k.adres || '');
  return `${k.tmdbTip || ''}|${k.tmdbId ?? ''}|${k.sezon ?? ''}|${k.bolum ?? ''}|${kok}|${ozet}`;
}

/** Kanıtı doğrular ve kaydı Map'e (depo) anahtarında saklar; üstün kanıt
    korunur. Dönen değer: depoda nihai duran kayıttır. */
export function kanitKaydet(depo, giris) {
  const kayit = kayitKur(giris);
  const anahtar = girisAnahtari(kayit);
  const mevcut = depo.get(anahtar);
  const sonuc = mevcut ? gucluOlan(mevcut, kayit) : kayit;
  depo.set(anahtar, sonuc);
  return sonuc;
}

/** Kaydı arşive (arsiv.kayitlar) ekler; aynı anahtar tek kayıtta birleşir. */
export function arsivEkle(arsiv, giris) {
  if (!arsiv || !Array.isArray(arsiv.kayitlar)) throw new Error('arsiv-kayitlar-yok');
  const kayit = kayitKur(giris);
  const anahtar = girisAnahtari(kayit);
  const i = arsiv.kayitlar.findIndex(k => girisAnahtari(k) === anahtar);
  if (i >= 0) {
    const sonuc = gucluOlan(arsiv.kayitlar[i], kayit);
    arsiv.kayitlar[i] = sonuc;
    return sonuc;
  }
  arsiv.kayitlar.push(kayit);
  return kayit;
}

/** İki arşivi birleştirir (sıra bağımsız): aynı anahtarda üstün kanıt kazanır. */
export function arsivBirlestir(a, b) {
  const kayitlar = [];
  const harita = new Map();
  for (const ham of [...(a?.kayitlar || []), ...(b?.kayitlar || [])]) {
    const kayit = kayitKur(ham);
    const anahtar = girisAnahtari(kayit);
    const mevcut = harita.get(anahtar);
    harita.set(anahtar, mevcut ? gucluOlan(mevcut, kayit) : kayit);
  }
  for (const kayit of harita.values()) kayitlar.push(kayit);
  return { ...(a || {}), kayitlar };
}

/** Arşiv özet sayaçları: toplam/tr sesli + tür, sezon, durum, dil kırılımı. */
export function arsOzeti(arsiv) {
  const kayitlar = Array.isArray(arsiv?.kayitlar) ? arsiv.kayitlar : [];
  const ozet = {
    toplamKayit: 0,
    trSesliKayit: 0,
    turler: {},
    sezonlar: {},
    durumlar: {},
    diller: {},
  };
  for (const k of kayitlar) {
    ozet.toplamKayit += 1;
    const diller = Array.isArray(k.diller) ? k.diller : [];
    if (diller.includes('tr')) ozet.trSesliKayit += 1;
    const tip = String(k.tmdbTip || 'bilinmiyor');
    ozet.turler[tip] = (ozet.turler[tip] || 0) + 1;
    if (k.sezon != null) {
      const s = String(k.sezon);
      ozet.sezonlar[s] = (ozet.sezonlar[s] || 0) + 1;
    }
    const durum = String(k.dilDurumu || 'bilinmiyor');
    ozet.durumlar[durum] = (ozet.durumlar[durum] || 0) + 1;
    for (const d of diller) ozet.diller[d] = (ozet.diller[d] || 0) + 1;
  }
  return ozet;
}

/* ── Akışkan dil kanıtı (ağ) ───────────────────────────────────────────────── */
const BOS_KANIT = () => ({ dilDurumu: 'bilinmiyor', kanit: 'yok', diller: [] });

function dilKarari(diller, kanit, trAltyaziMi) {
  const d = [...new Set((Array.isArray(diller) ? diller : [])
    .map(x => String(x || '').trim().toLowerCase())
    .filter(x => /^[a-z]{2}$/.test(x)))];
  if (d.includes('tr')) return { dilDurumu: 'dublaj', kanit, diller: d };
  if (trAltyaziMi) return { dilDurumu: 'altyazi', kanit, diller: d.length ? d : ['altyazi'] };
  if (d.length) return { dilDurumu: 'orijinal', kanit, diller: d };
  return BOS_KANIT();
}

/** Bayttan kapsayıcı kanıt tipi (kanit alanı): ts | mp4 | mkv. */
function kapTani(b) {
  if (!b || b.length < 8) return 'ts';
  if (b[0] === 0x47) return 'ts';
  const d4 = String.fromCharCode(b[4], b[5], b[6], b[7]);
  if (d4 === 'ftyp' || d4 === 'moov' || d4 === 'styp') return 'mp4';
  if (b[0] === 0x1a && b[1] === 0x45 && b[2] === 0xdf && b[3] === 0xa3) return 'mkv';
  return 'ts';
}

/** Bayttan ses dilleri: önce kapsayıcı okuyucu, sonra TS senkron kayması. */
function bayttanDiller(buf) {
  let kodlar = baytSesDilleri(buf);
  if ((!kodlar || !kodlar.size) && buf.length > 2048) {
    for (let o = 0; o < 188 * 12 && o + 376 <= buf.length; o++) {
      if (buf[o] === 0x47 && buf[o + 188] === 0x47) {
        kodlar = tsSesDilleri(buf.subarray(o));
        if (kodlar && kodlar.size) break;
      }
    }
  }
  return kodlar && kodlar.size ? kodlar : null;
}

/** Master'da dil bildirimi yoksa: varyant medya playlist'ine inip ilk
    segmanın ilk 64 KB'ını indirir. {buf} ya da null. */
async function ilkSegmenttenBayt(masterAdres, masterMetin, fetchImpl, ms) {
  const satirlar = String(masterMetin || '').split(/\r?\n/).map(s => s.trim()).filter(Boolean);
  const varyant = satirlar.find(s => !s.startsWith('#'));
  let taban = masterAdres;
  let metin = String(masterMetin || '');
  if (varyant) {
    let hedef;
    try { hedef = new URL(varyant, masterAdres).toString(); } catch (_) { return null; }
    const y = await fetchImpl(hedef, { signal: AbortSignal.timeout(ms) });
    if (!y || !y.ok) return null;
    metin = await y.text();
    if (!/#EXTM3U/i.test(metin)) return null;
    taban = hedef;
  }
  const init = metin.match(/#EXT-X-MAP:URI="([^"]+)"/);
  const ilkSeg = metin.split(/\r?\n/).map(s => s.trim()).find(s => s && !s.startsWith('#'));
  const aday = (init && init[1]) || ilkSeg;
  if (!aday) return null;
  let segAdres;
  try { segAdres = new URL(aday, taban).toString(); } catch (_) { return null; }
  const y2 = await fetchImpl(segAdres, {
    signal: AbortSignal.timeout(ms),
    headers: { Range: 'bytes=0-65535' },
  });
  if (!y2 || !y2.ok) return null;
  const buf = new Uint8Array(await y2.arrayBuffer());
  return buf.length ? { buf } : null;
}

/** Playlist metnini değerlendir: bildirim varsa m3u8 kanıtı, yoksa segman baytı. */
async function playlistKaniti(adres, metin, fetchImpl, ms) {
  const dokum = m3u8SesDokumu(metin);
  if (dokum.kanitlanabilir) return dilKarari(dokum.diller, 'm3u8', dokum.trAltyaziMi);
  const seg = await ilkSegmenttenBayt(adres, metin, fetchImpl, ms);
  if (!seg) return BOS_KANIT();
  const kodlar = bayttanDiller(seg.buf);
  if (!kodlar) return BOS_KANIT();
  return dilKarari([...kodlar], kapTani(seg.buf), false);
}

/** Akışın dil durumunu OKUYARAK kanıt toplar.
    - m3u8 adresi: playlist → (yoksa) ilk segmanın ilk 64 KB'ı.
    - Diğer adres: ilk 64 KB bayt → kapsayıcı okuyucu; değilse metin dener.
    Ağ hatası / 404 / timeout / HTML embed → { bilinmiyor, yok } (asla orijinal). */
export async function akisanDilKaniti(adres, opts = {}) {
  const ms = Number.isFinite(opts.ms) && opts.ms > 0 ? opts.ms : 8000;
  const fetchImpl = typeof opts.fetchImpl === 'function'
    ? opts.fetchImpl
    : (u, o) => globalThis.fetch(u, o);
  try {
    const a = String(adres || '').trim();
    if (!a) return BOS_KANIT();
    if (m3u8Mi(a)) {
      const y = await fetchImpl(a, { signal: AbortSignal.timeout(ms) });
      if (!y || !y.ok) return BOS_KANIT();
      const metin = await y.text();
      if (!/#EXTM3U|#EXT-X-|#EXTINF/i.test(metin)) return BOS_KANIT();
      return playlistKaniti(a, metin, fetchImpl, ms);
    }
    const y = await fetchImpl(a, {
      signal: AbortSignal.timeout(ms),
      headers: { Range: 'bytes=0-65535' },
    });
    if (!y || !y.ok) return BOS_KANIT();
    const buf = new Uint8Array(await y.arrayBuffer());
    const kodlar = bayttanDiller(buf);
    if (kodlar) return dilKarari([...kodlar], kapTani(buf), false);
    // Uzantısız ama aslında playlist olan adresler (metin olarak dene).
    const metin = new TextDecoder().decode(buf);
    if (/#EXTM3U|#EXT-X-|#EXTINF/i.test(metin)) return playlistKaniti(a, metin, fetchImpl, ms);
    return BOS_KANIT();
  } catch (_) {
    return BOS_KANIT(); // ağ hatası/timeout: kanıt yok → asla 'orijinal'
  }
}
