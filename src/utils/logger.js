const { COLORS } = require('../config/constants');

const info = (...args) => console.log(COLORS.BLUE, '[ZELEX] INFO:', ...args);

const success = (...args) => console.log(COLORS.GREEN, '[ZELEX] INFO:', ...args);

const warn = (...args) => console.warn(COLORS.YELLOW, '[ZELEX]: WARNING', ...args);

const error = (...args) => console.error(COLORS.RED, '[ZELEX]: ERROR', ...args);

module.exports = {
  info,
  warn,
  error,
  success,
};
