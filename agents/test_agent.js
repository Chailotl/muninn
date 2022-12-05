const Agent = require('./agent.js');

// Consumer
// This is a test agent that prints to the console

module.exports = class TestAgent extends Agent
{
	constructor(name, options)
	{
		super(name, options);
		this.log('I am constructed');
	}

	run()
	{
		super.run();
		this.log('I am running');
	}

	receiveEvent(event)
	{
		this.log(`I received an event: ${event}`);
	}

	receiveSignal()
	{
		super.receiveSignal();
		this.log('I received a signal');
	}
}