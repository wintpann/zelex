const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 12;

const LEVEL = {
  INFO: 2,
  WARN: 4,
  ERROR: 8,
  DEBUG: 16,
  FATAL: 32,
  ALL: [2, 4, 8, 16, 32],
};

module.exports = {
  SECOND,
  MINUTE,
  HOUR,
  DAY,
  LEVEL,
};
