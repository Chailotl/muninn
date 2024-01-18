const Node = require('../node.js');
const { exec } = require('child_process');
const logger = require('../logger');

module.exports = class ShellNode extends Node
{
	getDescription() { return 'This node will execute a shell command and return the output.'; };
	getDefaultConfig() { return { command: 'ls' }; }
	getInputs() { return ['trigger', 'command']; }
	getOutputs() { return ['output']; }

	onEvent(input, event)
	{
		let command = this.config.command;

		if (input == 'command')
		{
			if (this.expectString(event)) { return; }

			command = event.payload;
		}

		exec(command, (error, stdout, stderr) =>
		{
			if (error)
			{
				logger.error(`error: ${error.message}`);
				return;
			}
			else if (stderr)
			{
				logger.error(`stderr: ${stderr}`);
				return;
			}

			event.payload = stdout;
			this.sendEvent('output', event);
		});
	}
}