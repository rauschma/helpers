import { assertNonNullable, assertTrue } from '../ts/types.js';
import { ArrayQueue } from './lang.js';

/**
 * This class is a queue that works asynchronously:
 * - Enqueuing via `.enqueue()` is manual and synchronous (non-blocking) and can be done
 *   multiple times.
 *   - Rationale: Needed so that we can turn a callback-based (push) API into an
 *     asynchronous-iteration-based (pull) API.
 * - Dequeuing is done via async iteration, which invokes method `.next()`. This operation
 *   blocks asynchronously until data is enqueued.
 */
export class AsyncQueue<T> {
  #enqueuedValues = new ArrayQueue<T>();
  /** Non-null if there are no enqueued values */
  #pendingValue: null | Settler<IteratorResult<T>> = null;
  #closed = false;

  [Symbol.asyncIterator]() {
    return this;
  }

  /**
   * Enqueuing is done manually.
   * 
   * This method is non-blocking. It can be called as often as you want and will buffer if
   * more is enqeued than dequeued.
   */
  enqueue(value: T): this {
    if (this.#closed) {
      throw new Error('Closed');
    }
    if (this.#pendingValue) {
      assertTrue(this.#enqueuedValues.length > 0);
      this.#pendingValue.resolve({done: false, value});
      this.#pendingValue = null;
    } else {
      this.#enqueuedValues.enqueue(value);
    }
    return this;
  }

  /**
   * Dequeuing is done via async iteration.
   * 
   * This method is blocking. That is, it must not be called again before its result has
   * settled.
   */
  next(): Promise<IteratorResult<T>> {
    if (this.#pendingValue) {
      throw new Error('Promise of previous invocation has not settled yet');
    }
    if (this.#enqueuedValues.length > 0) {
      const value = this.#enqueuedValues.dequeue();
      assertNonNullable(value);
      return Promise.resolve({done: false, value});
    }
    // No more values enqueued: Can we expect more or are we done?
    if (this.#closed) {
      return Promise.resolve({done: true, value: undefined});
    }
    // Wait for new values to be enqueued
    const {promise, resolve, reject} = createPromise<IteratorResult<T>>();
    this.#pendingValue = {resolve, reject};
    return promise;
  }

  close(): this {
    if (this.#closed) return this;
    this.#closed = true;
    if (this.#pendingValue) {
      assertTrue(this.#enqueuedValues.length > 0);
      this.#pendingValue.resolve({done: true, value: undefined});
      this.#pendingValue = null;
    }
    return this;
  }
}

interface Settler<T> {
  resolve(result: T): void;
  reject(err: any): void;
}

function createPromise<T>() {
  let resolve!: (result: T) => void;
  let reject!: (error: any) => void;
  const promise = new Promise<T>(
    (res, rej) => {
      // Executed synchronously
      resolve = res;
      reject = rej;
    });
  return {promise, resolve, reject};
}
