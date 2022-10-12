/**
 * @see https://en.wikipedia.org/wiki/ANSI_escape_code#SGR_(Select_Graphic_Rendition)_parameters
 */
const ansiConstants = {
  
  //----- Attributes -----

  Normal: 0,
  Bold: 1,
  Faint: 2,
  Italic: 2,
  Underline: 4,
  Blink: 5,
  Reverse: 7,
  Conceal: 8,
  CrossedOut: 9,
  DoublyUnderlined: 21,

  //----- Foreground colors -----

  FgBlack: 30,
  FgRed: 31,
  FgGreen: 32,
  FgYellow: 33,
  FgBlue: 34,
  FgMagenta: 35,
  FgCyan: 36,
  FgWhite: 37,
  /** Gray */
  FgBrightBlack: 90,
  FgBrightRed: 91,
  FgBrightGreen: 92,
  FgBrightYellow: 93,
  FgBrightBlue: 94,
  FgBrightMagenta: 95,
  FgBrightCyan: 96,
  FgBrightWhite: 97,
  
  //----- Background colors -----

  BgBlack: 40,
  BgRed: 41,
  BgGreen: 42,
  BgYellow: 43,
  BgBlue: 44,
  BgMagenta: 45,
  BgCyan: 46,
  BgWhite: 47,
  /** Gray */
  BgBrightBlack: 100,
  BgBrightRed: 101,
  BgBrightGreen: 102,
  BgBrightYellow: 103,
  BgBrightBlue: 104,
  BgBrightMagenta: 105,
  BgBrightCyan: 106,
  BgBrightWhite: 107,
};

type AnsiProto = {
  [key in keyof (typeof ansiConstants)]: Ansi
};
type AnsiInst = AnsiProto & { _params: Array<number> };
type TmplFunc = (templateStrings: TemplateStringsArray, ...substitutions: unknown[]) => string;

type Ansi = AnsiInst & TmplFunc;

const ansiProto = {} as AnsiProto;
{
  for (const [name, param] of Object.entries(ansiConstants)) {
    Object.defineProperty(
      ansiProto, name,
      { // property descriptor
        get(this: Ansi) {
          return createAnsi([...this._params, param]);
        },
      }
    );
  }
}

function createAnsi(params: Array<number>): Ansi {
  const func = ((templateStrings: TemplateStringsArray, ...substitutions: unknown[]): string => {
    let text = '';
    text += templateStrings[0];
    for (const [index, subst] of substitutions.entries()) {
      text += String(subst);
      text += templateStrings[index + 1];
    }
    return `\x1B[${func._params.join(';')}m${text}\x1B[0m`;
  }) as any as Ansi;
  func._params = params;
  return Object.setPrototypeOf(func, ansiProto);
}

/**
 * ```js
 * console.log(`This is ${ansi.Bold.FgRed`bold`} and ${ansi.Underline.FgGreen`underlined`} text`);
 * ```
 */
export const ansi = createAnsi([]);
