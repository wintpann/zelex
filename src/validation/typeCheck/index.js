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
  positiveNumber,
} = require('./types');

const typeCheck = (initialCheckSets = []) => ({
  _checkSets: initialCheckSets,
  append(checkSets) {
    this._checkSets = [...this._checkSets, ...checkSets];
    return this;
  },
  complete(errorMessage = 'Type validation failed.') {
    const errors = [];
    this._checkSets.forEach((checkSet) => {
      const [fieldName, [isValid, errorMsg]] = checkSet;
      if (!isValid) {
        errors.push(`${fieldName}: ${errorMsg}`);
      }
    });
    if (errors.length) {
      const thrownMessage = `${errorMessage} ( ${errors.join(', ')} )`;
      throw new Error(thrownMessage);
    }
  },
});

const expectType = (value, validator) => validator(value, { isOptional: false });

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
  positiveNumber,
};
