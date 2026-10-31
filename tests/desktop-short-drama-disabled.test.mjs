import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = path.dirname(path.dirname(fileURLToPath(import.meta.url)));

test('Desktop short-drama playback is visibly locked while details remain accessible', () => {
  const dramaView = fs.readFileSync(path.join(repoRoot, 'src/views/DramaView.js'), 'utf8');
  assert.ok(dramaView.includes('const desktopPlaybackUnavailable = isDesktopApp();'));
  assert.ok(dramaView.includes('Masaüstünde kısa dizi oynatma kullanılamıyor.'));
  assert.match(dramaView, /kd-desktop-playback-notice" role="alert"/);
  assert.match(dramaView, /data-card-action="watch" \$\{desktopPlaybackUnavailable \? 'disabled' : ''\}/);
  assert.match(dramaView, /class="kd-detail-episode"[^`]*\$\{desktopPlaybackUnavailable \? 'disabled aria-label=/);
  const detailAction = dramaView.match(/<button class="kd-card-action kd-card-action-detail"[\s\S]*?<\/button>/)?.[0];
  assert.ok(detailAction);
  assert.ok(!detailAction.includes('desktopPlaybackUnavailable'));

  const pkg = JSON.parse(fs.readFileSync(path.join(repoRoot, 'package.json'), 'utf8'));
  const version = JSON.parse(fs.readFileSync(path.join(repoRoot, 'public/version.json'), 'utf8'));
  const desktopVersion = JSON.parse(fs.readFileSync(path.join(repoRoot, 'public/desktop-version.json'), 'utf8'));
  assert.equal(pkg.version, '2.0.3');
  assert.equal(pkg.versionCode, 203);
  assert.equal(version.version, pkg.version);
  assert.equal(version.versionCode, pkg.versionCode);
  assert.equal(desktopVersion.version, pkg.version);
  assert.equal(desktopVersion.versionCode, pkg.versionCode);
});
