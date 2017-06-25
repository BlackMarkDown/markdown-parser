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
import splitLines from '../splitLines';

const BULLET_LIST_MARKERS = [HYPHEN_MINUS, PLUS, ASTERISK];
const ORDERED_LIST_MARKERS_ENDING = [FULL_STOP, RIGHT_PARENTHESIS];

export default class ListItem extends ContainerBlock {
  initChildren(text) {
    const firstLine = splitLines(text)[0];
    this.contentIndentation = ListItem.countContentIndentation(firstLine);
    super.initChildren(text);
  }
  removeMarkerAndIndentation(line) {
    const { contentIndentation } = this;
    return line.slice(contentIndentation);
  }
  static isBulletListItem(line) {
    return /^ {0,3}[-+*](\s|$)/.test(line);
  }
  static isOrderedListItem(line) {
    return /^ {0,3}\d+[.)](\s|$)/.test(line);
  }
  static isListItem(line) {
    return ListItem.isBulletListItem(line) || ListItem.isOrderedListItem(line);
  }
  static countOpeningIndentation(line) {
    let openingIndentation = 0;
    for (let i = 0; i < line.length; i += 1) {
      const character = line[i];
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
  static countSpacesAfterListMarker(line) {
    const openingIndentation = ListItem.countOpeningIndentation(line);
    const listMarker = ListItem.getListMarker(line);
    let spacesAfterListMarker = 0;
    for (let i = openingIndentation + listMarker.length; i < line.length; i += 1) {
      const character = line[i];
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
  static getListMarker(line) {
    const openingIndentation = ListItem.countOpeningIndentation(line);
    const firstCharacter = line[openingIndentation];
    if (BULLET_LIST_MARKERS.includes(firstCharacter)) {
      return firstCharacter;
    }
    for (let i = openingIndentation; i < line.length; i += 1) {
      const character = line[i];
      if (ORDERED_LIST_MARKERS_ENDING.includes(character)) {
        return line.slice(openingIndentation, i + 1);
      }
      if (!DIGITS.includes(character)) {
        throw Error('wrong character before ordered list marker ending');
      }
    }
    throw Error('no ordered list marker ending');
  }
  static countContentIndentation(line) {
    const openingIndentation = ListItem.countOpeningIndentation(line);
    const listMarker = ListItem.getListMarker(line);
    const spacesAfterListMarker = ListItem.countSpacesAfterListMarker(line);
    const contentIndentation = openingIndentation
      + listMarker.length
      + spacesAfterListMarker;
    return contentIndentation;
  }
  static parseListItems(lines) {
    const returnLines = [];
    const STATE = {
      FINDING_LIST_ITEM_MARKER: 'FINDING_LIST_ITEM_MARKER',
      PUSHING_LIST_ITEM_CONTENTS: 'PUSHING_LIST_ITEM_CONTENTS',
    };
    let state = STATE.FINDING_LIST_ITEM_MARKER;
    let contentIndentation;
    let pendingLines = [];

    lines.forEach((line, index) => {
      const isLastLine = index === lines.length - 1;
      switch (state) {
        case STATE.FINDING_LIST_ITEM_MARKER:
          if (ListItem.isListItem(line)) {
            if (isLastLine) {
              const listItem = new ListItem(line);
              returnLines.push(listItem);
              break;
            }
            contentIndentation = ListItem.countContentIndentation(line);
            pendingLines.push(line);
            state = STATE.PUSHING_LIST_ITEM_CONTENTS;
          } else {
            returnLines.push(line);
          }
          break;
        case STATE.PUSHING_LIST_ITEM_CONTENTS: {
          const openingIndentation = ListItem.countOpeningIndentation(line);
          const isPotential = BlankLine.isBlankLine(line)
            || contentIndentation <= openingIndentation;
          if (isPotential) {
            pendingLines.push(line);
          }
          if (!isPotential || isLastLine) {
            const blankLines = [];
            let lastLine = pendingLines[pendingLines.length - 1];
            while (BlankLine.isBlankLine(lastLine)) {
              pendingLines.pop();
              blankLines.unshift(lastLine);
              lastLine = pendingLines[pendingLines.length - 1];
            }

            const text = pendingLines.join('');
            const listItem = new ListItem(text);

            returnLines.push(listItem, ...blankLines);
            if (!isPotential) {
              returnLines.push(line);
            }

            pendingLines = [];
            state = STATE.FINDING_LIST_ITEM_MARKER;
          }
        } break;
        default:
          throw new Error('wrong state');
      }
    });
    return returnLines;
  }
}
