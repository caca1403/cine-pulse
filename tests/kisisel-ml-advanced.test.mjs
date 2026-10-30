import test from 'node:test';
import assert from 'node:assert/strict';

import { kodla, OZELLIK_ADLARI } from '../src/services/kisisel/ml/ozellikler.js';
import { neuralEgit, neuralFromJSON, neuralSkorla } from '../src/services/kisisel/ml/neuralRanker.js';
import {
  sequenceCnnEgit,
  sequenceCnnFromJSON,
  sequenceCnnPuanla
} from '../src/services/kisisel/ml/sequenceCnn.js';

test('MLP trains deterministically on observed labels and improves ranking', () => {
  const examples = [
    ...Array.from({ length: 60 }, () => ({ x: [1, 0, 0], y: 1 })),
    ...Array.from({ length: 12 }, () => ({ x: [0, 1, 0], y: 0 }))
  ];
  const model = neuralEgit(examples, { epoch: 100, tohum: 81 });
  const repeated = neuralEgit(examples, { epoch: 100, tohum: 81 });

  assert.ok(model);
  assert.deepEqual(model, repeated);
  assert.ok(neuralSkorla(model, [1, 0, 0]) > neuralSkorla(model, [0, 1, 0]));
  assert.equal(neuralEgit(examples.slice(0, 20)), null, 'insufficient observations do not produce a trained model');
  assert.equal(neuralEgit(examples.map((example) => ({ ...example, y: 1 }))), null, 'both classes are required');

  const restored = neuralFromJSON(JSON.parse(JSON.stringify(model)), 3);
  assert.ok(restored);
  assert.equal(neuralSkorla(restored, [1, 0, 0]), neuralSkorla(model, [1, 0, 0]));
  assert.equal(neuralFromJSON({ ...model, girdiSayisi: 5 }, 3), null);
});

test('sequence CNN learns a finite next-genre signal and validates its saved shape', () => {
  const history = Array.from({ length: 18 }, (_, index) => ({
    id: index + 1,
    type: 'tv',
    genre_ids: [index % 2 === 0 ? 18 : 53],
    lastWatchedAt: index + 1
  }));
  const model = sequenceCnnEgit(history, { epoch: 50, tohum: 12 });
  assert.ok(model);

  const score = sequenceCnnPuanla(model, { id: 100, genre_ids: [18] }, history);
  assert.ok(Number.isFinite(score) && score >= 0 && score <= 1);
  assert.equal(sequenceCnnEgit(history.slice(0, 5)), null, 'short histories do not produce a model');

  const restored = sequenceCnnFromJSON(JSON.parse(JSON.stringify(model)));
  assert.ok(restored);
  assert.equal(
    sequenceCnnPuanla(restored, { id: 100, genre_ids: [18] }, history),
    score
  );
  assert.equal(sequenceCnnFromJSON({ ...model, conv: [] }), null);
});

test('completed and favorite recommendation surfaces have distinct feature columns', () => {
  const title = { id: 32, genre_ids: [18], type: 'movie' };
  const completed = kodla(title, { kaynak: 'tamamlanan' });
  const favorite = kodla(title, { kaynak: 'favoriler' });
  assert.equal(completed.length, OZELLIK_ADLARI.length);
  assert.equal(completed[OZELLIK_ADLARI.indexOf('kaynak_tamamlanan')], 1);
  assert.equal(completed[OZELLIK_ADLARI.indexOf('kaynak_favoriler')], 0);
  assert.equal(favorite[OZELLIK_ADLARI.indexOf('kaynak_favoriler')], 1);
  assert.equal(favorite[OZELLIK_ADLARI.indexOf('kaynak_tamamlanan')], 0);
});
