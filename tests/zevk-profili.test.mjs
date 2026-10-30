/* ==========================================================================
   Zevk profili testleri — "kullanıcının verisi Ana Sayfa'yı belirlesin"
   --------------------------------------------------------------------------
   Kanıtlar:
   · Sinyal ağırlıkları (favori > bitirilen > liste > izlenen) tür puanına yansır
   · Recency çarpanı eskimiş sinyali zayıflatır
   · ogePuani: tür uyumu + doğrudan işaret; profil boşsa 0 (sahte kişiselleştirme yok)
   · profilSirala: eşik üstü öğeler öne, eşit puanda özgün sıra korunur
   · yerelSatirlar: minAdet altındaki liste çizilmez, sıra favori→liste→bitirilen
   · ozetMetni: yalnız gerçek sayılardan
   ========================================================================== */
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  SINYAL_AGIRLIK, tazelikCarpani, turKimlikleri, profilKur, ogePuani,
  profilSirala, yerelSatirlar, ozetMetni
} from '../src/services/kisisel/zevkProfili.js';

const GUN = 86400000;

function oge(id, turler, ek = {}) {
  return { id, title: `Yapıt ${id}`, genre_ids: turler, ...ek };
}

/* ── 1. Ağırlık hiyerarşisi ──────────────────────────────────────────── */
test('sinyal ağırlıkları: favori > bitirilen > liste > izlenen', () => {
  assert.ok(SINYAL_AGIRLIK.favori > SINYAL_AGIRLIK.bitirilen);
  assert.ok(SINYAL_AGIRLIK.bitirilen > SINYAL_AGIRLIK.liste);
  assert.ok(SINYAL_AGIRLIK.liste > SINYAL_AGIRLIK.izlenen);
  assert.ok(SINYAL_AGIRLIK.izlenen > SINYAL_AGIRLIK.birakilan);
});

test('profilKur: aynı sayıda yapıtta favori türü listenin önüne geçer', () => {
  const simdi = 1_700_000_000_000;
  const profil = profilKur({
    favoriler: [oge(1, [18]), oge(2, [18])],
    watchlist: [oge(3, [35]), oge(4, [35])],
    simdiMs: simdi
  });
  assert.ok(profil.turAgirlik[18] > profil.turAgirlik[35]);
  assert.equal(profil.turAgirlik[18], 1, 'en güçlü tür 1.0 normalize');
  assert.ok(profil.turSira[0].id === 18);
  assert.equal(profil.toplam.favori, 2);
  assert.equal(profil.toplam.liste, 2);
  assert.equal(profil.bos, false);
});

test('profilKur: geçmişte completed işaretli yapıt bitirilen kadar güçlü sayılır, çift sayılmaz', () => {
  const simdi = 1_700_000_000_000;
  const tamamlanan = [oge(10, [80])];
  const gecmis = [{ ...oge(10, [80]), completed: true }];
  const a = profilKur({ tamamlanan, gecmis, simdiMs: simdi });
  const b = profilKur({ tamamlanan: [], gecmis, simdiMs: simdi });
  // İkisi de "bitirilen" ağırlığı alır → normalize edilmiş ağırlık eşit.
  assert.equal(a.turAgirlik[80], b.turAgirlik[80]);
  // Çift sayılmadığının kanıtı: yapıt sayısı iki profilde de 1.
  assert.equal(a.turSira.find((t) => t.id === 80).adet, 1);
  assert.equal(b.turSira.find((t) => t.id === 80).adet, 1);

  // Tamamlanmış, yarım kalmıştan güçlüdür (aynı tür için toplam puan).
  const yarim = profilKur({ gecmis: [{ ...oge(11, [53]), progressPercent: 20 }], simdiMs: simdi });
  const bitmis = profilKur({ gecmis: [{ ...oge(11, [53]), completed: true }], simdiMs: simdi });
  assert.equal(bitmis.turSira[0].adet, yarim.turSira[0].adet);
  // Normalize tepe 1 olduğundan mutlak puan yerine ozet/oran üzerinden ölçülür:
  const karisik = profilKur({
    gecmis: [
      { ...oge(11, [53]), completed: true },
      { ...oge(12, [35]), progressPercent: 15 }
    ],
    simdiMs: simdi
  });
  assert.ok(karisik.turAgirlik[53] > karisik.turAgirlik[35],
    'bitirilen tür, yarım kalan türden güçlü olmalı');
});

test('profilKur: boş sinyal → bos=true, sıralama değişmez', () => {
  const profil = profilKur({});
  assert.equal(profil.bos, true);
  assert.equal(profil.sinyalSayisi, 0);
  assert.deepEqual(profil.turSira, []);
  const liste = [oge(1, [18]), oge(2, [35])];
  assert.deepEqual(profilSirala(liste, profil).map((x) => x.id), [1, 2]);
});

/* ── 2. Recency ──────────────────────────────────────────────────────── */
test('tazelikCarpani: 90 günde yarıya düşer, gelecekte 1 kalır', () => {
  const simdi = 1_700_000_000_000;
  assert.ok(Math.abs(tazelikCarpani(simdi, simdi) - 1) < 1e-9);
  assert.ok(Math.abs(tazelikCarpani(simdi - 90 * GUN, simdi) - 0.5) < 1e-6);
  assert.ok(Math.abs(tazelikCarpani(simdi - 180 * GUN, simdi) - 0.25) < 1e-6);
  assert.equal(tazelikCarpani(simdi + 10 * GUN, simdi), 1, 'gelecek tarih tam ağırlık');
  assert.equal(tazelikCarpani(0, simdi), 1, 'tarihsiz kayıt tam ağırlık');
});

test('profilKur: eski favori, yeni izlenenden daha zayıf kalabilir', () => {
  const simdi = 1_700_000_000_000;
  const eski = profilKur({
    favoriler: [{ ...oge(1, [18]), lastWatchedAt: simdi - 720 * GUN }],
    simdiMs: simdi
  });
  assert.ok(eski.turAgirlik[18] === 1, 'tek tür olduğu için normalize 1');
  // Karşılaştırma: aynı türde taze izlenen + eski favori toplamı eskiden yüksek.
  const karisik = profilKur({
    favoriler: [{ ...oge(1, [18]), lastWatchedAt: simdi - 720 * GUN }],
    gecmis: [{ ...oge(2, [35]), lastWatchedAt: simdi }],
    simdiMs: simdi
  });
  assert.ok(karisik.turAgirlik[35] > karisik.turAgirlik[18],
    `taze izlenen (${karisik.turAgirlik[35]}) eski favoriyi (${karisik.turAgirlik[18]}) geçmeli`);
});

/* ── 3. Öğe puanı ────────────────────────────────────────────────────── */
test('ogePuani: tür uyumu + doğrudan işaret; profil boşsa 0', () => {
  const simdi = 1_700_000_000_000;
  const profil = profilKur({
    favoriler: [oge(1, [18]), oge(2, [18])],
    watchlist: [oge(3, [35])],
    simdiMs: simdi
  });
  const dram = ogePuani(oge(50, [18]), profil);
  const komedi = ogePuani(oge(51, [35]), profil);
  const ilgisiz = ogePuani(oge(52, [99]), profil);
  assert.ok(dram > komedi, 'dram > komedi');
  assert.ok(komedi > ilgisiz, 'komedi > ilgisiz');
  assert.equal(ilgisiz, 0, 'hiç eşleşmeyen tür 0 puan');

  // Doğrudan favori işareti ek puan verir.
  const favoriOge = ogePuani({ id: 1, genre_ids: [] }, profil);
  assert.ok(favoriOge > 0, 'türü olmayan favori yine de puan alır');
  assert.equal(ogePuani(oge(9, [18]), profilKur({})), 0, 'boş profilde 0');
});

/* ── 4. Sıralama ─────────────────────────────────────────────────────── */
test('profilSirala: eşik üstü öğeler öne, eşit puanda özgün sıra korunur', () => {
  const simdi = 1_700_000_000_000;
  const profil = profilKur({ favoriler: [oge(1, [18]), oge(2, [18])], simdiMs: simdi });
  const liste = [oge(10, [35]), oge(11, [18]), oge(12, [18]), oge(13, [99])];
  const sirali = profilSirala(liste, profil, { esik: 0.1 });
  assert.deepEqual(sirali.slice(0, 2).map((x) => x.id), [11, 12]);
  assert.deepEqual(sirali.slice(2).map((x) => x.id), [10, 13], 'kalanlar özgün sırada');
  assert.equal(sirali.length, liste.length, 'hiçbir öğe kaybolmaz');
});

test('profilSirala: haric kümesi ve enFazla sınırı', () => {
  const profil = profilKur({ favoriler: [oge(1, [18])], simdiMs: 1_700_000_000_000 });
  const liste = [oge(10, [18]), oge(11, [18]), oge(12, [18])];
  assert.deepEqual(profilSirala(liste, profil, { haric: new Set(['10']) }).map((x) => x.id), [11, 12]);
  assert.equal(profilSirala(liste, profil, { enFazla: 2 }).length, 2);
  assert.deepEqual(profilSirala([], profil), []);
});

/* ── 5. Yerel satırlar ───────────────────────────────────────────────── */
test('yerelSatirlar: minAdet altındaki liste çizilmez, sıra favori→liste→bitirilen', () => {
  const simdi = 1_700_000_000_000;
  const alti = (baslangic, turler) => Array.from({ length: 6 }, (_, i) => oge(baslangic + i, turler));
  const profil = profilKur({ simdiMs: simdi });

  const satirlar = yerelSatirlar(profil, {
    favoriler: alti(100, [18]),
    watchlist: alti(200, [35]),
    tamamlanan: [oge(300, [80])]
  }, { minAdet: 6 });
  assert.equal(satirlar.length, 2, 'bitirdikleri 6 altı olduğu için satır yok');
  assert.deepEqual(satirlar.map((s) => s.anahtar), ['rail-ozel-favori', 'rail-ozel-liste']);
  assert.equal(satirlar[0].ogeler.length, 6);
  assert.equal(satirlar[0].baslik, 'Favorilerinden');
});

test('yerelSatirlar: enFazla sınırı uygulanır', () => {
  const favoriler = Array.from({ length: 30 }, (_, i) => oge(400 + i, [18]));
  const satirlar = yerelSatirlar(profilKur({}), { favoriler }, { minAdet: 6, enFazla: 12 });
  assert.equal(satirlar.length, 1);
  assert.equal(satirlar[0].ogeler.length, 12);
});

/* ── 6. Özet + yardımcılar ───────────────────────────────────────────── */
test('ozetMetni: yalnız gerçek sayılar ve en güçlü türler', () => {
  const simdi = 1_700_000_000_000;
  const profil = profilKur({
    favoriler: [oge(1, [18]), oge(2, [18])],
    watchlist: [oge(3, [53])],
    tamamlanan: [oge(4, [18])],
    simdiMs: simdi
  });
  const metin = ozetMetni(profil, { turAdet: 2 });
  assert.ok(metin.includes('2 favori'));
  assert.ok(metin.includes('1 listede'));
  assert.ok(metin.includes('1 bitirdin'));
  assert.ok(metin.includes('Dram'), `en güçlü tür yazılmalı: ${metin}`);
  assert.equal(ozetMetni(profilKur({})), '', 'boş profilde özet yok');
});

test('turKimlikleri: genre_ids / genres / genre alanlarının hepsini okur', () => {
  assert.deepEqual(turKimlikleri({ genre_ids: [18, 80] }).sort(), [18, 80]);
  assert.deepEqual(turKimlikleri({ genres: [{ id: 18 }, { id: 53 }] }).sort(), [18, 53]);
  assert.deepEqual(turKimlikleri({ genre: 35 }), [35]);
  assert.deepEqual(turKimlikleri({}), []);
  assert.deepEqual(turKimlikleri(null), []);
});
