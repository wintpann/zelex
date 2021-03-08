const dataLog = require('./dataLog.json');
const requestLog = require('./requestLog.json');
const { LEVEL } = require('../config/constants');

const emptyGeoInfo = {
  location: {
    latitude: 0,
    longitude: 0,
  },
  city: '',
  region: '',
};

const getMockDataLog = (timeCreated = Date.now(), level = LEVEL.INFO) => ({
  ...dataLog,
  time: new Date(timeCreated),
  level,
});

const getMockRequestLog = (timeCreated = Date.now(), withoutGeo = false) => ({
  ...requestLog,
  geo: withoutGeo ? emptyGeoInfo : requestLog.geo,
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
