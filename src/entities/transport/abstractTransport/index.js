const {
  optional,
  string,
  bool,
  func,
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
  DEFAULT_AUTH,
} = require('./constants');

class AbstractTransport {
  constructor({
    path,
    saveInterval = DEFAULT_SAVE_INTERVAL,
    clearAfter = DEFAULT_CLEAR_AFTER,
    saveRequestLogs = SAVE_REQUEST_LOGS,
    saveDataLogLevels = SAVE_DATA_LOG_LEVELS,
    checkToClearInterval = CLEAR_INTERVAL,
    canServe = false,
    serveURL,
    auth = DEFAULT_AUTH,
  } = {}) {
    this._dataLogs = [];
    this._requestLogs = [];

    this._path = path;
    this._saveInterval = saveInterval;
    this._clearAfter = clearAfter;
    this._saveRequestLogs = saveRequestLogs;
    this._saveDataLogLevels = saveDataLogLevels;
    this._checkToClearInterval = checkToClearInterval;

    this._canServe = canServe;
    this._serveURL = serveURL;
    this._auth = auth;

    this._validateAbstractTransportInit();
    this._validatePath();
    this._checkServeOptions();
    this._setIntervals();

    this._saveDataLogFlag = this._saveDataLogLevels.reduce((acc, i) => acc | i, 0);
  }

  _validateAbstractTransportInit() {
    const validate = typeCheck(
      ['path', this._path, string],
      ['saveInterval', this._saveInterval, optional(number)],
      ['clearAfter', this._clearAfter, optional(number)],
      ['checkToClearInterval', this._checkToClearInterval, optional(number)],
      ['saveRequestLogs', this._saveRequestLogs, optional(bool)],
      ['saveDataLogLevels', this._saveDataLogLevels, optional(arrayOf(number))],
    );
    if (this._canServe) {
      validate.append(
        ['serveURL', this._serveURL, optional(string)],
        ['auth', this._auth, optional(func)],
      );
    }
    validate.complete('Failed to create transport, check constructor params.');
  }

  async _uploadAllCollectedLogs() {
    try {
      if (this._requestLogs.length) {
        await this._uploadRequestLogs(this._requestLogs);
      }
      if (this._dataLogs.length) {
        await this._uploadDataLogs(this._dataLogs);
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

  _checkServeOptions() {
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
