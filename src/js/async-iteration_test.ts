import assert from 'node:assert/strict';
import { arrayFromAsync, arrayToAsyncIterable as toAI, takeAsync } from './async-iteration.js';
import { createSuite } from './tests.js';

createSuite(import.meta.url);

async function* naturalNumbers() {
  for (let n=0;;n++) {
    yield n;
  }
}

test('Using takeAsync()', async () => {
  assert.deepEqual(
    await arrayFromAsync(takeAsync(3, naturalNumbers())),
    [0, 1, 2]
  );
  assert.deepEqual(
    await arrayFromAsync(takeAsync(2, toAI(['a', 'b', 'c']))),
    ['a', 'b']
  );
  assert.deepEqual(
    await arrayFromAsync(takeAsync(3, toAI([]))),
    []
  );
});
