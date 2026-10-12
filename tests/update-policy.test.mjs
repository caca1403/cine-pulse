import test from 'node:test';
import assert from 'node:assert/strict';
import { shouldOfferUpdate } from '../src/services/updatePolicy.js';

test('installed APK 175 must not offer its own manifest when JS bundle says 171', () => {
  assert.equal(shouldOfferUpdate({ version: '1.1.65', versionCode: 175 }, { version: '1.1.65', versionCode: 175 }), false);
});
test('versionCode is authoritative for upgrades and rollbacks', () => {
  assert.equal(shouldOfferUpdate({ version: '1.1.66', versionCode: 174 }, { version: '1.1.65', versionCode: 175 }), false);
  // Aynı sürüm dizesinde kod farkı uyarı DEMEZ (Kural 1): "1.1.65'e güncelle"
  // uyarısı, 1.1.65 kuruluyken gelmemelidir.
  assert.equal(shouldOfferUpdate({ version: '1.1.65', versionCode: 176 }, { version: '1.1.65', versionCode: 175 }), false);
  assert.equal(shouldOfferUpdate({ version: '1.1.66', versionCode: 176 }, { version: '1.1.65', versionCode: 175 }), true);
});
test('only valid semantic versions are a fallback without build codes', () => {
  assert.equal(shouldOfferUpdate({ version: 'v1.2.0' }, { version: '1.1.65' }), true);
  assert.equal(shouldOfferUpdate({ version: 'invalid' }, { version: '1.1.65' }), false);
});

test('AYNI sürüm dizesi asla uyarı vermez — kodlar ne derse desin', () => {
  // Uydurulmuş uzak kod (1.1.64 -> 1064000 vakası)
  assert.equal(shouldOfferUpdate({ version: '1.1.65', versionCode: 1064000 }, { version: '1.1.65', versionCode: 175 }), false);
  // Kurulu tarafta eski paket bilgisi kalmış (171/175 çelişkisi)
  assert.equal(shouldOfferUpdate({ version: '1.1.65', versionCode: 175 }, { version: '1.1.65', versionCode: 171 }), false);
  // Uzak kod eksik/sıfır, sürüm aynı
  assert.equal(shouldOfferUpdate({ version: '1.1.65', versionCode: 0 }, { version: '1.1.65', versionCode: 175 }), false);
  assert.equal(shouldOfferUpdate({ version: '1.1.65' }, { version: '1.1.65', versionCode: 175 }), false);
});
test('farklı sürümde kodlar çalışır', () => {
  assert.equal(shouldOfferUpdate({ version: '1.1.66', versionCode: 176 }, { version: '1.1.65', versionCode: 175 }), true);
  assert.equal(shouldOfferUpdate({ version: '1.1.64', versionCode: 999 }, { version: '1.1.65', versionCode: 175 }), true);
});
