import ContainerBlock from './ContainerBlock';
import {
  SPACE,
  GREATER_THAN_SIGN,
} from '../utils/Characters';
import UnparsedLine from '../UnparsedLine';

export default class BlockQuote extends ContainerBlock {
  static isParsableAsBlockQuote(block) {
    if (!(block instanceof UnparsedLine)) {
      return false;
    }
    const text = block.text;
    // I know, I know, but it's funny. :D
    return text[0] === GREATER_THAN_SIGN
      || (text[0] === SPACE && text[1] === GREATER_THAN_SIGN)
      || (text[0] === SPACE && text[1] === SPACE && text[2] === GREATER_THAN_SIGN)
      || (text[0] === SPACE && text[1] === SPACE
        && text[2] === SPACE && text[3] === GREATER_THAN_SIGN);
  }
  static parseBlockQuotes(blocks) {
    const returnBlocks = [];
    let contentBlocks = [];
    blocks.forEach((block, index) => {
      const isParsableAsBlockQuote = BlockQuote.isParsableAsBlockQuote(block);
      if (isParsableAsBlockQuote) {
        contentBlocks.push(block);
      }
      const isLastBlock = index === blocks.length - 1;
      if ((isLastBlock || !isParsableAsBlockQuote) && contentBlocks.length > 0) {
        const blockQuote = new BlockQuote(contentBlocks);
        returnBlocks.push(blockQuote);
        contentBlocks = [];
      }
      if (!isParsableAsBlockQuote) {
        returnBlocks.push(block);
      }
    });
    return returnBlocks;
  }
}
