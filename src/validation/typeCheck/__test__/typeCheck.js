const { describe, it } = require('mocha');
const { expect } = require('chai');

const {
  string,
  number,
} = require('../types');
const {
  typeCheck,
  expectType,
} = require('../index');

const checker = typeCheck(
  ['path', expectType('mongo//123', string)],
  ['number', expectType(123, number)],
);

describe('typeCheck', () => {
  it('should create checksets on init', () => {
    // eslint-disable-next-line no-underscore-dangle
    expect(checker._checkSets).to.have.length(2);
  });

  it('should append checksets on append method', () => {
    checker.append(
      ['path', expectType('mongo//123', string)],
      ['port', expectType(123, number)],
    );
    // eslint-disable-next-line no-underscore-dangle
    expect(checker._checkSets).to.have.length(4);
  });

  describe('should complete type check on complete method', () => {
    it('should not throw error on desired types', () => {
      let isError = false;
      try {
        checker.complete();
      } catch (e) {
        isError = true;
      }
      expect(isError).to.equal(false);
    });
    it('should throw error on not desired types', () => {
      let isError = false;
      let errorMsg;
      const desiredErrorMsg = 'test error';
      checker.append(
        ['id', expectType('string', number)],
      );
      try {
        checker.complete(desiredErrorMsg);
      } catch (e) {
        isError = true;
        errorMsg = e.message;
      }
      expect(isError).to.equal(true);
      expect(errorMsg).to.include(desiredErrorMsg);
    });
  });
});
