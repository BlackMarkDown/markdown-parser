// @flow
import LeafBlock from './LeafBlock';
import {
  SPACE,
  HYPHEN_MINUS,
  UNDERSCORE,
  ASTERISK,
  WHITE_SPACES,
} from '../utils/Characters';
import UnparsedLineBlock from '../UnparsedLineBlock';

const INDICATORS = [HYPHEN_MINUS, UNDERSCORE, ASTERISK];

export default class ThematicBreak extends LeafBlock {
  static isThematicBreak(block: ?UnparsedLineBlock) {
    if (!(block instanceof UnparsedLineBlock)) {
      return false;
    }
    const text = block.line.text;
    const STATE = {
      FINDING_FIRST_INDICATOR: 'FINDING_FIRST_INDICATOR',
      FINDING_DIFFERENT_INDICATOR: 'FINDING_DIFFERENT_INDICATOR',
    };
    let state = STATE.FINDING_FIRST_INDICATOR;
    let frontSpaceCount = 0;
    let indicator;
    let indicatorCount = 0;
    for (let i = 0; i < text.length; i += 1) {
      const character = text[i];
      switch (state) {
        case STATE.FINDING_FIRST_INDICATOR:
          if (character === SPACE) {
            frontSpaceCount += 1;
            if (frontSpaceCount > 3) {
              return false;
            }
          } else if (INDICATORS.includes(character)) {
            indicator = character;
            state = STATE.FINDING_DIFFERENT_INDICATOR;
          } else {
            return false;
          }
          break;
        case STATE.FINDING_DIFFERENT_INDICATOR:
          if (character === indicator) {
            indicatorCount += 1;
          } else if (!WHITE_SPACES.includes(character)) {
            return false;
          }
          break;
        default:
          throw new Error('invalid state');
      }
    }
    return indicatorCount >= 3;
  }
  static parseThematicBreaks(blocks) {
    return blocks.map(block => (
      ThematicBreak.isThematicBreak(block)
        ? new ThematicBreak(block)
        : block
      ));
  }
}
