const Agent = require('./agent.js');
const fs = require('fs');

// Auto-emitter
// This agent watches for file changes
// The event property can either be change or rename

module.exports = class FileChangeAgent extends Agent
{
	constructor(name, options)
	{
		super(name, options ?? {
			filepath: ''
		});
	}

	run()
	{
		try
		{
			fs.watch(this.options.filepath, (event, filename) =>
			{
				this.sendEvent({
					event: event,
					filename: filename
				});

				this.sendSignal()
			});
		}
		catch (e)
		{
			this.log(`Filepath "${this.options.filepath}" does not exist`);
		}
	}
}