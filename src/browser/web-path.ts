import { removePrefix, removeSuffix } from '../string/string.js';
import { assertNonNullable, assertTrue } from '../typescript/type.js';

const {stringify} = JSON;

/**
 * Joining vs. resolving relative to a base path:
 * ```
 * > path.join('/dir/file.md', 'img/logo.svg')
 * '/dir/file.md/img/logo.svg'
 * > path.join('/dir/EPUB', '..')
 * '/dir'
 * > path.join('/dir/EPUB/', '..')
 * '/dir'
 * 
 * > new URL('img/logo.svg', 'file:/dir/file.md').pathname
 * '/dir/img/logo.svg'
 * > new URL('..', 'file:/dir/EPUB').pathname
 * '/'
 * > new URL('..', 'file:/dir/EPUB/').pathname
 * '/dir/'
 * ```
 * 
 * @see https://datatracker.ietf.org/doc/html/rfc3986.html#section-5.2
 */
export function resolveRelativeWebPath(basePath: string, relPath: string): string {
  let urlStr = (
    basePath.startsWith('/')
    ? 'file:' + basePath
    : 'file:/' + basePath
  );
  const result = new URL(relPath, urlStr).pathname;
  return (
    basePath.startsWith('/')
    ? result
    : result.slice(1)
  );
}

export function joinWebPaths(...webPaths: Array<string>): string {
  if (!(0 in webPaths)) {
    return '.'
  }
  let current = webPaths[0];
  for (let i=1; i<webPaths.length; i++) {
    let next = webPaths[i];
    assertNonNullable(next);
    if (current === '' || current === '.') {
      current = next;
      continue;
    }
    if (next === '') {
      // do nothing
      continue;
    }
    if (current.endsWith('/')) {
      current = removeSuffix(current, '/');
    }
    if (next.startsWith('/')) {
      next = removePrefix(next, '/');
    }
    const currentSegments = current.split('/');
    const nextSegments = next.split('/');
    for (const nextSegment of nextSegments) {
      if (nextSegment === '.') {
        continue;
      }
      if (nextSegment === '..') {
        currentSegments.pop();
        continue;
      }
      currentSegments.push(nextSegment);
    }
    current = currentSegments.join('/');
  }
  return current;
}

/**
 * @param sourceExt Example: `'.md'`
 * @param targetExt Example: `'.html'`
 */
export function replaceWebPathExtension(webPath: string, sourceExt: string, targetExt: string): string {
  if (webPath.endsWith(sourceExt)) {
    return webPath.slice(0, -sourceExt.length) + targetExt;;
  }
  throw new Error(`Web path ${stringify(webPath)} does not have the filename extension ${stringify(sourceExt)}`);
}

/**
 * - The result either is the empty string or ends with a slash.
 * - Use case: String-concatenate a root-relative path to the result.
 */

export function relativeWebPathToRoot(webPath: string): string {
  if (webPath.startsWith('/') || webPath.startsWith('./') || webPath.startsWith('../')) {
    throw new Error(`Path ${webPath} must not start with / or ./ or ../`);
  }
  const segments = webPath.split('/');
  assertTrue(segments.length >= 1);
  return '../'.repeat(segments.length - 1);
}
