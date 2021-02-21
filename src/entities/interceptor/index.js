const stats = require('request-stats');
const {
  saveResponseBody,
  initializeRequest,
} = require('./helpers');

class Interceptor {
  constructor() {
    this._subscribers = [];
  }

  _invoke(info) {
    this._subscribers.forEach((callback) => callback(info));
  }

  watch(req, res, next) {
    initializeRequest(req);
    saveResponseBody(req, res);
    stats(req, res, this._invoke.bind(this));
    next();
  }

  onEnd(callback) {
    this._subscribers.push(callback);
  }
}

module.exports = Interceptor;
