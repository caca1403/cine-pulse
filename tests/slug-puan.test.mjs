/* ==========================================================================
   SLUG PUANI — yanlış yapıt açma hatasının kilit testi (ağsız)
   --------------------------------------------------------------------------
   ÖLÇÜLEN HATA (2026-11-16, canlı siteden kanıt):
     diziyou "?s=stranger+things" araması iki kart döndürüyor
       /stranger-things/               → oynatıcı 40901  (GERÇEK dizi, ~49 dk)
       /stranger-things-tales-from-85/ → oynatıcı 155901 (animasyon, ~31 dk)
   "içerir" mantığı ikisini ayırt edemediği için çekirdek spinoff'u seçiyor ve
   kullanıcı izle düğmesine basınca BAŞKA bir yapıt açıyordu. Bu test, türevin
   asla tam uyuşmanın önüne geçemediğini ve numaralı/yıllı eklerin (aynı eser)
   türev SAYILMADIĞINI garanti eder.
   Çalıştır: node --test tests/slug-puan.test.mjs
   ========================================================================== */
import { test } from 'node:test';
import assert from 'node:assert/strict';

import { slugPuani, kelimeListesi } from '../src/providers/ortakCekirdek.js';

test('kelimeListesi: Türkçe harfleri sadeleştirir, rakamları ayırır', () => {
  assert.deepEqual(kelimeListesi('Kiralık Aşk'), ['kiralik', 'ask']);
  assert.deepEqual(kelimeListesi('breaking-bad2'), ['breaking', 'bad', '2']);
  assert.deepEqual(kelimeListesi('The Office (US)'), ['the', 'office', 'us']);
  assert.deepEqual(kelimeListesi(''), []);
});

test('tam uyuşma en yüksek puanı alır (3)', () => {
  assert.equal(slugPuani('stranger-things', ['Stranger Things']), 3);
  assert.equal(slugPuani('kiralik-ask', ['Kiralık Aşk', 'Stranger Things']), 3);
});

test('ünlü yazım farkı (Aşk ~ asik) aynı eser sayılır, türevden yüksek kalır', () => {
  assert.equal(slugPuani('kiralik-asik', ['Kiralık Aşk']), 2);
  assert.ok(slugPuani('kiralik-asik', ['Kiralık Aşk']) > slugPuani('kiralik-asik-baska-bir-dizi', ['Kiralık Aşk']));
});

test('numara/yıl eki AYNI ESER sayılır (2), türevden yüksek kalır', () => {
  assert.equal(slugPuani('breaking-bad2', ['Breaking Bad']), 2);
  assert.equal(slugPuani('the-office-2005', ['The Office']), 2);
  assert.equal(slugPuani('la-casa-de-papel-3', ['La Casa de Papel']), 2);
});

test('türev/ek ad yalnız 1 alır — tam uyuşma varsa onu ASLA geçmez', () => {
  const dogru = slugPuani('stranger-things', ['Stranger Things']);
  const turev = slugPuani('stranger-things-tales-from-85', ['Stranger Things']);
  assert.equal(dogru, 3);
  assert.equal(turev, 1);
  assert.ok(turev < dogru);
});

test('alakasız slug 0 alır (yanlış diziye düşülmez)', () => {
  assert.equal(slugPuani('the-big-bang-theory', ['Stranger Things']), 0);
  assert.equal(slugPuani('', ['Stranger Things']), 0);
  assert.equal(slugPuani('stranger-things', []), 0);
});

test('regresyon: site sırası türevi önce verese bile doğru slug kazanır', () => {
  // Canlı sitede ölçülen HTML sırası (türev kart önce geliyor).
  const sluglar = ['stranger-things-tales-from-85', 'stranger-things'];
  const adaylar = ['Stranger Things', 'Stranger Things'];
  const sirali = [...sluglar]
    .map((s) => ({ slug: s, puan: slugPuani(s, adaylar) }))
    .filter((a) => a.puan > 0)
    .sort((x, y) => y.puan - x.puan);
  assert.equal(sirali[0].slug, 'stranger-things', 'çekirdek yanlış yapıtı açmamalı');
});

test('tek aday türevse kaynak tamamen kaybolmaz (puan 1 ile hayatta kalır)', () => {
  const sirali = ['stranger-things-tales-from-85']
    .map((s) => ({ slug: s, puan: slugPuani(s, ['Stranger Things']) }))
    .filter((a) => a.puan > 0);
  assert.equal(sirali.length, 1);
  assert.equal(sirali[0].puan, 1);
});

test('wolverine seçim deseninin üstünlüğü: elit katman içinde bölüm aranır', () => {
  // Arama listesinde bölüm linki YALNIZ türev kartta var; eski kod
  // `puanlı.find(sezon/bölüm)` ile türevi seçiyordu. Yeni desen önce en
  // yüksek puanlı katmanı seçer, bu yüzden bölüm linki olmayan doğru
  // slug'ın adresi slug'dan üretilir.
  const adaylar = [
    { govde: 'stranger-things-tales-from-85', sezon: 1, bolim: 1 },
    { govde: 'stranger-things', sezon: undefined, bolim: undefined },
  ];
  const sorgular = ['Stranger Things'];
  const puanli = adaylar
    .map((a) => ({ ...a, puan: Math.max(...sorgular.map((s) => slugPuani(a.govde, s))) }))
    .filter((a) => a.puan > 0)
    .sort((x, y) => y.puan - x.puan);
  const enIyi = puanli[0].puan;
  const elit = puanli.filter((a) => a.puan === enIyi);
  const isabet = elit.find((a) => a.sezon === 1 && a.bolim === 1);
  assert.equal(isabet, undefined, 'türev kartın bölüm linki artık seçilmez');
  assert.equal(elit[0].govde, 'stranger-things');
});
