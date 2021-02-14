const {
  optional,
  string,
  bool,
  number,
  arrayOf,
  typeCheck,
} = require('../../../validation/typeCheck');
const logger = require('../../../utils/logger');
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
    checkToClearInterval = CLEAR_INTERVAL,
  } = {}) {
    this._dataLogs = [];
    this._requestLogs = [];

    this._path = path;
    this._saveInterval = saveInterval;
    this._clearAfter = clearAfter;
    this._saveRequestLogs = saveRequestLogs;
    this._saveDataLogLevels = saveDataLogLevels;
    this._checkToClearInterval = checkToClearInterval;

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
      ['checkToClearInterval', this._checkToClearInterval, optional(number)],
      ['saveRequestLogs', this._saveRequestLogs, optional(bool)],
      ['saveDataLogLevels', this._saveDataLogLevels, optional(arrayOf(number))],
    ).complete('Failed to create transport, check constructor params.');
  }

  async _uploadAllCollectedLogs() {
    try {
      const requestLogs = [...this._requestLogs];
      const dataLogs = [...this._dataLogs];

      if (requestLogs.length) {
        await this._uploadRequestLogs(requestLogs);
      }
      if (dataLogs.length) {
        await this._uploadDataLogs(dataLogs);
      }
    } catch (e) {
      logger.error('could not upload logs', e);
    } finally {
      this._requestLogs.length = 0;
      this._dataLogs.length = 0;
    }
  }

  async _clearLogs() {
    try {
      await this._clearSavedLogs();
    } catch (e) {
      logger.error('could not clear logs', e);
    }
  }

  _setIntervals() {
    const save = setInterval(this._uploadAllCollectedLogs.bind(this), this._saveInterval);
    const clear = setInterval(this._clearLogs.bind(this), this._checkToClearInterval);
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
