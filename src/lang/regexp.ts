import { assertNonNullable, assertTrue } from '../typescript/type.js';

//############### Setting regExp.lastIndex ###############

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
        throw new TypeError(`Flag /y must not be set for matching ${matchMode}: ${regExp}`);
      }
      break;
  }
  regExp.lastIndex = lastIndex;
  return regExp;
}

//############### RegExp.escape() polyfill ###############

const StringToCodePoints = Array.from;

//========== Constants ==========

const DecimalDigit = /^[0-9]$/u;
const AsciiLetter = /^[A-Za-z]$/u;
const SyntaxCharacter = new Set(
  StringToCodePoints('^$\\.*+?()[]{}|')
);
const toEscape = new Set(
  StringToCodePoints(",-=<>#&!%:;@~'`\"")
);
const WhiteSpace = /^\s$/u;
const LineTerminator = /^[\n\r\u2028\u2029]$/u;

const SOLIDUS = '/';
const REVERSE_SOLIDUS = '\\';
const CodePointToControlEscape = new Map([
  ['\u0009', 't'],
  ['\u000A', 'n'],
  ['\u000B', 'v'],
  ['\u000C', 'f'],
  ['\u000D', 'r'],
]);

//========== Implementation ==========

/**
 * Implementation of RegExp.escape():
 * - Focuses on readability and mirroring the spec, not on efficiency, robustness or security.
 * - Proposal: https://github.com/tc39/proposal-regex-escaping
 * - Proper polyfill: https://www.npmjs.com/package/regexp.escape
*/
export function escapeForRegExp(str: string): string {
  if (typeof str !== 'string') {
    throw new TypeError('Not a string: ' + str);
  }
  let escaped = '';
  const codePointList = StringToCodePoints(str);
  for (const codePoint of codePointList) {
    if (
      escaped.length === 0
      && (DecimalDigit.test(codePoint) || AsciiLetter.test(codePoint))
    ) {
      const numericValue = codePoint.codePointAt(0);
      assertNonNullable(numericValue);
      const hex = numericValue.toString(16);
      assertTrue(hex.length === 2);
      escaped = '\\x' + hex;
    } else {
      escaped += EncodeForRegExpEscape(codePoint);
    }
  }
  return escaped;
}

function EncodeForRegExpEscape(codePoint: string): string {
  if (SyntaxCharacter.has(codePoint) || codePoint === SOLIDUS) {
    return REVERSE_SOLIDUS + codePoint;
  }
  else if (CodePointToControlEscape.has(codePoint)) {
    return REVERSE_SOLIDUS + CodePointToControlEscape.get(codePoint);
  }
  if (
    toEscape.has(codePoint) ||
    WhiteSpace.test(codePoint) || LineTerminator.test(codePoint) ||
    isLeadingSurrogate(codePoint) || isTrailingSurrogate(codePoint)
  ) {
    const codePointNum = codePoint.codePointAt(0);
    assertNonNullable(codePointNum);
    if (codePointNum <= 0xFF) {
      const hex = codePointNum.toString(16);
      return REVERSE_SOLIDUS + 'x' + hex.padStart(2, '0');
    }
    let escaped = '';
    for (let i=0; i<codePoint.length; i++) {
      const codeUnit = codePoint[i];
      assertNonNullable(codeUnit);
      escaped += UnicodeEscape(codeUnit);
    }
    return escaped;
  }
  return codePoint; // JS string, already UTF-16
}

//========== Helpers ==========

function UnicodeEscape(codeUnit: string): string {
  assertTrue(codeUnit.length === 1);
  const num = codeUnit.charCodeAt(0);
  assertTrue(num <= 0xFFFF);
  const hex = num.toString(16);
  return REVERSE_SOLIDUS + 'u' + hex.padStart(4, '0');
}

function isLeadingSurrogate(codePoint: string): boolean {
  if (codePoint.length !== 1) return false;
  const num = codePoint.charCodeAt(0);
  return 0xD800 <= num && num <= 0xDBFF;
}

function isTrailingSurrogate(codePoint: string): boolean {
  if (codePoint.length !== 1) return false;
  const num = codePoint.charCodeAt(0);
  return 0xDC00 <= num && num <= 0xDFFF;
}
