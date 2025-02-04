import * as path from 'node:path';
import * as url from 'node:url';

/**
 * Helper for Mocha
 */
export function createSuite(importMetaUrl: string): void {
  const modulePath = url.fileURLToPath(importMetaUrl);
  suite(path.parse(modulePath).base);
}
