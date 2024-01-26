export function isObject(value: unknown): value is Record<string | symbol, unknown> {
  return (typeof value === 'object') && (value !== null);
}

export function getOwn<K extends string | number | symbol, V>(obj: Record<K, V>, key: K): undefined | V {
  if (!Object.hasOwn(obj, key)) {
    return undefined;
  }
  return obj[key];
}