const { LEVEL } = require('../../../config/constants');

const CLEAR_INTERVAL = '1d';
const DEFAULT_SAVE_INTERVAL = '15m';
const DEFAULT_CLEAR_AFTER = '10h';

const SAVE_REQUEST_LOGS = true;
const SAVE_DATA_LOG_LEVELS = LEVEL.ALL;

const DEFAULT_AUTH = () => ({
  denied: false,
  message: '',
});

const REQ_SORT_OPTIONS = {
  createDateAsc: {
    mongo: { 'time.started': 1 },
    json: (a, b) => a.time.started > b.time.started,
    dropdown: { id: 'createDateAsc', name: 'Creation Date (increasing)' },
  },
  createDateDesc: {
    mongo: { 'time.started': -1 },
    json: (a, b) => a.time.started < b.time.started,
    dropdown: { id: 'createDateDesc', name: 'Creation Date (decreasing)' },
  },
  durationAsc: {
    mongo: { 'time.duration': 1 },
    json: (a, b) => a.duration.started > b.duration.started,
    dropdown: { id: 'durationAsc', name: 'Duration (increasing)' },
  },
  durationDesc: {
    mongo: { 'time.duration': -1 },
    json: (a, b) => a.duration.started < b.duration.started,
    dropdown: { id: 'durationDesc', name: 'Duration (decreasing)' },
  },
  trafficAsc: {
    mongo: { 'traffic.total': 1 },
    json: (a, b) => a.traffic.total > b.traffic.total,
    dropdown: { id: 'trafficAsc', name: 'Traffic (increasing)' },
  },
  trafficDesc: {
    mongo: { 'traffic.total': -1 },
    json: (a, b) => a.traffic.total < b.traffic.total,
    dropdown: { id: 'trafficDesc', name: 'Traffic (decreasing)' },
  },
};

const DATA_SORT_OPTIONS = {
  createDateAsc: {
    mongo: { time: 1 },
    json: (a, b) => a.time > b.time,
    dropdown: { id: 'createDateAsc', name: 'Creation Date (increasing)' },
  },
  createDateDesc: {
    mongo: { time: -1 },
    json: (a, b) => a.time < b.time,
    dropdown: { id: 'createDateDesc', name: 'Creation Date (decreasing)' },
  },
};

const DEFAULT_REQ_SORT_KEY = Object.keys(REQ_SORT_OPTIONS)[0];
const DEFAULT_DATA_SORT_KEY = Object.keys(DATA_SORT_OPTIONS)[0];

const DEFAULT_PAGINATION = {
  pageSize: 10,
  pageIndex: 0,
};

module.exports = {
  CLEAR_INTERVAL,
  DEFAULT_SAVE_INTERVAL,
  DEFAULT_CLEAR_AFTER,
  SAVE_REQUEST_LOGS,
  SAVE_DATA_LOG_LEVELS,
  DEFAULT_AUTH,
  DEFAULT_REQ_SORT_KEY,
  DEFAULT_DATA_SORT_KEY,
  REQ_SORT_OPTIONS,
  DATA_SORT_OPTIONS,
  DEFAULT_PAGINATION,
};
