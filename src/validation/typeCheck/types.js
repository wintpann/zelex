const gotValue = (value) => !(value == null);

const Validator = (failCondition, expected, isOptional) => {
  if (failCondition) {
    const errorMessage = `Expected ${expected}${isOptional ? ' or nothing' : ''}`;
    return [false, errorMessage];
  }
  return [true];
};

const optional = (validator) => (value) => {
  if (gotValue(value)) {
    return validator(value, { isOptional: true });
  }
  return [true];
};

const string = (value, { isOptional }) => Validator(
  typeof value !== 'string',
  'string',
  isOptional,
);

const date = (value, { isOptional }) => {
  const failedToParse = new Date(value).toString() === 'Invalid Date'
    && new Date(Number(value)).toString() === 'Invalid Date';
  return Validator(
    failedToParse,
    'valid date',
    isOptional,
  );
};

const number = (value, { isOptional }) => Validator(
  typeof value !== 'number',
  'number',
  isOptional,
);

const bool = (value, { isOptional }) => Validator(
  typeof value !== 'boolean',
  'boolean',
  isOptional,
);

const positiveNumber = (value, { isOptional }) => Validator(
  typeof Number(value) !== 'number' || Number(value) < 0,
  'positive number',
  isOptional,
);

const array = (value, { isOptional }) => Validator(
  !Array.isArray(value),
  'array',
  isOptional,
);

const oneOf = (...validators) => (value, { isOptional }) => {
  const errors = [];
  validators.forEach(
    (validator) => {
      const [isValid, errorMsg] = validator(value, { isOptional });
      if (!isValid) {
        errors.push(errorMsg.replace('Expected ', ''));
      }
    },
  );
  if (errors.length === validators.length) {
    const errorMsg = `Expected one of types: ${errors}`;
    return [false, errorMsg];
  }
  return [true];
};

const arrayOf = (itemValidator) => (value, { isOptional }) => {
  Validator(
    !Array.isArray(value),
    'array',
    isOptional,
  );
  for (let i = 0; i < value.length; i++) {
    const item = value[i];
    const [isValid, typeErrorMsg] = itemValidator(item, { isOptional: false });
    if (!isValid) {
      const errorMsg = `Wrong type of array items: ${typeErrorMsg}`;
      return [false, errorMsg];
    }
  }
  return [true];
};

const shape = (object) => (value, { isOptional }) => {
  const keysErrors = [];
  if (typeof value !== 'object' || Array.isArray(value)) {
    const errorMsg = `Expected object${isOptional ? ' or nothing' : ''}`;
    return [false, errorMsg];
  }
  Object.keys(object).forEach(
    (fieldName) => {
      const fieldValidator = object[fieldName];
      const fieldToValidate = value && value[fieldName];
      const [isValid, errorMsg] = fieldValidator(fieldToValidate, { isOptional: false });
      if (!isValid) {
        keysErrors.push(`${fieldName}: ${errorMsg}`);
      }
    },
  );
  if (keysErrors.length) {
    const errorMsg = `{ ${keysErrors.join(', ')} }`;
    return [false, errorMsg];
  }
  return [true];
};

module.exports = {
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
