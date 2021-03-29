const {
  describe,
  it,
} = require('mocha');
const { expect } = require('chai');

const MongoTransport = require('../index');

const TEST_PATH = 'mongodb://localhost:27017/zelex-test';

describe('MongoTransport', () => {
  it('should not create instance on invalid path', async () => {
    let fail = false;
    try {
      // eslint-disable-next-line no-new
      new MongoTransport({ path: 'logs' });
    } catch (e) {
      fail = true;
    }
    expect(fail).to.equal(true);
  });

  it('should create instance on valid path', async () => {
    let fail = false;
    let db;
    try {
      // eslint-disable-next-line no-new
      db = new MongoTransport({ path: TEST_PATH });
    } catch (e) {
      fail = true;
    }
    // eslint-disable-next-line no-underscore-dangle
    await db._disconnect();
    expect(fail).to.equal(false);
  });
});
