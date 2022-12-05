const Agent = require('./agent.js');
const fs = require('fs');

// Emitter
// This agent reads files

module.exports = class FileAgent extends Agent
{
	constructor(name, options)
	{
		super(name, options ?? {
			filepath: ''
		});
	}

	receiveSignal()
	{
		try
		{
			this.sendEvent(fs.readFileSync(this.options.filepath, 'utf-8'));
		}
		catch (e)
		{
			log(`Filepath "${this.options.filepath}" does not exist`);
		}
	}
}