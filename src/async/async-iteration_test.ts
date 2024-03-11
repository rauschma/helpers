import { arrayFromAsync, takeAsync, arrayToAsyncIterable as toAI } from '@rauschma/helpers/async/async-iteration.js';
import { createSuite } from '@rauschma/helpers/testing/mocha.js';
import assert from 'node:assert/strict';

createSuite(import.meta.url);

async function* naturalNumbers() {
  for (let n = 0; ; n++) {
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
