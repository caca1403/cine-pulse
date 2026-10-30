import test from 'node:test';
import assert from 'node:assert/strict';
import { akışOtopilotu } from '../src/services/altyapi/flowPilot.js';

/* #4: codec/ses tercih puanlaması — Akış Otopilotu saf çekirdeği.
   Eşit cihaz/güven skorlarında tercih eşleşmesi kazananı belirler. */

const taban = { kaynaklar: [], cihazSkorlari: null, aileGuveni: {}, geceKoveti: false };

test('hevc tercihi: cozunemezHecv kaynağı öne geçer', () => {
  const kaynaklar = [
    { id: 'a_hevc', cozunemezHecv: true, title: 'Sunucu 1' },
    { id: 'b_h264', cozunemezHecv: false, title: 'Sunucu 2' }
  ];
  const karar = akışOtopilotu({ ...taban, kaynaklar, kodekTercih: 'hevc' });
  assert.equal(kaynaklar[karar.idx].id, 'a_hevc');
});

test('h264 tercihi: hevc olmayan kaynak öne geçer', () => {
  const kaynaklar = [
    { id: 'a_hevc', cozunemezHecv: true },
    { id: 'b_h264', cozunemezHecv: false }
  ];
  const karar = akışOtopilotu({ ...taban, kaynaklar, kodekTercih: 'h264' });
  assert.equal(kaynaklar[karar.idx].id, 'b_h264');
});

test('başlıktaki codec metni de okunur (bayrak yoksa)', () => {
  const kaynaklar = [
    { id: 'a', title: '1080p H.265' },
    { id: 'b', title: '1080p H.264' }
  ];
  const karar = akışOtopilotu({ ...taban, kaynaklar, kodekTercih: 'hevc' });
  assert.equal(kaynaklar[karar.idx].id, 'a');
});

test('5.1 tercihi: başlığında 5.1 olan kaynak öne geçer', () => {
  const kaynaklar = [
    { id: 'a_stereo', title: '1080p AAC 2.0' },
    { id: 'b_51', title: '1080p 5.1' }
  ];
  const karar = akışOtopilotu({ ...taban, kaynaklar, sesTercih: '51' });
  assert.equal(kaynaklar[karar.idx].id, 'b_51');
});

test('tercih yoksa (farketmez) davranış değişmez: ilk kaynak kazanır', () => {
  const kaynaklar = [
    { id: 'a_hevc', cozunemezHecv: true, title: 'AAC 2.0' },
    { id: 'b_h264', cozunemezHecv: false, title: '5.1' }
  ];
  const karar = akışOtopilotu({ ...taban, kaynaklar });
  assert.equal(kaynaklar[karar.idx].id, 'a_hevc');
});

test('kodek puanı (10) cihaz skoru farkını (≤9) yenebilir', () => {
  const kaynaklar = [
    { id: 'a_hevc', cozunemezHecv: true },
    { id: 'b_h264', cozunemezHecv: false }
  ];
  const karar = akışOtopilotu({
    ...taban,
    kaynaklar,
    cihazSkorlari: { 0: 50, 1: 58 }, // b dokuz puan önde
    kodekTercih: 'hevc'
  });
  assert.equal(kaynaklar[karar.idx].id, 'a_hevc');
});
