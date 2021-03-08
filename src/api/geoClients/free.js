const axios = require('axios');
const apiResult = require('../apiResult');

const Client = axios.create({
  baseURL: 'https://freegeoip.app/json/',
});

const getGeo = async (ip) => apiResult(
  Client.get(ip),
);

module.exports = {
  getGeo,
};
