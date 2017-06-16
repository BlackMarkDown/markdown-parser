import LeafBlock from './LeafBlock';
import BlankLine from './BlankLine';
import {
  SPACE,
  TAB,
} from '../utils/Characters';

export default class IndentedCodeBlock extends LeafBlock {
  static isIndentedChunk(line) {
    return typeof line === 'string' &&
      (line[0] === TAB
        || (line[0] === SPACE
          && line[1] === SPACE
          && line[2] === SPACE
          && line[3] === SPACE));
  }
  static parseIndentedCodeBlocks(lines) {
    const returnLines = [];
    const STATE = {
      FINDING_START_OF_INDENTED_CODE_BLOCK: 'FINDING_START_OF_INDENTED_CODE_BLOCK',
      FINDING_END_OF_INDENTED_CODE_BLOCK: 'FINDING_END_OF_INDENTED_CODE_BLOCK',
    };
    let state = STATE.FINDING_START_LINE_OF_INDENTED_CODE_BLOCK;

    const candidates = [];
    let previousLine;
    lines.forEach((line, index) => {
      switch (state) {
        case STATE.FINDING_START_OF_INDENTED_CODE_BLOCK: {
          const isStart = IndentedCodeBlock.isIndentedChunk(line)
            && (!previousLine || BlankLine.isBlankLine(previousLine));
          if (isStart) {
            candidates.push(line);
            state = STATE.FINDING_END_OF_INDENTED_CODE_BLOCK;
          } else {
            returnLines.push(line);
          }
        } break;
        case STATE.FINDING_END_OF_INDENTED_CODE_BLOCK: {
          const isCandidate = IndentedCodeBlock.isIndentedChunk(line)
            || BlankLine.isBlankLine(line);
          if (isCandidate) {
            candidates.push(line);
          }
          const isLastLine = index === lines.length - 1;
          const isStoped = !isCandidate || isLastLine;
          if (isStoped) {
            const tailingBlankLines = [];
            while (BlankLine.isBlankLine(candidates[candidates.length - 1])) {
              const tailingBlankLine = candidates.pop();
              tailingBlankLines.push(tailingBlankLine);
            }
            const text = candidates.reduce((previousResult, candidate) =>
              `${previousResult}${candidate.text ? candidate.text : candidate}`, '');
            const indentedCodeBlock = new IndentedCodeBlock(text);
            returnLines.push(indentedCodeBlock, ...tailingBlankLines);
            state = STATE.FINDING_START_OF_INDENTED_CODE_BLOCK;
          }
          if (!isCandidate) {
            returnLines.push(line);
          }
        } break;
        default:
          throw new Error('invalid state');
      }
      previousLine = line;
    });
    return returnLines;
  }
}
