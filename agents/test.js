const Agent = require('./../agent.js');

// Consumer
// This is a test agent that prints to the console

module.exports = class TestAgent extends Agent
{
	getEventInputs() { return ['input']; }
	getTriggerInputs() { return ['trigger']; }

	constructor(name, options)
	{
		super(name, options);
		this.log('I am constructed');
	}

	run()
	{
		this.log('I am running');
	}

	onEvent(input, event)
	{
		this.log(`I received an event: ${event}`);
	}

	onTrigger(input)
	{
		this.log('I received a signal');
	}
}