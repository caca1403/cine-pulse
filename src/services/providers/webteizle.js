/* Webteizle provider — eklenti mantigi, SezonlukDizi ile ayni akis:
   slug sayfa -> alternatif player'lar -> embed (VidMoly/Filemoon/Pixel/Okru/CloseLoad/Rapid).
   Agir is backend'de (/api/resolve?provider=wtz, fallback /api/webteizle_stream) cozulur. */
import { registerProvider } from './providerRegistry.js';
import { fetchWebteizleSources } from '../webteizleScraper.js';

async function fetchSources(args) {
  try {
    if (args?.type && args.type !== 'movie') return [];
    const dubs = await fetchWebteizleSources({ ...args, type: 'movie', isDub: true }).catch(() => []);
    const subs = await fetchWebteizleSources({ ...args, type: 'movie', isDub: false }).catch(() => []);
    const out = [];
    for (const s of [...(dubs || []), ...(subs || [])]) {
      if (!s) continue;
      out.push({
        ...s,
        category: s.category || (/dublaj/i.test(s.name || '') ? 'dubbed' : 'subtitled')
      });
    }
    return out;
  } catch (_) {
    return [];
  }
}

registerProvider({
  id: 'wtz',
  name: 'WTZ',
  baseUrls: ['https://webteizle.info'],
  priority: 9,
  fetchSources
});
