const {
  describe,
  it,
  expect,
  app,
} = require('../../../utils/express-test')();
const CustomTransport = require('../../transport/customTransport');
const Logger = require('../index');

const transport = new CustomTransport();
const extras = { user: 'req.user' };

describe('Logger', () => {
  it('should not create instance on invalid params', () => {
    let error = false;
    try {
      // eslint-disable-next-line no-new
      new Logger({
        transport: 2,
        app: 'gu',
        extras: [],
      });
    } catch (e) {
      error = true;
    }
    expect(error).to.equal(true);
  });

  it('should create instance on valid params', () => {
    const logger = new Logger({
      transport,
      app,
      extras,
    });
    const validInstance = logger instanceof Logger;
    expect(validInstance).to.equal(true);
  });
});
