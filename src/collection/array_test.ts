import { arrayToChunks, shuffleArray } from '@rauschma/helpers/collection/array.js';
import { createSuite } from '@rauschma/helpers/testing/mocha.js';
import assert from 'node:assert/strict';

createSuite(import.meta.url);

test('shuffleArray', () => {
  const arr = ['A', 'B', 'C', 'D'];
  // Repeat 5 times
  for (let i = 1; i <= 5; i++) {
    shuffleArray(arr);
    assert.equal(new Set(arr).size, arr.length);
  }
});

test('arrayToChunks', () => {

  //#region arrayToChunks
  const arr = ['a', 'b', 'c', 'd'];
  assert.deepEqual(
    arrayToChunks(arr, 1),
    [['a'], ['b'], ['c'], ['d']],
  );
  assert.deepEqual(
    arrayToChunks(arr, 2),
    [['a', 'b'], ['c', 'd']],
  );
  //#endregion arrayToChunks

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
