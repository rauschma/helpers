import assert from 'node:assert/strict';
import { insertVariables } from './string.js';

test('Composing regular expressions', () => {
  const vars = new Map([
    ['first', 'Robin'],
    ['last', 'Doe'],
  ]);
  assert.equal(
    insertVariables(vars, '[{{first}} {{last}}]'),
    '[Robin Doe]'
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
