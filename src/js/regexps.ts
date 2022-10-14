export enum MatchMode {
  AtLastIndex = 'AtLastIndex',
  AtLastIndexOrLater = 'AtLastIndexOrLater',
}

export function setLastIndex(matchMode: MatchMode, regExp: RegExp, lastIndex: number): RegExp {
  switch (matchMode) {
    case MatchMode.AtLastIndex:
      if (!regExp.sticky) {
        throw new TypeError(`If flag /y is not set, matching ${matchMode} won’t work: ${regExp}`);
      }
      break;
    case MatchMode.AtLastIndexOrLater:
      if (!regExp.global) {
        throw new TypeError(`If flag /g is not set, matching ${matchMode} won’t work: ${regExp}`);
      }
      if (regExp.sticky) {
        throw new TypeError(`If flag /y is set, matching ${matchMode} won’t work: ${regExp}`);
      }
      break;
  }
  regExp.lastIndex = lastIndex;
  return regExp;
}

/**
 * The string returned by this function can be passed to `new RegExp()` and
 * it will match the characters in `str`. It escapes them so that they
 * don’t have any special meaning.
 *
 * All special characters are escaped, because we may want to quote
 * characters inside parentheses or square brackets.
 */
export function escapeForRegExp(str: string) {
  return str.replace(/[\\^$.*+?()\[\]{}|=!<>:\-]/g, '\\$&');
}
