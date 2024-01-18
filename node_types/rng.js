const Node = require('../node.js');

module.exports = class RNGNode extends Node
{
	getDescription() { return 'This node will generate a random number between the minimum and maximum inclusively. When generating a float, the maximum is exclusive.'; };
	getDefaultConfig() { return { min: 0, max: 1, float: false }; }
	getInputs() { return ['trigger']; }
	getOutputs() { return ['output']; }

	onEvent(input, event)
	{
		let num;

		if (this.config.float)
		{
			num = Math.random() * (this.config.max - this.config.min) + this.config.min;
		}
		else
		{
			num = Math.floor(Math.random() * (this.config.max - this.config.min + 1)) + this.config.min
		}

		event.payload = num;
		this.sendEvent('output', event);
	}
}