import { createPlainTextEscaper } from './escaper.js';

export const escapeHtml = createPlainTextEscaper([
  ['&', '&amp;'],
  ['>', '&gt;'],
  ['<', '&lt;'],
  ['"', '&quot;'],
  ["'", '&#39;'],
  ['`', '&#96;'],
]);
