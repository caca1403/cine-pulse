// kit.js kimlik kapısı birimleri — adPuan + yilUyar (emsal: arsiv.puanla doktrini)
import test from 'node:test';
import assert from 'node:assert/strict';
import { adPuan, yilUyar } from '../src/providers/kit.js';

test('adPuan: tam=6, öneşek=4, içeren=2, ilgisiz=0', () => {
  assert.equal(adPuan('Breaking Bad', ['Breaking Bad']), 6);
  assert.equal(adPuan('Breaking Bad 1. Sezon', ['Breaking Bad']), 4);
  assert.equal(adPuan('La Casa de Papel', ['Money Heist', 'La Casa de Papel']), 6);
  assert.equal(adPuan('Kral Şakir Korsan Adası', ['Kral Şakir']), 4);
  assert.equal(adPuan('Kraliçenin Kanı', ['Kral']), 2);   // kapı eşiği ≥4 → RED
  assert.equal(adPuan('Büyük Kral Kaybı', ['Kral']), 2);  // ortada geçen → RED
  assert.equal(adPuan('Başka Bir Dünya', ['Kral']), 0);
  assert.equal(adPuan('', ['Kral']), 0);
  assert.equal(adPuan('Kral', []), 0);
});

test('adPuan: normalize TR harf + noktalama toleransı', () => {
  assert.equal(adPuan('La! Casa: DE papel', ['la casa de papel']), 6);
  assert.equal(adPuan('MUHTEŞEM YÜZYIL izle', ['Muhteşem Yüzyıl']), 4);
});

test('yilUyar: hedef yılı yoksa veya kartta yıl kanıtı yoksa geçer', () => {
  assert.equal(yilUyar(null, 'Breaking Bad 2017'), true);
  assert.equal(yilUyar(undefined, ''), true);
  assert.equal(yilUyar(2017, 'La Casa de Papel'), true); // kartta yıl yok → ihbar yok
});

test('yilUyar: iki yıl da biliniyorsa ±1 şart', () => {
  assert.equal(yilUyar(2017, 'La Casa de Papel (2017)'), true);
  assert.equal(yilUyar(2017, 'La Casa de Papel 2016'), true);
  assert.equal(yilUyar(2017, 'La Casa de Papel (2023)'), false); // yenideğişim/uyarlama
  assert.equal(yilUyar(1995, 'Jumanji (2017)'), false);
  assert.equal(yilUyar(2017, 2017), true);                        // sayı alanı
  assert.equal(yilUyar(2017, '1998', 'La Casa (2018)'), true);    // çoklu metin: biri uyar
});

test('yilUyar: 1080p/2160p gibi kalite etiketleri yıl sayılmaz', () => {
  assert.equal(yilUyar(2017, 'FİLM 1080p 2160 HDR'), true);
  assert.equal(yilUyar(2017, 'S01E01 720x404'), true);
});
