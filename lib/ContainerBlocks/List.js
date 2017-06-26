import ContainerBlock from './ContainerBlock';
import ListItem from './ListItem';
import bundle from '../utils/bundle';

export default class List extends ContainerBlock {
  static parseList(blocks) {
    return bundle(blocks, List, (block => block instanceof ListItem));
  }
}
