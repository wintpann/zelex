const { getParamsForRequestLogs, getParamsForDataLogs } = require('./helpers');
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

      const requestLogsURL = `${_serveURL}/logs/request`;
      const dataLogsURL = `${_serveURL}/logs/data`;

      const requestOptionsURL = `${_serveURL}/options/request`;
      const dataOptionsURL = `${_serveURL}/options/data`;

      this._app.get(requestLogsURL, this._serveRequestLogs(transport));
      this._app.get(dataLogsURL, this._serveDataLogs(transport));

      this._app.get(requestOptionsURL, this._serveRequestOptions(transport));
      this._app.get(dataOptionsURL, this._serveDataOptions(transport));
    });
  }

  _serveRequestLogs(transport) {
    const handler = async (req, res) => {
      try {
        const params = getParamsForRequestLogs(req);
        const result = await transport.getRequestLogs(...params);
        res.json(result);
      } catch (e) {
        logger.error('could not serve logs', e);
        res.json(EMPTY_LOG_RESULT);
      }
    };
    return handler;
  }

  _serveDataLogs(transport) {
    const handler = async (req, res) => {
      try {
        const params = getParamsForDataLogs(req);
        const result = await transport.getDataLogs(...params);
        res.json(result);
      } catch (e) {
        logger.error('could not serve logs', e);
        res.json(EMPTY_LOG_RESULT);
      }
    };
    return handler;
  }

  _serveRequestOptions(transport) {
    const handler = (req, res) => {
      const options = transport.getRequestOptions();
      res.json(options);
    };
    return handler;
  }

  _serveDataOptions(transport) {
    const handler = (req, res) => {
      const options = transport.getDataOptions();
      res.json(options);
    };
    return handler;
  }
}

module.exports = Server;
