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

/**
 * Useful whenever you don’t want to use Node’s built-in `assert()` or
 * `assert.ok()` – e.g. in browsers.
 */
export function assertTrue(value: boolean, message=''): asserts value {
  if (!value) {
    throw new TypeError(message);
  }
}

export function assertNonNullable<T>(value: T): asserts value is NonNullable<T> {
  if (value === undefined || value === null) {
    throw new TypeError('Value must not be undefined or null');
  }
}

export function nonNullableOrThrow<T>(value: T): NonNullable<T> {
  assertNonNullable(value);
  return value;
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

type TypeofLookupTable = {
  'undefined': undefined,
  'boolean': boolean,
  'number': number,
  'bigint': bigint,
  'string': string,
  'symbol': symbol,
  'object': null | object,
  'function': Function,
};
export type TypeofString = keyof TypeofLookupTable;
export type TypeofStringToType<S extends TypeofString> = TypeofLookupTable[S];