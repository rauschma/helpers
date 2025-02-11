//#################### Class ####################

/**
 * Utility type for writing types for classes more concisely.
 * {@includeCode ./type_test.ts#Class}
 *
 * If the class has to be instantiable, you must use
 * {@link InstantiableClass}.
 */
export type Class<T> = abstract new (...args: Array<any>) => T;

/**
 * Casting works for instantiable classes and abstract classes. That’s why
 * we use {@link Class}.
 */
export function cast<T>(theClass: Class<T>, value: any): T {
  if (! (value instanceof theClass)) {
    throw new TypeError(`Expected class: ${theClass.name} Actual class: ${value.constructor.name}`);
  }
  return value;
}

/**
 * Utility type for writing types for classes more concisely.
 * {@includeCode ./type_test.ts#InstantiableClass}
 *
 * If the class may be abstract, you must use {@link Class}.
 */
export type InstantiableClass<T> = new (...args: Array<any>) => T;

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

export function isArrayOfInstances<T>(instanceClass: Class<T>, value: unknown): value is Array<T> {
  if (!Array.isArray(value)) {
    return false;
  }
  return value.every(x => x instanceof instanceClass);
}

//#################### Miscellaneous ####################

/**
 * Checks at compile time that the `Keys` to omit from `T` actually exist –
 * which prevents typos.
 * 
 * @see [Related GitHub issue](https://github.com/microsoft/TypeScript/issues/30825)
 */
export type SafeOmit<T, Keys extends keyof T> = Omit<T, Keys>;
// TODO: better name

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
