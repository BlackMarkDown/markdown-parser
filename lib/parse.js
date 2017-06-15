import ATXHeading from './LeafBlocks/ATXHeading';
import BlankLine from './LeafBlocks/BlankLine';
import Paragraph from './LeafBlocks/Paragraph';
import ThematicBreak from './LeafBlocks/ThematicBreak';
import splitLines from './splitLines';

export default function parse(text) {
  const lines = splitLines(text);
  let nodes;
  nodes = BlankLine.parseBlankLines(lines);
  nodes = ATXHeading.parseATXHeadings(lines);
  nodes = ThematicBreak.parseThematicBreaks(lines);
  nodes = Paragraph.parseParagraphs(nodes);
  console.log(nodes);
  return nodes;
}
