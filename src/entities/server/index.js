const { getParams } = require('./helpers');
const { EMPTY_LOG_RESULT } = require('./constants');
const logger = require('../../utils/logger');

class Server {
  constructor({
    app,
    transports,
  }) {
    this._app = app;
    this._servingTransports = transports.filter((item) => item._canServe && item._serveURL);
  }

  start() {
    this._servingTransports.forEach((transport) => {
      const { _serveURL } = transport;
      const logsURL = `${_serveURL}/logs`;
      const optionsURL = `${_serveURL}/options`;
      this._app.get(logsURL, this._serveLogs(transport));
      this._app.get(optionsURL, this._serveSortFilterOptions(transport));
    });
  }

  _serveLogs(transport) {
    const handler = async (req, res) => {
      try {
        const params = getParams(req);
        console.dir(params, { depth: null });
        const result = await transport.getLogs(...params);
        res.json(result);
      } catch (e) {
        logger.error('could not serve logs', e.message);
        res.json(EMPTY_LOG_RESULT);
      }
    };
    return handler;
  }

  _serveSortFilterOptions(transport) {
    const handler = (req, res) => {
      const options = transport.getFilterSortOptions();
      res.json(options);
    };
    return handler;
  }
}

module.exports = Server;
