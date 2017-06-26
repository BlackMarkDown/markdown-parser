// @flow
import Block from '../Block';

export default function bundle(blocks: Array<Block>,
  BlockClass: Class<Block>,
  isParsable: (Block) => boolean) {
  return blocks.map(block => (
    isParsable(block)
      ? [block]
      : block
    ))
    .reduce((prevResult, blockOrArray: Block | Array<Block>) => {
      const lastElement: Block | Array<Block> = prevResult[prevResult.length - 1];
      if (blockOrArray instanceof Array && lastElement instanceof Array) {
        return [...prevResult.slice(0, -1), [...lastElement, ...blockOrArray]];
      }
      return [...prevResult, blockOrArray];
    }, [])
    .map(blockOrArray => (
      blockOrArray instanceof Array
        ? new BlockClass(blockOrArray)
        : blockOrArray
    ));
}
