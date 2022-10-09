import { assertTrue, Class } from "./types.js";

export class TypedMap {
  #map = new Map<Class<unknown>, any>();
  set<T>(key: Class<T>, value: T): this {
    this.#map.set(key, value);
    return this;
  }
  get<T>(key: Class<T>): undefined | T {
    const value = this.#map.get(key);
    if (value === undefined) {
      return undefined;
    }
    return value;
  }
  getForced<T>(key: Class<T>): T {
    const value = this.get(key);
    assertTrue(value !== undefined);
    return value;
  }
  keyClassNames() {
    return Array.from(
      this.#map.keys(),
      theClass => theClass.name
    );
  }
}
