#!/usr/bin/env node
// Replay captured search responses against HEAD and the local parser without
// making additional requests. This measures selection, not playback.
import fs from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { execFileSync } from 'node:child_process';
const root = process.argv[2] || '/tmp/opencode/orion-100';
const records = JSON.parse(await fs.readFile(path.join(root, 'results.json'), 'utf8'));
const current = await fs.readFile(new URL('../src/providers/orion.js', import.meta.url), 'utf8');
const previous = execFileSync('git', ['show', 'HEAD:src/providers/orion.js'], { encoding: 'utf8' });
function parser(source) {
  const ctx = vm.createContext({ duzMetin: s => String(s || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() });
  vm.runInContext(source.slice(source.indexOf('function aramaSonuclari('), source.indexOf('function bolumBaglantisi(')), ctx);
  return ctx;
}
const old = parser(previous), updated = parser(current);
const slug = s => s.toLowerCase().replace(/ı/g,'i').replace(/ş/g,'s').replace(/ğ/g,'g').replace(/ü/g,'u').replace(/ö/g,'o').replace(/ç/g,'c').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const rows = [];
for (const r of records) {
  const row = { title:r.originalTitle,group:r.group,old:'',updated:'',validResponses:0 };
  for (const search of r.searches) {
    if (!search.json || search.status!==200) continue;
    row.validResponses++;
    const raw=await fs.readFile(path.join(root,search.file),'utf8');
    for (const [name,p] of [['old',old],['updated',updated]]) {
      const selected=p.secIcerik(p.aramaSonuclari(raw),r.type==='movie',[slug(r.title),slug(r.originalTitle)],[r.title,r.originalTitle]);
      if (!row[name] && selected) row[name]=selected;
    }
  }
  rows.push(row);
}
await fs.writeFile(path.join(root,'replay.json'),JSON.stringify(rows,null,2));
const valid=rows.filter(r=>r.validResponses);
console.log(JSON.stringify({total:rows.length,withValidResponses:valid.length,oldMatched:valid.filter(r=>r.old).length,updatedMatched:valid.filter(r=>r.updated).length,newMatches:valid.filter(r=>!r.old&&r.updated).map(r=>r.title),changedSelection:valid.filter(r=>r.old&&r.updated&&r.old!==r.updated).map(r=>({title:r.title,old:r.old,updated:r.updated}))},null,2));
