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
  return str.slice(prefix.length);
}
export function removePrefixMaybe(str: string, prefix: string): string {
  if (str.startsWith(prefix)) {
    return str.slice(prefix.length);
  } else {
    return str;
  }
}

export function removeSuffix(str: string, suffix: string): string {
  assertTrue(str.endsWith(suffix));
  return str.slice(0, -suffix.length);
}
export function removeSuffixMaybe(str: string, suffix: string): string {
  if (str.endsWith(suffix)) {
    return str.slice(0, -suffix.length);
  } else {
    return str;
  }
}

const RE_EMTPY_LINE = /^[\t \r\n]*$/u;
export function isEmptyLine(str: string): boolean {
  return RE_EMTPY_LINE.test(str);
}
