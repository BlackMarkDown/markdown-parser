import ContainerBlock from './ContainerBlock';
import ListItem from './ListItem';

export default class List extends ContainerBlock {
  constructor(listItems) {
    const text = listItems.reduce((prevResult, listItem) =>
      `${prevResult}${listItem.text}`, '');
    super(text);
    this.children = listItems;
  }
  initChildren() {}
  static parseList(lines) {
    const returnLines = [];
    let pendingListItems = [];

    lines.forEach((line, index) => {
      const isLastLine = index === lines.length - 1;
      const isListItem = line instanceof ListItem;
      if (isListItem) {
        pendingListItems.push(line);
      }
      if (!isListItem || isLastLine) {
        if (pendingListItems.length > 0) {
          const list = new List(pendingListItems);
          returnLines.push(list);
          pendingListItems = [];
        }
        if (!isListItem) {
          returnLines.push(line);
        }
      }
    });
    return returnLines;
  }
}
