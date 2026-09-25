export default async function handler(req, res) {
  const fallbackUrl = 'https://github.com/caca1403/cine-pulse/releases/latest/download/cinepulse.apk';
  try {
    const upstreamRes = await fetch(fallbackUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
      }
    });

    if (!upstreamRes.ok) {
      return res.redirect(302, fallbackUrl);
    }

    const arrayBuffer = await upstreamRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    res.setHeader('Content-Type', 'application/vnd.android.package-archive');
    res.setHeader('Content-Disposition', 'attachment; filename="cinepulse.apk"');
    res.setHeader('Content-Length', String(buffer.length));
    res.setHeader('Accept-Ranges', 'bytes');
    res.setHeader('Cache-Control', 'public, max-age=1800, s-maxage=3600');
    return res.status(200).send(buffer);
  } catch (_) {
    return res.redirect(302, fallbackUrl);
  }
}
