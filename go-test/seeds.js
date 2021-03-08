const fs = require('fs');
const express = require('express');
const { LEVEL } = require('../src/config/constants');
const log = require('../src/utils/logger');
const { getMockDataLog, getMockRequestLog } = require('../src/mocks');
const { getTimeMs } = require('../src/helpers/common');

const ago = (time) => Date.now() - getTimeMs(time);

const requestLogs = [
  getMockRequestLog(ago('5m'), true),
  getMockRequestLog(ago('15m'), true),
  getMockRequestLog(ago('50m'), true),
  getMockRequestLog(ago('3h'), true),
  getMockRequestLog(ago('3h,5m'), true),
  getMockRequestLog(ago('4h,5m'), true),
  getMockRequestLog(ago('4h,5m'), true),
  getMockRequestLog(ago('4h,15m'), true),
  getMockRequestLog(ago('4h,25m'), true),
  getMockRequestLog(ago('5h,3m'), true),
  getMockRequestLog(ago('1d,5h,7m'), true),
  getMockRequestLog(ago('1d,1h,10m'), true),
  getMockRequestLog(ago('2d,6h,9m'), true),
  getMockRequestLog(ago('2d,9h,36m'), true),
  getMockRequestLog(ago('2d,15h,36m'), true),
];

const dataLogs = [
  getMockDataLog(ago('5m'), LEVEL.WARN),
  getMockDataLog(ago('15m'), LEVEL.ERROR),
  getMockDataLog(ago('50m'), LEVEL.DEBUG),
  getMockDataLog(ago('3h'), LEVEL.DEBUG),
  getMockDataLog(ago('3h,5m'), LEVEL.WARN),
  getMockDataLog(ago('4h,5m'), LEVEL.WARN),
  getMockDataLog(ago('4h,5m'), LEVEL.INFO),
  getMockDataLog(ago('4h,15m'), LEVEL.FATAL),
  getMockDataLog(ago('4h,25m'), LEVEL.FATAL),
  getMockDataLog(ago('5h,3m'), LEVEL.INFO),
  getMockDataLog(ago('5h,7m'), LEVEL.INFO),
  getMockDataLog(ago('5h,10m'), LEVEL.INFO),
  getMockDataLog(ago('6h,9m'), LEVEL.WARN),
  getMockDataLog(ago('6h,36m'), LEVEL.WARN),
  getMockDataLog(ago('8h,46m'), LEVEL.WARN),
];

const JSON_GO_TEST = 'JSON_GO_TEST';

if (!fs.existsSync(JSON_GO_TEST)) {
  fs.mkdirSync(JSON_GO_TEST);
}

const { createLogger, Transport } = require('../src/index');

const app = express();

const jsonTransport = new Transport.JSON({
  path: 'JSON_GO_TEST',
  saveInterval: '1s',
});

const mongoTransport = new Transport.Mongo({
  path: 'mongodb://localhost:27017/zelex-go-test',
  saveInterval: '1s',
});

const logger = createLogger({
  app,
  transport: [
    jsonTransport,
    mongoTransport,
  ],
});

logger._transports.forEach((transport) => {
  requestLogs.forEach((el) => {
    transport.collectRequestLog(el);
  });
  dataLogs.forEach((el) => {
    transport.collectDataLog(el);
  });
});

setInterval(() => process.stdout.write('.'), 100);

setTimeout(() => {
  log.success('you\'re good to go');
  process.exit(0);
}, 3000);
