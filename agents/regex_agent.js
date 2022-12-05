const Agent = require('./agent.js');

// Transfomer/filter
// This captures data from an event using regex

module.exports = class RegExAgent extends Agent
{
	constructor(name, options)
	{
		super(name, options ?? {
			regex: '',
			filter: false,
			negateSignal: false
		});
	}

	receiveEvent(event)
	{
		var [, pattern, flags] = this.options.regex.split('/');
		var regex = new RegExp(pattern, flags);
		var signal = false;

		if (this.options.filter)
		{
			if (event.test(regex))
			{
				this.sendEvent(event);
				signal = true;
			}
		}
		else
		{
			var match = event.match(regex);

			if (match)
			{
				this.sendEvent(match);
				signal = true;
			}
		}

		// Negate the signal if the event does not pass the filter
		if (this.negateSignal)
		{
			signal = !signal;
		}

		if (signal)
		{
			this.sendSignal();
		}
	}
}