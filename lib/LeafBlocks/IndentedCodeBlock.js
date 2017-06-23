import LeafBlock from './LeafBlock';
import {
  SPACE,
  TAB,
} from '../utils/Characters';

export default class IndentedCodeBlock extends LeafBlock {
  static isIndentedChunk(line) {
    return typeof line === 'string' &&
      (line[0] === TAB
        || (line[0] === SPACE
          && line[1] === SPACE
          && line[2] === SPACE
          && line[3] === SPACE));
  }
  static parseIndentedCodeBlocks(lines) {
    const returnLines = [];
    let indentedCodeBlockLines = [];
    lines.forEach((line, index) => {
      const isCurrentLineIndentedChunk = IndentedCodeBlock.isIndentedChunk(line);
      if (isCurrentLineIndentedChunk) {
        indentedCodeBlockLines.push(line);
      }
      const isLastLine = index === lines.length - 1;
      if ((isLastLine || !isCurrentLineIndentedChunk) && indentedCodeBlockLines.length > 0) {
        const text = indentedCodeBlockLines.join('');
        const blockQuote = new IndentedCodeBlock(text);
        returnLines.push(blockQuote);
        indentedCodeBlockLines = [];
      }
      if (!isCurrentLineIndentedChunk) {
        returnLines.push(line);
      }
    });
    return returnLines;
  }
}
