const express = require('express');
const {
  shape,
  func,
  typeCheck,
} = require('../../validation/typeCheck');
const AbstractTransport = require('../transport/abstractTransport');
const Interceptor = require('../interceptor');
const Collector = require('../collector');
const Server = require('../server');

class Logger {
  constructor({
    transport,
    app,
    extras,
  } = {}) {
    this._transports = this._getTransports(transport);
    this._app = app;
    this._extras = extras;

    this._validateLoggerInit();
    this._validateTransports();

    this._app.use(express.json());

    this._interceptor = new Interceptor();
    this._interceptor.watch = this._interceptor.watch.bind(this._interceptor);

    this._collector = new Collector({
      transports: this._transports,
      extras: this._extras,
    });

    this._interceptor.onEvery((raw) => {
      this._collector.collect(raw);
    });

    this._server = new Server({
      app: this._app,
      transports: this._transports,
    });
    this._server.start();
  }

  watch(req, res, next) {
    this._interceptor.watch(req, res, next);
  }

  _getTransports(transport) {
    const isArray = Array.isArray(transport);
    return isArray ? transport : [transport];
  }

  _validateLoggerInit() {
    typeCheck(
      ['app.use', this._app.use, func],
      ['app.get', this._app.get, func],
      ['extras', this._extras, shape({})],
    );
  }

  _validateTransports() {
    const error = this._transports.some((transport) => {
      const wrongTransport = !(transport instanceof AbstractTransport);
      return wrongTransport;
    });
    if (error) {
      throw new Error('Not valid transports passed');
    }
  }
}

module.exports = Logger;
