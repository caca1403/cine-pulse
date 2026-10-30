/* Tarama sırası + kısa dizi garantisi (2026-10-16).
   --------------------------------------------------------------------------
   1) Bütçe sınırlıysa (kayıt başına 10-40 sn) ilk dalgayı neyin oluşturduğu
      SONUCU DEĞİŞTİRİR: alfabetik sırada "bu içerikte olmayan" kayıtlar ilk
      dalgayı tüketip süre dolabiliyordu. Yayın vermiş kayıtlar öne geçmeli.
   2) Dora/Rhea (kısa dizi) hatları kahraman taramasının ARKASINDA beklerse
      75 sn'lik bütçe kısa diziyi öldürür → kahraman taraması beklemeden
      aynı anda koşmalı.
   Çalıştır: node --test tests/kahraman-tarama-sirasi.test.mjs  (ağ yok) */
import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { onerilenSira, kaynakTara, SAĞLAYICI_TAVANI_MS, BUTCE_MS } from '../src/providers/vekil.js';

const KOK = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const oku = (...p) => fs.readFileSync(path.join(KOK, ...p), 'utf8');

const KAYITLAR = [
  ['Zod', { turler: ['movie'], durum: 'bilinmiyor' }],
  ['Aquaman', { turler: ['movie'], durum: 'canli' }],
  ['Batman', { turler: ['movie'], durum: 'kapali' }],
  ['Ant-Man', { turler: ['movie'], durum: 'canli' }],
  ['Beast-Boy', { turler: ['movie'], durum: 'bozuk' }],
  ['Aqualad', { turler: ['movie'], durum: 'bilinmiyor' }]
];

test('sıra: canlılar en önce, kapalı/en verimsiz en sonra', () => {
  const sıra = onerilenSira(KAYITLAR).map(([ad]) => ad);
  assert.deepEqual(sıra.slice(0, 2), ['Ant-Man', 'Aquaman'], 'canlılar alfabetik ama önde');
  assert.equal(sıra.at(-1), 'Batman', 'kapalı kayıt son sırada');
  assert.ok(sıra.indexOf('Beast-Boy') > sıra.indexOf('Aqualad'), 'ölçülmüş-bozuk, ölçülmemişin ardından gelir');
});

test('sıra kararlıdır ve girdiyi bozmaz', () => {
  const kopya = KAYITLAR.map(([a, k]) => [a, k]);
  const ilk = onerilenSira(KAYITLAR).map(([a]) => a).join(',');
  const ikinci = onerilenSira(KAYITLAR).map(([a]) => a).join(',');
  assert.equal(ilk, ikinci);
  assert.equal(KAYITLAR.length, kopya.length);
  assert.equal(KAYITLAR[0][0], 'Zod', 'orijinal dizi sırası değişmemeli');
});

test('kayıt tavanı toplam bütçeden küçüktür (tek kazıcı payı yiyemez)', () => {
  assert.ok(SAĞLAYICI_TAVANI_MS < BUTCE_MS, `${SAĞLAYICI_TAVANI_MS} < ${BUTCE_MS} olmalı`);
  assert.equal(typeof kaynakTara, 'function');
});

/* ── kaynak bekçileri: sözleşme yerinde duruyor mu ───────────────────────── */

test('kaynakTara: verim sırasını kullanır ve kapalıları denemez', () => {
  const vekil = oku('src', 'providers', 'vekil.js');
  assert.match(vekil, /onerilenSira\(kayitListesi\(tur\)\)/, 'tarama verim sırasıyla başlamalı');
  assert.match(vekil, /durum !== 'kapali'/, 'kapalı kayıtlar denenmemeli');
  assert.match(vekil, /kayıt\?\.tavaniMs \|\| saglayiciTavani\(\)/, 'kayda kendi tavanı verilmeli (toplam bütçe değil; gizli-WebView kayıtları tavaniMs ile büyütür)');
});

test('kısa dizi garantisi: kahraman taraması beklenmeden aynı anda koşar', () => {
  const agregator = oku('src', 'services', 'kaynak', 'providerAggregator.js');
  assert.ok(
    !/const\s+tara\s*=\s*await\s+kaynakTara/.test(agregator),
    'kaynakTara await edilerek kısa dizi hattının önüne konamaz'
  );
  assert.match(agregator, /kahramanTaramasi\s*=\s*kaynakTara\(/, 'tarama başlatılıp saklanmalı');
  const kuyruk = agregator.slice(agregator.indexOf('await Promise.allSettled(['));
  assert.match(kuyruk, /kahramanTaramasi/, 'tarama, kısa dizi görevleriyle aynı allSettled içinde olmalı');
});

test('kahraman yayınları başlık taşıyan proxy hattından verilir', () => {
  const vekil = oku('src', 'providers', 'vekil.js');
  // KÖPRÜSÜZ BAŞLIK istisnası (2026-10-29, dizisol imzalı CDN): çekirdek
  // `proxyGerekmez/kopruGerekmez` bildirirse adres SARMALENMAZ, istek cihazdan gider.
  assert.match(vekil, /başlıkGerekli && !kopruGerekmez \? oynatmaAdresi\(url, başlıklar\) : url/, 'sarmalama yalnız başlık istenince ve çekirdek köprü istemeyince yapılmalı');
  assert.match(vekil, /\/api\/hls_proxy\?/, 'başlık taşıyabilen proxy yolu kullanılmalı');
});
