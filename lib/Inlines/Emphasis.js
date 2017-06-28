// @flow
import Inline from './Inline';
import Block from '../Block';
import {
  ASTERISK,
  WHITE_SPACES,
  PUNCTUATIONS,
} from '../utils/Characters';
import parseInline from '../parseInline';

function isLeftFlankingDelimiterRun(text, openingIndex, length) {
  const followingCharacter = text[openingIndex + length];
  const precedingCharacter = text[openingIndex - 1];
  if ((!(WHITE_SPACES.includes(followingCharacter) || followingCharacter === null))
  && (!PUNCTUATIONS.includes(followingCharacter)
      || ((WHITE_SPACES.includes(precedingCharacter) || precedingCharacter === null)
        || PUNCTUATIONS.includes(precedingCharacter)))) {
    return true;
  }
  return false;
}

function isRightFlankingDelimiterRun(text, openingIndex, length) {
  const followingCharacter = text[openingIndex + length];
  const precedingCharacter = text[openingIndex - 1];
  if ((!(WHITE_SPACES.includes(precedingCharacter) || precedingCharacter === null))
  && (!PUNCTUATIONS.includes(precedingCharacter)
      || ((WHITE_SPACES.includes(followingCharacter) || followingCharacter === null)
        || PUNCTUATIONS.includes(followingCharacter)))) {
    return true;
  }
  return false;
}

function getIndexOfPrecedingCharacterOfRun(text, index) {
  const currentCharacter = text[index];
  const previousCharacter = text[index - 1];

  if (currentCharacter !== previousCharacter) {
    return index - 1;
  }
  return getIndexOfPrecedingCharacterOfRun(text, index - 1);
}

function getIndexOfFollowingCharacterOfRun(text, index) {
  const currentCharacter = text[index];
  const nextCharacter = text[index + 1];

  if (currentCharacter !== nextCharacter) {
    return index + 1;
  }
  return getIndexOfFollowingCharacterOfRun(text, index + 1);
}

function isPartOfLeftFlankingDelimiterRun(text, index) {
  const openingIndex = getIndexOfPrecedingCharacterOfRun(text, index) + 1;
  const length = getIndexOfFollowingCharacterOfRun(text, index) - openingIndex;
  return isLeftFlankingDelimiterRun(text, openingIndex, length);
}

function isPartOfRightFlankingDelimiterRun(text, index) {
  const openingIndex = getIndexOfPrecedingCharacterOfRun(text, index) + 1;
  const length = getIndexOfFollowingCharacterOfRun(text, index) - openingIndex;
  return isRightFlankingDelimiterRun(text, openingIndex, length);
}

function findNextOpeningIndex(text, previousIndex: ?number) {
  const index = text.indexOf(ASTERISK, previousIndex + 1 || 0);
  if (index === -1) {
    return -1;
  }
  if (isPartOfLeftFlankingDelimiterRun(text, index)) {
    return index;
  }
  return findNextOpeningIndex(text, index);
}

function findclosingIndex(text, openingIndex) {
  const followingIndexOfRun = getIndexOfFollowingCharacterOfRun(text, openingIndex);
  let openingCount = followingIndexOfRun - openingIndex;
  function findClosingIndexUntilOpeningCountIsZero(previousIndex) {
    const index = text.indexOf(ASTERISK, previousIndex + 1);
    if (index === -1) {
      return -1;
    }
    if (isPartOfRightFlankingDelimiterRun(text, index)) {
      openingCount -= 1;
      if (openingCount === 0) {
        return index;
      }
    } else if (isPartOfLeftFlankingDelimiterRun(text, index)) {
      openingCount += 1;
    }
    return findClosingIndexUntilOpeningCountIsZero(index);
  }
  return findClosingIndexUntilOpeningCountIsZero(followingIndexOfRun);
}

export default class Emphasis extends Inline {
  render(): string {
    return `<em>${super.render()}</em>`;
  }
  static parseEmphasises(text: string, next: (string) => Block[]): Block[] {
    let openingIndex;
    let closingIndex;
    do {
      openingIndex = findNextOpeningIndex(text, openingIndex);
      if (openingIndex === -1) {
        return next(text);
      }
      closingIndex = findclosingIndex(text, openingIndex);
    } while (closingIndex === -1);
    return [
      ...next(text.slice(0, openingIndex)),
      new Emphasis(parseInline(text.slice(openingIndex + 1, closingIndex))),
      ...Emphasis.parseEmphasises(text.slice(closingIndex + 1), next),
    ];
  }
}
