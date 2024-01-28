import * as fs from 'node:fs';
import * as path from 'node:path';

export function ensureParentDirectory(filePath: string) {
  const parentDir = path.dirname(filePath);
  if (!fs.existsSync(parentDir)) {
    fs.mkdirSync(parentDir, { recursive: true });
  }
}

/**
 * Remove the contents of `dir`, but not the directory itself.
 */
export function clearDirectorySync(dir: string) {
  if (fs.existsSync(dir)) {
    for (const fileName of fs.readdirSync(dir)) {
      const filePath = path.resolve(dir, fileName);
      fs.rmSync(filePath, { recursive: true });
    }
  }
}
