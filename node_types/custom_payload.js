const Node = require('../node.js');

module.exports = class CustomPayloadNode extends Node
{
	getDescription() { return 'This node will emit the configured payload when it receives a trigger. The payload may be a string or a JSON object.'; };
	getDefaultConfig() { return { payload: 'Hello world' }; }
	getInputs() { return ['trigger']; }
	getOutputs() { return ['output']; }

	onEvent(input, event)
	{
		event.payload = this.config.payload;
		this.sendEvent('output', event);
	}
}