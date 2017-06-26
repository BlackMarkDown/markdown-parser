import LeafBlock from './LeafBlock';
import {
  SPACE,
  BACKTICK,
  TILDE,
  WHITE_SPACES,
} from '../utils/Characters';
import UnparsedLine from '../UnparsedLine';

const INDICATORS = [BACKTICK, TILDE];

export default class FencedCodeBlock extends LeafBlock {
  static isOpeningCodeFence(block) {
    if (!(block instanceof UnparsedLine)) {
      return false;
    }
    const text = block.text;
    const STATE = {
      FINDING_FIRST_INDICATOR: 'FINDING_FIRST_INDICATOR',
      COUNTING_INDICATORS: 'COUNTING_INDICATORS',
      FINDING_REMAINING_INDICATORS: 'FINDING_REMAINING_INDICATORS',
    };
    let state = STATE.FINDING_FIRST_INDICATOR;
    let indicator;
    let indicatorCount = 0;
    const isRunWell = text.split('').every((character, index) => {
      switch (state) {
        case STATE.FINDING_FIRST_INDICATOR:
          if (character === SPACE && index < 3) {
            return true;
          }
          if (INDICATORS.includes(character)) {
            indicator = character;
            state = STATE.COUNTING_INDICATORS;
            return true;
          }
          return false;
        case STATE.COUNTING_INDICATORS:
          if (character === indicator) {
            indicatorCount += 1;
            return true;
          }
          if (indicatorCount < 3) {
            return false;
          }
          state = STATE.FINDING_REMAINING_INDICATORS;
          return true;
        case STATE.FINDING_REMAINING_INDICATORS:
          return character !== indicator;
        default:
          throw new Error('invalid state');
      }
    });
    return isRunWell && indicatorCount >= 3;
  }
  static getIndicator(unparsedLine) {
    // NOTE Assume isOpeningCodeFence(unparsedLine) === true
    const text = unparsedLine.text;
    for (let i = 0; i < text.length; i += 1) {
      const character = text[i];
      if (INDICATORS.includes(character)) {
        return character;
      }
    }
    throw new Error('unparsed line must contain indicator');
  }
  static getIndicatorCount(unparsedLine, indicator) {
    // NOTE Assume isOpeningCodeFence(unparsedLine) === true
    const text = unparsedLine.text;
    let count = 0;
    for (let i = 0; i < text.length; i += 1) {
      const character = text[i];
      if (character === indicator) {
        count += 1;
      }
    }
    return count;
  }
  static isClosingCodeFence(block, indicator, openingIndicatorCount) {
    if (!(block instanceof UnparsedLine)) {
      return false;
    }
    const text = block.text;
    const STATE = {
      FINDING_FIRST_INDICATOR: 'FINDING_FIRST_INDICATOR',
      COUNTING_INDICATORS: 'COUNTING_INDICATORS',
      CHECKING_REMAINING_CHARACTERS: 'CHECKING_REMAINING_CHARACTERS',
    };
    let state = STATE.FINDING_FIRST_INDICATOR;
    let indicatorCount = 0;
    const isRunWell = text.split('').every((character, index) => {
      switch (state) {
        case STATE.FINDING_FIRST_INDICATOR:
          if (character === SPACE && index < 3) {
            return true;
          }
          if (character === indicator) {
            state = STATE.COUNTING_INDICATORS;
            return true;
          }
          return false;
        case STATE.COUNTING_INDICATORS:
          if (character === indicator) {
            indicatorCount += 1;
            return true;
          }
          if (WHITE_SPACES.includes(character)
            && indicatorCount >= openingIndicatorCount) {
            state = STATE.CHECKING_REMAINING_CHARACTERS;
            return true;
          }
          return false;
        case STATE.FINDING_REMAINING_INDICATORS:
          return WHITE_SPACES.includes(character);
        default:
          throw new Error('invalid state');
      }
    });
    return isRunWell && indicatorCount >= openingIndicatorCount;
  }
  static parseFencedCodeBlocks(blocks) {
    const returnBlocks = [];
    const STATE = {
      FINDING_OPENING_CODE_FENCE: 'FINDING_OPENING_CODE_FENCE',
      FINDING_CLOSING_CODE_FENCE: 'FINDING_CLOSING_CODE_FENCE',
    };
    let state = STATE.FINDING_OPENING_CODE_FENCE;
    let codeBlockLines = [];
    let openingIndicator;
    let openingIndicatorCount;
    blocks.forEach((block, index) => {
      const isLastBlock = index === blocks.length - 1;
      switch (state) {
        case STATE.FINDING_OPENING_CODE_FENCE: {
          if (isLastBlock) {
            returnBlocks.push(block);
            break;
          }
          const isOpeningCodeFence = FencedCodeBlock.isOpeningCodeFence(block);
          if (!isOpeningCodeFence) {
            returnBlocks.push(block);
            break;
          }
          openingIndicator = FencedCodeBlock.getIndicator(block);
          openingIndicatorCount = FencedCodeBlock.getIndicatorCount(block);
          codeBlockLines.push(block);
          state = STATE.FINDING_CLOSING_CODE_FENCE;
        } break;
        case STATE.FINDING_CLOSING_CODE_FENCE:
          codeBlockLines.push(block);
          if (FencedCodeBlock.isClosingCodeFence(block, openingIndicator, openingIndicatorCount)
            || isLastBlock) {
            const fencedCodeBlock = new FencedCodeBlock(codeBlockLines);
            returnBlocks.push(fencedCodeBlock);
            codeBlockLines = [];
            state = STATE.FINDING_OPENING_CODE_FENCE;
          }
          break;
        default:
          throw new Error('invalid state');
      }
    });
    return returnBlocks;
  }
}
