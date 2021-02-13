const {
  optional,
  string,
  bool,
  number,
  typeCheck,
} = require('../../../validation/typeCheck');
const {
  CLEAR_INTERVAL,
  DEFAULT_SAVE_INTERVAL,
  DEFAULT_CLEAR_AFTER,
  SAVE_REQUEST_LOGS,
  SAVE_DATA_LOGS,
} = require('./constants');

class AbstractTransport {
  constructor({
    path,
    saveInterval = DEFAULT_SAVE_INTERVAL,
    clearAfter = DEFAULT_CLEAR_AFTER,
    saveRequestLogs = SAVE_REQUEST_LOGS,
    saveDataLogs = SAVE_DATA_LOGS,
  } = {}) {
    this._dataLogs = [];
    this._requestLogs = [];

    this._path = path;
    this._saveInterval = saveInterval;
    this._clearAfter = clearAfter;
    this._saveRequestLogs = saveRequestLogs;
    this._saveDataLogs = saveDataLogs;

    this._validateAbstractTransportInit();
    this._validatePath();
    this._setIntervals();
  }

  _validateAbstractTransportInit() {
    typeCheck(
      ['path', this._path, string],
      ['saveInterval', this._saveInterval, optional(number)],
      ['clearAfter', this._clearAfter, optional(number)],
      ['saveRequestLogs', this._saveRequestLogs, optional(bool)],
      ['saveDataLogs', this._saveDataLogs, optional(bool)],
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
    if (this._saveDataLogs) {
      this._dataLogs.push(log);
    }
  }
}

module.exports = AbstractTransport;
