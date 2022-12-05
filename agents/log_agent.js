const Agent = require('./agent.js');

// Consumer
// This logs event to the console

module.exports = class LogAgent extends Agent
{
	receiveEvent(event)
	{
		this.log(event);
	}
}