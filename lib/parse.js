import parseBlocks from './parseBlocks';
import splitLines from './splitLines';
import UnparsedLine from './UnparsedLine';

export default function parse(text) {
  const lines = splitLines(text);
  const unparsedBlocks = lines.map(line => new UnparsedLine(line));
  return parseBlocks(unparsedBlocks);
}
