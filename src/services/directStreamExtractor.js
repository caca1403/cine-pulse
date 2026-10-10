/* ==========================================================================
   CinePulse Studio - Cihaz-ici dogrudan video ayiklayicilar (saf, testli)
   Sayfa/embed HTML'i -> dogrudan video (m3u8/mp4) + altyazi. HTML kaynagi
   oturumlu olur (masaüstü hayalet pencere / APK oturum cozucu); sunucu
   IP'si bayrakli oldugu icin sunucu-ici cozumu destekler, yerini almaz.
   Desteklenen: VidMoly, Pichive m.php, RapidVid av()/file:, FullHD scx,
   genel m3u8/mp4/vtt taramasi.
   ========================================================================== */

export function extractVidMoly(html) {
  try {
    const src = String(html || '');
    let m = src.match(/file\s*:\s*["']([^"']+\.m3u8[^"']*)["']/i);
    if (m) return { videoUrl: normUrl(m[1]), isHls: true };
    m = src.match(/https?:\/\/[^"'\s<>]+\.m3u8[^"'\s<>]*/i);
    if (m) return { videoUrl: normUrl(m[0]), isHls: true };
    m = src.match(/file\s*:\s*["']([^"']+\.mp4[^"']*)["']/i);
    if (m) return { videoUrl: normUrl(m[1]), isHls: false };
    return null;
  } catch (_) {
    return null;
  }
}

export function pichiveToMaster(url) {
  try {
    if (!url) return null;
    let u = String(url).replace(/\\\//g, '/');
    if (u.startsWith('//')) u = 'https:' + u;
    if (u.includes('/m.php')) u = u.replace('/m.php?', '/master.m3u8?').replace('/m.php', '/master.m3u8');
    return /^https?:\/\//i.test(u) ? u : null;
  } catch (_) {
    return null;
  }
}

export function extractPichive(html) {
  try {
    const src = String(html || '');
    let m = src.match(/window\.openPlayer\(\s*['"]([^'"]+)['"]/i);
    if (m) {
      const master = pichiveToMaster(m[1]);
      if (master) return { videoUrl: master, isHls: true };
    }
    const files = [...src.matchAll(/"file"\s*:\s*"((?:[^"\\]|\\.)*)"/gi)];
    for (const fm of files) {
      const cand = fm[1].replace(/\\\//g, '/').replace(/\\/g, '');
      if (/master\.m3u8|\/m\.php|\.mp4$/i.test(cand)) {
        const master = pichiveToMaster(cand.startsWith('//') ? 'https:' + cand : cand);
        if (master) return { videoUrl: master, isHls: /\.m3u8/i.test(master) };
      }
    }
    const sm = src.match(/(\/source2\.php\?v=[a-zA-Z0-9]+)/);
    if (sm) return { videoUrl: sm[1], isHls: false, needsOrigin: true };
    const mm = src.match(/https?:\/\/[^\s"'<>\\]*?(?:\/master\.m3u8[^\s"'<>\\]*|\/m\.php[^\s"'<>\\]*)/i);
    if (mm) return { videoUrl: pichiveToMaster(mm[0]), isHls: true };
    return null;
  } catch (_) {
    return null;
  }
}

function b64decodeUnicode(b64) {
  try {
    const clean = String(b64 || '').replace(/\s+/g, '');
    if (typeof atob === 'function') {
      const bin = atob(clean);
      const bytes = Uint8Array.from(bin, (c) => c.charCodeAt(0));
      return new TextDecoder().decode(bytes);
    }
    if (typeof Buffer !== 'undefined') return Buffer.from(clean, 'base64').toString('utf-8');
    return '';
  } catch (_) {
    return '';
  }
}

/** FullHD scx: Caesar(order) + Base64. Python scx_decode ile birebir. */
export function scxDecode(tStr, order) {
  try {
    if (!tStr) return null;
    const o = (Number(order) || 0) % 26;
    let rot = '';
    for (const c of String(tStr)) {
      if (c >= 'a' && c <= 'z') rot += String.fromCharCode(((c.charCodeAt(0) - 97 - o) % 26 + 26) % 26 + 97);
      else if (c >= 'A' && c <= 'Z') rot += String.fromCharCode(((c.charCodeAt(0) - 65 - o) % 26 + 26) % 26 + 65);
      else rot += c;
    }
    let dec = b64decodeUnicode(rot);
    if (dec.startsWith('//')) dec = 'https:' + dec;
    return dec || null;
  } catch (_) {
    return null;
  }
}

export function decodeRapidvidAv(token) {
  try {
    if (!token) return null;
    const clean = String(token).replace(/\+\/=/g, '').replace(/K9L/g, '');
    return b64decodeUnicode(clean) || null;
  } catch (_) {
    return null;
  }
}

export function extractRapidvid(html) {
  try {
    const src = String(html || '');
    let m = src.match(/["']?file["']?\s*:\s*["']([^"']+)["']/i);
    if (m && /^https?:\/\//i.test(m[1].replace(/\\\//g, '/'))) {
      const u = m[1].replace(/\\\//g, '/');
      return { videoUrl: u, isHls: /\.m3u8|\.txt/i.test(u) };
    }
    m = src.match(/\bav\(\s*["']([^"']+)["']\s*\)/);
    if (m) {
      const u = decodeRapidvidAv(m[1]);
      if (u && /^https?:\/\//i.test(u)) return { videoUrl: u, isHls: /\.m3u8|\.txt/i.test(u) };
    }
    m = src.match(/https?:\/\/[^\s"'<>]+\.(?:m3u8|txt)(?:\?[^\s"'<>]*)?/i);
    if (m) return { videoUrl: m[0], isHls: true };
    return null;
  } catch (_) {
    return null;
  }
}

export function extractSubtitles(html) {
  const out = [];
  try {
    const src = String(html || '');
    const re = /["']?file["']?\s*:\s*["']([^"']+\.vtt)["'][^}]*["']?label["']?\s*:\s*["']([^"']+)["']/gi;
    for (const m of src.matchAll(re)) {
      out.push({ label: m[2], src: m[1].replace(/\\\//g, '/') });
    }
  } catch (_) {}
  return out;
}

function normUrl(u) {
  let s = String(u || '').replace(/\\\//g, '/');
  if (s.startsWith('//')) s = 'https:' + s;
  return s;
}

/** Ayiklama sirasi: vidmoly -> pichive -> rapidvid. */
export function extractDirectVideo(html) {
  return extractVidMoly(html) || extractPichive(html) || extractRapidvid(html);
}
