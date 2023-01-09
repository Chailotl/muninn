const Agent = require('./../agent.js');

// Transfomer/filter
// This captures data from an event using regex

module.exports = class RegExAgent extends Agent
{
	getOptions() { return ['regex']; }

	getEventInputs() { return ['input']; }

	getEventOutputs() { return ['match', 'pass', 'fail']; }
	getTriggerOutputs() { return ['pass', 'fail']; }

	onEvent(input, event)
	{
		var [, pattern, flags] = this.options.regex.split('/');
		var regex = new RegExp(pattern, flags);

		if (regex.test(event))
		{
			this.sendEvent('match', event.match(regex));
			this.sendEvent('pass', event);
			this.sendTrigger('pass');
		}
		else
		{
			this.sendEvent('fail', event);
			this.sendTrigger('fail');
		}
	}
}