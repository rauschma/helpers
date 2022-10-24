// https://gist.github.com/rauschma/9186607a556b6e77d27a7c5df4d09690

import assert from 'node:assert/strict';

// Extended RegExp mode (flag /x) [1] via a template tag
//
// Quote: “While the x-mode flag can be used in a RegularExpressionLiteral,
// it does not permit the use of LineTerminator in RegularExpressonLiteral.
// For multi-line regular expressions you would need to use the RegExp
// constructor.”
//
// The plan is to include this functionality in re-template-tag [2]. Then
// this template tag does four things at the same time:
//
// 1. Escaping substituted strings
// 2. Including substituted RegExps
// 3. Multi-line RegExp literals
// 4. Extended mode (only need until JS RegExps have the flag /x)
//
// [1] https://github.com/tc39/proposal-regexp-x-mode
// [2] https://github.com/rauschma/re-template-tag

function rex(templateStrings, ...substitutions) {
  let str = String.raw(templateStrings, ...substitutions);

  // Alas, Safari doesn’t support negative lookbehind, so this code is more
  // complicated than I’d like.

  // Line comment characters must be escaped or inside character classes.
  // To permit the latter, I’m currently disallowing square brackets in
  // line comments.
  str = str.replaceAll(/(^|[^\\])#[^\[\]]*$/gm, '$1');

  // All whitespace must be escaped (even within character classes).
  // Sadly, Safari doesn’t support negative lookbehind, so:
  str = str.replaceAll(/(^|[^\\])\s+/g, '$1');

  // I ignore flags in this experiment
  return new RegExp(str);
}

//===== Examples =====

const { raw } = String;

assert.deepEqual(
  rex`
    [0-9]{4} # year
    [0-9]{2} # month
    [0-9]{2} # day
  `,
  /[0-9]{4}[0-9]{2}[0-9]{2}/
);

// JavaScript RegExps are fine with escaping hashes
assert.deepEqual(
  rex`
    \# escaped_hash
    [#] escaped_hash
  `,
  /\#escaped_hash[#]escaped_hash/
);

// JavaScript RegExps are fine with escaping spaces
assert.deepEqual(
  rex`escaping\ spaces`,
  /escaping\ spaces/
);

// JavaScript RegExps are fine with escaping carriage returns
const ESCAPED_CR = '\\\r';
assert.deepEqual(
  rex`escaping${ESCAPED_CR}carriage_returns`,
  new RegExp(raw`escaping${ESCAPED_CR}carriage_returns`)
);

// JavaScript RegExps are fine with escaping linefeeds
const ESCAPED_LF = '\\\n';
assert.deepEqual(
  rex`escaping${ESCAPED_LF}linefeeds`,
  new RegExp(raw`escaping${ESCAPED_LF}linefeeds`)
);
