const {raw} = String;

export enum MatchMode {
  /** No gaps between matches */
  AtLastIndex = 'AtLastIndex',
  /** There can be gaps between matches */
  AtLastIndexOrLater = 'AtLastIndexOrLater',
}

export function setLastIndex(matchMode: MatchMode, regExp: RegExp, lastIndex: number): RegExp {
  switch (matchMode) {
    case MatchMode.AtLastIndex:
      if (!regExp.sticky) {
        throw new TypeError(`Flag /y must be set for matching ${matchMode}: ${regExp}`);
      }
      break;
    case MatchMode.AtLastIndexOrLater:
      if (!regExp.global) {
        throw new TypeError(`Flag /g must be set for matching ${matchMode}: ${regExp}`);
      }
      if (regExp.sticky) {
        throw new TypeError(`Flag /y must be set for matching ${matchMode}: ${regExp}`);
      }
      break;
  }
  regExp.lastIndex = lastIndex;
  return regExp;
}

/**
 * - Based on
 *   {@link https://github.com/tc39/proposal-regex-escaping/blob/main/EscapedChars.md this list}
 *   - Ignored: escaping text for `eval()`
 * - Changes needed for upcoming `/v` flag:
 *   {@link https://github.com/tc39/proposal-regexp-v-flag/issues/71}
 */
const specialAnywhere = [
  // We escape all characters even though they are put inside a character
  // class, to be ready for future changes.
  raw`\^`, raw`$`,
  raw`\\`,
  raw`\.`,
  raw`\*`, raw`\+`, raw`\?`,
  raw`\(`, raw`\)`, raw`\[`, raw`\]`, raw`\{`, raw`\}`,
  raw`\|`,
  // Omitted – not currently allowed by /u
  // raw`\-`, // inside character classes (square brackets)
];
// Only first character of string needs to be escaped in these cases:
const specialAtStart = [
  // Alas, both cases have to be omitted because they are not allowed by /u
  // - Decimal digits: inserting after (e.g.) `\1`
  // - Hex digits: inserting after (e.g.) `\u004`
  // `0-9A-Za-z`,
  ``,
];
const re_specialCharacters = new RegExp(
  raw`[${specialAnywhere.join('')}]|^[${specialAtStart.join('')}]`,
  'g'
);
// Previously used RegExp: /[\\^$.*+?()\[\]{}|\-=!<>:]/g

/**
 * The string returned by this function can be passed to `new RegExp()` and
 * it will match the characters in `str`. It escapes them so that they
 * don’t have any special meaning.
 *
 * All special characters are escaped, because we may want to quote
 * characters inside parentheses or square brackets.
 */
export function escapeForRegExp(str: string) {
  return str.replace(re_specialCharacters, '\\$&');
}
