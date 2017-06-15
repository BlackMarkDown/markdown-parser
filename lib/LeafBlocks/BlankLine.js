import LeafBlock from './LeafBlock';
import {
  SPACE,
  TAP,
  NEWLINE,
  CARRIAGE_RETURN,
} from '../Characters';

export default class BlankLine extends LeafBlock {
  static isBlankLine(line) {
    const allowedCharacters = [SPACE, TAP, NEWLINE, CARRIAGE_RETURN];
    for (let i = 0; i < line.length; i += 1) {
      if (!allowedCharacters.includes(line[i])) {
        return false;
      }
    }
    return true;
  }
}
