export default async function handler(req, res) {
  const fallbackUrl = 'https://github.com/caca1403/cine-pulse/releases/download/v1.1.27/cinepulse.apk';
  try {
    let downloadUrl = fallbackUrl;
    const manifestResponse = await fetch(`https://cine-pulse-drab.vercel.app/version.json?_t=${Date.now()}`, {
      headers: { 'User-Agent': 'CinePulse-Updater', 'Cache-Control': 'no-cache' },
      cache: 'no-store'
    });
    if (manifestResponse.ok) {
      const manifest = await manifestResponse.json();
      if (/^https:\/\/github\.com\/caca1403\/cine-pulse\/releases\/download\/v[\d.]+\/cinepulse\.apk$/.test(manifest.downloadUrl || '')) {
        downloadUrl = manifest.downloadUrl;
      }
    }
    const upstreamRes = await fetch(downloadUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      },
      cache: 'no-store'
    });

    if (!upstreamRes.ok) {
      return res.redirect(302, downloadUrl);
    }

    const arrayBuffer = await upstreamRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader('Content-Type', 'application/vnd.android.package-archive');
    res.setHeader('Content-Disposition', 'attachment; filename="cinepulse.apk"');
    res.setHeader('Content-Length', String(buffer.length));
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    return res.status(200).send(buffer);
  } catch (_) {
    return res.redirect(302, fallbackUrl);
  }
}
