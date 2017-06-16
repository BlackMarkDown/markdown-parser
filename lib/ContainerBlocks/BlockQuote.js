import ConatinerBlock from './ConatinerBlock';
import {
  SPACE,
  GREATER_THAN_SIGN,
} from '../utils/Characters';

export default class BlockQuote extends ConatinerBlock {
  static isBlockQuoteLine(line) {
    if (typeof line !== 'string') {
      return false;
    }
    // I know, I know, but it's funny. :D
    return line[0] === GREATER_THAN_SIGN
      || (line[0] === SPACE && line[1] === GREATER_THAN_SIGN)
      || (line[0] === SPACE && line[1] === SPACE && line[2] === GREATER_THAN_SIGN)
      || (line[0] === SPACE && line[1] === SPACE
        && line[2] === SPACE && line[3] === GREATER_THAN_SIGN);
  }
  static parseSetextHeadings(lines) {
    const returnLines = [];
    const STATE = {
      FINDING_OPENING: 'FINDING_OPENING',
      PUSHING_CONTENTS: 'PUSHING_CONTENTS',
    };
    let state = STATE.FINDING_OPENING;
    let blockQuoteLines = [];
    lines.forEach((line, index) => {
      switch (state) {
        case STATE.FINDING_OPENING: {
          if (!BlockQuote.isBlockQuoteLine(line)) {
            returnLines.push(line);
            break;
          }
          blockQuoteLines.push(line);
          state = STATE.PUSHING_CONTENTS;
        } break;
        case STATE.PUSHING_CONTENTS: {
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
