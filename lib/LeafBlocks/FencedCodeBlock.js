// @flow
import LeafBlock from './LeafBlock';
import {
  SPACE,
  BACKTICK,
  TILDE,
  WHITE_SPACES,
} from '../utils/Characters';
import type Block from '../Block';
import type Line from '../Line';

const INDICATORS = [BACKTICK, TILDE];

function isParsableAsOpeningCodeFence(line: Line): boolean {
  const text = line.text;
  const STATE = {
    FINDING_FIRST_INDICATOR: 'FINDING_FIRST_INDICATOR',
    COUNTING_INDICATORS: 'COUNTING_INDICATORS',
    FINDING_REMAINING_INDICATORS: 'FINDING_REMAINING_INDICATORS',
  };
  let state = STATE.FINDING_FIRST_INDICATOR;
  let indicator;
  let indicatorCount = 0;
  for (let i = 0; i < text.length; i += 1) {
    const character = text[i];
    switch (state) {
      case STATE.FINDING_FIRST_INDICATOR:
        if (character === SPACE && i < 3) {
          break;
        }
        if (INDICATORS.includes(character)) {
          indicator = character;
          state = STATE.COUNTING_INDICATORS;
          break;
        }
        return false;
      case STATE.COUNTING_INDICATORS:
        if (character === indicator) {
          indicatorCount += 1;
          break;
        }
        if (indicatorCount < 3) {
          return false;
        }
        state = STATE.FINDING_REMAINING_INDICATORS;
        break;
      case STATE.FINDING_REMAINING_INDICATORS:
        if (character === indicator) {
          return false;
        }
        break;
      default:
        throw new Error('invalid state');
    }
  }
  return indicatorCount >= 3;
}
function getIndicator(line: Line) {
  // NOTE Assume that line is parsable as opening code fence
  const text = line.text;
  for (let i = 0; i < text.length; i += 1) {
    const character = text[i];
    if (INDICATORS.includes(character)) {
      return character;
    }
  }
  throw new Error('unparsed line must contain indicator');
}
function getIndicatorCount(line: Line, indicator: string) {
  // NOTE Assume that line is parsable as opening code fence
  const text = line.text;
  let count = 0;
  for (let i = 0; i < text.length; i += 1) {
    const character = text[i];
    if (character === indicator) {
      count += 1;
    }
  }
  return count;
}
function isParseableAsClosingCodeFence(line: Line,
  indicator: string,
  openingIndicatorCount: number) {
  const text = line.text;
  const STATE = {
    FINDING_FIRST_INDICATOR: 'FINDING_FIRST_INDICATOR',
    COUNTING_INDICATORS: 'COUNTING_INDICATORS',
    CHECKING_REMAINING_CHARACTERS: 'CHECKING_REMAINING_CHARACTERS',
  };
  let state = STATE.FINDING_FIRST_INDICATOR;
  let indicatorCount = 0;
  for (let i = 0; i < text.length; i += 1) {
    const character = text[i];
    switch (state) {
      case STATE.FINDING_FIRST_INDICATOR:
        if (character === SPACE && i < 3) {
          break;
        }
        if (character === indicator) {
          state = STATE.COUNTING_INDICATORS;
          break;
        }
        return false;
      case STATE.COUNTING_INDICATORS:
        if (character === indicator) {
          indicatorCount += 1;
          break;
        }
        if (WHITE_SPACES.includes(character)
          && indicatorCount >= openingIndicatorCount) {
          state = STATE.CHECKING_REMAINING_CHARACTERS;
          break;
        }
        return false;
      case STATE.FINDING_REMAINING_INDICATORS:
        if (!WHITE_SPACES.includes(character)) {
          return false;
        }
        break;
      default:
        throw new Error('invalid state');
    }
  }
  return indicatorCount >= openingIndicatorCount;
}

export default class FencedCodeBlock extends LeafBlock {
  static parseFencedCodeBlocks(lines: Line[], next: (Line[]) => Block[]): Block[] {
    const openingIndex = lines.findIndex(line => isParsableAsOpeningCodeFence(line));
    if (openingIndex === -1) {
      return next(lines);
    }
    const openingLine = lines[openingIndex];
    const openingIndicator = getIndicator(openingLine);
    const openingIndicatorCount = getIndicatorCount(openingLine, openingIndicator);
    const closingIndex = lines.findIndex((line, index) =>
      index > openingIndex
      && isParseableAsClosingCodeFence(line, openingIndicator, openingIndicatorCount));

    if (closingIndex === -1) {
      return [
        ...next(lines.slice(0, openingIndex)),
        new FencedCodeBlock(lines.slice(openingIndex)),
      ];
    }
    return [
      ...next(lines.slice(0, openingIndex)),
      new FencedCodeBlock(lines.slice(openingIndex, closingIndex + 1)),
      ...FencedCodeBlock.parseFencedCodeBlocks(lines.slice(closingIndex + 1), next),
    ];
  }
}
