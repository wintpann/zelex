const {
  describe,
  it,
  app,
  agent,
} = require('../../../utils/express-test')();
const { noop } = require('../../../helpers/common');
const {
  shape,
  number,
  date,
  string,
  optional,
  arrayOf,
  typeCheck,
} = require('../../../validation/typeCheck');

const Interceptor = require('../../interceptor');
const Collector = require('../index');
const CustomTransport = require('../../transport/customTransport');

const interceptor = new Interceptor();
const watch = interceptor.watch.bind(interceptor);

let TEST_LOG = {};

const transport = new CustomTransport({
  onRequestLog: (log) => {
    TEST_LOG = log;
  },
});

const collector = new Collector({
  transports: [transport],
  extras: {
    user: 'req.user',
  },
});

describe('Collector', () => {
  app.use(watch);

  app.post('/collector/:param', (req, res) => {
    req.user = '123';
    req.zx.warn({
      step: '1',
      name: '2',
      description: '3',
      data: { a: 2 },
    });
    res.send('success');
  });

  it('should collect request info with extras and data logs', (done) => {
    let error = '';

    interceptor.onEveryRequest((info) => {
      collector.collectRequest(info);

      try {
        typeCheck(
          ['TEST_LOG', TEST_LOG, shape({
            traffic: shape({
              incoming: number,
              outgoing: number,
              total: number,
            }),
            time: shape({
              started: date,
              finished: date,
              duration: number,
            }),
            geo: optional(shape({
              location: shape({
                latitude: number,
                longitude: number,
              }),
              city: string,
              region: string,
            })),
            request: shape({
              body: shape({}),
              headers: shape({}),
              ip: string,
              method: string,
              path: string,
              params: shape({}),
              query: shape({}),
            }),
            response: shape({
              code: number,
              headers: shape({}),
              data: shape({}),
            }),
            extra: shape({}),
            dataLogs: arrayOf(shape({
              level: number,
              levelHumanized: string,
              time: date,
              step: optional(string),
              name: optional(string),
              description: optional(string),
              data: optional(shape({})),
            })),
          })],
        ).complete();
      } catch (e) {
        error = e.message;
      }
      done(error);
    });

    agent.post('/collector/param?query=query').send({ a: 2 }).end(noop);
  });
});
