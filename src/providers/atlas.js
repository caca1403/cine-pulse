/* ==========================================================================
   ATLAS — Dizisol  ("lokum")

   Dizisol API'si doğrudan 1080p HLS (+altyazı) verir. Cihaz yolu:
   dizisol.com/api/... → /api/hls_proxy (yerel geçit) → m3u8.
   IFRAME YOK: yalnızca doğrudan medya listelenir.
   ========================================================================== */

import { izleyici, kaynak, medyaMi, m3u8eCevir, mutlak } from './kit.js';
import { fetchDizisolMovieSources, fetchDizisolEpisodeSources } from '../services/dizisolScraper.js';

export const kimlik = { id: 'dzs', alias: 'Atlas', mediaTypes: ['movie', 'tv'] };

function cevir(ham, gorulen) {
  const out = [];
  const proxyIci = (u) => {
    const m = String(u).match(/[?&]url=([^&]+)/);
    return m ? decodeURIComponent(m[1]) : '';
  };
  for (const s of ham || []) {
    const u = m3u8eCevir(s.streamUrl || s.url || '');
    if (!u) continue;
    const ic = proxyIci(u);
    const proxyMi = /^\/api\/|hls_proxy|mkv_stream|stream_proxy|\/api\/dzs/i.test(u);
    if (!(medyaMi(u) || medyaMi(ic) || proxyMi || s.isHls || s.isDirectVideo)) continue;
    if (gorulen.has(u)) continue;
    gorulen.add(u);
    out.push(kaynak({
      id: s.id || `dzs_${out.length}`,
      // ANONİMLİK: eski scraper'ın displayName'i site adını taşıyabiliyor →
      // etiket yalnızca kod adından + teknik bilgiden üretilir.
      ad: `Atlas ${s.quality || '1080p'} ${(s.category || (s.isDub === true ? 'dubbed' : 'subtitled')) === 'dubbed' ? 'Dublaj' : 'Altyazı'}`,
      url: u,
      kategori: s.category || (s.isDub === true ? 'dubbed' : 'subtitled'),
      headers: s.headers || { Referer: 'https://dizisol.com/' },
      altyazilar: (s.subtitles || []).map((x) => ({ label: x.label || 'Türkçe', src: mutlak(x.src || x.url || '', 'https://dizisol.com'), url: mutlak(x.src || x.url || '', 'https://dizisol.com') })),
      kalite: s.quality || '1080p',
    }));
  }
  return out;
}

export async function coz({ type = 'movie', title = '', originalTitle = '', titles = [], season = 1, episode = 1, tmdbId = null, imdbId = null, signal = null } = {}) {
  const trace = izleyici();
  const s = +season || 1, e = +episode || 1;
  // İptal sinyali kabul ediyorsak ALT kazıyıcıya da geçir (iptal yayılımı).
  const ortak = { title: title || originalTitle, originalTitle, titles, tmdbId, imdbId, season: s, episode: e, signal };
  let ham = [];
  try {
    ham = type === 'movie'
      ? await fetchDizisolMovieSources(ortak)
      : await fetchDizisolEpisodeSources(ortak);
  } catch (err) {
    trace.koy('hata', { mesaj: String(err).slice(0, 120) });
  }
  trace.koy('ham', { n: (ham || []).length });
  const kaynaklar = cevir(ham, new Set());
  trace.koy('sonuc', { n: kaynaklar.length });
  return { sources: kaynaklar, trace: trace.ozet() };
}

export default { apiVersion: 1, id: kimlik.id, name: kimlik.alias, mediaTypes: kimlik.mediaTypes, async resolve(a) { return (await coz(a)).sources; } };
