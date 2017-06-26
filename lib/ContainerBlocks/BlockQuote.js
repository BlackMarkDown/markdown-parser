// @flow
import ContainerBlock from './ContainerBlock';
import {
  SPACE,
  GREATER_THAN_SIGN,
} from '../utils/Characters';
import UnparsedLineBlock from '../UnparsedLineBlock';
import bundle from '../utils/bundle';

export default class BlockQuote extends ContainerBlock {
  static isParsableAsBlockQuote(block: ?UnparsedLineBlock) {
    if (!(block instanceof UnparsedLineBlock)) {
      return false;
    }
    const text = block.line.text;
    // I know, I know, but it's funny. :D
    return text[0] === GREATER_THAN_SIGN
      || (text[0] === SPACE && text[1] === GREATER_THAN_SIGN)
      || (text[0] === SPACE && text[1] === SPACE && text[2] === GREATER_THAN_SIGN)
      || (text[0] === SPACE && text[1] === SPACE
        && text[2] === SPACE && text[3] === GREATER_THAN_SIGN);
  }
  static parseBlockQuotes(blocks) {
    return bundle(blocks, BlockQuote, BlockQuote.isParsableAsBlockQuote);
  }
}
