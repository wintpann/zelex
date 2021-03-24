const logger = require('../../../utils/logger');

const getLogBuffer = (data) => {
  let buffer = null;
  try {
    const stringed = JSON.stringify(data);
    buffer = Buffer.from(stringed);
  } catch (e) {
    logger.error('could not buffering log', e);
  }
  return buffer;
};

const getNotInPageRange = (index, pageIndex, pageSize) => {
  const paginationRangeMin = pageIndex * pageSize;
  const paginationRangeMax = paginationRangeMin + pageSize + 1;
  const notInRange = index < paginationRangeMin || index > paginationRangeMax;
  return notInRange;
};

const getNotInDateRange = (dateFrom, dateTo, value) => {
  const dateValue = new Date(value);

  if (dateFrom && dateValue < new Date(dateFrom)) {
    return true;
  }
  if (dateTo && dateValue > new Date(dateTo)) {
    return true;
  }
  return false;
};

const getNotInOptions = (...options) => {
  let i = 0;
  const len = options.length;

  for (; i < len; i++) {
    const [available, value] = options[i];
    if (available.length && !available.includes(value)) {
      return true;
    }
  }
  return false;
};

module.exports = {
  getLogBuffer,
  getNotInPageRange,
  getNotInDateRange,
  getNotInOptions,
};
