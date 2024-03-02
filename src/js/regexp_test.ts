import assert from 'node:assert/strict';
import { escapeForRegExp } from './regexp.js';

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
