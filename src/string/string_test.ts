import { insertVariables, removePrefix, removeSuffix } from '@rauschma/helpers/string/string.js';
import { createSuite } from '@rauschma/helpers/testing/mocha.js';
import assert from 'node:assert/strict';

createSuite(import.meta.url);

test('insertVariables()', () => {
  const vars = new Map([
    ['first', 'Robin'],
    ['last', 'Doe'],
  ]);
  assert.equal(
    insertVariables(vars, '[{{first}} {{last}}]'),
    '[Robin Doe]'
  );
  assert.equal(
    insertVariables(vars, '{{first}} {{last}}'),
    'Robin Doe'
  );
  assert.throws(
    () => insertVariables(vars, '{{unknown}}'),
    {
      message: 'Unknown variable name "unknown" among: first,last'
    }
  );
  assert.equal(
    insertVariables(vars, String.raw`\{{escaped}} \{{double}} \{{braces}}`),
    '{{escaped}} {{double}} {{braces}}'
  );
});

test('removePrefix()', () => {
  assert.equal(
    removePrefix('_abc', '_'),
    'abc'
  );
  assert.equal(
    removePrefix('prefix', 'prefix'),
    ''
  );
  assert.equal(
    removePrefix('abc', ''),
    'abc'
  );
});

test('removeSuffix()', () => {
  assert.equal(
    removeSuffix('file.txt', '.txt'),
    'file'
  );
  assert.equal(
    removeSuffix('suffix', 'suffix'),
    ''
  );
  assert.equal(
    removeSuffix('my-dir', ''),
    'my-dir'
  );
});
