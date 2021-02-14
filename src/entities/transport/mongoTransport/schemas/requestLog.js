const { Schema } = require('mongoose');

const requestLogSchema = new Schema({
  traffic: {
    incoming: Number,
    outgoing: Number,
    total: Number,
  },
  time: {
    started: Date,
    finished: Date,
    duration: Number,
  },
  request: {
    body: Object,
    headers: Object,
    location: {
      latitude: Number,
      longitude: Number,
    },
    city: String,
    region: String,
    isVPN: Boolean,
    ip: String,
    path: String,
    method: String,
  },
  response: {
    code: Number,
    headers: Object,
    data: Object,
  },
  extra: Object,
  dataLogs: [{
    level: Number,
    step: String,
    name: String,
    description: String,
    time: Date,
    data: Object,
  }],
});

module.exports = requestLogSchema;
