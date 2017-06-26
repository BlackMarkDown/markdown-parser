// @flow
import Block from './Block';
import Line from './Line';

export default class UnparsedLineBlock extends Block {
  line: Line;
  constructor(line: Line) {
    super(line);
    this.line = line;
  }
}
