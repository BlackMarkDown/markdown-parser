// @flow
import {
  CARRIAGE_RETURN,
  NEWLINE,
} from './utils/Characters';
import Line from './Line';

export default function splitLines(text: string): Line[] {
  /**
    * A line is a sequence of zero or more characters other than newline (U+000A)
    * or carriage return (U+000D), followed by a line ending or by the end of file.
    *
    * A line ending is a newline (U+000A), a carriage return (U+000D) not followed
    * by a newline, or a carriage return and a following newline.
    * http://spec.commonmark.org/0.27/#line
    */
  const lines: string[] = [''];
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
  return lines.map(line => new Line(line));
}
