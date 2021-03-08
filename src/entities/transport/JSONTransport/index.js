const fs = require('fs');
const AbstractTransport = require('../abstractTransport');
const { REQ_SORT_OPTIONS, DATA_SORT_OPTIONS } = require('../abstractTransport/constants');
const logger = require('../../../utils/logger');
const { randomNumberString } = require('../../../helpers/common');
const { readdir, readFile } = require('../../../helpers/promisified');
const { last, first } = require('../../../helpers/common');
const { getLogBuffer } = require('./helpers');

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

  async _clearSavedLogs() {
    const requestLogs = await readdir(this._requestPath);
    const dataLogs = await readdir(this._dataPath);

    const requestPaths = requestLogs.map((fileName) => `${this._requestPath}/${fileName}`);
    const dataPaths = dataLogs.map((fileName) => `${this._dataPath}/${fileName}`);

    const pathsToDelete = [...requestPaths, ...dataPaths].filter((path) => {
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

  async _getRequestLogs(
    {
      method, path, code, dateFrom, dateTo,
    },
    { pageIndex, pageSize },
    sort,
  ) {
    let logs = await readdir(this._requestPath);

    logs = logs.map((filePath) => readFile(`${this._requestPath}/${filePath}`, { encoding: 'utf-8' }));

    logs = await Promise.all(logs);

    logs = logs.map((log) => JSON.parse(log));

    logs = logs.filter((log, index) => {
      const paginationRangeMin = pageIndex * pageSize;
      const paginationRangeMax = paginationRangeMin + pageSize + 1;
      const notInRange = index < paginationRangeMin || index > paginationRangeMax;
      if (notInRange) {
        return false;
      }

      if (method.length && !method.includes(log.request.method)) {
        return false;
      }
      if (path.length && !path.includes(log.request.path)) {
        return false;
      }
      if (code.length && !code.includes(log.response.code)) {
        return false;
      }
      if (dateFrom && Number(new Date(log.time.started)) < Number(new Date(dateFrom))) {
        return false;
      }
      if (dateTo && Number(new Date(log.time.started)) > Number(new Date(dateTo))) {
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
      name, level, dateFrom, dateTo,
    },
    { pageIndex, pageSize },
    sort,
  ) {
    let logs = await readdir(this._dataPath);

    logs = logs.map((filePath) => readFile(`${this._dataPath}/${filePath}`, { encoding: 'utf-8' }));

    logs = await Promise.all(logs);

    logs = logs.map((log) => JSON.parse(log));

    logs = logs.filter((log, index) => {
      const paginationRangeMin = pageIndex * pageSize;
      const paginationRangeMax = paginationRangeMin + pageSize + 1;
      const notInRange = index < paginationRangeMin || index > paginationRangeMax;
      if (notInRange) {
        return false;
      }

      if (name.length && !name.includes(log.name)) {
        return false;
      }
      if (level.length && !level.includes(log.levelHumanized)) {
        return false;
      }
      if (dateFrom && Number(new Date(log.time)) < Number(new Date(dateFrom))) {
        return false;
      }
      if (dateTo && Number(new Date(log.time)) > Number(new Date(dateTo))) {
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
