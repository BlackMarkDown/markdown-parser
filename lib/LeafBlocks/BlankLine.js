import ContainerBlock from '../ContainerBlocks/ContainerBlock';
import LeafBlock from './LeafBlock';
import { UNICODE_WHITE_SPACES } from '../utils/Characters';

export default class BlankLine extends LeafBlock {
  static isBlankLine(line) {
    if (line instanceof ContainerBlock) {
      return false;
    }
    if (line instanceof LeafBlock) {
      return line instanceof BlankLine;
    }
    const allowedCharacters = UNICODE_WHITE_SPACES;
    for (let i = 0; i < line.length; i += 1) {
      if (!allowedCharacters.includes(line[i])) {
        return false;
      }
    }
    return true;
  }
  static parseBlankLines(lines) {
    return lines.map((line) => {
      if (BlankLine.isBlankLine(line)) {
        return new BlankLine(line);
      }
      return line;
    });
  }
}
