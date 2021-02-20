const fs = require('fs');
const AbstractTransport = require('../abstractTransport');
const logger = require('../../../utils/logger');
const { randomString } = require('../../../helpers/common');
const { readdir } = require('../../../helpers/promisified');
const { last, first } = require('../../../helpers/common');
const { getLogBuffer } = require('./helpers');

const [REQUEST_FOLDER, DATA_FOLDER] = ['request', 'data'];
const SEPARATOR = '@';

class JSONTransport extends AbstractTransport {
  constructor(options) {
    super({
      ...options,
      canServe: true,
    });
  }

  _checkServeOptions() {
    const serveURLPassed = Boolean(this._serveURL);
    if (serveURLPassed) {
      logger.warn('You passed serveURL to JSON transport. Assume that serving by JSON transport is not good idea');
    }
  }

  async _writeLogs(folder, logs) {
    const createFiles = logs.map((log) => new Promise((resolve) => {
      const time = log.time.started || log.time;
      const fileName = `${this._path}/${folder}/${time}${SEPARATOR}${randomString()}`;
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
      const shouldDelete = diff > this._clearAfter;

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
}

module.exports = JSONTransport;
