const Agent = require('./../agent.js');

// Transformer
// This delays events by a set amount of seconds

module.exports = class DelayAgent extends Agent
{
	getOptions() { return ['delay']; }
	
	getEventInputs() { return ['input']; }
	getTriggerInputs() { return ['trigger']; }

	getEventOutputs() { return ['output']; }
	getTriggerOutputs() { return ['trigger']; }

	onEvent(input, event)
	{
		setTimeout(() => this.sendEvent('output', event), this.options.delay * 1000);
	}

	onTrigger(input)
	{
		setTimeout(() => this.sendTrigger('trigger'), this.options.delay * 1000);
	}
}