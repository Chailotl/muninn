const Agent = require('./../agent.js');
const fs = require('fs');

// Emitter
// This agent reads files

module.exports = class FileAgent extends Agent
{
	getOptions() { return ['filepath']; }

	getTriggerInputs() { return ['trigger']; }

	getEventOutputs() { return ['output']; }

	onTrigger(input)
	{
		try
		{
			this.sendEvent('output', fs.readFileSync(this.options.filepath, 'utf-8'));
		}
		catch (e)
		{
			this.log(`Filepath "${this.options.filepath}" does not exist`);
		}
	}
}