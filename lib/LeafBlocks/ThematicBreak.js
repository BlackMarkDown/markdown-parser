import LeafBlock from './LeafBlock';
import {
  SPACE,
  TAB,
  HYPHEN_MINUS,
  UNDERSCORE,
  ASTERISK,
} from '../utils/Characters';
import isMayStartWithSpaces from '../utils/isMayStartWithSpaces';
import isStringConsistedInAllowedCharacters from '../utils/isStringConsistedInAllowedCharacters';

function isOnlyAllowedCharacters(line) {
  const allowedCharacters = [SPACE, TAB, HYPHEN_MINUS, UNDERSCORE, ASTERISK];
  return isStringConsistedInAllowedCharacters(line, allowedCharacters);
}
function isStartUnder4Spaces(line) {
  return isMayStartWithSpaces(line, [HYPHEN_MINUS, UNDERSCORE, ASTERISK], 3);
}
function isConsistedWithOnlyOneCharacter(line) {
  const characters = [HYPHEN_MINUS, UNDERSCORE, ASTERISK];
  return characters.some(character =>
    isStringConsistedInAllowedCharacters(line, [character, SPACE, TAB]));
}

export default class ThematicBreak extends LeafBlock {
  static isThematicBreak(line) {
    return typeof line === 'string'
    && isOnlyAllowedCharacters(line)
    && isStartUnder4Spaces(line)
    && isConsistedWithOnlyOneCharacter(line);
  }
  static parseThematicBreaks(lines) {
    return lines.map((line) => {
      if (ThematicBreak.isThematicBreak(line)) {
        return new ThematicBreak(line);
      }
      return line;
    });
  }
}
