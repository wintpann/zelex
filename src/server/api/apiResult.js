const logger = require('../utils/logger');

const apiResult = async (methodCall) => {
  const result = { err: null, res: null };
  try {
    const res = await methodCall;
    result.res = res.data;
  } catch (e) {
    logger.error('api call failed', e);
    result.err = e;
  }
  return result;
};

module.exports = apiResult;
