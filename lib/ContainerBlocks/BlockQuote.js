// @flow
import ContainerBlock from './ContainerBlock';
import {
  SPACE,
  GREATER_THAN_SIGN,
} from '../utils/Characters';
import parseLines from '../parseLines';
import type Line from '../Line';
import type Block from '../Block';

function isParsableAsBlockQuote(line: Line) {
  const text = line.text;
  // I know, I know, but it's funny. :D
  return text[0] === GREATER_THAN_SIGN
    || (text[0] === SPACE && text[1] === GREATER_THAN_SIGN)
    || (text[0] === SPACE && text[1] === SPACE && text[2] === GREATER_THAN_SIGN)
    || (text[0] === SPACE && text[1] === SPACE
      && text[2] === SPACE && text[3] === GREATER_THAN_SIGN);
}

function shiftLines(lines: Line[]): Line[] {
  return lines;
}

export default class BlockQuote extends ContainerBlock {
  static parseBlockQuotes(lines: Line[], next: (Line[]) => Block[]): Block[] {
    const openingIndex = lines.findIndex(line => isParsableAsBlockQuote(line));
    if (openingIndex === -1) {
      return next(lines);
    }
    let closingIndex = openingIndex;
    while (closingIndex + 1 < lines.length
    && isParsableAsBlockQuote(lines[closingIndex + 1])) {
      closingIndex += 1;
    }

    return [
      ...next(lines.slice(0, openingIndex)),
      new BlockQuote(parseLines(shiftLines(lines.slice(openingIndex, closingIndex + 1)))),
      ...BlockQuote.parseBlockQuotes(lines.slice(closingIndex + 1), next),
    ];
  }
}
