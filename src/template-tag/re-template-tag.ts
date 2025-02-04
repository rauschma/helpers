import { escapeForRegExp } from '../lang/regexp.js';
import { assertNonNullable } from '../typescript/type.js';

export function re(templateStrings: TemplateStringsArray, ...substitutions: unknown[]): RegExp {
  // templateStrings.length = 1 + substitutions.length
  // There is always at least one template string
  const lastTmplStr = templateStrings.raw[templateStrings.length-1];
  assertNonNullable(lastTmplStr);
  let reStr = '';
  for (const [i, subst] of substitutions.entries()) {
    const curTmplStr = templateStrings.raw[i];
    assertNonNullable(curTmplStr);
    reStr += handleEscapedBackticks(curTmplStr);

    if (typeof subst === 'string') {
      if (i === (substitutions.length-1) && lastTmplStr === '' && curTmplStr.endsWith('/')) {
        // Computed RegExp flags at the end of the tagged template: Remove
        // duplicates (which the RegExp constructor would complain about).
        reStr += Array.from(new Set(subst)).join('');
      } else {
        reStr += escapeForRegExp(subst);
      }
    } else if (subst instanceof RegExp) {
      reStr += subst.source;
    } else {
      throw new Error('Illegal substitution: '+subst);
    }
  }
  reStr += handleEscapedBackticks(lastTmplStr);

  let flags = '';
  if (reStr.startsWith('/')) {
    const lastSlashIndex = reStr.lastIndexOf('/');
    if (lastSlashIndex === 0) {
      throw new Error('If the `re` string starts with a slash, it must end with a second slash and zero or more flags: '+reStr);
    }
    flags = reStr.slice(lastSlashIndex+1);
    reStr = reStr.slice(1, lastSlashIndex);
  }
  try {
    return new RegExp(reStr, flags);
  } catch (err) {
    if (err instanceof SyntaxError) {
      throw new SyntaxError(`new RegExp(${JSON.stringify(reStr)}, ${JSON.stringify(flags)})`, {cause: err});
    }
    throw err;
  }
}

/**
 * In raw strings (e.g. if the template tag is `String.raw`), backticks can
 * be escaped via backslashes, but the latter are not removed.
 */
function handleEscapedBackticks(str: string) {
  return str.replace(/\\`/g, '`');
}
