#!/usr/bin/env node
/* Telefonda GERÇEK sağlayıcı taraması: uygulamanın kendi kod yolu,
   cihazın kendi ağı. Sonuçları JSON'a yazar. */
import { writeFileSync, mkdirSync } from 'node:fs';
import { cdpAc } from './cihaz-cdp.mjs';

const CIKTI = process.argv[2] || '/tmp/opencode/sweep';
mkdirSync(CIKTI, { recursive: true });

const HEDEFLER = [
  { ad: 'stranger-things', title: 'Stranger Things', originalTitle: 'Stranger Things', type: 'tv', season: 1, episode: 3, tmdbId: 66732, imdbId: 'tt4574334', sure: 90000 },
  { ad: 'interstellar', title: 'Yıldızlararası', originalTitle: 'Interstellar', type: 'movie', tmdbId: 157336, imdbId: 'tt0816692', sure: 90000 }
];

const c = await cdpAc();
try {
  for (const h of HEDEFLER) {
    console.log(`\n═══ ${h.ad} — ${h.title} ${h.type}${h.season ? ` S${h.season}B${h.episode}` : ''} ═══`);
    const bas = Date.now();
    const sonuc = await c.calistir(`window.__cpSweep(${JSON.stringify(h)})`);
    writeFileSync(`${CIKTI}/${h.ad}.json`, JSON.stringify(sonuc, null, 2));
    const calisan = sonuc.ozet.filter((o) => o.n > 0);
    const bos = sonuc.ozet.filter((o) => o.n === 0);
    console.log(`  süre ${Math.round((Date.now() - bas) / 1000)}sn | ${sonuc.saglayici} sağlayıcı | ${sonuc.kaynak} kaynak`);
    console.log(`  ── KAYNAK DÖNENLER (${calisan.length}) ──`);
    for (const o of calisan) console.log(`    ${o.id.padEnd(16)} ${String(o.n).padStart(2)} ${o.kat.padEnd(18)} ${o.ornek[0]?.url?.slice(0, 70) || ''}`);
    console.log(`  ── BOŞ DÖNENLER (${bos.length}) ──`);
    const gruplar = {};
    for (const o of bos) { const k = o.hata || 'bos'; (gruplar[k] = gruplar[k] || []).push(o.id); }
    for (const [k, v] of Object.entries(gruplar)) console.log(`    ${k.padEnd(28)} ${v.join(', ')}`);
  }
  writeFileSync(`${CIKTI}/hepsi.json`, JSON.stringify({ bitti: new Date().toISOString() }, null, 2));
} finally { c.kapat(); }
