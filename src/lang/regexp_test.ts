import { escapeForRegExp } from '@rauschma/helpers/lang/regexp.js';
import assert from 'node:assert/strict';

const { raw } = String;

test('escapeForRegExp: Can /u handle it?', () => {
  // /u is surprisingly picky
  assert.equal(
    new RegExp(escapeForRegExp(`^$\.*+?()[]{}|-`), 'u').toString(),
    raw`/\^\$\.\*\+\?\(\)\[\]\{\}\|-/u`
  );
  assert.equal(
    new RegExp(escapeForRegExp(`2`), 'u').toString(),
    raw`/2/u`
  );
  assert.equal(
    new RegExp(escapeForRegExp(`A`), 'u').toString(),
    raw`/A/u`
  );
});
