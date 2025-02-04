import { cast, type Class } from './type.js';

export class TypedMap {
  #map = new Map<Class<unknown>, unknown>();
  set<T>(key: Class<T>, value: T): this {
    this.#map.set(key, value);
    return this;
  }
  get<T>(key: Class<T>): undefined | T {
    const value = this.#map.get(key);
    if (value === undefined) {
      return undefined;
    }
    return cast(key, value);
  }
  getOrThrow<T>(key: Class<T>): T {
    const value = this.get(key);
    if (value === undefined) {
      throw new TypeError(`No value for key ${key}`);
    }
    return value;
  }
  keyClassNames(): string[] {
    return Array.from(
      this.#map.keys(),
      theClass => theClass.name
    );
  }
}
