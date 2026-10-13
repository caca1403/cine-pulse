#!/usr/bin/env node
/* Cihazda temiz sağlayıcıları tek tek, İZ (trace) ile ölçer.
   Kullanım: node tools/cihaz-sag-test.mjs [sağlayıcı ...] */
import { cdpAc } from './cihaz-cdp.mjs';

const HEDEF = process.argv.slice(2).length ? process.argv.slice(2) : ['orion', 'vega', 'luna', 'aria', 'tera', 'atlas', 'corvus'];

const ARGLAR = {
  orion: { type: 'tv', title: 'Stranger Things', originalTitle: 'Stranger Things', season: 1, episode: 3, imdbId: 'tt4574334', tmdbId: 66732 },
  vega: { type: 'tv', title: 'Stranger Things', originalTitle: 'Stranger Things', season: 1, episode: 3 },
  luna: { type: 'tv', title: 'Erkenci Kuş', originalTitle: 'Erkenci Kuş', season: 1, episode: 1 },
  aria: { type: 'anime', title: 'Naruto', originalTitle: 'Naruto', season: 1, episode: 1 },
  tera: { type: 'anime', title: 'Naruto', originalTitle: 'Naruto', season: 1, episode: 1 },
  atlas: { type: 'tv', title: 'Stranger Things', originalTitle: 'Stranger Things', season: 1, episode: 3, tmdbId: 66732 },
  corvus: { type: 'tv', title: 'Stranger Things', originalTitle: 'Stranger Things', season: 1, episode: 3 },
};

const c = await cdpAc();
try {
  for (const id of HEDEF) {
    const arg = ARGLAR[id] || { type: 'tv', title: 'Stranger Things', season: 1, episode: 1 };
    process.stdout.write(`\n═══ ${id} ═══\n`);
    const r = await c.calistir(`window.__cpSag(${JSON.stringify(id)}, ${JSON.stringify(arg)})`);
    if (r.hata) { console.log(`  ✗ ${r.hata}`); continue; }
    console.log(`  ${r.n > 0 ? '✓' : '✗'} ${r.n} kaynak — ${r.ms}ms`);
    for (const k of (r.kaynaklar || []).slice(0, 4)) {
      console.log(`     ${String(k.kat).padEnd(10)} hls:${k.hls ? 'E' : 'H'} iframe:${k.iframe ? 'E' : 'H'} altyazı:${k.altyazi}  ${String(k.url).slice(0, 78)}`);
    }
    const onemli = (r.iz || []).filter((x) => ['alan-adi', 'arama', 'bolum', 'oynatici', 'akis', 'kaynak', 'sonuc', 'hata', 'ham'].includes(x.ad));
    for (const x of onemli) console.log(`     · ${x.ad}: ${JSON.stringify(Object.fromEntries(Object.entries(x).filter(([k]) => !['ad', 't'].includes(k))))}`);
  }
} finally { c.kapat(); }
