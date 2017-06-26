import LeafBlock from './LeafBlock';
import ThematicBreak from './ThematicBreak';
import {
  SPACE,
  HYPHEN_MINUS,
  EQUALS_SIGN,
  WHITE_SPACES,
} from '../utils/Characters';
import UnparsedLine from '../UnparsedLine';

export default class SetextHeading extends LeafBlock {
  static isSetextHeadingUnderline(block) {
    if (!(block instanceof ThematicBreak) && !(block instanceof UnparsedLine)) {
      return false;
    }
    const text = block.text;
    const STATE = {
      FINDING_FIRST_INDICATOR_SEQUENCE: 'FINDING_FIRST_INDICATOR',
      FINDING_END_OF_INDICATOR_SEQUENCE: 'FINDING_LAST_INDICATOR',
      FINDING_OTHER_INDICATOR_SEQUENCE: 'FINDING_OTHER_INDICATOR_SEQUENCE',
    };
    const INDICATORS = [HYPHEN_MINUS, EQUALS_SIGN];
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
        case STATE.FINDING_END_OF_INDICATOR_SEQUENCE:
          if (character === indicator) {
            indicatorCount += 1;
            return true;
          }
          if (WHITE_SPACES.includes(character)) {
            if (indicatorCount < 3) {
              return false;
            }
            state = STATE.FINDING_OTHER_INDICATOR_SEQUENCE;
            return true;
          }
          return false;
        case STATE.FINDING_OTHER_INDICATOR_SEQUENCE:
          return WHITE_SPACES.includes(character);
        default:
          throw new Error('invalid state');
      }
    });
    if (!isRunWell) {
      return false;
    }
    switch (state) {
      case STATE.FINDING_FIRST_INDICATOR:
        return false;
      case STATE.FINDING_END_OF_INDICATOR_SEQUENCE:
        return indicatorCount >= 3;
      case STATE.FINDING_OTHER_INDICATOR_SEQUENCE:
        return true;
      default:
        throw new Error('invalid state');
    }
  }
  static isSetextHeadingContentLine(block) {
    function hasAtLeastOneNonCharacter(text) {
      for (let i = 0; i < text.length; i += 1) {
        const character = text[i];
        if (!WHITE_SPACES.includes(character)) {
          return true;
        }
      }
      return false;
    }
    return block instanceof UnparsedLine && hasAtLeastOneNonCharacter(block.text);
  }
  static parseSetextHeadings(blocks) {
    const returnBlocks = [];
    let contentLines = [];
    blocks.forEach((block) => {
      if (contentLines.length > 0 && SetextHeading.isSetextHeadingUnderline(block)) {
        const setextHeading = new SetextHeading([...contentLines, block]);
        returnBlocks.push(setextHeading);
        contentLines = [];
      } else if (SetextHeading.isSetextHeadingContentLine(block)) {
        contentLines.push(block);
      } else {
        if (contentLines.length > 0) {
          returnBlocks.push(...contentLines);
        }
        returnBlocks.push(block);
      }
    });
    returnBlocks.push(...contentLines);
    return returnBlocks;
  }
}
