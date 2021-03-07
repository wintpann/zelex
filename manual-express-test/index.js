const fs = require('fs');
const express = require('express');
const cors = require('cors');
const log = require('../src/utils/logger');

const JSON_LOGS_TEST = 'JSON_LOGS_TEST';

if (!fs.existsSync(JSON_LOGS_TEST)) {
  fs.mkdirSync(JSON_LOGS_TEST);
}

const { LEVEL, createLogger, Transport } = require('../src/index');

const app = express();
app.use(cors());
app.use(express.json());

const customTransport = new Transport.Custom({
  onDataLog: () => log.info('got data log'),
  onRequestLog: () => log.info('got request log'),
  saveDataLogLevels: [LEVEL.INFO, LEVEL.WARN],
});

const jsonTransport = new Transport.JSON({
  path: 'JSON_LOGS_TEST',
  saveInterval: 1000 * 5,
  clearAfter: 1000 * 60 * 5,
  checkToClearInterval: 1000 * 60,
  // serveURL: 'json',
});

const mongoTransport = new Transport.Mongo({
  path: 'mongodb://localhost:27017/zelex-manual-test',
  saveInterval: 1000 * 10,
  clearAfter: 1000 * 60 * 5,
  checkToClearInterval: 1000 * 60,
  serveURL: '/mongo',
});

const logger = createLogger({
  app,
  transport: [
    customTransport,
    jsonTransport,
    mongoTransport,
  ],
  extras: {
    user: 'req.user',
  },
});

app.use('*', logger.watch);

app.get('/test', (req, res) => {
  req.user = 'new user';
  req.zx.info({
    step: 'info',
    name: 'info',
    description: 'info',
    data: { info: 'info' },
  });
  req.zx.warn({
    step: 'warn',
    name: 'warn',
    description: 'warn',
    data: { warn: 'warn' },
  });
  res.send('success');
});

app.listen(3000, () => log.success('test app listening'));
