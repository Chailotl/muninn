const Node = require('../node.js');

module.exports = class RandomPayloadNode extends Node
{
	getDescription() { return 'This node will emit a random payload from the configured array when it receives a trigger. The payloads may be strings or JSON objects.'; };
	getDefaultConfig() { return { payloads: ['Apples', 'Pears'] }; }
	getInputs() { return ['trigger']; }
	getOutputs() { return ['output']; }

	onEvent(input, event)
	{
		event.payload = this.config.payloads[Math.floor(Math.random() * this.config.payloads.length)];
		this.sendEvent('output', event);
	}
}