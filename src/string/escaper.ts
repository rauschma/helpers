import { escapeForRegExp } from '../lang/regexp.js';
import { assertTrue } from '../typescript/type.js';

export type Escaper = (str: string) => string;

export type SearchAndReplace = {
  search: RegExp,
  replace: string,
};
export function createSequentialRegExpEscaper(searchAndReplaceArr: Array<SearchAndReplace>): Escaper {
  for (const sar of searchAndReplaceArr) {
    if (!sar.search.global) {
      // Also enforced by .replaceAll(), but we want to fail early
      throw new Error('RegExp must have flag /g: ' + sar.search);
    }
  }
  return (str): string => {
    for (const { search, replace } of searchAndReplaceArr) {
      str = str.replaceAll(search, replace);
    }
    return str;
  };
}

/**
 * Performs plain text replacements simultaneously.
 */
export function createPlainTextEscaper(charToReplacementPairs: Array<[string, string]>): Escaper {
  // An object literal as a parameter would be nicer, syntactically.
  // Alas, it wouldn’t preserve the order of the listed entries.
  const charRegExp = new RegExp(
    charToReplacementPairs
      .map(([k, _v]) => '(' + escapeForRegExp(k) + ')')
      .join('|')
    ,
    'g'
  );
  const charToReplacement = new Map(charToReplacementPairs);

  return (str) => str.replaceAll(
    charRegExp,
    (all) => {
      const replacement = charToReplacement.get(all);
      assertTrue(replacement !== undefined);
      return replacement;
    }
  );
}

const GROUP_PREFIX = '$$$';
/**
 * Performs replacements simultaneously. Searches via regular expressions.
 * - Potential future feature: Insert captures into replacements via
 *   `$<groupName>`. Since we use a function as the second .replace()
 *   argument, we’d have to implement this functionality ourselves.
 */
export function createSimultaneousRegExpEscaper(searchAndReplacePairs: Array<[string, string]>, flags='gu'): Escaper {
  // Considerations:
  // - An object literal as a parameter would be nicer, syntactically.
  //   Alas, it wouldn’t preserve the order of the listed entries if some
  //   of the entries were indices (which come first and are ordered
  //   numerically).
  // - We need to use group names as keys because group numbers (and lookup
  //   in an Array) would prevent the client’s search RegExps from using
  //   groups: Even named groups have groups numbers.
  const charRegExp = new RegExp(
    searchAndReplacePairs
      .map(
        ([search, _replace], index) => `(?<${GROUP_PREFIX+index}>${search})`
      )
      .join('|')
    ,
    flags
  );
  const replacements = new Map(
    searchAndReplacePairs.map(
      ([_search, replace], index) => [GROUP_PREFIX+index, replace]
    )
  );

  return (str) => str.replaceAll(
    charRegExp,
    (...args) => {
      const groups: Record<string, string> = args.at(-1);
      assertTrue(groups !== undefined);
      // Which of the groups matched?
      const result = Object.entries(groups).find(
        ([key, value]) => key.startsWith(GROUP_PREFIX) && value !== undefined
      );
      // We had a match, so one of the groups *must* have matched
      assertTrue(result !== undefined);
      const replacement = replacements.get(result[0]);
      assertTrue(replacement !== undefined);
      return replacement;
    }
  );
}
