import ATXHeading from './LeafBlocks/ATXHeading';
import BlankLine from './LeafBlocks/BlankLine';
import IndentedCodeblock from './LeafBlocks/IndentedCodeBlock';
import Paragraph from './LeafBlocks/Paragraph';
import SetextHeading from './LeafBlocks/SetextHeading';
import ThematicBreak from './LeafBlocks/ThematicBreak';
import splitLines from './splitLines';

export default function parse(text) {
  const lines = splitLines(text);
  let nodes;

  // NOTE: These parsing sequences are very important.
  // Each parsing depends on these sequences.
  nodes = BlankLine.parseBlankLines(lines);
  nodes = ATXHeading.parseATXHeadings(lines);
  nodes = ThematicBreak.parseThematicBreaks(lines);
  nodes = IndentedCodeblock.parseThematicBreaks(lines);
  nodes = Paragraph.parseParagraphs(nodes);
  nodes = SetextHeading.parseSetextHeadings(nodes);
  console.log(nodes);
  return nodes;
}
