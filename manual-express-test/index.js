const fs = require('fs');
const express = require('express');
const cors = require('cors');
const log = require('../src/utils/logger');

const JSON_LOGS_TEST = 'JSON_LOGS_TEST';

if (!fs.existsSync(JSON_LOGS_TEST)) {
  fs.mkdirSync(JSON_LOGS_TEST);
}

const { createLogger, Transport } = require('../src/index');

const app = express();
app.use(cors());
app.use(express.json());

const customTransport = new Transport.Custom({
  onDataLog: () => log.info('got data log'),
  onRequestLog: () => log.info('got request log'),
});

const jsonTransport = new Transport.JSON({
  path: 'JSON_LOGS_TEST',
  saveInterval: '5s',
  clearAfter: '5m',
  checkToClearInterval: '1s',
  serveURL: '/json',
});

const mongoTransport = new Transport.Mongo({
  path: 'mongodb://localhost:27017/zelex-manual-test',
  saveInterval: '5s',
  clearAfter: '5m',
  checkToClearInterval: '1s',
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

setTimeout(() => {
  logger.info({
    step: 'info', name: 'info', description: 'info', data: { random: Math.random() },
  });
  logger.fatal({
    step: 'fatal', name: 'fatal', description: 'fatal', data: { random: Math.random() },
  });
  logger.debug({
    step: 'debug', name: 'debug', description: 'debug', data: { random: Math.random() },
  });
}, 1000 * 5);

app.listen(3000, () => log.success('test app listening'));
