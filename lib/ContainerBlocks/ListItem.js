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
import Block from '../Block';
import Line from '../Line';
import parseLines from '../parseLines';

const BULLET_LIST_MARKERS = [HYPHEN_MINUS, PLUS, ASTERISK];
const ORDERED_LIST_MARKERS_ENDING = [FULL_STOP, RIGHT_PARENTHESIS];

function isParsableAsBulletListItem(line: Line): boolean {
  return /^ {0,3}[-+*](\s|$)/.test(line.text);
}
function isParsableAsOrderedListItem(line: Line): boolean {
  return /^ {0,3}\d+[.)](\s|$)/.test(line.text);
}
function isParsableAsListItem(line: Line) {
  return isParsableAsBulletListItem(line) || isParsableAsOrderedListItem(line);
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

function getListMarker(line: Line): string {
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
function countSpacesAfterListMarker(line: Line): number {
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
function countContentIndentation(line: Line): number {
  const openingIndentation = countOpeningIndentation(line);
  const listMarker = getListMarker(line);
  const spacesAfterListMarker = countSpacesAfterListMarker(line);
  const contentIndentation = openingIndentation
    + listMarker.length
    + spacesAfterListMarker;
  return contentIndentation;
}
function shiftLines(lines: Line[]): Line[] {
  const firstLine = lines[0];
  const contentIndentation = countContentIndentation(firstLine);
  return lines.map((line) => {
    const text = line.text;
    return text.substring(contentIndentation);
  })
  .map(shiftedText => new Line(shiftedText));
}

export default class ListItem extends ContainerBlock {
  static parseListItems(lines: Line[], next: (Line[]) => Block[]): Block[] {
    const openingIndex = lines.findIndex(line => isParsableAsListItem(line));
    if (openingIndex === -1) {
      return next(lines);
    }
    const openingLine = lines[openingIndex];
    const contentIndentation = countContentIndentation(openingLine);
    let closingIndex = openingIndex;
    while (closingIndex + 1 < lines.length) {
      const nextLine = lines[closingIndex + 1];
      const nextLineOpeningIndentation = countOpeningIndentation(nextLine);
      if (contentIndentation <= nextLineOpeningIndentation) {
        closingIndex += 1;
      } else {
        break;
      }
    }

    return [
      ...next(lines.slice(0, openingIndex)),
      new ListItem(parseLines(shiftLines(lines.slice(openingIndex, closingIndex + 1)))),
      ...ListItem.parseListItems(lines.slice(closingIndex + 1), next),
    ];
  }
}
