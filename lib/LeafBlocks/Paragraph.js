// @flow
import LeafBlock from './LeafBlock';
import type Line from '../Line';
import type Block from '../Block';

export default class Paragraph extends LeafBlock {
  static parseParagraphs(lines: Line[]): Block[] {
    if (lines.length === 0) {
      return [];
    }
    return [new Paragraph(lines)];
  }
}
