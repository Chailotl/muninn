const Agent = require('./agent.js');

// Consumer
// This is a test agent that prints to the console

module.exports = class TestAgent extends Agent
{
	constructor(name, options)
	{
		super(name, options);
		console.log('I am constructed');
	}

	run()
	{
		super.run();
		console.log('I am running');
	}

	receiveEvent(event)
	{
		console.log(`I received an event: ${event}`);
	}

	receiveSignal()
	{
		super.receiveSignal();
		console.log('I received a signal');
	}
}