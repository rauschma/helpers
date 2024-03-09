import { createSuite } from '@rauschma/helpers/js/mocha.js';
import * as assert from 'node:assert/strict';
import { createPlainTextEscaper, createSequentialRegExpEscaper } from './escaper.js';

createSuite(import.meta.url);

test('createPlainTextEscaper: HTML', () => {
  const escape = createPlainTextEscaper([
    ['&', '&amp;'],
    ['>', '&gt;'],
    ['<', '&lt;'],
    ['"', '&quot;'],
    ["'", '&#39;'],
    ['`', '&#96;'],
  ]);
  assert.equal(
    escape('<hello> & "goodbye"'),
    '&lt;hello&gt; &amp; &quot;goodbye&quot;'
  );
});

test('createPlainTextEscaper: backslashes and braces', () => {
  const escape = createPlainTextEscaper([
    [`\\`, String.raw`\\`],
    [`{`, String.raw`\{`],
    [`}`, String.raw`\}`],
  ]);
  assert.equal(
    escape(String.raw`\ and {braces}`),
    String.raw`\\ and \{braces\}`
  );
});

test('createSequentialRegExpEscaper: bracketed text', () => {
  const escape = createSequentialRegExpEscaper([
    {search: /⎡([^⎡⎤]*?)⎤/gu, replace: ''},
    {search: /«(?<inside>[^«»]*?)»/gu, replace: '“$<inside>”'},
  ]);
  assert.equal(
    escape('I say «hello»⎡ and goodbye⎤!'),
    'I say “hello”!'
  );
});
