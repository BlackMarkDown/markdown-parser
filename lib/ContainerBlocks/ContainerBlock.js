// @flow
import Block from '../Block';

export default class ContainerBlock extends Block {
  blocks: Block[];
  constructor(blocks: Block[]) {
    super();
    this.blocks = blocks;
  }
  render(): string {
    return this.blocks.map(block => block.render()).join('');
  }
}
