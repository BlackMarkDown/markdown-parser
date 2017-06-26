import LeafBlock from './LeafBlock';
import UnparsedLine from '../UnparsedLine';

export default class Paragraph extends LeafBlock {
  static parseParagraphs(blocks) {
    const returnBlocks = [];
    let unparsedLines = [];
    blocks.forEach((block, index) => {
      const isUnparsedLine = block instanceof UnparsedLine;
      if (isUnparsedLine) {
        unparsedLines.push(block);
      }
      const isLastBlock = index === blocks.length - 1;
      if (unparsedLines.length > 0 && (isLastBlock || !isUnparsedLine)) {
        const paragraph = new Paragraph(unparsedLines);
        returnBlocks.push(paragraph);
        unparsedLines = [];
      }

      if (!isUnparsedLine) {
        returnBlocks.push(block);
      }
    });
    return returnBlocks;
  }
}
