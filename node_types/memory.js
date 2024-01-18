const Node = require('../node.js');
const logger = require('../logger');

module.exports = class MemoryNode extends Node
{
	getDescription() { return 'This node will store events and emit them at a later time when triggered. If it is configured to forget, it will nullify the stored event when triggered.'; };
	getDefaultConfig() { return { forget: true }; }
	getDefaultPersistent() { return { event: null }; }
	getInputs() { return ['trigger', 'input']; }
	getOutputs() { return ['output']; }

	onEvent(input, event)
	{
		if (input == 'input')
		{
			this.persistent.event = event;
			this.save();
		}
		else
		{
			if (this.persistent.event == null)
			{
				logger.warn('No event to send');
				return;
			}

			this.sendEvent('output', this.persistent.event);

			if (this.config.forget)
			{
				this.persistent.event = null;
			}
		}
	}
}