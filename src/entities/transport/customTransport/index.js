const AbstractTransport = require('../abstractTransport');
const { noop } = require('../../../helpers/common');
const logger = require('../../../utils/logger');

class CustomTransport extends AbstractTransport {
  constructor({
    onDataLog = noop,
    onRequestLog = noop,
    saveDataLogLevels,
    saveRequestLogs,
  }) {
    super({
      path: 'we dont need path for custom transport',
      saveRequestLogs,
      saveDataLogLevels,
      canServe: false,
    });
    this._onDataLog = onDataLog;
    this._onRequestLog = onRequestLog;
    this._clearTimers();
  }

  _clearTimers() {
    const { save, clear } = this._timers;
    clearInterval(save);
    clearInterval(clear);
  }

  _checkServeOptions() {
    const serveURLPassed = Boolean(this._serveURL);
    if (serveURLPassed) {
      logger.warn('You passed serveURL to transport that cannot serve');
    }
  }

  collectRequestLog(log) {
    if (this._saveRequestLogs) {
      this._onRequestLog(log);
    }
  }

  collectDataLog(log) {
    const shouldSave = log.level & this._saveDataLogFlag;
    if (shouldSave) {
      this._onDataLog(log);
    }
  }
}

module.exports = CustomTransport;
