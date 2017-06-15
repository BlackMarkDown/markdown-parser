import { SPACE } from './Characters';

export default function isMayStartWithSpaces(line, allowedStartingCharacters, maxSpaceCount) {
  for (let i = 0; i < maxSpaceCount + 1; i += 1) {
    const character = line[i];
    if (allowedStartingCharacters.includes(character)) {
      return true;
    }
    if (character !== SPACE) {
      return false;
    }
  }
  return false;
}
