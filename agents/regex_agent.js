const Agent = require('./agent.js');

// Transfomer/filter
// This captures data from an event using regex

module.exports = class RegExAgent extends Agent
{
	constructor(name, options)
	{
		super(name, options ?? {
			regex: '',
			filter: false
		});
	}

	receiveEvent(event)
	{
		var [, pattern, flags] = this.options.regex.split('/');
		var regex = new RegExp(pattern, flags);

		if (this.options.filter)
		{
			if (event.test(regex))
			{
				this.sendEvent(event);
				this.sendSignal();
			}
		}
		else
		{
			var match = event.match(regex);

			if (match)
			{
				this.sendEvent(match);
				this.sendSignal();
			}
		}
	}
}