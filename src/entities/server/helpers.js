const {
  REQ_SORT_OPTIONS,
  DEFAULT_PAGINATION,
  DATA_SORT_OPTIONS,
} = require('../transport/abstractTransport/constants');
const { isValidDate } = require('../../helpers/common');

const availableRequestSorts = Object.keys(REQ_SORT_OPTIONS);
const availableDataSorts = Object.keys(DATA_SORT_OPTIONS);

const getQueryOptions = (
  value,
  isValidItemFn = Boolean,
  mapFn,
) => {
  if (!value) {
    return [];
  }

  const options = [];
  String(value).split(',').forEach((item) => {
    const isValid = isValidItemFn(item);
    if (isValid) {
      options.push(mapFn ? mapFn(item) : item);
    }
  });

  return options;
};

const getPagination = (size, index) => {
  const pagination = { ...DEFAULT_PAGINATION };

  const pageSize = parseInt(size, 10);
  const pageIndex = parseInt(index, 10);

  const isValidPageSize = typeof pageSize === 'number' && pageSize > 0;
  const isValidPageIndex = typeof pageSize === 'number' && pageSize >= 0;

  if (isValidPageSize) {
    pagination.pageSize = pageSize;
  }
  if (isValidPageIndex) {
    pagination.pageIndex = pageIndex;
  }

  return pagination;
};

const getDate = (value) => {
  const date = Number(value);
  const validDate = isValidDate(date);
  return validDate ? date : undefined;
};

const getSort = (value, availableOptions) => {
  const validSort = availableOptions.includes(value);
  return validSort ? value : undefined;
};

const getParamsForRequestLogs = (req) => {
  const {
    method,
    code,
    path,
    pageSize,
    pageIndex,
    dateFrom,
    dateTo,
    sort,
  } = req.query;

  const filter = {
    method: getQueryOptions(
      method,
      undefined,
      (item) => item.toUpperCase(),
    ),
    code: getQueryOptions(
      code,
      (item) => {
        const num = parseInt(item, 10);
        const isValidCode = !Number.isNaN(num);
        return isValidCode;
      },
    ),
    path: getQueryOptions(path),
    dateFrom: getDate(dateFrom),
    dateTo: getDate(dateTo),
  };
  const pagination = getPagination(pageSize, pageIndex);

  return [filter, pagination, getSort(sort, availableRequestSorts)];
};

const getParamsForDataLogs = (req) => {
  const {
    level,
    name,
    pageSize,
    pageIndex,
    dateFrom,
    dateTo,
    sort,
  } = req.query;

  const filter = {
    level: getQueryOptions(level),
    name: getQueryOptions(name),
    dateFrom: getDate(dateFrom),
    dateTo: getDate(dateTo),
  };
  const pagination = getPagination(pageSize, pageIndex);

  return [filter, pagination, getSort(sort, availableDataSorts)];
};

const notifyError = (text) => ({
  notify: {
    type: 'error',
    text,
  },
});

const notifySuccess = (text) => ({
  notify: {
    type: 'success',
    text,
  },
});

const notifyInfo = (text) => ({
  notify: {
    type: 'info',
    text,
  },
});

module.exports = {
  getParamsForRequestLogs,
  getParamsForDataLogs,
  notifyError,
  notifySuccess,
  notifyInfo,
};
