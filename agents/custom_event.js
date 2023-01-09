const Agent = require('./../agent.js');

// Emitter
// This sends a custom payload when triggered

module.exports = class CustomEventAgent extends Agent
{
	getOptions() { return ['payload']; }

	getTriggerInputs() { return ['trigger']; }

	getEventOutputs() { return ['output']; }

	onTrigger(input)
	{
		this.sendEvent('output', this.options.payload);
	}
}