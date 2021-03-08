const {
  getRequestLog,
  getDataLog,
} = require('./helpers');
const logger = require('../../utils/logger');

class Collector {
  constructor({
    transports,
    extras,
  } = {}) {
    this._transports = transports;
    this._extras = extras;
  }

  collectRequest(raw) {
    try {
      const log = getRequestLog(raw, this._extras);
      this._transports.forEach((transport) => transport.collectRequestLog(log));
    } catch (e) {
      logger.error('failed to pull request log', e);
    }
  }

  collectData(raw) {
    try {
      const log = getDataLog(raw);
      this._transports.forEach((transport) => transport.collectDataLog(log));
    } catch (e) {
      logger.error('failed to pull data log', e);
    }
  }
}

module.exports = Collector;
