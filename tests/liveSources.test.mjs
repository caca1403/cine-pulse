import { fetchAllLiveSources, parseM3uPlus, parseTurhanPage, mapGroupToCategory } from '../api/_liveSources.js';
import fs from 'fs';

const m3u = fs.readFileSync('/tmp/opencode/kral.m3u_plus', 'utf8');
const html = fs.readFileSync('/tmp/opencode/dropbox.html', 'utf8');

const p = parseM3uPlus(m3u);
console.log('M3U parse:', p.length);
console.log('  ornek:', JSON.stringify(p[1]));
const withUa = p.filter(x => x.ua || x.ref);
console.log('  UA/ref taşıyan:', withUa.length);
console.log('  kategori dağılımı:', JSON.stringify(p.reduce((a, x) => { const c = mapGroupToCategory(x.group); a[c] = (a[c]||0)+1; return a; }, {})));
console.log('  isTs oranı:', p.filter(x => !/\.m3u8(\?|$)/i.test(x.url)).length, '/', p.length);

const t = parseTurhanPage(html);
console.log('Turhan parse:', t.length);
console.log('  ornek:', JSON.stringify(t[0]));
console.log('  site dağılımı:', JSON.stringify(t.reduce((a, x) => { a[x.site]=(a[x.site]||0)+1; return a; }, {})));

const all = await fetchAllLiveSources();
for (const s of all) {
  console.log(`\n[${s.id}] ok=${s.ok} count=${s.count} ${s.error || ''}`);
  if (s.ok) console.log('   ilk 3:', s.channels.slice(0,3).map(c => `${c.name} [${c.category}] ts=${c.isTs}`).join(' | '));
}