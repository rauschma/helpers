// The actual API is documented at the end of this file

/**
 * @see https://en.wikipedia.org/wiki/ANSI_escape_code#SGR_(Select_Graphic_Rendition)_parameters
 */
class TextStyle extends Function {

  //----- Attributes -----

  get Normal(): TextStyleResult { return this._newFunc(0) }
  get Bold(): TextStyleResult { return this._newFunc(1) }
  get Faint(): TextStyleResult { return this._newFunc(2) }
  get Italic(): TextStyleResult { return this._newFunc(2) }
  get Underline(): TextStyleResult { return this._newFunc(4) }
  get Blink(): TextStyleResult { return this._newFunc(5) }
  get Reverse(): TextStyleResult { return this._newFunc(7) }
  get Conceal(): TextStyleResult { return this._newFunc(8) }
  get CrossedOut(): TextStyleResult { return this._newFunc(9) }
  get DoublyUnderlined(): TextStyleResult { return this._newFunc(21) }

  //----- Foreground colors -----

  get FgBlack(): TextStyleResult { return this._newFunc(30) }
  get FgRed(): TextStyleResult { return this._newFunc(31) }
  get FgGreen(): TextStyleResult { return this._newFunc(32) }
  get FgYellow(): TextStyleResult { return this._newFunc(33) }
  get FgBlue(): TextStyleResult { return this._newFunc(34) }
  get FgMagenta(): TextStyleResult { return this._newFunc(35) }
  get FgCyan(): TextStyleResult { return this._newFunc(36) }
  get FgWhite(): TextStyleResult { return this._newFunc(37) }

  FgColorCode(code: number): TextStyleResult { return this._newFunc(38, 5, code) }

  /** Gray */
  get FgBrightBlack(): TextStyleResult { return this._newFunc(90) }
  get FgBrightRed(): TextStyleResult { return this._newFunc(91) }
  get FgBrightGreen(): TextStyleResult { return this._newFunc(92) }
  get FgBrightYellow(): TextStyleResult { return this._newFunc(93) }
  get FgBrightBlue(): TextStyleResult { return this._newFunc(94) }
  get FgBrightMagenta(): TextStyleResult { return this._newFunc(95) }
  get FgBrightCyan(): TextStyleResult { return this._newFunc(96) }
  get FgBrightWhite(): TextStyleResult { return this._newFunc(97) }

  //----- Background colors -----

  get BgBlack(): TextStyleResult { return this._newFunc(40) }
  get BgRed(): TextStyleResult { return this._newFunc(41) }
  get BgGreen(): TextStyleResult { return this._newFunc(42) }
  get BgYellow(): TextStyleResult { return this._newFunc(43) }
  get BgBlue(): TextStyleResult { return this._newFunc(44) }
  get BgMagenta(): TextStyleResult { return this._newFunc(45) }
  get BgCyan(): TextStyleResult { return this._newFunc(46) }
  get BgWhite(): TextStyleResult { return this._newFunc(47) }

  BgColorCode(code: number): TextStyleResult { return this._newFunc(48, 5, code) }

  /** Gray */
  get BgBrightBlack(): TextStyleResult { return this._newFunc(100) }
  get BgBrightRed(): TextStyleResult { return this._newFunc(101) }
  get BgBrightGreen(): TextStyleResult { return this._newFunc(102) }
  get BgBrightYellow(): TextStyleResult { return this._newFunc(103) }
  get BgBrightBlue(): TextStyleResult { return this._newFunc(104) }
  get BgBrightMagenta(): TextStyleResult { return this._newFunc(105) }
  get BgBrightCyan(): TextStyleResult { return this._newFunc(106) }
  get BgBrightWhite(): TextStyleResult { return this._newFunc(107) }

  //----- API management -----

  private _params = new Array<number>();

  /**
   * Returns a function that is both:
   * 1. An instance of `TextStyle` (which is a factory for more `TextStyleResult`
   *    values)
   * 2. A hybrid of a template tag function and a normal function
   */
  private _newFunc(...nums: Array<number>): TextStyleResult {
    const func = ((templateStrings: string | TemplateStringsArray, ...substitutions: unknown[]): string => {
      let text;
      if (typeof templateStrings === 'string') {
        text = templateStrings;
      } else {
        text = templateStrings[0];
        for (const [index, subst] of substitutions.entries()) {
          text += String(subst);
          text += templateStrings[index + 1];
        }
      }
      return setAttrs(...func._params) + text + setAttrs(0);
    }) as TextStyleResult; // (2)
    func._params = [...this._params, ...nums];
    Object.setPrototypeOf(func, TextStyle.prototype); // (1)
    return func;
  }
}

function setAttrs(...attrs: Array<number>) {
  return `\x1B[` + attrs.join(';') + `m`;
}

export type TextStyleResult = TextStyle & TmplFunc;

type TmplFunc = (templateStrings: string | TemplateStringsArray, ...substitutions: unknown[]) => string;

/**
 * ```js
 * console.log(style.Underline.FgGreen`underlined green`);
 * console.log(style.FgColorCode(51)`turquoise`);
 * console.log(style.Bold('bold'));
 * ```
 * You can set up the template tag dynamically:
 * ```js
 * let style;
 * if (success) {
 *   style = style.FgGreen.Bold;
 * } else {
 *   style = style.FgRed.Bold;
 * }
 * console.log(style`We are finished`);
 * ```
 */
export const style = new TextStyle();
