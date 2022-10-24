import assert from 'node:assert/strict';
import { re } from './re-template-tag.js';

// FIXME: test escaped substitutions and escaped dollar signs

test('Composing regular expressions', () => {
  const RE_YEAR = /([0-9]{4})/;
  const RE_MONTH = /([0-9]{2})/;
  const RE_DAY = /([0-9]{2})/;
  const RE_DATE = re`/^${RE_YEAR}-${RE_MONTH}-${RE_DAY}$/u`;
  assert.equal(RE_DATE.source, '^([0-9]{4})-([0-9]{2})-([0-9]{2})$');
});

test('Specifying flags', () => {
  const regexp1 = re`/abc/gu`;
  assert.ok(regexp1 instanceof RegExp);
  assert.equal(regexp1.source, 'abc');
  assert.equal(regexp1.flags, 'gu');

  const regexp2 = re`/xyz/`;
  assert.ok(regexp2 instanceof RegExp);
  assert.equal(regexp2.source, 'xyz');
  assert.equal(regexp2.flags, '');
});

test('Computing flags', () => {
  const regexp = re`/abc/${'g'+'u'}`;
  assert.ok(regexp instanceof RegExp);
  assert.equal(regexp.source, 'abc');
  assert.equal(regexp.flags, 'gu');
});

test('Eliminating duplicates in computed flags', () => {
  const flags = 'gu';
  const regexp = re`/abc/${flags+'g'}`;
  assert.equal(regexp.flags, 'gu');
});

test('Simple, flag-less mode', () => {
  const regexp = re`abc`;
  assert.ok(regexp instanceof RegExp);
  assert.equal(regexp.source, 'abc');
  assert.equal(regexp.flags, '');
});

test('Escaping special characters in strings', () => {
  assert.equal(re`/-${'.'}-/u`.source, '-\\.-');
});

test('Use “raw” backslashes like in regular expressions', () => {
  assert.equal(re`/\./u`.source, '\\.');
});

test('Slashes don’t need to be escaped', () => {
  assert.ok(re`/^/$/u`.test('/'));
});

test('Escaping backticks', () => {
  // Must escape in static text:
  const RE_BACKTICK = re`/^\`$/u`;
  assert.equal(RE_BACKTICK.source, '^`$');
  assert.ok(RE_BACKTICK.test('`'));
  // No escaping of backticks in dynamic text:
  const str = '`\\`';
  assert.equal(re`/${str}/`.source, '`\\\\`');
    // Single backslash in `str` is escaped inside regular expression
});
