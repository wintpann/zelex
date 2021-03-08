const url = require('url');
const {
  optional,
  string,
  shape,
  typeCheck,
} = require('../../validation/typeCheck');
const { dig } = require('../../helpers/common');
const {
  LEVEL_HUMANIZED,
  ZX_PRIVATE,
} = require('../../config/constants');

const getTrafficInfo = ({
  req,
  res,
}) => ({
  incoming: req.bytes,
  outgoing: res.bytes,
  total: req.bytes + res.bytes,
});

const getTimeInfo = ({ time }) => {
  const now = new Date();
  return {
    started: new Date(now - time),
    finished: now,
    duration: time,
  };
};

const emptyGeoInfo = {
  location: {
    latitude: 0,
    longitude: 0,
  },
  city: '',
  region: '',
};

const getGeoInfo = () => emptyGeoInfo;

const getRequestInfo = ({ req }) => ({
  body: req.raw.body,
  headers: req.raw.body,
  path: url.parse(req.raw.originalUrl).pathname,
  params: req.raw.params,
  query: req.raw.query,
  ip: req.ip,
  method: req.method,
});

const getResponseInfo = ({ res }) => ({
  code: res.status,
  headers: res.headers,
  data: res.raw.responseBody,
});

const getExtraInfo = ({ req, res }, extras) => {
  const pulled = {
    req: req.raw,
    res: res.raw,
  };
  const result = {};
  Object.keys(extras).forEach((key) => {
    result[key] = dig(pulled, extras[key], '--');
  });
  return result;
};

const getReqDataLogs = ({ req }) => req.raw[ZX_PRIVATE]
  .dataLogs
  .map((log) => ({
    ...log,
    levelHumanized: LEVEL_HUMANIZED[log.level],
  }));

const getRequestLog = (raw, extras) => {
  const log = {};

  log.traffic = getTrafficInfo(raw);
  log.time = getTimeInfo(raw);
  log.geo = getGeoInfo(raw);
  log.request = getRequestInfo(raw);
  log.response = getResponseInfo(raw);
  log.extra = getExtraInfo(raw, extras);
  log.dataLogs = getReqDataLogs(raw);

  return log;
};

const getDataLog = (raw) => {
  const time = new Date();
  const log = {
    ...raw,
    time,
    levelHumanized: LEVEL_HUMANIZED[raw.level],
  };
  typeCheck(
    ['step', log.step, optional(string)],
    ['name', log.name, optional(string)],
    ['description', log.description, optional(string)],
    ['data', log.data, optional(shape({}))],
  ).complete('Data log wont be saved, wrong params');

  return log;
};

module.exports = {
  getRequestLog,
  getDataLog,
};
