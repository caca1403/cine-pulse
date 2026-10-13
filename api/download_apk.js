export default async function handler(req, res) {
  const fallbackUrl = 'https://github.com/caca1403/cine-pulse/releases/latest/download/cinepulse.apk';
  try {
    let downloadUrl = fallbackUrl;
    const manifestResponse = await fetch(`https://cinepulse.cinepulse.workers.dev/version.json?_t=${Date.now()}`, {
      headers: { 'User-Agent': 'CinePulse-Updater', 'Cache-Control': 'no-cache' },
      cache: 'no-store'
    });
    if (manifestResponse.ok) {
      const manifest = await manifestResponse.json();
      if (/^https:\/\/github\.com\/caca1403\/cine-pulse\/releases\/download\/v[\d.]+\/cinepulse\.apk$/.test(manifest.downloadUrl || '')) {
        downloadUrl = manifest.downloadUrl;
      }
    }
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    return res.redirect(302, downloadUrl);
  } catch (_) {
    return res.redirect(302, fallbackUrl);
  }
}
