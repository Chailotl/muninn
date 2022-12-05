const Agent = require('./agent.js');

// Transformer
// This delays events by a set amount of seconds

module.exports = class DelayAgent extends Agent
{
	constructor(name, options)
	{
		super(name, options ?? {
			delay: 5
		});
	}

	receiveEvent(event)
	{
		setTimeout(() =>
		{
			this.sendEvent(event);
		}, this.options.delay * 1000);
	}

	receiveSignal()
	{
		setTimeout(() =>
		{
			this.sendSignal();
		}, this.options.delay * 1000);
	}
}