const Agent = require('./agent.js');

// Consumer
// This is a test agent that prints to the console

module.exports = class TestAgent extends Agent
{
	constructor(name, options)
	{
		super(name, options);
		log('I am constructed');
	}

	run()
	{
		super.run();
		log('I am running');
	}

	receiveEvent(event)
	{
		log(`I received an event: ${event}`);
	}

	receiveSignal()
	{
		super.receiveSignal();
		log('I received a signal');
	}
}