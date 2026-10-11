/* dizi77 (Corvus) UÇTAN UCA: ara → bölüm → oynatıcı → GERÇEK m3u8 → segment
   Öncesi: her içerikte poster + play butonu gösteriyordu (autostart:false). */
import { fetchDizi77Sources } from '../src/services/dizi77Scraper.js';
import { extractEmbedStream, isStreamPlayable } from '../src/services/embedExtractors.js';

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36';


let basari = 0, toplam = 0;
async function dene(ad, fn) {
  toplam++;
  const t = Date.now();
  let ok = false, bilgi = '';
  try { ok = await fn(); } catch (e) { bilgi = String(e.message).slice(0, 60); }
  if (ok) basari++;
  console.log(`  ${ok ? '✓' : '✗'} ${ad.padEnd(34)} ${bilgi} (${((Date.now()-t)/1000).toFixed(1)}s)`);
}

console.log('═══ dizi77 (Corvus) — şifreli oynatıcı, uçtan uca ═══');
const kaynaklar = await fetchDizi77Sources({ title: 'Konusanlar', season: 1, episode: 1 });
const liste = kaynaklar?.sources || kaynaklar?.streams || (Array.isArray(kaynaklar) ? kaynaklar : []);
console.log(`  bulunan oynatıcı: ${liste.length}`);

const hedefler = liste[0] ? [['Konusanlar S1B1', liste[0]]] : [];
for (const [ad, kaynak] of hedefler) {
  const oynat = kaynak.url || kaynak.streamUrl;
  await dene(`${ad} → m3u8`, async () => {
    const c = await extractEmbedStream(oynat, kaynak.referer || 'https://dizi77.life/');
    if (!c) return false;
    console.log(`      yöntem: ${c.via}`);
    console.log(`      adres : ${c.url.slice(0, 78)}`);
    const r = await fetch(c.url, { headers: { 'User-Agent': UA, Referer: kaynak.referer || 'https://dizi77.life/' } });
    const m3u8 = r.ok && (await r.text()).startsWith('#EXTM3U');
    console.log(`      HTTP ${r.status} | geçerli playlist: ${m3u8}`);
    return m3u8;
  });
}

console.log(`\nTAMAM — geçen: ${basari}, kalan: ${toplam - basari}`);
process.exit(basari === toplam && toplam > 0 ? 0 : 1);