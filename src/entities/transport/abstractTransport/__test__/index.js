const { describe, it } = require('mocha');
const { expect } = require('chai');

const AbstractTransport = require('../index');

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

const MOCK_LOG = { data: 'random' };

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
    const log = { data: 'random' };
    const { transport, requestLogs, dataLogs } = create();

    expect(requestLogs.length).to.equal(0);
    expect(dataLogs.length).to.equal(0);

    transport.collectRequestLog(log);
    transport.collectDataLog(log);

    expect(requestLogs.length).to.equal(1);
    expect(dataLogs.length).to.equal(1);
  });

  it('should not collect logs if appropriate flag is off', () => {
    const {
      transport,
      requestLogs,
      dataLogs,
    } = create({ saveDataLogs: false, saveRequestLogs: false });

    expect(requestLogs.length).to.equal(0);
    expect(dataLogs.length).to.equal(0);

    transport.collectRequestLog(MOCK_LOG);
    transport.collectDataLog(MOCK_LOG);

    expect(requestLogs.length).to.equal(0);
    expect(dataLogs.length).to.equal(0);
  });

  it('should upload all collected logs', () => {
    const { transport, requestLogs, dataLogs } = create();

    transport.collectRequestLog(MOCK_LOG);
    transport.collectDataLog(MOCK_LOG);

    expect(requestLogs.length).to.equal(1);
    expect(dataLogs.length).to.equal(1);

    // eslint-disable-next-line no-underscore-dangle
    transport._uploadAllCollectedLogs();

    expect(requestLogs.length).to.equal(0);
    expect(dataLogs.length).to.equal(0);
  });
});
