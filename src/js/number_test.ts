import { createSuite } from '@rauschma/helpers/js/mocha.js';
import assert from 'node:assert/strict';
import { randomInteger } from './number.js';

createSuite(import.meta.url);

test('randomInteger', async () => {
  // Repeat 5 times
  for (let i = 1; i <= 5; i++) {
    const min = i;
    const max = i * 10;
    const result = randomInteger(min, max);
    assert.ok(min <= result);
    assert.ok(result < max);
  }
});
