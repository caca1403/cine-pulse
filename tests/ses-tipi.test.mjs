/* Kaynak SES TİPİ — TESPİTE dayalı (kullanıcı 2026-10-18):
   "otomatik yabancıysa Türkçe yok gibi yapma; orijinalse öyle, Türkçe altyazı
   varsa öyle, dublaj gerçekten dublaj olsun." Etiket, kaynak m3u8'inden çıkan
   trSes / trAltyazi bayraklarına (veya çekirdeğin isDual doğrulamasına) göre
   belirlenir; Türkçe iz yoksa 'ozgun' (Özgün Dil). Bu testler kuralı sabitler. */
import test from 'node:test';
import assert from 'node:assert/strict';

import { sesTipiBul, sesTipiEtiketi, yerliKaynakMi } from '../src/services/kaynak/providerAggregator.js';

test('yabancı + hiç Türkçe iz yok → Özgün Dil (sahte Altyazı değil)', () => {
  const yabanci = { id: 'sp_spiderman_1', streamUrl: 'https://cdn.example/1.m3u8' };
  assert.equal(yerliKaynakMi(yabanci), false);
  assert.equal(sesTipiBul(yabanci, 'dubbed'), 'ozgun');
  assert.equal(sesTipiBul(yabanci, 'subtitled'), 'ozgun');
});

test('yabancı + çekirdek isDual (Türkçe ses) → Dublaj', () => {
  assert.equal(sesTipiBul({ id: 'sp_x_1', isDual: true }, 'dubbed'), 'dublaj');
});

test('yabancı + trSes bayrağı → Dublaj', () => {
  assert.equal(sesTipiBul({ id: 'sp_x_2', trSes: true }, 'subtitled'), 'dublaj');
});

test('yabancı + trAltyazi bayrağı → Türkçe Altyazı', () => {
  assert.equal(sesTipiBul({ id: 'sp_x_3', trAltyazi: true }, 'ozgun'), 'altyazi');
});

test('ses hem altyazı hem dublaj izliyse dublaj önceliklidir', () => {
  assert.equal(sesTipiBul({ id: 'sp_x_4', trSes: true, trAltyazi: true }, 'dubbed'), 'dublaj');
});

test('bilinçli dublaj/altyazı kopyaları sonekinden belirlenir', () => {
  assert.equal(sesTipiBul({ id: 'sp_x_9_xd' }, 'ozgun'), 'dublaj');
  assert.equal(sesTipiBul({ id: 'sp_x_9_xs' }, 'ozgun'), 'altyazi');
});

test('yerli (Türk) kaynak kategoriye göre etiketlenir', () => {
  assert.equal(sesTipiBul({ id: 'sp_nightwing_42', streamUrl: 'https://api.anizium.co/x.m3u8' }, 'dubbed'), 'dublaj');
  assert.equal(sesTipiBul({ id: 'sp_thor_7', streamUrl: 'https://dizilla.now/x.m3u8' }, 'subtitled'), 'altyazi');
  assert.equal(sesTipiBul({ id: 'ddz_abc', streamUrl: 'x.m3u8' }, 'dubbed'), 'dublaj');
});

test('etiket metinleri: üç durum, doğru karşılık', () => {
  assert.equal(sesTipiEtiketi('dublaj'), '🇹🇷 Türkçe Dublaj');
  assert.equal(sesTipiEtiketi('altyazi'), '💬 Türkçe Altyazı');
  assert.equal(sesTipiEtiketi('ozgun'), '🌐 Özgün Dil');
  assert.equal(sesTipiEtiketi(undefined), '🌐 Özgün Dil');
});

test('eksik/bozuk kaynak çökmez → Özgün Dil', () => {
  assert.equal(sesTipiBul(null, 'dubbed'), 'ozgun');
  assert.equal(sesTipiBul(undefined), 'ozgun');
  assert.equal(yerliKaynakMi({}), false);
});
