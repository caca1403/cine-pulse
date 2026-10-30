#!/usr/bin/env node
/* Kahraman çekirdeklerinin config ANAHTARI kontrolü.
   Neden: vendor domains.json'ı takma adla (joyboy, toki, shanks…) yayınlıyor;
   bazı çekirdekler kendi kahraman adını soruyor → harita boş → sessiz 0 kaynak.
   Kullanım: node tools/kahraman-anahtar-kontrol.mjs [--json]
   Salt okunur; hiçbir dosyayı değiştirmez. */
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const KOK = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CEKIRDEK = path.join(KOK, 'src/providers/cekirdekler');

/* 1) domains.json — canlı anahtar seti */
let anahtarlar = new Set();
try {
  const r = await fetch('https://cdn.izlelan.com/domains.json', { signal: AbortSignal.timeout(20000) });
  const d = await r.json();
  const harita = d?.data?.domains || d?.domains || {};
  anahtarlar = new Set(Object.keys(harita));
} catch (e) {
  console.error('domains.json alınamadı:', e.message);
}

/* 2) alanlar.js — kahraman adı → takma ad (satır sonundaki // yorum) */
const alanlarKaynagi = readFileSync(path.join(KOK, 'src/providers/alanlar.js'), 'utf8');
const lakap = new Map();
for (const satir of alanlarKaynagi.split('\n')) {
  const m = satir.match(/["']([A-Za-z-]+)["']\s*:\s*["']https?:\/\/[^"']+["']\s*,?\s*\/\/\s*([a-z0-9_-]+)/);
  if (m) lakap.set(m[1], m[2]);
}

/* 3) her çekirdeğin sorduğu anahtarlar: fn("X") ve cachedDomains["X"] */
const sonuclar = [];
for (const dosya of readdirSync(CEKIRDEK).filter(f => f.endsWith('.js'))) {
  const kod = readFileSync(path.join(CEKIRDEK, dosya), 'utf8');
  const sorulan = new Set();
  // Çözümleyici fonksiyon adı çekirdekten çekirdeğe değişiyor (fn, j0, …): await'li tek
  // string argümanlı çağrıları topla — kahraman adı ya da takma ad aranıyor.
  for (const m of kod.matchAll(/\bawait\s+[A-Za-z_$][\w$]*\(\s*["']([^"']+)["']\s*\)/g)) sorulan.add(m[1]);
  for (const m of kod.matchAll(/cachedDomains\s*\[\s*["']([^"']+)["']\s*\]/g)) sorulan.add(m[1]);

  const ad = dosya.replace(/\.js$/, '');
  const kahraman = [...lakap.keys()].find(k => k.toLowerCase().replace(/-/g, '') === ad.toLowerCase());
  const beklenen = kahraman ? lakap.get(kahraman) : null;
  const selfKayit = /globalThis\.getStreams\s*=/.test(kod);
  const ihracac = /export\s+default|module\.exports\.getStreams\s*=/.test(kod);

  let durum = 'anahtar-sormuyor';
  if (sorulan.size) {
    const canli = [...sorulan].filter(s => anahtarlar.has(s));
    durum = canli.length ? 'TAMAM' : (beklenen && anahtarlar.has(beklenen) ? 'YANLIS-ANAHTAR' : 'OLUMSUZ');
  }
  sonuclar.push({ dosya, kahraman: kahraman || '?', sorulan: [...sorulan], beklenenLakap: beklenen || '?', durum, selfKayit, ihracac });
}

if (process.argv.includes('--json')) { console.log(JSON.stringify(sonuclar, null, 1)); }
else {
  const ozet = {};
  for (const s of sonuclar) ozet[s.durum] = (ozet[s.durum] || 0) + 1;
  console.log('ÖZET:', JSON.stringify(ozet), 'canlı anahtar sayısı:', anahtarlar.size);
  for (const s of sonuclar.filter(x => x.durum === 'YANLIS-ANAHTAR' || x.durum === 'OLUMSUZ' || !x.selfKayit))
    console.log(`${s.durum.padEnd(14)} ${s.dosya.padEnd(22)} sorulan=${JSON.stringify(s.sorulan)} lakap=${s.bekenenLakap ?? s.beklenenLakap} selfKayit=${s.selfKayit}`);
}
