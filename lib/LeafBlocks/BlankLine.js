import LeafBlock from './LeafBlock';
import { UNICODE_WHITE_SPACES } from '../utils/Characters';
import UnparsedLineBlock from '../UnparsedLineBlock';

export default class BlankLine extends LeafBlock {
  static isParsableAsBlankLine(block) {
    if (!(block instanceof UnparsedLineBlock)) {
      return false;
    }
    const text = block.line.text;
    const allowedCharacters = UNICODE_WHITE_SPACES;
    for (let i = 0; i < text.length; i += 1) {
      if (!allowedCharacters.includes(text[i])) {
        return false;
      }
    }
    return true;
  }
  static parseBlankLines(blocks) {
    return blocks.map(block =>
      (BlankLine.isParsableAsBlankLine(block)
        ? new BlankLine(block)
        : block));
  }
}
