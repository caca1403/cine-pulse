#!/usr/bin/env node
// All runtime providers, using the actual APK code and network. A returned
// source is not a playback pass: probe results are reported separately.
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';
import { cdpAc } from './cihaz-cdp.mjs';

const output = process.argv[2] || '/tmp/opencode/provider-matrix';
await mkdir(output, { recursive: true });
const movie = [
  { title: 'Yıldızlararası', originalTitle: 'Interstellar', type: 'movie', tmdbId: 157336, imdbId: 'tt0816692' },
  { title: 'The Matrix', originalTitle: 'The Matrix', type: 'movie', tmdbId: 603, imdbId: 'tt0133093' },
];
const tv = [
  { title: 'Stranger Things', originalTitle: 'Stranger Things', type: 'tv', tmdbId: 66732, season: 1, episode: 1 },
  { title: 'Riverdale', originalTitle: 'Riverdale', type: 'tv', tmdbId: 69050, season: 1, episode: 1 },
];
const anime = [
  { title: 'Naruto', originalTitle: 'Naruto', type: 'tv', tmdbId: 46260, season: 1, episode: 1 },
  { title: 'Attack on Titan', originalTitle: 'Shingeki no Kyojin', type: 'tv', tmdbId: 1429, season: 1, episode: 1 },
];
function cases(p) {
  if (['anizium', 'animecix', 'asy', 'animetr'].includes(p.id)) return anime;
  if (['czgx', 'kidsvip'].includes(p.id)) return [{ title: 'SüngerBob KareŞort', originalTitle: 'SpongeBob SquarePants', type: 'tv', tmdbId: 387, season: 1, episode: 1 }, { title: 'Ters Yüz', originalTitle: 'Inside Out', type: 'movie', tmdbId: 150540 }];
  if (p.id === 'blgx') return [{ title: 'Gezegenimiz', originalTitle: 'Our Planet', type: 'tv', season: 1, episode: 1 }, { title: 'Uçak Kazası Raporu', originalTitle: 'Mayday', type: 'tv', season: 1, episode: 1 }];
  const list = [];
  if (p.mediaTypes.includes('movie')) list.push(movie[0]);
  if (p.mediaTypes.includes('tv')) list.push(tv[0]);
  if (list.length === 1) list.push(p.mediaTypes.includes('tv') ? tv[1] : movie[1]);
  if (p.id === 'hdfc') list.push({ title: '12 Maymunlar', originalTitle: '12 Monkeys', type: 'tv', season: 1, episode: 1 }, tv[1]);
  return list;
}

const cdp = await cdpAc();
const records = [];
try {
  const providers = await cdp.calistir('window.__cpProviders?.()');
  if (!Array.isArray(providers)) throw new Error('Install a devtest build with current deviceSweep hooks first');
  for (const provider of providers) {
    if (!provider.enabled || provider.experimental) {
      records.push({ provider: provider.id, name: provider.name, state: 'disabled-or-experimental', results: [] });
      continue;
    }
    const entry = { provider: provider.id, name: provider.name, state: 'untested', results: [] };
    records.push(entry);
    for (const target of cases(provider)) {
      // Never hold a single Runtime.evaluate open during resolution.
      await cdp.calistir(`(() => {
        window.__cpMatrixJob = {done:false};
        window.__cpSag(${JSON.stringify(provider.id)}, ${JSON.stringify({ ...target, probe: true, timeoutMs: 30000 })})
          .then(result => {window.__cpMatrixJob={done:true,result};})
          .catch(error => {window.__cpMatrixJob={done:true,result:{hata:String(error)}};});
        return true;
      })()`);
      let job;
      const until = Date.now() + 100000;
      do {
        await delay(2000);
        job = await cdp.calistir('window.__cpMatrixJob');
      } while (!job?.done && Date.now() < until);
      if (!job?.done) throw new Error(`${provider.id}: diagnostic job stalled; stop rather than overlapping requests`);
      entry.results.push({ target, ...job.result });
      const verified = (job.result.probes || []).filter(p => p.state === 'transport-verified').length;
      console.log(`${provider.name}: ${target.originalTitle} sources=${job.result.n || 0}, transport=${verified}, error=${job.result.hata || '-'}`);
      await writeFile(path.join(output, 'results.json'), JSON.stringify(records, null, 2));
    }
    entry.state = entry.results.some(r => r.probes?.some(p => p.state === 'transport-verified')) ? 'transport-verified' : 'needs-investigation';
  }
  await writeFile(path.join(output, 'results.json'), JSON.stringify(records, null, 2));
  const report = ['# APK provider matrix', '', 'Transport checks do not prove decoding or full playback.', '', '| Provider | State | Sources returned | Verified probes |', '| --- | --- | ---: | ---: |',
    ...records.map(r => `| ${r.name} | ${r.state} | ${r.results.reduce((n,x) => n+(x.n || 0),0)} | ${r.results.reduce((n,x) => n+(x.probes || []).filter(p => p.state === 'transport-verified').length,0)} |`)].join('\n');
  await writeFile(path.join(output, 'REPORT.md'), report + '\n');
  console.log(`Saved: ${output}`);
} finally { cdp.kapat(); }
