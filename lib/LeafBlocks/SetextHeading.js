// @flow
import LeafBlock from './LeafBlock';
import {
  SPACE,
  HYPHEN_MINUS,
  EQUALS_SIGN,
  WHITE_SPACES,
} from '../utils/Characters';
import Block from '../Block';
import UnparsedLineBlock from '../UnparsedLineBlock';

export default class SetextHeading extends LeafBlock {
  static isSetextHeadingUnderline(block: ?UnparsedLineBlock): boolean {
    if (!(block instanceof UnparsedLineBlock)) {
      return false;
    }
    const text = block.line.text;
    const STATE = {
      FINDING_FIRST_INDICATOR_SEQUENCE: 'FINDING_FIRST_INDICATOR',
      FINDING_END_OF_INDICATOR_SEQUENCE: 'FINDING_LAST_INDICATOR',
      FINDING_OTHER_INDICATOR_SEQUENCE: 'FINDING_OTHER_INDICATOR_SEQUENCE',
    };
    const INDICATORS = [HYPHEN_MINUS, EQUALS_SIGN];
    let state = STATE.FINDING_FIRST_INDICATOR_SEQUENCE;
    let frontSpaceCount = 0;
    let indicator;
    let indicatorCount = 0;
    for (let i = 0; i < text.length; i += 1) {
      const character = text[i];
      switch (state) {
        case STATE.FINDING_FIRST_INDICATOR:
          if (character === SPACE) {
            frontSpaceCount += 1;
            if (frontSpaceCount > 4) {
              return false;
            }
          } else if (INDICATORS.includes(character)) {
            indicator = character;
            state = STATE.FINDING_END_OF_INDICATOR_SEQUENCE;
          } else {
            return false;
          }
          break;
        case STATE.FINDING_END_OF_INDICATOR_SEQUENCE:
          if (character === indicator) {
            indicatorCount += 1;
          } else if (WHITE_SPACES.includes(character)) {
            if (indicatorCount < 3) {
              return false;
            }
            state = STATE.FINDING_OTHER_INDICATOR_SEQUENCE;
          } else {
            return false;
          }
          break;
        case STATE.FINDING_OTHER_INDICATOR_SEQUENCE:
          if (!WHITE_SPACES.includes(character)) {
            return false;
          }
          break;
        default:
          throw new Error('invalid state');
      }
    }
    return indicatorCount >= 3;
  }
  static isSetextHeadingContentLine(block: ?UnparsedLineBlock): boolean {
    function hasAtLeastOneNonCharacter(text: string) {
      for (let i = 0; i < text.length; i += 1) {
        const character = text[i];
        if (!WHITE_SPACES.includes(character)) {
          return true;
        }
      }
      return false;
    }
    return block instanceof UnparsedLineBlock && hasAtLeastOneNonCharacter(block.line.text);
  }
  static parseSetextHeadings(blocks: Array<Block>): Array<Block> {
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
          contentLines = [];
        }
        returnBlocks.push(block);
      }
    });
    returnBlocks.push(...contentLines);
    return returnBlocks;
  }
}
