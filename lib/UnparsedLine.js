import Block from './Block';

export default class UnparsedLine extends Block {
  constructor(text) {
    if (typeof text !== 'string') {
      throw new Error('unparsed line constructor only get one string argument');
    }
    super(text);
    this.text = text;
  }
}
