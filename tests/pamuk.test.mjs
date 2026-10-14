import test from 'node:test';
import assert from 'node:assert/strict';
import { coz, kartlarBul, kartSec } from '../src/providers/pamuk.js';

// Pamuk (çizgi film) — birebir ad kapısı + bayt probe kanıtı sahte sunucuyla.
// Kart işareti ölçülen yapıdır: <a href="…/cartoon/<slug>/"><img alt="<Kısa Ad>">.
const KART = (slug, alt) => `<div class='carton'><a href="https://pamuk.test/cartoon/${slug}/"><img class="aligncenter size-full" src="https://pamuk.test/i/${slug}.jpg" alt="${alt}" /></a></div>`;
const SAYFA = '<html><head><title>Pocahontas - Tom and Jerry Cartoon</title></head><body><script>jwplayer("p").setup({sources:[{file: "https://cdn.test/tom-and-jerry/pocahontas.mp4", type: "video/mp4"}], image: ""});</script></body></html>';
const FTYP = '\u0000\u0000\u0000\u0018ftypmp42\u0000\u0000\u0000mp42isom';

async function run(args, { arama = KART('pocahontas', 'Pocahontas') + KART('baby-puss', 'Baby Puss'), sayfa = SAYFA, probe = FTYP } = {}) {
  const once = globalThis.fetch;
  globalThis.fetch = async (input) => {
    const url = String(input);
    if (url.includes('?s=')) return new Response(arama);
    if (url.includes('/cartoon/')) return new Response(sayfa);
    if (/\.(mp4|m3u8)$/i.test(url)) return new Response(probe);
    return new Response(`<html>${'x'.repeat(600)}</html>`);
  };
  try {
    const r = await coz({ signal: AbortSignal.timeout(4000), ...args });
    return { n: r.sources.length, ilk: r.sources[0], trace: r.trace };
  } finally { globalThis.fetch = once; }
}

test('kart kazıyıcı: href↔alt eşler, HTML varlıklarını çözer', () => {
  const kartlar = kartlarBul(KART('toms-photo-finish', 'Tom&#8217;s Photo Finish') + KART('mucho-mouse', 'Mucho Mouse'));
  assert.equal(kartlar.length, 2);
  assert.equal(kartlar[0].ad, 'tom s photo finish');
  assert.equal(kartlar[1].ad, 'mucho mouse');
});

test('kimlik kapısı: BİREBİR ad; dizi adı ve önek reddedilir (alfabetik liste → S/E tahmini yok)', () => {
  const kartlar = kartlarBul(KART('pocahontas', 'Pocahontas') + KART('boobs-in-the-woods', 'Boobs in the Woods'));
  assert.equal(kartSec(kartlar, ['Pocahontas']).url.endsWith('/cartoon/pocahontas'), true);
  assert.equal(kartSec(kartlar, ['Tom and Jerry']), null);
  assert.equal(kartSec(kartlar, ['Poca']), null);
});

test('doğru kısa ad: jwplayer dosyası ftyp bayt kanıtıyla tek kaynak olur', async () => {
  const r = await run({ type: 'movie', title: 'Pocahontas', originalTitle: 'Pocahontas' });
  assert.equal(r.n, 1, JSON.stringify(r.trace));
  assert.equal(r.ilk.url, 'https://cdn.test/tom-and-jerry/pocahontas.mp4');
  assert.equal(r.ilk.quality, 'Klasik');
  assert.equal(r.ilk.category, 'subtitled');
  assert.equal(r.ilk.headers.Referer, 'https://www.supercartoons.net/');
});

test('canlı doğrulanan elenis: "pocahontas" araması ilgisiz Popeye kısayı döndürürse RED', async () => {
  const r = await run(
    { type: 'movie', title: 'Pocahontas', originalTitle: 'Pocahontas' },
    { arama: KART('boobs-in-the-woods', 'Boobs in the Woods') },
  );
  assert.equal(r.n, 0);
  assert.ok(r.trace.some((x) => x.ad === 'kimlik-yok'));
});

test('varlıklı başlık birebir eşleşir: "Tom’s Photo Finish" ≡ "Tom\'s Photo Finish"', async () => {
  const r = await run(
    { type: 'movie', title: "Tom's Photo Finish", originalTitle: "Tom's Photo Finish" },
    {
      arama: KART('toms-photo-finish', 'Tom&#8217;s Photo Finish'),
      sayfa: SAYFA.replace('pocahontas', 'toms-photo-finish'),
    },
  );
  assert.equal(r.n, 1, JSON.stringify(r.trace));
});

test('ölü dosya (probe HTML) listelenmez; dizi isteği bölüm garanti edilemediği için 0 döner', async () => {
  const olu = await run(
    { type: 'movie', title: 'Pocahontas', originalTitle: 'Pocahontas' },
    { probe: '<!DOCTYPE html><html>yayın yok</html>' },
  );
  assert.equal(olu.n, 0);
  assert.ok(olu.trace.some((x) => x.ad === 'akis-yanlis'));
  const dizi = await run({ type: 'tv', title: 'Tom and Jerry', originalTitle: 'Tom and Jerry', season: 1, episode: 1 });
  assert.equal(dizi.n, 0);
  assert.ok(dizi.trace.some((x) => x.ad === 'kimlik-yok'));
});
