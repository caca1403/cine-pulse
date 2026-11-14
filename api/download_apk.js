/* ==========================================================================
   /api/download_apk (+ /cinepulse.apk) — APK'yı sunucu üzerinden AKITAR.
   Eski davranış (302 GitHub'a yönlendirme) GitHub engelli ağlarda
   (TR ISS'leri döneminde objects.githubusercontent.com tıkanır) indirmeyi
   sessizce öldürüyordu. Artık baytlar buradan geçer; upstream tutmazsa
   yine 302'ye düşer. DownloadManager'a Content-Length + tek dosya adı
   verilir; istek fragment/örnek indirme olmayan düz GET'tir.
   ========================================================================== */

const REPO = 'caca1403/cine-pulse';
const FALLBACK_URL = `https://github.com/${REPO}/releases/latest/download/cinepulse.apk`;
const UA = 'CinePulse-Updater (APK relay)';
const CACHE_TTL = 5 * 60 * 1000;

let onbellek = { zaman: 0, url: '' };

/** En güncel yayın etiketindeki gerçek APK asset URL'ini çöz. */
async function apkUrlCoz() {
  if (Date.now() - onbellek.zaman < CACHE_TTL && onbellek.url) return onbellek.url;
  let url = FALLBACK_URL;
  try {
    const cevap = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, {
      headers: { Accept: 'application/vnd.github+json', 'User-Agent': UA },
      signal: (globalThis.AbortSignal?.timeout ? AbortSignal.timeout(8000) : undefined)
    });
    if (cevap.ok) {
      const rel = await cevap.json();
      const asset = (rel.assets || []).find((a) => /^cinepulse\.apk$/i.test(a.name || ''));
      if (asset?.browser_download_url) url = asset.browser_download_url;
      else if (rel.tag_name) url = `https://github.com/${REPO}/releases/download/${rel.tag_name}/cinepulse.apk`;
    }
  } catch (_) { /* fallback URL */ }
  onbellek = { zaman: Date.now(), url };
  return url;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const hedef = await apkUrlCoz();
    const upstream = await fetch(hedef, {
      redirect: 'follow',
      headers: {
        'User-Agent': UA,
        Accept: 'application/vnd.android.package-archive,*/*'
      }
    });

    if (!upstream.ok || !upstream.body) {
      // Upstream açılmadı: tarayıcı/native katmanı yine de deneyebilsin diye
      // doğrudan GitHub'a yönlendir (eski davranış).
      return res.redirect(302, FALLBACK_URL);
    }

    res.setHeader('Content-Type', 'application/vnd.android.package-archive');
    res.setHeader('Content-Disposition', 'attachment; filename="cinepulse.apk"');
    res.setHeader('Cache-Control', 'no-store');
    const uzunluk = upstream.headers.get('content-length');
    if (uzunluk) res.setHeader('Content-Length', uzunluk);

    // Baytları kesintisiz aktar (Workers/Vercel stream destekler).
    const reader = upstream.body.getReader();
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      res.write(Buffer.from(value));
      // Okunabilirliği sürdürmek için geri basınç yönetimi Node tarafında
      // halledilir; burada sadece akışı boşaltıyoruz.
    }
    return res.end();
  } catch (hata) {
    if (!res.headersSent) {
      return res.redirect(302, FALLBACK_URL);
    }
    try { res.end(); } catch (_) {}
    return null;
  }
}
