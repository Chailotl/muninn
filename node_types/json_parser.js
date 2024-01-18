const Node = require('../node.js');
const logger = require('../logger');

module.exports = class JsonParseNode extends Node
{
	getDescription() { return 'This node parses JSON from string events into object events.'; };
	getInputs() { return ['input']; }
	getOutputs() { return ['output']; }

	onEvent(input, event)
	{
		if (this.expectString(event)) { return; }

		try
		{
			event.payload = JSON.parse(event.payload);
			this.sendEvent('output', event);
		}
		catch (e)
		{
			logger.warn('Invalid JSON');
		}
	}
}