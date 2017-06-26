import LeafBlock from './LeafBlock';
import {
  SPACE,
  TAB,
} from '../utils/Characters';
import UnparsedLine from '../UnparsedLine';

export default class IndentedCodeBlock extends LeafBlock {
  static isIndentedChunk(block) {
    if (!(block instanceof UnparsedLine)) {
      return false;
    }
    const text = block.text;
    return (text[0] === TAB
        || (text[0] === SPACE
          && text[1] === SPACE
          && text[2] === SPACE
          && text[3] === SPACE));
  }
  static parseIndentedCodeBlocks(blocks) {
    const returnBlocks = [];
    let indentedCodeBlockLines = [];
    blocks.forEach((block, index) => {
      const isCurrentLineIndentedChunk = IndentedCodeBlock.isIndentedChunk(block);
      if (isCurrentLineIndentedChunk) {
        indentedCodeBlockLines.push(block);
      }
      const isLastBlock = index === blocks.length - 1;
      if ((isLastBlock || !isCurrentLineIndentedChunk) && indentedCodeBlockLines.length > 0) {
        const blockQuote = new IndentedCodeBlock(indentedCodeBlockLines);
        returnBlocks.push(blockQuote);
        indentedCodeBlockLines = [];
      }
      if (!isCurrentLineIndentedChunk) {
        returnBlocks.push(block);
      }
    });
    return returnBlocks;
  }
}
