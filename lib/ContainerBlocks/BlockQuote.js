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
  static parseBlockQuotes(lines) {
    const returnLines = [];
    let blockQuoteLines = [];
    lines.forEach((line, index) => {
      const isCurrentLineBlockQuoteLine = BlockQuote.isBlockQuoteLine(line);
      if (isCurrentLineBlockQuoteLine) {
        blockQuoteLines.push(line);
      }
      const isLastLine = index === lines.length - 1;
      if ((isLastLine || !isCurrentLineBlockQuoteLine) && blockQuoteLines.length > 0) {
        const text = blockQuoteLines.join('');
        const blockQuote = new BlockQuote(text);
        returnLines.push(blockQuote);
        blockQuoteLines = [];
      }
      if (!isCurrentLineBlockQuoteLine) {
        returnLines.push(line);
      }
    });
    return returnLines;
  }
}
