// @flow
import type Block from './Block';

import Emphasis from './Inlines/Emphasis';
import Text from './Inlines/Text';

export default function parseInline(text: string): Block[] {
  // NOTE: These parsing sequences are very important.
  // Each parsing depends on these sequences.
  const lineToBlockFuncs: Array<(string, (string) => Block[]) => Block[]> = [
    Emphasis.parseEmphasises,
  ];

  const finishingFunc: (string) => Block[] = (lastText) => {
    if (lastText.length === 0) {
      return [];
    }
    return [new Text(lastText)];
  };

  const linkedStringToBlockFunc: (string) => Block[]
    = lineToBlockFuncs.reduceRight((next, func) =>
        remainedLines => func(remainedLines, next), finishingFunc);

  return linkedStringToBlockFunc(text);
}
