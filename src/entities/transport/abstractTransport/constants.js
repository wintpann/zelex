const {
  MINUTE,
  HOUR,
  DAY,
  LEVEL,
} = require('../../../config/constants');

const CLEAR_INTERVAL = DAY;
const DEFAULT_SAVE_INTERVAL = MINUTE * 15;
const DEFAULT_CLEAR_AFTER = HOUR * 10;

const SAVE_REQUEST_LOGS = true;
const SAVE_DATA_LOG_LEVELS = LEVEL.ALL;

const DEFAULT_AUTH = () => ({
  denied: false,
  message: '',
});

module.exports = {
  CLEAR_INTERVAL,
  DEFAULT_SAVE_INTERVAL,
  DEFAULT_CLEAR_AFTER,
  SAVE_REQUEST_LOGS,
  SAVE_DATA_LOG_LEVELS,
  DEFAULT_AUTH,
};
