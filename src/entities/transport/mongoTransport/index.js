const mongoose = require('mongoose');
const AbstractTransport = require('../abstractTransport');
const { REQ_SORT_OPTIONS, DATA_SORT_OPTIONS } = require('../abstractTransport/constants');
const { DB_OPTIONS } = require('./constants');
const logger = require('../../../utils/logger');

const RequestLogSchema = require('./schemas/requestLog');
const DataLogSchema = require('./schemas/dataLog');

class MongoTransport extends AbstractTransport {
  constructor({
    path,
    saveInterval,
    clearAfter,
    saveRequestLogs,
    saveDataLogLevels,
    checkToClearInterval,
    serveURL,
    auth,
  }) {
    super({
      path,
      saveInterval,
      clearAfter,
      saveRequestLogs,
      saveDataLogLevels,
      checkToClearInterval,
      serveURL,
      auth,
      canServe: true,
    });
    this._connect();
  }

  _connect() {
    this._connection = mongoose.createConnection(this._path, DB_OPTIONS);

    this._connection
      .then(() => logger.success('mongodb connection established'))
      .catch((e) => logger.error('mongodb connection failed', e));

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
    const clearLTE = new Date(now - this._clearAfterMs);
    await this._dataLog.deleteMany({ time: { $lte: clearLTE } });
    await this._requestLog.deleteMany({ 'time.started': { $lte: clearLTE } });
  }

  _validatePath() {
    const pathLikeMongo = this._path.includes('mongodb://');
    if (!pathLikeMongo) {
      throw new Error('Invalid path');
    }
  }

  async _scanNewReqOptions() {
    const logs = await this._requestLog.find().select('response.code request.path request.method').lean();
    logs.forEach((log) => {
      const {
        response: { code },
        request: { method, path },
      } = log;
      this._reqFilterOptions.code.add(code);
      this._reqFilterOptions.method.add(method);
      this._reqFilterOptions.path.add(path);
    });
  }

  async _scanNewDataOptions() {
    const logs = await this._dataLog.find().select('name').lean();
    logs.forEach((log) => {
      const { name } = log;
      this._dataFilterOptions.name.add(name);
    });
  }

  async _getRequestLogs(
    {
      method,
      path,
      code,
      dateFrom,
      dateTo,
    },
    { pageIndex, pageSize },
    sort,
  ) {
    const query = {};
    query['time.started'] = {};

    if (method.length) {
      query['request.method'] = { $in: method };
    }
    if (path.length) {
      query['request.path'] = { $in: path };
    }
    if (code.length) {
      query['response.code'] = { $in: code };
    }

    if (dateFrom) {
      query['time.started'] = { ...query['time.started'], $gte: new Date(dateFrom) };
    }
    if (dateTo) {
      query['time.started'] = { ...query['time.started'], $lte: new Date(dateTo) };
    }

    const noTimeSpecified = !Object.keys(query['time.started']).length;
    if (noTimeSpecified) {
      delete query.time;
    }

    const skip = pageIndex * pageSize;

    const logs = await this._requestLog
      .find(query)
      .sort(REQ_SORT_OPTIONS[sort].mongo)
      .skip(skip)
      .limit(pageSize + 1)
      .lean();

    const nextPageExists = logs.length > pageSize;
    if (nextPageExists) {
      logs.pop();
    }

    return { result: logs, nextPageExists };
  }

  async _getDataLogs(
    {
      name, level, dateFrom, dateTo,
    },
    { pageIndex, pageSize },
    sort,
  ) {
    const query = {};
    query.time = {};

    if (name.length) {
      query.name = { $in: name };
    }
    if (level.length) {
      query.levelHumanized = { $in: level };
    }

    if (dateFrom) {
      query.time = { ...query.time, $gte: new Date(dateFrom) };
    }
    if (dateTo) {
      query.time = { ...query.time, $lte: new Date(dateTo) };
    }
    const noTimeSpecified = !Object.keys(query.time).length;
    if (noTimeSpecified) {
      delete query.time;
    }

    const skip = pageIndex * pageSize;

    const logs = await this._dataLog
      .find(query)
      .sort(DATA_SORT_OPTIONS[sort].mongo)
      .skip(skip)
      .limit(pageSize + 1)
      .lean();

    const nextPageExists = logs.length > pageSize;
    if (nextPageExists) {
      logs.pop();
    }

    return { result: logs, nextPageExists };
  }
}

module.exports = MongoTransport;
