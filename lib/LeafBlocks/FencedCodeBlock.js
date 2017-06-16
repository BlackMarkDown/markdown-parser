import LeafBlock from './LeafBlock';
import {
  SPACE,
  BACKTICK,
  TILDE,
  WHITE_SPACES,
} from '../utils/Characters';

export default class FencedCodeBlock extends LeafBlock {
  static checkOpeningCodeFence(line) {
    const STATE = {
      FINDING_FIRST_INDICATOR: 'FINDING_FIRST_INDICATOR',
      COUNTING_INDICATORS: 'COUNTING_INDICATORS',
      FINDING_REMAINING_INDICATORS: 'FINDING_REMAINING_INDICATORS',
    };
    const INDICATORS = [BACKTICK, TILDE];
    let state = STATE.FINDING_FIRST_INDICATOR;
    let indicator;
    let indicatorCount = 0;
    const isRunWell = line.split('').every((character, index) => {
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
          if (character === indicator) {
            return false;
          }
          return true;
        default:
          throw new Error('invalid state');
      }
    });
    const isOpeningCodeFence = isRunWell
      && indicatorCount >= 3;

    return {
      isOpeningCodeFence,
      indicator,
      indicatorCount,
    };
  }
  static isClosingCodeFence(line, indicator, openingIndicatorCount) {
    const STATE = {
      FINDING_FIRST_INDICATOR: 'FINDING_FIRST_INDICATOR',
      COUNTING_INDICATORS: 'COUNTING_INDICATORS',
      CHECKING_REMAINING_CHARACTERS: 'CHECKING_REMAINING_CHARACTERS',
    };
    let state = STATE.FINDING_FIRST_INDICATOR;
    let indicatorCount = 0;
    const isRunWell = line.split('').every((character, index) => {
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
  static parseFencedCodeBlocks(lines) {
    const returnLines = [];
    const STATE = {
      FINDING_OPENING_CODE_FENCE: 'FINDING_OPENING_CODE_FENCE',
      FINDING_CLOSING_CODE_FENCE: 'FINDING_CLOSING_CODE_FENCE',
    };
    let state = STATE.FINDING_OPENING_CODE_FENCE;
    let codeBlockLines = [];
    let openingIndicator;
    let openingIndicatorCount;
    lines.forEach((line, index) => {
      switch (state) {
        case STATE.FINDING_OPENING_CODE_FENCE: {
          const {
            isOpeningCodeFence,
            indicator,
            indicatorCount,
          } = FencedCodeBlock.checkOpeningCodeFence(line);
          if (!isOpeningCodeFence) {
            returnLines.push(line);
            break;
          }
          codeBlockLines.push(line);
          openingIndicator = indicator;
          openingIndicatorCount = indicatorCount;
          state = STATE.FINDING_CLOSING_CODE_FENCE;
        } break;
        case STATE.FINDING_CLOSING_CODE_FENCE: {
          codeBlockLines.push(line);
          const isLastLine = index === lines.length - 1;
          if (FencedCodeBlock.isClosingCodeFence(line, openingIndicator, openingIndicatorCount)
            || isLastLine) {
            const text = codeBlockLines.join('');
            const fencedCodeBlock = new FencedCodeBlock(text);
            returnLines.push(fencedCodeBlock);
            codeBlockLines = [];
            state = STATE.FINDING_OPENING_CODE_FENCE;
          }
        } break;
        default:
          throw new Error('invalid state');
      }
    });
    return returnLines;
  }
}
