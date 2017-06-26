import LeafBlock from './LeafBlock';
import {
  SPACE,
  HYPHEN_MINUS,
  UNDERSCORE,
  ASTERISK,
  WHITE_SPACES,
} from '../utils/Characters';
import UnparsedLine from '../UnparsedLine';

export default class ThematicBreak extends LeafBlock {
  static isThematicBreak(block) {
    if (!(block instanceof UnparsedLine)) {
      return false;
    }
    const text = block.text;
    const INDICATORS = [HYPHEN_MINUS, UNDERSCORE, ASTERISK];
    const STATE = {
      FINDING_FIRST_INDICATOR: 'FINDING_FIRST_INDICATOR',
      FINDING_DIFFERENT_INDICATOR: 'FINDING_DIFFERENT_INDICATOR',
    };
    let state = STATE.FINDING_FIRST_INDICATOR;
    let frontSpaceCount = 0;
    let indicator;
    let indicatorCount = 0;
    const isRunWell = text.split('').every((character) => {
      switch (state) {
        case STATE.FINDING_FIRST_INDICATOR:
          if (character === SPACE) {
            frontSpaceCount += 1;
            return frontSpaceCount <= 3;
          } else if (INDICATORS.includes(character)) {
            indicator = character;
            state = STATE.FINDING_DIFFERENT_INDICATOR;
            return true;
          }
          return false;
        case STATE.FINDING_DIFFERENT_INDICATOR: {
          const allowedCharacters = [...WHITE_SPACES, indicator];
          if (character === indicator) {
            indicatorCount += 1;
            return true;
          }
          return !allowedCharacters.includes(character);
        }
        default:
          throw new Error('invalid state');
      }
    });
    return isRunWell && indicatorCount >= 3;
  }
  static parseThematicBreaks(blocks) {
    return blocks.map(block => (
      ThematicBreak.isThematicBreak(block)
        ? new ThematicBreak(block)
        : block
      ));
  }
}
