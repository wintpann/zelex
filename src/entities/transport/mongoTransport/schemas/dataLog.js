const { Schema } = require('mongoose');

const dataLogSchema = new Schema({
  level: Number,
  step: String,
  name: String,
  description: String,
  time: Date,
  data: Object,
});

module.exports = dataLogSchema;
