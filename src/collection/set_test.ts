import { createSuite } from '@rauschma/helpers/testing/mocha.js';
import assert from 'node:assert/strict';
import { setDifference } from './set.js';

createSuite(import.meta.url);

test('setDifference', () => {
  assert.deepEqual(
    setDifference(new Set(['a', 'b']), new Set(['b'])),
    new Set(['a']),
  );
  assert.deepEqual(
    setDifference(new Set(['a', 'b']), new Set(['a', 'b'])),
    new Set(),
  );
  assert.deepEqual(
    setDifference(new Set(['a', 'b']), new Set(['c'])),
    new Set(['a', 'b']),
  );
  assert.deepEqual(
    setDifference(new Set(['a', 'b']), new Set()),
    new Set(['a', 'b']),
  );
  assert.deepEqual(
    setDifference(new Set(), new Set(['a', 'b'])),
    new Set(),
  );
  assert.deepEqual(
    setDifference(new Set(), new Set()),
    new Set(),
  );
});
