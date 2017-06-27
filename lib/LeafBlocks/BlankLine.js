// @flow
import LeafBlock from './LeafBlock';
import { UNICODE_WHITE_SPACES } from '../utils/Characters';
import type Block from '../Block';
import type Line from '../Line';

function isParsableAsBlankLine(line: Line): boolean {
  const text = line.text;
  const allowedCharacters = UNICODE_WHITE_SPACES;
  for (let i = 0; i < text.length; i += 1) {
    if (!allowedCharacters.includes(text[i])) {
      return false;
    }
  }
  return true;
}

export default class BlankLine extends LeafBlock {
  static parseBlankLines(lines: Line[], next: (Line[]) => Block[]): Block[] {
    const index = lines.findIndex(line => isParsableAsBlankLine(line));
    if (index === -1) {
      return next(lines);
    }
    return [
      ...next(lines.slice(0, index)),
      new BlankLine(lines.slice(index, 1)),
      ...BlankLine.parseBlankLines(lines.slice(index + 1), next),
    ];
  }
}
