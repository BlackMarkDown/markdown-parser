// @flow
import ContainerBlock from './ContainerBlock';
import ListItem from './ListItem';
import type Block from '../Block';

export default class List extends ContainerBlock {
  static parseList(blocks: Block[]): Block[] {
    const openingIndex = blocks.findIndex(block => block instanceof ListItem);
    if (openingIndex === -1) {
      return blocks;
    }
    let closingIndex = openingIndex;
    while (closingIndex + 1 < blocks.length
    && blocks[closingIndex + 1] instanceof ListItem) {
      closingIndex += 1;
    }

    return [
      ...blocks.slice(0, openingIndex),
      new List(blocks.slice(openingIndex, closingIndex + 1)),
      ...List.parseList(blocks.slice(closingIndex + 1)),
    ];
  }
}
