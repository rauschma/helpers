import { assertTrue } from '../ts/type.js';
import { trimEol, splitLinesExclEol } from '../js/line.js';

const RE_LINE_BREAK = /^(?<lineBreak>\r?\n)(?<indent>[ \t]*)/;
const RE_LINE = /^(?<indent>[ \t]*)(?<content>[^]*)$/;
const RE_STARTS_WITH_EOL = /^(\r?\n)/;

/**
 * @returns A string that neither starts nor ends with whitespace.
 */
export function outdent(templateStrings: TemplateStringsArray, ...substitutions: any[]) {
  const firstTmplStr = templateStrings.raw[0];
  const lineBreakMatch = RE_LINE_BREAK.exec(firstTmplStr);
  if (!lineBreakMatch || !lineBreakMatch.groups) {
    return String.raw(templateStrings, ...substitutions);
  }
  const indent = lineBreakMatch.groups.indent;
  const leadingLineBreak = lineBreakMatch.groups.lineBreak;

  const builder = new Builder(indent, templateStrings.raw.length);

  // templateStrings.length = 1 + substitutions.length
  // There is always at least one template string
  builder.visitTmplStr(firstTmplStr.slice(leadingLineBreak.length), 0);
  for (let [index, subst] of substitutions.entries()) {
    const before = templateStrings.raw[index];
    const after = templateStrings.raw[index+1];
    builder.visitSubst(before, subst, after);
    builder.visitTmplStr(after, index+1);
  }
  return builder.toString();
}

enum LinePos {
  LineStart = 'LineStart',
  AfterIndent = 'AfterIndent',
  InsideLine = 'InsideLine',
}

class Builder {
  #outdent: string;
  #tmplStrLength: number;
  #curIndent = '';
  #str = '';
  #linePos = LinePos.LineStart;

  constructor(outdent: string, tmplStrLength: number) {
    this.#outdent = outdent;
    this.#tmplStrLength = tmplStrLength;
  }
  toString() {
    return this.#str;
  }

  visitTmplStr(tmplStr: string, index: number): void {
    if (index === (this.#tmplStrLength-1)) {
      // Last template string
      tmplStr = tmplStr.trimEnd();
    }
    let pos = 0;
    while (true) {
      const eolIndex = tmplStr.indexOf('\n', pos);
      if (eolIndex < 0) {
        this.#visitFragment(tmplStr.slice(pos));
        return;
      }
      this.#visitFragment(tmplStr.slice(pos, eolIndex+1));
      this.#linePos = LinePos.LineStart; // fragment ends line
      pos = eolIndex + 1;
    }
  }
  #visitFragment(str: string) {
    if (this.#linePos === LinePos.LineStart) {
      const lineMatch = RE_LINE.exec(str);
      assertTrue(lineMatch !== null && lineMatch.groups !== undefined);
      const indent = lineMatch.groups.indent;
      if (indent.startsWith(this.#outdent)) {
        // Remove dedent from the fragment’s indent
        this.#curIndent = indent.slice(this.#outdent.length);
        this.#str += this.#curIndent;
        this.#str += lineMatch.groups.content;
      } else {
        // Unexpected indent: completely remove it
        this.#curIndent = indent;
        this.#str += lineMatch.groups.content;
      }
      if (lineMatch.groups.content.length === 0) {
        this.#linePos = LinePos.AfterIndent;
      } else {
        this.#linePos = LinePos.InsideLine;
      }
    } else {
      this.#str += str;
      this.#linePos = LinePos.InsideLine;
    }
  }

  visitSubst(_before: string, subst: any, after: string) {
    // Each `outdent` tagged template usually ends with a backtick at the
    // beginning of a (potentially indented) line. That means that even the
    // “last” line is terminated by an EOL.
    const followedByEolMatch = RE_STARTS_WITH_EOL.exec(after);
    const canInsertMultipleLines = (
      this.#linePos === LinePos.AfterIndent
      && followedByEolMatch !== null
    );
    if (canInsertMultipleLines) {
      if (Array.isArray(subst)) {
        this.#appendLines(subst, followedByEolMatch[1]);
        return;
      }
      if (typeof subst === 'string' && subst.includes('\n')) {
        this.#appendLines(splitLinesExclEol(subst), followedByEolMatch[1]);
        return;
      }
    }
    this.#str += String(subst);
    this.#linePos = LinePos.InsideLine;
  }

  #appendLines(lines: Array<unknown>, eol: string) {
    for (let [index, line] of lines.entries()) {
      if (index > 0) {
        this.#str += this.#curIndent;  
      }
      this.#str += trimEol(String(line));
      if (index < (lines.length-1)) {
        this.#str += eol;
      }
    }
    this.#linePos = LinePos.InsideLine;
  }
}
