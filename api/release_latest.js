/* ==========================================================================
   /api/release — en son sürümü GitHub Releases'ten OTOMATİK okur.

   Neden var: public/version.json ve public/desktop-version.json dosyaları
   her sürümde elle güncelleniyordu. Unutulduğunda site eski sürümü
   gösteriyordu (ölçüldü: site 1.1.60/1.1.61 gösterirken 1.1.64 yayındavdı).

   Bu uç manifestleri GitHub API'den üretir; dosyalar yalnızca ağ hatasında
   yedek olarak kullanılır. Böylece sürüm yükselttikçe site otomatik güncellenir.
   ========================================================================== */

const REPO = 'caca1403/cine-pulse';
const CACHE_TTL = 5 * 60 * 1000;

let onbellek = { zaman: 0, veri: null };

/** v1.1.64 → 1.1.64 */
function surumuCoz(etiket) {
  return String(etiket || '').replace(/^v/i, '').trim();
}

/** Sürüm dizesini karşılaştırılabilir sayı dizisine çevir (1.1.64 → [1,1,64]) */
function surumSayilari(s) {
  return String(s || '').split(/[.-]/).map((x) => parseInt(x, 10) || 0);
}

/** a > b ise 1, a < b ise -1, eşitse 0 */
function surumKarsilastir(a, b) {
  const x = surumSayilari(a);
  const y = surumSayilari(b);
  for (let i = 0; i < Math.max(x.length, y.length); i++) {
    const d = (x[i] || 0) - (y[i] || 0);
    if (d !== 0) return d > 0 ? 1 : -1;
  }
  return 0;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'public, max-age=300');

  if (Date.now() - onbellek.zaman < CACHE_TTL && onbellek.veri) {
    return res.status(200).json(onbellek.veri);
  }

  try {
    const cevap = await fetch(`https://api.github.com/repos/${REPO}/releases/latest`, {
      headers: {
        Accept: 'application/vnd.github+json',
        'User-Agent': 'CinePulse-VersionProbe'
      },
      signal: AbortSignal.timeout(8000)
    });
    if (!cevap.ok) throw new Error(`github ${cevap.status}`);

    const rel = await cevap.json();
    const etiket = rel.tag_name || '';
    const surum = surumuCoz(etiket);
    if (!/^\d+\.\d+\.\d+/.test(surum)) throw new Error('beklenmeyen etiket biçimi');

    const indir = rel.assets || [];
    const bul = (re) => indir.find((a) => re.test(a.name || ''))?.browser_download_url || '';

    const taban = `https://github.com/${REPO}/releases/download/${etiket}`;
    const apk = bul(/^cinepulse\.apk$/i) || `${taban}/cinepulse.apk`;
    const exe = bul(/Setup.*\.exe$/i) || `${taban}/CinePulse-Setup-${surum}.exe`;
    const deb = bul(/\.deb$/i) || `${taban}/CinePulse-${surum}.deb`;
    const appImage = bul(/\.AppImage$/i) || `${taban}/CinePulse-${surum}.AppImage`;

    // Sürüm düşüşü (rollback) olmasın: depodaki dosya daha yeniyse onu koru.
    const yerel = await yerelSurumler();
    if (yerel?.version && surumKarsilastir(yerel.version, surum) > 0) {
      // GitHub'da eski bir sürüm görünüyor; dosyadaki yeniyi kullanmak daha doğru.
      onbellek = { zaman: Date.now(), veri: yerel };
      return res.status(200).json(yerel);
    }

    const veri = {
      version: surum,
      tag: etiket,
      versionCode: surumSayilari(surum).reduce((a, b) => a * 1000 + b, 0),
      title: rel.name || `CinePulse v${surum}`,
      releaseDate: rel.published_at ? String(rel.published_at).slice(0, 10) : '',
      releaseNotes: rel.body || '',
      prerelease: Boolean(rel.prerelease),
      downloadUrl: apk,
      githubDownloadUrl: apk,
      windowsSetupUrl: exe,
      linuxDebUrl: deb,
      linuxAppImageUrl: appImage,
      desktop: {
        version: surum,
        versionCode: surumSayilari(surum).reduce((a, b) => a * 1000 + b, 0),
        windowsSetupUrl: exe,
        linuxDebUrl: deb,
        linuxAppImageUrl: appImage
      },
      mandatory: false
    };

    onbellek = { zaman: Date.now(), veri };
    return res.status(200).json(veri);
  } catch (hata) {
    // GitHub'a ulaşılamadıysa dosyadaki yedeğe düş (site boş kalmasın).
    const yedek = await yerelSurumler();
    if (yedek) {
      onbellek = { zaman: Date.now(), veri: yedek };
      return res.status(200).json(yedek);
    }
    return res.status(503).json({ error: String(hata.message || hata).slice(0, 120) });
  }
}

let _yerel = null;
async function yerelSurumler() {
  if (_yerel) return _yerel;
  const oku = async (yol) => {
    try {
      const r = await fetch(`${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : ''}${yol}?v=1`, {
        headers: { 'User-Agent': 'CinePulse-VersionProbe' },
        signal: AbortSignal.timeout(4000)
      });
      return r.ok ? await r.json() : null;
    } catch (_) {
      return null;
    }
  };
  const apk = await oku('/version.json');
  const desk = await oku('/desktop-version.json');
  if (!apk && !desk) return null;
  _yerel = { ...(desk || {}), ...(apk || {}) };
  return _yerel;
}