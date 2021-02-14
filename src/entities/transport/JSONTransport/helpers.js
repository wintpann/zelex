const logger = require('../../../utils/logger');

const getLogBuffer = (data) => {
  let buffer = null;
  try {
    const stringed = JSON.stringify(data);
    buffer = Buffer.from(stringed);
  } catch (e) {
    logger.error('could not buffering log', e);
  }
  return buffer;
};

module.exports = {
  getLogBuffer,
};
