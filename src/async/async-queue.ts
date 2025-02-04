import { promiseWithResolvers } from './promise.js';

/**
 * This class is a queue that works asynchronously:
 * - Enqueuing via `.put()` is manual and synchronous (non-blocking) and
 *   can be done multiple times.
 *   - Rationale: Needed so that we can turn a callback-based (push) API
 *     into an asynchronous-iteration-based (pull) API.
 * - Dequeuing is done via async iteration, which invokes method `.next()`.
 *   This operation blocks asynchronously until data is enqueued.
 */
export class AsyncQueue<T> {
  // We dequeue here
  #frontPromise: null | Promise<QueueElement<T>>;
  // We enqueue here
  #backResolve: null | ((result: QueueElement<T>) => void);
  constructor() {
    const { promise, resolve } = promiseWithResolvers<QueueElement<T>>();
    this.#frontPromise = promise;
    this.#backResolve = resolve;
  }
  /**
   * Enqueuing. This method is non-blocking. It can be called as often as
   * you want and will buffer if more is enqeued than dequeued.
   */
  put(value: T): this {
    if (this.#backResolve === null) {
      // We can’t enqueue anymore
      throw new Error('Queue is closed');
    }
    const { resolve, promise } = promiseWithResolvers<QueueElement<T>>();
    this.#backResolve({ value, promise });
    this.#backResolve = resolve;
    return this;
  }
  close(): this {
    if (this.#backResolve === null) {
      // Queue is already closed
      return this;
    }
    this.#backResolve(
      { promise: null }
    );
    this.#backResolve = null;
    return this;
  }
  /**
   * Dequeuing is done via async iteration. This method blocks
   * asynchronously if the queue is empty.
   */
  next(): Promise<IteratorResult<T>> {
    if (this.#frontPromise === null) {
      // We already reached the last Promise below
      return Promise.resolve({ done: true, value: undefined });
    }
    return this.#frontPromise.then(
      (front): IteratorResult<T> => {
        this.#frontPromise = front.promise; // may be null
        if (front.promise === null) {
          return { done: true, value: undefined };
        }
        return { done: false, value: front.value };
      }
    );
  }
  [Symbol.asyncIterator](): this {
    return this;
  }
}

type QueueElement<T> =
  | {
    promise: Promise<QueueElement<T>>,
    value: T,
  }
  | {
    promise: null,
  }
  ;
