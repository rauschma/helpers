import { assertTrue } from '../ts/type.js';

export function insertVariables(variables: Map<string, string>, pattern: string) {
  return pattern.replace(
    /(?:\\)?\{\{([^{}]+)\}\}/g,
    (all, group1) => {
      if (all.startsWith('\\')) {
        return all.slice(1);
      }
      const value = variables.get(group1);
      if (value === undefined) {
        throw new Error(`Unknown variable name ${JSON.stringify(group1)} among: ${Array.from(variables.keys())}`);
      }
      return value;
    }
  )
}

export function removePrefix(str: string, prefix: string) {
  assertTrue(str.startsWith(prefix));
  return str.slice(prefix.length);
}
export function removePrefixMaybe(str: string, prefix: string) {
  if (str.startsWith(prefix)) {
    return str.slice(prefix.length);
  } else {
    return str;
  }
}
