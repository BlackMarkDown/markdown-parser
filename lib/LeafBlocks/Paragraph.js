import LeafBlock from './LeafBlock';

export default class Paragraph extends LeafBlock {
  static parseParagraphs(lines) {
    return lines.reduce((prevResult, line) => {
      if (typeof line === 'string') {
        const lastLine = prevResult[prevResult.length - 1];
        if (lastLine instanceof Paragraph) {
          const newParagraph = new Paragraph(`${lastLine.text}${line}`);
          return [...prevResult.slice(0, -1), newParagraph];
        }
        const newParagraph = new Paragraph(line);
        return [...prevResult, newParagraph];
      }
      return [...prevResult, line];
    }, []);
  }
}
