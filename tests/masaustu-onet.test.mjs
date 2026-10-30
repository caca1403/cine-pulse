import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import path from 'node:path';

/* inject-desktop-hashes.mjs: release varlıklarının sha256'leri manifeste
   yazılmalı; istemci (electron/main.cjs) bu alanları zorunlu sayar. */
const tmp = '/tmp/opencode/masaustu-onet-test';
rmSync(tmp, { recursive: true, force: true });
mkdirSync(path.join(tmp, 'assets'), { recursive: true });

const exeIcerik = 'sahte-exe-' + 'x'.repeat(1000);
const debIcerik = 'sahte-deb-' + 'y'.repeat(500);
writeFileSync(path.join(tmp, 'assets', 'CinePulse-Setup.exe'), exeIcerik);
writeFileSync(path.join(tmp, 'assets', 'CinePulse.deb'), debIcerik);
const manifestYolu = path.join(tmp, 'desktop-version.json');
writeFileSync(manifestYolu, JSON.stringify({ version: '1.1.79', versionCode: 11179, windowsSetupUrl: 'https://x' }, null, 2) + '\n');

execFileSync(process.execPath, ['scripts/inject-desktop-hashes.mjs', path.join(tmp, 'assets'), manifestYolu]);

const manifest = JSON.parse(readFileSync(manifestYolu, 'utf8'));
const sha = (icerik) => createHash('sha256').update(icerik).digest('hex');
assert.equal(manifest.windowsSetupSha256, sha(exeIcerik));
assert.equal(manifest.linuxDebSha256, sha(debIcerik));
assert.equal(manifest.linuxFlatpakSha256, undefined); // varlık yok → alan yazılmaz
assert.equal(manifest.version, '1.1.79'); // mevcut alanlar bozulmaz

test('inject-desktop-hashes: özetler doğru yazılır, varlık olmayan alan dokunulmaz', () => {
  assert.ok(manifest.windowsSetupSha256.length === 64);
  assert.ok(manifest.linuxDebSha256.length === 64);
});
