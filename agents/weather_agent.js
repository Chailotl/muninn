const Agent = require('./agent.js');
const weather = require('openweather-apis');

const apiKey = require('./../config.json').openWeather_key;

// Emitter
// This agent emits weather events when signaled, and it requires an openweather API key

module.exports = class WeatherAgent extends Agent
{
	constructor(name, options)
	{
		super(name, options ?? {
			cityId: 0,
			units: 'metric',
			language: 'en'
		});
	}

	run()
	{
		weather.setAPPID(apiKey);
		weather.setCityId(this.options.cityId);
		weather.setUnits(this.options.units);
		weather.setLang(this.options.language);
	}

	receiveSignal()
	{
		weather.getSmartJSON((err, smart) =>
		{
			this.sendEvent(smart);
		});
	}
}