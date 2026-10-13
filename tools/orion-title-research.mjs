#!/usr/bin/env node
// Live search evidence, not playback certification. Uses curl transport to
// inspect site responses independently of the APK network/decoder layers.
import fs from 'node:fs/promises';
import path from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import vm from 'node:vm';
import { setTimeout as delay } from 'node:timers/promises';
const exec = promisify(execFile);
const output = process.argv[2] || '/tmp/opencode/orion-100';
await fs.mkdir(output, { recursive: true });
const groups = JSON.parse(await fs.readFile(new URL('./orion-title-cases.json', import.meta.url)));
const cases = Object.entries(groups).flatMap(([group, rows]) => rows.map(([title, originalTitle, type]) => ({ group, title, originalTitle, type: type || (group === 'film' ? 'movie' : 'tv') })));
if (cases.length !== 100) throw new Error(`Expected 100 cases, got ${cases.length}`);
const base = process.env.ORION_RESEARCH_ORIGIN || 'https://www.hdfilmcehennemi.nl';

// Evaluate the actual provider's pure search helpers, without adding a test
// export to the production provider or replacing its network implementation.
const provider = await fs.readFile(new URL('../src/providers/orion.js', import.meta.url), 'utf8');
const helpers = provider.slice(provider.indexOf('function aramaSonuclari('), provider.indexOf('function bolumBaglantisi('));
const context = vm.createContext({ duzMetin: s => String(s || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() });
vm.runInContext(helpers, context);
const slug = s => s.toLowerCase().replace(/ı/g,'i').replace(/ş/g,'s').replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ö/g,'o').replace(/ç/g,'c').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
async function fetchSearch(query) {
  const url = `${base}/search/?q=${encodeURIComponent(query)}`;
  const { stdout } = await exec('curl', ['-sS', '--max-time', '12', '-A', 'Mozilla/5.0 Chrome/124', '-H', 'X-Requested-With: fetch', '-e', base+'/', url, '-w', '\n%{http_code}'], { maxBuffer: 4*1024*1024 });
  const idx = stdout.lastIndexOf('\n');
  return { status: Number(stdout.slice(idx+1)), raw: stdout.slice(0,idx) };
}
const records = new Array(cases.length);
try {
  const previous = JSON.parse(await fs.readFile(path.join(output, 'results.json'), 'utf8'));
  previous.forEach((r,i) => { if (r.state !== 'network-or-response-failure') records[i] = r; });
} catch { /* first run */ }
const gap = Math.max(2500, Number(process.env.ORION_REQUEST_GAP_MS) || 3000);
let cursor = 0;
async function worker() {
  while (cursor < cases.length) {
    const index = cursor++;
    if (records[index]) continue;
    const target = cases[index];
    const row = { ...target, searches: [], selected: '' };
    for (const query of [...new Set([target.title, target.originalTitle])]) {
      try {
        await delay(gap);
        let { status, raw } = await fetchSearch(query);
        if (status === 429) {
          console.log('HTTP 429: pausing requests for 60 seconds');
          await delay(60000);
          ({ status, raw } = await fetchSearch(query));
          if (status === 429) throw new Error('rate-limited-after-backoff; defer this sample');
        }
        const file = `${String(index+1).padStart(3,'0')}-${row.searches.length}.json`;
        await fs.writeFile(path.join(output,file),raw);
        let json;
        try { json=JSON.parse(raw); } catch {}
        const results = context.aramaSonuclari(raw);
        const candidates = context.icerikBaglantilari(results);
        const selected = status === 200 && json ? context.secIcerik(results, target.type === 'movie', [slug(target.title),slug(target.originalTitle)], [target.title,target.originalTitle]) : '';
        row.searches.push({ query, status, json: Boolean(json), bytes: raw.length, file, candidates, selected });
        if (!row.selected && selected) row.selected = selected;
      } catch (error) { row.searches.push({query,error:error.message}); }
    }
    row.state = row.selected ? 'matched-not-playback-tested' : row.searches.every(s => s.json && s.status===200) ? 'no-match-needs-review' : 'network-or-response-failure';
    records[index] = row;
    console.log(`${index+1}/100 ${target.group}: ${target.originalTitle}: ${row.state}`);
  }
}
await worker(); // one request lane: do not hammer the public search endpoint
await fs.writeFile(path.join(output,'results.json'),JSON.stringify(records,null,2));
const report=['# Orion: 100-title search study','',`Origin: ${base}`,'','Search/name matching only. No playback guarantee. No match is not proof that a title is absent.','', '| Group | Cases | Matched | No match | Network/response failure |','| --- | ---: | ---: | ---: | ---: |'];
for (const group of Object.keys(groups)) {
 const rs=records.filter(r=>r.group===group);
 report.push(`| ${group} | ${rs.length} | ${rs.filter(r=>r.selected).length} | ${rs.filter(r=>r.state==='no-match-needs-review').length} | ${rs.filter(r=>r.state==='network-or-response-failure').length} |`);
}
report.push('', '## Selected URLs', '', ...records.map(r=>`- ${r.originalTitle}: ${r.selected || r.state}`));
await fs.writeFile(path.join(output,'REPORT.md'),report.join('\n')+'\n');
console.log(`Saved 100 records: ${output}`);
