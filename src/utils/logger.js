const { COLORS } = require('../config/constants');

const info = (...args) => console.log(COLORS.BLUE, '[ZELEX] »:', ...args, COLORS.WHITE);

const success = (...args) => console.log(COLORS.GREEN, '[ZELEX] ✔:', ...args, COLORS.WHITE);

const warn = (...args) => console.warn(COLORS.YELLOW, '[ZELEX] ?:', ...args, COLORS.WHITE);

const error = (...args) => console.error(COLORS.RED, '[ZELEX]: ✖', ...args, COLORS.WHITE);

module.exports = {
  info,
  warn,
  error,
  success,
};
