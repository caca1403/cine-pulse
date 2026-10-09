import test from 'node:test';
import assert from 'node:assert/strict';
import { collectWithin } from '../src/services/startupBudget.js';

test('a stalled catalog request does not hide already loaded content', async () => {
  const result = await collectWithin([
    Promise.resolve([{ id: 1 }]),
    new Promise(() => {}),
    Promise.reject(new Error('offline'))
  ], 20);
  assert.deepEqual(result, [[{ id: 1 }], [], []]);
});

test('late responses cannot mutate the rendered snapshot', async () => {
  let complete;
  const result = await collectWithin([new Promise(resolve => { complete = resolve; })], 10);
  complete([{ id: 2 }]);
  await new Promise(resolve => setImmediate(resolve));
  assert.deepEqual(result, [[]]);
});

test('healthy and empty requests finish without waiting for the deadline', async () => {
  assert.deepEqual(await collectWithin([Promise.resolve([1]), Promise.resolve([2])], 1000), [[1], [2]]);
  assert.deepEqual(await collectWithin([], 1000), []);
});
