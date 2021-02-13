const {
  optional,
  string,
  bool,
  number,
  arrayOf,
  typeCheck,
} = require('../../../validation/typeCheck');
const {
  CLEAR_INTERVAL,
  DEFAULT_SAVE_INTERVAL,
  DEFAULT_CLEAR_AFTER,
  SAVE_REQUEST_LOGS,
  SAVE_DATA_LOG_LEVELS,
} = require('./constants');

class AbstractTransport {
  constructor({
    path,
    saveInterval = DEFAULT_SAVE_INTERVAL,
    clearAfter = DEFAULT_CLEAR_AFTER,
    saveRequestLogs = SAVE_REQUEST_LOGS,
    saveDataLogLevels = SAVE_DATA_LOG_LEVELS,
  } = {}) {
    this._dataLogs = [];
    this._requestLogs = [];

    this._path = path;
    this._saveInterval = saveInterval;
    this._clearAfter = clearAfter;
    this._saveRequestLogs = saveRequestLogs;
    this._saveDataLogLevels = saveDataLogLevels;

    this._validateAbstractTransportInit();
    this._validatePath();
    this._setIntervals();

    this._saveDataLogFlag = this._saveDataLogLevels.reduce((acc, i) => acc | i, 0);
  }

  _validateAbstractTransportInit() {
    typeCheck(
      ['path', this._path, string],
      ['saveInterval', this._saveInterval, optional(number)],
      ['clearAfter', this._clearAfter, optional(number)],
      ['saveRequestLogs', this._saveRequestLogs, optional(bool)],
      ['saveDataLogLevels', this._saveDataLogLevels, optional(arrayOf(number))],
    ).complete('Failed to create transport, check constructor params.');
  }

  _uploadAllCollectedLogs() {
    const requestLogs = [...this._requestLogs];
    const dataLogs = [...this._dataLogs];

    if (requestLogs.length) {
      this._uploadRequestLogs(requestLogs);
    }
    if (dataLogs.length) {
      this._uploadDataLogs(dataLogs);
    }

    this._requestLogs.length = 0;
    this._dataLogs.length = 0;
  }

  _setIntervals() {
    const save = setInterval(this._uploadAllCollectedLogs, this._saveInterval);
    const clear = setInterval(this._clearSavedLogs, CLEAR_INTERVAL);
    this._timers = { save, clear };
  }

  // implement in children
  _uploadRequestLogs() {
  }

  _uploadDataLogs() {
  }

  _clearSavedLogs() {
  }

  _validatePath() {
  }

  // public
  collectRequestLog(log) {
    if (this._saveRequestLogs) {
      this._requestLogs.push(log);
    }
  }

  collectDataLog(log) {
    const shouldSave = log.level & this._saveDataLogFlag;
    if (shouldSave) {
      this._dataLogs.push(log);
    }
  }
}

module.exports = AbstractTransport;
