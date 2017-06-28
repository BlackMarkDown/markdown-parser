// @flow
import type Block from './Block';
import parse from './parse';

export default function render(text: string): string {
  const tree: Block[] = parse(text);
  return tree.map(block => block.render()).join('');
}
