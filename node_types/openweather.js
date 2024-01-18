const Node = require('../node.js');
const logger = require('../logger');

module.exports = class OpenWeatherNode extends Node
{
	getDescription()
	{
		return `This node retrieves weather data from OpenWeather.

You can get your city id by searching for your city here https://openweathermap.org/ and taking it from the URL.
Units can either be metric or imperial.

All weather data JSON API response can be found here: https://openweathermap.org/current
Weather condition codes can be found here: https://openweathermap.org/weather-conditions

{
	temp: -6.35,
	humidity: 72,
	pressure: 1020,
	description: 'broken clouds',
	weathercode: 803,
	rain: 0
}`;
	}
	getDefaultConfig() { return { cityId: '', units: 'metric', language: 'en', allWeatherData: false }; }
	getInputs() { return ['trigger']; }
	getOutputs() { return ['output']; }

	onEvent(input, event)
	{
		let weather = global.services.openweather;

		if (!weather)
		{
			logger.warn('No OpenWeather API key provided');
			return true;
		}

		weather.setCityId(this.config.cityId);
		weather.setUnits(this.config.units);
		weather.setLang(this.config.language);

		if (this.config.allWeatherData)
		{
			weather.getAllWeather((err, result) =>
			{
				event.payload = result;
				this.sendEvent('output', event);
			});
		}
		else
		{
			weather.getSmartJSON((err, result) =>
			{
				event.payload = result;
				this.sendEvent('output', event);
			});
		}
	}
}