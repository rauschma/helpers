//#################### Class ####################

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

//#################### PotentiallyAbstractClass ####################

/**
 * Avoid this class. If you can, use {@link Class}.
 * @see https://exploringjs.com/tackling-ts/ch_classes-as-values.html#pitfall-classt-does-not-match-abstract-classes
 */
export type PotentiallyAbstractClass<T> = Function & {prototype: T};

export function potentiallyAbstractCast<T>(theClass: PotentiallyAbstractClass<T>, value: any): T {
  // Downside of `PotentiallyAbstractClass`: `instanceof` does not narrow types.
  // That’s why we have to use a custom function here
  if (! isInstanceOf(value, theClass)) {
    throw new TypeError(`Expected class: ${theClass.name} Actual class: ${value.constructor.name}`);
  }
  return value;
}

export function isInstanceOf<T>(value: unknown, theClass: PotentiallyAbstractClass<T>): value is T {
  return theClass.prototype.isPrototypeOf(value);
}

//#################### Assertion functions ####################

/**
 * Useful whenever you don’t want to use Node’s built-in `assert()` or
 * `assert.ok()` – e.g. in browsers.
 */
export function assertTrue(value: boolean, message='Assertion failed'): asserts value {
  if (!value) {
    throw new TypeError(message);
  }
}

export function assertNonNullable<T>(value: T, message?: string): asserts value is NonNullable<T> {
  if (value === undefined || value === null) {
    message ??= 'Value must not be undefined or null';
    throw new TypeError('Failed: ' + message);
  }
}

export function toNonNullableOrThrow<T>(value: T, message?: string): NonNullable<T> {
  if (value === undefined || value === null) {
    message ??= 'Value must not be undefined or null';
    throw new TypeError('Failed: ' + message);
  }
  return value;
}

//#################### Type guards ####################

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
export type TypeofResult = keyof TypeofLookupTable;
export type TypeofStringToType<S extends TypeofResult> = TypeofLookupTable[S];

export function isArrayOfPrimitives<T extends TypeofResult>(typeofString: T, value: unknown): value is Array<TypeofStringToType<T>> {
  if (!Array.isArray(value)) {
    return false;
  }
  return value.every(x => typeof x === typeofString);
}

export function isArrayOfInstances<T>(instanceClass: PotentiallyAbstractClass<T>, value: unknown): value is Array<T> {
  if (!Array.isArray(value)) {
    return false;
  }
  return value.every(x => isInstanceOf(x, instanceClass));
}

//#################### Miscellaneous ####################

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

//========== PublicDataProperties ==========

/**
 * @see https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#distributive-conditional-types
 */
export type PublicDataProperties<T> = Pick<T, PublicDataPropertyKeys<T>>;

export type PublicDataPropertyKeys<TObj> = {
  [K in keyof TObj]: TObj[K] extends Function ? never : K;
}[keyof TObj];
