const {
  describe,
  it,
  expect,
  app,
  agent,
  handleRoute,
} = require('../../../utils/express-test')();

const Interceptor = require('../index');

const interceptor = new Interceptor();
const watch = interceptor.watch.bind(interceptor);

describe('Interceptor', async () => {
  app.use(watch);
  app.get('/interceptor', handleRoute());

  it('should intercept request and save body', async () => {
    let result = {};

    interceptor.onEveryRequest((info) => {
      result = info;
    });

    await agent.get('/interceptor');

    expect(result.ok).to.equal(true);
    expect(result.time).to.be.a('number');
    expect(result.res).to.be.a('object');
    expect(result.req).to.be.a('object');
    expect(result.res.raw.responseBody).to.be.a('object');
  });
});
