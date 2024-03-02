import assert from 'node:assert/strict';
import { createSuite } from './test.js';
import { jsonToCleanDir, dirToJson } from './dir-json.js';

// Only dynamically imported modules use the patched `node:fs`!
import { mfs } from './install-mem-node-fs.js';

createSuite(import.meta.url);

test('jsonToCleanDir() & dirToJson(): directories with text files', () => {
  jsonToCleanDir(mfs, {
    '/tmp/test/': {
      'dir': {
        'file1.txt': 'content1\n',
      },
      'file2.txt': 'content2\n',
    },
  });

  assert.deepEqual(
    dirToJson(mfs, '/tmp/test/'),
    {
      dir: {
        'file1.txt': 'content1\n'
      },
      'file2.txt': 'content2\n',
    }
  );
  assert.deepEqual(
    dirToJson(mfs, '/tmp/test/', { trimEndsOfFiles: true }),
    {
      dir: {
        'file1.txt': 'content1'
      },
      'file2.txt': 'content2',
    }
  );
});


test('jsonToCleanDir() & dirToJson(): empty directories', () => {
  jsonToCleanDir(mfs, {
    '/tmp/empty-dir/': {},
  });
  assert.ok(mfs.existsSync('/tmp/empty-dir/'));
  assert.deepEqual(
    dirToJson(mfs, '/tmp/'),
    {
      'empty-dir': {},
    }
  );
});
