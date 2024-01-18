const Node = require('../node.js');
const fs = require('fs');
const logger = require('../logger');

module.exports = class FileNode extends Node
{
	getDescription() { return 'This node will read the file located at the filepath and emit it as a string event. If it receives a string event at the filepath input, it will read that filepath instead.'; }
	getDefaultConfig() { return { filepath: '' }; }
	getInputs() { return ['trigger', 'filepath']; }
	getOutputs() { return ['output']; }

	onEvent(input, event)
	{
		let filepath = this.config.filepath;

		if (input == 'filepath')
		{
			if (this.expectString(event)) { return; }

			filepath = event.payload;
		}

		if (!fs.existsSync(filepath))
		{
			logger.warn(`Filepath "${filepath}" does not exist`);
			return;
		}

		event.payload = fs.readFileSync(filepath, 'utf-8');
		this.sendEvent('output', event);
	}
}