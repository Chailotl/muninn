const Agent = require('./agent.js');

// Emitter
// This sends a custom payload when signaled

module.exports = class CustomEventAgent extends Agent
{
	constructor(name, options)
	{
		super(name, options ?? {
			payload: 'Hello world!'
		});
	}

	receiveSignal()
	{
		this.sendEvent(this.options.payload);
	}
}