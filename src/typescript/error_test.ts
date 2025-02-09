import { createSuite } from '@rauschma/helpers/testing/mocha.js';
import { UnexpectedValueError } from '@rauschma/helpers/typescript/error.js';

createSuite(import.meta.url);

test('UnexpectedValueError: all cases are there', () => {
  enum Color { Red, Green }
  function colorToString(color: Color) {
    switch (color) {
      case Color.Red:
        return 'RED';
      case Color.Green:
        return 'GREEN';
      default:
        throw new UnexpectedValueError(color);
    }
  }
});

test('UnexpectedValueError: a case is missing', () => {
  //#region UnexpectedValueError
  enum Color { Red, Green }
  function colorToString(color: Color) {
    switch (color) {
      case Color.Red:
        return 'RED';
      default:
        // @ts-expect-error: Argument of type 'Color.Green' is not
        // assignable to parameter of type 'never'.
        throw new UnexpectedValueError(color);
    }
  }
  //#endregion UnexpectedValueError
});
