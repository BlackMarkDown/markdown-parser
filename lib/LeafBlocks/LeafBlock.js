// @flow
import Block from '../Block';
import Line from '../Line';
import parseInline from '../parseInline';

export default class LeafBlock extends Block {
  inlines: Block[];
  constructor(lines: Line[]) {
    super();
    this.inlines = lines.map(line => parseInline(line.text))
    .reduce((prevResult, inlines) => ([...prevResult, ...inlines]));
  }
  render(): string {
    return this.inlines.map(block => block.render()).join('');
  }
}
