/* SelcukFlix provider — Pichive HLS / Master akışı. */
import { registerProvider } from './providerRegistry.js';
import { fetchSelcukflixSources } from '../selcukflixScraper.js';

async function fetchSources(args) {
  try {
    const res = await fetchSelcukflixSources(args);
    return Array.isArray(res) ? res : [];
  } catch (_) {
    return [];
  }
}

registerProvider({
  id: 'slc',
  name: 'SelcukFlix',
  baseUrls: ['https://selcukflix.com'],
  priority: 8,
  fetchSources
});

