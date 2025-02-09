/**
 * Error class that produces a compile-time error if cases for a value
 * weren’t covered exhaustively (e.g. via `switch`).
 * {@includeCode ./error_test.ts#UnexpectedValueError}
 */
export class UnexpectedValueError extends Error {
  constructor(
    // Type enables static checking
    value: never,
    // Apply String() to avoid exception for symbols
    message = `Unexpected value: ${String(value)}`
  ) {
    super(message)
  }
}

/**
 * @deprecated Use {@link UnexpectedValueError}
 */
export class UnsupportedValueError extends Error {
  constructor( value: never, message = `Unsupported value: ${String(value)}` ) {
    super(message)
  }
}
