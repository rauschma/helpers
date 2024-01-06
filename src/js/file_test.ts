import mock from 'mock-fs';
import assert from 'node:assert/strict';
import { dirToJson } from './file.js';
import { createSuite } from './test.js';

createSuite(import.meta.url);

test('dirToJson', () => {
  mock({
    '/tmp': {
      'dir': {
        'file1.txt': 'content1',
      },
      'file2.txt': 'content2',
    },
  });
  assert.deepEqual(
    dirToJson('/tmp'),
    {
      dir: {
        'file1.txt': 'content1'
      },
      'file2.txt': 'content2',
    }
  );

  mock.restore();
});
