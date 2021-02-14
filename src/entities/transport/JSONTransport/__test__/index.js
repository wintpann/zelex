const fs = require('fs');
const {
  describe,
  it,
  after,
  before,
} = require('mocha');
const { expect } = require('chai');

const JSONTransport = require('../index');

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
      const transport = new JSONTransport({ path: TEST_PATH });
      const { _timers: { clear, save } } = transport;
      clearInterval(clear);
      clearInterval(save);
    } catch (e) {
      fail = true;
    }
    expect(fail).to.equal(false);
  });
});
