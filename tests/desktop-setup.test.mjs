import { test } from 'node:test';
import assert from 'node:assert/strict';
import { canUseDesktopSetup, needsDesktopSetup } from '../src/services/desktopSetupPolicy.js';

test('web and APK cannot open a local desktop installation wizard', () => {
  assert.equal(canUseDesktopSetup(undefined, undefined), false);
  assert.equal(canUseDesktopSetup({isDesktop:false}, undefined), false);
  assert.equal(canUseDesktopSetup({isDesktop:true}, {isNativePlatform:()=>true}), false);
  assert.equal(canUseDesktopSetup({isDesktop:true}, undefined), true);
});
test('only a confirmed missing desktop dependency requires setup', () => {
  assert.equal(needsDesktopSetup(undefined), false);
  assert.equal(needsDesktopSetup({python:{available:true},sidecar:{alive:true}}), false);
  assert.equal(needsDesktopSetup({python:{available:false},sidecar:{alive:true}}), true);
  assert.equal(needsDesktopSetup({python:{available:true},sidecar:{alive:false}}), true);
});
