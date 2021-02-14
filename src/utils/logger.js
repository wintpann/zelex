// TODO add better implementation

const info = (...args) => console.log('[INFO]', ...args);

const error = (...args) => console.log('[ERROR]', ...args);

module.exports = {
  info,
  error,
};
