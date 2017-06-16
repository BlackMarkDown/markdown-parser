import LeafBlock from './LeafBlock';
import ThematicBreak from './ThematicBreak';
import {
  SPACE,
  HYPHEN_MINUS,
  EQUALS_SIGN,
  WHITE_SPACES,
} from '../utils/Characters';

export default class SetextHeading extends LeafBlock {
  static isSetextHeadingUnderline(line) {
    const lineText = line.text || line;
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
    const isRunWell = lineText.split('').every((character) => {
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
  static isSetextHeadingContentLine(line) {
    function hasAtLeastOneNonCharacter(characters) {
      for (let i = 0; i < characters.length; i += 1) {
        const character = characters[i];
        if (!WHITE_SPACES.includes(character)) {
          return true;
        }
      }
      return false;
    }
    return line
    && typeof line === 'string'
    && hasAtLeastOneNonCharacter(line);
  }
  static parseSetextHeadings(lines) {
    return lines.reduce((prevResult, line) => {
      if (
        (typeof line === 'string'
          || line instanceof ThematicBreak)
        && SetextHeading.isSetextHeadingUnderline(line)
      ) {
        const lineText = line.text || line;
        const contentLines = [];
        let index = prevResult.length - 1;
        let contentLine = prevResult[index];
        while (SetextHeading.isSetextHeadingContentLine(contentLine)) {
          contentLines.unshift(contentLine);
          index -= 1;
          contentLine = prevResult[index];
        }
        if (contentLines.length > 0) {
          const setextHeading = new SetextHeading(`${contentLines.join('')}${lineText}`);
          return [...prevResult.slice(0, -contentLines.length), setextHeading];
        }
      }
      return [...prevResult, line];
    }, []);
  }
}
