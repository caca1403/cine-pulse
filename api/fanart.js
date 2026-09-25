const TMDB_API_KEY = '4e44d9029b1270a757cddc766a1bcb63';

function pickArtwork(images) {
  if (!Array.isArray(images)) return null;
  return images
    .filter(image => image?.url && /^https?:\/\/assets\.fanart\.tv\//.test(image.url))
    .sort((a, b) => {
      const language = value => value === 'tr' ? 2 : value === 'en' ? 1 : 0;
      return language(b.lang) - language(a.lang) || Number(b.likes || 0) - Number(a.likes || 0);
    })[0]?.url?.replace(/^http:/, 'https:') || null;
}

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  let query = req.query;
  if (!query && req.url) {
    try {
      const parsedUrl = new URL(req.url, 'http://localhost');
      query = Object.fromEntries(parsedUrl.searchParams.entries());
    } catch (_) {}
  }
  const type = query?.type === 'tv' ? 'tv' : query?.type === 'movie' ? 'movie' : null;
  const id = String(query?.id || '');
  if (!type || !/^\d+$/.test(id)) return res.status(400).json({ error: 'Invalid media' });

  const apiKey = process.env.FANART_API_KEY;
  if (!apiKey) return res.status(503).json({ error: 'Fanart API key is not configured' });

  try {
    let fanartId = id;
    if (type === 'tv') {
      const idsResponse = await fetch(`https://api.themoviedb.org/3/tv/${id}/external_ids?api_key=${TMDB_API_KEY}`, { signal: AbortSignal.timeout(5000) });
      if (!idsResponse.ok) throw new Error('TMDB ID lookup failed');
      fanartId = String((await idsResponse.json()).tvdb_id || '');
      if (!/^\d+$/.test(fanartId)) return res.status(200).json({ image: null });
    }

    const response = await fetch(`https://webservice.fanart.tv/v3.2/${type === 'tv' ? 'tv' : 'movies'}/${fanartId}`, {
      headers: { 'api-key': apiKey },
      signal: AbortSignal.timeout(6000)
    });
    if (response.status === 404) return res.status(200).json({ image: null });
    if (!response.ok) throw new Error(`Fanart request failed: ${response.status}`);
    const data = await response.json();
    const thumb = pickArtwork(type === 'tv' ? data.tvthumb : data.moviethumb);
    const logo = pickArtwork(type === 'tv' ? [...(data.hdtvlogo || []), ...(data.clearlogo || [])] : [...(data.hdmovielogo || []), ...(data.movielogo || [])]);
    const background = logo && pickArtwork(type === 'tv' ? data.tvbackground : data.moviebackground);
    res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');
    return res.status(200).json({ image: thumb || background || null, logo: thumb ? null : background ? logo : null });
  } catch (error) {
    return res.status(502).json({ error: error.message });
  }
}
