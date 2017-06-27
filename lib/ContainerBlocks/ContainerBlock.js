// @flow
import Block from '../Block';

export default class ContainerBlock extends Block {
  blocks: Block[];
  constructor(blocks: Block[]) {
    super();
    this.blocks = blocks;
  }
}
