const { COLORS } = require('../config/constants');
const { noop } = require('../helpers/common');

const isProd = process.env.NODE_ENV === 'production';

const info = (...args) => (isProd ? noop : console.log(COLORS.BLUE, '[ZELEX] »:', ...args, COLORS.WHITE));

const success = (...args) => (isProd ? noop : console.log(COLORS.GREEN, '[ZELEX] ✔:', ...args, COLORS.WHITE));

const warn = (...args) => (isProd ? noop : console.warn(COLORS.YELLOW, '[ZELEX] ☢:', ...args, COLORS.WHITE));

const error = (message, err) => (isProd ? noop : console.error(
  COLORS.RED, '[ZELEX]: ✖',
  message,
  { message: err.message, stack: err.stack },
  COLORS.WHITE,
));

module.exports = {
  info,
  warn,
  error,
  success,
};
