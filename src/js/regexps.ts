export enum MatchMode {
  AtLastIndex = 'AtLastIndex',
  AtLastIndexOrLater = 'AtLastIndexOrLater',
}

export function setLastIndex(matchMode: MatchMode, regExp: RegExp, lastIndex: number): RegExp {
  switch (matchMode) {
    case MatchMode.AtLastIndex:
      if (!regExp.sticky) {
        throw new TypeError(`If flag /y is not set, matching ${matchMode} won’t work: ${regExp}`);
      }
      break;
    case MatchMode.AtLastIndexOrLater:
      if (!regExp.global) {
        throw new TypeError(`If flag /g is not set, matching ${matchMode} won’t work: ${regExp}`);
      }
      if (regExp.sticky) {
        throw new TypeError(`If flag /y is set, matching ${matchMode} won’t work: ${regExp}`);
      }
      break;
  }
  regExp.lastIndex = lastIndex;
  return regExp;
}

// export function execAt(regExp: RegExp, str: string, index: number): RegExpExecArray | null {
//   if (!regExp.flags.includes('g')) {
//     throw new Error('regExp must include flag /g: ' + regExp);
//   }
//   regExp.lastIndex = index;
//   return regExp.exec(str);
// }

export function escapeForRegExp(str: string) {
  return str.replace(/[\\^$.*+?()[\]{}|]/g, '\\$&');
}