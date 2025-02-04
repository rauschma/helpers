import { insertVariables } from '@rauschma/helpers/string/string.js';
import { createSuite } from '@rauschma/helpers/testing/mocha.js';
import assert from 'node:assert/strict';

createSuite(import.meta.url);

test('Composing regular expressions', () => {
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
