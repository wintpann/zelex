const mongoose = require('mongoose');
const AbstractTransport = require('../abstractTransport');
const { DB_OPTIONS } = require('./constants');
const logger = require('../../../utils/logger');

const RequestLogSchema = require('./schemas/requestLog');
const DataLogSchema = require('./schemas/dataLog');

class MongoTransport extends AbstractTransport {
  constructor(options) {
    super({
      ...options,
      canServe: true,
    });
    this._connect();
  }

  _connect() {
    this._connection = mongoose.createConnection(this._path, DB_OPTIONS);

    this._connection
      .then(() => logger.info('mongodb connection established'))
      .catch(() => logger.error('mongodb connection failed'));

    this._connection.on('close', () => logger.info('mongodb connection closed'));

    this._requestLog = this._connection.model('RequestLog', RequestLogSchema);
    this._dataLog = this._connection.model('DataLog', DataLogSchema);
  }

  async _disconnect() {
    await this._connection.close();
    const { close, save } = this._timers;
    clearInterval(close);
    clearInterval(save);
  }

  async _uploadRequestLogs(logs) {
    await this._requestLog.insertMany(logs);
  }

  async _uploadDataLogs(logs) {
    await this._dataLog.insertMany(logs);
  }

  async _clearSavedLogs() {
    const now = Date.now();
    const clearLTE = new Date(now - this._clearAfter);
    await this._dataLog.deleteMany({ time: { $lte: clearLTE } });
    await this._requestLog.deleteMany({ 'time.started': { $lte: clearLTE } });
  }

  _validatePath() {
    const pathLikeMongo = this._path.includes('mongodb://');
    if (!pathLikeMongo) {
      throw new Error('Invalid path');
    }
  }
}

module.exports = MongoTransport;
