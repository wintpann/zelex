const fs = require('fs');
const AbstractTransport = require('../abstractTransport');
const { REQ_SORT_OPTIONS, DATA_SORT_OPTIONS } = require('../abstractTransport/constants');
const logger = require('../../../utils/logger');
const { randomNumberString } = require('../../../helpers/common');
const { readdir, readFile } = require('../../../helpers/promisified');
const { last, first } = require('../../../helpers/common');
const {
  getLogBuffer,
  getNotInPageRange,
  getNotInDateRange,
  getNotInOptions,
} = require('./helpers');

const [REQUEST_FOLDER, DATA_FOLDER] = ['request', 'data'];
const SEPARATOR = '@';
const EXTENSION = '.json';

class JSONTransport extends AbstractTransport {
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
  }

  _checkServeOptions() {
    const serveURLPassed = Boolean(this._serveURL);
    if (serveURLPassed) {
      logger.warn('You passed serveURL to JSON transport. Assume that serving by JSON transport is BAD IDEA for production');
    }
  }

  async _writeLogs(folder, logs) {
    const createFiles = logs.map((log) => new Promise((resolve) => {
      const time = log.time.started || log.time;
      const fileName = `${this._path}/${folder}/${time}${SEPARATOR}${randomNumberString()}${EXTENSION}`;
      const buffer = getLogBuffer(log);

      fs.writeFile(fileName, buffer, (err) => {
        if (err) {
          logger.error('could not write log', err);
        }
        return resolve();
      });
    }));
    await Promise.all(createFiles);
  }

  async _uploadRequestLogs(logs) {
    return this._writeLogs(REQUEST_FOLDER, logs);
  }

  async _uploadDataLogs(logs) {
    return this._writeLogs(DATA_FOLDER, logs);
  }

  async _getFileNames() {
    let requestFiles = [];
    let dataFiles = [];

    try {
      const requestLogs = await readdir(this._requestPath);
      const dataLogs = await readdir(this._dataPath);

      requestFiles = requestLogs.map((fileName) => `${this._requestPath}/${fileName}`);
      dataFiles = dataLogs.map((fileName) => `${this._dataPath}/${fileName}`);
    } catch (e) {
      logger.error('could not read logs', e);
    }
    return { requestFiles, dataFiles };
  }

  async _getAllLogs(files) {
    let logs = files.map((path) => readFile(path, { encoding: 'utf-8' }));
    logs = await Promise.all(logs);
    logs = logs.map((log) => JSON.parse(log));
    return logs;
  }

  async _getAllRequestLogs() {
    const { requestFiles } = await this._getFileNames();
    const logs = await this._getAllLogs(requestFiles);
    return logs;
  }

  async _getAllDataLogs() {
    const { dataFiles } = await this._getFileNames();
    const logs = await this._getAllLogs(dataFiles);
    return logs;
  }

  async _clearSavedLogs() {
    const { requestFiles, dataFiles } = await this._getFileNames();

    const pathsToDelete = [...requestFiles, ...dataFiles].filter((path) => {
      const fileName = last(path.split('/'));
      const logCreateTime = new Date(first(fileName.split(SEPARATOR)));

      const now = new Date();
      const diff = now - logCreateTime;
      const shouldDelete = diff > this._clearAfterMs;

      return shouldDelete;
    });

    const clearPromises = pathsToDelete.map((filePath) => new Promise((resolve) => {
      fs.unlink(filePath, ((err) => {
        if (err) {
          logger.error('could not remove logs', err);
        }
        resolve();
      }));
    }));

    await Promise.all(clearPromises);
  }

  _validatePath() {
    this._requestPath = `${this._path}/${REQUEST_FOLDER}`;
    this._dataPath = `${this._path}/${DATA_FOLDER}`;

    const folderExists = fs.existsSync(this._path);
    if (!folderExists) {
      throw new Error('Folder you specified does not exist');
    }

    if (!fs.existsSync(this._requestPath)) {
      fs.mkdirSync(this._requestPath, { recursive: true });
    }

    if (!fs.existsSync(this._dataPath)) {
      fs.mkdirSync(this._dataPath, { recursive: true });
    }
  }

  async _scanNewReqOptions() {
    const logs = await this._getAllRequestLogs();
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
    const logs = await this._getAllDataLogs();
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
    {
      pageIndex,
      pageSize,
    },
    sort,
  ) {
    let logs = await this._getAllRequestLogs();

    logs = logs.filter((log, index) => {
      const notInPageRange = getNotInPageRange(index, pageIndex, pageSize);
      if (notInPageRange) {
        return false;
      }

      const notInOptions = getNotInOptions(
        [method, log.request.method],
        [path, log.request.path],
        [code, log.response.code],
      );
      if (notInOptions) {
        return false;
      }

      const notInDateRange = getNotInDateRange(dateFrom, dateTo, log.time.started);
      if (notInDateRange) {
        return false;
      }

      return true;
    });

    logs.sort(REQ_SORT_OPTIONS[sort].json);
    const nextPageExists = logs.length > pageSize;
    if (nextPageExists) {
      logs.pop();
    }
    return { result: logs, nextPageExists };
  }

  async _getDataLogs(
    {
      name,
      level,
      dateFrom,
      dateTo,
    },
    {
      pageIndex,
      pageSize,
    },
    sort,
  ) {
    let logs = await this._getAllDataLogs();

    logs = logs.filter((log, index) => {
      const notInPageRange = getNotInPageRange(index, pageIndex, pageSize);
      if (notInPageRange) {
        return false;
      }

      const notInOptions = getNotInOptions(
        [name, log.name],
        [level, log.levelHumanized],
      );
      if (notInOptions) {
        return false;
      }

      const notInDateRange = getNotInDateRange(dateFrom, dateTo, log.time);
      if (notInDateRange) {
        return false;
      }

      return true;
    });

    logs.sort(DATA_SORT_OPTIONS[sort].json);
    const nextPageExists = logs.length > pageSize;
    if (nextPageExists) {
      logs.pop();
    }
    return { result: logs, nextPageExists };
  }
}

module.exports = JSONTransport;
