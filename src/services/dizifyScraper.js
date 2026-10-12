import { akilliGet } from './nativeHttp.js';
import { isStrictMediaTitleMatch } from './mediaMatcher.js';

const BASE = 'https://dizify.org';
const API = `${BASE}/api/v1`;
async function getJson(path) {
  const text = await akilliGet(`${API}${path}`, { ref: `${BASE}/`, timeout: 10000, headers: { Accept: 'application/json' } });
  try { return JSON.parse(text); } catch (_) { return null; }
}

/** Search, detail and exact episode identity are separate JSON API operations. */
export async function fetchDizifySources({ title = '', originalTitle = '', titles = [], type = 'movie', mediaType, tmdbId = '', season = 1, episode = 1 } = {}) {
  const kind = mediaType || type;
  const candidates = [...new Set([title, originalTitle, ...titles].filter(Boolean))];
  for (const query of candidates.slice(0, 4)) {
    const search = await getJson(`/search?q=${encodeURIComponent(query)}`);
    const items = kind === 'movie' ? search?.data?.movies : search?.data?.series;
    if (!Array.isArray(items)) continue;
    const match = items.find(item => tmdbId && String(item.tmdb_id) === String(tmdbId))
      || items.find(item => isStrictMediaTitleMatch(item.title || item.name || '', candidates));
    if (!match) continue;
    const slug = match.slug || String(match.url || '').split('/').filter(Boolean).pop();
    if (!slug) continue;
    let sourcePath;
    if (kind === 'movie') sourcePath = `/movies/${encodeURIComponent(slug)}/sources`;
    else {
      const detail = await getJson(`/series/${encodeURIComponent(slug)}`);
      const selectedSeason = detail?.data?.seasons?.find(item => Number(item.season_number) === Number(season));
      const selectedEpisode = selectedSeason?.episodes?.find(item => Number(item.episode_number) === Number(episode));
      if (!selectedEpisode?.id) continue;
      sourcePath = `/episodes/${encodeURIComponent(selectedEpisode.id)}/sources`;
    }
    const sources = await getJson(sourcePath);
    if (!Array.isArray(sources?.data)) continue;
    return sources.data.filter(source => source.url).map((source, index) => {
      const url = new URL(source.url, BASE).href;
      const direct = /\.(m3u8|mp4|mkv|webm)(?:[?#]|$)/i.test(url);
      const isDub = /dublaj|dub/i.test(source.audio_type || source.label || '');
      return { id: `dzyf_${slug}_${index}`, name: source.label || 'Dizify', displayName: source.label || 'Dizify', source: 'Dizify',
        url, streamUrl: url, referer: `${BASE}/`, quality: source.quality || '', category: isDub ? 'dubbed' : 'subtitled',
        isIframe: !direct, isDirectVideo: direct, isHls: /\.m3u8/i.test(url), type: direct ? 'direct' : 'embed', subtitles: source.subtitles || [] };
    });
  }
  return [];
}
