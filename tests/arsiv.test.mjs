import test from 'node:test';
import assert from 'node:assert/strict';
import { coz } from '../src/providers/arsiv.js';

// Deneb (arşiv) — kimlik kapısı + bayt probe kanıtı sahte sunucuyla doğrulanır.
const doc = (identifier, title, year) => ({ identifier, title, year });
const meta = (files, dark = false) => JSON.stringify({
  is_dark: dark, server: 'ia600000.us.archive.org', dir: '/0/items/x',
  files, metadata: { title: 'x' },
});
const f1080 = { name: 'Film 1080.mp4', format: 'h.264', height: '1080', size: '10' };
const f720 = { name: 'Film 720.mp4', format: 'h.264', height: '720', size: '9' };
const fIA = { name: 'Film.ia.mp4', format: 'h.264', height: '1080', size: '10' };

async function run(args, { yearDocs = [], openDocs = [], metaJson = null, probe = '\u0000\u0000\u0000 ftypisompaddingpadding' } = {}) {
  const once = globalThis.fetch;
  globalThis.fetch = async (input) => {
    const url = String(input);
    if (url.includes('advancedsearch.php')) {
      const docs = url.includes('year%3A') ? yearDocs : openDocs;
      return new Response(JSON.stringify({ response: { docs } }));
    }
    if (url.includes('/metadata/')) return new Response(metaJson || meta([]));
    if (url.includes('/items/')) return new Response(probe);
    return new Response('nope', { status: 404 });
  };
  try {
    const r = await coz({ signal: AbortSignal.timeout(4000), ...args });
    return { n: r.sources.length, ilk: r.sources[0], trace: r.trace };
  } finally { globalThis.fetch = once; }
}

test('film: trailer kartı elenir, tam eşleşen kayıt 1080p listelenir (.ia.mp4 atlanır)', async () => {
  const r = await run({ type: 'movie', title: 'Interstellar', originalTitle: 'Interstellar', year: 2014 }, {
    yearDocs: [doc('trailer-x', 'Interstellar Trailer (2014)', 2014), doc('film-x', 'Interstellar', 2014)],
    metaJson: meta([f720, fIA, f1080]),
  });
  assert.equal(r.n, 1, JSON.stringify(r.trace));
  assert.match(r.ilk.name, /^Deneb 1080p/);
  assert.ok(r.ilk.url.includes('Film%201080.mp4'), r.ilk.url);
});

test('kimlik kapısı: yıl kapısız aramada ±1 dışı yıl reddedilir', async () => {
  const r = await run({ type: 'movie', title: 'Kayıp', originalTitle: 'Kayıp', year: 2005 }, {
    yearDocs: [],
    openDocs: [doc('baska', 'Kayıp', 1968)],
    metaJson: meta([f1080]),
  });
  assert.equal(r.n, 0);
});

test('dizi: bölüm aralığı istenen bölümü içermiyorsa RED, içeriyorsa KABUL', async () => {
  const dizi = { type: 'tv', title: 'Rafadan Tayfa', originalTitle: 'Rafadan Tayfa', year: 2014 };
  const red = await run({ ...dizi, season: 1, episode: 1 }, {
    yearDocs: [doc('rt-10-13', 'Rafadan Tayfa Episode 10-13', 2014)],
    metaJson: meta([f1080]),
  });
  assert.equal(red.n, 0);
  assert.ok(red.trace.some((x) => x.ad === 'bolum-red'));
  const ok = await run({ ...dizi, season: 1, episode: 11 }, {
    yearDocs: [doc('rt-10-13', 'Rafadan Tayfa Episode 10-13', 2014)],
    metaJson: meta([f1080]),
  });
  assert.equal(ok.n, 1, JSON.stringify(ok.trace));
});

test('karanlık (dosyaları kilitli) kayıt listelenmez', async () => {
  const r = await run({ type: 'movie', title: 'Night of the Living Dead', year: 1968 }, {
    yearDocs: [doc('nold', 'Night of the Living Dead', 1968)],
    metaJson: meta([f1080], true),
  });
  assert.equal(r.n, 0);
});

test('ölü dosya (boş probe) listelenmez', async () => {
  const r = await run({ type: 'movie', title: 'Interstellar', year: 2014 }, {
    yearDocs: [doc('film-x', 'Interstellar', 2014)],
    metaJson: meta([f1080]),
    probe: '',
  });
  assert.equal(r.n, 0);
});
