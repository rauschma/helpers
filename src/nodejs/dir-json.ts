import * as fs from 'node:fs';
import * as path from 'node:path';
import { clearDirectorySync, ensureParentDirectory } from './file.js';

export type DirJson = {
  [key: string]: string | DirJson;
};
type DirToJsonOptions = {
  trimEndsOfFiles?: boolean,
};
export function dirToJson(dirPath: string, options: DirToJsonOptions = {}): DirJson {
  const trimEndOfFiles = options.trimEndsOfFiles ?? false;
  const dirJson: DirJson = {};
  const dirEntries = fs.readdirSync(dirPath, { withFileTypes: true });
  // Sort the entries to keep things more deterministic
  dirEntries.sort((a, b) => a.name.localeCompare(b.name, 'en'));
  for (const dirEntry of dirEntries) {
    const fileName = dirEntry.name;
    const pathName = path.join(dirPath, fileName);
    if (dirEntry.isDirectory()) {
      dirJson[fileName] = dirToJson(pathName, options);
    } else if (dirEntry.isFile()) {
      let content = fs.readFileSync(pathName, 'utf-8');
      if (trimEndOfFiles) {
        content = content.trimEnd();
      }
      dirJson[fileName] = content;
    }
  }
  return dirJson;
}

/**
 * Be very careful! You will occasionally forget to set up a testing file
 * system. Thus, use global directories such as `/tmp/my-test-dir/`.
 */
export function jsonToCleanDir(dirJson: DirJson): void {
  jsonToDir(dirJson, true);
}

export function jsonToDir(dirJson: DirJson, cleanDir = false): void {
  for (const [rootDirPath, rootDirJson] of Object.entries(dirJson)) {
    if (typeof rootDirJson === 'string') {
      // File
      ensureParentDirectory(rootDirPath);
      fs.writeFileSync(rootDirPath, rootDirJson, 'utf-8');
    } else {
      // Directory
      if (!path.isAbsolute(rootDirPath)) {
        throw new Error('Root directories must be absolute: ' + rootDirPath);
      }
      if (cleanDir && fs.existsSync(rootDirPath)) {
        clearDirectorySync(rootDirPath);
      }
      fs.mkdirSync(rootDirPath, {recursive: true});
      createDirRec(rootDirPath, rootDirJson);
    }
  }
  function createDirRec(parentAbsPath: string, childrenJson: DirJson) {
    for (const [childRelPath, childJson] of Object.entries(childrenJson)) {
      if (path.isAbsolute(childRelPath)) {
        throw new Error('Child directories must be relative: ' + childRelPath);
      }
      const childAbsPath = path.join(parentAbsPath, childRelPath);
      if (typeof childJson === 'string') {
        // File
        ensureParentDirectory(childAbsPath);
        fs.writeFileSync(childAbsPath, childJson, 'utf-8');
      } else {
        // Directory
        fs.mkdirSync(childAbsPath, {recursive: true});
        createDirRec(childAbsPath, childJson);
      }
    }
  }
}