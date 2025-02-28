import { assertTrue } from '../typescript/type.js';

export function insertVariables(variables: Map<string, string>, pattern: string): string {
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

export function removePrefix(str: string, prefix: string): string {
  assertTrue(str.startsWith(prefix));
  return removePrefixUnchecked(str, prefix);
}
export function removePrefixMaybe(str: string, prefix: string): string {
  if (str.startsWith(prefix)) {
    return removePrefixUnchecked(str, prefix);
  } else {
    return str;
  }
}
export function removePrefixUnchecked(str: string, prefix: string): string {
  return str.slice(prefix.length);
}

export function removeSuffix(str: string, suffix: string): string {
  assertTrue(str.endsWith(suffix));
  return removeSuffixUnchecked(str, suffix);
}
export function removeSuffixMaybe(str: string, suffix: string): string {
  if (str.endsWith(suffix)) {
    return removeSuffixUnchecked(str, suffix);
  } else {
    return str;
  }
}
export function removeSuffixUnchecked(str: string, suffix: string): string {
  // The second argument can’t be -suffix.length because that doesn’t work
  // if `suffix` is empty.
  return str.slice(0, str.length - suffix.length);
}

const RE_EMTPY_LINE = /^[\t \r\n]*$/u;
export function isEmptyLine(str: string): boolean {
  return RE_EMTPY_LINE.test(str);
}
