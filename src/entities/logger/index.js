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
const { LEVEL } = require('../../config/constants');

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

    this._interceptor.onEveryRequest((raw) => {
      this._collector.collectRequest(raw);
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

  info(options) {
    this._createDataLog(options, LEVEL.INFO);
  }

  warn(options) {
    this._createDataLog(options, LEVEL.WARN);
  }

  error(options) {
    this._createDataLog(options, LEVEL.ERROR);
  }

  debug(options) {
    this._createDataLog(options, LEVEL.DEBUG);
  }

  fatal(options) {
    this._createDataLog(options, LEVEL.FATAL);
  }

  _createDataLog(log, level) {
    this._collector.collectData({ ...log, level });
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
