/* ==========================================================================
   CinePulse Studio - Dizilla Scraper (Cloudstream Dizilla mantigi)
   Cloudstream tvTypes = [TvSeries] ONLY: sadece dizi bolumleri.
   Film icin cagri yapilmaz (backend 'series-only' doner).
   Backend dil basina TEK en iyi kaynagi doner (PUB/PUB+ etiketi yok);
   her kayit kendi dil sekmesine gider, kopya satir olusmaz.
   (SetFilm/SelcukFlix HLS'i cift seslidir, onlar kopyalanir; Dizilla
   kayitlari dil ozeldir, kopyalanmaz.)
   ========================================================================== */

import { apiUrl } from './apiOrigin.js';

function cleanTitle(raw) {
  if (!raw) return '';
  return raw
    .replace(/\s*-\s*S\d+E\d+.*$/i, '')
    .replace(/\s*-\s*S\d+.*$/i, '')
    .replace(/\s*\(\d{4}\).*/, '')
    .trim();
}

function loc(path) {
  if (!path || /^https?:\/\//i.test(path)) return path;
  if (typeof window !== 'undefined') {
    const host = window.location?.hostname || '';
    if (host === 'localhost' || host === '127.0.0.1') return path;
  }
  return apiUrl(path);
}

export async function fetchDizillaSources({
  type = 'tv',
  title = '',
  originalTitle = '',
  titles = [],
  season = 1,
  episode = 1
} = {}) {
  // Dizilla dizi-only: film isteklerini backend'e bile gonderme.
  if (type === 'movie') return [];
  const query = cleanTitle(title || originalTitle);
  if (!query) return [];
  const sNum = parseInt(season, 10) || 1;
  const epNum = parseInt(episode, 10) || 1;

  try {
    const qs = new URLSearchParams({
      provider: 'dzl', type: 'tv',
      title: cleanTitle(title), originalTitle: cleanTitle(originalTitle),
      season: String(sNum), episode: String(epNum)
    });
    (titles || []).forEach((t, i) => { if (i < 4 && t) qs.append(`t${i}`, t); });
    const endpoint = loc(`/api/resolve?${qs.toString()}`);
    const res = await fetch(endpoint, { signal: AbortSignal.timeout(15000) }).catch(() => null);
    if (!res || !res.ok) return [];
    const data = await res.json().catch(() => null);
    if (!data || !data.success || !Array.isArray(data.streams)) return [];

    const resultSources = [];

    for (let i = 0; i < data.streams.length; i++) {
      const s = data.streams[i];
      if (!s || !s.streamUrl) continue;

      // Backend 'language' alani tasir (Dublaj/Altyazı); kayit SADECE
      // kendi dil sekmesine gider. Kopyalama yok -> sekme basina tek satir.
      const langTag = `${s.language || ''} ${s.provider || ''}`;
      const isDub = /dublaj|dub/i.test(langTag) && !/altyaz/i.test(s.language || '');
      const category = isDub ? 'dubbed' : 'subtitled';
      const langLabel = isDub ? 'Dublaj' : 'Altyazı';

      const url = loc(s.streamUrl);
      const suf = `s${sNum}e${epNum}`;
      const isHls = Boolean(s.isHls) || /\.m3u8/i.test(s.rawStreamUrl || '') || s.streamUrl.includes('hls_proxy');

      resultSources.push({
        id: `dzl_${category}_${suf}`,
        name: `Dizilla ${langLabel} S${sNum}B${epNum}`,
        displayName: `Dizilla ${langLabel} (1080p)`,
        badge: `🎭 Dizilla ${langLabel} 1080p`,
        source: 'Dizilla',
        url,
        streamUrl: url,
        rawStreamUrl: s.rawStreamUrl,
        quality: '1080p',
        isHls,
        isDirectVideo: !s.isIframe,
        isIframe: Boolean(s.isIframe),
        category,
        type: s.isIframe ? 'embed' : 'direct',
        subtitles: Array.isArray(s.subtitles) ? s.subtitles : [],
        headers: s.headers || null,
        getUrl: () => url
      });
    }

    return resultSources;
  } catch (_) {
    return [];
  }
}
