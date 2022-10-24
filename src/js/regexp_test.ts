import assert from 'node:assert/strict';
import { escapeForRegExp } from './regexp.js';

test('escapeForRegExp', () => {
  const {raw} = String;
  // Leading digits vs. other special characters
  assert.equal(
    escapeForRegExp(raw`3 * 3`),
    raw`\3 \* 3`
  );
  // Leading digits vs. other special characters
  assert.equal(
    escapeForRegExp('A + A'),
    raw`\A \+ A`
  );
});
