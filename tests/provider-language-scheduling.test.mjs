import test from 'node:test';
import assert from 'node:assert/strict';
import { resolveLanguageLanes } from '../src/services/providerRuntime/languages.js';
import { runProviderBatch } from '../src/services/providerRuntime/batch.js';

test('ready subtitles publish before a slow dubbed lane finishes', async () => {
  let finishDub, publishSub;
  const dubbed = new Promise(r => finishDub = r), subtitled = new Promise(r => publishSub = r);
  const events = [];
  const job = resolveLanguageLanes(({ isDub }) => isDub ? dubbed : Promise.resolve([{ id: 'sub', url: 'https://media.test/sub.m3u8' }]), {}, {
    provider: 'fixture', split: true, onSources: sources => { events.push(sources); if (sources[0].category === 'subtitled') publishSub(); }
  });
  await subtitled;
  assert.equal(events.length, 1);
  assert.equal(events[0][0].category, 'subtitled');
  finishDub([{ id: 'dub', url: 'https://media.test/dub.m3u8' }]);
  assert.equal((await job).length, 2);
});
test('a failed dubbed lane does not erase subtitles', async () => {
  const sources = await resolveLanguageLanes(({ isDub }) => isDub ? Promise.reject(new Error('blocked')) : Promise.resolve([{ url: 'https://media.test/sub.m3u8' }]), {}, { provider: 'fixture', split: true });
  assert.equal(sources.length, 1);
  assert.equal(sources[0].category, 'subtitled');
});
test('slow playback preparation does not block the next provider discovery', async () => {
  let finishPreparation, secondStarted;
  const preparation = new Promise(r => finishPreparation = r), started = new Promise(r => secondStarted = r);
  const providers = [
    { id: 'first', resolve: async args => { const s=[{ id:'one',url:'https://media.test/one.m3u8' }]; args.onSources(s); return s; } },
    { id: 'second', resolve: async () => { secondStarted(); return []; } }
  ];
  let publications = 0;
  const job = runProviderBatch(providers, {}, { concurrency: 1, onResult: async () => { publications++; await preparation; } });
  await started;
  assert.equal(publications, 1);
  finishPreparation();
  await job;
  assert.equal(publications, 1);
});
