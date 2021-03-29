const {
  getParamsForRequestLogs,
  getParamsForDataLogs,
  notifyError,
} = require('./helpers');
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

      const geoURL = `${_serveURL}/geo`;

      this._app.get(requestLogsURL, this._serveRequestLogs(transport));
      this._app.get(dataLogsURL, this._serveDataLogs(transport));

      this._app.get(requestOptionsURL, this._serveRequestOptions(transport));
      this._app.get(dataOptionsURL, this._serveDataOptions(transport));

      this._app.post(geoURL, this._serveGeo(transport));
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
        res.json({ ...EMPTY_LOG_RESULT, ...notifyError('Could not get request logs. Try one more time') });
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
    const handler = async (req, res) => {
      const { scanForNew } = req.query;
      const options = await transport.getRequestOptions(scanForNew);
      res.json(options);
    };
    return handler;
  }

  _serveDataOptions(transport) {
    const handler = async (req, res) => {
      const { scanForNew } = req.query;
      const options = await transport.getDataOptions(scanForNew);
      res.json(options);
    };
    return handler;
  }

  _serveGeo(transport) {
    const handler = async (req, res) => {
      const { ip, id } = req.body;
      const { geo, apiErr, saveErr } = await transport.getGeo(id, ip);
      if (apiErr) {
        res.json({ geo: null, ...notifyError('Could not get geo. Try one more time or check request ip') });
      } else if (saveErr) {
        res.json({ geo, ...notifyError('Could not save geo') });
      } else {
        res.json({ geo });
      }
    };
    return handler;
  }
}

module.exports = Server;
