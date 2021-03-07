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

const LEVEL_HUMANIZED = {
  [LEVEL.INFO]: 'Info',
  [LEVEL.WARN]: 'Warning',
  [LEVEL.ERROR]: 'Error',
  [LEVEL.DEBUG]: 'Debug',
  [LEVEL.FATAL]: 'Fatal',
};

const ZX_PRIVATE = Symbol('ZX_PRIVATE');

const COLORS = {
  RED: '\x1b[31m',
  GREEN: '\x1b[32m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
};

module.exports = {
  SECOND,
  MINUTE,
  HOUR,
  DAY,
  LEVEL,
  LEVEL_HUMANIZED,
  ZX_PRIVATE,
  COLORS,
};
