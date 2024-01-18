const Node = require('../node.js');

module.exports = class JsonStringifyNode extends Node
{
	getDescription() { return 'This node stringifies JSON from object events into string events.'; };
	getInputs() { return ['input']; }
	getOutputs() { return ['output']; }

	onEvent(input, event)
	{
		if (this.expectObject(event)) { return; }

		event.payload = JSON.stringify(event.payload);
		this.sendEvent('output', event);
	}
}