import LeafBlock from './LeafBlock';
import { UNICODE_WHITE_SPACES } from '../utils/Characters';
import UnparsedLine from '../UnparsedLine';

export default class BlankLine extends LeafBlock {
  static isBlankLine(block) {
    if (block instanceof LeafBlock) {
      return block instanceof BlankLine;
    }
    if (!(block instanceof UnparsedLine)) {
      return false;
    }
    const text = block.text;
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
      (BlankLine.isBlankLine(block)
        ? new BlankLine(block)
        : block));
  }
}
