import {
  expect,
} from 'chai';
import splitLines from '../lib/splitLines';

describe('splitLines', () => {
  const testCases = [];
  function AddTest(test, answer) {
    testCases.push({ test, answer });
  }
  AddTest('asdf\nasdf', ['asdf\n', 'asdf']);
  AddTest('asdf\rasdf', ['asdf\r', 'asdf']);
  AddTest('asdf\r\nasdf', ['asdf\r\n', 'asdf']);
  AddTest('asdf\n\rasdf', ['asdf\n', '\r', 'asdf']);
  AddTest('asdf\nasdf\n', ['asdf\n', 'asdf\n', '']);

  testCases.forEach(testCase =>
    it('should pass all test', () => {
      const {
        test,
        answer,
      } = testCase;
      expect(splitLines(test)).to.deep.equal(answer);
    }));
});
