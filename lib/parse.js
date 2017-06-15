// import BlankLine from './LeafBlocks/BlankLine';
import splitLines from './splitLines';

export default function parse(text) {
  const lines = splitLines(text);
  console.log(lines);
}
