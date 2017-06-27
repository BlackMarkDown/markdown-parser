// @flow
import LeafBlock from './LeafBlock';
import {
  SPACE,
  TAB,
} from '../utils/Characters';
import type Block from '../Block';
import type Line from '../Line';

function isParsableAsIndentedChunk(line: Line) {
  const text = line.text;
  return (text[0] === TAB
      || (text[0] === SPACE
        && text[1] === SPACE
        && text[2] === SPACE
        && text[3] === SPACE));
}
export default class IndentedCodeBlock extends LeafBlock {
  static parseIndentedCodeBlocks(lines: Line[], next: (Line[]) => Block[]): Block[] {
    const openingIndex = lines.findIndex(line => isParsableAsIndentedChunk(line));
    if (openingIndex === -1) {
      return next(lines);
    }
    let closingIndex = openingIndex;
    while (closingIndex + 1 < lines.length
    && isParsableAsIndentedChunk(lines[closingIndex + 1])) {
      closingIndex += 1;
    }

    return [
      ...next(lines.slice(0, openingIndex)),
      new IndentedCodeBlock(lines.slice(openingIndex, closingIndex + 1)),
      ...IndentedCodeBlock.parseIndentedCodeBlocks(lines.slice(closingIndex + 1), next),
    ];
  }
}
