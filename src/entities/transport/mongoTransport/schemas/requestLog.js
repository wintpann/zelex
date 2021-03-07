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
  geo: {
    location: {
      latitude: Number,
      longitude: Number,
    },
    city: String,
    region: String,
  },
  request: {
    body: Object,
    headers: Object,
    ip: String,
    path: String,
    method: String,
    params: Object,
    query: Object,
  },
  response: {
    code: Number,
    headers: Object,
    data: Object,
  },
  extra: Object,
  dataLogs: [{
    level: Number,
    levelHumanized: String,
    step: String,
    name: String,
    description: String,
    time: Date,
    data: Object,
  }],
});

module.exports = requestLogSchema;
