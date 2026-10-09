/* HDFilmCehennemi provider — mevcut python extractor'ın registry sarmalayıcısı.
   Domain değişirse BASES'e ekle, başka kod değişmez. Ağır deobfuscation
   api/hdfc_stream.py + server/hdfc_extractor.py içinde kalır. */
import { registerProvider } from './providerRegistry.js';
import { fetchHdfilmcehennemiSources } from '../hdfilmcehennemiScraper.js';

const BASES = [
  'https://www.hdfilmcehennemi.nl',
  'https://hdfilmcehennemi.mobi',
  'https://www.hdfilmcehennemi.now'
];

async function fetchSources(args) {
  try {
    return await fetchHdfilmcehennemiSources(args);
  } catch (_) {
    return [];
  }
}

registerProvider({
  id: 'hdfc',
  name: 'HDFilmCehennemi',
  baseUrls: BASES,
  priority: 0,
  fetchSources
});
