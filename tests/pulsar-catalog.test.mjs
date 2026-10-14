// Pulsar salt-katalog ayrıştırıcısı — kapı = KESİN TR işareti; Dual YALANCI POZİTİF reddi.
import test from 'node:test';
import assert from 'node:assert/strict';
import { katalogSatirlari } from '../src/services/pulsarCatalog.js';

const H40 = 'cc0aab92efefff11714a53acbb1dec714c4271f9';
const json = JSON.stringify({ streams: [
  { name: 'Torrentio\n1080p', title: `Interstellar [2014] [1080p] [CEE] Dub + Sub\n👤 8 💾 42.27 GB ⚙️ Rutracker\n🇬🇧 / 🇷🇺 / 🇹🇷`, infoHash: H40, fileIdx: 0 },
  { name: 'Torrentio\n1080p', title: `BIG.MOVIE.DUAL-AUDIO.SPA-ENG.1080p.x265\n👤 60 💾 626.89 MB ⚙️ 1337x\nDual Audio / 🇬🇧 / 🇪🇸`, infoHash: '52b28746014e4f0fcd48ad8545d90003239cc9bb', fileIdx: 0 },
  { name: 'Torrentio\n4k', title: `SADECE.INGİLİZ.4K\n👤 999 💾 36.9 GB\n🇬🇧`, infoHash: 'a'.repeat(40), fileIdx: 0 },
  { name: 'Torrentio\n720p', title: `TR Dublajlı sürüm\n👤 0 💾 4 GB\n🇹🇷`, infoHash: 'b'.repeat(40), fileIdx: 2 },
] });

test('Pulsar: 🇹🇷/TR işareti olan geçer; Dual yalancı pozitif ve sadesi elenir', () => {
  const rows = katalogSatirlari(json);
  assert.equal(rows.length, 1, 'yalnız gerçek TR işaretli satır');
  assert.equal(rows[0].id, `pulsar_${H40.slice(0, 12)}_0`);
});

test('Pulsar: dürüst sözleşme — streamUrl boş, magnet ayrı, catalogOnly/autoPlayable', () => {
  const [r] = katalogSatirlari(json);
  assert.equal(r.streamUrl, '');
  assert.ok(r.magnet.startsWith('magnet:?xt=urn:btih:' + H40));
  assert.equal(r.isCatalogOnly, true);
  assert.equal(r.autoPlayable, false);
  assert.equal(r.isTorrent, true);
  assert.match(r.aciklama, /👤 8/);
  assert.match(r.aciklama, /🇹🇷/);
  assert.doesNotMatch(r.ad + r.aciklama, /Torrentio|torrentio/i, 'site adı sızmaz');
  assert.doesNotMatch(r.aciklama, /Dublaj/i, 'altyazı satırı dublaj diye satılmaz');
});

test('Pulsar: seed 0 elenir; bozuk JSON → []', () => {
  assert.equal(katalogSatirlari('çöp').length, 0);
  const zeroOnly = JSON.stringify({ streams: [{ name: 'x\n720p', title: 'TR Dub\n👤 0 💾 1 GB\n🇹🇷', infoHash: 'c'.repeat(40) }] });
  assert.equal(katalogSatirlari(zeroOnly).length, 0);
});
