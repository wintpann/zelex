const { dig } = require('../../helpers/common');
const {
  LEVEL_HUMANIZED,
  ZX_PRIVATE,
} = require('../../config/constants');
const logger = require('../../utils/logger');

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

const mockUserInfo = {
  location: {
    latitude: 0,
    longitude: 0,
  },
  city: 'No data',
  region: 'No data',
  isVPN: false,
};

// TODO
const getUserInfo = async () => mockUserInfo;

const getRequestInfo = async ({ req }) => {
  const {
    body,
    headers,
    originalUrl,
    params,
    query,
  } = req.raw;
  const {
    ip,
    method,
  } = req;

  let userInfo = mockUserInfo;

  try {
    userInfo = await getUserInfo();
  } catch (e) {
    logger.error('failed to get user info');
  }

  return {
    body,
    headers,
    ...userInfo,
    ip,
    method,
    path: originalUrl,
    params,
    query,
  };
};

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

const getDataLogs = ({ req }) => req.raw[ZX_PRIVATE]
  .dataLogs
  .map((log) => ({
    ...log,
    levelHumanized: LEVEL_HUMANIZED[log.level],
  }));

const getRequestLog = async (raw, extras) => {
  let log;
  try {
    log = {};
    log.traffic = getTrafficInfo(raw);
    log.time = getTimeInfo(raw);
    log.request = await getRequestInfo(raw);
    log.response = getResponseInfo(raw);
    log.extra = getExtraInfo(raw, extras);
    log.dataLogs = getDataLogs(raw);
  } catch (e) {
    logger.error('failed to pull request log', e.message);
  }
  return log;
};

module.exports = {
  getRequestLog,
};
