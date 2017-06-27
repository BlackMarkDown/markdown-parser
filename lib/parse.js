// @flow
import parseLines from './parseLines';
import splitLines from './splitLines';

export default function parse(text: string) {
  const lines = splitLines(text);
  return parseLines(lines);
}
