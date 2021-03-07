const { getRequestLog } = require('./helpers');

class Collector {
  constructor({
    transports,
    extras,
  }) {
    this._transports = transports;
    this._extras = extras;
  }

  collect(raw) {
    const log = getRequestLog(raw, this._extras);
    this._transports.forEach((transport) => transport.collectRequestLog(log));
  }
}

module.exports = Collector;
