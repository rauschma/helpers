import { escapeForRegExp } from '@rauschma/helpers/lang/regexp.js';
import assert from 'node:assert/strict';

test('escapeForRegExp', () => {
  const {raw} = String;
  // Decimal digits only have to be escaped at the beginning
  assert.equal(
    escapeForRegExp(raw`3 * 3`),
    raw`\3 \* 3`
  );
  // hexadecimal digits only have to be escaped at the beginning
  assert.equal(
    escapeForRegExp('A + A'),
    raw`\A \+ A`
  );
});
