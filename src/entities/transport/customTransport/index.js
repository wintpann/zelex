const AbstractTransport = require('../abstractTransport');
const { noop } = require('../../../helpers/common');

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
