// @flow
import LeafBlock from './LeafBlock';
import {
  SPACE,
  TAB,
} from '../utils/Characters';
import UnparsedLineBlock from '../UnparsedLineBlock';
import bundle from '../utils/bundle';

export default class IndentedCodeBlock extends LeafBlock {
  static isParsableAsIndentedChunk(block: ?UnparsedLineBlock) {
    if (!(block instanceof UnparsedLineBlock)) {
      return false;
    }
    const text = block.line.text;
    return (text[0] === TAB
        || (text[0] === SPACE
          && text[1] === SPACE
          && text[2] === SPACE
          && text[3] === SPACE));
  }
  static parseIndentedCodeBlocks(blocks) {
    return bundle(blocks, IndentedCodeBlock, IndentedCodeBlock.isParsableAsIndentedChunk);
  }
}
