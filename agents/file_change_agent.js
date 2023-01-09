const Agent = require('./../agent.js');
const fs = require('fs');

// Auto-emitter
// This agent watches for file changes
// The event property can either be change or rename

module.exports = class FileChangeAgent extends Agent
{
	getOptions() { return ['filepath']; }

	getTriggerOutputs() { return ['trigger']; }
	getEventOutputs() { return ['output']; }

	run()
	{
		try
		{
			fs.watch(this.options.filepath, (event, filename) =>
			{
				this.sendEvent('output', {
					event: event,
					filename: filename
				});

				this.sendTrigger('trigger');
			});
		}
		catch (e)
		{
			this.log(`Filepath "${this.options.filepath}" does not exist`);
		}
	}
}