/**
 * Naming: https://github.com/tc39/proposal-set-methods
 */
export function setDifference<T>(set1: Set<T>, set2: Set<T>): Set<T> {
  const result = new Set<T>();
  for (const elem of set1) {
    if (!set2.has(elem)) {
      result.add(elem);
    }
  }
  return result;
}

export function areSetsEqual<T>(set1: Set<T>, set2: Set<T>): boolean {
  if (set1.size !== set2.size) {
    return false;
  }
  for (const x of set1) {
    if (!set2.has(x)) return false;
  }
  return true;
}
