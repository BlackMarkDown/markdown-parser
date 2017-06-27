// @flow
import Block from './Block';
import Line from './Line';

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

export default function parseLines(lines: Line[]) {
  // NOTE: These parsing sequences are very important.
  // Each parsing depends on these sequences.
  const lineToBlockFuncs: Array<(Line[], (Line[]) => Block[]) => Block[]> = [
    ListItem.parseListItems,
    FencedCodeBlock.parseFencedCodeBlocks,
    BlockQuote.parseBlockQuotes,
    BlankLine.parseBlankLines,
    ATXHeading.parseATXHeadings,
    IndentedCodeBlock.parseIndentedCodeBlocks,
    SetextHeading.parseSetextHeadings,
    ThematicBreak.parseThematicBreaks,
  ];

  const finishingFunc: (Line[]) => Block[] = Paragraph.parseParagraphs;

  const linkedLineToBlockFunc: (Line[]) => Block[]
    = lineToBlockFuncs.reduceRight((next, func) =>
        remainedLines => func(remainedLines, next), finishingFunc);

  const parsedBlocks = linkedLineToBlockFunc(lines);

  const blockToBlockFunc: (Block[]) => Block[] = List.parseList;

  return blockToBlockFunc(parsedBlocks);
}
