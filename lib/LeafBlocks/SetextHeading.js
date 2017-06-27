// @flow
import LeafBlock from './LeafBlock';
import {
  SPACE,
  HYPHEN_MINUS,
  EQUALS_SIGN,
  WHITE_SPACES,
} from '../utils/Characters';
import type Block from '../Block';
import type Line from '../Line';

function isSetextHeadingUnderline(line: Line): boolean {
  const text = line.text;
  const STATE = {
    FINDING_FIRST_INDICATOR: 'FINDING_FIRST_INDICATOR',
    FINDING_END_OF_INDICATOR_SEQUENCE: 'FINDING_END_OF_INDICATOR_SEQUENCE',
    FINDING_OTHER_INDICATOR_SEQUENCE: 'FINDING_OTHER_INDICATOR_SEQUENCE',
  };
  const INDICATORS = [HYPHEN_MINUS, EQUALS_SIGN];
  let state = STATE.FINDING_FIRST_INDICATOR;
  let frontSpaceCount = 0;
  let indicator;
  let indicatorCount = 0;
  for (let i = 0; i < text.length; i += 1) {
    const character = text[i];
    switch (state) {
      case STATE.FINDING_FIRST_INDICATOR:
        if (character === SPACE) {
          frontSpaceCount += 1;
          if (frontSpaceCount > 4) {
            return false;
          }
        } else if (INDICATORS.includes(character)) {
          indicator = character;
          state = STATE.FINDING_END_OF_INDICATOR_SEQUENCE;
        } else {
          return false;
        }
        break;
      case STATE.FINDING_END_OF_INDICATOR_SEQUENCE:
        if (character === indicator) {
          indicatorCount += 1;
        } else if (WHITE_SPACES.includes(character)) {
          if (indicatorCount < 3) {
            return false;
          }
          state = STATE.FINDING_OTHER_INDICATOR_SEQUENCE;
        } else {
          return false;
        }
        break;
      case STATE.FINDING_OTHER_INDICATOR_SEQUENCE:
        if (!WHITE_SPACES.includes(character)) {
          return false;
        }
        break;
      default:
        throw new Error('invalid state');
    }
  }
  return indicatorCount >= 3;
}

function isSetextHeadingContentLine(line: Line): boolean {
  const text = line.text;
  for (let i = 0; i < text.length; i += 1) {
    const character = text[i];
    if (!WHITE_SPACES.includes(character)) {
      return true;
    }
  }
  return false;
}

export default class SetextHeading extends LeafBlock {
  static parseSetextHeadings(lines: Line[], next: (Line[]) => Block[]): Block[] {
    for (let i = 0; i < lines.length; i += 1) {
      const line = lines[i];
      if (isSetextHeadingUnderline(line)) {
        const closingIndex = i;
        let openingIndex = i;
        while (openingIndex - 1 >= 0
        && isSetextHeadingContentLine(lines[openingIndex - 1])) {
          openingIndex -= 1;
        }
        if (openingIndex < closingIndex) {
          return [
            ...next(lines.slice(0, openingIndex)),
            new SetextHeading(lines.slice(openingIndex, closingIndex + 1)),
            ...SetextHeading.parseSetextHeadings(lines.slice(closingIndex + 1), next),
          ];
        }
      }
    }
    return [...next(lines)];
  }
}
