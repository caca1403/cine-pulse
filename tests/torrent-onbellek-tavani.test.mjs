/* Regresyon — masaüstü torrent önbelleği disk tavanı (ölçüm 2026-11-13).
   Doğrulama sırasında Electron uygulamasında bir torrent hattı oynarken
   önbellek ~15 dakikada 8.9 GB'a ulaştı ve diski doldurdu. Zaman tabanlı
   (30 dk boşta) temizlik aktif akışın büyümesini engellemiyordu. mediaServer'a
   boyut tavanı + tahliye eklendi; bu test politikayı kaynak-doğrulamasıyla
   ve saf planlayıcıyla (cacheReclaim) sabitler. */
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { reclaimPlanla } from '../src/services/dogrudan/cacheReclaim.js';

const SUNUCU = readFileSync(new URL('../server/mediaServer.js', import.meta.url), 'utf8');

test('mediaServer: torrent önbellek tavanı tanımlı ve ortamla ayarlanabilir', () => {
  assert.ok(SUNUCU.includes('TORRENT_CACHE_TAVAN_BAYT'), 'boyut tavanı sabiti var');
  assert.ok(SUNUCU.includes('CINEPULSE_TORRENT_CACHE_MB'), 'tavan ortam değişkeniyle ayarlanabilir');
  assert.match(SUNUCU, /6\s*144|6144/, 'varsayılan tavan 6 GB');
  assert.ok(SUNUCU.includes('function torrentOnbelleginiSinirla'), 'sınırlama fonksiyonu var');
});

test('mediaServer: tahliye yalnız önbellek dizini içinde siler (güvenlik)', () => {
  const bas = SUNUCU.indexOf('function diziniSil');
  assert.ok(bas > -1);
  const govde = SUNUCU.slice(bas, bas + 700);
  assert.ok(govde.includes('TORRENT_CACHE_DIZIN'), 'kök dizin kontrolü yapılır');
  assert.ok(govde.includes('startsWith(kok'), 'kök dışına çıkan yol reddedilir');
  assert.ok(govde.includes('recursive: true'), 'parçalar birlikte silinir');
});

test('mediaServer: aktif izlenen akış tahliyeden korunur, histerezis %80', () => {
  const bas = SUNUCU.indexOf('function torrentOnbelleginiSinirla');
  assert.ok(bas > -1);
  const govde = SUNUCU.slice(bas, bas + 2600);
  assert.ok(govde.includes('enYeniHash'), 'en yeni erişilen akış korunur');
  assert.ok(govde.includes('TORRENT_AKTIF_MS'), 'son 5 dk içinde erişilen akış korunur');
  assert.ok(govde.includes('0.8'), 'hedef tavanın %80’i (histerezis)');
});

test('mediaServer: yeni torrent eklendiğinde ve periyodik temizlikte tavan uygulanır', () => {
  assert.ok(SUNUCU.includes('setTimeout(() => { try { torrentOnbelleginiSinirla(); }'), 'ekleme sonrası tetiklenir');
  const sweepBas = SUNUCU.indexOf('TORRENT_TIMEOUT_MS) {');
  assert.ok(sweepBas > -1);
  const sweep = SUNUCU.slice(sweepBas, sweepBas + 700);
  assert.ok(sweep.includes('diziniSil(yol)'), 'boşta kalan torrent parçaları da silinir');
  assert.ok(sweep.includes('torrentOnbelleginiSinirla()'), 'periyodik taramada tavan uygulanır');
});

test('mediaServer: /health önbellek boyutu ve tavanını raporlar', () => {
  const bas = SUNUCU.indexOf("if (reqUrl.pathname === '/health')");
  const govde = SUNUCU.slice(bas, bas + 600);
  assert.ok(govde.includes('torrentCacheBytes'), 'ölçülen boyut raporlanır');
  assert.ok(govde.includes('torrentCacheLimitBytes'), 'tavan raporlanır');
});

test('cacheReclaim planlayıcısı: aktif/korumalı girdi asla silinmez', () => {
  const plan = reclaimPlanla([
    { kimlik: 'aktif', bayt: 5_000, sonKullanim: 100, etkin: true },
    { kimlik: 'eski-1', bayt: 4_000, sonKullanim: 10 },
    { kimlik: 'eski-2', bayt: 3_000, sonKullanim: 20 },
  ], { hedefBayt: 1_000, simdi: 1000 });
  assert.ok(plan.korunan.some(g => g.kimlik === 'aktif'), 'aktif girdi korunur');
  assert.ok(!plan.silinecek.some(g => g.kimlik === 'aktif'), 'aktif girdi silinmez');
  assert.deepEqual(plan.silinecek.map(g => g.kimlik), ['eski-1', 'eski-2'], 'en eskiden yeniye tahliye');
});
