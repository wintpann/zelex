const info = (...args) => console.log('[ZELEX] INFO:', ...args);

const warn = (...args) => console.warn('[ZELEX]: WARNING', ...args);

const error = (...args) => console.error('[ZELEX]: ERROR', ...args);

module.exports = {
  info,
  warn,
  error,
};
