import LeafBlock from './LeafBlock';
import UnparsedLineBlock from '../UnparsedLineBlock';
import bundle from '../utils/bundle';

export default class Paragraph extends LeafBlock {
  static parseParagraphs(blocks) {
    return bundle(blocks, Paragraph, (block => block instanceof UnparsedLineBlock));
  }
}
