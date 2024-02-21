import assert from 'node:assert/strict';
import { createSuite } from './test.js';
import { jsonToCleanDir, dirToJson } from './dir-json.js';

// Only dynamically imported modules use the patched `node:fs`!
import {mfs} from './install-mem-node-fs.js';

createSuite(import.meta.url);

test('dirToJson', () => {
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
    dirToJson(mfs, '/tmp/test/', {trimEndsOfFiles: true}),
    {
      dir: {
        'file1.txt': 'content1'
      },
      'file2.txt': 'content2',
    }
  );
});
