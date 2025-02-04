import { createPlainTextEscaper, type Escaper } from './escaper.js';

export const escapeHtml: Escaper = createPlainTextEscaper([
  ['&', '&amp;'],
  ['>', '&gt;'],
  ['<', '&lt;'],
  ['"', '&quot;'],
  ["'", '&#39;'],
  ['`', '&#96;'],
]);
