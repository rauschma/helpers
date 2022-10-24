/**
 * Pitfall: can’t be used for abstract classes.
 * @see https://exploringjs.com/tackling-ts/ch_classes-as-values.html#pitfall-classt-does-not-match-abstract-classes
 */
export type Class<T> = new (...args: any[]) => T;
export function cast<T>(theClass: Class<T>, value: any): T {
  if (! (value instanceof theClass)) {
    throw new TypeError(`Expected class: ${theClass.name} Actual class: ${value.constructor.name}`);
  }
  return value;
}

export class AssertionError extends Error {}

/**
 * Useful whenever you don’t want to use Node’s built-in assert.ok().
 */
export function assertTrue(value: boolean, message=''): asserts value {
  if (!value) {
    throw new AssertionError(message);
  }
}

export function assertNonNullable<T>(value: T): asserts value is NonNullable<T> {
  if (value === undefined || value === null) {
    throw new TypeError('Value shouldn’t be undefined or null');
  }
}

export type SafeOmit<T, Keys extends keyof T> = Omit<T, Keys>;

/**
 * Example:
 * 
 * ```ts
 * const Color = {
 *   Red: 'Red',
 *   Green: 'Green',
 *   Blue: 'Blue',
 * } as const;
 * type Color = PropertyValues<typeof Color>;
 * ```
 */
export type PropertyValues<Obj> = Obj[keyof Obj];
