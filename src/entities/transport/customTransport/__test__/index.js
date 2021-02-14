const {
  describe,
  it,
  beforeEach,
} = require('mocha');
const { expect } = require('chai');

const CustomTransport = require('../index');
const { LEVEL } = require('../../../../config/constants');

const {
  getMockDataLog,
  getMockRequestLog,
} = require('../../../../mocks');

const dataLogs = [];
const requestLogs = [];

const onDataLog = (log) => dataLogs.push(log);
const onRequestLog = (log) => requestLogs.push(log);

describe('CustomTransport', () => {
  beforeEach(() => {
    dataLogs.length = 0;
    requestLogs.length = 0;
  });

  it('should pass all logs with default save options', () => {
    const transport = new CustomTransport({
      onDataLog,
      onRequestLog,
    });

    transport.collectDataLog(getMockDataLog());
    transport.collectRequestLog(getMockRequestLog());

    expect(dataLogs.length).to.equal(1);
    expect(requestLogs.length).to.equal(1);
  });

  it('should not pass request logs if appropriate flag is off', () => {
    const transport = new CustomTransport({
      onRequestLog,
      saveRequestLogs: false,
    });

    transport.collectRequestLog(getMockRequestLog());

    expect(requestLogs.length).to.equal(0);
  });

  it('should pass only suitable data logs', () => {
    const transport = new CustomTransport({
      onDataLog,
      saveDataLogLevels: [LEVEL.ERROR, LEVEL.DEBUG],
    });

    const infoLog = getMockDataLog(Date.now(), LEVEL.INFO);
    const debugLog = getMockDataLog(Date.now(), LEVEL.DEBUG);
    const errorLog = getMockDataLog(Date.now(), LEVEL.ERROR);
    const fatalLog = getMockDataLog(Date.now(), LEVEL.FATAL);
    const warnLog = getMockDataLog(Date.now(), LEVEL.WARN);

    transport.collectDataLog(infoLog);
    transport.collectDataLog(debugLog);
    transport.collectDataLog(errorLog);
    transport.collectDataLog(fatalLog);
    transport.collectDataLog(warnLog);

    expect(dataLogs.length).to.equal(2);
  });
});
