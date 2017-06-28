// @flow
import Block from '../Block';

export default class Text extends Block {
  text: string;
  constructor(text: string) {
    super();
    this.text = text;
  }
  render() {
    return this.text;
  }
}
