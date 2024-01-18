const Node = require('../node.js');
const logger = require('../logger');

module.exports = class LogNode extends Node
{
	getDescription() { return 'This node will log events it receives to the console.'; };
	getInputs() { return ['input']; }

	onEvent(input, event)
	{
		logger.debug(event);
	}
}