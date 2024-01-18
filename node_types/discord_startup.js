const Node = require('../node.js');
const Event = require('../event.js');
const { Events } = require('discord.js');

module.exports = class DiscordStartupNode extends Node
{
	getDescription() { return 'This node will emit a trigger when the Discord client logs in'; };
	getOutputs() { return ['trigger']; }

	onActivate()
	{
		let discord = global.services.discord;

		if (!discord)
		{
			logger.warn('No Discord token provided');
			return true;
		}

		discord.once(Events.ClientReady, c =>
		{
			this.sendEvent('trigger', new Event(null));
		});
	}
}