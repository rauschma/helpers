/**
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#getting_a_random_integer_between_two_values
 */
export function randomInteger(minIncl: number, maxExcl: number): number {
  return Math.floor(Math.random() * (maxExcl - minIncl) + minIncl);
}
