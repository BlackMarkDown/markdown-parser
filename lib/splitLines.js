import {
  CARRIAGE_RETURN,
  NEWLINE,
} from './Characters';

export default function splitLines(text) {
  /**
    * A line is a sequence of zero or more characters other than newline (U+000A)
    * or carriage return (U+000D), followed by a line ending or by the end of file.
    *
    * A line ending is a newline (U+000A), a carriage return (U+000D) not followed
    * by a newline, or a carriage return and a following newline.
    * http://spec.commonmark.org/0.27/#line
    */
  const lines = [''];
  let currentLineIndex = 0;
  function pushChar(char) {
    lines[currentLineIndex] += char;
  }
  function pushNewLine() {
    currentLineIndex += 1;
    lines[currentLineIndex] = '';
  }
  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const previousChar = text[i - 1];
    switch (char) {
      case NEWLINE:
        pushChar(char);
        pushNewLine();
        break;
      default:
        if (previousChar === CARRIAGE_RETURN) {
          pushNewLine();
        }
        pushChar(char);
        break;
    }
  }
  return lines;
}
