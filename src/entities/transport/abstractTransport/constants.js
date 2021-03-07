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

const SORT_OPTIONS = {
  createDateAsc: {
    mongo: { 'time.started': 1 },
    dropdown: { id: 'createDateAsc', name: 'Creation Date (increasing)' },
  },
  createDateDesc: {
    mongo: { 'time.started': -1 },
    dropdown: { id: 'createDateDesc', name: 'Creation Date (decreasing)' },
  },
  durationAsc: {
    mongo: { 'time.duration': 1 },
    dropdown: { id: 'durationAsc', name: 'Duration (increasing)' },
  },
  durationDesc: {
    mongo: { 'time.duration': -1 },
    dropdown: { id: 'durationDesc', name: 'Duration (decreasing)' },
  },
  trafficAsc: {
    mongo: { 'traffic.total': 1 },
    dropdown: { id: 'trafficAsc', name: 'Traffic (increasing)' },
  },
  trafficDesc: {
    mongo: { 'traffic.total': -1 },
    dropdown: { id: 'trafficDesc', name: 'Traffic (decreasing)' },
  },
};

const DEFAULT_SORT_KEY = Object.keys(SORT_OPTIONS)[0];

module.exports = {
  CLEAR_INTERVAL,
  DEFAULT_SAVE_INTERVAL,
  DEFAULT_CLEAR_AFTER,
  SAVE_REQUEST_LOGS,
  SAVE_DATA_LOG_LEVELS,
  DEFAULT_AUTH,
  DEFAULT_SORT_KEY,
  SORT_OPTIONS,
};
