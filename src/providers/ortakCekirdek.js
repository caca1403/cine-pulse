/* ==========================================================================
   CinePulse — birinci taraf çekirdekler için ORTAK yardımcılar
   --------------------------------------------------------------------------
   Bu dosya yalnız bizim elle yazdığımız çekirdeklerindir (vendor çekirdekleri
   kendi başına yaşar). Kural: gerçek site adı burada DA YOK — istekler rota
   kodu üzerinden atılır (`/api/<kod>/...`); adres haritası yapılandırma
   dosyalarındadır (cihazda native-routes.json, webde worker).

   Vekil sözleşmesi (bkz. vekil.js SÖZLEŞME): çekirdekler `fetch`i köprülenmiş
   halde bulur; biz yalnız göreli `/api/...` veya mutlak adres isteriz.
   ========================================================================== */

/* TMDB anahtarı: uygulamanın her yerinde gömülüdür (PlayerModal, traktService
   aynı deseni kullanır). Başlık eşleştirme için tr-TR diliyle okunur. */
const TMDB_ANAHTAR = '4e44d9029b1270a757cddc766a1bcb63';

export function zamanAsimi(ms) {
  try {
    return typeof AbortSignal !== 'undefined' && typeof AbortSignal.timeout === 'function'
      ? AbortSignal.timeout(ms)
      : undefined;
  } catch (_) {
    return undefined;
  }
}

/** Basit düz-metin GET; hata boş string döner (çekirdekler denemeye devam eder). */
export async function metinAl(adres, { ref = '', ms = 10000, basliklar = {} } = {}) {
  try {
    const yanit = await fetch(adres, {
      headers: { Accept: 'text/html,application/xhtml+xml,*/*', ...basliklar, ...(ref ? { Referer: ref } : {}) },
      signal: zamanAsimi(ms),
    });
    if (!yanit.ok) return '';
    return await yanit.text();
  } catch (_) {
    return '';
  }
}

export async function jsonAl(adres, { ref = '', ms = 10000, govde = null, basliklar = {} } = {}) {
  try {
    const yanit = await fetch(adres, {
      method: govde == null ? 'GET' : 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        ...(govde != null ? { 'Content-Type': 'application/json' } : {}),
        ...basliklar,
        ...(ref ? { Referer: ref } : {}),
      },
      body: govde == null ? undefined : (typeof govde === 'string' ? govde : JSON.stringify(govde)),
      signal: zamanAsimi(ms),
    });
    if (!yanit.ok) return null;
    return await yanit.json();
  } catch (_) {
    return null;
  }
}

/** CP-1254 gibi eski kodlamalı JSON'lar için bayt tabanlı okuma; UTF-8 bozuksa
 *  windows-1254 → latin1 ile tekrar çözer. */
export async function jsonBayt(adres, { ref = '', ms = 10000, govde = null, basliklar = {} } = {}) {
  try {
    const yanit = await fetch(adres, {
      method: govde == null ? 'GET' : 'POST',
      headers: {
        Accept: 'application/json, text/plain, */*',
        ...(govde != null ? { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' } : {}),
        ...basliklar,
        ...(ref ? { Referer: ref } : {}),
      },
      body: govde == null ? undefined : govde,
      signal: zamanAsimi(ms),
    });
    if (!yanit.ok) return null;
    const bayt = new Uint8Array(await yanit.arrayBuffer());
    let metin;
    try {
      metin = new TextDecoder('utf-8', { fatal: true }).decode(bayt);
    } catch (_) {
      try { metin = new TextDecoder('windows-1254').decode(bayt); }
      catch (_) { metin = new TextDecoder('latin1').decode(bayt); }
    }
    return JSON.parse(metin);
  } catch (_) {
    return null;
  }
}

/**
 * Rota yolu kurar: rotaYol('hdfc', '/dizi/x', { s: 1 }) → '/api/hdfc/dizi/x?s=1'.
 * Cihazda WebView bu göreli isteği yerel vekile çevirir; webde worker karşılar.
 */
export function rotaYol(kod, yol = '', paramlar = null) {
  let u = `/api/${kod}${yol && !yol.startsWith('/') ? '/' : ''}${yol}`;
  if (paramlar && Object.keys(paramlar).length) {
    const q = Object.entries(paramlar)
      .filter(([, d]) => d !== undefined && d !== null && d !== '')
      .map(([a, d]) => `${encodeURIComponent(a)}=${encodeURIComponent(d)}`)
      .join('&');
    if (q) u += (u.includes('?') ? '&' : '?') + q;
  }
  return u;
}

const TMDB_ONBELLEK = new Map();
const TMDB_UCUSTA = new Map();

/**
 * TMDB bilgi önbelleğini eldeki kart/detay verisiyle önceden doldurur;
 * böylece çok sayıda çekirdek aynı anda TMDB API'sine yığılmaz.
 */
export function tmdbBilgiTohumla({ tmdbId = '', imdbId = '', baslik = '', orijinal = '', yil = null, tur = 'movie' } = {}) {
  const tip = String(tur || '').toLowerCase() === 'tv' ? 'tv' : 'movie';
  const b = String(baslik || '').trim();
  const o = String(orijinal || '').trim();
  if (!b && !o) return;
  const tid = String(tmdbId || '').replace(/^(ddz_|dml_)/, '').trim();
  const iid = String(imdbId || '').trim();
  const parsedYil = parseInt(String(yil || ''), 10) || null;
  const numTid = /^\d+$/.test(tid) ? Number(tid) : null;
  const keys = [];
  if (tid) keys.push(`${tip}:${tid}`);
  if (/^tt\d{5,10}$/i.test(iid)) keys.push(`${tip}:${iid}`);
  for (const k of keys) {
    const mevcut = TMDB_ONBELLEK.get(k);
    TMDB_ONBELLEK.set(k, {
      baslik: b || mevcut?.baslik || o,
      orijinal: o || mevcut?.orijinal || b,
      yil: parsedYil || mevcut?.yil || null,
      tmdbId: numTid || mevcut?.tmdbId || null,
    });
  }
}

async function unifiedCacheYedekOku(no) {
  try {
    const cache = globalThis?.__NUVIO_TMDB_UNIFIED_CACHE__;
    if (!cache || typeof cache !== 'object') return null;
    for (const [k, rawVal] of Object.entries(cache)) {
      if (!k.includes(String(no))) continue;
      const val = await Promise.resolve(rawVal).catch(() => null);
      if (val && Array.isArray(val.titles) && val.titles.length > 0) {
        return {
          baslik: String(val.titles[0] || '').trim(),
          orijinal: String(val.titles[1] || val.titles[0] || '').trim(),
          yil: null,
          tmdbId: /^\d+$/.test(String(no)) ? Number(no) : null,
        };
      }
    }
  } catch (_) {}
  return null;
}

/**
 * TMDB kimliğini içerik bilgisine çevirir: sayısal TMDB no veya tt… numarası.
 * → { baslik, orijinal, yil, tmdbId } | null
 */
export async function tmdbBilgi(kimlik, tur = 'movie', ms = 9000) {
  const no = String(kimlik || '').trim();
  if (!no && no !== 0) return null;
  const tip = tur === 'tv' ? 'tv' : 'movie';
  const anahtar = `${tip}:${no}`;
  if (TMDB_ONBELLEK.has(anahtar)) {
    return TMDB_ONBELLEK.get(anahtar);
  }
  if (TMDB_UCUSTA.has(anahtar)) {
    return TMDB_UCUSTA.get(anahtar);
  }

  const istek = (async () => {
    let veri = null;
    if (/^tt\d{5,10}$/.test(no)) {
      veri = await jsonAl(
        `https://api.themoviedb.org/3/find/${no}?api_key=${TMDB_ANAHTAR}&language=tr-TR&external_source=imdb_id`,
        { ms }
      );
      const ilk = veri && (tip === 'tv' ? veri.tv_results : veri.movie_results)?.[0];
      veri = ilk || null;
    } else if (/^\d+$/.test(no)) {
      veri = await jsonAl(
        `https://api.themoviedb.org/3/${tip}/${no}?api_key=${TMDB_ANAHTAR}&language=tr-TR`,
        { ms }
      );
    }
    if (!veri) {
      return await unifiedCacheYedekOku(no);
    }
    const yilKaynagi = veri.release_date || veri.first_air_date || veri.production_year || '';
    const sonuc = {
      baslik: String(veri.title || veri.name || '').trim(),
      orijinal: String(veri.original_title || veri.original_name || '').trim(),
      yil: parseInt(String(yilKaynagi).slice(0, 4), 10) || null,
      tmdbId: veri.id || (tip === 'tv' ? veri.tv_results?.[0]?.id : null) || (/^\d+$/.test(no) ? Number(no) : null),
    };
    if (sonuc.baslik || sonuc.orijinal) {
      TMDB_ONBELLEK.set(anahtar, sonuc);
      if (sonuc.tmdbId) TMDB_ONBELLEK.set(`${tip}:${sonuc.tmdbId}`, sonuc);
      return sonuc;
    }
    return null;
  })().finally(() => {
    TMDB_UCUSTA.delete(anahtar);
  });

  TMDB_UCUSTA.set(anahtar, istek);
  return istek;
}

/* ── Türkçe başlık/slug yardımcıları ───────────────────────────────────── */

const HARITA = { ı: 'i', İ: 'i', ğ: 'g', Ģ: 'g', ü: 'u', ş: 's', Ş: 's', ö: 'o', ç: 'c', Ç: 'c', â: 'a', î: 'i', û: 'u' };

/** Türkçe harfleri sadeleştirir; bölük-pörçük işareti atar; çok boşluğu tekler. */
export function sadeles(s) {
  return String(s || '')
    .replace(/[ıİğĞüÜşŞöÖçÇâîû]/g, h => HARITA[h] || h.toLowerCase())
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

/** TMDB başlıklarından arama adayları: orijinal önce (TR siteler de orijinal
    adla indexler), sonra TR ad, sonra iki nokta/parantez temizlenmişi. */
export function adayBasliklar(bilgi) {
  const ham = [bilgi?.orijinal, bilgi?.baslik].filter(Boolean);
  const temizler = [
    ...ham,
    ...ham.map(h => h.replace(/[:\-–—!?.]/g, ' ').replace(/\s+/g, ' ').trim()),
    ...ham.map(h => h.replace(/\s*\(\d{4}\)\s*$/, '').trim()),
  ];
  return [...new Set(temizler.filter(t => t && t.length >= 2))];
}

/** Site slug'ına çevirir: "The Office (US)" → "the-office-us". Siteden siteye
    küçük fark olur; çekirdek gerekirse kendi kalıbını uygular. */
export function slugla(s) {
  return sadeles(s)
    .replace(/&/g, ' and ')
    .replace(/['’`]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/** Yıl-uyumu: site sonucu ile TMDB yılı ±1 içinde uyuşur mu? Yıl yoksa geç. */
export function yilUyar(sozYil, hedefYil) {
  if (!hedefYil) return true;
  const s = parseInt(String(sozYil || '').match(/\d{4}/)?.[0] || '', 10);
  return !s || Math.abs(s - hedefYil) <= 1;
}

/* ── HTML yardımcılarının en küçüğü ────────────────────────────────────── */

/* ── Yayın adresi yardımcıları ─────────────────────────────────────────── */

/** Bazı sunucular master'ı .txt olarak sunar; oynatıcı .m3u8 bekler. */
export function m3u8eCevir(url) {
  return String(url || '')
    .replace(/\/txt\/master\.txt/i, '/master.m3u8')
    .replace(/\/master\.txt/i, '/master.m3u8')
    .replace(/\.txt(?=[?#]|$)/i, '.m3u8');
}

/** Master metninden kalite etiketi: "1080p" yazısı veya RESOLUTION=..xYükseklik. */
export function kaliteEtiket(metin) {
  const p = [...String(metin || '').matchAll(/(\d{3,4})p/gi)].map(m => +m[1]);
  const r = [...String(metin || '').matchAll(/RESOLUTION=\d+x(\d{3,4})/gi)].map(m => +m[1]);
  const en = Math.max(0, ...p, ...r);
  return en >= 2160 ? '4K' : en >= 1080 ? '1080p' : en >= 720 ? '720p' : en >= 480 ? '480p' : en ? '360p' : '';
}

/** Regex'in ilk eşleşmesindeki grubu döner (yoksa ''). */
export function ilki(html, kalip, grup = 1) {
  const m = String(html || '').match(kalip);
  return m && m[grup] != null ? m[grup] : '';
}

export function hepsi(html, kalip, grup = 1) {
  return [...String(html || '').matchAll(new RegExp(kalip, kalip.flags.includes('g') ? kalip.flags : kalip.flags + 'g'))]
    .map(m => (m[grup] != null ? m[grup] : ''))
    .filter(Boolean);
}

/** HTML5 veri özniteliği okur (text/html içindeki &quot; vb. kaçışları çözer). */
export function veriOznitelik(html, ad) {
  const ham = ilki(html, new RegExp(`${ad}\\s*=\\s*"([^"]*)"|${ad}\\s*=\\s*'([^']*)'`, 'i'));
  return ham ? ham.replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>') : '';
}
