const MongoTransport = require('./entities/transport/mongoTransport');
const JSONTransport = require('./entities/transport/JSONTransport');
const CustomTransport = require('./entities/transport/customTransport');

const Logger = require('./entities/logger');

const { LEVEL } = require('./config/constants');

const Transport = {
  Mongo: MongoTransport,
  JSON: JSONTransport,
  Custom: CustomTransport,
};

const createLogger = ({
  app,
  transport,
  extras,
}) => {
  const logger = new Logger({
    app,
    transport,
    extras,
  });
  logger.watch = logger.watch.bind(logger);
  return logger;
};

module.exports = {
  createLogger,
  Transport,
  LEVEL,
};
