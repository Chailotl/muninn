const colors = require('colors');
const { log_level } = require('./config.json');

module.exports = {
	error: message => console.log(message.red),
	warn: message =>
	{
		if (log_level >= 1)
		{
			console.log(message.yellow);
		}
	},
	info: message =>
	{
		if (log_level >= 2)
		{
			console.log(message.green);
		}
	},
	debug: message =>
	{
		if (log_level >= 3)
		{
			if (typeof message === 'object')
			{
				console.log(message);
			}
			else
			{
				console.log(message.blue);
			}
		}
	},
};