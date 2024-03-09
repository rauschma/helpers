export class UnsupportedValueError extends Error {
  constructor(value: never, message = `Unsupported value: ${value}`) {
    super(message)
  }
}