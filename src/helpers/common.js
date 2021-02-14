const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const last = (array) => array[array.length - 1];

const first = (array) => array[0];

module.exports = {
  delay,
  last,
  first,
};
