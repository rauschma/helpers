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

export type JsonDir = {
  [key: string]: string | JsonDir;
};

type DirToJsonOptions = {
  trimEndsOfFiles?: boolean,
};
/**
 * Works well in conjuction with {@link https://github.com/tschaub/mock-fs}
 */
export function dirToJson(dirPath: string, options: DirToJsonOptions = {}): JsonDir {
  const trimEndOfFiles = options.trimEndsOfFiles ?? false;
  const jsonDir: JsonDir = {};
  const dirEntries = fs.readdirSync(dirPath, { withFileTypes: true });
  // Sort the entries to keep things more deterministic
  dirEntries.sort((a, b) => a.name.localeCompare(b.name, 'en'));
  for (const dirEntry of dirEntries) {
    const fileName = dirEntry.name;
    const pathName = path.join(dirPath, fileName);
    if (dirEntry.isDirectory()) {
      jsonDir[fileName] = dirToJson(pathName, options);
    } else if (dirEntry.isFile()) {
      let content = fs.readFileSync(pathName, 'utf-8');
      if (trimEndOfFiles) {
        content = content.trimEnd();
      }
      jsonDir[fileName] = content;
    }
  }
  return jsonDir;
}