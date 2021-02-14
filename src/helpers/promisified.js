const fs = require('fs');
const { promisify } = require('util');

const readdir = promisify(fs.readdir);

module.exports = {
  readdir,
};
