import BlockQuote from './ContainerBlocks/BlockQuote';
import List from './ContainerBlocks/List';
import ListItem from './ContainerBlocks/ListItem';

import ATXHeading from './LeafBlocks/ATXHeading';
import BlankLine from './LeafBlocks/BlankLine';
import FencedCodeBlock from './LeafBlocks/FencedCodeBlock';
import IndentedCodeBlock from './LeafBlocks/IndentedCodeBlock';
import Paragraph from './LeafBlocks/Paragraph';
import SetextHeading from './LeafBlocks/SetextHeading';
import ThematicBreak from './LeafBlocks/ThematicBreak';

export default function parseBlocks(blocks) {
  // NOTE: These parsing sequences are very important.
  // Each parsing depends on these sequences.
  const functionSequence = [
    ListItem.parseListItems,
    List.parseList,
    FencedCodeBlock.parseFencedCodeBlocks,
    BlockQuote.parseBlockQuotes,
    BlankLine.parseBlankLines,
    ATXHeading.parseATXHeadings,
    IndentedCodeBlock.parseIndentedCodeBlocks,
    SetextHeading.parseSetextHeadings,
    ThematicBreak.parseThematicBreaks,
    Paragraph.parseParagraphs,
  ];
  return functionSequence.reduce((prevResult, func) => {
    const result = func(prevResult);
    console.log(func.name, result);
    return result;
  }, blocks);
}
