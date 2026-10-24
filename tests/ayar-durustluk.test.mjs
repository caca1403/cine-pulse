/* Sihirbaz ayarları — anahtar eşleme/normalizasyon saf yardımcıları.
   Kullanıcı olayı: "kurulum sihirbazı ayarları hiçbir şeyi değiştirmiyordu".
   Her sihirbaz anahtarı artık gerçek davranışa bağlandı; bu testler sabiti
   korur — sahte bağlantı (değer yazıp hiçbir şeyi değiştirmemek) geri gelmesin. */
import test from 'node:test';
import assert from 'node:assert/strict';

import {
  normalizeBufferMb,
  resumeEnabled,
  normalizePreferredCategory,
  pickDefaultSubIndex
} from '../src/services/altyapi/storage.js';

/* --- cp_buffer_size_mb → hls.js maxBufferSize (MB, bayta çarpar oynatıcı) --- */

test('buffer: sihirbaz değerleri doğrudan anlamlı MB taşır', () => {
  assert.equal(normalizeBufferMb('50'), 50);
  assert.equal(normalizeBufferMb('100'), 100);
  assert.equal(normalizeBufferMb('250'), 250);
});

test('buffer: ayar yok/bozuk → bugünkü davranış (300MB)', () => {
  assert.equal(normalizeBufferMb(null), 300);
  assert.equal(normalizeBufferMb(undefined), 300);
  assert.equal(normalizeBufferMb('abc'), 300);
  assert.equal(normalizeBufferMb(''), 300);
});

test('buffer: 8–512MB penceresine kırpılır (saniye hesabı YOK)', () => {
  assert.equal(normalizeBufferMb('1'), 8);
  assert.equal(normalizeBufferMb('6'), 8);
  assert.equal(normalizeBufferMb('4096'), 512);
});

/* --- cp_resume_playback → oynatıcı otomatik sarma --- */

test('resume: yalnız resmen false kapalı; bozuk/eksik değer açık', () => {
  assert.equal(resumeEnabled('false'), false);
  assert.equal(resumeEnabled('true'), true);
  assert.equal(resumeEnabled(null), true);
  assert.equal(resumeEnabled(undefined), true);
  assert.equal(resumeEnabled(''), true);
  assert.equal(resumeEnabled('False'), true); // hassas anahtar: resmen 'false'
});

/* --- cp_preferred_category → açılış kategorisi --- */

test('kategori: dublaj/altyazı geçerli, bilinmeyen → bugünkü (dublaj)', () => {
  assert.equal(normalizePreferredCategory('dubbed'), 'dubbed');
  assert.equal(normalizePreferredCategory('subtitled'), 'subtitled');
  assert.equal(normalizePreferredCategory(null), 'dubbed');
  assert.equal(normalizePreferredCategory('all'), 'dubbed');
  assert.equal(normalizePreferredCategory('SUBTITLED'), 'dubbed'); // hassas anahtar
});

/* --- cp_default_sub_lang → varsayılan altyazı izi --- */

const izler = [
  { label: 'OpenSubtitles (Türkçe)', src: '/api/subtitles?x=1' },
  { label: 'English', src: 'https://cdn.example/en.vtt' },
  { label: 'Türkçe (VidMoly)', src: 'https://cdn.example/tr.vtt' }
];

test('subLang: kayıtlı dil eşleşirse o iz seçilir (0. yerine)', () => {
  // tr seçili; ilk iz zaten Türkçe → bugünkü davranış aynen
  assert.equal(pickDefaultSubIndex('tr', izler, 'subtitled'), 0);
  // en seçili → 'English' izinin gerçek indeksi seçilir (körlükten değil)
  assert.equal(pickDefaultSubIndex('en', izler, 'subtitled'), 1);
});

test('subLang: eşleşme yoksa bugünkü davranış (subtitled→0)', () => {
  assert.equal(pickDefaultSubIndex('en', [{ label: 'Türkçe' }], 'subtitled'), 0);
});

test('subLang: off → altyazı açılmaz; dublaj kategorisi → -1', () => {
  assert.equal(pickDefaultSubIndex('off', izler, 'subtitled'), -1);
  assert.equal(pickDefaultSubIndex('tr', izler, 'dubbed'), -1);
  assert.equal(pickDefaultSubIndex('en', izler, 'dubbed'), -1);
});

test('subLang: ayar yok/bozuk → bugünkü davranış aynen', () => {
  assert.equal(pickDefaultSubIndex(null, izler, 'subtitled'), 0);
  assert.equal(pickDefaultSubIndex(undefined, izler, 'subtitled'), 0);
  assert.equal(pickDefaultSubIndex('ru', izler, 'subtitled'), 0);
});

test('subLang: Türkçe etiket varyantları tanınır (TR / tür / Türkçe)', () => {
  assert.equal(pickDefaultSubIndex('tr', [{ label: 'TR Altyazı' }, { label: 'English' }], 'subtitled'), 0);
  assert.equal(pickDefaultSubIndex('tr', [{ label: 'English' }, { label: 'Türkçe' }], 'subtitled'), 1);
  assert.equal(pickDefaultSubIndex('tr', [{ label: 'Xtra HD' }, { label: 'English' }], 'subtitled'), 0); // sahte pozitif: 'xtra' değil
});
