import ContainerBlock from './ContainerBlock';
import {
  TAB,
  SPACE,
  HYPHEN_MINUS,
  PLUS,
  ASTERISK,
  FULL_STOP,
  RIGHT_PARENTHESIS,
  DIGITS,
} from '../utils/Characters';
import BlankLine from '../LeafBlocks/BlankLine';
import UnparsedLine from '../UnparsedLine';

const BULLET_LIST_MARKERS = [HYPHEN_MINUS, PLUS, ASTERISK];
const ORDERED_LIST_MARKERS_ENDING = [FULL_STOP, RIGHT_PARENTHESIS];

export default class ListItem extends ContainerBlock {
  static isBulletListItem(block) {
    return block instanceof UnparsedLine && /^ {0,3}[-+*](\s|$)/.test(block.text);
  }
  static isOrderedListItem(block) {
    return block instanceof UnparsedLine && /^ {0,3}\d+[.)](\s|$)/.test(block.text);
  }
  static isListItem(block) {
    return ListItem.isBulletListItem(block) || ListItem.isOrderedListItem(block);
  }
  static countOpeningIndentation(block) {
    if (!(block instanceof UnparsedLine)) {
      throw new Error('block must be UnparsedLine');
    }
    const text = block.text;
    let openingIndentation = 0;
    for (let i = 0; i < text.length; i += 1) {
      const character = text[i];
      if (character === TAB) {
        openingIndentation += 4;
      } else if (character === SPACE) {
        openingIndentation += 1;
      } else {
        break;
      }
    }
    return openingIndentation;
  }
  static countSpacesAfterListMarker(block) {
    if (!(block instanceof UnparsedLine)) {
      throw new Error('block must be UnparsedLine');
    }
    const text = block.text;
    const openingIndentation = ListItem.countOpeningIndentation(block);
    const listMarker = ListItem.getListMarker(block);
    let spacesAfterListMarker = 0;
    for (let i = openingIndentation + listMarker.length; i < text.length; i += 1) {
      const character = text[i];
      if (character === TAB) {
        spacesAfterListMarker += 4;
        break;
      } else if (character === SPACE) {
        spacesAfterListMarker += 1;
      } else {
        break;
      }
    }

    if (spacesAfterListMarker >= 4) {
      spacesAfterListMarker = 0;
    }
    return spacesAfterListMarker;
  }
  static getListMarker(block) {
    if (!(block instanceof UnparsedLine)) {
      throw new Error('block must be UnparsedLine');
    }
    const text = block.text;
    const openingIndentation = ListItem.countOpeningIndentation(block);
    const firstCharacter = text[openingIndentation];
    if (BULLET_LIST_MARKERS.includes(firstCharacter)) {
      return firstCharacter;
    }
    for (let i = openingIndentation; i < text.length; i += 1) {
      const character = text[i];
      if (ORDERED_LIST_MARKERS_ENDING.includes(character)) {
        return text.slice(openingIndentation, i + 1);
      }
      if (!DIGITS.includes(character)) {
        throw Error('wrong character before ordered list marker ending');
      }
    }
    throw Error('no ordered list marker ending');
  }
  static countContentIndentation(block) {
    if (!(block instanceof UnparsedLine)) {
      throw new Error('block must be UnparsedLine');
    }
    const openingIndentation = ListItem.countOpeningIndentation(block);
    const listMarker = ListItem.getListMarker(block);
    const spacesAfterListMarker = ListItem.countSpacesAfterListMarker(block);
    const contentIndentation = openingIndentation
      + listMarker.length
      + spacesAfterListMarker;
    return contentIndentation;
  }
  static parseListItems(blocks) {
    const returnBlocks = [];
    const STATE = {
      FINDING_LIST_ITEM_MARKER: 'FINDING_LIST_ITEM_MARKER',
      PUSHING_LIST_ITEM_CONTENTS: 'PUSHING_LIST_ITEM_CONTENTS',
    };
    let state = STATE.FINDING_LIST_ITEM_MARKER;
    let contentIndentation;
    let contentBlocks = [];

    blocks.forEach((block, index) => {
      const isLastBlock = index === blocks.length - 1;
      switch (state) {
        case STATE.FINDING_LIST_ITEM_MARKER:
          if (ListItem.isListItem(block)) {
            if (isLastBlock) {
              const listItem = new ListItem(block);
              returnBlocks.push(listItem);
              break;
            }
            contentIndentation = ListItem.countContentIndentation(block);
            contentBlocks.push(block);
            state = STATE.PUSHING_LIST_ITEM_CONTENTS;
          } else {
            returnBlocks.push(block);
          }
          break;
        case STATE.PUSHING_LIST_ITEM_CONTENTS: {
          const openingIndentation = ListItem.countOpeningIndentation(block);
          const isContentBlock = BlankLine.isBlankLine(block)
            || contentIndentation <= openingIndentation;
          if (isContentBlock) {
            contentBlocks.push(block);
          }
          if ((!isContentBlock || isLastBlock) && contentBlocks.length > 0) {
            const blankLines = [];
            let lastBlock = contentBlocks[contentBlocks.length - 1];
            while (BlankLine.isBlankLine(lastBlock)) {
              contentBlocks.pop();
              blankLines.unshift(lastBlock);
              lastBlock = contentBlocks[contentBlocks.length - 1];
            }
            if (contentBlocks.length > 0) {
              const listItem = new ListItem(contentBlocks);
              returnBlocks.push(listItem, ...blankLines);
            } else {
              returnBlocks.push(...blankLines);
            }
            contentBlocks = [];
          }
          if (!isContentBlock) {
            if (ListItem.isListItem(block)) {
              if (isLastBlock) {
                const listItem = new ListItem(block);
                returnBlocks.push(listItem);
                break;
              }
              contentIndentation = ListItem.countContentIndentation(block);
              contentBlocks.push(block);
              state = STATE.PUSHING_LIST_ITEM_CONTENTS;
            } else {
              returnBlocks.push(block);
              state = STATE.FINDING_LIST_ITEM_MARKER;
            }
          }
        } break;
        default:
          throw new Error('wrong state');
      }
    });
    return returnBlocks;
  }
}
