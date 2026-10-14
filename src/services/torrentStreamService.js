/* ==========================================================================
   CinePulse Studio - Torrent-Eşdeğeri Çok Hatlı Akış Servisi (HIDRA)
   2026-10-14 canlı ölçümleri (hepsi anahtarsız, cihaz ağından 200):
     • videasy.to   714-899ms  — Stremio/P2P motoru; ?language=Turkish SSR'a
                                 giriyor (TR dublaj önceliği oyuncu içinde)
     • vidlink.pro  378-807ms  — tmdb kalıbı /tv/{id}/{s}/{e}; language param
                                 router state'ine işliyor (ölçüldü)
     • multiembed   1.1-1.4sn  — geniş havuz; streamingnow token zinciri
     • 2embed.cc    ~400ms     — ucuz son yedek (EN ağırlıklı)
   ÖLÇÜLÜ ELEME (geri eklemeyin, kanıt /tmp/opencode/vprobe/out/):
     • vidsrc.cc 522/20sn çökük | vidhide* ölü | 2embed.io/vidsrc.xyz DNS ölü
     • torrentio.strem.fun RESMİ ucu sağlam (0.6sn) ama infoHash→magnet liste-
       menin: uygulamada P2P motoru yok, webtor.io anonim API seçilen TR
       hash'te 404 döndü (ölçüldü) → magnet = ölü kaynak kuralı ihlali.
     • turktorrent.us: site ayakta ama arama GİRİŞ DUVARI arkasında (anonim
       0 sonuç, "Oturum Aç"), turktorrent.eu ise squat haber sitesi.
   KURAL: yalnız bizim oynatıcıda (gömülü) AÇILAN hatlar; isimlerde site
   adı yok — anonim "Hidra" kod adı.
   ========================================================================== */

const TR_UA = 'Mozilla/5.0';

/** Torrent havuzlu çoklu oynatıcı hatları — TR dublaj/altyazı öncelikli. */
export async function fetchTorrentStreamSources({
  type = 'movie',
  tmdbId = null,
  title = '',
  season = 1,
  episode = 1,
} = {}) {
  if (!tmdbId) return [];

  const isMovie = type === 'movie';
  const sNum = parseInt(season, 10) || 1;
  const epNum = parseInt(episode, 10) || 1;
  const tipAd = isMovie ? 'Film' : `S${sNum}B${epNum}`;

  // Oyuncu içi altyazı uçları (mevcut yerel + filmde stremio OSv3 aşağıda)
  const subUç = isMovie
    ? `/api/subtitles?tmdbId=${tmdbId}&title=${encodeURIComponent(title || '')}&type=movie`
    : `/api/subtitles?tmdbId=${tmdbId}&title=${encodeURIComponent(title || '')}&season=${sNum}&episode=${epNum}&type=tv`;
  const autoSubs = [{ label: 'OpenSubtitles (Türkçe)', src: subUç }];

  // Hat tanımları: [kod, ad, url, sıra] — hepsi 2026-10-14'te 200 ölçüldü.
  const hatlar = [
    ['tr',  'TR Dublaj Öncelikli',
      isMovie ? `https://player.videasy.to/movie/${tmdbId}?language=Turkish`
              : `https://player.videasy.to/tv/${tmdbId}/${sNum}/${epNum}?language=Turkish`],
    ['alty', 'Altyazılı P2P Havuzu',
      isMovie ? `https://player.videasy.to/movie/${tmdbId}`
              : `https://player.videasy.to/tv/${tmdbId}/${sNum}/${epNum}`],
    ['vlk',  'Vidlink Çoklu Hat',
      isMovie ? `https://vidlink.pro/movie/${tmdbId}?language=Turkish`
              : `https://vidlink.pro/tv/${tmdbId}/${sNum}/${epNum}?language=Turkish`],
    ['mul',  'Multi Havuz',
      isMovie ? `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1`
              : `https://multiembed.mov/?video_id=${tmdbId}&tmdb=1&s=${sNum}&e=${epNum}`],
    ['2e',   'Son Yedek',
      isMovie ? `https://2embed.cc/embed/${tmdbId}`
              : `https://2embed.cc/embedtv/${tmdbId}&s=${sNum}&e=${epNum}`],
  ];

  return hatlar.map(([kod, ad, url], i) => ({
    id: `torrent_p2p_${kod}_${tmdbId}_s${sNum}e${epNum}`,
    name: `Hidra ${ad} (${tipAd})`,
    displayName: `Hidra ${ad}`,
    badge: i === 0 ? '🇹🇷 TR Dublaj' : (kod === 'alty' ? '⚡ P2P 1080p' : 'Çoklu Hat'),
    source: 'Hidra',
    url,
    streamUrl: url,
    quality: '1080p',
    isHls: false,
    isDirectVideo: false,
    isTorrent: true,
    category: (kod === 'tr') ? 'dubbed' : 'subtitled',
    type: 'embed',
    subtitles: autoSubs,
    getUrl: () => url,
  }));
}

/** Film için Stremio OpenSubtitles köprüsünden TR altyazı süzücü yardımcı
 *  (ölçüldü: filmlerde 98 altyazı / 3 TR; dizilerde kapsam zayıf → filmde çağır). */
export async function fetchStremioTurkishSubtitles({ imdbId = null, type = 'movie', season = 1, episode = 1 } = {}) {
  if (!imdbId || !/^tt\d{6,9}$/.test(String(imdbId))) return [];
  try {
    const yol = type === 'movie'
      ? `subtitles/movie/${imdbId}.json`
      : `subtitles/series/${imdbId}/${parseInt(season, 10) || 1}-${parseInt(episode, 10) || 1}.json`;
    const r = await fetch(`https://opensubtitles-v3.strem.io/${yol}`, { headers: { 'User-Agent': TR_UA } });
    if (!r.ok) return [];
    const d = await r.json();
    const liste = d?.subs || d?.subtitles || [];
    return liste
      .filter((s) => /tur/i.test(String(s.lang || '')))
      .slice(0, 4)
      .map((s) => ({ label: s.Sn || s.lang || 'Türkçe', src: s.url || s.Url || '', lang: 'tr' }))
      .filter((s) => /^https?:\/\//.test(s.src));
  } catch (_) { return []; }
}
