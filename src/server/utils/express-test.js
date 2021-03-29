const { describe, it } = require('mocha');
const chaiHttp = require('chai-http');
const chai = require('chai');

const express = require('express');
const cors = require('cors');

chai.use(chaiHttp);
const { expect, request } = chai;

const expressTest = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  const agent = request(app).keepOpen();

  const handleRoute = ({
    message = 'success',
    data,
    extras,
  } = {}) => {
    const controller = (req, res) => {
      if (extras) {
        Object.keys(extras).forEach((key) => {
          req[key] = extras[key];
        });
      }

      if (data) {
        res.json(data);
      } else {
        res.send(message);
      }
    };
    return controller;
  };

  return {
    describe,
    expect,
    it,
    app,
    agent,
    handleRoute,
  };
};

module.exports = expressTest;
