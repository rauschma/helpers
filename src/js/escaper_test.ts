import { createSuite } from '@rauschma/helpers/nodejs/test.js';
import * as assert from 'node:assert/strict';
import { createPlainTextEscaper, createSequentialEscaper } from './escaper.js';

createSuite(import.meta.url);

test('createEscaper for HTML', () => {
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

test('createEscaper for backslashes and braces', () => {
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

test('createEscaper for bracketed text', () => {
  const escape = createSequentialEscaper([
    ["⎡([^⎡⎤]*?)⎤", ""],
    ["«(?<inside>[^«»]*?)»", "“$<inside>”"],
  ]);
  assert.equal(
    escape('I say «hello»⎡ and goodbye⎤!'),
    'I say “hello”!'
  );
});
