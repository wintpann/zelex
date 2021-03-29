const { Schema } = require('mongoose');

const dataLogSchema = new Schema({
  level: Number,
  levelHumanized: String,
  step: String,
  name: String,
  description: String,
  time: Date,
  data: Object,
});

module.exports = dataLogSchema;
