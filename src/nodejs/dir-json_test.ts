import assert from 'node:assert/strict';
import { createSuite } from './test.js';

// Only dynamically imported modules use the patched `node:fs`!
import './install-mem-node-fs.js';
const { dirToJson, jsonToCleanDir } = await import('./dir-json.js');

createSuite(import.meta.url);

test('dirToJson', () => {
  jsonToCleanDir({
    '/tmp/test/': {
      'dir': {
        'file1.txt': 'content1\n',
      },
      'file2.txt': 'content2\n',
    },
  });

  assert.deepEqual(
    dirToJson('/tmp/test/'),
    {
      dir: {
        'file1.txt': 'content1\n'
      },
      'file2.txt': 'content2\n',
    }
  );
  assert.deepEqual(
    dirToJson('/tmp/test/', {trimEndsOfFiles: true}),
    {
      dir: {
        'file1.txt': 'content1'
      },
      'file2.txt': 'content2',
    }
  );
});
