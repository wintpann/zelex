const { describe, it } = require('mocha');
const { expect } = require('chai');

const AbstractTransport = require('../index');
const { LEVEL } = require('../../../../config/constants');

const create = (options) => {
  const transport = new AbstractTransport({ path: '123', ...options });
  // eslint-disable-next-line no-underscore-dangle
  const { clear, save } = transport._timers;
  clear.unref();
  save.unref();
  const { _requestLogs, _dataLogs } = transport;
  return {
    transport,
    requestLogs:
    _requestLogs,
    dataLogs: _dataLogs,
  };
};

const MOCK_LOG = { data: 'random', level: LEVEL.DEBUG };

describe('AbstractTransport', () => {
  describe('constructor', () => {
    it('should throw error on wrong params', () => {
      let isError = false;
      try {
        // eslint-disable-next-line no-new
        new AbstractTransport({});
      } catch (e) {
        isError = true;
      }
      expect(isError).to.equal(true);
    });

    it('should create instance on fine params', () => {
      const { transport } = create();
      expect(transport).instanceof(AbstractTransport);
    });
  });

  it('should collect logs', () => {
    const { transport, requestLogs, dataLogs } = create();

    expect(requestLogs.length).to.equal(0);
    expect(dataLogs.length).to.equal(0);

    transport.collectRequestLog(MOCK_LOG);
    transport.collectDataLog(MOCK_LOG);

    expect(requestLogs.length).to.equal(1);
    expect(dataLogs.length).to.equal(1);
  });

  it('should not collect logs if appropriate flag is off', () => {
    const {
      transport,
      requestLogs,
      dataLogs,
    } = create({ saveDataLogLevels: [], saveRequestLogs: false });

    expect(requestLogs.length).to.equal(0);
    expect(dataLogs.length).to.equal(0);

    transport.collectRequestLog(MOCK_LOG);
    transport.collectDataLog(MOCK_LOG);

    expect(requestLogs.length).to.equal(0);
    expect(dataLogs.length).to.equal(0);
  });

  it('should upload all collected logs', async () => {
    const { transport, requestLogs, dataLogs } = create();

    transport.collectRequestLog(MOCK_LOG);
    transport.collectDataLog(MOCK_LOG);

    expect(requestLogs.length).to.equal(1);
    expect(dataLogs.length).to.equal(1);

    // eslint-disable-next-line no-underscore-dangle
    await transport._uploadAllCollectedLogs();

    expect(requestLogs.length).to.equal(0);
    expect(dataLogs.length).to.equal(0);
  });

  describe('should collect logs depending on levels', () => {
    const LOGS = {
      INFO: { data: 'mock', level: LEVEL.INFO },
      WARN: { data: 'mock', level: LEVEL.WARN },
      ERROR: { data: 'mock', level: LEVEL.ERROR },
      DEBUG: { data: 'mock', level: LEVEL.DEBUG },
      FATAL: { data: 'mock', level: LEVEL.FATAL },
    };

    it('should collect all levels', () => {
      const { transport, dataLogs } = create({ saveDataLogLevels: LEVEL.ALL });
      transport.collectDataLog(LOGS.INFO);
      transport.collectDataLog(LOGS.WARN);
      transport.collectDataLog(LOGS.ERROR);
      transport.collectDataLog(LOGS.DEBUG);
      transport.collectDataLog(LOGS.FATAL);
      expect(dataLogs.length).to.equal(5);
    });

    it('should collect one separate level', () => {
      const { transport, dataLogs } = create({ saveDataLogLevels: [LEVEL.INFO] });
      transport.collectDataLog(LOGS.INFO);
      expect(dataLogs.length).to.equal(1);
      transport.collectDataLog(LOGS.WARN);
      transport.collectDataLog(LOGS.ERROR);
      transport.collectDataLog(LOGS.DEBUG);
      transport.collectDataLog(LOGS.FATAL);
      expect(dataLogs.length).to.equal(1);
    });

    it('should collect multiple levels', () => {
      const { transport, dataLogs } = create({ saveDataLogLevels: [LEVEL.ERROR, LEVEL.FATAL] });
      transport.collectDataLog(LOGS.INFO);
      expect(dataLogs.length).to.equal(0);
      transport.collectDataLog(LOGS.WARN);
      expect(dataLogs.length).to.equal(0);
      transport.collectDataLog(LOGS.ERROR);
      expect(dataLogs.length).to.equal(1);
      transport.collectDataLog(LOGS.DEBUG);
      expect(dataLogs.length).to.equal(1);
      transport.collectDataLog(LOGS.FATAL);
      expect(dataLogs.length).to.equal(2);
    });
  });
});
