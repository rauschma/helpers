export interface PromiseWithResolvers<T> {
  promise: Promise<T>;
  resolve: (result: T) => void;
  reject: (error: any) => void;
}

export function promiseWithResolvers<T>(): PromiseWithResolvers<T> {
  let resolve!: (result: T) => void;
  let reject!: (error: any) => void;
  const promise = new Promise<T>(
    (res, rej) => {
      // Executed synchronously!
      resolve = res;
      reject = rej;
    });
  return {promise, resolve, reject};
}

/**
 * Use case: https://streams.spec.whatwg.org/#example-manual-write-batch
 * ```js
 * ignoreRejections(
 *   writer.write('Chunk 1'),
 *   writer.write('Chunk 2'),
 * );
 * await writer.close(); // reports errors
 * ```
 */
export function ignoreRejections(...promises: Array<Promise<unknown>>): void {
  for (const promise of promises) {
    promise.catch(() => { });
  }
}
