import { createSuite } from '@rauschma/helpers/js/mocha.js';
import assert from 'node:assert/strict';
import { arrayToChunks, shuffleArray } from './array.js';

createSuite(import.meta.url);

test('shuffleArray', async () => {
  const arr = ['A', 'B', 'C', 'D'];
  // Repeat 5 times
  for (let i = 1; i <= 5; i++) {
    shuffleArray(arr);
    assert.equal(new Set(arr).size, arr.length);
  }
});

test('arrayToChunks', async () => {
  const arr = ['a', 'b', 'c', 'd'];
  assert.deepEqual(
    arrayToChunks(arr, 1),
    [['a'], ['b'], ['c'], ['d']],
  );
  assert.deepEqual(
    arrayToChunks(arr, 2),
    [['a', 'b'], ['c', 'd']],
  );
  assert.deepEqual(
    arrayToChunks(arr, 3),
    [['a', 'b', 'c'], ['d']],
  );
  assert.deepEqual(
    arrayToChunks(arr, 4),
    [['a', 'b', 'c', 'd']],
  );
  assert.deepEqual(
    arrayToChunks(arr, 5),
    [['a', 'b', 'c', 'd']],
  );
});
