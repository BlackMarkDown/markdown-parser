import LeafBlock from './LeafBlock';
import Paragraph from './Paragraph';
import ThematicBreak from './ThematicBreak';
import {
  SPACE,
  HYPHEN_MINUS,
  EQUALS_SIGN,
  WHITE_SPACES,
} from '../utils/Characters';

export default class SetextHeading extends LeafBlock {
  static isSetextHeadingUnderline(line) {
    const text = line.text;
    const STATE = {
      FINDING_FIRST_INDICATOR_SEQUENCE: 'FINDING_FIRST_INDICATOR',
      FINDING_END_OF_INDICATOR_SEQUENCE: 'FINDING_LAST_INDICATOR',
      FINDING_OTHER_INDICATOR_SEQUENCE: 'FINDING_OTHER_INDICATOR_SEQUENCE',
    };
    const INDICATORS = [HYPHEN_MINUS, EQUALS_SIGN];
    let state = STATE.FINDING_FIRST_INDICATOR;
    let frontSpaceCount = 0;
    let indicator;
    let indicatorCount = 0;
    const isRunWell = text.split('').every((character) => {
      switch (state) {
        case STATE.FINDING_FIRST_INDICATOR:
          if (character === SPACE) {
            frontSpaceCount += 1;
            return frontSpaceCount <= 3;
          } else if (INDICATORS.includes(character)) {
            indicator = character;
            state = STATE.FINDING_DIFFERENT_INDICATOR;
            return true;
          }
          return false;
        case STATE.FINDING_END_OF_INDICATOR_SEQUENCE:
          if (character === indicator) {
            indicatorCount += 1;
            return true;
          }
          if (WHITE_SPACES.includes(character)) {
            if (indicatorCount < 3) {
              return false;
            }
            state = STATE.FINDING_OTHER_INDICATOR_SEQUENCE;
            return true;
          }
          return false;
        case STATE.FINDING_OTHER_INDICATOR_SEQUENCE:
          return WHITE_SPACES.includes(character);
        default:
          throw new Error('invalid state');
      }
    });
    if (!isRunWell) {
      return false;
    }
    switch (state) {
      case STATE.FINDING_FIRST_INDICATOR:
        return false;
      case STATE.FINDING_END_OF_INDICATOR_SEQUENCE:
        return indicatorCount >= 3;
      case STATE.FINDING_OTHER_INDICATOR_SEQUENCE:
        return true;
      default:
        throw new Error('invalid state');
    }
  }
  static parseSetextHeadings(lines) {
    return lines.reduce((prevResult, line) => {
      if (
        (line instanceof Paragraph
          || line instanceof ThematicBreak)
        && prevResult[prevResult.length - 1] instanceof Paragraph // for Performance :D
        && SetextHeading.isSetextHeadingUnderline(line)
      ) {
        const contentLines = [];
        let index = prevResult.length - 1;
        let contentLine = prevResult[index];
        while (contentLine && contentLine instanceof Paragraph) {
          contentLines.unshift(contentLine);
          index -= 1;
          contentLine = prevResult[index];
        }
        if (contentLines.length > 0) {
          const setextHeading = new SetextHeading(`${contentLines.join('')}${line}`);
          return [...prevResult.slice(0, -(contentLines.length + 1)), setextHeading];
        }
      }
      return [...prevResult, line];
    }, []);
  }
}
