export function isArrayEqual<T>(arr1: Array<T>, arr2: Array<T>) {
  return arr1.length === arr2.length
    && arr1.every((elem, i) => elem === arr2[i]);
}
export function isObject(value: unknown): value is Record<string|symbol, unknown> {
  return (typeof value === 'object') && (value !== null);
}

export function subtractSets<T>(set1: Set<T>, set2: Set<T>) {
  const result = new Set<T>();
  for (const elem of set1) {
    if (!set2.has(elem)) {
      result.add(elem);
    }
  }
  return result;
}

export class ArrayQueue<T> extends Array<T> {
  enqueue(value: T) {
    // Add at the end
    return this.push(value);
  }
  dequeue(): undefined | T {
    // Remove first element
    return this.shift();
  }
}
