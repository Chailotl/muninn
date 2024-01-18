const Node = require('../node.js');
const Event = require('../event.js');
const fs = require('fs');
const logger = require('../logger');

module.exports = class FileNode extends Node
{
	getDescription()
	{
		return `This node will watch for changes at the filepath and emit an object event. eventType can either be change or rename.

{
	eventType: "change",
	filename: "hello world.txt"
}`;
	}
	getDefaultConfig() { return { filepath: '' }; }
	getOutputs() { return ['output']; }

	onActivate()
	{
		let filepath = this.config.filepath;

		if (!fs.existsSync(filepath))
		{
			logger.warn(`Filepath "${filepath}" does not exist`);
			return;
		}

		this.watcher = fs.watch(this.config.filepath, (eventType, filename) =>
		{
			this.sendEvent('output', new Event({
				eventType: eventType,
				filename: filename
			}));
		});
	}

	onDeactivate()
	{
		if (this.watcher)
		{
			this.watcher.close();
		}
	}
}