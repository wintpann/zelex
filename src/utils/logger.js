const { COLORS } = require('../config/constants');

const info = (...args) => console.log(COLORS.BLUE, '[ZELEX] »:', ...args, COLORS.WHITE);

const success = (...args) => console.log(COLORS.GREEN, '[ZELEX] ✔:', ...args, COLORS.WHITE);

const warn = (...args) => console.warn(COLORS.YELLOW, '[ZELEX] ☢:', ...args, COLORS.WHITE);

const error = (message, err) => console.error(
  COLORS.RED, '[ZELEX]: ✖',
  message,
  { message: err.message, stack: err.stack },
  COLORS.WHITE,
);

module.exports = {
  info,
  warn,
  error,
  success,
};
