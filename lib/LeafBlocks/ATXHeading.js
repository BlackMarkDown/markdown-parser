import LeafBlock from './LeafBlock';
import {
  SPACE,
  NUMBER_SIGN,
  WHITE_SPACES,
} from '../utils/Characters';
import UnparsedLine from '../UnparsedLine';

export default class ATXHeading extends LeafBlock {
  static isATXHeading(block) {
    if (!(block instanceof UnparsedLine)) {
      return false;
    }
    const text = block.text;
    const STATE = {
      FINDING_FIRST_NUMBER_SIGN: 'FINDING_FIRST_NUMBER_SIGN',
      FINDING_LAST_NUMBER_SIGN: 'FINDING_LAST_NUMBER_SIGN',
    };
    let currentIndex = 0;
    let state = STATE.FINDING_FIRST_NUMBER_SIGN;
    let numberSignCounts = 0;
    while (currentIndex < text.length) {
      const currentCharacter = text[currentIndex];
      switch (state) {
        case STATE.FINDING_FIRST_NUMBER_SIGN:
          switch (currentCharacter) {
            case NUMBER_SIGN:
              state = STATE.FINDING_LAST_NUMBER_SIGN;
              numberSignCounts = 1;
              break;
            case SPACE:
              if (currentIndex > 2) {
                return false;
              }
              break;
            default:
              return false;
          }
          break;
        case STATE.FINDING_LAST_NUMBER_SIGN:
          if (currentCharacter === NUMBER_SIGN) {
            numberSignCounts += 1;
            if (numberSignCounts > 6) {
              return false;
            }
          } else {
            return WHITE_SPACES.includes(currentCharacter);
          }
          break;
        default:
          throw new Error('invalid state');
      }
      currentIndex += 1;
    }
    return numberSignCounts > 0;
  }
  static parseATXHeadings(blocks) {
    return blocks.map(block =>
      (ATXHeading.isATXHeading(block)
        ? new ATXHeading(block)
        : block));
  }
}
