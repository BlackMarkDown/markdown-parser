// @flow
export default class Block {
  render(): string {
    throw new Error('render function should be implemented in child class');
  }
}
