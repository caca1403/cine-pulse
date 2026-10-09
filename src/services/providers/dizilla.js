/* Dizilla provider — Cloudstream Dizilla mantigi: TvSeries ONLY.
   Agir is (AES sifreli /api/bg, Pichive iframe) backend'de
   (/api/resolve?provider=dzl) cozulur. Film istekleri gonderilmez. */
import { registerProvider } from './providerRegistry.js';
import { fetchDizillaSources } from '../dizillaScraper.js';

async function fetchSources(args) {
  try {
    // Cloudstream tvTypes disiplini: film tipinde kaynak yok.
    if (args?.type === 'movie') return [];
    const res = await fetchDizillaSources(args);
    return Array.isArray(res) ? res : [];
  } catch (_) {
    return [];
  }
}

registerProvider({
  id: 'dzl',
  name: 'Dizilla',
  baseUrls: ['https://dizilla.now'],
  priority: 3,
  fetchSources
});
