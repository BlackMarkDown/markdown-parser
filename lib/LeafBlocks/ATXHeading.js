import LeafBlock from './LeafBlock';
import {
  SPACE,
  NUMBER_SIGN,
  WHITE_SPACES,
} from '../utils/Characters';
import UnparsedLineBlock from '../UnparsedLineBlock';

const MAX_NUMBER_SIGN_COUNT = 6;

export default class ATXHeading extends LeafBlock {
  static isParsableAsATXHeading(block) {
    if (!(block instanceof UnparsedLineBlock)) {
      return false;
    }
    const text = block.line.text;
    const STATE = {
      FINDING_FIRST_NUMBER_SIGN: 'FINDING_FIRST_NUMBER_SIGN',
      FINDING_LAST_NUMBER_SIGN: 'FINDING_LAST_NUMBER_SIGN',
    };
    let state = STATE.FINDING_FIRST_NUMBER_SIGN;
    let numberSignCount = 0;
    for (let i = 0; i < text.length; i += 1) {
      const character = text[i];
      switch (state) {
        case STATE.FINDING_FIRST_NUMBER_SIGN:
          switch (character) {
            case NUMBER_SIGN:
              state = STATE.FINDING_LAST_NUMBER_SIGN;
              numberSignCount = 1;
              break;
            case SPACE:
              if (i > 2) {
                return false;
              }
              break;
            default:
              return false;
          }
          break;
        case STATE.FINDING_LAST_NUMBER_SIGN:
          if (character === NUMBER_SIGN) {
            numberSignCount += 1;
            if (numberSignCount > MAX_NUMBER_SIGN_COUNT) {
              return false;
            }
          } else {
            return WHITE_SPACES.includes(character);
          }
          break;
        default:
          throw new Error('invalid state');
      }
    }
    return numberSignCount > 0;
  }
  static parseATXHeadings(blocks) {
    return blocks.map(block =>
      (ATXHeading.isParsableAsATXHeading(block)
        ? new ATXHeading(block)
        : block));
  }
}
