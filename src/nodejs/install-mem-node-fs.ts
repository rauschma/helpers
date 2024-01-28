import { fs as mfs } from 'memfs';
import quibble from 'quibble';
await quibble.esm('node:fs', mfs);

export {mfs};