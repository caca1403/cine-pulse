/* ==========================================================================
   DUBLAJ KESTİRME — satırın dil durumunu ETİKETTEN DEĞİL, akışın kendinden
   okur (kullanıcı 2026-10-29: "doğrulanan olmayan olmayacak — veriyi baktı,
   dublaj yok mu, altyazıya da mı yok? ancak o zaman ORİJİNAL yazar").

   Okuma katmanları (birinden dil çıkana kadar iner):
     1) HLS master playlist  → #EXT-X-MEDIA TYPE=AUDIO/SUBTITLES LANGUAGE/NAME
     2) Master'da bildirim yok (ses MUX'TUR) → ilk varyant/segman indirilir:
        · MPEG-TS 0x47...  → PAT/PMT akrep + dil tanımlayıcısı (0x0A, ISO-639-2)
        · fMP4/MP4 (ftyp/moov) → moov>trak>mdia>mdhd paketlenmiş dil + hdlr
                                 + udta>nam ("Turkish" gibi ad da sayılır)
        · Matroska/MKV (EBML) → Tracks>TrackEntry TrackType=2 + Language
     3) Hiçbirinden dil çıkmazsa → satır DOĞRULANAMAZ; hiçbir rozet basılmaz.
   Durum sözleşmesi (dilDurumu): 'dublaj' | 'altyazi' | 'orijinal' | (yok).
   ORİJİNAL yalnız kanıtla yazılır: dil listesi okundu ve içinde tr YOK.
   Ağ geçmez: tüm okumalar kopruFetch (CORS) + imzasız-adres önbelleği.
   ========================================================================== */

const DIL_HARITA = {
  tur: 'tr', tr: 'tr', deu: 'de', ger: 'de', de: 'de', eng: 'en', en: 'en',
  fra: 'fr', fre: 'fr', fr: 'fr', spa: 'es', esp: 'es', es: 'es', ita: 'it',
  it: 'it', rus: 'ru', ru: 'ru', ara: 'ar', arb: 'ar', ar: 'ar', hin: 'hi',
  hi: 'hi', jpn: 'ja', ja: 'ja', kor: 'ko', ko: 'ko', chi: 'zh', zho: 'zh',
  zh: 'zh', por: 'pt', pt: 'pt', nld: 'nl', dut: 'nl', nl: 'nl', pol: 'pl',
  pl: 'pl', ukr: 'uk', uk: 'uk', ces: 'cs', cze: 'cs', cs: 'cs', ell: 'el',
  gre: 'el', el: 'el', swe: 'sv', sv: 'sv', nor: 'no', da: 'da', dan: 'da',
  fin: 'fi', fi: 'fi', ind: 'id', id: 'id', tha: 'th', th: 'th',
  vie: 'vi', vi: 'vi', pes: 'fa', fa: 'fa', heb: 'he', he: 'he', urd: 'ur',
  ur: 'ur', ben: 'bn', bn: 'bn', tam: 'ta', ta: 'ta', tel: 'te', te: 'te',
  bul: 'bg', bg: 'bg', rum: 'ro', ro: 'ro', aze: 'az', az: 'az', fas: 'fa',
  turkish: 'tr', türkçe: 'tr', turkce: 'tr', german: 'de', deutsch: 'de',
  english: 'en', french: 'fr', francais: 'fr', spanish: 'es', italiano: 'it',
  russian: 'ru', arabic: 'ar', hindi: 'hi', japanese: 'ja', korean: 'ko',
  chinese: 'zh', portuguese: 'pt', dutch: 'nl', polish: 'pl', ukranian: 'uk',
  ukrainian: 'uk', indonesian: 'id', vietnamese: 'vi', thai: 'th',
};

/** LANGUAGE/NAME/track-adı ham değerini ISO-639-1'e indirger; bilmiyorsa null. */
export function dilKodla(ham) {
  const t = String(ham || '').trim().toLowerCase().replace(/["']/g, '');
  if (!t) return null;
  const kisa = t.split(/[-_]/)[0];
  if (DIL_HARITA[t]) return DIL_HARITA[t];
  if (DIL_HARITA[kisa]) return DIL_HARITA[kisa];
  return /^[a-z]{2}$/.test(kisa) ? kisa : null;
}

/* ── Katman 1: HLS master playlist ──────────────────────────────────────── */
export function m3u8SesDokumu(metin) {
  const ses = new Set();
  const altyazi = new Set();
  for (const ham of String(metin || '').split(/\r?\n/)) {
    const satir = ham.trim();
    if (!satir.startsWith('#EXT-X-MEDIA:')) continue;
    const tip = (satir.match(/TYPE=([A-Z]+)/) || [])[1];
    if (tip !== 'AUDIO' && tip !== 'SUBTITLES') continue;
    const lang = (satir.match(/LANGUAGE="([^"]*)"/) || satir.match(/LANGUAGE=([^,]+)/) || [])[1];
    const name = (satir.match(/NAME="([^"]*)"/) || satir.match(/NAME=([^,]+)/) || [])[1];
    const kod = dilKodla(lang) || dilKodla(name);
    if (!kod || kod === 'und') continue;
    (tip === 'AUDIO' ? ses : altyazi).add(kod);
  }
  const uriDil = String(metin || '').match(/[/=](?:lang|audio|langid)[-/=]([a-z]{2,3})\b/i);
  if (uriDil) { const kod = dilKodla(uriDil[1]); if (kod) ses.add(kod); }
  return {
    diller: [...ses],
    trMi: ses.has('tr'),
    trAltyaziMi: altyazi.has('tr'),
    cokluMu: ses.size > 1,
    kanitlanabilir: ses.size > 0 || altyazi.size > 0,
  };
}

/* ── Katman 2a: MPEG-TS PAT/PMT dili (muxed HLS/TS segmanları) ───────────── */
const TS_AUDIO_TIPLERI = new Set([0x03, 0x04, 0x06, 0x0F, 0x81, 0x83, 0x84, 0x87, 0x90, 0x91, 0x92, 0xA1, 0xAC, 0xD1]);
function u8(b) { return b instanceof Uint8Array ? b : new Uint8Array(b); }

/** TS baytlarından PAT→PMT→ES dil tanımlayıcılarını okur. Kod Set'i döner. */
export function tsSesDilleri(baytlar) {
  const b = u8(baytlar);
  const kodlar = new Set();
  let senkron = -1;
  for (let i = 0; i < 188 && i + 188 <= b.length; i++) if (b[i] === 0x47) { senkron = i; break; }
  if (senkron < 0) return kodlar;
  const pmtPidler = new Set();
  for (let i = senkron; i + 188 <= b.length; i += 188) {
    if (b[i] !== 0x47) continue;
    const pid = ((b[i + 1] & 0x1f) << 8) | b[i + 2];
    const pusi = (b[i + 1] & 0x40) !== 0;
    if (!pusi) continue;
    const afc = (b[i + 3] >> 4) & 3; // adaptation_field_control bit 5-4
    if (afc === 0 || afc === 2) continue;
    let p = i + 4;
    if (afc === 3) { const al = b[p]; p += 1 + al; }
    if (p >= i + 188) continue;
    p += 1 + b[p]; // pointer_field
    if (p >= i + 188) continue;
    const bit = (o) => (o + 1 < b.length) ? ((b[o] << 8) | b[o + 1]) : -1;
    if (pid === 0 && b[p] === 0x00) { // PAT
      const sectionLen = bit(p + 1) & 0x0fff;
      const son = Math.min(p + 3 + sectionLen, i + 188 - 4);
      for (let q = p + 6; q + 4 <= son; q += 4) { // id(1)+syntaxlen(2)+tsid(2)+res/ver/cc(1)
        const progNo = bit(q);
        if (progNo !== 0) pmtPidler.add(bit(q + 2) & 0x1fff);
      }
    } else if (pmtPidler.has(pid) && b[p] === 0x02) { // PMT
      const sectionLen = bit(p + 1) & 0x0fff;
      const son = Math.min(p + 3 + sectionLen, i + 188);
      let q = p + 9 + (bit(p + 7) & 0x0fff); // id+syntaxlen+progno+res/pcr+res/pil
      while (q + 5 <= son) {
        const tur = b[q];
        const epid = bit(q + 1) & 0x1fff;
        const eil = bit(q + 3) & 0x0fff;
        if (TS_AUDIO_TIPLERI.has(tur)) {
          let d = q + 5;
          const dSon = Math.min(d + eil, son);
          while (d + 2 <= dSon) {
            const etiket = b[d], uzunluk = b[d + 1];
            if (etiket === 0x0A && d + 5 <= dSon) {
              const iso = String.fromCharCode(b[d + 2], b[d + 3], b[d + 4]).toLowerCase();
              const kod = dilKodla(iso);
              if (kod) kodlar.add(kod);
            }
            d += 2 + uzunluk;
          }
          void epid;
        }
        q += 5 + eil;
      }
    }
  }
  return kodlar;
}

/* ── Katman 2b: MP4/MOV moov dili (fMP4 init segmentleri + direkt mp4) ────── */
export function mp4SesDilleri(baytlar) {
  const b = u8(baytlar);
  const dv = new DataView(b.buffer, b.byteOffset, b.byteLength);
  const kodlar = new Set();
  const ad = (o, n) => { let s = ''; for (let i = 0; i < n; i++) s += String.fromCharCode(b[o + i]); return s; };
  function dolas(o, son, derinlik) {
    if (derinlik > 5) return;
    let i = o;
    while (i + 8 <= son) {
      let boyut = dv.getUint32(i);
      const tur = ad(i + 4, 4);
      let icerik = i + 8, icerikSon = i + boyut;
      if (boyut === 1 && i + 16 <= son) { boyut = Number(dv.getBigUint64(i + 8)); icerik = i + 16; icerikSon = i + boyut; }
      else if (boyut === 0) icerikSon = son;
      if (boyut < 8 || icerikSon > son) break;
      if (tur === 'moov' || tur === 'trak' || tur === 'mdia' || tur === 'udta') dolas(icerik, icerikSon, derinlik + 1);
      else if (tur === 'mdia') void 0;
      if (tur === 'trak') {
        // bu trak'ın hdlr'ını ve mdhd dilini ve udta>nam adını topla
        let sesMi = false, dilKodu = null, adMetni = '';
        const ara = (x, s, d2) => {
          if (d2 > 3) return;
          let j = x;
          while (j + 8 <= s) {
            let bz = dv.getUint32(j);
            const t2 = ad(j + 4, 4);
            let ic = j + 8, icS = j + bz;
            if (bz === 1 && j + 16 <= s) { bz = Number(dv.getBigUint64(j + 8)); ic = j + 16; icS = j + bz; }
            else if (bz === 0) icS = s;
            if (bz < 8 || icS > s) break;
            if (t2 === 'hdlr' && ic + 16 <= icS && ad(ic + 8, 4) === 'soun') sesMi = true;
            if (t2 === 'mdhd' && ic + 4 <= icS) {
              const ver = b[ic];
              const dilOfs = ver === 1 ? ic + 32 : ic + 20;
              if (dilOfs + 2 <= icS) {
                const packed = dv.getUint16(dilOfs);
                const iso = String.fromCharCode(((packed >> 10) & 31) + 0x60, ((packed >> 5) & 31) + 0x60, (packed & 31) + 0x60);
                dilKodu = dilKodla(iso);
              }
            }
            if ((t2 === 'nam' || t2 === '©nam') && icS - ic <= 128) {
              let metin = '';
              for (let k = ic + 8; k < icS; k++) metin += String.fromCharCode(b[k]);
              adMetni = metin || adMetni;
            }
            if (t2 === 'mdia' || t2 === 'udta' || t2 === 'minf') ara(ic, icS, d2 + 1);
            j += bz;
          }
        };
        ara(icerik, icerikSon, 0);
        if (sesMi) {
          const kod = (dilKodu && dilKodu !== 'und') ? dilKodu : dilKodla(adMetni);
          if (kod && kod !== 'und') kodlar.add(kod);
        }
      }
      i += boyut;
    }
  }
  dolas(0, b.length, 0);
  return kodlar;
}

/* ── Katman 2c: Matroska/WebM (EBML yürüyücüsü) ───────────────────────────── */
const EBML = { Segment: 0x18538067, Tracks: 0x1654ae6b, TrackEntry: 0xae, TrackType: 0x83, Language: 0x22b59c, LanguageIETF: 0x22b59d, Name: 0x536e };
export function mkvSesDilleri(baytlar) {
  const b = u8(baytlar);
  const kodlar = new Set();
  function idOku(o) {
    if (o >= b.length) return null;
    const ilk = b[o];
    let boy = 1;
    for (let m = 0x80; m && !(ilk & m); m >>= 1) boy++;
    if (boy > 4 || o + boy > b.length) return null;
    // EBML kimliklerinde marker bit KİMLİĞİN PARÇASIDIR (soyulmaz; 0xAE = 0xAE).
    let v = ilk;
    for (let i = 1; i < boy; i++) v = (v << 8) | b[o + i];
    return { v, uzunluk: boy };
  }
  function boyutOku(o) {
    if (o >= b.length) return null;
    const ilk = b[o];
    let boy = 1;
    for (let m = 0x80; m && !(ilk & m); m >>= 1) boy++;
    if (boy > 8 || o + boy > b.length) return null;
    let v = ilk & (0xff >> boy);
    for (let i = 1; i < boy; i++) v = v * 256 + b[o + i];
    return { v, uzunluk: boy };
  }
  function yur(o, son, derinlik, iz) {
    let i = o;
    while (i < son) {
      const id = idOku(i); if (!id) return;
      const sz = boyutOku(i + id.uzunluk); if (!sz) return;
      const veri = i + id.uzunluk + sz.uzunluk, veriSon = Math.min(veri + sz.v, son);
      const yol = [...iz, id.v];
      if (id.v === EBML.Segment || id.v === EBML.Tracks || id.v === EBML.TrackEntry) {
        yur(veri, veriSon, derinlik + 1, yol);
      } else if (id.v === EBML.TrackType && sz.v === 1 && veri < b.length) {
        yol._tur = b[veri];
        if (yol._tur !== 2 && derinlik > 2) void 0; // ses dışı izlenir ama işaretlenir
      } else if ((id.v === EBML.Language || id.v === EBML.LanguageIETF) && sz.v <= 8) {
        let s = '';
        for (let k = veri; k < veriSon; k++) s += String.fromCharCode(b[k]);
        yol._dil = s;
      }
      i = veri + sz.v;
      if (i <= veri - sz.v) break;
    }
  }
  // TrackEntry bazlı düz tarama: her TrackEntry bloğundaki tur/dil ikilisini yakala
  function trackYur(o, son) {
    let i = o;
    while (i < son) {
      const id = idOku(i); if (!id) break;
      const sz = boyutOku(i + id.uzunluk); if (!sz) break;
      const veri = i + id.uzunluk + sz.uzunluk, veriSon = Math.min(veri + sz.v, son);
      if (id.v === EBML.Tracks || id.v === EBML.Segment) trackYur(veri, veriSon);
      else if (id.v === EBML.TrackEntry) {
        let tur = 0, dil = '';
        let j = veri;
        while (j < veriSon) {
          const cid = idOku(j); if (!cid) break;
          const csz = boyutOku(j + cid.uzunluk); if (!csz) break;
          const cv = j + cid.uzunluk + csz.uzunluk, cvS = Math.min(cv + csz.v, veriSon);
          if (cid.v === EBML.TrackType && csz.v === 1 && cv < b.length) tur = b[cv];
          if ((cid.v === EBML.Language || cid.v === EBML.LanguageIETF) && csz.v <= 8 && cvS - cv <= 8) {
            let s = '';
            for (let k = cv; k < cvS; k++) s += String.fromCharCode(b[k]);
            if (!dil) dil = s;
          }
          j = cv + csz.v;
        }
        if (tur === 2) { const kod = dilKodla(dil); if (kod && kod !== 'und') kodlar.add(kod); }
      }
      i = veri + sz.v;
    }
  }
  void yur;
  if (b.length >= 4 && b[0] === 0x1a && b[1] === 0x45 && b[2] === 0xdf && b[3] === 0xa3) trackYur(0, b.length);
  return kodlar;
}

/** Ham bayttan kapsayıcıyı tanıyıp ilgili parse'ı koşar. Set ya da null. */
export function baytSesDilleri(baytlar) {
  const b = u8(baytlar);
  if (b.length < 16) return null;
  if (b[0] === 0x47) return tsSesDilleri(b);
  if ((b[4] === 0x66 && b[5] === 0x74 && b[6] === 0x79 && b[7] === 0x70) || String.fromCharCode(b[4], b[5], b[6], b[7]) === 'moov' || String.fromCharCode(b[4], b[5], b[6], b[7]) === 'styp') {
    return mp4SesDilleri(b);
  }
  if (b[0] === 0x1a && b[1] === 0x45 && b[2] === 0xdf && b[3] === 0xa3) return mkvSesDilleri(b);
  return null;
}

/* ── Katman 3: medya playlist/segman kazısı ──────────────────────────────── */
function goreliAdres(taban, gorunen) {
  try { return new URL(gorunen, taban).toString(); } catch (_) { return null; }
}

/** Master'da AUDIO bildirimi yoksa: ilk varyantın medya playlist'inden init/
    segman adresi çıkar, ilk ~256KB'ı indir, kapsayıcıyı kaz. */
async function segmandanSesler(masterAdres, masterMetin, gotur, ms) {
  const satirlar = String(masterMetin).split(/\r?\n/).map(s => s.trim()).filter(Boolean);
  const varyant = satirlar.find(s => !s.startsWith('#') && !s.startsWith('#EXT'));
  let hedef = varyant ? goreliAdres(masterAdres, varyant) : null;
  if (!hedef) return null;
  const yanit = await gotur(hedef, { signal: AbortSignal.timeout(ms) });
  if (!yanit || !yanit.ok) return null;
  const metin = await yanit.text();
  let hedef2 = null;
  if (/#EXTM3U/i.test(metin)) {
    const map = metin.match(/#EXT-X-MATERIALIZATION|URI="([^"]+\.(?:mp4|m4s|cmfv|init[^"]*))"/i) || metin.match(/URI="([^"]+)"/g);
    const initSatir = metin.match(/#EXT-X-MAP:URI="([^"]+)"/);
    const seg = metin.split(/\r?\n/).map(s => s.trim()).filter(s => s && !s.startsWith('#'))[0];
    const aday = (initSatir && initSatir[1]) || seg;
    hedef2 = aday ? goreliAdres(hedef, aday) : null;
    void map;
  } else {
    hedef2 = hedef; // doğrudan segman baytı (TS/mp4)
  }
  if (!hedef2) return null;
  const seg = await gotur(hedef2, { signal: AbortSignal.timeout(ms), headers: { Range: 'bytes=0-262143' } });
  if (!seg || !seg.ok) return null;
  const buf = u8(await seg.arrayBuffer());
  // TS senkron kaybı: 0x47 olmayan başlangıçları da dene (ID3 prefix yaygındır)
  let kodlar = baytSesDilleri(buf);
  if ((!kodlar || !kodlar.size) && buf.length > 2048) {
    for (let ofset = 0; ofset < 188 * 12; ofset++) {
      if (buf[ofset] === 0x47 && buf[ofset + 188] === 0x47) { kodlar = tsSesDilleri(buf.subarray(ofset)); if (kodlar && kodlar.size) break; }
    }
  }
  return kodlar && kodlar.size ? kodlar : null;
}

/* ── Doğrulama (ağ) ───────────────────────────────────────────────────────── */
const cache = new Map();
const CACHE_TAZELIK_MS = 30 * 60 * 1000;
const BASARISIZ_TTL_MS = 60 * 1000;
// ÖNCELİK KUYRUĞU (kullanıcı 2026-10-29: PopWatch/VidBolt rozetsiz geldi):
// eklenti/yerli satırlar önce dinlenir ki 🇹🇷 Dublaj rozeti ve liste başı
// sıralaması gecikmesin; çekirdek satırları arkada sıraya girer.
const EŞZAMAN_MAX = 5;
const bekleyen = { oncelik: [], normal: [] };
let aktifIs = 0;
function sonrakiDusur() {
  while (aktifIs < EŞZAMAN_MAX && (bekleyen.oncelik.length || bekleyen.normal.length)) {
    const is = bekleyen.oncelik.shift() || bekleyen.normal.shift();
    aktifIs++;
    Promise.resolve().then(is).finally(() => { aktifIs--; sonrakiDusur(); });
  }
}
function sirayaAl(isi, oncelikli) {
  return new Promise((coz) => {
    (oncelikli ? bekleyen.oncelik : bekleyen.normal).push(() => isi().then(coz));
    sonrakiDusur();
  });
}

export function m3u8Mi(adres) {
  return /\.m3u8(?:\?|#|$)/i.test(String(adres || ''));
}

export function satirinAdresi(satir) {
  return String(satir?.streamUrl || satir?.url || satir?.embedUrl || '').trim();
}

/** Master playlist'i okur; dil bildirimi yoksa segmana iner. null = hiçbir
    kanıt yok (ağ hatası / doğrulanamaz kapsayıcı). */
export async function sesDokumuKesfet(adres, { ms = 9000, fetchImpl = null, oncelik = false } = {}) {
  const ahtar = String(adres || '').split('#')[0].split('?')[0];
  if (!ahtar) return null;
  const taze = cache.get(ahtar);
  if (taze && Date.now() - taze.t < (taze.dokum ? CACHE_TAZELIK_MS : BASARISIZ_TTL_MS)) return taze.dokum;
  return sirayaAl(async () => {
    try {
      let gotur = fetchImpl;
      if (!gotur) {
        const v = await import('../../providers/vekil.js');
        gotur = v.kopruFetch;
      }
      let dokum = null;
      if (m3u8Mi(adres)) {
        const yanit = await gotur(adres, { signal: AbortSignal.timeout(ms) });
        if (!yanit || !yanit.ok) throw new Error(String(yanit?.status || 'yanit-yok'));
        const metin = await yanit.text();
        if (!/#EXTM3U|#EXT-X-|#EXTINF/i.test(metin)) throw new Error('manifest-degil');
        dokum = m3u8SesDokumu(metin);
        if (!dokum.kanitlanabilir) {
          const ek = await segmandanSesler(adres, metin, gotur, ms);
          if (ek) {
            dokum.diller = [...new Set([...dokum.diller, ...ek])];
            dokum.trMi = dokum.diller.includes('tr');
            dokum.cokluMu = dokum.diller.length > 1;
            dokum.kanitlanabilir = true;
          }
        }
      } else {
        // direkt mp4/mkv/ts adresi — baştan 256KB kaz
        const yanit = await gotur(adres, { signal: AbortSignal.timeout(ms), headers: { Range: 'bytes=0-262143' } });
        if (!yanit || !yanit.ok) throw new Error(String(yanit?.status || 'yanit-yok'));
        const kodlar = baytSesDilleri(u8(await yanit.arrayBuffer()));
        if (kodlar && kodlar.size) dokum = { diller: [...kodlar], trMi: kodlar.has('tr'), trAltyaziMi: false, cokluMu: kodlar.size > 1, kanitlanabilir: true };
      }
      cache.set(ahtar, { t: Date.now(), dokum });
      return dokum;
    } catch (hata) {
      if (globalThis.__dubDebug) console.error('[dub-kesfet]', hata?.stack || hata);
      cache.set(ahtar, { t: Date.now(), dokum: null });
      return null;
    }
  }, oncelik);
}

/** Satırı yerinde doğrular: dilDurumu + diller + trSes + sesDokumu. */
export async function satiriDinle(satir, opts = {}) {
  if (!satir || satir.dilDurumu) return null;
  const adres = satirinAdresi(satir);
  if (!adres) return null;
  const dokum = await sesDokumuKesfet(adres, opts);
  if (!dokum || !dokum.kanitlanabilir) return null;
  if (!Array.isArray(satir.diller)) satir.diller = [];
  satir.sesDokumu = dokum.diller.join(', ');
  // TÜM KAYNAKLAR AYNI BAYRAKLI TASARIM (kullanıcı 2026-10-29: "VidBolt/Pop'a
  // yaptığın bayraklı tasarımı diğer kaynaklara da uyarla"): doğrulanan HER dil
  // kodu satırın diller dizisine yazılır — kaynak-listesi çiplerinde birebir
  // bayrak emojisi olarak çizilir (🇹🇷 🇮🇳 🇬🇧 …). Yalnız tr/altyazı eklemek
  // çekirdek satırlarını bayraksız bırakıyordu.
  for (const kod of dokum.diller) {
    const k = String(kod || '').toLowerCase();
    if (/^[a-z]{2}$/.test(k) && !satir.diller.includes(k)) satir.diller.push(k);
  }
  if (dokum.trMi) {
    satir.dilDurumu = 'dublaj';
    satir.trSes = true;
    if (!satir.diller.includes('tr')) satir.diller.push('tr');
  } else if (dokum.trAltyaziMi) {
    satir.dilDurumu = 'altyazi';
    if (!satir.diller.includes('altyazi')) satir.diller.push('altyazi');
  } else {
    satir.dilDurumu = 'orijinal'; // kanıt var ve TR yok — DOĞRU ORİJİNAL
  }
  return dokum;
}
