/**
 * Once Safari supports lookbehind assertions, we can use:
 * ```js
 * const lines = text.split(/(?<=\r?\n)/);
 * ```
 * @see https://caniuse.com/js-regexp-lookbehind
 */
 export function splitLinesInclEol(text: string): Array<string> {
  const result: Array<string> = [];
  let lastIndex = 0;
  while (lastIndex < text.length) {
    // Searching for '\n' also works for '\r\n'
    const nextIndex = text.indexOf('\n', lastIndex);
    if (nextIndex < 0) {
      result.push(text.slice(lastIndex));
      break;
    }
    result.push(text.slice(lastIndex, nextIndex + 1)); // include linebreak
    lastIndex = nextIndex + 1;
  }
  return result;
}

const RE_SPLIT_EOL = /\r?\n/;
export function splitLinesExclEol(text: string): Array<string> {
  return text.split(RE_SPLIT_EOL);
}

const RE_EOL_REMOVE = /\r?\n$/;
export function removeTrailingEol(line: string) {
  const match = RE_EOL_REMOVE.exec(line);
  if (!match) return line;
  return line.slice(0, match.index);
}
