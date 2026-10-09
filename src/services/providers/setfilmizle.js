/* SetFilmizle provider — eklenti mantigi: FastPlay / SetPlay sekmeleri ayri kaynak.
   Agir is (WP arama + admin-ajax video) backend'de (/api/resolve?provider=setf) cozulur.
   Player adi degisirse backend PLAYER_LABELS'e ekle, baska kod degismez. */
import { registerProvider } from './providerRegistry.js';
import { fetchSetfilmSources } from '../setfilmScraper.js';

async function fetchSources(args) {
  try {
    const res = await fetchSetfilmSources(args);
    // Backend zaten FastPlay/SetPlay/CloseLoad/Rapid etiketli doner;
    // kategori bilgisini koru, registry dagitimi icin aynen gecir.
    return Array.isArray(res) ? res : [];
  } catch (_) {
    return [];
  }
}

registerProvider({
  id: 'setf',
  name: 'SetFilmizle',
  baseUrls: ['https://www.setfilmizle.ltd'],
  priority: 9,
  fetchSources
});
