import { assertNonNullable, assertTrue } from '../ts/types.js';
import { ArrayQueue } from './lang.js';
import { createPromiseWithSettlers, PromiseWithSettlers } from './promise.js';

/**
 * This class is a queue that works asynchronously:
 * - Enqueuing via `.enqueue()` is manual and synchronous (non-blocking)
 *   and can be done multiple times.
 *   - Rationale: Needed so that we can turn a callback-based (push) API
 *     into an asynchronous-iteration-based (pull) API.
 * - Dequeuing is done via async iteration, which invokes method `.next()`.
 *   This operation blocks asynchronously until data is enqueued.
 */
export class AsyncQueue<T> {
  #enqueuedValues = new ArrayQueue<T>();
  /**
   * If no values are enqueued and a value is dequeued, this Promise is
   * used to notify the dequeuer when a value is available. In other words:
   * If this field is non-null, there are no enqeued values.
   */
  #pendingValue: null | PromiseWithSettlers<IteratorResult<T>> = null;
  #closed = false;

  [Symbol.asyncIterator]() {
    return this;
  }

  /**
   * Enqueuing is done manually.
   *
   * This method is non-blocking. It can be called as often as you want and
   * will buffer if more is enqeued than dequeued.
   */
  enqueue(value: T): this {
    if (this.#closed) {
      throw new Error('Closed');
    }
    if (this.#pendingValue) {
      assertTrue(this.#enqueuedValues.length === 0);
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
   * This method is blocking. That is, it must not be called again before
   * its result has settled.
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
    // Wait for new enqueued values or closing
    const promiseWithSettlers = createPromiseWithSettlers<IteratorResult<T>>();
    this.#pendingValue = promiseWithSettlers;
    return promiseWithSettlers.promise;
  }

  close(): this {
    if (this.#closed) return this;
    this.#closed = true;
    if (this.#pendingValue) {
      assertTrue(this.#enqueuedValues.length === 0);
      this.#pendingValue.resolve({done: true, value: undefined});
      this.#pendingValue = null;
    }
    // If values are enqueued, we allow them to be read
    return this;
  }
}
