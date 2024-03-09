const RE_SPLIT_EOL_INCL = /(?<=\r?\n)/;
export function splitLinesInclEol(text: string): Array<string> {
  return text.split(RE_SPLIT_EOL_INCL);
}

/**
 * This version of `splitLinesInclEol()` does not use lookbehind assertions
 * in regular expressions (which e.g. Safari hadn’t supported for a long
 * time).
 * @see https://caniuse.com/js-regexp-lookbehind
 */
export function splitLinesInclEolCompat(text: string): Array<string> {
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

const RE_SPLIT_EOL_EXCL = /\r?\n/;
export function splitLinesExclEol(text: string): Array<string> {
  return text.split(RE_SPLIT_EOL_EXCL);
}

const RE_EOL = /\r?\n$/;
export function trimEol(line: string) {
  const lineTerminatorIndex = line.search(RE_EOL);
  if (lineTerminatorIndex < 0) return line;
  return line.slice(0, lineTerminatorIndex);
}

export function detectEol(text: string): string {
  return text.includes('\r\n') ? '\r\n' : '\n';
}

/**
 * Chunks to lines via async iterable
 * 
 * Can be used for
 * - native Node.js streams
 * - web streams (Node’s or making them iterable via a helper)
 *   - for web streams, you can also use `ChunksToLinesTransformer`
 * 
 * @param chunkIterable An asynchronous or synchronous iterable
 * over “chunks” (arbitrary strings)
 * @returns An asynchronous iterable over “lines”
 * (strings with at most one newline that always appears at the end)
 */
export async function* chunksToLinesAsync(chunkIterable: AsyncIterable<string> | Iterable<string>): AsyncIterable<string> {
  let previous = '';
  for await (const chunk of chunkIterable) {
    let startSearch = previous.length;
    previous += chunk;
    while (true) {
      const eolIndex = previous.indexOf('\n', startSearch);
      if (eolIndex < 0) break;
      // line includes the EOL
      const line = previous.slice(0, eolIndex + 1);
      yield line;
      previous = previous.slice(eolIndex + 1);
      startSearch = 0;
    }
  }
  if (previous.length > 0) {
    yield previous;
  }
}
