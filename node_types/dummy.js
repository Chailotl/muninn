const Node = require('../node.js');

module.exports = class DummyNode extends Node
{
	getDescription() { return 'This node will pass along any events it receives. Probably useful for organizing?'; };
	getInputs() { return ['input']; }
	getOutputs() { return ['output']; }

	onEvent(input, event)
	{
		this.sendEvent('output', event);
	}
}