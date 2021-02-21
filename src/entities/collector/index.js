const { getRequestLog } = require('./helpers');

class Collector {
  constructor({
    transports,
    extras,
  }) {
    this._transports = transports;
    this._extras = extras;
  }

  async collect(raw) {
    const log = await getRequestLog(raw, this._extras);
    this._transports.forEach((transport) => transport.collectRequestLog(log));
  }
}

module.exports = Collector;
