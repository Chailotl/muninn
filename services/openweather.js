const apiKey = require('../config.json').openWeather_key;

if (!apiKey) { return; }

const weather = require('openweather-apis');
weather.setAPPID(apiKey);

module.exports = weather;