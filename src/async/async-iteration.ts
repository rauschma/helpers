/**
 * Returns an iterable with the first `limit` items of `iterable`.
 * 
 * ```ts
 * function* naturalNumbers() {
 *   for(let i=0;; i++) {
 *     yield i;
 *   }
 * }
 * assert.deepEqual(
 *   toArray(Iterable.take(3, naturalNumbers())),
 *   [0, 1, 2]
 * );
 * assert.deepEqual(
 *   toArray(Iterable.take(2, ['a', 'b', 'c'])),
 *   ['a', 'b']
 * );
 * ```
 */
 export async function* takeAsync<Item>(limit: number, iterable: AsyncIterable<Item>): AsyncIterable<Item> {
  let i=0;
  // Use `for-of` instead of `for` so that abrupt termination is handled correctly
  for await (const x of iterable) {
    if (i >= limit) break;
    yield x;
    i++;
  }
}

/**
 * @see https://github.com/tc39/proposal-array-from-async
 */
export async function arrayFromAsync<T>(asyncIterable: AsyncIterable<T>): Promise<Array<T>> {
  const result = new Array<T>();
  for await (const elem of asyncIterable) {
    result.push(elem);
  }
  return result;
}

export async function* arrayToAsyncIterable<T>(array: Array<T>): AsyncIterable<T> {
  yield* array;
}
