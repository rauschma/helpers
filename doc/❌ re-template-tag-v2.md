# re-template-tag v2

* https://github.com/rauschma/re-template-tag

## Todos

* Complain if there are flags
  * Future: allow and turn them into pattern modifiers. https://github.com/tc39/proposal-regexp-modifiers

## How to migrate to a built-in `/x` flag?

RegExp extended mode: https://github.com/tc39/proposal-regexp-x-mode

* Use template tag `rex` with flag `/x` (which is removed by `rex`)
  * Switch to `re` once flag `/x` is built in

## Minor Features

* Substituted RegExp flags are deduplicated

## FAQ: Why this syntax for flags?

– One option: ``re`[ABC]`('ig')``
– Another option: ``` re`[ABC]``ig` ```

However, this is still my favorite (suggested by @mathias a long time ago):

```js
re`/[ABC]/ig`
```

Less “clever” but several advantages:

* Easy to understand
* Contents easy to turn into a RegExp literal
* Fewer characters

If there are backslash + flags at the end, there must also be a backslash at the beginning. It’s easier to go flagless that way (both slashes are omitted).
