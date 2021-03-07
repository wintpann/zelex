const logger = require('../../utils/logger');
const {
  LEVEL,
  ZX_PRIVATE,
} = require('../../config/constants');
const {
  typeCheck,
  optional,
  string,
  shape,
} = require('../../validation/typeCheck');

const createDataLog = (req, level) => ({
  step,
  name,
  description,
  data,
}) => {
  const time = new Date();
  const log = {
    level,
    time,
    step,
    name,
    description,
    data,
  };
  try {
    typeCheck(
      ['step', log.step, optional(string)],
      ['name', log.name, optional(string)],
      ['description', log.description, optional(string)],
      ['data', log.data, optional(shape({}))],
    ).complete('Data log wont be saved, wrong params');

    req[ZX_PRIVATE].dataLogs.push(log);
  } catch (e) {
    logger.error(e.message);
  }
};

const initializeRequest = (req) => {
  req[ZX_PRIVATE] = {
    dataLogs: [],
  };

  req.zx = {
    info: createDataLog(req, LEVEL.INFO),
    warn: createDataLog(req, LEVEL.WARN),
    error: createDataLog(req, LEVEL.ERROR),
    debug: createDataLog(req, LEVEL.DEBUG),
    fatal: createDataLog(req, LEVEL.FATAL),
  };
};

function saveResponseBody(req, res) {
  const oldWrite = res.write;
  const oldEnd = res.end;
  const oldSend = res.send;

  const chunks = [];

  res.write = function (chunk) {
    chunks.push(chunk);
    // eslint-disable-next-line prefer-rest-params
    return oldWrite.apply(res, arguments);
  };

  res.end = function (chunk) {
    if (chunk) chunks.push(chunk);
    let body;
    try {
      body = JSON.parse(Buffer.concat(chunks).toString('utf8'));
      this.responseBody = body;
      // eslint-disable-next-line no-empty
    } catch (e) {}
    // eslint-disable-next-line prefer-rest-params
    return oldEnd.apply(res, arguments);
  };

  res.send = function (chunk) {
    let message;
    try {
      message = Buffer.from(chunk).toString('utf8');
      this.responseBody = { message };
      // eslint-disable-next-line no-empty
    } catch (e) {}
    // eslint-disable-next-line prefer-rest-params
    return oldSend.apply(res, arguments);
  };
}

module.exports = {
  createDataLog,
  saveResponseBody,
  initializeRequest,
};
