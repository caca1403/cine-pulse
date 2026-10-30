import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  dilKodla, m3u8SesDokumu, m3u8Mi, satiriDinle, satirinAdresi,
  tsSesDilleri, mp4SesDilleri, mkvSesDilleri, baytSesDilleri, sesDokumuKesfet,
} from '../src/services/dogrudan/dublajKestirme.js';

/* ── Yardımcılar: sentetik kapsayıcı üreticileri ──────────────────────────── */
function paket(pid, payload) {
  const p = new Uint8Array(188).fill(0xff);
  p[0] = 0x47;
  p[1] = 0x40 | ((pid >> 8) & 0x1f);
  p[2] = pid & 0xff;
  p[3] = 0x10; // payload only, PUSI yukarıda
  p.set(payload, 4);
  return p;
}
function patPaketi(pmtPid) {
  // pointer(1) + tablo: id(1)+syntax/len(2)+ts_id(2)+res/ver/cc(1)+prog*4 → len=7+2*4=15
  return paket(0, [0x00, 0x00, 0xb0, 0x0f, 0x00, 0x01, 0xc1,
    0x00, 0x00, 0x00, 0x00, // network
    0x00, 0x01, 0x1f & ((pmtPid >> 8) | 0x10), pmtPid & 0xff, // res bitleriyle PID
    0x00, 0x00, 0x00, 0x00]);
}
function esKaydi(tur, pid, iso) {
  // 13-bit PID: '111'+pid ; 12-bit info_length: '1111'+len
  if (!iso) return [tur, 0xe0 | ((pid >> 8) & 0x1f), pid & 0xff, 0xf0, 0x00];
  return [tur, 0xe0 | ((pid >> 8) & 0x1f), pid & 0xff, 0xf0, 0x05,
    0x0a, 0x03, ...iso.split('').map(c => c.charCodeAt(0))];
}
function pmtPaketi(diller) {
  const esler = [[0x1b, 0x0100, null], ...diller.map((iso, i) => [0x0f, 0x0101 + i, iso])]
    .flatMap(([t, p, iso]) => esKaydi(t, p, iso));
  const len = 6 + esler.length + 4; // prog#(2)+res/pcr(2)+res/pil(2) + ES + CRC
  return paket(0x1000, [0x00, 0x02, 0x30 | ((len >> 8) & 0x0f), len & 0xff,
    0x00, 0x01, 0xf0, 0x01, 0xf0, 0x00, ...esler, 0x00, 0x00, 0x00, 0x00]);
}
function tsUret(diller) {
  const a = patPaketi(0x1000), b = pmtPaketi(diller);
  const out = new Uint8Array(a.length + b.length);
  out.set(a, 0); out.set(b, 188);
  return out;
}
function kutu(tur, icerik) {
  const t = [...tur.split('').map(c => c.charCodeAt(0))];
  const boy = 8 + icerik.length;
  return [ (boy >> 24) & 255, (boy >> 16) & 255, (boy >> 8) & 255, boy & 255, ...t, ...icerik ];
}
function dilPaketle(iso) {
  const [a, b, c] = [...iso].map(ch => ch.charCodeAt(0) - 0x60);
  const p = ((a & 31) << 10) | ((b & 31) << 5) | (c & 31);
  return [(p >> 8) & 255, p & 255];
}
function mp4Uret(iso) {
  // mdhd v0 içerik: verflags(4) creation(4) mod(4) timescale(4) duration(4) DIL(2) kalite(2)
  const mdhd = kutu('mdhd', [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0x00, 0x00, 0x03, 0xe8, 0, 0, 0, 0,
    ...dilPaketle(iso), 0, 0]);
  const hdlr = kutu('hdlr', [0, 0, 0, 0, 0, 0, 0, 0, ..."soun".split('').map(c => c.charCodeAt(0)), 0, 0, 0, 0]);
  const mdia = kutu('mdia', [...mdhd, ...hdlr]);
  const trak = kutu('trak', [...mdia]);
  const moov = kutu('moov', [...trak]);
  const ftyp = kutu('ftyp', [...'isom'.split('').map(c => c.charCodeAt(0)), 0, 0, 0, 0]);
  return new Uint8Array([...ftyp, ...moov]);
}
function ebml(idBytes, icerik) {
  return [...idBytes, 0x80 | icerik.length, ...icerik];
}
function mkvUret(traklar) {
  const girisler = traklar.flatMap(([tur, iso]) => ebml([0xae], [
    ...ebml([0x83], [tur]),
    ...ebml([0x22, 0xb5, 0x9c], [...iso.split('').map(c => c.charCodeAt(0))]),
  ]));
  const tracks = ebml([0x16, 0x54, 0xae, 0x6b], girisler);
  const segment = ebml([0x18, 0x53, 0x80, 0x67], tracks);
  const header = ebml([0x1a, 0x45, 0xdf, 0xa3], [0x42, 0x86, 0x81, 0x01]);
  return new Uint8Array([...header, ...segment]);
}

/* ── Katman testleri ──────────────────────────────────────────────────────── */
test('TS PAT/PMT: muxed segmanda en+tr ses dilleri okunur', () => {
  const kodlar = tsSesDilleri(tsUret(['eng', 'tur']));
  assert.deepEqual([...kodlar].sort(), ['en', 'tr']);
});

test('TS PMT tek dil: orijinal kanıtı', () => {
  assert.deepEqual([...tsSesDilleri(tsUret(['eng']))], ['en']);
});

test('MP4 moov/mdia/mdhd paketlenmiş dil okunur', () => {
  assert.deepEqual([...mp4SesDilleri(mp4Uret('tur'))], ['tr']);
  assert.deepEqual([...mp4SesDilleri(mp4Uret('deu'))], ['de']);
});

test('MKV TrackEntry: yalnız SES (TrackType=2) dilleri sayılır', () => {
  const kodlar = mkvSesDilleri(mkvUret([[1, 'eng'], [2, 'tur'], [2, 'eng']]));
  assert.deepEqual([...kodlar].sort(), ['en', 'tr']);
});

test('baytSesDilleri kapsayıcı snifflar, çöpe null der', () => {
  assert.ok(tsSesDilleri(baytSesDilleri(tsUret(['eng'])) ? tsUret(['eng']) : []).size >= 0);
  assert.ok(baytSesDilleri(tsUret(['tur'])).has('tr'));
  assert.ok(baytSesDilleri(mp4Uret('tur')).has('tr'));
  const cop = baytSesDilleri(new Uint8Array([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18]));
  assert.ok(!cop || cop.size === 0);
  assert.equal(baytSesDilleri(new Uint8Array(4)), null);
});

test('muxed HLS: master dil taşımıyorsa segman okunur ve TR bulunur', async () => {
  const master = `#EXTM3U\n#EXT-X-STREAM-INF:BANDWIDTH=3000000,CODECS="avc1.64001f,mp4a.40.2"\n720p/index.m3u8\n`;
  const medya = `#EXTM3U\n#EXTINF:4,\nseg1.ts\n`;
  const ts = tsUret(['eng', 'tur']);
  const fetchImpl = async (url) => {
    if (url.endsWith('master.m3u8')) return { ok: true, text: async () => master };
    if (url.endsWith('720p/index.m3u8')) return { ok: true, text: async () => medya };
    return { ok: true, arrayBuffer: async () => ts.buffer.slice(ts.byteOffset, ts.byteOffset + ts.byteLength) };
  };
  const d = await sesDokumuKesfet('https://segtest.example/a/master.m3u8', { fetchImpl });
  assert.equal(d.trMi, true);
  assert.equal(d.kanitlanabilir, true);
  const s = { streamUrl: 'https://segtest.example/a/master.m3u8', diller: [] };
  await satiriDinle(s, { fetchImpl });
  assert.equal(s.dilDurumu, 'dublaj');
  assert.equal(s.trSes, true);
});

test('muxed HLS tek dil: DOĞRULANMIŞ ORİJİNAL', async () => {
  const master = `#EXTM3U\n#EXT-X-STREAM-INF:BANDWIDTH=2000000\n480p/index.m3u8\n`;
  const ts = tsUret(['eng']);
  const fetchImpl = async (url) => {
    if (url.endsWith('master.m3u8')) return { ok: true, text: async () => master };
    if (url.endsWith('index.m3u8')) return { ok: true, text: async () => '#EXTM3U\n#EXTINF:4,\nseg.ts\n' };
    return { ok: true, arrayBuffer: async () => ts.buffer };
  };
  const s = { streamUrl: 'https://segtest2.example/x/master.m3u8', diller: [] };
  await satiriDinle(s, { fetchImpl });
  assert.equal(s.dilDurumu, 'orijinal');
  assert.equal(s.sesDokumu, 'en');
});

test('doğrulanamayan (ağ hatası / çöp) → rozet YOK, uydurma YOK', async () => {
  const s = { streamUrl: 'https://cop.example/x/master.m3u8', diller: [] };
  assert.equal(await satiriDinle(s, { fetchImpl: async () => ({ ok: true, text: async () => '404 not m3u8' }) }), null);
  assert.equal(s.dilDurumu, undefined);
});

test('dilKodla + m3u8 master katmanı (etiketli) hâlâ çalışır', () => {
  assert.equal(dilKodla('tur'), 'tr');
  assert.equal(dilKodla('Türkçe'), 'tr');
  const d = m3u8SesDokumu(`#EXTM3U
#EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="a",LANGUAGE="eng",NAME="English",DEFAULT=YES,URI="a"
#EXT-X-MEDIA:TYPE=AUDIO,GROUP-ID="a",LANGUAGE="tur",NAME="Turkish",URI="b"
#EXT-X-STREAM-INF:BANDWIDTH=1,AUDIO="a"
v/index.m3u8`);
  assert.equal(d.trMi, true);
  assert.equal(d.kanitlanabilir, true);
  assert.equal(m3u8Mi('https://x/a.m3u8?tok=9'), true);
  assert.equal(satirinAdresi({ url: 'https://x/y' }), 'https://x/y');
});
