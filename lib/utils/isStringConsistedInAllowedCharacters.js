export default function isStringConsistedInAllowedCharacters(line, allowedCharacters) {
  for (let i = 0; i < line.length; i += 1) {
    if (!allowedCharacters.includes(line[i])) {
      return false;
    }
  }
  return true;
}
