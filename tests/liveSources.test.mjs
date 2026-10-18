/* ==========================================================================
   Canlı TV — kanal havuzu kuralları (çevrimdışı, doğrulamalı test)

   NEDEN YENİDEN YAZILDI: bu dosya eskiden /tmp/opencode'daki gerçek M3U anlık
   görüntüsünü okuyup SADECE konsola yazan, hiçbir şey doğrulamayan ve bir de
   ağa çıkan bir tanı betiğiydi → /tmp temizlenince kalıcı olarak kırmızıya
   düştü. Artık: kalıcı veri yok, ağ yok,_assertion_var_.
   Gerçek Kral listesiyle sayı görmek isteyen: node tools/canli-kaynak-tanisi.mjs

   Doğrulanan kurallar (kullanıcı emirleri 2026-10-17):
     • "Alman kanalları da var hâlâ"  → yabancı önekli kayıtlar elenir
     • "çoğu Türk kanalı yok"         → "TR: ATV" gibi önekli adlar TANINIR
     • "aynı içeriği sunanları birleştir, en stabilini ana yap"
                                      → tek kayıt + altStreams, HLS ana yayındır
     • "sadece m3u8 benzeri kaynakları al" + "DMAX ve TLC neden yok"
                                      → HLS ÖNE alınır ama TS-only kanal (DMAX,
                                        TLC, Discovery) tamamen silinmez
   ========================================================================== */

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { buildChannels } from '../src/services/canli/turkishLiveSources.js';

/* Sözde kanal: HLS/TS bayrağı uzantıdan türetilir (gerçek ayrıştırıcının yaptığı gibi). */
const kanal = (name, streamUrl, extra = {}) => ({
  name,
  streamUrl,
  isTs: !/\.m3u8(\?|#|$)/i.test(streamUrl),
  category: 'national',
  ...extra
});
const kaynak = (kanallar) => [{ id: 'test', label: 'Test Kaynağı', channels: kanallar }];
const adlar = (liste) => liste.map((c) => c.name);

test('ülke öneki ekranda görünmez; aynı kanalın kopyaları tek kayda iner', () => {
  const out = buildChannels(kaynak([
    kanal('TRT 1', 'https://cdn.tr/trt1/index.m3u8'),
    kanal('TRT1 TR HD', 'http://a.de:8080/live/u/p/1001.ts'),
    kanal('TR: TRT 1', 'http://b.de:25/restream/restream/140900'),
    kanal('TR: CNN TURK', 'http://b.de:25/restream/restream/140894'),
    kanal('CNN Türk', 'https://cdn.tr/cnnturk/playlist.m3u8')
  ]));

  assert.deepEqual([...adlar(out)].sort(), ['CNN TURK', 'TRT 1'], 'TRT 1 üç kopyadan, CNN Türk iki kopyadan inmeli');
  const trt = out.find((c) => c.name === 'TRT 1');
  assert.equal(trt.altStreams.length, 2, 'kalan iki adres yedek olarak saklanmalı');
  const cnn = out.find((c) => c.name === 'CNN TURK');
  assert.equal(cnn.altStreams.length, 1, 'ikinci adres yedeğe yazılır');
  assert.match(cnn.altStreams[0].url, /\.m3u8/, 'HLS yedeği TS yedeğinden önce denenir');
});

test('HLS körlemesine ana yayına YÜKSELTİLMEZ (404 ayna vakası)', () => {
  // KANIT (kanal-kalite-probe): HLS aynalarından bazıları 404/ölü, TS yayını
  // yaşıyordu. kör promosyon ana yayını bozdu → sıra korunur, HLS yedekte öne geçer.
  const out = buildChannels(kaynak([
    kanal('DMAX', 'http://a.de:25/restream/restream/140939'),
    kanal('TR: DMAX', 'https://cdn.tr/dmax/index.m3u8')
  ]));
  assert.equal(out.length, 1);
  assert.equal(out[0].name, 'DMAX', '"TR:" öneki görünen adta kalmaz');
  assert.equal(out[0].streamUrl, 'http://a.de:25/restream/restream/140939', 'ilk gelen ana yayındır');
  assert.equal(out[0].altStreams.length, 1);
  assert.match(out[0].altStreams[0].url, /\.m3u8$/);
});

test('kalite eki ülke ekini gizleyemez: "TRT1 TR HD" = "TRT 1" (apk41 hatası)', () => {
  const out = buildChannels(kaynak([
    kanal('TRT 1', 'https://cdn.tr/trt1/index.m3u8'),
    kanal('TRT1 TR HD', 'http://a.de:8080/live/u/p/1001.ts')
  ]));
  assert.deepEqual(adlar(out), ['TRT 1'], 'sonda kalite eki olan kopya ayrı kanal sayılmamalı');
  assert.equal(out[0].altStreams.length, 1);
});

test('yalnız TS yayınlayan popüler kanal (DMAX/TLC/Discovery) listede KALIR', () => {
  const out = buildChannels(kaynak([
    kanal('TR: DMAX', 'http://a.de:25/restream/restream/140939'),
    kanal('TR: TLC', 'http://a.de:25/restream/restream/141232'),
    kanal('TR: DISCOVERY CHANNEL HD', 'http://a.de:25/restream/restream/141861')
  ]));
  assert.deepEqual(adlar(out).sort(), ['DISCOVERY CHANNEL', 'DMAX', 'TLC'], 'kalite eki görünen adtan temizlenir');
});

test('yabancı (Alman vb.) önekli kanallar listeye giremez', () => {
  const out = buildChannels(kaynak([
    kanal('DE: DMAX', 'http://a.de:25/restream/restream/134924'),
    kanal('DE: TLC', 'http://a.de:25/restream/restream/134996'),
    kanal('TR: DMAX', 'http://a.de:25/restream/restream/140939')
  ]));
  assert.deepEqual(adlar(out), ['DMAX'], 'yalnız Türk kaydı kalmalı');
});

test('marka eşleşmesi Türkçe/ASCII yazım farkına duyarsızdır', () => {
  const out = buildChannels(kaynak([
    kanal('TR: TRT ÇOCUK', 'https://cdn.tr/trtcocuk.m3u8'),
    kanal('TRT COCUK', 'http://a.de/live/u/p/2002.ts')
  ]));
  assert.deepEqual(adlar(out), ['TRT ÇOCUK']);
  assert.equal(out[0].altStreams.length, 1);
});

test('HLS destekli kanal, aynı katmanda TS-only kanalın önüne geçer', () => {
  const out = buildChannels(kaynak([
    kanal('A SPOR', 'http://a.de:25/restream/restream/140100'),
    kanal('ATV', 'https://cdn.tr/atv/index.m3u8')
  ]));
  assert.deepEqual(adlar(out), ['ATV', 'A SPOR'], 'popülerler aynı katmanda; HLS öne');
});

test('yerel şehir kanalı listelenir ve sıradan kategori kanalından önce gelir', () => {
  const out = buildChannels(kaynak([
    kanal('TR: KANAL 42 KONYA', 'https://cdn.tr/kanal42.m3u8'),
    kanal('TR: DÜNYA BELGESEL', 'https://cdn.tr/dbelgesel.m3u8', { category: 'belgesel' })
  ]));
  assert.ok(adlar(out).includes('KANAL 42 KONYA'), 'yerel kanal silinmemeli');
  const yerel = out.findIndex((c) => c.name === 'KANAL 42 KONYA');
  const diger = out.findIndex((c) => c.name === 'DÜNYA BELGESEL');
  assert.ok(yerel < diger, 'yerel kanal, kota kesintisinden önce gelmeli');
});

test('kota uygulanır: 300den fazlası listelenmez', () => {
  // "TEST" çöp-sözcük filtresine takılır; gerçekçi adlar kullanılıyor.
  const kalabalik = Array.from({ length: 400 }, (_, i) =>
    kanal(`TR: YILDIZ TV ${i}`, `https://cdn.tr/k${i}.m3u8`)
  );
  const out = buildChannels(kaynak(kalabalik));
  assert.ok(out.length > 0, 'kayıtlar kabul edilmeli');
  assert.ok(out.length <= 300, `kotayı aşmamalı (got ${out.length})`);
});

test('"X" ile "X TV" yazımı aynı kanaldır (cihaz: "A2" + "A2 TV" yan yana)', () => {
  const out = buildChannels(kaynak([
    kanal('TR: A2', 'https://cdn.tr/a2/index.m3u8'),
    kanal('A2 TV', 'http://a.de:8080/live/u/p/3003.ts')
  ]));
  assert.deepEqual(adlar(out), ['A2']);
  assert.equal(out[0].altStreams.length, 1);

  // Ters sıralı gelim de aynı sonucu vermeli.
  const ters = buildChannels(kaynak([
    kanal('TR: BENGU TURK TV', 'https://cdn.tr/benguturk.m3u8'),
    kanal('BENGÜTURK HD', 'http://a.de:8080/live/u/p/3004.ts')
  ]));
  assert.deepEqual(adlar(ters).length, 1);
});

test('kategori, genel grup yerine kanal ADINDAN belirlenir (kullanıcı: kategorilerde yok)', () => {
  // Kral listesinde Türk kanalların grubu geneldir ("TR | GENERAL VIP");
  // kategori haritası hepsini 'national' sayıyordu → Belgesel/Müzik boştu.
  const out = buildChannels(kaynak([
    kanal('TR: DMAX', 'http://a.de:25/restream/restream/140939', { group: 'TR | GENERAL VIP' }),
    kanal('TR: POWER TÜRK', 'http://a.de:25/restream/restream/140777', { group: 'TR | GENERAL VIP' }),
    kanal('TR: TRT BELGESEL', 'https://cdn.tr/trtbelgesel.m3u8', { group: 'TR | GENERAL VIP' }),
    kanal('TR: CNN TÜRK', 'https://cdn.tr/cnnturk.m3u8', { group: 'TR | GENERAL VIP' }),
    kanal('TR: TRT ÇOCUK', 'https://cdn.tr/trtcocuk.m3u8', { group: 'TR | GENERAL VIP' })
  ]));
  const kategori = (ad) => out.find((c) => c.name === ad)?.category;
  assert.equal(kategori('DMAX'), 'doc');
  assert.equal(kategori('POWER TÜRK'), 'music');
  assert.equal(kategori('TRT BELGESEL'), 'doc');
  assert.equal(kategori('CNN TÜRK'), 'news');
  assert.equal(kategori('TRT ÇOCUK'), 'kids');
});

test('belgesel/müzik kanalları, ulusal kalabalık içinde kotaya takılıp kaybolmaz', () => {
  const ulusalKalabaligi = Array.from({ length: 260 }, (_, i) =>
    kanal(`TR: YILDIZ TV ${i}`, `https://cdn.tr/y${i}.m3u8`)
  );
  const out = buildChannels(kaynak([
    ...ulusalKalabaligi,
    kanal('TR: NATIONAL GEO', 'https://cdn.tr/natgeo.m3u8'),
    kanal('TR: POWER TÜRK', 'https://cdn.tr/power.m3u8')
  ]));
  assert.ok(out.length <= 300);
  assert.ok(out.some((c) => c.name === 'NATIONAL GEO'), 'belgesel kanali listeye girmeli');
  assert.ok(out.some((c) => c.name === 'POWER TÜRK'), 'muzik kanali listeye girmeli');
});

test('radyo istasyonları TV ızgarasına girmez (cihaz: EFKAR FM / RADYO TATLISES)', () => {
  const out = buildChannels(kaynak([
    kanal('RADYO TATLISES', 'https://cdn.tr/radyo/index.m3u8'),
    kanal('EFKAR FM CANLI RADYO', 'https://cdn.tr/efkar/index.m3u8'),
    kanal('TRT 1', 'https://cdn.tr/trt1/index.m3u8')
  ]));
  assert.deepEqual(adlar(out), ['TRT 1']);
});

test('çöp kayıtlar (adresiz / tekrâr aynı adres) havuza giremez', () => {
  const out = buildChannels(kaynak([
    kanal('TR: ATV', ''),
    kanal('TR: ATV', 'https://cdn.tr/atv.m3u8'),
    kanal('TR: ATV', 'https://cdn.tr/atv.m3u8')
  ]));
  assert.deepEqual(adlar(out), ['ATV']);
  assert.equal(out[0].altStreams.length, 0, 'aynı adres yedek olarak çoğaltılmaz');
});
