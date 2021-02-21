const crypto = require('crypto');

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const last = (array) => array[array.length - 1];

const first = (array) => array[0];

const noop = () => {};

const randomString = (size = 10) => crypto
  .randomBytes(size)
  .toString('base64')
  .slice(0, size);

const dig = (object = {}, path = '', defaultValue = '--') => {
  const levels = path.split('.');
  let stepValue = object;
  levels.forEach((level) => {
    try {
      stepValue = stepValue[level];
      // eslint-disable-next-line no-empty
    } catch (e) {}
  });
  return stepValue || defaultValue;
};

module.exports = {
  delay,
  last,
  first,
  noop,
  randomString,
  dig,
};
