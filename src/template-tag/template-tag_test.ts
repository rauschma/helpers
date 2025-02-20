import { createSuite } from '@rauschma/helpers/testing/mocha.js';
import assert from 'node:assert/strict';
import { stringCooked } from './template-tag.js';

createSuite(import.meta.url);

test('stringCooked()', () => {
  assert.equal(
    stringCooked``,
    ''
  );
  assert.equal(
    stringCooked`text`,
    'text'
  );
  assert.equal(
    stringCooked`There are ${99} bottles of ${'juice'}`,
    'There are 99 bottles of juice'
  );
});
