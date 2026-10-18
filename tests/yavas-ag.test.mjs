/* Yavaş ağ modu — kullanıcı 2026-10-18: "kaynakları internet yavaşken taramıyor",
   "dün 30 kaynak vardı şimdi 5". Çekirdekler AbortSignal.timeout(4000) kullanır;
   RTT 1.4-4 sn olan ağda bu pencere yetmiyor. Tarama tavanları yavaş modda
   büyür. Bu testler adaptif tavanları sabitler. */
import test from 'node:test';
import assert from 'node:assert/strict';

import { saglayiciTavani, taramaButcesi, SAĞLAYICI_TAVANI_MS, BUTCE_MS } from '../src/providers/vekil.js';

test('normal ağda tavanlar sabit değerlerinde kalır', () => {
  delete globalThis.window;
  assert.equal(saglayiciTavani(), SAĞLAYICI_TAVANI_MS);
  assert.equal(taramaButcesi(), BUTCE_MS);
});

test('yavaş ağda sağlayıcı ve toplam tavan büyür', () => {
  globalThis.window = { __cpYavasAg: true };
  assert.equal(saglayiciTavani(), 45_000);
  assert.equal(taramaButcesi(), 180_000);
  assert.ok(saglayiciTavani() > SAĞLAYICI_TAVANI_MS);
  assert.ok(taramaButcesi() > BUTCE_MS);
  delete globalThis.window;
});

test('yavaş mod kapanınca tavanlar geri döner', () => {
  globalThis.window = { __cpYavasAg: true };
  assert.equal(saglayiciTavani(), 45_000);
  globalThis.window = { __cpYavasAg: false };
  assert.equal(saglayiciTavani(), SAĞLAYICI_TAVANI_MS);
  delete globalThis.window;
});
