const Agent = require('./../agent.js');
const crypto = require('crypto');

// Filter
// This only passes along events if there is a change from the previous event

module.exports = class ChecksumAgent extends Agent
{
	getEventInputs() { return ['input']; }

	getEventOutputs() { return ['pass', 'fail']; }
	getTriggerOutputs() { return ['pass', 'fail']; }

	onRun()
	{
		if (!this.data.checksum)
		{
			this.data.checksum = '';
		}
	}

	onEvent(input, event)
	{
		var test = typeof event === 'object' ? JSON.stringify(event) : event;
		var hash = crypto.createHash('md5').update(test).digest('hex');

		if (hash != this.data.checksum)
		{
			this.sendEvent('pass', event);
			this.sendTrigger('pass');
			this.data.checksum = hash;
		}
		else
		{
			this.sendEvent('fail', event);
			this.sendTrigger('fail');
		}
	}
}