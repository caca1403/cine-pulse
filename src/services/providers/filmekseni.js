/* FilmEkseni provider — duvarsiz JSON API + VidMoly/Eksenload.
   Agir is api/filmekseni.py icinde kalir. */
import { registerProvider } from './providerRegistry.js';
import { fetchFilmekseniSources } from '../filmekseniScraper.js';

registerProvider({
  id: 'fxs',
  name: 'FilmEkseni',
  baseUrls: ['https://filmekseni.vip'],
  priority: 6,
  fetchSources: async (args) => {
    try {
      return await fetchFilmekseniSources(args || {});
    } catch (_) {
      return [];
    }
  }
});
