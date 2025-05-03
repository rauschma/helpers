/**
 * Error class that produces a compile-time error if cases for a value
 * weren’t covered exhaustively (e.g. via `switch`).
 * {@includeCode ./error_test.ts#UnexpectedValueError}
 */
export class UnexpectedValueError extends Error {
  constructor(
    // Type enables type checking
    value: never,
    // Avoid exception if `value` is:
    // - object without prototype
    // - symbol
    message = `Unexpected value: ${{}.toString.call(value)}`
  ) {
    super(message)
  }
}

/**
 * @deprecated Use {@link UnexpectedValueError}
 */
export {UnexpectedValueError as UnsupportedValueError}
