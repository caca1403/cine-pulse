/* ==========================================================================
   CinePulse — "Darkseid" oynatıcı çözümleyicileri (birinci taraf saf fonksiyonlar)
   --------------------------------------------------------------------------
   Tek hedef: hedef sitenin gömülü oynatıcısının HTML'inden DOĞRUDAN yayın
   adresini çıkarmak. Üçüncü taraf kod ÇALIŞTIRILMAZ — packer dahil her şema
   elle yazılı saf fonksiyonlarla çözülür. Şema aritmetiği 2026-10 ölçümleriyle
   sabittir; bir rakamı bile değişirse çıktı bozulur.

   Şemalar:
     be  → iframe HTML'inde ana giriş (beCoz/dnCoz/gnCoz/packer/düz arama)
     Be  → dizi parçalama + ops zinciri + yer değiştirme + XOR akışı
     dn  → dizi + anahtar + ops; çarpmasız XOR akışı
     gn  → packer sonrası ters + ROT13 + base64 + charCode kaydırması
   ========================================================================== */

const B64 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

function m3u8eCevir(url) {
  if (!url) return null;
  let out = String(url);
  if (out.includes('playmix.uno')) return null; // ölçülmüş ölü/reklam alanı
  return out.replace(/\/txt\/master\.txt/i, '/master.m3u8').replace(/\/master\.txt/i, '/master.m3u8');
}

function urlyiBul(metin) {
  const m = String(metin || '').match(/https?:\/\/[^\s"'<>\0-\u001f\u0080-\uffff]+/);
  return m ? m3u8eCevir(m[0]) : null;
}

const harfKaydir = (metin, shift) => metin.replace(/[a-zA-Z]/g, c => {
  const code = c.charCodeAt(0);
  const base = code <= 90 ? 65 : 97;
  return String.fromCharCode(((code - base + shift) % 26 + 26) % 26 + base);
});

/** Boşluk/tire normalize eden taban-64 çözücü. */
export function b64Kaydir(text) {
  const s = String(text || '').replace(/[\r\n\t =]+/g, '').replace(/-/g, '+').replace(/_/g, '/');
  let out = '';
  for (let i = 0; i < s.length; i += 4) {
    const c1 = B64.indexOf(s.charAt(i));
    const c2 = i + 1 < s.length ? B64.indexOf(s.charAt(i + 1)) : -1;
    const c3 = i + 2 < s.length ? B64.indexOf(s.charAt(i + 2)) : -1;
    const c4 = i + 3 < s.length ? B64.indexOf(s.charAt(i + 3)) : -1;
    if (c1 === -1 || c2 === -1) break;
    out += String.fromCharCode((c1 << 2) | (c2 >> 4));
    if (c3 !== -1) {
      out += String.fromCharCode(((c2 & 15) << 4) | (c3 >> 2));
      if (c4 !== -1) out += String.fromCharCode(((c3 & 3) << 6) | c4);
    }
  }
  return out;
}

/** Klasik `function(p,a,c,k,e,d)` paket çözücü. */
export function paketCoz(script) {
  const m = String(script).match(/function\(p,a,c,k,e,d\)[\s\S]*?\}\s*\(\s*['"]([\s\S]*?)['"]\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*['"]([\s\S]*?)['"]\.split\(['"]\|['"]\)/);
  if (!m) return null;
  let p = m[1];
  const a = parseInt(m[2], 10);
  let c = parseInt(m[3], 10);
  const k = m[4].split('|');
  p = p.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\n/g, '\n').replace(/\\r/g, '\r');
  const e = n => (n < a ? '' : e(Math.floor(n / a))) + ((n %= a) > 35 ? String.fromCharCode(n + 29) : n.toString(36));
  while (c--) if (k[c]) p = p.replace(new RegExp('\\b' + e(c) + '\\b', 'g'), () => k[c]);
  return p;
}

function diziParse(ham) {
  try { return JSON.parse(ham); } catch (_) {
    const parcalar = String(ham || '').match(/"([^"]+)"|'([^']+)'/g);
    return parcalar ? parcalar.map(s => s.slice(1, -1)) : null;
  }
}

/** `dn` şeması: [dizi] + anahtar + ops → çarpmasız XOR akışıyla m3u8. */
export function dnCoz(script) {
  const m1 = String(script).match(/var\s+[a-zA-Z0-9_$]+\s*=\s*[a-zA-Z0-9_$]+\s*\(\s*(\[[\s\S]*?\])\s*\);/);
  const m2 = String(script).match(/var\s+[a-zA-Z0-9_$]+\s*=\s*["']([a-zA-Z0-9_-]{10,})["'][\s\S]*?var\s+[a-zA-Z0-9_$]+\s*=\s*["']([a-zA-Z0-9_-]{2,10})["']/);
  if (!m1 || !m2) return null;
  const keyStr = m2[1], ops = m2[2];
  const arr = diziParse(m1[1]);
  if (!arr) return null;
  let enc = arr.join('');
  let v1 = 0, v2 = 0;
  for (let i = 0; i < keyStr.length; i++) {
    const cc = keyStr.charCodeAt(i);
    v1 = (v1 * 31 + cc) % 251;
    v2 = (v2 ^ (cc + i)) & 255;
  }
  const v3 = (v1 + v2) % 256;
  const v4 = (v1 % 13) + 3;
  let v5 = ((v1 * 256 + v2) % 65521) + 1;
  for (let i = ops.length - 1; i >= 0; i--) {
    const op = ops.charAt(i);
    if (op === 'b') enc = b64Kaydir(enc);
    else if (op === 'v') enc = enc.split('').reverse().join('');
    else enc = harfKaydir(enc, (26 - ((op.charCodeAt(0) - 64) % 26)) % 26);
  }
  const len = enc.length;
  const arrMap = [];
  for (let i = len - 1; i >= 1; i--) { v5 = (v5 * 75 + 74) % 65537; arrMap[i] = v5 % (i + 1); }
  const chars = enc.split('');
  for (let i = 1; i < len; i++) { const s = arrMap[i]; const t = chars[i]; chars[i] = chars[s]; chars[s] = t; }
  let curr = v3, out = '';
  for (let i = 0; i < chars.length; i++) {
    const cc = chars[i].charCodeAt(0);
    curr = (curr + v4) % 256;
    out += String.fromCharCode(cc ^ curr);
    curr = (curr + cc) % 256;
  }
  return urlyiBul(out);
}

/** `gn` şeması: paketten sonra ters + ROT13 + base64 + charCode kaydırması. */
export function gnCoz(script) {
  const mod = String(script).match(/charCode\s*-\s*\((\d+)\s*%\s*\(\s*i\s*\+\s*9\s*\)\)/);
  if (!mod) return null;
  const modVal = parseInt(mod[1], 10);
  const arrM = String(script).match(/var\s+\w+\s*=\s*dc_\w+\s*\(\s*(\[[\s\S]*?\])\s*\);/);
  if (!arrM) return null;
  const arr = diziParse(arrM[1]);
  if (!arr) return null;
  let rev = arr.join('').split('').reverse().join('');
  rev = harfKaydir(rev, 13);
  rev = b64Kaydir(rev);
  let out = '';
  for (let i = 0; i < rev.length; i++) {
    let cc = rev.charCodeAt(i);
    cc = (((cc - (modVal % (i + 9))) % 256) + 256) % 256;
    out += String.fromCharCode(cc);
  }
  return urlyiBul(out);
}

/** `Be` şeması: dizi parçalama + ops zinciri + yer değiştirme + XOR akışı. */
export function beCoz(arr) {
  try {
    if (!Array.isArray(arr) || arr.length < 5) return null;
    const items = [...arr];
    const rem2 = items.length - 2;
    const idx1 = rem2 % 7;
    const idx2 = 8 + (rem2 % 5);
    if (idx2 >= items.length || idx1 >= items.length) return null;
    const item1 = items.splice(idx2, 1)[0];
    const item2 = items.splice(idx1, 1)[0];
    let text = items.join('');
    if (item1.length > 2048) text = text.split('').reverse().join('');
    let v1 = 0, v2 = 0;
    for (let i = 0; i < item2.length; i++) {
      const code = item2.charCodeAt(i);
      v1 = (v1 * 37 + code) % 241;
      v2 = (v2 + ((code << 1) ^ i)) & 255;
    }
    const v3 = (v1 * 3 + v2) % 256;
    const v4 = (v2 % 11) + 5;
    let v5 = ((v2 * 251 + v1) % 65519) + 1;
    for (let i = item1.length - 1; i >= 0; i--) {
      const ch = item1.charAt(i);
      if (ch === '7') text = b64Kaydir(text);
      else if (ch === '3') text = text.split('').reverse().join('');
      else text = harfKaydir(text, (26 - ((ch.charCodeAt(0) - 96) % 26)) % 26);
    }
    if (item2.length > 4096) text = b64Kaydir(text);
    const len = text.length;
    const arrMap = [];
    for (let i = len - 1; i >= 1; i--) { v5 = (v5 * 97 + 41) % 65519; arrMap[i] = v5 % (i + 1); }
    const chars = text.split('');
    for (let i = 1; i < len; i++) { const s = arrMap[i]; const t = chars[i]; chars[i] = chars[s]; chars[s] = t; }
    let curr = v3, out = '';
    for (let i = 0; i < chars.length; i++) {
      const cc = chars[i].charCodeAt(0);
      curr = (curr * 5 + v4) % 256;
      out += String.fromCharCode(cc ^ curr);
      curr = (curr + cc) % 256;
    }
    return urlyiBul(out);
  } catch (_) { return null; }
}

/** Ana giriş: gömülü oynatıcı HTML'inden doğrudan m3u8 adresi çıkarır. */
export function sifreCoz(html) {
  const s = String(html || '');
  /* 1) sources:[{file: DEĞİŞKEN}] → değişkenin split/dizi tanımı */
  const sm = s.match(/sources:\s*\[\{\s*file:\s*([a-zA-Z0-9_$]+)/i);
  if (sm) {
    const varAdi = sm[1];
    const splitM = s.match(new RegExp('var\\s+' + varAdi + `\\s*=\\s*[a-zA-Z0-9_$]+\\s*\\(\\s*["']([\\s\\S]*?)["']\\.split\\(\\s*["']([^"']+)["']\\s*\\)\\s*\\);`));
    if (splitM) {
      const r = beCoz(splitM[1].replace(/\\\//g, '/').split(splitM[2]));
      if (r) return r;
    }
    const arrM = s.match(new RegExp('var\\s+' + varAdi + '\\s*=\\s*[a-zA-Z0-9_$]+\\s*\\(\\s*(\\[[\\s\\S]*?\\])\\s*\\);'));
    if (arrM) {
      let parsed = null;
      try { parsed = JSON.parse(arrM[1]); } catch (_) { /* regex yedeği diziParse'te */ }
      if (parsed) {
        const r = beCoz(parsed);
        if (r) return r;
        const d = dnCoz(s);
        if (d) return d;
      }
    }
  }
  /* 2) tüm split desenleri */
  const splitRe = /var\s+[a-zA-Z0-9_$]+\s*=\s*[a-zA-Z0-9_$]+\s*\(\s*["']([\s\S]*?)["']\.split\(\s*["']([^"']+)["']\s*\)\s*\);/g;
  let sm2;
  while ((sm2 = splitRe.exec(s)) !== null) {
    const p1 = sm2[1].replace(/\\\//g, '/');
    if (p1.length > 50 && sm2[2].length <= 3) {
      const r = beCoz(p1.split(sm2[2]));
      if (r) return r;
    }
  }
  /* 3) paket + gn ya da açılmış metinde düz m3u8 */
  if (s.includes('function(p,a,c,k,e,d)')) {
    const fn = paketCoz(s);
    if (fn) {
      const g = gnCoz(fn);
      if (g) return g;
      const m = fn.match(/https?:\/\/[^\s"'<>\0-\u001f]+\.m3u8[^\s"'<>\0-\u001f]*/i);
      const mm = m && m3u8eCevir(m[0]);
      if (mm) return mm;
    }
  }
  /* 4) script blok blok: paket → gn; dn */
  const scriptRe = /<script[^>]*>([\s\S]*?)<\/script>/gi;
  let sc;
  while ((sc = scriptRe.exec(s)) !== null) {
    const icerik = sc[1].replace(/<!--[\s\S]*?-->/g, '').trim();
    if (icerik.includes('function(p,a,c,k,e,d)')) {
      const fn = paketCoz(icerik);
      if (fn) { const g = gnCoz(fn); if (g) return g; }
    }
    const d = dnCoz(icerik);
    if (d) return d;
  }
  /* 5) düz arama */
  const dm = s.match(/https?:\/\/[^\s"'<>]+\/master\.(?:m3u8|txt)[^\s"'<>]*/i);
  return dm ? m3u8eCevir(dm[0]) : null;
}
