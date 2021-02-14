const dataLog = require('./dataLog.json');
const requestLog = require('./requestLog.json');

const getMockDataLog = (timeCreated = Date.now()) => ({
  ...dataLog,
  time: new Date(timeCreated),
});

const getMockRequestLog = (timeCreated = Date.now()) => ({
  ...requestLog,
  time: {
    started: new Date(timeCreated),
    finished: new Date(timeCreated),
    duration: 0,
  },
});

module.exports = {
  getMockDataLog,
  getMockRequestLog,
};
