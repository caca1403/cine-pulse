/* Profil PIN + yaş kademesi — parite #9. Sözleşme:
   - PIN bu cihazda yerel bir EŞİKtir, kriptografik koruma değildir.
   - crypto.subtle yoksa PIN pasif: uydurma hash ÜRETİLMEZ.
   - Eski profil nesnesinde pinHash/yasKademesi alanları YOKTUR; davranış
     bozulmaz (isKid → 'cocuk' yani bugünün kid-safe filtresi).
   - 3 hatalı denemeden sonra 30 sn kilit; sayaç depoya yazılmaz. */
import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  pinNormalize, pinGecerliMi, yasKademesiGecerliMi, varsayilanYasKademesi,
  pinHashla, pinAktifMi, pinKilitDurumu, PIN_HATA_ESIGI, PIN_KILIT_MS
} from '../src/services/altyapi/profil-pin.js';

// --- storage.js için sahte depo (veri-uyumluluk deseni) ---
const depo = new Map();
const saklama = {
  getItem: k => (depo.has(k) ? depo.get(k) : null),
  setItem: (k, v) => depo.set(k, String(v)),
  removeItem: k => depo.delete(k),
};
globalThis.window = { localStorage: saklama, dispatchEvent() {}, addEventListener() {} };
Object.defineProperty(globalThis, 'localStorage', { value: saklama, configurable: true });

// Eski sürüm şekli: pinHash/yasKademesi YOK.
depo.set('sineflix_profiles_list_v1', JSON.stringify([
  { id: 'prof_1', name: 'Profilim', avatar: 'user-circle', isKid: false, color: '#f59e0b' },
  { id: 'prof_eski_cocuk', name: 'Eski Çocuk', avatar: 'baby', isKid: true, color: '#38bdf8' },
  { id: 'prof_kademe', name: 'Kademe', avatar: 'smile', isKid: true, color: '#10b981' }
]));
depo.set('sineflix_active_profile_id', 'prof_1');

const s = await import('../src/services/altyapi/storage.js');

test('pinNormalize/pinGecerliMi: boşluklar atılır, yalnız 4-6 hane kabul edilir', () => {
  assert.equal(pinNormalize(' 1234 '), '1234');
  assert.equal(pinNormalize('12 34'), '1234');
  assert.equal(pinGecerliMi('1234'), true);
  assert.equal(pinGecerliMi(' 1234 '), true);
  assert.equal(pinGecerliMi('123'), false);
  assert.equal(pinGecerliMi('1234567'), false);
  assert.equal(pinGecerliMi('abcd'), false);
  assert.equal(pinGecerliMi(''), false);
  assert.equal(pinGecerliMi(null), false);
});

test('yasKademesi validasyonu + eski profil nesnesinde alan yoksa defaultlar', () => {
  assert.equal(yasKademesiGecerliMi('cocuk'), true);
  assert.equal(yasKademesiGecerliMi('genclik'), true);
  assert.equal(yasKademesiGecerliMi('yetiskin'), true);
  assert.equal(yasKademesiGecerliMi('korku'), false);
  assert.equal(varsayilanYasKademesi(true), 'cocuk');
  assert.equal(varsayilanYasKademesi(false), 'yetiskin');
  // geriye-uyum: eski nesneler
  assert.equal(s.getProfileYasKademesi({ id: 'x', isKid: true }), 'cocuk');
  assert.equal(s.getProfileYasKademesi({ id: 'x', isKid: false }), 'yetiskin');
  assert.equal(s.getProfileYasKademesi(undefined), 'yetiskin');
  assert.equal(s.getProfileYasKademesi({ isKid: true, yasKademesi: 'genclik' }), 'genclik');
  assert.equal(s.getProfileYasKademesi({ isKid: true, yasKademesi: 'bozuk' }), 'cocuk');
});

test('pinHashla: crypto.subtle gerçek async SHA-256; normalize eşitliği; yoksa null', async () => {
  assert.equal(pinAktifMi(), true, 'node>=20 crypto.subtle kullanılabilir olmalı');
  const h = await pinHashla('1234');
  assert.equal(h, '03ac674216f3e15c761ee1a5e255f067953623c8b388b4459e13f978d7c846f4');
  assert.equal(await pinHashla(' 1234 '), h, 'normalize edilmiş girdi aynı hash\'i verir');
  assert.equal(await pinHashla('1235') === h, false);
  assert.equal(await pinHashla('12'), null, 'geçersiz pin için hash üretilmez');
});

test('3 hatadan sonra 30 sn kilit — saf hesap; kilit bitince açılır', () => {
  const t = 1000000;
  assert.equal(PIN_HATA_ESIGI, 3);
  assert.equal(PIN_KILIT_MS, 30000);
  assert.deepEqual(pinKilitDurumu(2, t, t + 1000), { kilitli: false, kalanMs: 0 });
  assert.deepEqual(pinKilitDurumu(3, t, t + 1000), { kilitli: true, kalanMs: 29000 });
  assert.deepEqual(pinKilitDurumu(3, t, t + 15000), { kilitli: true, kalanMs: 15000 });
  assert.deepEqual(pinKilitDurumu(3, t, t + 30000), { kilitli: false, kalanMs: 0 });
  assert.deepEqual(pinKilitDurumu(3, 0, t), { kilitli: false, kalanMs: 0 }, 'kilit başlamadıysa kilit yok');
});

test('pinBelirle/profilAc round-trip; eşleşmeyen pin reddedilir', async () => {
  assert.equal(await s.pinBelirle('prof_1', '1234'), true);
  const ham = JSON.parse(depo.get('sineflix_profiles_list_v1'));
  const p = ham.find(x => x.id === 'prof_1');
  assert.match(p.pinHash, /^[0-9a-f]{64}$/, 'diskte SHA-256 hex saklanır');
  assert.equal(await s.profilAc('prof_1', '1234'), true);
  assert.equal(await s.profilAc('prof_1', '1234 '.trim() + ' '), true);
  assert.equal(await s.profilAc('prof_1', '9999'), false, 'eşleşmeyen pin reddedilir');
  assert.equal(await s.profilAc('prof_1', ''), false);
  assert.equal(s.profilPinDurumu('prof_1'), true);
});

test('geçersiz pin belirlenemez (4-6 hane şartı), mevcut pin değişmez', async () => {
  assert.equal(await s.pinBelirle('prof_1', '12'), false);
  assert.equal(await s.pinBelirle('prof_1', 'abcdef'), false);
  assert.equal(await s.profilAc('prof_1', '1234'), true, 'eski pin yerinde durur');
});

test('pinKaldir: PIN kaldırılan profil doğrudan açılır', async () => {
  assert.equal(s.pinKaldir('prof_1'), true);
  const ham = JSON.parse(depo.get('sineflix_profiles_list_v1'));
  assert.equal('pinHash' in ham.find(x => x.id === 'prof_1'), false);
  assert.equal(await s.profilAc('prof_1', '9999'), true);
  assert.equal(s.pinKaldir('prof_yok'), false);
});

test('eski profil nesnesinde pinHash yoksa doğrudan açılır (geriye uyum)', async () => {
  assert.equal(await s.profilAc('prof_eski_cocuk', '0000'), true);
  assert.equal(s.profilPinDurumu('prof_eski_cocuk'), false);
});

test('setProfileYasKademesi: geçersiz reddedilir, geçerli kalıcı; isKidProfileActive kademeyle sürer', () => {
  assert.equal(s.setProfileYasKademesi('prof_kademe', 'korku'), false);
  assert.equal(s.setProfileYasKademesi('prof_yok', 'cocuk'), false);
  assert.equal(s.setProfileYasKademesi('prof_kademe', 'genclik'), true);
  const ham = JSON.parse(depo.get('sineflix_profiles_list_v1'));
  assert.equal(ham.find(x => x.id === 'prof_kademe').yasKademesi, 'genclik');

  s.setActiveProfile('prof_kademe');
  assert.equal(s.isKidProfileActive(), false, "'genclik': bugünün normal (süzgecsiz) davranışı");
  assert.equal(s.setProfileYasKademesi('prof_kademe', 'cocuk'), true);
  assert.equal(s.isKidProfileActive(), true, "'cocuk': mevcut kid-safe süzgeci uygular");
  // eski çocuk profili: kademe alanı olmadan da bugünkü gibi süzülür
  s.setActiveProfile('prof_eski_cocuk');
  assert.equal(s.isKidProfileActive(), true, 'eski isKid=true profili süzgeçli kalır');
  s.setActiveProfile('prof_1');
  assert.equal(s.isKidProfileActive(), false, 'eski isKid=false profili süzgecsiz kalır');
});
