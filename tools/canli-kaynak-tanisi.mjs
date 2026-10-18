#!/usr/bin/env node
/* ==========================================================================
   Canlı kaynak TANISI (test değil) — gerçek Kral/İzlego/Turhan listelerini
   çeker ve kanal havuzunun kaç kayıt ürettiğini, yabancı sızıntı olup
   olmadığını, yedek yayın sayısını konsola yazar.

   Kullanım:  node tools/canli-kaynak-tanisi.mjs
   Ağ gerekir. Kuralların DOĞRULAMASI tests/liveSources.test.mjs içindedir.
   ========================================================================== */

import { parseKralChannels, KRAL_M3U_ENDPOINT, fetchAllLiveSources } from '../api/_liveSources.js';
import { buildChannels } from '../src/services/canli/turkishLiveSources.js';

const ham = parseKralChannels(await (await fetch(KRAL_M3U_ENDPOINT)).text());
console.log(`Kral M3U ham kayıt: ${ham.length} (HLS: ${ham.filter(c => /\.m3u8(\?|#|$)/i.test(c.streamUrl || '')).length}, TS/uzantısız: ${ham.filter(c => c.isTs).length})`);

const havuz = buildChannels([{ id: 'kral', label: 'Kral', channels: ham }], {});
const adlar = havuz.map(c => c.name);
const normal = (s) => s.toLocaleUpperCase('tr-TR').replace(/[^A-Z0-9]/g, '');
const grup = new Map();
for (const c of havuz) grup.set(normal(c.name), (grup.get(normal(c.name)) || 0) + 1);

console.log(`Havuz: ${havuz.length} kanal | yedekli: ${havuz.filter(c => (c.altStreams || []).length).length}`);
console.log('DMAX/TLC/Discovery:', ['DMAX', 'TLC', 'DISCOVERY'].map(a => `${a}:${adlar.filter(n => n.includes(a)).length}`).join(' '));
console.log('Yabancı önek sızıntısı:', adlar.filter(n => /^(DE|EN|US|NL|FR|AR|RU)[:|-]/i.test(n)).join(', ') || 'yok');
console.log('Aynı kanal iki kez:', [...grup].filter(([, n]) => n > 1).map(([k, n]) => `${k}x${n}`).join(', ') || 'yok');
console.log('İlk 20:', adlar.slice(0, 20).join(' | '));

const tum = await fetchAllLiveSources();
for (const s of tum) console.log(`[${s.id}] ok=${s.ok} count=${s.count} ${s.error || ''}`);
