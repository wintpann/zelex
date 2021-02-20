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
    return validator(value, true);
  }
  return [true];
};

const string = (value, isOptional) => Validator(
  typeof value !== 'string',
  'string',
  isOptional,
);

const date = (value, isOptional) => {
  const failedToParse = new Date(value).toString() === 'Invalid Date';
  return Validator(
    failedToParse,
    'valid date',
    isOptional,
  );
};

const number = (value, isOptional) => Validator(
  typeof value !== 'number',
  'number',
  isOptional,
);

const bool = (value, isOptional) => Validator(
  typeof value !== 'boolean',
  'boolean',
  isOptional,
);

const never = (value) => Validator(
  typeof value !== 'undefined',
  'never',
  false,
);

const func = (value, isOptional) => Validator(
  typeof value !== 'function',
  'function',
  isOptional,
);

const positiveNumber = (value, isOptional) => Validator(
  typeof value !== 'number' || value < 0,
  'positive number',
  isOptional,
);

const array = (value, isOptional) => Validator(
  !Array.isArray(value),
  'array',
  isOptional,
);

const oneOf = (...validators) => (value, isOptional) => {
  const errors = [];
  validators.forEach(
    (validator) => {
      const [isValid, errorMsg] = validator(value, isOptional);
      if (!isValid) {
        const oneOfError = errorMsg.replace('Expected ', '');
        errors.push(oneOfError);
      }
    },
  );
  const allValidatorsFailed = errors.length === validators.length;
  if (allValidatorsFailed) {
    const errorMsg = `Expected one of types: ${errors}`;
    return [false, errorMsg];
  }
  return [true];
};

const arrayOf = (itemValidator) => (value, isOptional) => {
  const [notArray] = Validator(
    !Array.isArray(value),
    'array',
    isOptional,
  );
  if (!notArray) {
    return [false, 'Expected array'];
  }
  for (let i = 0; i < value.length; i++) {
    const item = value[i];
    const [isValid, typeErrorMsg] = itemValidator(item, false);
    if (!isValid) {
      const errorMsg = `Wrong type of array items: ${typeErrorMsg}`;
      return [false, errorMsg];
    }
  }
  return [true];
};

const shape = (object) => (value, isOptional) => {
  const keysErrors = [];
  const notObject = typeof value !== 'object' || Array.isArray(value);
  if (notObject) {
    const errorMsg = `Expected object${isOptional ? ' or nothing' : ''}`;
    return [false, errorMsg];
  }
  const objFields = Object.keys(object);
  objFields.forEach(
    (fieldName) => {
      const fieldValidator = object[fieldName];
      const fieldToValidate = value && value[fieldName];
      const [isValid, errorMsg] = fieldValidator(fieldToValidate, false);
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
  never,
  func,
  positiveNumber,
};
