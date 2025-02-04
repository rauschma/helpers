import { arrayFromAsync } from '@rauschma/helpers/async/async-iteration.js';
import { AsyncQueue } from '@rauschma/helpers/async/async-queue.js';
import { createSuite } from '@rauschma/helpers/testing/mocha.js';
import assert from 'node:assert/strict';

createSuite(import.meta.url);

test('Enqueue before dequeue', async () => {
  const queue = new AsyncQueue<string>();
  queue.put('a');
  queue.put('b');
  queue.close();
  assert.deepStrictEqual(
    await arrayFromAsync(queue), ['a', 'b']
  );
});
test('Dequeue before enqueue', async () => {
  const queue = new AsyncQueue<string>();
  setTimeout(
    () => {
      queue.put('a');
      queue.put('b');
      queue.close();
    },
    0
  );
  assert.deepStrictEqual(
    // Blocks until there is data in the queue
    await arrayFromAsync(queue), ['a', 'b']
  );
});
