import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createPlayerScope } from '../src/components/playerLifecycle.js';

test('repeated playback replacement releases listeners and pending work', async () => {
  const target = new EventTarget();
  let calls = 0;
  for (let i = 0; i < 50; i++) {
    const scope = createPlayerScope();
    scope.on(target, 'seek', () => calls++);
    scope.setTimeout(() => calls++, 10);
    scope.setInterval(() => calls++, 10);
    target.dispatchEvent(new Event('seek'));
    scope.dispose();
    scope.dispose();
  }
  target.dispatchEvent(new Event('seek'));
  await new Promise(resolve => setTimeout(resolve, 30));
  assert.equal(calls, 50);
});

test('disposed scopes reject late work and canceled timers never fire', async () => {
  const scope = createPlayerScope();
  let calls = 0;
  scope.clearTimeout(scope.setTimeout(() => calls++, 5));
  scope.dispose();
  scope.setTimeout(() => calls++, 5);
  scope.setInterval(() => calls++, 5);
  await new Promise(resolve => setTimeout(resolve, 20));
  assert.equal(calls, 0);
});
