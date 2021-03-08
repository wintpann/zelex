const {
  optional,
  string,
  bool,
  func,
  oneOf,
  number,
  arrayOf,
  typeCheck,
} = require('../../../validation/typeCheck');
const logger = require('../../../utils/logger');
const { LEVEL_HUMANIZED } = require('../../../config/constants');
const { LEVEL } = require('../../../config/constants');
const { mapDropdownValue } = require('../../../helpers/serve');
const { getTimeMs } = require('../../../helpers/common');
const {
  CLEAR_INTERVAL,
  DEFAULT_SAVE_INTERVAL,
  DEFAULT_CLEAR_AFTER,
  SAVE_REQUEST_LOGS,
  SAVE_DATA_LOG_LEVELS,
  DEFAULT_AUTH,
  REQ_SORT_OPTIONS,
  DEFAULT_REQ_SORT_KEY,
  DATA_SORT_OPTIONS,
  DEFAULT_DATA_SORT_KEY,
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
    this._checkToClearInterval = checkToClearInterval;
    this._saveRequestLogs = saveRequestLogs;
    this._saveDataLogLevels = saveDataLogLevels;

    this._canServe = canServe;
    this._serveURL = serveURL;
    this._auth = auth;

    this._validateAbstractTransportInit();
    this._validatePath();
    this._getIntervals();
    this._checkServeOptions();
    this._setIntervals();

    this._saveDataLogFlag = this._saveDataLogLevels.reduce((acc, i) => acc | i, 0);

    this._reqFilterOptions = {
      method: new Set(),
      path: new Set(),
      code: new Set(),
    };
    this._reqSortOptions = REQ_SORT_OPTIONS;

    this._dataFilterOptions = {
      level: new Set(LEVEL.ALL.map((level) => LEVEL_HUMANIZED[level])),
      name: new Set(),
    };
    this._dataSortOptions = DATA_SORT_OPTIONS;
  }

  _validateAbstractTransportInit() {
    const validate = typeCheck(
      ['path', this._path, string],
      ['saveInterval', this._saveInterval, optional(oneOf(number, string))],
      ['clearAfter', this._clearAfter, optional(oneOf(number, string))],
      ['checkToClearInterval', this._checkToClearInterval, optional(oneOf(number, string))],
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

  _getIntervals() {
    this._saveIntervalMs = getTimeMs(this._saveInterval);
    this._clearAfterMs = getTimeMs(this._clearAfter);
    this._checkToClearIntervalMs = getTimeMs(this._checkToClearInterval);
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
    const save = setInterval(this._uploadAllCollectedLogs.bind(this), this._saveIntervalMs);
    const clear = setInterval(this._clearLogs.bind(this), this._checkToClearIntervalMs);
    this._timers = { save, clear };
  }

  _appendReqFilterOptions(requestLog) {
    if (!this._canServe) {
      return;
    }

    const {
      request: { method, path },
      response: { code },
    } = requestLog;

    this._reqFilterOptions.path.add(path);
    this._reqFilterOptions.method.add(method);
    this._reqFilterOptions.code.add(code);
    // TODO refactor
  }

  _appendDataFilterOptions(dataLog) {
    if (!this._canServe) {
      return;
    }

    const { name } = dataLog;
    this._dataFilterOptions.name.add(name);
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

  _getRequestLogs() {
  }

  _getDataLogs() {
  }

  _scanNewReqOptions() {
  }

  _scanNewDataOptions() {
  }

  // public
  collectRequestLog(log) {
    if (this._saveRequestLogs) {
      this._appendReqFilterOptions(log);
      this._requestLogs.push(log);
    }
  }

  collectDataLog(log) {
    const shouldSave = log.level & this._saveDataLogFlag;
    if (shouldSave) {
      this._appendDataFilterOptions(log);
      this._dataLogs.push(log);
    }
  }

  async getRequestOptions(scanForNew) {
    if (scanForNew) {
      await this._scanNewReqOptions();
    }
    const path = [...this._reqFilterOptions.path].map(mapDropdownValue);
    const code = [...this._reqFilterOptions.code].map(mapDropdownValue);
    const method = [...this._reqFilterOptions.method].map(mapDropdownValue);

    const sort = Object.values(this._reqSortOptions).map(({ dropdown }) => dropdown);

    const options = {
      filter: {
        path,
        code,
        method,
      },
      sort,
    };
    return options;
  }

  async getDataOptions(scanForNew) {
    if (scanForNew) {
      await this._scanNewDataOptions();
    }
    const level = [...this._dataFilterOptions.level].map(mapDropdownValue);
    const name = [...this._dataFilterOptions.name].map(mapDropdownValue);

    const sort = Object.values(this._dataSortOptions).map(({ dropdown }) => dropdown);

    const options = {
      filter: {
        level,
        name,
      },
      sort,
    };
    return options;
  }

  async getRequestLogs(filter = {}, pagination = {}, sort = DEFAULT_REQ_SORT_KEY) {
    const {
      method = [],
      path = [],
      code = [],
      dateFrom = '',
      dateTo = '',
    } = filter;
    const {
      pageIndex = 0,
      pageSize = 10,
    } = pagination;
    return this._getRequestLogs({
      method, path, code, dateFrom, dateTo,
    }, { pageIndex, pageSize }, sort);
  }

  async getDataLogs(filter = {}, pagination = {}, sort = DEFAULT_DATA_SORT_KEY) {
    const {
      level = [],
      name = [],
      dateFrom = '',
      dateTo = '',
    } = filter;
    const {
      pageIndex = 0,
      pageSize = 10,
    } = pagination;
    return this._getDataLogs({
      name, level, dateFrom, dateTo,
    }, { pageIndex, pageSize }, sort);
  }
}

module.exports = AbstractTransport;
