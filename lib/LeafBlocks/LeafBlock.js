// @flow
import Block from '../Block';
import Line from '../Line';

export default class LeafBlock extends Block {
  lines: Line[]
  constructor(lines: Line[]) {
    super();
    this.lines = lines;
  }
}
