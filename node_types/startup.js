const Node = require('../node.js');
const Event = require('../event.js');

module.exports = class StartupNode extends Node
{
	getDescription() { return 'This node will emit a trigger upon activation, typically upon Muninn starting up.'; };
	getOutputs() { return ['trigger']; }

	onActivate()
	{
		this.sendEvent('trigger', new Event(null));
	}
}