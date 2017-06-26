// @flow
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
import Line from '../Line';
import UnparsedLineBlock from '../UnparsedLineBlock';

const BULLET_LIST_MARKERS = [HYPHEN_MINUS, PLUS, ASTERISK];
const ORDERED_LIST_MARKERS_ENDING = [FULL_STOP, RIGHT_PARENTHESIS];

function isParsableAsBulletListItem(block) {
  return block instanceof UnparsedLineBlock && /^ {0,3}[-+*](\s|$)/.test(block.line.text);
}
function isParsableAsOrderedListItem(block) {
  return block instanceof UnparsedLineBlock && /^ {0,3}\d+[.)](\s|$)/.test(block.line.text);
}
function isParsableAsListItem(block) {
  return isParsableAsBulletListItem(block) || isParsableAsOrderedListItem(block);
}
function countOpeningIndentation(line: Line) {
  const text = line.text;
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

function getListMarker(line: Line) {
  const text = line.text;
  const openingIndentation = countOpeningIndentation(line);
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
function countSpacesAfterListMarker(line: Line) {
  const text = line.text;
  const openingIndentation = countOpeningIndentation(line);
  const listMarker = getListMarker(line);
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
function countContentIndentation(line: Line) {
  const openingIndentation = countOpeningIndentation(line);
  const listMarker = getListMarker(line);
  const spacesAfterListMarker = countSpacesAfterListMarker(line);
  const contentIndentation = openingIndentation
    + listMarker.length
    + spacesAfterListMarker;
  return contentIndentation;
}

export default class ListItem extends ContainerBlock {
  static parseListItems(blocks) {
    return blocks.map(block => (
      isParsableAsListItem(block)
        ? [block]
        : block
    ))
    .reduce((prevResult, blockOrArray) => {
      const lastElement = prevResult[prevResult.length - 1];
      if (!(lastElement instanceof Array)) {
        return [...prevResult, blockOrArray];
      }
      const lastArray: Array<UnparsedLineBlock> = lastElement;
      const prevFirstBlock = lastArray[0];
      const prevContentIndentation = countContentIndentation(prevFirstBlock.line);
      const block: UnparsedLineBlock = blockOrArray instanceof Array
        ? blockOrArray[0]
        : blockOrArray;
      const openingIndentation = countOpeningIndentation(block.line);
      return prevContentIndentation <= openingIndentation
        ? [...prevResult.slice(0, -1), [...lastArray, block]]
        : [...prevResult, blockOrArray];
    }, [])
    .map(blockOrArray => (
      blockOrArray instanceof Array
      ? new ListItem(blockOrArray)
      : blockOrArray
    ));
  }
}
