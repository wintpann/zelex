const {
  SECOND,
  HOUR,
  DAY,
} = require('../../../config/constants');

const CLEAR_INTERVAL = DAY;
const DEFAULT_SAVE_INTERVAL = SECOND * 10;
const DEFAULT_CLEAR_AFTER = HOUR * 10;
const SAVE_REQUEST_LOGS = true;
const SAVE_DATA_LOGS = true;

module.exports = {
  CLEAR_INTERVAL,
  DEFAULT_SAVE_INTERVAL,
  DEFAULT_CLEAR_AFTER,
  SAVE_REQUEST_LOGS,
  SAVE_DATA_LOGS,
};
