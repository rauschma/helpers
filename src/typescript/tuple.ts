export type Repeat<
  Len extends number, Value,
  Acc extends Array<unknown> = []
> = 
  Acc['length'] extends Len
    ? Acc
    : Repeat<Len, Value, [...Acc, Value]>
;
