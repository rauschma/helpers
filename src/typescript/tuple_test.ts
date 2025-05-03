import type { Assert, Equal } from 'asserttt';
import type { Repeat } from './tuple.js';

type _ = [
  Assert<Equal<
    Repeat<0, string>,
    []
  >>,
  Assert<Equal<
    Repeat<1, string>,
    [string]
  >>,
  Assert<Equal<
    Repeat<3, '*'>,
    ['*', '*', '*']
  >>,
];
