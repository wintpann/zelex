const crypto = require('crypto');
const {
  SECOND,
  MINUTE,
  HOUR,
  DAY,
} = require('../config/constants');

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const last = (array) => array[array.length - 1];

const first = (array) => array[0];

const noop = () => {};

const randomNumberInclusive = (min, max) => Math.round(Math.random() * (max - min) + min);

const randomString = (size = 10) => crypto
  .randomBytes(size)
  .toString('base64')
  .slice(0, size);

const randomNumberString = (size = 10) => {
  const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const iterations = Array.from({ length: size }, (v, i) => i);

  const str = iterations.reduce((acc) => acc + numbers[randomNumberInclusive(0, 9)], '');
  return str;
};

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

const getSegmentUnit = (segment) => {
  if (segment.endsWith('s')) {
    return SECOND;
  }
  if (segment.endsWith('m')) {
    return MINUTE;
  }
  if (segment.endsWith('h')) {
    return HOUR;
  }
  if (segment.endsWith('d')) {
    return DAY;
  }
  return 1;
};

const getTimeMs = (time) => {
  const isNumber = typeof time === 'number' && !Number.isNaN(time);
  if (isNumber) {
    return time;
  }

  const invalidTime = typeof time !== 'string';
  if (invalidTime) {
    return 0;
  }

  const segments = time.split(',');
  const result = segments.reduce((acc, segment) => {
    const segmentNumber = parseInt(segment, 10);
    const segmentUnit = getSegmentUnit(segment);

    const timePart = segmentUnit * segmentNumber;
    return acc + timePart;
  }, 0);
  return result;
};

module.exports = {
  delay,
  last,
  first,
  noop,
  randomString,
  randomNumberString,
  randomNumberInclusive,
  dig,
  getTimeMs,
};
