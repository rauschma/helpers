import assert from 'node:assert/strict';
import { arrayFromAsync } from '../async/async-iteration.js';
import { chunksToLinesAsync, splitLinesExclEol, splitLinesInclEol, trimEol } from './line.js';

test('splitLinesInclEol', () => {
  assert.deepEqual(
    splitLinesInclEol('\n\nthere\nare\r\nmultiple\nlines'),
    ['\n', '\n', 'there\n', 'are\r\n', 'multiple\n', 'lines']
  );
});

test('splitLinesExclEol', () => {
  assert.deepEqual(
    splitLinesExclEol('\n\nthere\nare\r\nmultiple\nlines'),
    ['', '', 'there', 'are', 'multiple', 'lines']
  );
});

test('trimEol', () => {
  assert.equal(
    trimEol('Unix EOL\n'),
    'Unix EOL'
  );
  assert.equal(
    trimEol('Windows EOL\r\n'),
    'Windows EOL'
  );
  assert.equal(
    trimEol('No EOL'),
    'No EOL'
  );
  assert.equal(
    trimEol(''),
    ''
  );
});

test('chunksToLinesAsync()', async () => {
  async function* createChunks() {
    yield 'line A\nline B\n';
  }
  const asyncIterable = createChunks();
  const arr = await arrayFromAsync(chunksToLinesAsync(asyncIterable));
  assert.deepStrictEqual(arr, [
    'line A\n',
    'line B\n',
  ]);
});
