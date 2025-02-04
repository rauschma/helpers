import * as assert from 'node:assert/strict';
import { createSuite } from '../testing/mocha.js';
import { joinWebPaths, relativeWebPathToRoot, resolveRelativeWebPath } from './web-path.js';

createSuite(import.meta.url);

test('relativeWebPathToRoot', () => {
  {
    const webPath = 'page1.html';
    const pathToRoot = relativeWebPathToRoot(webPath);
    assert.equal(
      resolveRelativeWebPath(webPath, pathToRoot + 'page2.html'),
      'page2.html'
    );
  }
  {
    const webPath = 'dir/page1.html';
    const pathToRoot = relativeWebPathToRoot(webPath);
    assert.equal(
      resolveRelativeWebPath(webPath, pathToRoot + 'page2.html'),
      'page2.html'
    );
  }
  {
    const webPath = 'dir/subdir/page1.html';
    const pathToRoot = relativeWebPathToRoot(webPath);
    assert.equal(
      resolveRelativeWebPath(webPath, pathToRoot + 'page2.html'),
      'page2.html'
    );
  }
});

test('resolveRelativeWebPath: absolute base paths', () => {
  assertSameAsUrl(
    '/dir/file.md', 'img/logo.svg',
    '/dir/img/logo.svg'
  );
  assertSameAsUrl(
    '/dir/file.md', './img/logo.svg',
    '/dir/img/logo.svg'
  );
  assertSameAsUrl(
    '/dir/file.md', '../img/logo.svg',
    '/img/logo.svg'
  );
  assertSameAsUrl(
    '/dir/subdir/', 'img/logo.svg',
    '/dir/subdir/img/logo.svg'
  );

  function assertSameAsUrl(basePath: string, relPath: string, expectedResult: string) {
    assert.equal(
      new URL(relPath, 'file:' + basePath).pathname,
      expectedResult,
      'URL same as expected result?'
    );
    assert.equal(
      resolveRelativeWebPath(basePath, relPath),
      expectedResult,
      'resolveRelativeWebPath() same as expected result?'
    );
  }
});

test('resolveRelativeWebPath: relative base paths', () => {
  assert.equal(
    resolveRelativeWebPath('dir/file.md', 'img/logo.svg'),
    'dir/img/logo.svg'
  );
  assert.equal(
    resolveRelativeWebPath('dir/file.md', './img/logo.svg'),
    'dir/img/logo.svg'
  );
  assert.equal(
    resolveRelativeWebPath('dir/file.md', '../img/logo.svg'),
    'img/logo.svg'
  );
  assert.equal(
    resolveRelativeWebPath('dir/subdir/', 'img/logo.svg'),
    'dir/subdir/img/logo.svg'
  );
});

test('joinWebPaths', () => {
  
  //----- Initial path is relative -----

  assert.equal(
    joinWebPaths('a/b', 'c/file.txt'),
    'a/b/c/file.txt'
  );
  // Trailing slashes of preceding paths are ignored
  assert.equal(
    joinWebPaths('a/b/', 'c/file.txt'),
    'a/b/c/file.txt'
  );
  // Leading slashes of succeeding paths are ignored
  assert.equal(
    joinWebPaths('a/b', '/c/file.txt'),
    'a/b/c/file.txt'
  );
  // Trailing and leading slashes
  assert.equal(
    joinWebPaths('a/b/', '/c/file.txt'),
    'a/b/c/file.txt'
  );
  
  //----- Initial path is absolute -----

  assert.equal(
    joinWebPaths('/a/b', 'c/file.txt'),
    '/a/b/c/file.txt'
  );
  // Trailing slashes of preceding paths are ignored
  assert.equal(
    joinWebPaths('/a/b/', 'c/file.txt'),
    '/a/b/c/file.txt'
  );
  // Leading slashes of succeeding paths are ignored
  assert.equal(
    joinWebPaths('/a/b', '/c/file.txt'),
    '/a/b/c/file.txt'
  );
  // Trailing and leading slashes
  assert.equal(
    joinWebPaths('/a/b/', '/c/file.txt'),
    '/a/b/c/file.txt'
  );

  //----- Double dots -----

  assert.equal(
    joinWebPaths('/a/b/', '../file.txt'),
    '/a/file.txt'
  );
  assert.equal(
    joinWebPaths('/a/b/', '..'),
    '/a'
  );

  //----- Single dot -----

  assert.equal(
    joinWebPaths('/a/b/', '.'),
    '/a/b'
  );
});
