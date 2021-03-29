const {
  optional,
  string,
  date,
  number,
  array,
  arrayOf,
  shape,
  oneOf,
  bool,
  never,
  func,
  positiveNumber,
} = require('./types');

const expectType = (value, validator) => validator(value, false);

const typeCheck = (...initialCheckSets) => ({
  _checkSets: initialCheckSets,
  append(...checkSets) {
    this._checkSets.push(...checkSets);
    return this;
  },
  complete(errorMessage = 'Type validation failed.') {
    const errors = [];
    this._checkSets.forEach((checkSet) => {
      const [fieldName, value, validator] = checkSet;
      const [isValid, errorMsg] = expectType(value, validator);
      if (!isValid) {
        const checkSetError = `${fieldName}: ${errorMsg}`;
        errors.push(checkSetError);
      }
    });
    if (errors.length) {
      const thrownMessage = `${errorMessage} ( ${errors.join(', ')} )`;
      throw new Error(thrownMessage);
    }
  },
});

module.exports = {
  typeCheck,
  expectType,
  optional,
  string,
  date,
  number,
  array,
  arrayOf,
  shape,
  oneOf,
  bool,
  never,
  func,
  positiveNumber,
};
