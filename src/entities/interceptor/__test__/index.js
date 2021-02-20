const { promisify } = require('util');
const express = require('express');
const cors = require('cors');
const { describe, it } = require('mocha');
const chaiHttp = require('chai-http');
const chai = require('chai');

const Interceptor = require('../index');

chai.use(chaiHttp);
const { expect, request } = chai;

describe('Interceptor', async () => {
  const PORT = 3001;
  const app = express();
  app.use(cors());

  const interceptor = new Interceptor();
  app.use(interceptor.watch.bind(interceptor));

  app.get('/interceptor', async (req, res) => {
    res.status(200).send('success');
  });

  const listen = promisify(app.listen);
  await listen(PORT);

  it('should intercept request and save body', async () => {
    let result = {};

    interceptor.onEnd((info) => {
      result = info;
    });

    await request(app).get('/interceptor');

    expect(result.ok).to.equal(true);
    expect(result.time).to.be.a('number');
    expect(result.res).to.be.a('object');
    expect(result.req).to.be.a('object');
    expect(result.res.raw.responseBody).to.be.a('object');
  });
});
