import { arrayFromAsync } from '@rauschma/helpers/async/async-iteration.js';
import { chunksToLinesAsync, splitLinesExclEol, splitLinesInclEol, trimEol } from '@rauschma/helpers/string/line.js';
import assert from 'node:assert/strict';

test('splitLinesInclEol', () => {
  assert.deepEqual(
    splitLinesInclEol(''),
    ['']
  );
  assert.deepEqual(
    splitLinesInclEol('abc'),
    ['abc']
  );

  // One line break at the beginning
  assert.deepEqual(
    splitLinesInclEol('\nabc'),
    ['\n', 'abc']
  );
  assert.deepEqual(
    splitLinesInclEol('\r\nabc'),
    ['\r\n', 'abc']
  );

  // One line break at the end
  assert.deepEqual(
    splitLinesInclEol('abc\n'),
    ['abc\n']
  );
  assert.deepEqual(
    splitLinesInclEol('abc\r\n'),
    ['abc\r\n']
  );

  // One line break in the middle
  assert.deepEqual(
    splitLinesInclEol('abc\ndef'),
    ['abc\n', 'def']
  );
  assert.deepEqual(
    splitLinesInclEol('abc\r\ndef'),
    ['abc\r\n', 'def']
  );

  // Two line breaks
  assert.deepEqual(
    splitLinesInclEol('\r\na\nb'),
    ['\r\n', 'a\n', 'b']
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
