// @flow
import LeafBlock from './LeafBlock';
import {
  SPACE,
  NUMBER_SIGN,
  WHITE_SPACES,
} from '../utils/Characters';
import Line from '../Line';
import type Block from '../Block';

const MAX_NUMBER_SIGN_COUNT = 6;

function isParsableAsATXHeading(line: Line): boolean {
  const text = line.text;
  const STATE = {
    FINDING_FIRST_NUMBER_SIGN: 'FINDING_FIRST_NUMBER_SIGN',
    FINDING_LAST_NUMBER_SIGN: 'FINDING_LAST_NUMBER_SIGN',
  };
  let state = STATE.FINDING_FIRST_NUMBER_SIGN;
  let numberSignCount = 0;
  for (let i = 0; i < text.length; i += 1) {
    const character = text[i];
    switch (state) {
      case STATE.FINDING_FIRST_NUMBER_SIGN:
        switch (character) {
          case NUMBER_SIGN:
            state = STATE.FINDING_LAST_NUMBER_SIGN;
            numberSignCount = 1;
            break;
          case SPACE:
            if (i > 2) {
              return false;
            }
            break;
          default:
            return false;
        }
        break;
      case STATE.FINDING_LAST_NUMBER_SIGN:
        if (character === NUMBER_SIGN) {
          numberSignCount += 1;
          if (numberSignCount > MAX_NUMBER_SIGN_COUNT) {
            return false;
          }
        } else {
          return WHITE_SPACES.includes(character);
        }
        break;
      default:
        throw new Error('invalid state');
    }
  }
  return numberSignCount > 0;
}

function countNumberSignCount(line: Line): number {
  const text = line.text;
  const indexOfOpeningNumberSign = text.indexOf(NUMBER_SIGN);
  let count = 0;
  let index = indexOfOpeningNumberSign;
  while (text[index] === NUMBER_SIGN) {
    count += 1;
    index += 1;
  }
  return count;
}

function removeNumberSign(line: Line): Line {
  const numberSignCount = countNumberSignCount(line);
  const text = line.text;
  return new Line(text.slice(numberSignCount + 1));
}

export default class ATXHeading extends LeafBlock {
  numberSignCount: number;
  constructor(lines, numberSignCount) {
    super(lines);
    this.numberSignCount = numberSignCount;
  }
  render(): string {
    return `<h${this.numberSignCount}>${super.render()}</h${this.numberSignCount}>`;
  }
  static parseATXHeadings(lines: Line[], next: (Line[]) => Block[]): Block[] {
    const index = lines.findIndex(line => isParsableAsATXHeading(line));
    if (index === -1) {
      return next(lines);
    }
    const line = lines[index];
    const numberSignCount = countNumberSignCount(line);
    const numberSignRemovedLine = removeNumberSign(line);
    return [
      ...next(lines.slice(0, index)),
      new ATXHeading([numberSignRemovedLine], numberSignCount),
      ...ATXHeading.parseATXHeadings(lines.slice(index + 1), next),
    ];
  }
}
