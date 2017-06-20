import BlockQuote from './ContainerBlocks/BlockQuote';
import List from './ContainerBlocks/List';
import ListItem from './ContainerBlocks/ListItem';

import ATXHeading from './LeafBlocks/ATXHeading';
import BlankLine from './LeafBlocks/BlankLine';
import FencedCodeBlock from './LeafBlocks/FencedCodeBlock';
import IndentedCodeblock from './LeafBlocks/IndentedCodeBlock';
import Paragraph from './LeafBlocks/Paragraph';
import SetextHeading from './LeafBlocks/SetextHeading';
import ThematicBreak from './LeafBlocks/ThematicBreak';

import splitLines from './splitLines';


export default function parse(text) {
  let lines = splitLines(text);
  // NOTE: These parsing sequences are very important.
  // Each parsing depends on these sequences.
  lines = ListItem.parseListItems(lines);
  lines = List.parseList(lines);
  lines = FencedCodeBlock.parseFencedCodeBlocks(lines);
  lines = BlockQuote.parseBlockQuotes(lines);
  lines = BlankLine.parseBlankLines(lines);
  lines = ATXHeading.parseATXHeadings(lines);
  lines = ThematicBreak.parseThematicBreaks(lines);
  lines = IndentedCodeblock.parseIndentedCodeblocks(lines);
  lines = SetextHeading.parseSetextHeadings(lines);
  lines = Paragraph.parseParagraphs(lines);
  console.log(lines);
  return lines;
}
