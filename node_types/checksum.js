const Node = require('../node.js');
const crypto = require('crypto');

module.exports = class ChecksumNode extends Node
{
	getDescription() { return 'This node will generate an md5 hash of any string or object events, and compares it to the stored checksums.'; }
	getDefaultConfig() { return { history: 1 }; }
	getDefaultPersistent() { return { checksums: [] }; }
	getInputs() { return ['input']; }
	getOutputs() { return ['change', 'no change']; }

	onEvent(input, event)
	{
		let payload = event.payload;
		let checksums = this.persistent.checksums;

		let test = typeof payload === 'object' ? JSON.stringify(payload) : payload;
		let hash = crypto.createHash('md5').update(test).digest('hex');

		if (!checksums.some(el => el == hash))
		{
			checksums.push(hash);
			while (checksums.length > this.config.history)
			{
				checksums.shift();
			}
			this.save();

			this.sendEvent('change', event);
		}
		else
		{
			this.sendEvent('no change', event);
		}
	}
}