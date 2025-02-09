/**
 * Error class that supports exhaustiveness checks.
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
