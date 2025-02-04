export function* concatIterables<T>(...iterables: Array<Iterable<T>>): Iterable<T> {
  for (const i of iterables) {
    yield* i;
  }
}
export function* mapIterable<S,T>(iterable: Iterable<S>, callback: (from: S, index: number) => T): Iterable<T> {
  let index = 0;
  for (const x of iterable) {
    yield callback(x, index);
    index++;
  }
}
export function* entriesOfIterable<T>(iterable: Iterable<T>): Iterable<[number, T]> {
  let index = 0;
  for (const x of iterable) {
    yield [index, x];
    index++;
  }
}