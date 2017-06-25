import splitLines from '../splitLines';
import parse from '../parse';

export default class ContainerBlock {
  constructor(text) {
    this.text = text;
    this.initChildren(text);
  }
  initChildren(text) {
    const lines = splitLines(text);
    const markerRemovedLines = lines.map(line =>
      this.removeMarkerAndIndentation(line));
    const markerRemovedText = markerRemovedLines.join('');
    this.children = parse(markerRemovedText);
  }
}
