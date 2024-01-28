import * as url from 'node:url';

export function isEntryModule(importMeta: ImportMeta): boolean {
  // url.fileURLToPath() throws if the protocol isn’t `file:`
  if (importMeta.url.startsWith('file:')) {
    const modulePath = url.fileURLToPath(importMeta.url);
    if (process.argv[1] === modulePath) {
      return true;
    }
  }
  return false;
  // In the future, this code can be simplified via import.meta.filename
  // https://nodejs.org/api/esm.html#importmetafilename
}