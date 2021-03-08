const fs = require('fs');
const express = require('express');
const cors = require('cors');
const log = require('../src/utils/logger');

const JSON_GO_TEST = 'JSON_GO_TEST';

if (!fs.existsSync(JSON_GO_TEST)) {
  fs.mkdirSync(JSON_GO_TEST);
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
  path: 'JSON_GO_TEST',
  saveInterval: '1m',
  clearAfter: '5d',
  checkToClearInterval: '1d',
  serveURL: '/json',
});

const mongoTransport = new Transport.Mongo({
  path: 'mongodb://localhost:27017/zelex-go-test',
  saveInterval: '1m',
  clearAfter: '5d',
  checkToClearInterval: '1d',
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

app.get('/get', (req, res) => {
  req.user = 'new user';
  req.zx.info({
    step: 'info',
    name: 'info',
    description: 'info',
    data: { info: 'info' },
  });
  res.send('success');
});

app.post('/post', (req, res) => {
  req.user = 'new user';
  req.zx.info({
    step: 'info',
    name: 'info',
    description: 'info',
    data: { info: 'info' },
  });
  res.send('success');
});

app.listen(3000, () => log.success('test app listening'));
