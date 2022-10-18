import assert from 'node:assert/strict';
import { outdent } from './outdent-template-tag.js';
import { createSuite } from './tests.js';

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

test('Multi-line substitution between two lines (text)', () => {
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

test('Multi-line substitution between at the end (text)', () => {
  const lines = 'line#1\n··line#2'.replaceAll('·', ' ');
  assert.equal(
    outdent`
      BEFORE
      ${lines}
    `.replaceAll(' ', '·'),
    'BEFORE\nline#1\n··line#2'
  );
});

test('Multi-line substitution between two lines (Array)', () => {
  const lines = [
    'line#1',
    '··line#2'.replaceAll('·', ' '),
  ];
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
