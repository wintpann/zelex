const { describe, it } = require('mocha');
const chaiHttp = require('chai-http');
const chai = require('chai');

const express = require('express');
const cors = require('cors');

chai.use(chaiHttp);
const { expect, request } = chai;

const app = express();
app.use(cors());

const agent = request(app).keepOpen();

const handleRoute = (message = 'success', data) => {
  const controller = async (req, res) => {
    if (data) {
      res.json(data);
    } else {
      res.send(message);
    }
  };
  return controller;
};

module.exports = {
  describe,
  expect,
  it,
  app,
  agent,
  handleRoute,
};
