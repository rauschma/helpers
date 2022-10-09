import { assertTrue } from "../ts/types.js";
import { splitLinesInclEol } from "./lines.js";

const RE_LINE_BREAK = /^(?<lineBreak>\r?\n)(?<indent>[ \t]*)/;
const RE_LINE = /^(?<indent>[ \t]*)(?<content>[^]*)$/;

export function outdent(templateStrings: TemplateStringsArray, ...substitutions: any[]) {
  const lineBreakMatch = RE_LINE_BREAK.exec(templateStrings.raw[0]);
  if (!lineBreakMatch || !lineBreakMatch.groups) {
    return String.raw(templateStrings, ...substitutions);
  }
  const indent = lineBreakMatch.groups.indent;
  const leadingLineBreak = lineBreakMatch.groups.lineBreak;

  const builder = new Builder(indent);
  for (let [index, tmplStr] of templateStrings.entries()) {
    if (index > 0) {
      builder.visitSubst(substitutions[index-1]);
    }
    if (index === 0) {
      tmplStr = tmplStr.slice(leadingLineBreak.length);
    }
    if (index === (templateStrings.length-1)) {
      tmplStr = tmplStr.trimEnd();
    }
    builder.visitStr(tmplStr);
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
  #curIndent = '';
  #str = '';
  #linePos = LinePos.LineStart;

  constructor(outdent: string) {
    this.#outdent = outdent;
  }
  toString() {
    return this.#str;
  }

  visitStr(str: string): void {
    let pos = 0;
    while (true) {
      const eolIndex = str.indexOf('\n', pos);
      if (eolIndex < 0) {
        this.#visitFragment(str.slice(pos));
        return;
      }
      this.#visitFragment(str.slice(pos, eolIndex+1));
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

  visitSubst(subst: any) {
    if (typeof subst === 'string') {
      if (subst.includes('\n') && this.#linePos === LinePos.AfterIndent) {
        for (const [index, line] of splitLinesInclEol(subst.trimEnd()).entries()) {
          if (index > 0) {
            this.#str += this.#curIndent;  
          }
          this.#str += line;
        }
        this.#linePos = LinePos.InsideLine;
        return;
      }
    }
    this.#str += String(subst);
    this.#linePos = LinePos.InsideLine;
  }
}
