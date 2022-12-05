const Agent = require('./agent.js');
const crypto = require('crypto');

// Filter
// This only passes along events if there is a change from the previous event

module.exports = class ChecksumAgent extends Agent
{
	checksum = '';

	async receiveEvent(event)
	{
		var test = typeof event === 'object' ? JSON.stringify(event) : event;

		var hash = crypto.createHash('md5').update(test).digest('hex');
		if (hash != this.checksum)
		{
			this.sendEvent(event);
			this.sendSignal();
			this.checksum = hash;
		}
	}

	serialize()
	{
		var serial = super.serialize();

		serial.checksum = this.checksum;

		return serial;
	}

	deserialize(serial)
	{
		super.deserialize(serial);

		this.checksum = serial.checksum;
	}
}