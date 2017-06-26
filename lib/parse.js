import parseBlocks from './parseBlocks';
import splitLines from './splitLines';
import UnparsedLineBlock from './UnparsedLineBlock';

export default function parse(text) {
  const lines = splitLines(text);
  const unparsedLineBlocks = lines.map(line => new UnparsedLineBlock(line));
  return parseBlocks(unparsedLineBlocks);
}
