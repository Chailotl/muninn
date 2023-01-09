const Agent = require('./../agent.js');
const weather = require('openweather-apis');

const apiKey = require('./../config.json').openWeather_key;

// Emitter
// This agent emits weather events when signaled, and it requires an openweather API key

module.exports = class WeatherAgent extends Agent
{
	getOptions() { return ['cityId', 'units', 'language']; }

	getTriggerInputs() { return ['trigger']; }

	getEventOutputs() { return ['output']; }

	onRun()
	{
		if (!this.options.units)
		{
			this.options.units = 'metric';
		}
		if (!this.options.langauge)
		{
			this.options.language = 'en';
		}

		weather.setAPPID(apiKey);
		weather.setCityId(this.options.cityId);
		weather.setUnits(this.options.units);
		weather.setLang(this.options.language);
	}

	onTrigger(input)
	{
		weather.getSmartJSON((err, smart) =>
		{
			this.sendEvent('output', smart);
		});
	}
}