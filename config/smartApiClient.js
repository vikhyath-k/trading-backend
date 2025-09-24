const { SmartAPI } = require("smartapi-javascript");
require("dotenv").config();

const smartApi = new SmartAPI({
  api_key: process.env.SMART_API_KEY,
  // access_token, refresh_token etc. can be set later once login happens
});

module.exports = smartApi;
