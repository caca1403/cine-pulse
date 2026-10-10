import test from 'node:test';
import assert from 'node:assert/strict';
import { mergeManifests } from '../src/services/releaseManifests.js';

const local = {
  version: '1.1.55', versionCode: 165,
  apkUrl: 'https://github.com/x/releases/latest/download/cinepulse.apk',
  desktopVersion: '1.1.52', desktopVersionCode: 162,
  windowsUrl: 'https://github.com/x/releases/download/v1.1.52/setup.exe',
  debUrl: 'https://github.com/x/releases/download/v1.1.52/app.deb',
  appImageUrl: 'https://github.com/x/releases/download/v1.1.52/app.AppImage',
};

test('apk yukselince masaustu eski surumde kalir', () => {
  const r = mergeManifests(local,
    { version: '1.1.55', versionCode: 165, downloadUrl: 'https://cdn/ap.apk' },
    { version: '1.1.52', versionCode: 162, windowsSetupUrl: 'w', linuxDebUrl: 'd', linuxAppImageUrl: 'a' });
  assert.equal(r.apk.version, '1.1.55');
  assert.equal(r.apk.url, 'https://cdn/ap.apk');
  assert.equal(r.desktop.version, '1.1.52');
  assert.equal(r.desktop.deb, 'd');
});

test('ag yoksa derleme-anlik degerlere dusulur', () => {
  const r = mergeManifests(local, null, null);
  assert.equal(r.apk.version, '1.1.55');
  assert.equal(r.desktop.version, '1.1.52');
  assert.match(r.apk.url, /cinepulse\.apk/);
});
