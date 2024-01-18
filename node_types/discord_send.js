const Node = require('../node.js');

module.exports = class DiscordSendNode extends Node
{
	getDescription() { return 'This node will send Discord messages to the configured channel.'; };
	getDefaultConfig() { return { channelId: '', message: '' }; }
	getInputs() { return ['trigger', 'message']; }

	onEvent(input, event)
	{
		let discord = global.services.discord;

		if (!discord)
		{
			logger.warn('No Discord token provided');
			return true;
		}
		else if (!this.config.channelId)
		{
			logger.warn('No channel ID provided');
			return;
		}
		else if (!discord.isReady())
		{
			// If Discord client isn't ready yet, just delay the event a little
			setTimeout(() => this.onEvent(input, event), 1000);
			return;
		}

		let message = this.config.payload;

		if (input == 'message')
		{
			// Message can be either a string or an object (embed)
			message = event.payload;
		}

		discord.channels.fetch(this.config.channelId)
			.then(channel =>
			{
				channel.send(message);
			});
	}
}