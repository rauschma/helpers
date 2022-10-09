import assert from 'node:assert/strict';
import { outdent } from '../src/js/outdent-template-tag.js';
import { createSuite } from '../src/js/tests.js';

createSuite(import.meta.url);

test('Indented line', () => {
  assert.equal(
    outdent`
      before
        indented
      after
    `,
    'before\n  indented\nafter'
  );
});

test('Multi-line substitution', () => {
  const lines = 'line#1\n··line#2'.replaceAll('·', ' ');
  assert.equal(
    outdent`
      BEFORE
        ${lines}
      AFTER
    `.replaceAll(' ', '·'),
    'BEFORE\n··line#1\n····line#2\nAFTER'
  );
});

test('Single-line substitutions', () => {
  assert.equal(
    outdent`
      ${3} apples and ${'five'} oranges
    `,
    '3 apples and five oranges'
  );
});
