import ConatinerBlock from './ConatinerBlock';
import ListItem from './ListItem';

export default class List extends ConatinerBlock {
  static parseList(lines) {
    const returnLines = [];
    let listItems = []; // NOTE: BlankLine may be included;
    lines.forEach((line, index) => {
      const isCurrentLineListItem = ListItem.isListItem(line);
      if (isCurrentLineListItem) {
        const firstListItem = listItems[0];
        if (firstListItem && firstListItem.isSameType) {

        }
        listItems.push(line);
      }
      const isLastLine = index === lines.length - 1;
      if ((isLastLine || !!isCurrentLineListItem) && blockQuoteLines.length > 0) {
        const text = blockQuoteLines.join('');
        const blockQuote = new BlockQuote(text);
        returnLines.push(blockQuote);
        blockQuoteLines = [];
        if (!isCurrentLineBlockQuoteLine) {
          returnLines.push(line);
        }
      }
    });
    return returnLines;
  }
}
