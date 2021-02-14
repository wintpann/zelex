const fs = require('fs');
const {
  describe,
  it,
  after,
  before,
} = require('mocha');
const { expect } = require('chai');

const JSONTransport = require('../index');
const { delay } = require('../../../../helpers/common');

const {
  getMockDataLog,
  getMockRequestLog,
} = require('../../../../mocks');

const TEST_PATH = 'TEST_PATH';

describe('JSONTransport', () => {
  before(() => {
    fs.mkdirSync(TEST_PATH);
  });

  after(() => {
    fs.rmdirSync(TEST_PATH, { recursive: true });
  });

  it('should not create instance on invalid path', () => {
    let fail = false;
    try {
      // eslint-disable-next-line no-new
      new JSONTransport({ path: 'logs' });
    } catch (e) {
      fail = true;
    }
    expect(fail).to.equal(true);
  });

  it('should create instance on valid path', () => {
    let fail = false;
    try {
      // eslint-disable-next-line no-new
      new JSONTransport({ path: TEST_PATH });
    } catch (e) {
      fail = true;
    }
    expect(fail).to.equal(false);
  });

  it('should save logs as files and remove it if time has come', async () => {
    const transport = new JSONTransport({
      path: TEST_PATH,
      saveInterval: 10,
      checkToClearInterval: 10,
      clearAfter: 10000,
    });

    const freshDataLog = getMockDataLog();
    const freshRequestLog = getMockRequestLog();

    const oldDataLog = getMockDataLog(Date.now() - 20000);
    const oldRequestLog = getMockRequestLog(Date.now() - 20000);

    transport.collectDataLog(freshDataLog);
    transport.collectRequestLog(freshRequestLog);

    transport.collectDataLog(oldDataLog);
    transport.collectRequestLog(oldRequestLog);

    // 10ms for interval + ~40ms to write/clear files, increase delay first if test failed
    await delay(50);

    const requestLogsCreated = fs.readdirSync(`${TEST_PATH}/request`);
    const dataLogsCreated = fs.readdirSync(`${TEST_PATH}/data`);

    // old logs should be deleted, but fresh ones not
    expect(requestLogsCreated.length).to.equal(1);
    expect(dataLogsCreated.length).to.equal(1);
  });
});
