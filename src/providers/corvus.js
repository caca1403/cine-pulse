/* ==========================================================================
   CORVUS — dizi77  (sıfırdan, kit sözleşmesi)

   dizi77 oynatıcıyı şifreli bir JS sayfasına koyar. Çözücü (encryptedPlayer)
   AES + hex katmanını açıp doğrudan m3u8 verir. Çözülemeyen kaynak
   (yalnızca iframe kalan) LİSTELENMEZ.
   ========================================================================== */

import { izleyici, kaynak, medyaMi, m3u8eCevir } from './kit.js';
import { fetchDizi77Sources } from '../services/dizi77Scraper.js';

export const kimlik = { id: 'dizi77', alias: 'Corvus', mediaTypes: ['tv', 'movie'] };

export async function coz({ type = 'tv', title = '', originalTitle = '', titles = [], season = 1, episode = 1, tmdbId = null, signal = null } = {}) {
  const trace = izleyici();
  const s = +season || 1, e = +episode || 1;
  const adaylar = [...new Set([title, originalTitle, ...titles].filter(Boolean))];
  let ham = [];
  try {
    ham = await fetchDizi77Sources({ titles: adaylar, title: adaylar[0] || '', season: s, episode: e });
  } catch (err) {
    trace.koy('hata', { mesaj: String(err).slice(0, 120) });
  }
  trace.koy('ham', { n: (ham || []).length });

  const kaynaklar = [];
  const gorulen = new Set();
  for (const x of ham || []) {
    const u = m3u8eCevir(x.streamUrl || x.url || '');
    if (!u || gorulen.has(u)) continue;
    // iframe / sayfa adresi listelenmez (yalnızca bizim oynatıcıda oynayanlar)
    if (x.isIframe || x.isSayfa || x.isPageEmbed || x.type === 'embed' || x.type === 'iframe') continue;
    if (!(medyaMi(u) || x.isHls || x.isDirectVideo)) continue;
    gorulen.add(u);
    kaynaklar.push(kaynak({
      id: x.id || `d77_${kaynaklar.length}`,
      // ANONİMLİK: site adı etikete sızmaz — yalnız kod adı + teknik bilgi.
      ad: `Corvus ${x.quality || '1080p'} ${(x.category || 'dubbed') === 'dubbed' ? 'Dublaj' : 'Altyazı'}`,
      url: u,
      kategori: x.category || 'dubbed',
      headers: x.headers || { Referer: 'https://dizi77.life/' },
      altyazilar: x.subtitles || [],
      kalite: x.quality || '1080p',
    }));
  }
  trace.koy('sonuc', { n: kaynaklar.length });
  return { sources: kaynaklar, trace: trace.ozet() };
}

export default { apiVersion: 1, id: kimlik.id, name: kimlik.alias, mediaTypes: kimlik.mediaTypes, async resolve(a) { return (await coz(a)).sources; } };
