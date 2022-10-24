import assert from 'node:assert/strict';
import { arrayFromAsync } from './async-iteration.js';
import { AsyncQueue } from './async-queue.js';
import { createSuite } from './test.js';

createSuite(import.meta.url);

test('Enqueue before dequeue', async () => {
  const queue = new AsyncQueue<string>();
  queue.enqueue('a');
  queue.enqueue('b');
  queue.close();
  assert.deepStrictEqual(
    await arrayFromAsync(queue), ['a', 'b']
  );
});
test('Dequeue before enqueue', async () => {
  const queue = new AsyncQueue<string>();
  setTimeout(
    () => {
      queue.enqueue('a');
      queue.enqueue('b');
      queue.close();
    },
    0
  );
  assert.deepStrictEqual(
    // Blocks until there is data in the queue
    await arrayFromAsync(queue), ['a', 'b']
  );
});
