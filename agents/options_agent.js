const Agent = require('./agent.js');

// Consumer
// This modifies the options of other agents when it receives option data through an event

module.exports = class OptionsAgent extends Agent
{
	receiveEvent(event)
	{
		if (typeof event === 'object')
		{
			for (var option in event)
			{
				for (var agent of this.eventTargets)
				{
					if (agent.options[option])
					{
						agent.options[option] = event[option];
					}
				}
			}
		}
	}
}