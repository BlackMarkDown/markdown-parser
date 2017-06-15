import {
  expect,
} from 'chai';
import BlankLine from '../../lib/LeafBlocks/BlankLine';

describe('BlankBlock', () => {
  describe('isBlankLine', () => {
    const testCases = [];
    function AddTest(test, answer) {
      testCases.push({ test, answer });
    }
    AddTest('asdf\nasdf', false);
    AddTest('asdf\rasdf', false);
    AddTest('asdf\r\nasdf', false);
    AddTest('asdf\n\rasdf', false);
    AddTest('asdf\nasdf\n', false);
    AddTest('\n', true);
    AddTest('\na', false);
    AddTest('\r', true);
    AddTest('\ra', false);
    AddTest('', true);
    AddTest('a', false);
    AddTest(' ', true);
    AddTest('  ', true);
    AddTest(' a', false);
    AddTest('\t', true);
    AddTest('\t\t', true);
    AddTest('\ta', false);

    testCases.forEach((testCase) => {
      const {
        test,
        answer,
      } = testCase;
      it(`should BlankLine.isBlankLine('${test}') equal ${answer}`, () =>
        expect(BlankLine.isBlankLine(test)).to.equal(answer));
    });
  });
});
