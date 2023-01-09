const Agent = require('./../agent.js');

// Consumer
// This logs event to the console

module.exports = class LogAgent extends Agent
{
	getEventInputs() { return ['input']; }

	onEvent(input, event)
	{
		console.log(event);
	}
}