/* Sabit iş havuzu testleri (vekil.havuzIslet).
   Neden var: 43 sağlayıcıyı birden ateşlemek telefonda bellek zirvesini ve
   eşzamanlı istek sayısını patlatıyor (ölçülen tepe: 60 → 379 MB) ve arayüz
   buton beklerken kilitli kalıyor. Havuz, çalışan iş sayısını sabit tutar. */
import test from 'node:test';
import assert from 'node:assert/strict';

import { havuzIslet, HAVUZ_BOYU } from '../src/providers/vekil.js';

test('havuz boyu tanımlı ve makul', () => {
  assert.equal(typeof HAVUZ_BOYU, 'number');
  assert.ok(HAVUZ_BOYU >= 1 && HAVUZ_BOYU <= 8, 'telefon için 1..8 aralığı');
});

test('eşzamanlı çalışan görev sayısı sınırı aşmaz', async () => {
  let aktif = 0, zirve = 0;
  const gorevler = Array.from({ length: 43 }, () => async () => {
    aktif++; zirve = Math.max(zirve, aktif);
    await new Promise(r => setTimeout(r, 4));
    aktif--;
    return 'ok';
  });
  await havuzIslet(gorevler, 6);
  assert.ok(zirve > 1, 'görevler gerçekten eşzamanlı çalışmalı');
  assert.ok(zirve <= 6, `zirve ${zirve}, havuz 6`);
  assert.equal(aktif, 0);
});

test('varsayılan havuz boyu kullanılır', async () => {
  let zirve = 0, aktif = 0;
  const gorevler = Array.from({ length: 30 }, () => async () => {
    aktif++; zirve = Math.max(zirve, aktif);
    await new Promise(r => setTimeout(r, 3));
    aktif--;
  });
  await havuzIslet(gorevler);
  assert.ok(zirve <= HAVUZ_BOYU, `zirve ${zirve} > ${HAVUZ_BOYU}`);
});

test('sonuçlar girdi sırasını korur', async () => {
  const gorevler = Array.from({ length: 12 }, (_, i) => async () => {
    await new Promise(r => setTimeout(r, (12 - i) * 2)); // ters sıra ile biter
    return i;
  });
  const sonuclar = await havuzIslet(gorevler, 4);
  assert.deepEqual(sonuclar.map(s => s.deger), [...Array(12).keys()]);
  assert.ok(sonuclar.every(s => s.tamam === true));
});

test('bir görevin hatası havuzu durdurmaz', async () => {
  const sonuclar = await havuzIslet([
    async () => { throw new Error('cekirdek patladi'); },
    async () => 'ikinci',
    async () => { throw new Error('yine patladi'); },
    async () => 'dorduncu',
  ], 2);
  assert.equal(sonuclar[0].tamam, false);
  assert.equal(sonuclar[1].deger, 'ikinci');
  assert.equal(sonuclar[2].tamam, false);
  assert.equal(sonuclar[3].deger, 'dorduncu');
  assert.ok(sonuclar[0].hata instanceof Error);
});

test('bırakma doğrulması kalan işleri başlatmaz', async () => {
  let baslayan = 0;
  let birak = false;
  const gorevler = Array.from({ length: 20 }, () => async () => {
    baslayan++;
    await new Promise(r => setTimeout(r, 5));
    if (baslayan >= 3) birak = true;
  });
  await havuzIslet(gorevler, 3, () => birak);
  assert.ok(baslayan < 20, `bırakma işe yaramadı: ${baslayan}/20 başladı`);
});

test('boş ve tek görevli girdi güvenli', async () => {
  assert.deepEqual(await havuzIslet([], 4), []);
  const tek = await havuzIslet([async () => 'tek'], 4);
  assert.equal(tek[0].deger, 'tek');
});

test('havuz girdi dizisini değiştirmez', async () => {
  const gorevler = [async () => 1, async () => 2];
  const kopya = [...gorevler];
  await havuzIslet(gorevler, 2);
  assert.equal(gorevler.length, 2);
  assert.equal(gorevler[0], kopya[0]);
});
