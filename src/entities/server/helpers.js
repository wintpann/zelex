const { REQ_SORT_OPTIONS } = require('../transport/abstractTransport/constants');
const { isValidDate } = require('../../helpers/common');

const availableRequestSorts = Object.keys(REQ_SORT_OPTIONS);

const getParamsForRequestLogs = (req) => {
  const {
    method = '',
    code = '',
    path = '',
  } = req.query;

  let {
    pageSize = '',
    pageIndex = '',
    sort = '',
    dateFrom = '',
    dateTo = '',
  } = req.query;

  const filter = {
    method: [],
    code: [],
    path: [],
    dateFrom: '',
    dateTo: '',
  };
  const pagination = {
    pageSize: 10,
    pageIndex: 0,
  };

  method.split(',').forEach((item) => {
    if (item) {
      filter.method.push(item.toUpperCase());
    }
  });

  code.split(',').forEach((item) => {
    const num = parseInt(item, 10);
    const isValidCode = !Number.isNaN(num);
    if (isValidCode) {
      filter.code.push(num);
    }
  });

  path.split(',').forEach((item) => {
    if (item) {
      filter.path.push(item);
    }
  });

  dateFrom = Number(dateFrom);
  dateTo = Number(dateTo);

  const validDateFrom = isValidDate(dateFrom);
  const validDateTo = isValidDate(dateTo);

  if (validDateFrom) {
    filter.dateFrom = dateFrom;
  }

  if (validDateTo) {
    filter.dateTo = dateTo;
  }

  pageSize = parseInt(pageSize, 10);
  pageIndex = parseInt(pageIndex, 10);

  const isValidPageSize = typeof pageSize === 'number' && pageSize > 0;
  const isValidPageIndex = typeof pageSize === 'number' && pageSize >= 0;

  if (isValidPageSize) {
    pagination.pageSize = pageSize;
  }
  if (isValidPageIndex) {
    pagination.pageIndex = pageIndex;
  }

  const invalidSort = !availableRequestSorts.includes(sort);
  if (invalidSort) {
    sort = undefined;
  }

  return [filter, pagination, sort];
};

const getParamsForDataLogs = (req) => {
  const {
    level = '',
    name = '',
  } = req.query;

  let {
    pageSize = '',
    pageIndex = '',
    sort = '',
    dateFrom = '',
    dateTo = '',
  } = req.query;

  const filter = {
    level: [],
    name: [],
    dateFrom: '',
    dateTo: '',
  };
  const pagination = {
    pageSize: 10,
    pageIndex: 0,
  };

  level.split(',').forEach((item) => {
    if (item) {
      filter.level.push(item);
    }
  });

  name.split(',').forEach((item) => {
    if (item) {
      filter.name.push(item);
    }
  });

  dateFrom = Number(dateFrom);
  dateTo = Number(dateTo);

  const validDateFrom = isValidDate(dateFrom);
  const validDateTo = isValidDate(dateTo);

  if (validDateFrom) {
    filter.dateFrom = dateFrom;
  }

  if (validDateTo) {
    filter.dateTo = dateTo;
  }

  pageSize = parseInt(pageSize, 10);
  pageIndex = parseInt(pageIndex, 10);

  const isValidPageSize = typeof pageSize === 'number' && pageSize > 0;
  const isValidPageIndex = typeof pageSize === 'number' && pageSize >= 0;

  if (isValidPageSize) {
    pagination.pageSize = pageSize;
  }
  if (isValidPageIndex) {
    pagination.pageIndex = pageIndex;
  }

  const invalidSort = !availableRequestSorts.includes(sort);
  if (invalidSort) {
    sort = undefined;
  }

  return [filter, pagination, sort];
};

module.exports = {
  getParamsForRequestLogs,
  getParamsForDataLogs,
};
