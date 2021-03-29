const { describe, it } = require('mocha');
const { expect } = require('chai');

const {
  string,
  date,
  number,
  array,
  bool,
  func,
  never,
  positiveNumber,
  optional,
  arrayOf,
  shape,
  oneOf,
} = require('../types');
const { expectType } = require('../index');

const VALUES = {
  DATE: new Date(),
  DATE_STRING: '2021-01-23T15:28:53.276Z',
  STRING: 'string',
  ARRAY: [1, 2, 3],
  ARRAY_EMPTY: [],
  ARRAY_BOOL: [false, true],
  OBJECT: {},
  BOOL: false,
  POSITIVE_NUMBER: 123,
  NEGATIVE_NUMBER: -123,
  FUNC: () => {},
  NEVER: undefined,
};

describe('type checkers', () => {
  describe('string validator', () => {
    it('should fail on date', () => {
      const [result] = expectType(VALUES.DATE, string);
      expect(result).to.equal(false);
    });

    it('should fail on bool', () => {
      const [result] = expectType(VALUES.BOOL, string);
      expect(result).to.equal(false);
    });

    it('should fail on number', () => {
      const [result] = expectType(VALUES.POSITIVE_NUMBER, string);
      expect(result).to.equal(false);
    });

    it('should fail on array', () => {
      const [result] = expectType(VALUES.ARRAY, string);
      expect(result).to.equal(false);
    });

    it('should fail on func', () => {
      const [result] = expectType(VALUES.FUNC, string);
      expect(result).to.equal(false);
    });

    it('should fail on undefined', () => {
      const [result] = expectType(VALUES.NEVER, string);
      expect(result).to.equal(false);
    });

    it('should pass on string', () => {
      const [result] = expectType(VALUES.STRING, string);
      expect(result).to.equal(true);
    });
  });

  describe('date validator', () => {
    it('should fail on empty array', () => {
      const [result] = expectType(VALUES.ARRAY_EMPTY, date);
      expect(result).to.equal(false);
    });

    it('should fail on string', () => {
      const [result] = expectType(VALUES.STRING, date);
      expect(result).to.equal(false);
    });

    it('should pass on bool', () => {
      const [result] = expectType(VALUES.BOOL, date);
      expect(result).to.equal(true);
    });

    it('should pass on number', () => {
      const [result] = expectType(VALUES.POSITIVE_NUMBER, date);
      expect(result).to.equal(true);
    });
    it('should pass on array', () => {
      const [result] = expectType(VALUES.ARRAY, date);
      expect(result).to.equal(true);
    });

    it('should pass on date string', () => {
      const [result] = expectType(VALUES.DATE_STRING, date);
      expect(result).to.equal(true);
    });

    it('should fail on func', () => {
      const [result] = expectType(VALUES.FUNC, date);
      expect(result).to.equal(false);
    });

    it('should fail on undefined', () => {
      const [result] = expectType(VALUES.NEVER, date);
      expect(result).to.equal(false);
    });

    it('should pass on date', () => {
      const [result] = expectType(VALUES.DATE, date);
      expect(result).to.equal(true);
    });
  });

  describe('number validator', () => {
    it('should fail on array', () => {
      const [result] = expectType(VALUES.ARRAY, number);
      expect(result).to.equal(false);
    });

    it('should fail on string', () => {
      const [result] = expectType(VALUES.STRING, number);
      expect(result).to.equal(false);
    });

    it('should fail on bool', () => {
      const [result] = expectType(VALUES.BOOL, number);
      expect(result).to.equal(false);
    });

    it('should fail on date', () => {
      const [result] = expectType(VALUES.DATE, number);
      expect(result).to.equal(false);
    });

    it('should fail on func', () => {
      const [result] = expectType(VALUES.FUNC, number);
      expect(result).to.equal(false);
    });

    it('should fail on undefined', () => {
      const [result] = expectType(VALUES.NEVER, number);
      expect(result).to.equal(false);
    });

    it('should pass on number', () => {
      const [result] = expectType(VALUES.POSITIVE_NUMBER, number);
      expect(result).to.equal(true);
    });
  });

  describe('positive number validator', () => {
    it('should fail on array', () => {
      const [result] = expectType(VALUES.ARRAY, positiveNumber);
      expect(result).to.equal(false);
    });

    it('should fail on string', () => {
      const [result] = expectType(VALUES.STRING, positiveNumber);
      expect(result).to.equal(false);
    });

    it('should fail on bool', () => {
      const [result] = expectType(VALUES.BOOL, positiveNumber);
      expect(result).to.equal(false);
    });

    it('should fail on date', () => {
      const [result] = expectType(VALUES.DATE, positiveNumber);
      expect(result).to.equal(false);
    });

    it('should fail on negative number', () => {
      const [result] = expectType(VALUES.NEGATIVE_NUMBER, positiveNumber);
      expect(result).to.equal(false);
    });

    it('should fail on func', () => {
      const [result] = expectType(VALUES.FUNC, positiveNumber);
      expect(result).to.equal(false);
    });

    it('should fail on undefined', () => {
      const [result] = expectType(VALUES.NEVER, positiveNumber);
      expect(result).to.equal(false);
    });

    it('should pass on positive number', () => {
      const [result] = expectType(VALUES.POSITIVE_NUMBER, positiveNumber);
      expect(result).to.equal(true);
    });
  });

  describe('array validator', () => {
    it('should fail on string', () => {
      const [result] = expectType(VALUES.STRING, array);
      expect(result).to.equal(false);
    });

    it('should fail on bool', () => {
      const [result] = expectType(VALUES.BOOL, array);
      expect(result).to.equal(false);
    });

    it('should fail on date', () => {
      const [result] = expectType(VALUES.DATE, array);
      expect(result).to.equal(false);
    });

    it('should fail on number', () => {
      const [result] = expectType(VALUES.POSITIVE_NUMBER, array);
      expect(result).to.equal(false);
    });

    it('should fail on func', () => {
      const [result] = expectType(VALUES.FUNC, array);
      expect(result).to.equal(false);
    });

    it('should fail on undefined', () => {
      const [result] = expectType(VALUES.NEVER, array);
      expect(result).to.equal(false);
    });

    it('should pass on array', () => {
      const [result] = expectType(VALUES.ARRAY, array);
      expect(result).to.equal(true);
    });
  });

  describe('arrayOf validator', () => {
    it('should fail on string', () => {
      const [result] = expectType(VALUES.STRING, arrayOf(bool));
      expect(result).to.equal(false);
    });

    it('should fail on bool', () => {
      const [result] = expectType(VALUES.BOOL, arrayOf(bool));
      expect(result).to.equal(false);
    });

    it('should fail on date', () => {
      const [result] = expectType(VALUES.DATE, arrayOf(bool));
      expect(result).to.equal(false);
    });

    it('should fail on number', () => {
      const [result] = expectType(VALUES.POSITIVE_NUMBER, arrayOf(bool));
      expect(result).to.equal(false);
    });

    it('should fail on not desired array', () => {
      const [result] = expectType(VALUES.ARRAY, arrayOf(bool));
      expect(result).to.equal(false);
    });

    it('should pass on desired array', () => {
      const [result] = expectType(VALUES.ARRAY_BOOL, arrayOf(bool));
      expect(result).to.equal(true);
    });
  });

  describe('bool validator', () => {
    it('should fail on string', () => {
      const [result] = expectType(VALUES.STRING, bool);
      expect(result).to.equal(false);
    });

    it('should fail on date', () => {
      const [result] = expectType(VALUES.DATE, bool);
      expect(result).to.equal(false);
    });

    it('should fail on number', () => {
      const [result] = expectType(VALUES.POSITIVE_NUMBER, bool);
      expect(result).to.equal(false);
    });

    it('should fail on array', () => {
      const [result] = expectType(VALUES.ARRAY, bool);
      expect(result).to.equal(false);
    });

    it('should fail on func', () => {
      const [result] = expectType(VALUES.FUNC, bool);
      expect(result).to.equal(false);
    });

    it('should fail on undefined', () => {
      const [result] = expectType(VALUES.NEVER, bool);
      expect(result).to.equal(false);
    });

    it('should pass on bool', () => {
      const [result] = expectType(VALUES.BOOL, bool);
      expect(result).to.equal(true);
    });
  });

  describe('oneOf validator', () => {
    const desiredValidator = oneOf(bool, string);

    it('should fail on not included type', () => {
      const [arrayValid] = expectType(VALUES.ARRAY, desiredValidator);
      expect(arrayValid).to.equal(false);

      const [numberValid] = expectType(VALUES.POSITIVE_NUMBER, desiredValidator);
      expect(numberValid).to.equal(false);
    });

    it('should pass on included type', () => {
      const [boolValid] = expectType(VALUES.BOOL, desiredValidator);
      expect(boolValid).to.equal(true);

      const [stringValid] = expectType(VALUES.STRING, desiredValidator);
      expect(stringValid).to.equal(true);
    });
  });

  describe('shape validator', () => {
    const desiredValidator = shape({
      a: bool,
      b: string,
    });

    const desiredValue = {
      a: VALUES.BOOL,
      b: VALUES.STRING,
    };

    const notDesiredValue = {
      a: VALUES.STRING,
      b: VALUES.DATE,
    };

    it('should fail on not desired type', () => {
      const [arrayValid] = expectType(notDesiredValue, desiredValidator);
      expect(arrayValid).to.equal(false);
    });

    it('should pass on desired type', () => {
      const [stringValid] = expectType(desiredValue, desiredValidator);
      expect(stringValid).to.equal(true);
    });
  });

  describe('func validator', () => {
    it('should fail on array', () => {
      const [result] = expectType(VALUES.ARRAY, func);
      expect(result).to.equal(false);
    });

    it('should fail on string', () => {
      const [result] = expectType(VALUES.STRING, func);
      expect(result).to.equal(false);
    });

    it('should fail on bool', () => {
      const [result] = expectType(VALUES.BOOL, func);
      expect(result).to.equal(false);
    });

    it('should fail on date', () => {
      const [result] = expectType(VALUES.DATE, func);
      expect(result).to.equal(false);
    });

    it('should fail on number', () => {
      const [result] = expectType(VALUES.POSITIVE_NUMBER, func);
      expect(result).to.equal(false);
    });

    it('should fail on undefined', () => {
      const [result] = expectType(VALUES.NEVER, func);
      expect(result).to.equal(false);
    });

    it('should pass on func', () => {
      const [result] = expectType(VALUES.FUNC, func);
      expect(result).to.equal(true);
    });
  });

  describe('func validator', () => {
    it('should fail on array', () => {
      const [result] = expectType(VALUES.ARRAY, never);
      expect(result).to.equal(false);
    });

    it('should fail on string', () => {
      const [result] = expectType(VALUES.STRING, never);
      expect(result).to.equal(false);
    });

    it('should fail on bool', () => {
      const [result] = expectType(VALUES.BOOL, never);
      expect(result).to.equal(false);
    });

    it('should fail on date', () => {
      const [result] = expectType(VALUES.DATE, never);
      expect(result).to.equal(false);
    });

    it('should fail on number', () => {
      const [result] = expectType(VALUES.POSITIVE_NUMBER, never);
      expect(result).to.equal(false);
    });

    it('should fail on func', () => {
      const [result] = expectType(VALUES.FUNC, never);
      expect(result).to.equal(false);
    });

    it('should pass on undefined', () => {
      const [result] = expectType(VALUES.NEVER, never);
      expect(result).to.equal(true);
    });
  });

  describe('optional modifier', () => {
    const desiredValidator = optional(string);

    it('should fail on not desired type', () => {
      const [boolValid] = expectType(VALUES.ARRAY, desiredValidator);
      expect(boolValid).to.equal(false);
    });

    it('should pass on missing value', () => {
      const [arrayValid] = expectType(null, desiredValidator);
      expect(arrayValid).to.equal(true);
    });

    it('should pass on desired type', () => {
      const [boolValid] = expectType(VALUES.STRING, desiredValidator);
      expect(boolValid).to.equal(true);
    });
  });
});
