const { REQ_SORT_OPTIONS } = require('../transport/abstractTransport/constants');

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
  } = req.query;

  const filter = {
    method: [],
    code: [],
    path: [],
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
  } = req.query;

  const filter = {
    level: [],
    name: [],
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
