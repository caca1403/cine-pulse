/* ==========================================================================
   nextEpisodePolicy.js — Saf Karar Modülü Birim Testleri
   --------------------------------------------------------------------------
   Çalıştır: node --test tests/next-episode-policy.test.mjs
   DOM/Fetch yok: tüm girdiler fixture/objedir.
   ========================================================================== */
import test from 'node:test';
import assert from 'node:assert/strict';
import { evaluateNextEpisode, POLICY_TABLE } from '../src/services/icerik/nextEpisodePolicy.js';

// ----------------------------------------------------------------
// 1. Policy carrier functions
// ----------------------------------------------------------------

test('1a) autoplayNext=false → gec: "kapat"', () => {
  const result = evaluateNextEpisode({
    autoplayNext: false,
    kalanSn: 5,
    sezonMu: true,
    finalBolumMu: false,
    kullaniciEtkilestimi: false,
  });
  assert.equal(result.gec, 'kapat');
  assert.equal(result.gerekce, 'AutoplayNext ayarı kapalı, sonraki bölüm otomatik geçilmiyor.');
});

test('1b) finalBolumMu=true → gec: "beklet"', () => {
  const result = evaluateNextEpisode({
    autoplayNext: true,
    kalanSn: 10,
    sezonMu: true,
    finalBolumMu: true,
    kullaniciEtkilestimi: false,
  });
  assert.equal(result.gec, 'beklet');
});

test('1c) kalanSn<3 → gec: "otomatik"', () => {
  const result = evaluateNextEpisode({
    autoplayNext: true,
    kalanSn: 2,
    SezonMu: true,
    finalBolumMu: false,
    kullaniciEtkilestimi: false,
  });
  assert.equal(result.gec, 'otomatik');
});

test('1d) kalanSn=3 → default otomatik (3 sn sınırı dahil değil)', () => {
  const result = evaluateNextEpisode({
    autoplayNext: true,
    kalanSn: 3,
    SezonMu: true,
    finalBolumMu: false,
    kullaniciEtkilestimi: false,
  });
  // 3 sn'lik sınır "kantan < 3" olduğu için kalanSn=3 otomatik degil, default'a düşer
  assert.equal(result.gec, 'otomatik');
});

test('1e) kullaniciEtkilestimi=true → gec: "beklet"', () => {
  const result = evaluateNextEpisode({
    autoplayNext: true,
    kalanSn: 10,
    SezonMu: true,
    finalBolumMu: false,
    kullaniciEtkilestimi: true,
  });
  assert.equal(result.gec, 'beklet');
});

// ----------------------------------------------------------------
// 2. Priorite sırasının doğru çalıştığı (higher-priority override)
// ----------------------------------------------------------------

test('2a) autoplayNext=false finalBolumMu=true override edilmemiş (kapat preval)', () => {
  const result = evaluateNextEpisode({
    autoplayNext: false,
    kalanSn: 1,       // extremely short
    SezonMu: true,
    finalBolumMu: true,
    kullaniciEtkilestimi: true,
  });
  // Kurulayla autoplayNext=false → 'kapat' (first rule)
  assert.equal(result.gec, 'kapat');
});

test('2b) autoplayNext=true finalBolumMu=true → "beklet" (son bölüm preval)', () => {
  const result = evaluateNextEpisode({
    autoplayNext: true,
    kalanSn: 1,
    SezonMu: true,
    finalBolumMu: true,
    kullaniciEtkilestimi: true,
  });
  assert.equal(result.gec, 'beklet');
});

// ----------------------------------------------------------------
// 3. Bozuk/eksişik girdiler toleransı (undefined/missing keys)
// ----------------------------------------------------------------

test('3a) eksik keys → varsayılan değerler kullanılır (default otomatik)', () => {
  // Tüm opsiyonel key'ler eksik — policy içeri default değerlerle çalışmalı
  const result = evaluateNextEpisode({});
  assert.equal(result.gec, 'otomatik');
});

test('3b) undefined values → varsayılan değerler kullanılır', () => {
  const result = evaluateNextEpisode({
    autoplayNext: undefined,
    kalanSn: undefined,
    SezonMu: undefined,
    finalBolumMu: undefined,
    kullaniciEtkilestimi: undefined,
  });
  assert.equal(result.gec, 'otomatik');
});

// ----------------------------------------------------------------
// 4. Policy TABLE'ı concordance (tablonun çıktısı tutarlı)
// ----------------------------------------------------------------

test('4a) POLICY_TABLE.kapat örnekı gec "kapat" döndürür', () => {
  const kapat = evaluateNextEpisode(POLICY_TABLE.kapat.örnek);
  assert.equal(kapat.gec, 'kapat');
});

test('4b) POLICY_TABLE.beklet örnek_final gec "beklet" döndürür', () => {
  const beklet = evaluateNextEpisode(POLICY_TABLE.beklet.örnek_final);
  assert.equal(beklet.gec, 'beklet');
});

test('4c) POLICY_TABLE.beklet örnek_kullanici gec "beklet" döndürür', () => {
  const beklet = evaluateNextEpisode(POLICY_TABLE.beklet.örnek_kullanici);
  assert.equal(beklet.gec, 'beklet');
});

test('4d) POLICY_TABLE.otomatik örnek_short gec "otomatik" döndürür', () => {
  const otomatik = evaluateNextEpisode(POLICY_TABLE.otomatik.örnek_short);
  assert.equal(otomatik.gec, 'otomatik');
});

test('4e) POLICY_TABLE.otomatik örnek_default gec "otomatik" döndürür', () => {
  const otomatik = evaluateNextEpisode(POLICY_TABLE.otomatik.örnek_default);
  assert.equal(otomatik.gec, 'otomatik');
});

// ----------------------------------------------------------------
// 5. Gerekçe Türkçe, olumsuzluk tuzağına düşmez
// ----------------------------------------------------------------

test('5a) gerekçe always string türünde', () => {
  const result = evaluateNextEpisode({
    autoplayNext: false,
    kalanSn: 5,
    SezonMu: true,
    finalBolumMu: false,
    kullaniciEtkilestimi: false,
  });
  assert.equal(typeof result.gerekce, 'string');
  assert(result.gerekce.length > 0, 'gerekçe boş olmamalı');
});

test('5b) gerekçe içersinde "ölü"|"bozuk"|"düşük"|"yavaş" geçmemeli', () => {
  const yasakli = /ölü|bozuk|düşük|yavaş/i;
  const result = evaluateNextEpisode({
    autoplayNext: true,
    kalanSn: 2,
    SezonMu: true,
    finalBolumMu: false,
    kullaniciEtkilestimi: false,
  });
  assert(!yasakli.test(result.gerekce), `gerekce "${result.gerekce}" yasaklı ifadeleri içermemalı`);
});

// ----------------------------------------------------------------
// 6. Tüm kural combinations -> output shape validation
// ----------------------------------------------------------------

test('6a) output always has {gec, gerekce}', () => {
  const result = evaluateNextEpisode({
    autoplayNext: false,
    kalanSn: 5,
    SezonMu: true,
    finalBolumMu: true,
    kullaniciEtkilestimi: true,
  });
  assert('gec' in result, 'output.gec present');
  assert('gerekce' in result, 'output.gerekce present');
  assert.equal(typeof result.gec, 'string');
  assert.equal(typeof result.gerekce, 'string');
  assert([ 'kapat', 'beklet', 'otomatik' ].includes(result.gec), `gec "${result.gec}" valid olmalı`);
});

/* ---
TEST ÇIKIS BEKLENİMİ:
- node --test tests/next-episode-policy.test.mjs → TUM testler YESLİ (green)
- Mevcut testler (player-lifecycle, flow-pilot) bozulmamalı
- ./node_modules/.bin/vite build temiz
- node --check tüm değişen dosyalara → rapor hatası yok
--- */