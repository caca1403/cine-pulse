/* FullHDFilmizlesene provider — Scx / RapidVid HLS akışı. */
import { registerProvider } from './providerRegistry.js';
import { fetchFullhdfilmSources } from '../fullhdfilmizleseneScraper.js';

async function fetchSources(args) {
  try {
    const res = await fetchFullhdfilmSources(args);
    return Array.isArray(res) ? res : [];
  } catch (_) {
    return [];
  }
}

registerProvider({
  id: 'fhdf',
  name: 'FullHDFilmizlesene',
  baseUrls: ['https://www.fullhdfilmizlesene.now'],
  priority: 7,
  fetchSources
});

