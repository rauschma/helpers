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
