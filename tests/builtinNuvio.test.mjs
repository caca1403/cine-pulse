import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

/* YERLİ nuvio sağlayıcıları (kullanıcı 2026-10-29: "önce o ikisini ekle"):
   dublajı cihazda doğrulanmış PopWatch + VidBolt APK'yla paketlenir.
   (a) dosyalar diskte var, (b) motor sandbox'ında DERLENİR, (c) getStreams
   dışa açılır. Ağ GEREKMEZ — kodlar kodTohumla ile motora verilir. */

const kok = join(dirname(fileURLToPath(import.meta.url)), '..');
const { nuvioMotoru } = await import('../src/services/dogrudan/nuvioMotoru.js');
const { YERLI_NUVIO_KAYIT, yerliTaban } = await import('../src/services/dogrudan/builtinNuvio.js');

test('yerli kayıt: yalnız doğrulanmış ikili, dosyalar diskte', () => {
  const idler = YERLI_NUVIO_KAYIT.scrapers.map(s => s.id);
  assert.deepEqual(idler, ['yerli-popwatch', 'yerli-vidbolt']);
  for (const s of YERLI_NUVIO_KAYIT.scrapers) {
    assert.ok(existsSync(join(kok, 'public', 'nuvio-builtin', s.filename)), `eksik dosya: ${s.filename}`);
  }
});

test('vendor dizininde liste dışı dosya yok (drift bekçisi)', () => {
  const kokDizin = join(kok, 'public', 'nuvio-builtin');
  const diskte = [];
  for (const alt of readdirSync(kokDizin, { withFileTypes: true })) {
    if (!alt.isDirectory()) continue;
    for (const f of readdirSync(join(kokDizin, alt.name))) diskte.push(`${alt.name}/${f}`);
  }
  const listilenen = new Set(YERLI_NUVIO_KAYIT.scrapers.map(s => s.filename));
  for (const d of diskte) assert.ok(listilenen.has(d), `listelenmemiş vendor dosyası: ${d}`);
});

test('yerli scraper\'lar motor sandbox\'ında derlenir ve getStreams döner', async () => {
  const motor = nuvioMotoru({ fetchImpl: () => { throw new Error('testte ağa izin yok'); } });
  const taban = 'test://yerli';
  for (const s of YERLI_NUVIO_KAYIT.scrapers) {
    const kod = readFileSync(join(kok, 'public', 'nuvio-builtin', s.filename), 'utf8');
    motor.kodTohumla(`${taban}/${s.filename}`, kod);
    const modul = await motor.scraperModulu(taban, s);
    assert.equal(typeof modul.getStreams, 'function', `${s.ad}: getStreams yok`);
  }
});

test('kodTohumla, providerKodu\'nda ağdan ÖNCE okunur', async () => {
  const motor = nuvioMotoru({ fetchImpl: () => { throw new Error('ağa düşüldü'); } });
  motor.kodTohumla('test://yerli/providers/vidbolt.js', 'module.exports.getStreams=async()=>[];');
  const kod = await motor.providerKodu('test://yerli', { filename: 'providers/vidbolt.js' });
  assert.match(kod, /getStreams/);
});

test('TR dosyalarında const TMDB_API_KEY banner çarpışmasını kırmasın (strict\'siz sandbox)', async () => {
  const motor = nuvioMotoru({ fetchImpl: () => { throw new Error('ag yok'); } });
  motor.kodTohumla('test://t/x.js', 'const TMDB_API_KEY="k"; module.exports.getStreams=async()=>[];\nif (typeof globalThis!=="undefined") globalThis.getStreams=module.exports.getStreams;');
  const modul = await motor.scraperModulu('test://t', { filename: 'x.js', id: 'x' });
  assert.equal(typeof modul.getStreams, 'function');
});

test('getter-only exports\'a strict\'siz atama modülü çökertmez (Dizilla deseni)', async () => {
  const motor = nuvioMotoru({ fetchImpl: () => { throw new Error('ag yok'); } });
  motor.kodTohumla('test://t/g.js', [
    'var _gs = async () => [];',
    'Object.defineProperty(module.exports, "getStreams", { get: function(){ return _gs; } });',
    'module.exports.getStreams = _gs; // getter-only → sessiz no-op (strict yok)',
    'if (typeof globalThis !== "undefined") globalThis.getStreams = _gs;',
  ].join('\n'));
  const modul = await motor.scraperModulu('test://t', { filename: 'g.js', id: 'g' });
  assert.equal(typeof modul.getStreams, 'function');
});

test('yerliTaban web/Node ortamlarında makul döner', () => {
  assert.match(yerliTaban(), /nuvio-builtin$/);
});
