/* Disk önbellek geri alma — politika testleri (dosya sistemi yok).
   Kural: aktif/korumalı akış ASLA silinmez; hedef yalnız korunmayanlardan
   karşılanır ve en eski girdiden başlanır. */
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  girdiKontrol,
  korumaliMi,
  reclaimPlanla,
  reclaimOzeti,
  bosGirdiler,
} from '../src/services/dogrudan/cacheReclaim.js';

const g = (kimlik, bayt, sonKullanim, ek = {}) => ({ kimlik, bayt, sonKullanim, ...ek });

test('reclaim: girdi doğrulaması', () => {
  assert.equal(girdiKontrol(g('a', 10, 0)), true);
  assert.equal(girdiKontrol(null), false);
  assert.equal(girdiKontrol({ kimlik: 'a' }), false);
  assert.equal(girdiKontrol({ kimlik: 'a', bayt: -1, sonKullanim: 0 }), false);
  assert.equal(girdiKontrol({ bayt: 10 }), false);
});

test('reclaim: etkin veya korumalı girdi korunur', () => {
  assert.equal(korumaliMi({ etkin: true }), true);
  assert.equal(korumaliMi({ korumali: true }), true);
  assert.equal(korumaliMi({}), false);
});

test('reclaim: hedef zaten sağlanıyorsa hiçbir şey silinmez', () => {
  const plan = reclaimPlanla([g('a', 100, 1), g('b', 100, 2)], { hedefBayt: 500 });
  assert.equal(plan.silinecek.length, 0);
  assert.equal(plan.hedefKalan, 200);
});

test('reclaim: hedef için en eskiden başlanır ve hedef KARŞILANIR', () => {
  const plan = reclaimPlanla([
    g('yeni', 100, 300),
    g('eski', 100, 100),
    g('orta', 100, 200),
  ], { hedefBayt: 150 });
  // 300 -> eski sil (200) -> hâlâ 200>150 -> orta sil (100). Hedef aşıldı.
  assert.deepEqual(plan.silinecek.map(x => x.kimlik), ['eski', 'orta']);
  assert.equal(plan.hedefKalan, 100);
});

test('reclaim: ETKİN akış hiçbir koşulda silinmez', () => {
  const plan = reclaimPlanla([
    g('aktif', 100, 1, { etkin: true }),      // en eski ama ETKİN
    g('normal', 100, 200),
    g('koru', 100, 300, { korumali: true }),
  ], { hedefBayt: 0 });
  assert.deepEqual(plan.silinecek.map(x => x.kimlik), ['normal']);
  assert.ok(plan.korunan.some(x => x.kimlik === 'aktif'));
  assert.ok(plan.korunan.some(x => x.kimlik === 'koru'));
});

test('reclaim: hedef korunanlardan karşılanamaz', () => {
  const plan = reclaimPlanla([
    g('aktif', 500, 1, { etkin: true }),
    g('normal', 100, 2),
  ], { hedefBayt: 0 });
  assert.deepEqual(plan.silinecek.map(x => x.kimlik), ['normal']);
  assert.equal(plan.hedefKalan, 500, 'aktif akışın baytı korunur');
});

test('reclaim: küçük silme hedefi karşılamıyorsa devam eder', () => {
  const plan = reclaimPlanla([
    g('kucuk', 50, 1),
    g('dev', 5000, 2),
  ], { hedefBayt: 0 });
  // Açgözlü değil AMA TUTARLI: hedef karşılanana kadar sürer.
  assert.deepEqual(plan.silinecek.map(x => x.kimlik), ['kucuk', 'dev']);
  assert.equal(plan.hedefKalan, 0, 'hedef asla eksik bırakılmaz');
});

test('reclaim: özet içerik adı sızdırmaz', () => {
  const plan = reclaimPlanla([g('a', 100, 1), g('b', 100, 2, { etkin: true })], { hedefBayt: 0 });
  const ozet = reclaimOzeti(plan);
  assert.equal(ozet.silinecekAdet, 1);
  assert.equal(ozet.silinecekBayt, 100);
  assert.equal(ozet.korunanAdet, 1);
  assert.equal(ozet.hedefKalanBayt, 100);
  assert.ok(!JSON.stringify(ozet).includes('kimlik'));
});

test('reclaim: boş girdi listesi korumalıları dışlar', () => {
  const simdi = 10_000_000;
  const bos = bosGirdiler([
    g('eski', 10, 0),
    g('koru', 10, 0, { korumali: true }),
    g('aktif', 10, simdi - 60_000, { etkin: true }),
    g('yeni', 10, simdi - 1000),
  ], { simdi, bosMs: 30 * 60 * 1000 });
  assert.deepEqual(bos.map(x => x.kimlik), ['eski']);
});

test('reclaim: boş girdiler en eskiden başlar', () => {
  const simdi = 10_000_000;
  const bos = bosGirdiler([g('b', 10, 100), g('a', 10, 50)], { simdi, bosMs: 1000 });
  assert.deepEqual(bos.map(x => x.kimlik), ['a', 'b']);
});

test('reclaim: boş girdi listesi boş girdi listesi nesnesini bozmaz', () => {
  const girdiler = [g('a', 10, 0), g('b', 10, 0)];
  bosGirdiler(girdiler, { simdi: 0, bosMs: 0 });
  assert.equal(girdiler.length, 2, 'girdi listesi değişmemeli');
  assert.equal(girdiler[0].kimlik, 'a');
});

test('reclaim: boş liste ve hedef sıfır güvenli', () => {
  const plan = reclaimPlanla([], { hedefBayt: 0 });
  assert.deepEqual(plan.silinecek, []);
  assert.equal(plan.hedefKalan, 0);
  assert.equal(plan.baslangicToplam, 0);
});