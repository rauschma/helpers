import { assertTrue } from '../typescript/type.js';

/**
 * Assembles the arguments of template tag function in the same manner as a
 * template literal does – think “cooked” version of `String.raw`. Alas,
 * this functionality is not exposed by JavaScript’s standard library.
 */
export function stringCooked(templateStrings: TemplateStringsArray, ...substitutions: unknown[]): string {
  // There is always at least one element
  assertTrue(0 in templateStrings);
  let result = templateStrings[0];
  for (let i = 0; i < substitutions.length; i++) {
    result += substitutions[i];
    result += templateStrings[i + 1];
  }
  return result;
}

export type TagFunction<R> = (
  templateStrings: TemplateStringsArray,
  ...substitutions: unknown[]
) => R;
