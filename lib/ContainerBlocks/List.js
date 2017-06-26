import ContainerBlock from './ContainerBlock';
import ListItem from './ListItem';

export default class List extends ContainerBlock {
  static parseList(blocks) {
    const returnBlocks = [];
    let pendingListItems = [];

    blocks.forEach((block, index) => {
      const isLastBlock = index === blocks.length - 1;
      const isListItem = block instanceof ListItem;
      if (isListItem) {
        pendingListItems.push(block);
      }
      if ((!isListItem || isLastBlock) && pendingListItems.length > 0) {
        const list = new List(pendingListItems);
        returnBlocks.push(list);
        pendingListItems = [];
      }
      if (!isListItem) {
        returnBlocks.push(block);
      }
    });
    return returnBlocks;
  }
}
