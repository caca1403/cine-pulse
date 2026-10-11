/* ==========================================================================
   Oynatıcı sayfasından yayın adresini çıkarma — paylaşılan çözücüler

   Buraya, calisan kaynaklarda olcumle bulunmus ORTAK kaliplar toplandi:
     • Dean Edwards paketlenmis JS  (eval(function(p,a,c,k,e,d)))
     • dizi77/UXPlayer ters-base64 + AES + hex sifreli document.write
     • charCode - (n % (i+9)) sifrelemesi
     • openPlayer('adres') cagrisi
     • file : av("adres") sifrelemesi
     • master.m3u8 (RESOLUTION / LANGUAGE ile altyazi ayiklanir)
     • …/xyz.mpd/txt/master.txt → …/xyz.mpd/master.m3u8 duzeltmesi

   ONEMLI: paketlenmis JS metin donusumuyle ACILIR — `new Function` ile
   calistirilmaz. Kod calistirmak bellek patlamasi yapip sureci dusuruyordu
   (olculdu) ve imzali APK'da uzaktan kod calistirma kapisi acar.

   Burada kod calistirilmadigi icin bu modul guvenli: yalnizca metin uzerinde
   islem yapar, ag istegi yapmaz, dosya okumaz.
   ========================================================================== */

/** …/x.mpd/txt/master.txt → …/x.mpd/master.m3u8
 *  DiziSol'un "filmmakinesi" yayinlari bu duzeltme olmadan 404 veriyordu
 *  (olculdu: master.txt → 404). */
export function masterUrlDuzelt(url) {
  return String(url || '')
    .replace(/\/txt\/master\.txt/i, '/master.m3u8')
    .replace(/\/master\.txt/i, '/master.m3u8');
}

/** standart disi base64 (bosluk temizleme + URL guvenli karakterler) */
export function base64Coz(str) {
  const karakterler = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
  const temiz = String(str || '').replace(/[\r\n\t =]+/g, '').replace(/-/g, '+').replace(/_/g, '/');
  let out = '';
  for (let i = 0; i < temiz.length; i += 4) {
    const a = karakterler.indexOf(temiz.charAt(i));
    const b = i + 1 < temiz.length ? karakterler.indexOf(temiz.charAt(i + 1)) : -1;
    const c = i + 2 < temiz.length ? karakterler.indexOf(temiz.charAt(i + 2)) : -1;
    const d = i + 3 < temiz.length ? karakterler.indexOf(temiz.charAt(i + 3)) : -1;
    if (a === -1 || b === -1) break;
    out += String.fromCharCode((a << 2) | (b >> 4));
    if (c !== -1) {
      out += String.fromCharCode(((b & 15) << 4) | (c >> 2));
      if (d !== -1) out += String.fromCharCode(((c & 3) << 6) | d);
    }
  }
  return out;
}

/**
 * Dean Edwards paketini metin dönüşümüyle açar — kod ÇALIŞTIRMAZ.
 * @returns {string} açılmış kod, ya da desen yoksa boş dize
 */
export function paketCoz(html) {
  const m = String(html || '').match(
    /(?:eval\s*\(\s*)?function\(p,a,c,k,e,d\)[\s\S]*?\}\s*\(\s*['"]([\s\S]*?)['"]\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*['"]([\s\S]*?)['"]\.split\(['"]\|['"]\)/
  );
  if (!m) return '';
  let kod = m[1]
    .replace(/\\'/g, "'").replace(/\\"/g, '"')
    .replace(/\\n/g, '\n').replace(/\\r/g, '\r');
  const taban = parseInt(m[2], 10);
  const anahtarlar = m[4].split('|');
  // DİKKAT: sıfır için de "0" üretmelidir. Önceki sürüm `n < taban`
  // kontrolüyle boş dize döndürüyordu; toBase(0) = '' olunca düzen
  // `\b\b` haline geliyor ve HER kelime sınırı değiştiriliyordu —
  // yani açılan kod tamamen bozuluyordu (ölçüldü).
  const toBase = (n) => {
    let s = '';
    let x = n;
    do {
      const r = x % taban;
      s = (r > 35 ? String.fromCharCode(r + 29) : r.toString(taban)) + s;
      x = Math.floor(x / taban);
    } while (x > 0);
    return s;
  };
  for (let i = parseInt(m[3], 10) - 1; i >= 0; i--) {
    if (!anahtarlar[i]) continue;
    kod = kod.replace(new RegExp(`\\b${toBase(i)}\\b`, 'g'), () => anahtarlar[i]);
  }
  return kod;
}

/** dizi77/UXPlayer ailesi: dizi + iki anahtardan türeyen karıştırma çözümü. */
export function vnCoz(html) {
  const metin = String(html || '');
  const dizi = metin.match(/var\s+[a-zA-Z0-9_$]+\s*=\s*[a-zA-Z0-9_$]+\s*\(\s*(\[[\s\S]*?\])\s*\);/);
  const anahtar = metin.match(/var\s+[a-zA-Z0-9_$]+\s*=\s*["']([a-zA-Z0-9_-]{10,})["'][\s\S]*?var\s+[a-zA-Z0-9_$]+\s*=\s*["']([a-zA-Z0-9_-]{2,10})["']/);
  if (!dizi || !anahtar) return '';

  const [k1, ops] = [anahtar[1], anahtar[2]];
  let ogeler;
  try {
    ogeler = JSON.parse(dizi[1]);
  } catch (_) {
    const ham = dizi[1].match(/"([^"]+)"|'([^']+)'/g);
    if (!ham) return '';
    ogeler = ham.map((s) => s.slice(1, -1));
  }

  let s = ogeler.join('');
  let h1 = 0, h2 = 0;
  for (let i = 0; i < k1.length; i++) {
    const c = k1.charCodeAt(i);
    h1 = (h1 * 31 + c) % 251;
    h2 = (h2 ^ c + i) & 255;
  }
  const tohum = (h1 + h2) % 256;
  const adim = (h1 % 13) + 3;
  let lcg = ((h1 * 256 + h2) % 65521) + 1;

  for (let i = ops.length - 1; i >= 0; i--) {
    const op = ops.charAt(i);
    if (op === 'b') s = base64Coz(s);
    else if (op === 'v') s = s.split('').reverse().join('');
    else {
      const rot = (26 - (op.charCodeAt(0) - 64) % 26) % 26;
      s = s.replace(/[a-zA-Z]/g, (c) => {
        const kod = c.charCodeAt(0);
        const taban = kod <= 90 ? 65 : 97;
        return String.fromCharCode(((kod - taban + rot) % 26) + taban);
      });
    }
  }

  const len = s.length;
  const idx = new Array(len);
  let l = lcg;
  for (let i = len - 1; i >= 1; i--) {
    l = (l * 75 + 74) % 65537;
    idx[i] = l % (i + 1);
  }
  const dizi2 = s.split('');
  for (let i = 1; i < len; i++) {
    const j = idx[i];
    [dizi2[i], dizi2[j]] = [dizi2[j], dizi2[i]];
  }
  s = dizi2.join('');

  let anahtarBayt = tohum;
  let out = '';
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    anahtarBayt = (anahtarBayt + adim) % 256;
    out += String.fromCharCode(c ^ anahtarBayt);
    anahtarBayt = (anahtarBayt + c) % 256;
  }
  const m = out.match(/https?:\/\/[^\s"'<>\u0080-\uFFFF]+/);
  return m ? m[0] : '';
}

/**
 * charCode - (n % (i + 9)) ile şifrelenmiş diziler.
 * @param {string} ham  tüm betik/HTML
 */
export function charCodeCoz(ham) {
  const metin = String(ham || '');
  const n = metin.match(/charCode\s*-\s*\((\d+)\s*%\s*\(\s*i\s*\+\s*9\s*\)/);
  if (!n) return '';
  const sabit = parseInt(n[1], 10);
  const url = metin.match(/["'](https?:\/\/[^"'\s<>]+)["']/);
  if (!url) return '';
  let out = '';
  const hamUrl = url[1];
  for (let i = 0; i < hamUrl.length; i++) {
    const kod = hamUrl.charCodeAt(i);
    const k = sabit % (i + 9);
    out += String.fromCharCode(kod > k ? kod - k : kod + (256 - k));
  }
  return /^https?:\/\//i.test(out) ? out : '';
}

const ADRES_DESENI = /https?:\/\/[^\s"'<>\u0000-\u001F\u0080-\uFFFF]{6,}/i;

const MEDYA_UZANTI = /\.(?:m3u8|mp4|m4s|webm|m3u)\b/i;

/**
 * `videoPlayerData(JSON.parse('…'))` — oynatıcı verisinin sayfaya gömülü
 * hâli. İçinde \uXXXX kaçışları, bazen de base64 metin var; ikisini de
 * çözüp içinden yayın adresi arıyoruz. Kod ÇALIŞTIRILMAZ.
 */
export function videoPlayerDataCoz(html) {
  const m = String(html || '').match(
    /(?:videoPlayerData|video_data|playerData)\s*\(\s*JSON\.parse\(\s*['"]([\s\S]{20,})['"]\s*\)/
  );
  if (!m) return '';
  const icerik = m[1].replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
  let aranacak = icerik;
  try { aranacak = JSON.stringify(JSON.parse(icerik)); } catch (_) {
    const coz = base64Coz(icerik);
    if (coz && coz.includes(':')) aranacak = coz;
  }
  const adres = aranacak.match(/https?:\/\/[^\s"'<>\\]{10,}/);
  return adres ? adres[0].replace(/\\+$/, '') : '';
}

/** `FirePlayer("x", { file: "…" }, true)` — SetFilm ailesi. */
export function firePlayerCoz(html) {
  const m = String(html || '').match(/FirePlayer\s*\(\s*[^,]{1,80},\s*(\{[\s\S]{10,}?\}\s*)/);
  if (!m) return '';
  for (const alan of ['file', 'source', 'src', 'url', 'hls', 'mp4']) {
    const a = m[1].match(new RegExp(`["']?${alan}["']?\\s*:\\s*["']([^"']+)["']`, 'i'));
    if (a && a[1]) return a[1];
  }
  return '';
}

/**
 * Oynatıcı HTML'inden yayın adresini çıkarır.
 *
 * Sıra ucuzdan pahalıya: doğrudan adres → açık oynatıcı çağrıları →
 * paketli JS → şifreli sıralar → master deseni.
 *
 * @param {string} html
 * @returns {{url:string, via:string, altyazi?:Array}}
 */
export function oynaticiCoz(html) {
  const metin = String(html || '');
  if (!metin) return null;

  // 1) Doğrudan medya adresi
  const dogrudan = metin.match(/https?:\/\/[^\s"'<>\u0080-\uFFFF]+\.(?:m3u8|mp4|m4s|webm)[^\s"'<>\u0080-\uFFFF]*/i);
  if (dogrudan) return { url: masterUrlDuzelt(dogrudan[0]), via: 'dogrudan-adres' };

  // 2) Açık oynatıcı çağrıları (selcukflix benzeri)
  for (const re of [
    /openPlayer\s*\(\s*['"]([^'"]+)['"]/i,
    /file\s*:\s*av\s*\(\s*["']([^"']+)["']\s*\)/i,
    /(?:let|var|const)\s+[\w$]+\s*=\s*["'](https?:\/\/[^"']+\.m3u8[^"']*)["']/i
  ]) {
    const m = metin.match(re);
    if (m && m[1]) return { url: masterUrlDuzelt(m[1]), via: 'acik-oynatici' };
  }

  // 2b) Sayfaya gömülü oynatıcı verisi ve FirePlayer
  const gomulu = videoPlayerDataCoz(metin) || firePlayerCoz(metin);
  if (gomulu) return { url: masterUrlDuzelt(gomulu), via: 'gomulu-oynatici' };

  // 3) Paketlenmiş JS (çalıştırılmaz, metin dönüşümü)
  if (metin.includes('function(p,a,c,k,e,d)')) {
    const paket = paketCoz(metin);
    if (paket) {
      const m = paket.match(ADRES_DESENI);
      if (m && /\.m3u8|\.mp4|\.m3u\b/i.test(m[0])) return { url: masterUrlDuzelt(m[0]), via: 'paketli-js' };
    }
  }

  // 4) Şifreli sıralar
  const vn = vnCoz(metin);
  if (vn && /\.m3u8|\.mp4|\.m3u\b/i.test(vn)) return { url: masterUrlDuzelt(vn), via: 'sifreli-dizi' };

  const cc = charCodeCoz(metin);
  if (cc) return { url: masterUrlDuzelt(cc), via: 'charcode' };

  // 5) master deseni (m3u8 ya da txt/master.txt)
  const master = metin.match(/https?:\/\/[^\s"'<>]+\/master\.(?:m3u8|txt)[^\s"'<>]*/i);
  if (master) return { url: masterUrlDuzelt(master[0]), via: 'master' };

  return null;
}

/**
 * Master playlist'inden Türkçe ses/altyazı hatlarını ayıklar.
 * @param {string} m3u8Metni  master.m3u8 içeriği
 */
export function masterAltyazilari(m3u8Metni) {
  const cikti = [];
  // EXT-X-MEDIA öznitelikleri HER ZAMAN aynı sırada değil (LANGUAGE, NAME'den
  // önce de gelebiliyor) — bu yüzden satırı tek tek özniteliğe ayırıyoruz.
  for (const satir of String(m3u8Metni || '').split('\n')) {
    if (!/#EXT-X-MEDIA:/i.test(satir)) continue;
    const al = (ad) => {
      const m = satir.match(new RegExp(ad + '=("[^"]*"|[^,]*)', 'i'));
      return m ? m[1].replace(/^"|"$/g, '').trim() : '';
    };
    const tur = al('TYPE');
    if (!/^(AUDIO|SUBTITLES)$/i.test(tur)) continue;
    const ad = al('NAME');
    const dil = al('LANGUAGE');
    const uri = al('URI');
    if (!/tr|turk/i.test(`${ad} ${dil}`)) continue;
    if (uri) cikti.push({ name: ad || 'tr', language: dil || 'tr', url: uri, type: tur.toUpperCase() });
  }
  return cikti;
}