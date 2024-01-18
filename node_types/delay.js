const Node = require('../node.js');

module.exports = class DelayNode extends Node
{
	getDescription() { return 'This node will delay events by the configured delay in seconds.'; };
	getDefaultConfig() { return { delay: 1 } }
	getInputs() { return ['input']; }
	getOutputs() { return ['output']; }

	onEvent(input, event)
	{
		setTimeout(() => this.sendEvent('output', event), this.config.delay * 1000);
	}
}